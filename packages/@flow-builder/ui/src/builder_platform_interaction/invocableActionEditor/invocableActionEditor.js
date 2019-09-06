import { LightningElement, api, track } from 'lwc';
import {
    fetchOnce,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import { LABELS, ACTION_TYPE_LABEL } from './invocableActionEditorLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import {
    getValueFromHydratedItem,
    getErrorsFromHydratedElement
} from 'builder_platform_interaction/dataMutationLib';
import { invocableActionReducer } from './invocableActionReducer';
import {
    MERGE_WITH_PARAMETERS,
    REMOVE_UNSET_PARAMETERS,
    getParameterListWarnings
} from 'builder_platform_interaction/calloutEditorLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import {
    ClosePropertyEditorEvent,
    CannotRetrieveCalloutParametersEvent,
    SetPropertyEditorTitleEvent
} from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { isAutomaticOutputHandlingSupported } from 'builder_platform_interaction/invocableActionLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';

export default class InvocableActionEditor extends LightningElement {
    /**
     * Internal state for the editor
     */
    @track actionCallNode = {};

    @track displaySpinner = true;
    @track invocableActionDescriptor;
    @track invocableActionParametersDescriptor;

    labels = LABELS;
    connected = false;
    processTypeValue = FLOW_PROCESS_TYPE.FLOW;

    connectedCallback() {
        this.connected = true;
        this.updatePropertyEditorTitle();
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
        this.actionCallNode = invocableActionReducer(
            this.actionCallNode,
            event
        );
        return getErrorsFromHydratedElement(this.actionCallNode);
    }

    /**
     * @returns {FLOW_PROCESS_TYPE} Flow process Type supports automatic output handling
     */
    @api
    get processType() {
        return this.processTypeValue;
    }

    set processType(newValue) {
        this.processTypeValue = newValue;
    }

    get elementType() {
        return this.actionCallNode && this.actionCallNode.elementType
            ? this.actionCallNode.elementType
            : undefined;
    }

    fetchActionParameters() {
        const actionParams = {
            actionName: getValueFromHydratedItem(this.node.actionName),
            actionType: getValueFromHydratedItem(this.node.actionType)
        };
        this.displaySpinner = true;
        this.invocableActionParametersDescriptor = undefined;
        fetchOnce(
            SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS,
            actionParams
        )
            .then(parameters => {
                if (this.connected) {
                    this.displaySpinner = false;
                    this.invocableActionParametersDescriptor = parameters;
                    const event = new CustomEvent(MERGE_WITH_PARAMETERS, {
                        detail: parameters
                    });
                    this.actionCallNode = invocableActionReducer(
                        this.actionCallNode,
                        event
                    );
                }
            })
            .catch(() => {
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
        const actionParams = {
            actionName: getValueFromHydratedItem(this.node.actionName),
            actionType: getValueFromHydratedItem(this.node.actionType)
        };
        const options = { disableErrorModal: true };
        const {
            processType: flowProcessType
        } = Store.getStore().getCurrentState().properties;
        fetchOnce(
            SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS,
            {
                flowProcessType
            },
            options
        )
            .then(invocableActions => {
                if (this.connected) {
                    this.invocableActionDescriptor = invocableActions.find(
                        action =>
                            action.name === actionParams.actionName &&
                            action.type === actionParams.actionType
                    );
                    this.updatePropertyEditorTitle();
                }
            })
            .catch(() => {
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
        const actionName =
            this.invocableActionDescriptor != null
                ? this.invocableActionDescriptor.label
                : getValueFromHydratedItem(this.actionCallNode.actionName);
        return format(
            this.labels.subtitle,
            actionName,
            ACTION_TYPE_LABEL[this.elementType]
        );
    }

    get parameterListConfig() {
        const inputs = this.invocableActionParametersDescriptor
            ? this.actionCallNode.inputParameters
            : [];
        const outputs = this.invocableActionParametersDescriptor
            ? this.actionCallNode.outputParameters
            : [];
        const warnings = getParameterListWarnings(inputs, outputs, this.labels);
        const storeOutputAutomatically = this.actionCallNode
            .storeOutputAutomatically;
        const automaticOutputHandlingSupported = isAutomaticOutputHandlingSupported(
            this.processTypeValue
        );
        return {
            inputHeader: this.labels.inputHeader,
            outputHeader: this.labels.outputHeader,
            emptyInputsTitle: this.labels.emptyInputsTitle,
            emptyInputsBody: format(
                this.labels.emptyInputsBody,
                ACTION_TYPE_LABEL[this.elementType]
            ),
            emptyOutputsTitle: this.labels.emptyOutputsTitle,
            emptyOutputsBody: format(
                this.labels.emptyOutputsBody,
                ACTION_TYPE_LABEL[this.elementType]
            ),
            sortInputs: true,
            sortOutputs: true,
            inputs,
            outputs,
            warnings,
            storeOutputAutomatically,
            automaticOutputHandlingSupported,
            emptyInputsOutputsBody: this.labels.emptyInputsOutputsBody,
            emptyInputsOutputsTitle: this.labels.emptyInputsOutputsTitle
        };
    }

    /**
     * @param {object} event - property changed event coming from label-description component or parameter-item component
     */

    handleEvent(event) {
        event.stopPropagation();
        this.actionCallNode = invocableActionReducer(
            this.actionCallNode,
            event
        );
    }

    updatePropertyEditorTitle() {
        if (this.isNewMode || !this.actionCallNode) {
            return;
        }
        const actionName =
            this.invocableActionDescriptor != null
                ? this.invocableActionDescriptor.label
                : getValueFromHydratedItem(this.actionCallNode.actionName);
        const title = format(
            this.labels.editPropertyEditorTitle,
            actionName,
            ACTION_TYPE_LABEL[this.elementType]
        );
        const setPropertyEditorTitleEvent = new SetPropertyEditorTitleEvent(
            title
        );
        this.dispatchEvent(setPropertyEditorTitleEvent);
    }

    /**
     * Handles selection/deselection of 'Use Advanced Options' checkbox
     * @param {Object} event - event
     */
    handleAdvancedOptionsSelectionChange(event) {
        event.stopPropagation();
        this.actionCallNode = invocableActionReducer(
            this.actionCallNode,
            event
        );
    }
}
