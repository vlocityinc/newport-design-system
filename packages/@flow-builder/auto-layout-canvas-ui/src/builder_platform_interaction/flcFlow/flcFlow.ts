// @ts-nocheck
import { LightningElement, api } from 'lwc';

import { getFlcConnectorData, getFlcCompoundNodeData } from 'builder_platform_interaction/flcComponentsUtils';

export default class FlcFlow extends LightningElement {
    @api
    flow;

    @api
    isPasteAvailable;

    @api
    isSelectionMode;

    @api
    isReconnecting;

    get preConnector() {
        const { preConnector } = this.flow;
        return preConnector && getFlcConnectorData(preConnector);
    }

    get nodes() {
        return (this.flow.nodes || []).map(getFlcCompoundNodeData);
    }

    get faultFlows() {
        return this.nodes.filter(node => node.faultFlow != null).map(node => node.faultFlow);
    }
}
