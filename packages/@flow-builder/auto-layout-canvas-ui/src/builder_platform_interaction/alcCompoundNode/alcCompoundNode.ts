// @ts-nocheck
import { LightningElement, api } from 'lwc';

import {
    AutoLayoutCanvasMode,
    getAlcConnectorData,
    getAlcFlowData,
    getAlcNodeData
} from 'builder_platform_interaction/alcComponentsUtils';

/**
 *  Auto layout Canvas Compound Node
 *  This components renders a node, along with its branches, faults and connectors it may have
 */
export default class AlcCompoundNode extends LightningElement {
    @api
    node;

    @api
    canvasMode!: AutoLayoutCanvasMode;

    @api
    isCanvasReady;

    @api
    disableAddElements;

    get simpleNode() {
        return getAlcNodeData(this.node);
    }

    get branches() {
        return (this.node.flows || []).map((flowInfo, i) => getAlcFlowData(flowInfo, this.node, i));
    }

    get logicConnectors() {
        return (this.node.logicConnectors || []).map(getAlcConnectorData);
    }

    get nextConnector() {
        const { nextConnector } = this.node;

        return nextConnector && getAlcConnectorData(nextConnector);
    }

    @api
    getNextConnector() {
        return this.template.querySelector(
            `builder_platform_interaction-alc-connector[data-key='${this.nextConnector.key}']`
        );
    }

    @api
    getNestedFlow(branchIndex: number) {
        return this.template.querySelectorAll('builder_platform_interaction-alc-flow')[branchIndex];
    }

    @api
    focus() {
        this.template.querySelector('builder_platform_interaction-alc-node').focus();
    }
}
