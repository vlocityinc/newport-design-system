import { Element, api } from 'engine';
import { EVENT, CONNECTOR_OVERLAY } from 'builder_platform_interaction-constant';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';

/**
 * Canvas component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */

// TODO: Move it inside the class
let jsPlumbContainer = false;
let isMouseDown = false;
let isPanning = false;
let isCanvasInFocus = false;

export default class Canvas extends Element {
    @api nodes = [];
    @api connectors = [];

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
        const addConnectionEvent = new CustomEvent(EVENT.ADD_CONNECTION,
            {
                bubbles: true,
                composed: true,
                detail: {
                    source: connectorInfo.sourceId,
                    target: connectorInfo.targetId,
                    label: connectorInfo.connection.getOverlay('__label').getLabel()
                }
            }
        );
        this.dispatchEvent(addConnectionEvent);
    };

    /**
     * Fires connector selection event
     * @param {object} connection - jsPlumb's connector object
     * @param {object} event - connection click event coming from drawing-lib.js
     */
    connectionClicked = (connection, event) => {
        event.stopPropagation();
        const isMultiSelectKeyPressed = this.isMultiSelect(event);
        const connectorSelectedEvent = new CustomEvent(EVENT.CONNECTOR_SELECTED, {
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
     * Handling mouse down event for canvas.
     * @param {object} event - mouse down event
     */
    handleMouseDown = (event) => {
        event.preventDefault();
        isMouseDown = true;
    };

    /**
     * Handling mouse move event for canvas.
     * @param {object} event - mouse move event
     */
    handleMouseMove = (event) => {
        event.preventDefault();
        if (isMouseDown) {
            isPanning = true;
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
        isMouseDown = false;
        // TODO: Use querySelector instead
        const canvasArea = document.getElementById('canvas');
        if (document.activeElement !== canvasArea) {
            isCanvasInFocus = false;
            canvasArea.focus();
        }
        if ((event.target.id === 'canvas' || event.target.id === 'innerCanvas') && isCanvasInFocus && !isPanning) {
            const canvasMouseUpEvent = new CustomEvent(EVENT.CANVAS_MOUSEUP, {
                bubbles: true,
                composed: true,
                cancelable: true
            });
            this.dispatchEvent(canvasMouseUpEvent);
        }

        isCanvasInFocus = true;
        isPanning = false;
    };

    /**
     * Handling right click event for canvas.
     */
    handleContextMenu = () => {
        isMouseDown = false;
        isPanning = false;
    };

    /**
     * Handling key down event for canvas and deleting selected nodes from the canvas if delete key is pressed.
     * @param {object} event - key down event
     */
    handleKeyDown = (event) => {
        if (event.key === 'Backspace') {
            const selectedCanvasElementGuids = [];
            const selectedConnectorGuids = [];

            this.nodes.map((node) => {
                if (node.config.isSelected) {
                    selectedCanvasElementGuids.push(node.guid);
                }
                return node;
            });

            this.connectors.map((connector) => {
                if (connector.config.isSelected) {
                    selectedConnectorGuids.push(connector.guid);
                }
                return connector;
            });

            const multiDeleteEvent = new CustomEvent(EVENT.MULTIPLE_DELETE, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    selectedCanvasElementGuids,
                    selectedConnectorGuids
                }
            });
            this.dispatchEvent(multiDeleteEvent);
        }
    };

    renderedCallback() {
        if (!jsPlumbContainer) {
            lib.setContainer('innerCanvas');
            jsPlumbContainer = true;
        }
    }
}