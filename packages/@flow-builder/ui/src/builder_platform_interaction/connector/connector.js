import { Element, api } from 'engine';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';

/**
 * Connector component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */
export default class Connector extends Element {
    @api connector = {};

    /**
     * JsPlumb's instance of a connector used for selection/deselection/deletion of a connector.
     */
    jsPlumbConnector;

    renderedCallback() {
        if (lib.getContainer().classList.contains('innerCanvas')) {
            // Setting up existing connections
            if (!this.jsPlumbConnector) {
                // TODO: Update it to set existing connections in bulk to improve performance
                this.jsPlumbConnector = lib.setExistingConnections(this.connector.source, this.connector.target,
                    this.connector.label, this.connector.guid, this.connector.type);
            } else if (this.connector.config.isSelected) {
                lib.selectConnector(this.jsPlumbConnector);
            } else if (!this.connector.config.isSelected) {
                lib.deselectConnector(this.jsPlumbConnector);
            }
        }
    }

    disconnectedCallback() {
        // Remove the connector from JsPlumb
        lib.removeConnectorFromLib(this.jsPlumbConnector);
    }
}