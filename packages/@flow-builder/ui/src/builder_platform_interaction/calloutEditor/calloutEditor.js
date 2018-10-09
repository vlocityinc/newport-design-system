import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { shouldNotBeNullOrUndefined } from 'builder_platform_interaction/validationRules';

const CONTAINER_SELECTOR = 'builder_platform_interaction-callout-editor-container';
const ACTION_SELECTOR = 'builder_platform_interaction-action-selector';
const REFERENCED_COMBOBOX = 'builder_platform_interaction-combobox';

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

    /**
     * Calls validate method on the container component that contains the inner property editor
     * This method is called on OK by the property editor footer component for validation
     * @returns {Array} the array of errors from validation call
     */
    @api
    validate() {
        const container = this.template.querySelector(CONTAINER_SELECTOR);
        // check the referenced action combobox
        const actionSelector = this.template.querySelector(ACTION_SELECTOR);
        const referencedCombobox = actionSelector.getElementsByTagName(REFERENCED_COMBOBOX)[0];
        if (referencedCombobox.errorMessage) {
            return [referencedCombobox.errorMessage];
        }
        const error = shouldNotBeNullOrUndefined(referencedCombobox.value.value);
        if (error) {
            return [error];
        }
        // if we don't have an error then we can call validate on our container which will then call validate on the chosen editor
        return container.validate();
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