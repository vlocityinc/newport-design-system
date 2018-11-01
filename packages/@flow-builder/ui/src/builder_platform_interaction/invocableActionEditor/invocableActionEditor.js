import { LightningElement, api, track } from 'lwc';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { LABELS, ACTION_TYPE_LABEL } from './invocableActionEditorLabels';
import { FLOW_PROCESS_TYPE } from "builder_platform_interaction/flowMetadata";
import { format } from 'builder_platform_interaction/commonUtils';
import { getValueFromHydratedItem, getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { invocableActionReducer } from './invocableActionReducer';
import { MERGE_WITH_PARAMETERS, REMOVE_UNSET_PARAMETERS, getParameterListWarnings } from 'builder_platform_interaction/calloutEditorLib';
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { ClosePropertyEditorEvent, CannotRetrieveCalloutParametersEvent } from 'builder_platform_interaction/events';

export default class InvocableActionEditor extends LightningElement {
    /**
     * Internal state for the editor
     */
    @track actionCallNode = {};

    @track displaySpinner = true;
    @track invocableActionDescriptor;

    labels = LABELS;
    connected = false;

    connectedCallback() {
        this.connected = true;
        if (this.node) {
            this.fetchInvocableActionDescriptor();
            this.fetchActionParameters();
        }
    }

    disconnectedCallback() {
        this.connected = false;
    }

    @api
    get node() {
        return this.actionCallNode;
    }

    set node(newValue) {
        this.actionCallNode = newValue || {};
        if (this.connected) {
            this.fetchInvocableActionDescriptor();
            this.fetchActionParameters();
        }
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        const event = new CustomEvent(REMOVE_UNSET_PARAMETERS);
        return invocableActionReducer(this.actionCallNode, event);
    }

    /**
     * public api function to run the rules from actionCall validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.actionCallNode = invocableActionReducer(this.actionCallNode, event);
        return getErrorsFromHydratedElement(this.actionCallNode);
    }

    get elementType() {
        return (this.actionCallNode && this.actionCallNode.elementType) ? this.actionCallNode.elementType : undefined;
    }

    fetchActionParameters() {
        const actionParams = { actionName: getValueFromHydratedItem(this.node.actionName), actionType: getValueFromHydratedItem(this.node.actionType) };
        const keyProvider = (params) => `${params.actionName}-${params.actionType}`;
        fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, actionParams, keyProvider).then((parameters) => {
            if (this.connected) {
                this.displaySpinner = false;
                const event = new CustomEvent(MERGE_WITH_PARAMETERS, { detail : parameters });
                this.actionCallNode = invocableActionReducer(this.actionCallNode, event);
            }
        }).catch(() => {
            if (this.connected) {
                this.displaySpinner = false;
                this.cannotRetrieveParameters();
            }
        });
    }

    cannotRetrieveParameters() {
        if (!this.isNewMode) {
            const closePropertyEditorEvent = new ClosePropertyEditorEvent();
            this.dispatchEvent(closePropertyEditorEvent);
        } else {
            // let the parent property editor decide what to do
            const cannotRetrieveParametersEvent = new CannotRetrieveCalloutParametersEvent();
            this.dispatchEvent(cannotRetrieveParametersEvent);
        }
    }

    fetchInvocableActionDescriptor() {
        this.invocableActionDescriptor = undefined;
        const actionParams = { actionName: getValueFromHydratedItem(this.node.actionName), actionType: getValueFromHydratedItem(this.node.actionType) };
        const keyProvider = (params) => params.flowProcessType;
        const options = {disableErrorModal : true};
        fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, {
            flowProcessType : FLOW_PROCESS_TYPE.FLOW
        }, keyProvider, options).then((invocableActions) => {
            if (this.connected) {
                this.invocableActionDescriptor = invocableActions.find(action => action.name === actionParams.actionName && action.type === actionParams.actionType);
            }
        }).catch(() => {
            // ignore the error : we won't use the invocableActionDescriptor in this case
        });
    }

    // used to keep track of whether this is an existing invocable action
    @api
    isNewMode = false;

    get subtitle() {
        if (!this.actionCallNode) {
            return '';
        }
        const actionName = this.invocableActionDescriptor != null ? this.invocableActionDescriptor.label : getValueFromHydratedItem(this.actionCallNode.actionName);
        return format(this.labels.subtitle, actionName, ACTION_TYPE_LABEL[this.elementType]);
    }

    get parameterListConfig() {
        return {
            inputTabHeader: this.labels.inputTabHeader,
            outputTabHeader: this.labels.outputTabHeader,
            emptyInputsTitle: this.labels.emptyInputsTitle,
            emptyInputsBody: format(this.labels.emptyInputsBody, ACTION_TYPE_LABEL[this.elementType]),
            emptyOutputsTitle: this.labels.emptyOutputsTitle,
            emptyOutputsBody: format(this.labels.emptyOutputsBody, ACTION_TYPE_LABEL[this.elementType]),
            sortInputs: true,
            sortOutputs: true,
            inputs: this.actionCallNode.inputParameters,
            outputs: this.actionCallNode.outputParameters,
            warnings: getParameterListWarnings(this.actionCallNode.inputParameters, this.actionCallNode.outputParameters, this.labels)
        };
    }

    /**
     * @param {object} event - property changed event coming from label-description component or parameter-item component
     */

    handleEvent(event) {
        event.stopPropagation();
        this.actionCallNode = invocableActionReducer(this.actionCallNode, event);
    }
}