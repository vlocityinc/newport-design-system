import { LightningElement, api, track, unwrap } from "lwc";
import { drawingLibInstance as lib} from "builder_platform_interaction/drawingLib";
import { SCALE_BOUNDS, getScaleAndDeltaValues, getOffsetValues } from "./zoomPanUtils";
import { isCanvasElement } from "builder_platform_interaction/elementConfig";
import { AddElementEvent, DeleteElementEvent, CANVAS_EVENT, ZOOM_ACTION, PAN_ACTION } from "builder_platform_interaction/events";
import { KEYS } from "./keyConstants";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
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

export default class Canvas extends LightningElement {
    @api nodes = [];
    @api connectors = [];

    @track isPanModeOn = false;
    @track isZoomOutDisabled = false;
    @track isZoomInDisabled = true;
    @track isZoomToView = true;

    canvasArea;
    innerCanvasArea;

    isMouseDown = false;

    // Viewport variables used for zooming
    viewportWidth = 0;
    viewportHeight = 0;
    viewportCenterX = 0;
    viewportCenterY = 0;

    // Scaling variable used for zooming
    currentScale = 1.0;

    // Mouse position variables used for panning
    mouseDownX = 0;
    mouseDownY = 0;
    mouseMoveX = 0;
    mouseMoveY = 0;

    // Offset positions of the inner canvas on a given scale
    scaledCenterOffsetX = 0;
    scaledCenterOffsetY = 0;

    // Offset positions of the inner canvas on scale 1
    centerOffsetX = 0;
    centerOffsetY = 0;

    isMultiSelect(event) {
        return event.shiftKey || event.metaKey;
    }

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
        const addConnectionEvent = new CustomEvent(CANVAS_EVENT.ADD_CONNECTION,
            {
                bubbles: true,
                composed: true,
                detail: {
                    sourceGuid: connectorInfo.sourceId,
                    targetGuid: connectorInfo.targetId
                }
            }
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
        const isMultiSelectKeyPressed = this.isMultiSelect(event);
        const connectorSelectedEvent = new CustomEvent(CANVAS_EVENT.CONNECTOR_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                connectorGUID: connection.id,
                isMultiSelectKeyPressed
            }
        });

        this.dispatchEvent(connectorSelectedEvent);
    };

    /**
     * Helper method to zoom the canvas.
     * @param {String} action - Zoom action coming from handle key down or handle zoom
     */
    canvasZoom = (action) => {
        this.viewportWidth = this.canvasArea.clientWidth;
        this.viewportHeight = this.canvasArea.clientHeight;
        this.viewportCenterX = this.viewportWidth / 2;
        this.viewportCenterY = this.viewportHeight / 2;

        const viewportAndOffsetConfig = {
            viewportWidth: this.viewportWidth,
            viewportHeight: this.viewportHeight,
            viewportCenterX: this.viewportCenterX,
            viewportCenterY: this.viewportCenterY,
            centerOffsetX: this.centerOffsetX,
            centerOffsetY: this.centerOffsetY
        };

        // Calculating scale and delta values. Delta values tell how much the inner canvas center should move from it's
        // current location
        const scaleAndDeltaConfig = getScaleAndDeltaValues(action, this.currentScale, viewportAndOffsetConfig, this.nodes);

        if (scaleAndDeltaConfig.deltaX !== undefined && scaleAndDeltaConfig.deltaY !== undefined &&
            scaleAndDeltaConfig.newScale !== undefined) {
            // Calculating how much much the inner canvas needs to be away from the current viewport center.
            // This value would only change when zooming to fit
            const newOffsetX = this.centerOffsetX - scaleAndDeltaConfig.deltaX;
            const newOffsetY = this.centerOffsetY - scaleAndDeltaConfig.deltaY;

            // Updating the scale and left and top properties of the canvas
            this.innerCanvasArea.style.transform = 'scale(' + scaleAndDeltaConfig.newScale + ')';
            this.innerCanvasArea.style.left = -(newOffsetX * scaleAndDeltaConfig.newScale) + 'px';
            this.innerCanvasArea.style.top = -(newOffsetY * scaleAndDeltaConfig.newScale) + 'px';

            // Informing jsPlumb about the zoom level so that connectors are drawn on the new scale
            lib.setZoom(scaleAndDeltaConfig.newScale);

            this.centerOffsetX = newOffsetX;
            this.centerOffsetY = newOffsetY;
            this.currentScale = scaleAndDeltaConfig.newScale;

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
     * Method to handle zooming of the flow using the zoom panel.
     * @param {object} event - click to zoom event coming from zoom-panel.js
     */
    handleZoom = (event) => {
        if (event && event.detail.action) {
            this.canvasZoom(event.detail.action);
        }
    };

    /**
     * Helper method to toggle the pan mode.
     * @param {String} action - Pan action coming from handle key down or handleTogglePanMode
     */
    togglePan = (action) => {
        if (action === PAN_ACTION.PAN_ON) {
            // Enabling pan mode
            this.isPanModeOn = true;
            if (!this.isMouseDown) {
                this.canvasArea.style.cursor = '-webkit-grab';
            }
        } else if (action === PAN_ACTION.PAN_OFF) {
            // Disabling pan mode
            this.isPanModeOn = false;
            this.canvasArea.style.cursor = 'default';
        }
    };

    /**
     * Method to toggle the pan mode when clicking the pan button in the zoom-panel
     * @param {Object} event - toggle pan mode event coming from zoom-panel.js
     */
    handleTogglePanMode = (event) => {
        if (event && event.detail.action) {
            this.togglePan(event.detail.action);
        }
    };

    /**
     * Handling mouse enter event for overlay. If mouse is down while entering the overlay
     * then we need to set the entering coordinates as the mouseDown coordinates and get the scaled inner canvas offsets
     * so as to ensure that panning begins from the right spot.
     * @param {object} event - mouse enter event
     */
    handleOverlayMouseEnter = (event) => {
        event.preventDefault();
        // Checks if mouse is down while entering the overlay
        if (event.buttons === 1 || event.buttons === 3) {
            this.isMouseDown = true;
            this.canvasArea.style.cursor = '-webkit-grabbing';

            // Calculating mouse coordinates on mouse enter
            this.mouseDownX = event.clientX - this.canvasArea.offsetLeft;
            this.mouseDownY = event.clientY - this.canvasArea.offsetTop;

            // Getting the scaled offset values of the inner canvas
            this.scaledCenterOffsetX = this.innerCanvasArea.offsetLeft;
            this.scaledCenterOffsetY = this.innerCanvasArea.offsetTop;
        } else {
            this.canvasArea.style.cursor = '-webkit-grab';
        }
    };

    /**
     * Handling mouse leave event for overlay. Setting isMouseDown to false so that
     * panning doesn't continue when mouse enters the canvas again.
     * @param {object} event - mouse leave event
     */
    handleOverlayMouseLeave = (event) => {
        event.preventDefault();
        if (this.isMouseDown) {
            this.isMouseDown = false;
        }
        this.canvasArea.style.cursor = 'default';
    };

    /**
     * Handling mouse down event for overlay.
     * @param {object} event - mouse down event
     */
    handleOverlayMouseDown = (event) => {
        event.stopPropagation();
        this.isMouseDown = true;
        this.canvasArea.style.cursor = '-webkit-grabbing';

        // Calculating mouse coordinates on mouse down
        this.mouseDownX = event.clientX - this.canvasArea.offsetLeft;
        this.mouseDownY = event.clientY - this.canvasArea.offsetTop;

        // Getting the scaled offset values of the inner canvas
        this.scaledCenterOffsetX = this.innerCanvasArea.offsetLeft;
        this.scaledCenterOffsetY = this.innerCanvasArea.offsetTop;
    };

    /**
     * Handling mouse move event for overlay. If mouse is down while mouse move happens then we need to accordingly
     * pan the canvas.
     * @param {object} event - mouse move event
     */
    handleOverlayMouseMove = (event) => {
        event.stopPropagation();
        if (this.isMouseDown) {
            // Calculating mouse coordinates on mouse move
            this.mouseMoveX = event.clientX - this.canvasArea.offsetLeft;
            this.mouseMoveY = event.clientY - this.canvasArea.offsetTop;

            const panConfig = {
                scaledCenterOffsetX: this.scaledCenterOffsetX,
                scaledCenterOffsetY: this.scaledCenterOffsetY,
                mouseDownX: this.mouseDownX,
                mouseDownY: this.mouseDownY,
                mouseMoveX: this.mouseMoveX,
                mouseMoveY: this.mouseMoveY
            };

            // Getting the new offset values of the inner canvas
            const offsetConfig = getOffsetValues(panConfig);

            // Updating the left and top properties of the canvas. Also updating the center offset variables accordingly
            if (offsetConfig.offsetLeft !== undefined && offsetConfig.offsetTop !== undefined) {
                this.innerCanvasArea.style.left = offsetConfig.offsetLeft + 'px';
                this.innerCanvasArea.style.top = offsetConfig.offsetTop + 'px';

                this.centerOffsetX = -(offsetConfig.offsetLeft / this.currentScale);
                this.centerOffsetY = -(offsetConfig.offsetTop / this.currentScale);
            }
        }
    };

    /**
     * Handling mouse up event for overlay.
     * @param {object} event - mouse up event
     */
    handleOverlayMouseUp = (event) => {
        event.stopPropagation();
        this.isMouseDown = false;
        this.canvasArea.style.cursor = '-webkit-grab';
    };

    /**
     * Handling right click event for overlay.
     */
    handleOverlayContextMenu = () => {
        this.isMouseDown = false;
    };

    /**
     * Handling mouse enter event for canvas. Bringing the canvas in focus as mouse enters.
     * @param {object} event - mouse enter event
     */
    handleCanvasMouseEnter = (event) => {
        event.preventDefault();
        this.canvasArea.focus();
    };

    /**
     * Handling mouse leave event for canvas. Removing focus from canvas.
     * @param {object} event - mouse leave event
     */
    handleCanvasMouseLeave = (event) => {
        event.preventDefault();
        this.canvasArea.blur();
    };

    /**
     * Handling mouse up event for canvas. If mouse up happens directly on canvas/innerCanvas then marking the nodes
     * as unselected.
     * @param {object} event - mouse up event
     */
    handleCanvasMouseUp = (event) => {
        event.preventDefault();
        if (event.target && (event.target.classList.contains('canvas') || event.target.classList.contains('inner-canvas'))) {
            const canvasMouseUpEvent = new CustomEvent(CANVAS_EVENT.CANVAS_MOUSEUP, {
                bubbles: true,
                composed: true,
                cancelable: true
            });
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
        } else if ((event.metaKey || event.ctrlKey) && (event.key === KEYS.NEGATIVE || event.key === KEYS.ZERO || event.key === KEYS.ONE || event.key === KEYS.EQUAL)) {
            // Code block for zooming shortcuts
            event.preventDefault();
            if (event.key === KEYS.NEGATIVE) {
                this.canvasZoom(ZOOM_ACTION.ZOOM_OUT);
            } else if (event.key === KEYS.ZERO) {
                this.canvasZoom(ZOOM_ACTION.ZOOM_TO_FIT);
            } else if (event.key === KEYS.ONE) {
                this.canvasZoom(ZOOM_ACTION.ZOOM_TO_VIEW);
            } else if (event.key === KEYS.EQUAL) {
                this.canvasZoom(ZOOM_ACTION.ZOOM_IN);
            }
        } else if (event.key === KEYS.SPACE && !this.isPanModeOn) {
            // Code block for enabling panning mode
            event.preventDefault();
            this.togglePan(PAN_ACTION.PAN_ON);
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
            this.togglePan(PAN_ACTION.PAN_OFF);
        }
    };

    /**
     * Handler for when a draggable element is being dragged over the canvas.
     *
     * @param {Object} event drag over event
     */
    handleDragOver(event) {
        event.preventDefault();
        // NOTE: For security reasons, we don't have access to data in the dataTransfer object in
        // the drag over event. This prevents things like dom elements from other namespaces from
        // being able to see data they're not supposed to see.
        event.dataTransfer.dropEffect = 'copy';
    }

    /**
     * Handler for when a draggable element is dropped on the canvas.
     *
     * @param {Object} event drop event
     */
    handleDrop(event) {
        event.preventDefault();
        const elementType = event.dataTransfer.getData('text');
        if (!isCanvasElement(elementType)) {
            return;
        }

        const locationX = (event.clientX - this.innerCanvasArea.getBoundingClientRect().left) / this.currentScale;
        const locationY = (event.clientY - this.innerCanvasArea.getBoundingClientRect().top) / this.currentScale;

        const addElementEvent = new AddElementEvent(elementType, locationX, locationY);
        this.dispatchEvent(addElementEvent);
    }

    renderedCallback() {
        if (!lib.getContainer()) {
            this.canvasArea = this.template.querySelector(SELECTORS.CANVAS);
            this.innerCanvasArea = this.template.querySelector(SELECTORS.INNER_CANVAS);
            lib.setContainer(unwrap(this.innerCanvasArea));
        }
        const canvasElements = this.template.querySelectorAll('builder_platform_interaction-node');
        const connectors = this.template.querySelectorAll('builder_platform_interaction-connector');
        const canvasElementsLength = canvasElements.length;
        const connectorsLength = connectors.length;
        lib.setSuspendDrawing(true);
        for (let canvasElementIndex = 0; canvasElementIndex < canvasElementsLength; canvasElementIndex++) {
            const canvasElementContainerTemplate = canvasElements[canvasElementIndex];
            const dragStart = canvasElementContainerTemplate.dragStart;
            const dragStop = canvasElementContainerTemplate.dragStop;
            const drag = canvasElementContainerTemplate.drag;
            const canvasElementContainer = unwrap(canvasElementContainerTemplate).firstChild;
            if (!canvasElementContainer.getAttribute('id')) {
                canvasElementContainer.setAttribute('id', canvasElementContainerTemplate.node.guid);
            }
            const isSelected = canvasElementContainerTemplate.node.config.isSelected;
            const addToDragSelection = canvasElementContainerTemplate.node.config.addToDragSelection;
            const elementType = canvasElementContainerTemplate.node.elementType;

            if (elementType !== ELEMENT_TYPE.START_ELEMENT) {
                lib.setDraggable(canvasElementContainer, {
                    start : dragStart,
                    stop: dragStop,
                    drag
                });
                if (!lib.isTarget(canvasElementContainer)) {
                    lib.makeTarget(canvasElementContainer);
                }
            }

            if (!lib.isSource(canvasElementContainer)) {
                lib.makeSource(canvasElementContainer);
            }
            // All nodes can potentially support infinite outgoing connectors, but whether potential anchor points
            // are present is determined by hasAvailableConnections

            if (isSelected || addToDragSelection) {
                lib.addToDragSelection(canvasElementContainer);
            } else {
                lib.removeFromDragSelection(canvasElementContainer);
            }
        }
        for (let connectorIndex = 0; connectorIndex < connectorsLength; connectorIndex++) {
            const connector = connectors[connectorIndex].connector;
            let jsPlumbConnector = connectors[connectorIndex].getJsPlumbConnector();
            if (!jsPlumbConnector) {
                jsPlumbConnector = lib.setExistingConnections(connector.source, connector.target, connector.label, connector.guid, connector.type);
                connectors[connectorIndex].setJsPlumbConnector(jsPlumbConnector);
            } else if (connector.config.isSelected) {
                lib.selectConnector(jsPlumbConnector, connector.type);
            } else if (!connector.config.isSelected) {
                lib.deselectConnector(jsPlumbConnector, connector.type);
            }

            if (jsPlumbConnector && jsPlumbConnector.getLabel() !== connector.label) {
                jsPlumbConnector.setLabel(connector.label);
            }
        }
        lib.setSuspendDrawing(false, true);
        logPerfMarkEnd(canvas, {numOfNodes: this.nodes && this.nodes.length});
    }
}
