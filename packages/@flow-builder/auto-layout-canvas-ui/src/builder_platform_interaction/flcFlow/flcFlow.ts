// @ts-nocheck
import { LightningElement, api } from 'lwc';
import {
    getFlcConnectorData,
    getFlcCompoundNodeData,
    BuilderContext
} from 'builder_platform_interaction/flcComponentsUtils';
import { FAULT_INDEX, Guid } from 'builder_platform_interaction/autoLayoutCanvas';

export default class FlcFlow extends LightningElement {
    @api
    flow;

    @api
    builderContext!: BuilderContext;

    @api
    isCanvasReady;

    get preConnector() {
        const { preConnector } = this.flow;
        return preConnector && getFlcConnectorData(preConnector);
    }

    get nodes() {
        return (this.flow.nodes || []).map(getFlcCompoundNodeData);
    }

    get faultFlows() {
        return this.nodes.filter((node) => node.faultFlow != null).map((node) => node.faultFlow);
    }

    @api
    findNode(pathToFocusNode: Array<{ guid: Guid; index?: number }>) {
        const compoundNode = this.template.querySelector(
            `builder_platform_interaction-flc-compound-node[data-key='${pathToFocusNode[0].guid}']`
        );

        if (pathToFocusNode.length === 1) {
            // If there's only a single item remaining, that would mean that we have found the desired node
            return compoundNode;
        }
        // Recursively going down the branch flows to reach the desired node
        const focusBranchIndex = pathToFocusNode[0].index;
        let compoundFlow;
        if (focusBranchIndex !== FAULT_INDEX) {
            compoundFlow = compoundNode.getBranchFlow(focusBranchIndex);
        } else {
            // Finding the key for the fault flow associated with the compound node found in the path to desired node
            const faultFlowDataKey = this.nodes.find((node) => node.key === compoundNode.dataset.key).faultFlow.key;
            compoundFlow = this.template.querySelector(
                `builder_platform_interaction-flc-flow[data-key='${faultFlowDataKey}']`
            );
        }

        pathToFocusNode = pathToFocusNode.slice(1);
        return compoundFlow.findNode(pathToFocusNode);
    }
}
