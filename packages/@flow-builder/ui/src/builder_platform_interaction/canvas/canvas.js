import { Element, api, track } from 'engine';
import { CONNECTOR_OVERLAY, drawingLibInstance as lib} from 'builder_platform_interaction-drawing-lib';
import { SCALE_BOUNDS, getScaleAndDeltaValues, getOffsetValues } from './zoom-pan-utils';
import { CONNECTOR_TYPE } from 'builder_platform_interaction-connector-utils';
import { ELEMENT_TYPE, isCanvasElement } from 'builder_platform_interaction-element-config';
import { AddElementEvent, CANVAS_EVENT, ZOOM_ACTION, PAN_ACTION } from 'builder_platform_interaction-events';

/**
 * Canvas component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */

const KEYS = {
    BACKSPACE: 'Backspace',
    NEGATIVE: '-',
    ZERO: '0',
    ONE: '1',
    EQUAL: '=',
    SPACE: ' '
};

export default class Canvas extends Element {
    @api nodes = [];
    @api connectors = [];

    @track isPanModeOn = false;
    @track isZoomOutDisabled = false;
    @track isZoomInDisabled = true;
    @track isZoomToView = true;

    get hasCanvasElements() {
        return (this.nodes && this.nodes.length > 0);
    }

    canvasArea;
    innerCanvasArea;

    jsPlumbContainer = false;
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

    // TODO: Move it to a library
    isMultiSelect(event) {
        return event.shiftKey || event.metaKey;
    }

    constructor() {
        super();
        lib.setNewConnection(this.connectionAdded);
        lib.clickConnection(this.connectionClicked);
    }

    /**
     * Helper method to get the source, target, connector type and label of the new connection.
     * @param {object} connectorInfo - Contains all the information about the new connector
     * @return {object} connectorProperties - Contains the connector source, target, type and label
     */
    getConnectorProperties = (connectorInfo) => {
        const connectorProperties = {
            source: connectorInfo.sourceId,
            target: connectorInfo.targetId,
            type: CONNECTOR_TYPE.REGULAR

        };

        // TODO: This is a temporary fix and shall be refactored as a part of W-4962977
        const nodeLength = this.nodes.length;
        for (let i = 0; i < nodeLength; i++) {
            if (connectorInfo.sourceId === this.nodes[i].guid && this.nodes[i].elementType === ELEMENT_TYPE.START_ELEMENT) {
                connectorProperties.type = CONNECTOR_TYPE.START;
                break;
            }
        }

        if (connectorInfo.connection.getOverlay(CONNECTOR_OVERLAY.LABEL) && connectorInfo.connection.getOverlay(CONNECTOR_OVERLAY.LABEL).getLabel()) {
            connectorProperties.label = connectorInfo.connection.getOverlay(CONNECTOR_OVERLAY.LABEL).getLabel();
        }
        return connectorProperties;
    };

    /**
     * Method to set up any new connections made within the canvas.
     * @param {object} connectorInfo - Contains all the information about the new connector
     */
    connectionAdded = (connectorInfo) => {
        connectorInfo.connection.addOverlay(CONNECTOR_OVERLAY.ARROW);
        // Todo: Edit and enable the following code once work for connector selection is done (Decision outcomes etc.) - W-4962977
        // connectorInfo.connection.addOverlay(['Label', {id: CONNECTOR_OVERLAY.LABEL, label: 'Fault-Label', cssClass: 'fault-label'}]);
        const connectorProperties = this.getConnectorProperties(connectorInfo);
        const addConnectionEvent = new CustomEvent(CANVAS_EVENT.ADD_CONNECTION,
            {
                bubbles: true,
                composed: true,
                detail: connectorProperties
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
        if ((event.target.id === 'canvas' || event.target.id === 'innerCanvas')) {
            const canvasMouseUpEvent = new CustomEvent(CANVAS_EVENT.CANVAS_MOUSEUP, {
                bubbles: true,
                composed: true,
                cancelable: true
            });
            this.dispatchEvent(canvasMouseUpEvent);
        }
    };

    /**
     * Handling the trash click event coming from node.js
     * @param {object} event - canvas element delete event
     */
    handleCanvasElementDelete = (event) => {
        if (event && event.detail) {
            const selectedCanvasElementGUIDs = [event.detail.canvasElementGUID];

            const deleteEvent = new CustomEvent(CANVAS_EVENT.DELETE_ON_CANVAS, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    selectedCanvasElementGUIDs
                }
            });
            this.dispatchEvent(deleteEvent);
        }
    };

    /**
     * Handling key down event for canvas
     * @param {object} event - key down event
     */
    handleKeyDown = (event) => {
        if (this.hasCanvasElements) {
            if (event.key === KEYS.BACKSPACE && !this.isPanModeOn) {
                event.preventDefault();

                const deleteEvent = new CustomEvent(CANVAS_EVENT.DELETE_ON_CANVAS, {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    detail: {}
                });
                this.dispatchEvent(deleteEvent);
            } else if (event.metaKey && (event.key === KEYS.NEGATIVE || event.key === KEYS.ZERO || event.key === KEYS.ONE || event.key === KEYS.EQUAL)) {
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

        // TODO: utility method for offset math, needs to account for scrolling/panning/zooming
        const locationX = event.clientX - this.canvasArea.offsetLeft;
        const locationY = event.clientY - this.canvasArea.offsetTop;

        const addElementEvent = new AddElementEvent(elementType, locationX, locationY);
        this.dispatchEvent(addElementEvent);
    }

    renderedCallback() {
        if (!this.jsPlumbContainer) {
            this.canvasArea = this.template.querySelector('#canvas');
            this.innerCanvasArea = this.template.querySelector('#innerCanvas');
            lib.setContainer('innerCanvas');
            this.jsPlumbContainer = true;
        }
    }
}
