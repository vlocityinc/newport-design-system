import { Element, api } from 'engine';
import { EVENT, CONNECTOR_OVERLAY } from 'builder_platform_interaction-constant';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';

/**
 * Canvas component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */

let jsPlumbContainer = false;
let isMouseDown = false;
let isPanning = false;
let isMultiSelectKeyPressed = false;

export default class Canvas extends Element {
    @api nodes = [];
    @api connectors = [];

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
                    source : connectorInfo.sourceId,
                    target: connectorInfo.targetId,
                    label: connectorInfo.connection.getOverlay('__label').getLabel()
                }
            }
        );
        this.dispatchEvent(addConnectionEvent);
    };

    /**
     * Fires connection selection event
     * @param {object} connection - jsPlumb's connector object
     * @param {object} event - connection click event coming from drawing-lib.js
     */
    connectionClicked = (connection, event) => {
        event.stopPropagation();
        isMultiSelectKeyPressed = (event.shiftKey || event.metaKey || event.ctrlKey);
        const connectorSelectedEvent = new CustomEvent(EVENT.CONNECTOR_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                source : connection.sourceId,
                target : connection.targetId,
                connection,
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
     * as unselected. Also checking the isPanning condition to prevent nodes from deselecting when the user stops panning.
     * @param {object} event - mouse up event
     */
    handleMouseUp = (event) => {
        event.preventDefault();
        isMouseDown = false;
        if ((event.target.id === 'canvas' || event.target.id === 'innerCanvas') && !isPanning) {
            const canvasMouseUpEvent = new CustomEvent(EVENT.CANVAS_MOUSEUP, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {}
            });
            this.dispatchEvent(canvasMouseUpEvent);
        }

        isPanning = false;
    };

    /**
     * Handling right click event for canvas.
     */
    handleContextMenu = () => {
        isMouseDown = false;
        isPanning = false;
    };

    // /**
    //  * Commenting this out right now to avoid deletion of nodes when the property editor is up.
    //  * Handling key down event for canvas and deleting selected nodes in the canvas if delete key is pressed.
    //  * TODO: Need to update it to delete associated connectors as well
    //  */
    // handleKeyDown = document.addEventListener('keydown', (event) => {
    //     if (event.key === 'Backspace') {
    //         const iconSection = document.getElementsByClassName('selected');
    //         const iconSectionLength = iconSection.length;
    //         for (let i = 0; i < iconSectionLength; i++) {
    //             lib.removeNodeFromLib(iconSection[i].id);
    //         }
    //         if (iconSectionLength > 0) {
    //             const nodeDeleteEvent = new CustomEvent(EVENT.NODE_DELETE, {
    //                 bubbles: true,
    //                 composed: true,
    //                 cancelable: true,
    //                 detail: {}
    //             });
    //             this.dispatchEvent(nodeDeleteEvent);
    //         }
    //     }
    // });

    renderedCallback() {
        if (!jsPlumbContainer) {
            lib.setContainer('innerCanvas');
            jsPlumbContainer = true;
        }
    }
}
