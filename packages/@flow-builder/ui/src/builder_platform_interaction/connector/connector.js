import { LightningElement, api } from 'lwc';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';

/**
 * Connector component for flow builder.
 *
 * @ScrumTeam Process UI
 * @since 214
 */
export default class Connector extends LightningElement {
    @api connector = {};

    /**
     * JsPlumb's instance of a connector used for selection/deselection/deletion of a connector.
     */
    jsPlumbConnector;

    @api getJsPlumbConnector() {
        return this.jsPlumbConnector;
    }

    @api setJsPlumbConnector(newValue) {
        this.jsPlumbConnector = newValue;
    }

    disconnectedCallback() {
        // Remove the connector from JsPlumb
        lib.removeConnectorFromLib(this.jsPlumbConnector);
    }
}