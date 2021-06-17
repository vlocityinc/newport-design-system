import { LightningElement, api } from 'lwc';
import {
    getAlcConnectorData,
    getAlcCompoundNodeData,
    AutoLayoutCanvasMode
} from 'builder_platform_interaction/alcComponentsUtils';
import { FAULT_INDEX, FlowRenderInfo, Guid } from 'builder_platform_interaction/autoLayoutCanvas';

export default class AlcFlow extends LightningElement {
    @api
    flow!: FlowRenderInfo;

    @api
    canvasMode!: AutoLayoutCanvasMode;

    @api
    disableAddElements;

    /**
     * The active element refers to the element currently being edited using the property editor panel
     */
    @api
    activeElementGuid;

    get preConnector() {
        const { preConnector } = this.flow;
        return preConnector && getAlcConnectorData(preConnector);
    }

    get nodes() {
        return (this.flow.nodes || []).map(getAlcCompoundNodeData);
    }

    get faultFlows() {
        return this.nodes.filter((node) => node.faultFlow != null).map((node) => node.faultFlow);
    }

    /**
     * Uses the compoundNode to get the nested Fault flow or Branch flow based on the index provided
     *
     * @param compoundNode - compoundNode found on the path to the node/connector
     * @param nestedBranchIndex - Index of the branch that needs to be traversed/focused
     */
    getFaultOrNestedFlow(compoundNode, nestedBranchIndex?: number) {
        if (nestedBranchIndex === FAULT_INDEX) {
            // Finding the key for the fault flow associated with the compound node found in the path to desired node/connector
            const faultFlowDataKey = this.nodes.find((node) => node.key === compoundNode.dataset.key)?.faultFlow?.key;
            return this.template.querySelector(`builder_platform_interaction-alc-flow[data-key='${faultFlowDataKey}']`);
        }
        return compoundNode.getNestedFlow(nestedBranchIndex);
    }

    @api
    findNode(pathToFocusNode: Array<{ guid: Guid; index?: number }>) {
        const compoundNode = this.template.querySelector(
            `builder_platform_interaction-alc-compound-node[data-key='${pathToFocusNode[0].guid}']`
        );
        if (pathToFocusNode.length === 1) {
            // If there's only a single item remaining, that would mean that we have found the desired node
            return compoundNode;
        }
        // Recursively going down the nested flows to reach the desired node
        const nestedFlow = this.getFaultOrNestedFlow(compoundNode, pathToFocusNode[0].index);
        pathToFocusNode = pathToFocusNode.slice(1);
        return nestedFlow.findNode(pathToFocusNode);
    }

    @api
    findConnector(pathToFocusNode: Array<{ guid: Guid; index?: number }>, focusBranchIndex?: number) {
        const compoundNode = this.template.querySelector(
            `builder_platform_interaction-alc-compound-node[data-key='${pathToFocusNode[0].guid}']`
        );
        if (pathToFocusNode.length === 1) {
            if (focusBranchIndex === undefined || focusBranchIndex === null) {
                return compoundNode.getNextConnector();
            }
            return this.getFaultOrNestedFlow(compoundNode, focusBranchIndex).getPreConnector();
        }
        // Recursively going down the nested flows to reach the desired connector's source node
        const nestedFlow = this.getFaultOrNestedFlow(compoundNode, pathToFocusNode[0].index);
        pathToFocusNode = pathToFocusNode.slice(1);
        return nestedFlow.findConnector(pathToFocusNode, focusBranchIndex);
    }

    @api
    getPreConnector() {
        return this.template.querySelector('builder_platform_interaction-alc-connector');
    }
}
