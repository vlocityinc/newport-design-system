import { Element, api } from 'engine';
import { EVENT } from 'builder_platform_interaction-constant';
import { drawingLibInstance as lib } from './drawing-lib';
/**
 * Canvas component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class Canvas extends Element {
    @api nodes;

    constructor() {
        super();
        lib.setNewConnection(this.connectionAdded);
    }

    // Adding a new connection
    connectionAdded = (connectorInfo) => {
        connectorInfo.connection.getOverlay('label').setVisible(true);
        connectorInfo.connection.getOverlay('label').setLabel('Label');
        const addConnectionEvent = new CustomEvent(EVENT.ADD_CONNECTION,
            {
                bubbles: true,
                composed: true,
                detail: {
                    sourceId : connectorInfo.sourceId,
                    targetId: connectorInfo.targetId,
                    label: connectorInfo.connection.getOverlay('label').getLabel()
                }
            }
        );
        this.dispatchEvent(addConnectionEvent);
    };

    renderedCallback() {
        lib.setContainer("innerCanvas");

        lib.setSuspendDrawing(true, true);

        // Setting up existing node elements and creating a list of all the existing connectors
        const connectorList = [];
        this.nodes.forEach((node) => {
            lib.setDraggable(node.guid);

            // TODO: Set the number of connections for the nodes based on their type
            lib.makeSource(node.guid, 1);

            lib.makeTarget(node.guid);

            if (node.connector.targetReference) {
                const source = node.guid;
                const target = node.connector.targetReference;
                connectorList.push({source, target});
            }
        });

        // Setting up all the existing connectors
        connectorList.forEach((connector) => {
            lib.setExistingConnections(connector.source, connector.target, 'Label');
        });

        lib.setSuspendDrawing(false, true);
    }
}
