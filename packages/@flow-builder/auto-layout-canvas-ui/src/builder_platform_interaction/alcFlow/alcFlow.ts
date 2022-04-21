import {
    CanvasContext,
    getAlcCompoundNodeData,
    getAlcConnectorData
} from 'builder_platform_interaction/alcComponentsUtils';
import AlcCompoundNode from 'builder_platform_interaction/alcCompoundNode';
import {
    ConnectionSource,
    FAULT_INDEX,
    FlowModel,
    FlowRenderInfo,
    Geometry
} from 'builder_platform_interaction/autoLayoutCanvas';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';

const selectors = {
    connector: 'builder_platform_interaction-alc-connector',
    nestedFlow: (key) => `builder_platform_interaction-alc-flow[data-key='${key}']`,
    compoundNode: (guid) => `builder_platform_interaction-alc-compound-node[data-key='${guid}']`
};

export default class AlcFlow extends LightningElement {
    static delegatesFocus = true;

    dom = lwcUtils.createDomProxy(this, selectors);

    @api
    flowModel!: Readonly<FlowModel>;

    @api
    flow!: FlowRenderInfo;

    @api
    disableDeleteElements;

    @api
    disableEditElements;

    @api
    canvasContext!: CanvasContext;

    /**
     * The active element refers to the element currently being edited using the property editor panel
     */
    @api
    activeElementGuid;

    get preConnector() {
        const { preConnector } = this.flow;

        // TODO: should make 'w' optional in Geometry type
        // @ts-ignore
        const geometry = { ...preConnector?.geometry, w: undefined } as Geometry;
        return preConnector && getAlcConnectorData(this.flowModel, { ...preConnector, geometry });
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
     * @returns The fault or nested flow
     */
    getFaultOrNestedFlow(compoundNode, nestedBranchIndex?: number) {
        if (nestedBranchIndex === FAULT_INDEX) {
            // Finding the key for the fault flow associated with the compound node found in the path to desired node/connector
            const faultFlowDataKey = this.nodes.find((node) => node.key === compoundNode.dataset.key)?.faultFlow?.key;
            return this.dom[selectors.nestedFlow(faultFlowDataKey)];
        }
        return compoundNode.getNestedFlow(nestedBranchIndex);
    }

    /**
     * Get a compound node element by for a guid
     *
     * @param guid - The node's guid
     * @returns The compound node element
     */
    getCompoundNode(guid: string): AlcCompoundNode {
        return this.dom[selectors.compoundNode(guid)];
    }

    @api
    findNode(pathToFocusNode: ConnectionSource[]) {
        const compoundNode = this.getCompoundNode(pathToFocusNode[0].guid);

        if (pathToFocusNode.length === 1) {
            // If there's only a single item remaining, that would mean that we have found the desired node
            return compoundNode;
        }

        const embeddedElement = compoundNode.findNode(pathToFocusNode[1].guid);
        if (embeddedElement != null) {
            return embeddedElement;
        }

        // Recursively going down the nested flows to reach the desired node
        const nestedFlow = this.getFaultOrNestedFlow(compoundNode, pathToFocusNode[0].childIndex!);
        pathToFocusNode = pathToFocusNode.slice(1);
        return nestedFlow.findNode(pathToFocusNode);
    }

    @api
    findConnector(pathToFocusNode: ConnectionSource[], focusBranchIndex?: number) {
        const compoundNode = this.getCompoundNode(pathToFocusNode[0].guid);

        if (pathToFocusNode.length === 1) {
            if (focusBranchIndex === undefined || focusBranchIndex === null) {
                return compoundNode.getNextConnector();
            }
            return this.getFaultOrNestedFlow(compoundNode, focusBranchIndex).getPreConnector();
        }
        // Recursively going down the nested flows to reach the desired connector's source node
        const nestedFlow = this.getFaultOrNestedFlow(compoundNode, pathToFocusNode[0].childIndex!);
        pathToFocusNode = pathToFocusNode.slice(1);
        return nestedFlow.findConnector(pathToFocusNode, focusBranchIndex);
    }

    @api
    getPreConnector() {
        return this.dom.connector;
    }
}
