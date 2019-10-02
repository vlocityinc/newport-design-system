import { LightningElement, api, track } from 'lwc';
import { drawingLibInstance as lib } from 'builder_platform_interaction/drawingLib';
import {
    isMultiSelect,
    setupCanvasElements,
    setupConnectors
} from './canvasUtils';
import {
    SCALE_BOUNDS,
    getOffsetValuesOnPan,
    canDelete,
    canZoom,
    getScaleAndOffsetValuesOnZoom,
    getDistanceBetweenViewportCenterAndElement,
    isElementInViewport
} from './zoomPanUtils';
import { checkMarqueeSelection } from './marqueeSelectionLib';
import { isCanvasElement } from 'builder_platform_interaction/elementConfig';
import {
    AddElementEvent,
    DeleteElementEvent,
    CanvasMouseUpEvent,
    AddConnectionEvent,
    ConnectorSelectedEvent,
    MarqueeSelectEvent,
    ClickToZoomEvent,
    ZOOM_ACTION,
    MARQUEE_ACTION
} from 'builder_platform_interaction/events';
import {
    logPerfMarkStart,
    logPerfMarkEnd
} from 'builder_platform_interaction/loggingUtils';
import { ZoomInCommand, ZoomOutCommand, ZoomToFitCommand, ZoomToViewCommand, DeleteNodesCommand } from 'builder_platform_interaction/commands';
import { KeyboardInteractions } from 'builder_platform_interaction/keyboardInteractionUtils';

/**
 * Canvas component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */

const canvas = 'canvas';

const SELECTORS = {
    CANVAS: '.canvas',
    INNER_CANVAS: '.inner-canvas'
};

const CURSOR_STYLE_GRAB = 'grab';
const CURSOR_STYLE_GRABBING = 'grabbing';
const CURSOR_STYLE_CROSSHAIR = 'crosshair';

export default class Canvas extends LightningElement {
    @api
    nodes = [];

    @api
    connectors = [];

    @api
    showMarqueeButton = false;

    @api
    keyboardInteractions;

    @track
    isMarqueeModeOn = false;

    @track
    isMarqueeInProgress = false;

    @track
    marqueeEndPoint = [0, 0];

    @track
    isZoomOutDisabled = false;

    @track
    isZoomInDisabled = true;

    @track
    isZoomToView = true;

    canvasArea;
    innerCanvasArea;

    // Canvas area offset position
    canvasAreaOffsets = [0, 0];

    // Center of our canvas viewport ([canvasWidth / 2, canvasHeight / 2])
    viewportCenterPoint;

    // Map of canvas element guids to canvas element container
    canvasElementGuidToContainerMap = {};

    // Map of connector guids to jsPlumbConnetor instance
    jsPlumbConnectorMap = {};

    // Scaling variable used for zooming
    currentScale = 1.0;

    // Variable to keep a track of when mouse is down on the canvas
    isCanvasMouseDown = false;

    // Variable to keep a track of when panning is in progress
    isPanInProgress = false;

    // Variable to check if we need to pan the canvas as we enter it. This is set to true only when the user leaves the
    // canvas with isCanvasMouseDown being set to true
    shouldPanOnEnter = false;

    // Mouse position variables used for panning
    canvasMouseDownPoint = [0, 0];
    canvasMouseMovePoint = [0, 0];

    // Scaled offsetLeft and offsetTop values when mouse down happens for panning or marquee
    scaledOffsetsOnPanOrMarqueeStart = [0, 0];

    // Variable to keep a track of when mouse is down on the overlay
    isOverlayMouseDown = false;

    // Mouse position variables used for marquee selection
    marqueeStartPoint = [0, 0];

    constructor() {
        super();
        logPerfMarkStart(canvas);
        lib.setNewConnection(this.connectionAdded);
        lib.clickConnection(this.connectionClicked);
        this.keyboardInteractions = new KeyboardInteractions();
    }

    /**
     * Method to set up any new connections made within the canvas.
     * @param {object} connectorInfo - Contains all the information about the new connector
     */
    connectionAdded = connectorInfo => {
        const addConnectionEvent = new AddConnectionEvent(
            connectorInfo.sourceId,
            connectorInfo.targetId
        );
        this.dispatchEvent(addConnectionEvent);
    };

    /**
     * Fires connector selection event.
     * @param {object} connection - jsPlumb's connector object
     * @param {object} event - connection click event coming from drawing-lib.js
     */
    connectionClicked = (connection, event) => {
        event.stopPropagation();
        const isMultiSelectKeyPressed = isMultiSelect(event);
        const connectorSelectedEvent = new ConnectorSelectedEvent(
            connection.id,
            isMultiSelectKeyPressed
        );
        this.dispatchEvent(connectorSelectedEvent);
    };

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * Handling mouse enter event for canvas. If mouse is down while entering, initialize panning
     *
     * @param {object} event - mouse enter event
     */
    handleCanvasMouseEnter = event => {
        if (
            !this.isMarqueeModeOn &&
            (event.buttons === 1 || event.buttons === 3) &&
            this.shouldPanOnEnter
        ) {
            this._initPanStart(event);
        }
        this.shouldPanOnEnter = false;
    };

    /**
     * Handling mouse leave event for canvas. If mouse is down while leaving then reset panning variables
     */
    handleCanvasMouseLeave = () => {
        if (this.isCanvasMouseDown) {
            this.shouldPanOnEnter = true;
            this._resetPan();
        }
    };

    /**
     * Handling mouse down event for canvas. If mouse down happens on canvas then init panning with current mouse position.
     *
     * @param {object} event - mouse down event
     */
    handleCanvasMouseDown = event => {
        if (!this.isMarqueeModeOn) {
            this._initPanStart(event);
        }
    };

    /**
     * Handling mouse move event for canvas. Updating the offsets as the mouse moves to pan the canvas.
     *
     * @param {object} event - mouse move event
     */
    handleCanvasMouseMove = event => {
        if (this.isCanvasMouseDown) {
            this.isPanInProgress = true;

            // Calculating mouse coordinates on mouse move
            this.canvasMouseMovePoint = this._getMousePoint(event);

            const panConfig = {
                scaledOffsetsOnPanStart: this.scaledOffsetsOnPanOrMarqueeStart,
                mouseDownPoint: this.canvasMouseDownPoint,
                mouseMovePoint: this.canvasMouseMovePoint
            };

            // Getting the new offset values of the innerCanvas
            const {
                newScaledOffsetLeft,
                newScaledOffsetTop
            } = getOffsetValuesOnPan(panConfig);

            // Updating the left and top offsets of the innerCanvas.
            if (
                newScaledOffsetLeft !== undefined &&
                newScaledOffsetTop !== undefined
            ) {
                this._updateInnerCanvasPosition(
                    newScaledOffsetLeft,
                    newScaledOffsetTop
                );
            }
        }
    };

    /**
     * Handling mouse up event for canvas. If panning is not in progress and mouse up happens directly on canvas/innerCanvas
     * then dispatch the canvas mouse up event to deselect all the selected canvas elements and connectors. Also reset
     * the the panning variables.
     *
     * @param {object} event - mouse up event
     */
    handleCanvasMouseUp = event => {
        this.canvasArea.focus();

        // We need the this.isPanInProgress check here so that we don't deselect elements when the user ends panning
        if (
            !this.isPanInProgress &&
            event.target &&
            (event.target.classList.contains('canvas') ||
                event.target.classList.contains('inner-canvas'))
        ) {
            const canvasMouseUpEvent = new CanvasMouseUpEvent();
            this.dispatchEvent(canvasMouseUpEvent);
        }

        this._resetPan();
    };

    /**
     * Handling the context menu event and resetting the pan variables.
     */
    handleCanvasContextMenu = () => {
        this._resetPan();
    };

    /**
     * Handling delete Node commmand when delete or backspace buttons are pressed
     *
     * @param {object} event - key down event
     */
    handleDeleteNodes = () => {
        if (canDelete(this.isCanvasMouseDown, this.isMarqueeModeOn)) {
            // Code block for deletion of selected canvas elements and connectors. This should not happen when mouse is
            // down on the canvas or the marquee mode is turned on
            const deleteEvent = new DeleteElementEvent();
            this.dispatchEvent(deleteEvent);
        }
    };

    /**
     * Handler for when a draggable element is being dragged over the canvas.
     *
     * @param {Object} event drag over event
     */
    handleDragOver = event => {
        event.preventDefault();
        // NOTE: For security reasons, we don't have access to data in the dataTransfer object in
        // the drag over event. This prevents things like dom elements from other namespaces from
        // being able to see data they're not supposed to see.
        event.dataTransfer.dropEffect = 'copy';
    };

    /**
     * Handler for when a draggable element is dropped on the canvas.
     *
     * @param {Object} event drop event
     */
    handleDrop = event => {
        event.preventDefault();
        const elementType = event.dataTransfer.getData('text');
        if (!isCanvasElement(elementType)) {
            return;
        }

        const locationX =
            (event.clientX -
                this.innerCanvasArea.getBoundingClientRect().left) /
            this.currentScale;
        const locationY =
            (event.clientY - this.innerCanvasArea.getBoundingClientRect().top) /
            this.currentScale;

        const addElementEvent = new AddElementEvent(
            elementType,
            locationX,
            locationY
        );
        this.dispatchEvent(addElementEvent);
    };

    /**
     * Handling mouse enter event for overlay. If mouse is down while entering the overlay then start creating
     * the marquee box
     *
     * @param {object} event - mouse enter event
     */
    handleOverlayMouseEnter = event => {
        event.stopPropagation();
        if (event.buttons === 1 || event.buttons === 3) {
            this._initMarqueeBox(event);
        }
    };

    /**
     * Handling mouse leave event for overlay. Clear the marquee box and update the variables so that marquee selection
     * doesn't continue when mouse enters the canvas again.
     *
     * @param {object} event - mouse leave event
     */
    handleOverlayMouseLeave = event => {
        event.stopPropagation();
        if (this.isMarqueeInProgress) {
            this._clearMarqueeBox();
        }
    };

    /**
     * Handling mouse down event for overlay and initialize the marquee box.
     *
     * @param {object} event - mouse down event
     */
    handleOverlayMouseDown = event => {
        event.stopPropagation();
        this._initMarqueeBox(event);
    };

    /**
     * Handling mouse move event for overlay. If mouse is down while mouse move happens then create the marquee box.
     *
     * @param {object} event - mouse move event
     */
    handleOverlayMouseMove = event => {
        event.stopPropagation();
        if (this.isOverlayMouseDown) {
            this.marqueeEndPoint = this._getMousePoint(event);
            this.isMarqueeInProgress = true;

            const marqueeConfig = {
                scaledOffsetsOnMarqueeStart: this
                    .scaledOffsetsOnPanOrMarqueeStart,
                marqueeStartPoint: this.marqueeStartPoint,
                marqueeEndPoint: this.marqueeEndPoint
            };

            // Check the marquee selection elements and update their selected state if in the list
            const {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                connectorGuidsToSelect,
                connectorGuidsToDeselect
            } = checkMarqueeSelection(
                this.nodes,
                this.connectors,
                this.currentScale,
                marqueeConfig,
                this.viewportCenterPoint
            );
            if (
                canvasElementGuidsToSelect.length !== 0 ||
                canvasElementGuidsToDeselect.length !== 0 ||
                connectorGuidsToSelect.length !== 0 ||
                connectorGuidsToDeselect.length !== 0
            ) {
                const marqueeSelectEvent = new MarqueeSelectEvent(
                    canvasElementGuidsToSelect,
                    canvasElementGuidsToDeselect,
                    connectorGuidsToSelect,
                    connectorGuidsToDeselect
                );
                this.dispatchEvent(marqueeSelectEvent);
            }
        }
    };

    /**
     * Handling mouse up event for overlay. Clear the marquee box and update the variables accordingly.
     *
     * @param {object} event - mouse up event
     */
    handleOverlayMouseUp = event => {
        event.stopPropagation();
        this._clearMarqueeBox();
    };

    /**
     * Handling context menu event for overlay and clearing the marquee box.
     *
     * @param {object} event - context menu event
     */
    handleOverlayContextMenu = event => {
        event.stopPropagation();
        this._clearMarqueeBox();
    };

    /**
     * Handling the toggleMarqueeOn event to turn on the marquee mode.
     */
    handleMarqueeOn = () => {
        this._toggleMarqueeMode(MARQUEE_ACTION.MARQUEE_ON);
    };

    /**
     * Method to handle zooming of the flow using the zoom panel.
     *
     * @param {object} event - click to zoom event coming from zoom-panel.js
     */
    handleZoom = event => {
        if (
            event &&
            event.detail.action &&
            canZoom(event, this.isCanvasMouseDown, this.isMarqueeInProgress)
        ) {
            this._canvasZoom(event.detail.action);
        }
    };

    /* ********************** */
    /*     Helper Methods     */
    /* ********************** */

    /**
     * Helper method to update the cursor styling.
     *
     * @param {String} cursorStyle - new cursor style
     * @private
     */
    _updateCursorStyling = cursorStyle => {
        if (cursorStyle === CURSOR_STYLE_GRAB) {
            this.canvasArea.classList.remove('grabbing', 'crosshair');
            this.canvasArea.classList.add('grab');
        } else if (cursorStyle === CURSOR_STYLE_GRABBING) {
            this.canvasArea.classList.remove('grab', 'crosshair');
            this.canvasArea.classList.add('grabbing');
        } else if (cursorStyle === CURSOR_STYLE_CROSSHAIR) {
            this.canvasArea.classList.remove('grab', 'grabbing');
            this.canvasArea.classList.add('crosshair');
        }
    };

    /**
     * Helper method to get the location of the mouse pointer on the canvas.
     *
     * @param {Object} event - event coming from handleCanvasMouseMove, handleOverlayMouseMove, _initPanStart and _initMarqueeBox
     * @private
     */
    _getMousePoint = event => {
        const mousePointX = event && event.clientX - this.canvasAreaOffsets[0];
        const mousePointY = event && event.clientY - this.canvasAreaOffsets[1];

        return [mousePointX, mousePointY];
    };

    /**
     * Helper method to get the width, height and center of the canvas viewport
     *
     * @return {Object} Returns an object containing the width, height and center of the canvas viewport
     * @private
     */
    _getViewportDimensions = () => {
        if (
            this.canvasArea.clientWidth === undefined ||
            this.canvasArea.clientWidth < 0
        ) {
            throw new Error(
                'Canvas width is either undefined or < 0. It must be defined.'
            );
        }

        if (
            this.canvasArea.clientHeight === undefined ||
            this.canvasArea.clientHeight < 0
        ) {
            throw new Error(
                'Canvas height is either undefined or < 0. It must be defined.'
            );
        }

        const viewportWidth = this.canvasArea.clientWidth;
        const viewportHeight = this.canvasArea.clientHeight;
        const viewportCenterPoint = [viewportWidth / 2, viewportHeight / 2];

        return { viewportWidth, viewportHeight, viewportCenterPoint };
    };

    /**
     * Helper function to return the scaled inner canvas center offsets
     *
     * @return {Number[]} Returns an array containing the scaled inner canvas center offsets
     * @private
     */
    _getScaledInnerCanvasCenterOffsets = () => {
        return [
            this.innerCanvasArea.offsetLeft,
            this.innerCanvasArea.offsetTop
        ];
    };

    /**
     * Helper method used for initializing panning on canvas.
     *
     * @param {Object} event - event coming from handleCanvasMouseEnter and handleCanvasMouseDown
     * @private
     */
    _initPanStart = event => {
        this.isCanvasMouseDown = true;
        this._updateCursorStyling(CURSOR_STYLE_GRABBING);

        // Calculating mouse coordinates on mouse down
        this.canvasMouseDownPoint = this._getMousePoint(event);

        // Getting the scaled offset values of the inner canvas when mouse down happens
        this.scaledOffsetsOnPanOrMarqueeStart = this._getScaledInnerCanvasCenterOffsets();
    };

    /**
     * Helper method to reset the panning variables (isCanvasMouseDown and isPanInProgress) and updating the cursor style.
     * This is called from handleCanvasMouseLeave, handleCanvasMouseUp and handleCanvasContextMenu.
     *
     * @private
     */
    _resetPan = () => {
        this.isCanvasMouseDown = false;
        this.isPanInProgress = false;
        this._updateCursorStyling(CURSOR_STYLE_GRAB);
    };

    /**
     * Helper method to toggle the marquee mode.
     *
     * @param {String} action - Marquee action coming from handleMarqueeOn or _clearMarqueeBox
     * @private
     */
    _toggleMarqueeMode = action => {
        if (action === MARQUEE_ACTION.MARQUEE_ON) {
            // Enabling marquee mode
            this.isMarqueeModeOn = true;
            this._updateCursorStyling(CURSOR_STYLE_CROSSHAIR);
        } else if (action === MARQUEE_ACTION.MARQUEE_OFF) {
            // Disabling marquee mode
            this.isMarqueeModeOn = false;
            this._updateCursorStyling(CURSOR_STYLE_GRAB);
        }
    };

    /**
     * Init marquee box in canvas - set isOverlayMouseDown to true, update cursor styling, calculate the viewport center
     * point, calculate scaledOffsetsOnPanOrMarqueeStart and get the marquee start point.
     *
     * @param {Object} event - event coming from handleOverlayMouseEnter and handleOverlayMouseDown
     * @private
     */
    _initMarqueeBox = event => {
        this.isOverlayMouseDown = true;
        this._updateCursorStyling(CURSOR_STYLE_CROSSHAIR);
        const { viewportCenterPoint } = this._getViewportDimensions();
        this.viewportCenterPoint = viewportCenterPoint;
        this.scaledOffsetsOnPanOrMarqueeStart = this._getScaledInnerCanvasCenterOffsets();
        this.marqueeStartPoint = this._getMousePoint(event);
    };

    /**
     * Clear marquee box in canvas - set isOverlayMouseDown and isMarqueeInProgress to false and toggle the marquee
     * mode off
     *
     * @private
     */
    _clearMarqueeBox = () => {
        this.isOverlayMouseDown = false;
        this.isMarqueeInProgress = false;
        this._toggleMarqueeMode(MARQUEE_ACTION.MARQUEE_OFF);
    };

    /**
     * Helper method to updated the offsets of the innerCanvas.
     *
     * @param {Number} scaledOffsetLeft - left offset on a given scale
     * @param {Number} scaledOffsetTop - top offset on a given scale
     * @private
     */
    _updateInnerCanvasPosition = (
        scaledOffsetLeft = 0,
        scaledOffsetTop = 0
    ) => {
        this.innerCanvasArea.style.left = scaledOffsetLeft + 'px';
        this.innerCanvasArea.style.top = scaledOffsetTop + 'px';
    };

    /**
     * Helper method to zoom the canvas.
     *
     * @param {String} action - Zoom action coming from handleZoom
     * @private
     */
    _canvasZoom = action => {
        const viewportAndOffsetConfig = {
            viewportDimensions: this._getViewportDimensions(),
            centerOffsets: [
                this.innerCanvasArea.offsetLeft / this.currentScale,
                this.innerCanvasArea.offsetTop / this.currentScale
            ]
        };

        // Calculating new scale and offset values. Offset values tell how much the inner canvas needs to be away from the
        // current viewport center on a given scale.
        const {
            newScaledOffsetLeft,
            newScaledOffsetTop,
            newScale
        } = getScaleAndOffsetValuesOnZoom(
            action,
            this.currentScale,
            viewportAndOffsetConfig,
            this.nodes
        );

        if (
            newScaledOffsetLeft !== undefined &&
            newScaledOffsetTop !== undefined &&
            newScale !== undefined
        ) {
            this.currentScale = newScale;

            // Informing jsPlumb about the zoom level so that connectors are drawn on the new scale
            lib.setZoom(this.currentScale);

            // Updating the scale and left and top properties of the canvas
            this.innerCanvasArea.style.transform = `scale(${this.currentScale})`;
            this._updateInnerCanvasPosition(
                newScaledOffsetLeft,
                newScaledOffsetTop
            );

            // Disabling and enabling zoom panel buttons based on the current scale.
            // Note: We can't simply use this.currentScale <= 0.2 because 0.200000001 is treated by the browser as 0.2 at
            // which point the button should be disabled. Removing the first condition would mean that on a scale of 0.2000001,
            // the button won't get disabled unless the button is clicked again but clicking it again won't visually change
            // anything on the screen
            this.isZoomOutDisabled =
                this.innerCanvasArea.style.transform === 'scale(0.2)' ||
                this.currentScale < SCALE_BOUNDS.MIN_SCALE;
            this.isZoomToView = this.isZoomInDisabled =
                this.innerCanvasArea.style.transform === 'scale(1)';

            if (
                (this.isZoomOutDisabled ||
                    this.isZoomInDisabled ||
                    action === ZOOM_ACTION.ZOOM_TO_FIT ||
                    action === ZOOM_ACTION.ZOOM_TO_VIEW) &&
                document.activeElement !== this.canvasArea
            ) {
                this.canvasArea.focus();
            }
        }
    };

    /**
     * Helper method to set up the canvas elements and connectors
     */
    _setupCanvasElementsAndConnectors = () => {
        const canvasElements = this.template.querySelectorAll(
            'builder_platform_interaction-node'
        );

        this.canvasElementGuidToContainerMap = setupCanvasElements(
            canvasElements
        );

        this.jsPlumbConnectorMap = setupConnectors(
            this.connectors,
            this.jsPlumbConnectorMap,
            this.canvasElementGuidToContainerMap
        );
    };

    /**
     * Public function to access the canvas element container. This is used in deletion of elements
     *
     * @param {String} guid - Guid of the canvas element for which we need the container
     * @returns {Object} Returns the canvasElementContainer associated with a given guid
     */
    @api
    getCanvasElementContainer(guid) {
        return this.canvasElementGuidToContainerMap[guid];
    }

    /**
     * Public function to access the jsPlumbConnector. This is used in deletion of connector from drawingLib.
     *
     * @param {String} guid - Guid of the connector for which we need the container
     * @returns {Object} Returns the jsPlumbConnector associated with a given guid
     */
    @api
    getJsPlumbConnectorFromMap(guid) {
        return this.jsPlumbConnectorMap[guid];
    }

    /**
     * Public function to delete the jsPlumbConnector from the map.
     *
     * @param {String} guid - Guid for which we need for the deletion of jsPlumbConnector from the map
     */
    @api
    deleteJsPlumbConnectorFromMap(guid) {
        delete this.jsPlumbConnectorMap[guid];
    }

    /**
     * Public function to bring the element into the viewport if it's not already present in the viewport.
     *
     * @param {String} canvasElementGuid - Guid of the element that needs to be searched and highlighted
     */
    @api
    panElementToViewIfNeeded = (canvasElementGuid = '') => {
        const searchedElementArray = this.nodes.filter(
            node => node.guid === canvasElementGuid
        );

        if (searchedElementArray && searchedElementArray.length === 1) {
            const searchedElement = searchedElementArray[0];

            const { viewportCenterPoint } = this._getViewportDimensions();
            this.viewportCenterPoint = viewportCenterPoint;

            // Calculate the new innerCanvas offsets that will bring the searched canvas element into the center of the viewport
            const {
                newScaledOffsetLeft,
                newScaledOffsetTop
            } = getDistanceBetweenViewportCenterAndElement(
                this.viewportCenterPoint,
                searchedElement.locationX,
                searchedElement.locationY,
                this.currentScale
            );

            const panToViewConfig = {
                originalScaledCenterOffsets: this._getScaledInnerCanvasCenterOffsets(),
                newScaledCenterOffsets: [
                    newScaledOffsetLeft,
                    newScaledOffsetTop
                ],
                viewportCenterPoint: this.viewportCenterPoint
            };

            // In the element is current not in the viewport, we need to update our offsets to the newly calculated
            // ones and bring the searched canvas element into the center of the viewport
            if (!isElementInViewport(panToViewConfig)) {
                this._updateInnerCanvasPosition(
                    newScaledOffsetLeft,
                    newScaledOffsetTop
                );
            }
        }
    };

    setupCommandsAndShortcuts = () => {
        // Delete Nodes Command
        const deleteNodesCommand = new DeleteNodesCommand(event =>
            this.handleDeleteNodes(event)
        );
        this.keyboardInteractions.setupCommandAndShortcut(deleteNodesCommand, {
            key: 'Delete'
        });
        this.keyboardInteractions.setupCommandAndShortcut(deleteNodesCommand, {
            key: 'Backspace'
        });

        // Zoom In Command
        const zoomInCommand = new ZoomInCommand(() =>
            this.handleZoom(new ClickToZoomEvent(ZOOM_ACTION.ZOOM_IN))
        );
        this.keyboardInteractions.setupCommandAndShortcut(zoomInCommand, {
            ctrlOrCmd: true,
            key: '='
        });

        // Zoom Out Command
        const zoomOutCommand = new ZoomOutCommand(() =>
            this.handleZoom(new ClickToZoomEvent(ZOOM_ACTION.ZOOM_OUT))
        );
        this.keyboardInteractions.setupCommandAndShortcut(zoomOutCommand, {
            ctrlOrCmd: true,
            key: '-'
        });

        // Zoom To Fit Command
        const zoomToFitCommand = new ZoomToFitCommand(() =>
            this.handleZoom(new ClickToZoomEvent(ZOOM_ACTION.ZOOM_TO_FIT))
        );
        this.keyboardInteractions.setupCommandAndShortcut(zoomToFitCommand, {
            ctrlOrCmd: true,
            key: '0'
        });

        // Zoom To View Command
        const zoomToViewCommand = new ZoomToViewCommand(() =>
            this.handleZoom(new ClickToZoomEvent(ZOOM_ACTION.ZOOM_TO_VIEW))
        );
        this.keyboardInteractions.setupCommandAndShortcut(zoomToViewCommand, {
            ctrlOrCmd: true,
            key: '1'
        });
      }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }

    renderedCallback() {
        if (!lib.getContainer()) {
            this.canvasArea = this.template.querySelector(SELECTORS.CANVAS);
            this.innerCanvasArea = this.template.querySelector(
                SELECTORS.INNER_CANVAS
            );
            lib.setContainer(this.innerCanvasArea);
            this.canvasAreaOffsets = [
                this.canvasArea.offsetLeft,
                this.canvasArea.offsetTop
            ];

            // Only suspend drawing before performing the bulk operation like loading data on page load
            lib.setSuspendDrawing(true);
            this._setupCanvasElementsAndConnectors();
            lib.setSuspendDrawing(false, true);
        } else {
            this._setupCanvasElementsAndConnectors();
        }

        logPerfMarkEnd(canvas, { numOfNodes: this.nodes && this.nodes.length });
    }
}
