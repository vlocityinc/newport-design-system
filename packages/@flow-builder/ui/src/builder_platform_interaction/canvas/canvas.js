import { Element, api, track } from 'engine';
import { CONNECTOR_OVERLAY, drawingLibInstance as lib} from 'builder_platform_interaction-drawing-lib';
import { SCALE_BOUNDS, getScaleAndDeltaValues } from './zoom-pan-utils';
import { CONNECTOR_TYPE } from 'builder_platform_interaction-connector-utils';
import { isCanvasElement } from 'builder_platform_interaction-element-config';
import { AddElementEvent, CANVAS_EVENT, ZOOM_ACTION, PAN_ACTION } from 'builder_platform_interaction-events';

/**
 * Canvas component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */

export default class Canvas extends Element {
    @api nodes = [];
    @api connectors = [];

    @track panVariant = 'neutral';
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
    viewportCenterX = 0;
    viewportCenterY = 0;
    viewportWidth = 0;
    viewportHeight = 0;

    // Scaling variable used for zooming
    currentScale = 1.0;

    // Variables used for calculating how much the inner canvas center should be away from the viewport center
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
     * Method to set up any new connections made within the canvas.
     * @param {object} connectorInfo - Contains all the information about the new connector
     */
    connectionAdded = (connectorInfo) => {
        connectorInfo.connection.getOverlay(CONNECTOR_OVERLAY.ARROW).setVisible(true);
        connectorInfo.connection.getOverlay(CONNECTOR_OVERLAY.LABEL).setVisible(true);
        connectorInfo.connection.getOverlay(CONNECTOR_OVERLAY.LABEL).setLabel('Label');
        const addConnectionEvent = new CustomEvent(CANVAS_EVENT.ADD_CONNECTION,
            {
                bubbles: true,
                composed: true,
                detail: {
                    source: connectorInfo.sourceId,
                    target: connectorInfo.targetId,
                    label: connectorInfo.connection.getOverlay(CONNECTOR_OVERLAY.LABEL).getLabel(),
                    type: CONNECTOR_TYPE.REGULAR
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
     * Method to toggle the pan mode when clicking the pan button in the zoom-panel
     * @param {Object} event - toggle pan mode event coming from zoom-panel.js
     */
    togglePanMode = (event) => {
        if (event && event.action) {
            if (event.action === PAN_ACTION.PAN_ON) {
                this.panVariant = 'brand';
                this.isPanModeOn = true;
                this.canvasArea.style.cursor = '-webkit-grab';
            } else if (event.action === PAN_ACTION.PAN_OFF) {
                this.panVariant = 'neutral';
                this.isPanModeOn = false;
                this.canvasArea.style.cursor = 'default';
            }
        }
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

        // Getting the new zoom level and delta values based on the action
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
        if (event && event.action) {
            this.canvasZoom(event.action);
        }
    };

    /**
     * Handling mouse down event for canvas.
     * @param {object} event - mouse down event
     */
    handleMouseDown = (event) => {
        event.preventDefault();
        this.isMouseDown = true;
    };

    /**
     * Handling mouse move event for canvas.
     * @param {object} event - mouse move event
     */
    handleMouseMove = (event) => {
        event.preventDefault();
    };

    handleOverlayMouseUp = (event) => {
        event.stopPropagation();
    };

    /**
     * Handling mouse up event for canvas. If mouse up happens directly on canvas/innerCanvas then marking the nodes
     * as unselected. Also checking the isCanvasInFocus and isPanning condition to prevent nodes from deselecting when
     * the user clicks outside canvas or stops panning.
     * @param {object} event - mouse up event
     */
    handleCanvasMouseUp = (event) => {
        event.preventDefault();
        this.isMouseDown = false;
        this.canvasArea.focus();
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
     * Handling right click event for canvas.
     */
    handleContextMenu = () => {
        this.isMouseDown = false;
    };

    /**
     * Helper method to update connectorGUIDs and canvasElementsToUpdate arrays
     * @param {Array} selectedCanvasElementGUIDs - Contains GUIDs of all the selected canvas elements
     * @param {Array} connectorGUIDs - Contains GUIDs of all the connectors that need to be deleted
     * @param {Array} canvasElementsToUpdate - Contains GUIDs of all the canvas elements that need to be updated
     * @param {Object} connector - A single connector object
     */
    updateCanvasAndConnectorArray = (selectedCanvasElementGUIDs, connectorGUIDs, canvasElementsToUpdate, connector) => {
        if (selectedCanvasElementGUIDs.indexOf(connector.target) !== -1) {
            canvasElementsToUpdate.push(connector.source);
            connectorGUIDs.push(connector.guid);
        } else if (selectedCanvasElementGUIDs.indexOf(connector.source) !== -1) {
            connectorGUIDs.push(connector.guid);
        }
    };

    /**
     * Handling the trash click event coming from node.js
     * @param {object} event - canvas element delete event
     */
    handleCanvasElementDelete = (event) => {
        if (event && event.detail) {
            const selectedCanvasElementGUIDs = [event.detail.canvasElementGUID];
            const connectorGUIDs = [];
            const canvasElementsToUpdate = [];

            // Pushing all the selected and associated connectors to connectorGUIDs and pushing all affected canvas
            // elements to canvasElementsToUpdate to update their connector count
            this.connectors.map((connector) => {
                this.updateCanvasAndConnectorArray(selectedCanvasElementGUIDs, connectorGUIDs, canvasElementsToUpdate, connector);
                return connector;
            });

            const deleteEvent = new CustomEvent(CANVAS_EVENT.DELETE_ON_CANVAS, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    selectedCanvasElementGUIDs,
                    connectorGUIDs,
                    canvasElementsToUpdate
                }
            });
            this.dispatchEvent(deleteEvent);
        }
    };

    /**
     * Handling key down event for canvas and deleting selected nodes from the canvas if delete key is pressed.
     * @param {object} event - key down event
     */
    handleKeyDown = (event) => {
        if (event.key === 'Backspace' && !this.isPanModeOn) {
            event.preventDefault();
            const selectedCanvasElementGUIDs = [];
            const connectorGUIDs = [];
            const canvasElementsToUpdate = [];

            // Pushing all the selected canvas elements to selectedCanvasElementGUIDs
            this.nodes.map((node) => {
                if (node.config.isSelected) {
                    selectedCanvasElementGUIDs.push(node.guid);
                }
                return node;
            });

            // Pushing all the selected and associated connectors to connectorGUIDs and pushing all affected canvas
            // elements to canvasElementsToUpdate to update their connector count
            this.connectors.map((connector) => {
                if (connector.config.isSelected) {
                    connectorGUIDs.push(connector.guid);
                    canvasElementsToUpdate.push(connector.source);
                } else {
                    this.updateCanvasAndConnectorArray(selectedCanvasElementGUIDs, connectorGUIDs, canvasElementsToUpdate, connector);
                }
                return connector;
            });

            const deleteEvent = new CustomEvent(CANVAS_EVENT.DELETE_ON_CANVAS, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    selectedCanvasElementGUIDs,
                    connectorGUIDs,
                    canvasElementsToUpdate
                }
            });
            this.dispatchEvent(deleteEvent);
        } else if (event.metaKey && (event.key === '-' || event.key === '0' || event.key === '1' || event.key === '=')) {
            event.preventDefault();
            if (event.key === '-') {
                this.canvasZoom(ZOOM_ACTION.ZOOM_OUT);
            } else if (event.key === '0') {
                this.canvasZoom(ZOOM_ACTION.ZOOM_TO_FIT);
            } else if (event.key === '1') {
                this.canvasZoom(ZOOM_ACTION.ZOOM_TO_VIEW);
            } else if (event.key === '=') {
                this.canvasZoom(ZOOM_ACTION.ZOOM_IN);
            }
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
            this.canvasArea = this.root.querySelector('#canvas');
            this.innerCanvasArea = this.root.querySelector('#innerCanvas');
            lib.setContainer('innerCanvas');
            this.jsPlumbContainer = true;
        }
    }
}
