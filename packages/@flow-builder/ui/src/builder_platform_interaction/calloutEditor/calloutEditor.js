import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';

const CONTAINER_SELECTOR = 'builder_platform_interaction-callout-editor-container';

export default class CalloutEditor extends LightningElement {
    /**
     * Internal state for the editor
     */
    @track calloutNode = {};
    /**
     * A SelectedInvocableAction|SelectedApexPlugin|SelectedSubflow
     */
    @track selectedAction = {};

    @api
    get node() {
        return this.calloutNode;
    }

    set node(newValue) {
        this.calloutNode = newValue || {};
        this.updateSelectedAction();
    }

    @api
    getNode() {
        return this.template.querySelector(CONTAINER_SELECTOR).getNode();
    }

    updateSelectedAction() {
        if (this.node.elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            this.selectedAction = {
                elementType :  this.node.elementType,
                apexClass : getValueFromHydratedItem(this.node.apexClass)
            };
        } else if (this.node.elementType === ELEMENT_TYPE.SUBFLOW) {
            this.selectedAction = {
                elementType :  this.node.elementType,
                flowName : getValueFromHydratedItem(this.node.flowName)
            };
        } else {
            this.selectedAction = {
                elementType :  this.node.elementType,
                actionType : getValueFromHydratedItem(this.node.actionType),
                actionName : getValueFromHydratedItem(this.node.actionName),
            };
        }
    }

    handleActionSelected(event) {
        event.stopPropagation();
        this.selectedAction = event.detail.value;
    }
}