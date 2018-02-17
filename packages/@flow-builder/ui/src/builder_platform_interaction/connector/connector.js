import { Element, api } from 'engine';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';

export default class Connector extends Element {
    @api connector = {};

    renderedCallback() {
        if (lib.getContainer().classList.contains('innerCanvas')) {
            // Setting up existing connections
            lib.setExistingConnections(this.connector.source, this.connector.target, this.connector.label);

            if (Object.keys(this.connector.jsPlumbConnector).length !== 0) {
                if (this.connector.config.isSelected) {
                    lib.selectConnector(this.connector.jsPlumbConnector);
                } else {
                    lib.deselectConnector(this.connector.jsPlumbConnector);
                }
            }
        }
    }
}