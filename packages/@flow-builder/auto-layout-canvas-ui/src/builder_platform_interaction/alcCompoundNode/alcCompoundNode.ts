import {
    CanvasContext,
    getAlcConnectorData,
    getAlcFlowData,
    getAlcNodeData,
    SELECTORS
} from 'builder_platform_interaction/alcComponentsUtils';
import { FlowModel, Guid, NodeRenderInfo } from 'builder_platform_interaction/autoLayoutCanvas';
import { api, LightningElement } from 'lwc';

/**
 *  Auto layout Canvas Compound Node
 *  This components renders a node, along with its branches, faults and connectors it may have
 */
export default class AlcCompoundNode extends LightningElement {
    @api
    flowModel!: Readonly<FlowModel>;

    @api
    node!: NodeRenderInfo;

    @api
    disableAddElements;

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

        return nextConnector && getAlcConnectorData(this.flowModel, nextConnector);
    }

    @api
    findNode(guid: Guid) {
        const alcNode = this.template.querySelector(SELECTORS.node);
        return alcNode.findNode(guid);
    }

    @api
    getNextConnector() {
        const nextConnector = this.nextConnector;
        if (nextConnector != null) {
            return this.template.querySelector(
                `builder_platform_interaction-alc-connector[data-key='${nextConnector.key}']`
            );
        }

        return undefined;
    }

    @api
    getNestedFlow(branchIndex: number) {
        return this.template.querySelectorAll(SELECTORS.flow)[branchIndex];
    }

    @api
    focus() {
        this.template.querySelector(SELECTORS.node).focus();
    }
}
