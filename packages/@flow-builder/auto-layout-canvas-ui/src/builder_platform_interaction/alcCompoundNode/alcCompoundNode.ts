import {
    CanvasContext,
    getAlcConnectorData,
    getAlcFlowData,
    getAlcNodeData
} from 'builder_platform_interaction/alcComponentsUtils';
import AlcNode from 'builder_platform_interaction/alcNode';
import { FlowModel, Geometry, Guid, NodeRenderInfo } from 'builder_platform_interaction/autoLayoutCanvas';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';

const selectors = {
    node: 'builder_platform_interaction-alc-node',
    flow: 'builder_platform_interaction-alc-flow',
    nextConnector: (key) => `builder_platform_interaction-alc-connector[data-key='${key}']`
};

/**
 *  Auto layout Canvas Compound Node
 *  This components renders a node, along with its branches, faults and connectors it may have
 */
export default class AlcCompoundNode extends LightningElement {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api
    flowModel!: Readonly<FlowModel>;

    @api
    node!: NodeRenderInfo;

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

    get simpleNode() {
        return getAlcNodeData(this.flowModel, this.node);
    }

    get branches() {
        return (this.node.flows || []).map((flowInfo, childIndex) =>
            getAlcFlowData(flowInfo, { guid: this.node.guid, childIndex })
        );
    }

    get logicConnectors() {
        return (this.node.logicConnectors || []).map((connector) => getAlcConnectorData(this.flowModel, connector));
    }

    get nextConnector() {
        const { nextConnector } = this.node;

        // TODO: should make 'w' optional in Geometry type
        // @ts-ignore
        const geometry = { ...nextConnector?.geometry, w: undefined } as Geometry;
        return nextConnector && getAlcConnectorData(this.flowModel, { ...nextConnector, geometry });
    }

    @api
    findNode(guid: Guid) {
        const alcNode = this.dom.as<AlcNode>().node;
        return alcNode.findNode(guid);
    }

    @api
    getNextConnector() {
        const nextConnector = this.nextConnector;
        if (nextConnector != null) {
            return this.dom[selectors.nextConnector(nextConnector.key)];
        }

        return undefined;
    }

    @api
    getNestedFlow(branchIndex: number) {
        return this.dom.all.flow[branchIndex];
    }

    @api
    focus() {
        this.dom.node.focus();
    }
}
