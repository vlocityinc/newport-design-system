import { LightningElement, api } from 'lwc';

import { getFlcConnectorData, getFlcCompoundNodeData } from 'builder_platform_interaction/flcComponentsUtils';

export default class FlcFlow extends LightningElement {
    @api
    flow;

    @api
    menu;

    @api
    force;

    @api
    isPasteAvailable;

    @api
    isSelectionMode;

    get preConnector() {
        const { preConnector } = this.flow;

        return preConnector && getFlcConnectorData(preConnector);
    }

    get nodes() {
        return (this.flow.nodes || []).map(getFlcCompoundNodeData);
    }
}
