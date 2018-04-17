import { Element, api, track } from 'engine';
import { CONNECTOR_OVERLAY, ZOOM_ACTION } from 'builder_platform_interaction-constant';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';
import { CONNECTOR_TYPE } from 'builder_platform_interaction-connector-utils';
import { isCanvasElement } from 'builder_platform_interaction-element-config';
import { AddElementEvent, CANVAS_EVENT } from 'builder_platform_interaction-events';

/**
 * Canvas component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */

export default class Canvas extends Element {
    @api nodes = [];
    @api connectors = [];

    canvasArea;
    innerCanvasArea;

    jsPlumbContainer = false;
    isMouseDown = false;
    isPanning = false;

    MIN_SCALE = 0.2;
    MAX_SCALE = 1.0;
    SCALE_CHANGE = 0.2;

    zoomLevel = 1.0;
    currentScale = 1.0;

    @track isZoomOutDisabled = false;
    @track isZoomInDisabled = true;
    @track isZoomToView = true;

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
     * Helper method to zoom the canvas.
     * @param {String} action - Zoom action coming from handle key down or handle zoom
     */
    canvasZoom = (action) => {
        if (action === ZOOM_ACTION.ZOOM_OUT) {
            this.zoomLevel = Math.max(this.MIN_SCALE, this.currentScale - this.SCALE_CHANGE);
        } else if (action === ZOOM_ACTION.ZOOM_TO_VIEW) {
            this.zoomLevel = this.MAX_SCALE;
        } else if (action === ZOOM_ACTION.ZOOM_IN) {
            this.zoomLevel = Math.min(this.MAX_SCALE, this.currentScale + this.SCALE_CHANGE);
        }

        this.innerCanvasArea.style.transform = 'scale(' + this.zoomLevel + ')';

        lib.setZoom(this.zoomLevel);

        this.currentScale = this.zoomLevel;

        this.isZoomOutDisabled = (parseFloat(this.currentScale.toFixed(1)) === this.MIN_SCALE);
        this.isZoomToView = this.isZoomInDisabled = (parseFloat(this.currentScale.toFixed(1)) === this.MAX_SCALE);
    };

    /**
     * Method to handle zooming of the flow using the zoom panel.
     * @param {object} event - click to zoom event coming from zoom-panel.js
     */
    handleZoom = (event) => {
        if (event && event.detail) {
            this.canvasZoom(event.detail.action);
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
        if (this.isMouseDown) {
            this.isPanning = true;
        }
    };

    /**
     * Handling mouse up event for canvas. If mouse up happens directly on canvas/innerCanvas then marking the nodes
     * as unselected. Also checking the isCanvasInFocus and isPanning condition to prevent nodes from deselecting when
     * the user clicks outside canvas or stops panning.
     * @param {object} event - mouse up event
     */
    handleMouseUp = (event) => {
        event.preventDefault();
        this.isMouseDown = false;
        this.canvasArea.focus();
        if ((event.target.id === 'canvas' || event.target.id === 'innerCanvas') && !this.isPanning) {
            const canvasMouseUpEvent = new CustomEvent(CANVAS_EVENT.CANVAS_MOUSEUP, {
                bubbles: true,
                composed: true,
                cancelable: true
            });
            this.dispatchEvent(canvasMouseUpEvent);
        }

        this.isPanning = false;
    };

    /**
     * Handling right click event for canvas.
     */
    handleContextMenu = () => {
        this.isMouseDown = false;
        this.isPanning = false;
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
        if (event.key === 'Backspace') {
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
        } else if (event.metaKey && (event.key === '-' || event.key === '1' || event.key === '=')) {
            event.preventDefault();
            if (event.key === '-') {
                this.canvasZoom(ZOOM_ACTION.ZOOM_OUT);
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
