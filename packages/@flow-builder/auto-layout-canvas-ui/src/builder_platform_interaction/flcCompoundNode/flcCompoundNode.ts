// @ts-nocheck
import { LightningElement, api } from 'lwc';

import { getFlcConnectorData, getFlcFlowData, getFlcNodeData } from 'builder_platform_interaction/flcComponentsUtils';

/**
 *  Auto layout Canvas Compound Node
 *  This components renders a node, along with its branches, faults and connectors it may have
 */
export default class FlcCompoundNode extends LightningElement {
    @api
    node;

    @api
    isSelectionMode;

    @api
    isReconnecting;

    @api
    isCanvasReady;

    get simpleNode() {
        return getFlcNodeData(this.node);
    }

    get branches() {
        return (this.node.flows || []).map((flowInfo, i) => getFlcFlowData(flowInfo, this.node, i));
    }

    get logicConnectors() {
        return (this.node.logicConnectors || []).map(getFlcConnectorData);
    }

    get nextConnector() {
        const { nextConnector } = this.node;

        return nextConnector && getFlcConnectorData(nextConnector);
    }

    @api
    getBranchFlow(branchIndex: number) {
        return this.template.querySelectorAll('builder_platform_interaction-flc-flow')[branchIndex];
    }

    @api
    focus() {
        this.template.querySelector('builder_platform_interaction-flc-node').focus();
    }
}
