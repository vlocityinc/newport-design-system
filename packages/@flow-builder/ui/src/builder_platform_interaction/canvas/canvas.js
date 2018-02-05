import { Element, api } from 'engine';
import { EVENT } from 'builder_platform_interaction-constant';
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

export default class Canvas extends Element {
    @api nodes;
    @api connectors;

    constructor() {
        super();
        lib.setNewConnection(this.connectionAdded);
    }

    /**
     * Method to set up any new connections made within the canvas.
     * @param {object} connectorInfo - Contains all the information about the new connector
     */
    connectionAdded = (connectorInfo) => {
        connectorInfo.connection.getOverlay('label').setVisible(true);
        connectorInfo.connection.getOverlay('label').setLabel('Label');
        const addConnectionEvent = new CustomEvent(EVENT.ADD_CONNECTION,
            {
                bubbles: true,
                composed: true,
                detail: {
                    source : connectorInfo.sourceId,
                    target: connectorInfo.targetId,
                    label: connectorInfo.connection.getOverlay('label').getLabel()
                }
            }
        );
        this.dispatchEvent(addConnectionEvent);
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

        if ((event.srcElement.classList.contains('canvas') || event.srcElement.classList.contains('innerCanvas')) && !isPanning) {
            const nodeSelectedEvent = new CustomEvent(EVENT.NODE_SELECTED, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {}
            });
            this.dispatchEvent(nodeSelectedEvent);
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

    renderedCallback() {
        if (!jsPlumbContainer) {
            lib.setContainer('innerCanvas');
            jsPlumbContainer = true;
        }
    }
}
