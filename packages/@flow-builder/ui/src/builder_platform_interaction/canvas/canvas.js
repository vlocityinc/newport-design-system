import { LightningElement, api, track } from "lwc";
import { drawingLibInstance as lib} from "builder_platform_interaction/drawingLib";
import { isMultiSelect, setupCanvasElements, setupConnectors } from "./canvasUtils";
import { SCALE_BOUNDS, getScaleAndOffsetValuesOnZoom, getOffsetValuesOnPan, getDistanceBetweenViewportCenterAndElement, isElementInViewport } from "./zoomPanUtils";
import { isCanvasElement } from "builder_platform_interaction/elementConfig";
import { AddElementEvent, DeleteElementEvent, CanvasMouseUpEvent, AddConnectionEvent, ConnectorSelectedEvent, ZOOM_ACTION, PAN_ACTION } from "builder_platform_interaction/events";
import { KEYS } from "./keyConstants";
import { logPerfMarkStart, logPerfMarkEnd } from "builder_platform_interaction/loggingUtils";

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
const CURSOR_STYLE_DEFAULT = 'default';

export default class Canvas extends LightningElement {
    @api nodes = [];
    @api connectors = [];

    @track isPanModeOn = false;
    @track isMarqueeModeOn = false;
    @track isZoomOutDisabled = false;
    @track isZoomInDisabled = true;
    @track isZoomToView = true;
    @track marqueeEndPoint = [0, 0];

    canvasArea;
    innerCanvasArea;

    // Scaling variable used for zooming
    currentScale = 1.0;

    // Variable to keep a track of when mouse is down on the canvas and pan mode is turned off
    shouldCreateMarqueeBox = false;

    // Mouse position variables used for marquee selection
    marqueeStartPoint = [0, 0];

    // Variable to keep a track of when mouse is down on the overlay
    isOverlayMouseDown = false;

    // Mouse position variables used for panning
    overlayMouseDownPoint = [0, 0];
    overlayMouseMovePoint = [0, 0];

    // Scaled offsetLeft and offsetTop values when mouse down happens for panning
    scaledOffsetsOnPanStart = [0, 0];

    constructor() {
        super();
        logPerfMarkStart(canvas);
        lib.setNewConnection(this.connectionAdded);
        lib.clickConnection(this.connectionClicked);
    }

    /**
     * Method to set up any new connections made within the canvas.
     * @param {object} connectorInfo - Contains all the information about the new connector
     */
    connectionAdded = (connectorInfo) => {
        const addConnectionEvent = new AddConnectionEvent(connectorInfo.sourceId, connectorInfo.targetId);
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
        const connectorSelectedEvent = new ConnectorSelectedEvent(connection.id, isMultiSelectKeyPressed);
        this.dispatchEvent(connectorSelectedEvent);
    };

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * Handling mouse enter event for canvas. If mouse enter happens from outside the canvas,
     * only init the marquee box with current mouse position when mouse is down.
     *
     * @param {object} event - mouse enter event
     */
    handleCanvasMouseEnter = (event) => {
         if (!this.isPanModeOn && (event.buttons === 1 || event.buttons === 3)) {
             this._initMarqueeBox(event);
         }
    };

    /**
     * Handling mouse leave event for canvas. If mouse leave happens on canvas, clear the marquee box.
     */
    handleCanvasMouseLeave = () => {
        if (this.isMarqueeModeOn) {
            this._clearMarqueeBox();
        }
    };

    /**
     * Handling mouse down event for canvas. If mouse down happens on canvas then init marquee box with current mouse position.
     *
     * @param {object} event - mouse down event
     */
    handleCanvasMouseDown = (event) => {
        if (!this.isPanModeOn) {
            this._initMarqueeBox(event);
        }
    };

    /**
     * Handling mouse move event for canvas. If mouse move happens on canvas,
     * only update marquee box end position with current mouse position when shouldCreateMarqueeBox.
     *
     * @param {object} event - mouse move event
     */
    handleCanvasMouseMove = (event) => {
        if (this.shouldCreateMarqueeBox) {
            this.marqueeEndPoint = this._getMousePoint(event);
            this.isMarqueeModeOn = true;
        }
    };

    /**
     * Handling mouse up event for canvas. If mouse up happens directly on canvas/innerCanvas then marking the nodes
     * as unselected, and clear the marquee box.
     * @param {object} event - mouse up event
     */
    handleCanvasMouseUp = (event) => {
        this._clearMarqueeBox();
        this.canvasArea.focus();
        if (event.target && (event.target.classList.contains('canvas') || event.target.classList.contains('inner-canvas'))) {
            const canvasMouseUpEvent = new CanvasMouseUpEvent();
            this.dispatchEvent(canvasMouseUpEvent);
        }
    };

    /**
     * Handling key down event for canvas
     * @param {object} event - key down event
     */
    handleKeyDown = (event) => {
        if ((event.key === KEYS.BACKSPACE || event.key === KEYS.DELETE) && !this.isPanModeOn) {
            event.preventDefault();
            const deleteEvent = new DeleteElementEvent();
            this.dispatchEvent(deleteEvent);
        } else if ((event.metaKey || event.ctrlKey) && (event.key === KEYS.NEGATIVE || event.key === KEYS.ZERO || event.key === KEYS.ONE || event.key === KEYS.EQUAL) && !this.isOverlayMouseDown && !this.shouldCreateMarqueeBox) {
            // Code block for zooming shortcuts
            event.preventDefault();
            if (event.key === KEYS.NEGATIVE) {
                this._canvasZoom(ZOOM_ACTION.ZOOM_OUT);
            } else if (event.key === KEYS.ZERO) {
                this._canvasZoom(ZOOM_ACTION.ZOOM_TO_FIT);
            } else if (event.key === KEYS.ONE) {
                this._canvasZoom(ZOOM_ACTION.ZOOM_TO_VIEW);
            } else if (event.key === KEYS.EQUAL) {
                this._canvasZoom(ZOOM_ACTION.ZOOM_IN);
            }
        } else if (event.key === KEYS.SPACE && !this.isPanModeOn && !this.shouldCreateMarqueeBox) {
            // Code block for enabling panning mode
            event.preventDefault();
            this._togglePan(PAN_ACTION.PAN_ON);
        }
    };

    /**
     * Handling key up event for canvas
     * @param {object} event - key up event
     */
    handleKeyUp = (event) => {
        if (event.key === KEYS.SPACE && this.isPanModeOn) {
            // Code block for disabling panning mode
            event.preventDefault();
            this.isOverlayMouseDown = false;
            this._togglePan(PAN_ACTION.PAN_OFF);
        }
    };

    /**
     * Handler for when a draggable element is being dragged over the canvas.
     *
     * @param {Object} event drag over event
     */
    handleDragOver = (event) => {
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
    handleDrop = (event) => {
        event.preventDefault();
        const elementType = event.dataTransfer.getData('text');
        if (!isCanvasElement(elementType)) {
            return;
        }

        const locationX = (event.clientX - this.innerCanvasArea.getBoundingClientRect().left) / this.currentScale;
        const locationY = (event.clientY - this.innerCanvasArea.getBoundingClientRect().top) / this.currentScale;

        const addElementEvent = new AddElementEvent(elementType, locationX, locationY);
        this.dispatchEvent(addElementEvent);
    };

    /**
     * Handling mouse enter event for overlay. If mouse is down while entering the overlay
     * then we need to set the entering coordinates as the mouseDown coordinates and get the scaled inner canvas offsets
     * so as to ensure that panning begins from the right spot.
     * @param {object} event - mouse enter event
     */
    handleOverlayMouseEnter = (event) => {
        event.stopPropagation();
        // Checks if mouse is down while entering the overlay
        if (event.buttons === 1 || event.buttons === 3) {
            this._handlePanStart(event);
        } else {
            this._updateCursorStyling(CURSOR_STYLE_GRAB);
        }
    };

    /**
     * Handling mouse leave event for overlay. Setting isOverlayMouseDown to false so that
     * panning doesn't continue when mouse enters the canvas again.
     * @param {object} event - mouse leave event
     */
    handleOverlayMouseLeave = (event) => {
        event.stopPropagation();
        if (this.isOverlayMouseDown) {
            this.isOverlayMouseDown = false;
        }
        this._updateCursorStyling();
    };

    /**
     * Handling mouse down event for overlay.
     * @param {object} event - mouse down event
     */
    handleOverlayMouseDown = (event) => {
        event.stopPropagation();
        this._handlePanStart(event);
    };

    /**
     * Handling mouse move event for overlay. If mouse is down while mouse move happens then we need to accordingly
     * pan the canvas.
     * @param {object} event - mouse move event
     */
    handleOverlayMouseMove = (event) => {
        event.stopPropagation();
        if (this.isOverlayMouseDown) {
            // Calculating mouse coordinates on mouse move
            this.overlayMouseMovePoint = this._getMousePoint(event);

            const panConfig = {
                scaledOffsetsOnPanStart: this.scaledOffsetsOnPanStart,
                mouseDownPoint: this.overlayMouseDownPoint,
                mouseMovePoint: this.overlayMouseMovePoint
            };

            // Getting the new offset values of the innerCanvas
            const { newScaledOffsetLeft, newScaledOffsetTop } = getOffsetValuesOnPan(panConfig);

            // Updating the left and top offsets of the innerCanvas.
            if (newScaledOffsetLeft !== undefined && newScaledOffsetTop !== undefined) {
                this._updateInnerCanvasPosition(newScaledOffsetLeft, newScaledOffsetTop);
            }
        }
    };

    /**
     * Handling mouse up event for overlay.
     * @param {object} event - mouse up event
     */
    handleOverlayMouseUp = (event) => {
        event.stopPropagation();
        this.isOverlayMouseDown = false;
        this._updateCursorStyling(CURSOR_STYLE_GRAB);
    };

    /**
     * Handling right click event for overlay.
     */
    handleOverlayContextMenu = () => {
        this.isOverlayMouseDown = false;
    };

    /**
     * Method to toggle the pan mode when clicking the pan button in the zoom-panel.
     * @param {Object} event - toggle pan mode event coming from zoom-panel.js
     */
    handleTogglePanMode = (event) => {
        if (event && event.detail.action) {
            this._togglePan(event.detail.action);
        }
    };

    /**
     * Method to handle zooming of the flow using the zoom panel.
     * @param {object} event - click to zoom event coming from zoom-panel.js
     */
    handleZoom = (event) => {
        if (event && event.detail.action) {
            this._canvasZoom(event.detail.action);
        }
    };

    /* ********************** */
    /*     Helper Methods     */
    /* ********************** */

    /**
     * Helper method to update the cursor styling.
     * @param {String} cursorStyle - new cursor style
     * @private
     */
    _updateCursorStyling = (cursorStyle = CURSOR_STYLE_DEFAULT) => {
        if (cursorStyle === CURSOR_STYLE_GRAB) {
            this.canvasArea.classList.remove('grabbing');
            this.canvasArea.classList.add('grab');
        } else if (cursorStyle === CURSOR_STYLE_GRABBING) {
            this.canvasArea.classList.remove('grab');
            this.canvasArea.classList.add('grabbing');
        } else if (cursorStyle === CURSOR_STYLE_CROSSHAIR) {
            this.canvasArea.classList.add('crosshair');
        } else {
            this.canvasArea.classList.remove('grab');
            this.canvasArea.classList.remove('grabbing');
            this.canvasArea.classList.remove('crosshair');
        }
    };

    /**
     * Helper method to get the location of the mouse pointer on the canvas.
     * @param {Object} event - event coming from _handlePanStart and handleOverlayMouseMove
     * @private
     */
    _getMousePoint = (event) => {
        const mousePointX = event && event.clientX - this.canvasArea.offsetLeft;
        const mousePointY = event && event.clientY - this.canvasArea.offsetTop;

        return [mousePointX, mousePointY];
    };

    /**
     * Init marquee box in canvas - set shouldCreateMarqueeBox to true, update cursor to 'crosshair' and set new starting position
     *
     * @param event
     */
    _initMarqueeBox = (event) => {
        this.shouldCreateMarqueeBox = true;
        this._updateCursorStyling(CURSOR_STYLE_CROSSHAIR);
        this.marqueeStartPoint = this._getMousePoint(event);
    };

    /**
     * Clear marquee box in canvas - reset shouldCreateMarqueeBox and isMarqueeModeOn to false and update cursor to default
     */
    _clearMarqueeBox = () => {
        this.shouldCreateMarqueeBox = false;
        this.isMarqueeModeOn = false;
        this._updateCursorStyling();
    };

    /**
     * Helper method to updated the offsets of the innerCanvas.
     * @param {Number} scaledOffsetLeft - left offset on a given scale
     * @param {Number} scaledOffsetTop - top offset on a given scale
     * @private
     */
    _updateInnerCanvasPosition = (scaledOffsetLeft = 0, scaledOffsetTop = 0) => {
        this.innerCanvasArea.style.left = scaledOffsetLeft + 'px';
        this.innerCanvasArea.style.top = scaledOffsetTop + 'px';
    };

    /**
     * Helper method to zoom the canvas.
     * @param {String} action - Zoom action coming from handleKeyDown or handleZoom
     * @private
     */
    _canvasZoom = (action) => {
        const viewportAndOffsetConfig = {
            viewportDimensions: [this.canvasArea.clientWidth, this.canvasArea.clientHeight],
            centerOffsets: [this.innerCanvasArea.offsetLeft / this.currentScale, this.innerCanvasArea.offsetTop / this.currentScale]
        };

        // Calculating new scale and offset values. Offset values tell how much the inner canvas needs to be away from the
        // current viewport center on a given scale.
        const { newScaledOffsetLeft, newScaledOffsetTop, newScale } = getScaleAndOffsetValuesOnZoom(action, this.currentScale, viewportAndOffsetConfig, this.nodes);

        if (newScaledOffsetLeft !== undefined && newScaledOffsetTop !== undefined && newScale !== undefined) {
            this.currentScale = newScale;

            // Informing jsPlumb about the zoom level so that connectors are drawn on the new scale
            lib.setZoom(newScale);

            // Updating the scale and left and top properties of the canvas
            this.innerCanvasArea.style.transform = `scale(${this.currentScale})`;
            this._updateInnerCanvasPosition(newScaledOffsetLeft, newScaledOffsetTop);

            // Disabling and enabling zoom panel buttons based on the current scale.
            // Note: We can't simply use this.currentScale <= 0.2 because 0.200000001 is treated by the browser as 0.2 at
            // which point the button should be disabled. Removing the first condition would mean that on a scale of 0.2000001,
            // the button won't get disabled unless the button is clicked again but clicking it again won't visually change
            // anything on the screen
            this.isZoomOutDisabled = (this.innerCanvasArea.style.transform === 'scale(0.2)' || this.currentScale < SCALE_BOUNDS.MIN_SCALE);
            this.isZoomToView = this.isZoomInDisabled = (this.innerCanvasArea.style.transform === 'scale(1)');

            if ((this.isZoomOutDisabled || this.isZoomInDisabled || action === ZOOM_ACTION.ZOOM_TO_FIT || action === ZOOM_ACTION.ZOOM_TO_VIEW) && document.activeElement !== this.canvasArea) {
                this.canvasArea.focus();
            }
        }
    };

    /**
     * Helper method to toggle the pan mode.
     * @param {String} action - Pan action coming from handleKeyDown or handleTogglePanMode
     * @private
     */
    _togglePan = (action) => {
        if (action === PAN_ACTION.PAN_ON) {
            // Enabling pan mode
            this.isPanModeOn = true;
            if (!this.isOverlayMouseDown) {
                this._updateCursorStyling(CURSOR_STYLE_GRAB);
            }
        } else if (action === PAN_ACTION.PAN_OFF) {
            // Disabling pan mode
            this.isPanModeOn = false;
            this._updateCursorStyling();
        }
    };

    /**
     * Helper method used for starting panning on canvas. It's called on mouse down on the overlay or when the user
     * enters the overlay with the mouse down.
     * @param event
     * @private
     */
    _handlePanStart = (event) => {
        this.isOverlayMouseDown = true;
        this._updateCursorStyling(CURSOR_STYLE_GRABBING);

        // Calculating mouse coordinates on mouse down
        this.overlayMouseDownPoint = this._getMousePoint(event);

        // Getting the scaled offset values of the inner canvas when mouse down happens
        this.scaledOffsetsOnPanStart = [this.innerCanvasArea.offsetLeft, this.innerCanvasArea.offsetTop];
    };

    /**
     * Public function to bring the element into the viewport if it's not already present in the viewport.
     *
     * @param {String} canvasElementGuid - Guid of the element that needs to be searched and highlighted
     */
    @api panElementToViewIfNeeded = (canvasElementGuid = '') => {
        const searchedElementArray = this.nodes.filter(node => node.guid === canvasElementGuid);

        if (searchedElementArray && searchedElementArray.length === 1) {
            const searchedElement = searchedElementArray[0];

            const viewportCenterPoint = [this.canvasArea.clientWidth / 2, this.canvasArea.clientHeight / 2];

            // Calculate the new innerCanvas offsets that will bring the searched canvas element into the center of the viewport
            const { newScaledOffsetLeft, newScaledOffsetTop } = getDistanceBetweenViewportCenterAndElement(viewportCenterPoint, searchedElement.locationX, searchedElement.locationY, this.currentScale);

            const panToViewConfig = {
                originalScaledCenterOffsets: [this.innerCanvasArea.offsetLeft, this.innerCanvasArea.offsetTop],
                newScaledCenterOffsets: [newScaledOffsetLeft, newScaledOffsetTop],
                viewportCenterPoint
            };

            // In the element is current not in the viewport, we need to update our offsets to the newly calculated
            // ones and bring the searched canvas element into the center of the viewport
            if (!isElementInViewport(panToViewConfig)) {
                this._updateInnerCanvasPosition(newScaledOffsetLeft, newScaledOffsetTop);
            }
        }
    };

    renderedCallback() {
        if (!lib.getContainer()) {
            this.canvasArea = this.template.querySelector(SELECTORS.CANVAS);
            this.innerCanvasArea = this.template.querySelector(SELECTORS.INNER_CANVAS);
            lib.setContainer(this.innerCanvasArea);
        }
        const canvasElements = this.template.querySelectorAll('builder_platform_interaction-node');
        const connectors = this.template.querySelectorAll('builder_platform_interaction-connector');

        lib.setSuspendDrawing(true);

        setupCanvasElements(canvasElements);
        setupConnectors(connectors);

        lib.setSuspendDrawing(false, true);
        lib.repaintEverything(); // This repaint is needed otherwise sometimes the connector is not updated while doing undo/redo.
        logPerfMarkEnd(canvas, {numOfNodes: this.nodes && this.nodes.length});
    }
}
