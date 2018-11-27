import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { shouldNotBeNullOrUndefined } from 'builder_platform_interaction/validationRules';
import { ClosePropertyEditorEvent, SetPropertyEditorTitleEvent } from 'builder_platform_interaction/events';
import { LABELS } from './calloutEditorLabels';
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

    @track selectedActionError = null;

    @track hasActions = {};

    labels = LABELS;

    location = {};

    connectedCallback() {
        this.updatePropertyEditorTitle();
    }

    updatePropertyEditorTitle() {
        const title = this.labels.newActionPropertyEditorTitle;
        const setPropertyEditorTitleEvent = new SetPropertyEditorTitleEvent(title);
        this.dispatchEvent(setPropertyEditorTitleEvent);
    }

    @api
    get node() {
        return this.calloutNode;
    }

    set node(newValue) {
        this.calloutNode = newValue || {};
        this.location.locationX = this.calloutNode.locationX;
        this.location.locationY = this.calloutNode.locationY;
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
        this.validateSelectedAction();
        if (this.selectedActionError) {
            return [this.selectedActionError];
        }
        // if we don't have an error then we can call validate on our container which will then call validate on the chosen editor
        return container.validate();
    }

    updateSelectedAction() {
        let newSelectedAction = {
            elementType :  this.node.elementType,
        };
        if (this.node.elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            const apexClass = getValueFromHydratedItem(this.node.apexClass);
            if (apexClass) {
                newSelectedAction = Object.assign(newSelectedAction, { apexClass });
            }
        } else if (this.node.elementType === ELEMENT_TYPE.SUBFLOW) {
            const flowName = getValueFromHydratedItem(this.node.flowName);
            if (flowName) {
                newSelectedAction = Object.assign(newSelectedAction, { flowName });
            }
        } else {
            // all invocable actions
            const actionType = getValueFromHydratedItem(this.node.actionType);
            const actionName = getValueFromHydratedItem(this.node.actionName);
            if (actionType && actionName) {
                newSelectedAction = Object.assign(newSelectedAction, { actionType, actionName });
            }
        }
        this.selectedAction = newSelectedAction;
    }

    validateSelectedAction() {
        if (this.selectedAction.elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            this.selectedActionError = shouldNotBeNullOrUndefined(this.selectedAction.apexClass);
        } else if (this.selectedAction.elementType === ELEMENT_TYPE.SUBFLOW) {
            this.selectedActionError = shouldNotBeNullOrUndefined(this.selectedAction.flowName);
        } else {
            this.selectedActionError = shouldNotBeNullOrUndefined(this.selectedAction.actionName);
        }
    }

    handleActionSelected(event) {
        event.stopPropagation();
        this.selectedAction = event.detail.value;
        this.selectedActionError = event.detail.error;
    }

    handleCannotRetrieveParameters(event) {
       event.stopPropagation();
       // reset selected action
       this.selectedAction = { elementType : this.selectedAction.elementType };
   }

   handleCannotRetrieveActions(event) {
       event.stopPropagation();
       const closePropertyEditorEvent = new ClosePropertyEditorEvent();
       this.dispatchEvent(closePropertyEditorEvent);
   }

    handleActionsLoaded(event) {
        this.hasActions = { value : !(event.detail.number === 0)}; // only set it when the event explicitly says it has 0
   }
}