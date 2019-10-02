import { LightningElement, api, track } from 'lwc';
import { LABELS } from './subflowEditorLabels';
import {
    fetchOnce,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import {
    getValueFromHydratedItem,
    getErrorsFromHydratedElement
} from 'builder_platform_interaction/dataMutationLib';
import { format } from 'builder_platform_interaction/commonUtils';
import {
    subflowReducer,
    MERGE_WITH_VARIABLES,
    REMOVE_UNSET_ASSIGNMENTS
} from './subflowReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getParameterListWarnings } from 'builder_platform_interaction/calloutEditorLib';
import {
    ClosePropertyEditorEvent,
    CannotRetrieveCalloutParametersEvent,
    SetPropertyEditorTitleEvent
} from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';

export default class SubflowEditor extends LightningElement {
    @track subflowNode = {};

    @track displaySpinner = true;

    @track subflowDescriptor;

    @track subflowVariablesDescriptor;

    @track subflowRunInMode;

    labels = LABELS;
    connected = false;

    // true if we are creating a new subflow element, false if editing an existing subflow element
    @api
    isNewMode = false;

    connectedCallback() {
        this.connected = true;
        this.updatePropertyEditorTitle();
        if (this.subflowNode) {
            this.fetchSubflowDescriptor();
            this.fetchFlowInputOutputVariables();
            this.fetchSubflowRunInMode();
        }
    }

    disconnectedCallback() {
        this.connected = false;
    }

    fetchFlowInputOutputVariables() {
        this.displaySpinner = true;
        this.subflowVariablesDescriptor = undefined;
        const flowName = getValueFromHydratedItem(this.subflowNode.flowName);
        const serverActionParams = { flowName };
        fetchOnce(
            SERVER_ACTION_TYPE.GET_FLOW_INPUT_OUTPUT_VARIABLES,
            serverActionParams
        )
            .then(inputOutputVariables => {
                if (this.connected) {
                    this.displaySpinner = false;
                    this.subflowVariablesDescriptor = inputOutputVariables;
                    const event = new CustomEvent(MERGE_WITH_VARIABLES, {
                        detail: inputOutputVariables
                    });
                    this.subflowNode = subflowReducer(this.subflowNode, event);
                }
            })
            .catch(() => {
                if (this.connected) {
                    this.displaySpinner = false;
                    this.cannotRetrieveParameters();
                }
            });
    }

    fetchSubflowRunInMode() {
        this.subflowRunInMode = undefined;
        const flowName = getValueFromHydratedItem(this.subflowNode.flowName);
        const serverActionParams = { flowName };
        fetchOnce(
            SERVER_ACTION_TYPE.GET_FLOW_ACTIVE_OR_LATEST_RUN_IN_MODE,
            serverActionParams
        )
            .then(runInMode => {
                if (this.connected) {
                    this.subflowRunInMode = runInMode;
                }
            })
            .catch(() => {
                // ignore the error.
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

    fetchSubflowDescriptor() {
        this.subflowDescriptor = undefined;
        const flowName = getValueFromHydratedItem(this.subflowNode.flowName);
        const options = { disableErrorModal: true };
        const {
            processType: flowProcessType
        } = Store.getStore().getCurrentState().properties;
        fetchOnce(
            SERVER_ACTION_TYPE.GET_SUBFLOWS,
            {
                flowProcessType
            },
            options
        )
            .then(subflows => {
                if (this.connected) {
                    this.subflowDescriptor = subflows.find(
                        f => f.fullName === flowName
                    );
                    this.updatePropertyEditorTitle();
                }
            })
            .catch(() => {
                // ignore the error : we won't use the subflowDescriptor in this case
            });
    }

    updatePropertyEditorTitle() {
        if (this.isNewMode || !this.subflowNode) {
            return;
        }
        const flowName =
            this.subflowDescriptor != null
                ? this.subflowDescriptor.masterLabel
                : getValueFromHydratedItem(this.subflowNode.flowName);
        const title = format(this.labels.editPropertyEditorTitle, flowName);
        const setPropertyEditorTitleEvent = new SetPropertyEditorTitleEvent(
            title
        );
        this.dispatchEvent(setPropertyEditorTitleEvent);
    }

    @api
    get node() {
        return this.subflowNode;
    }

    set node(newValue) {
        this.subflowNode = newValue || {};
        if (this.connected) {
            this.fetchSubflowDescriptor();
            this.fetchFlowInputOutputVariables();
            this.fetchSubflowRunInMode();
        }
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        const event = new CustomEvent(REMOVE_UNSET_ASSIGNMENTS);
        return subflowReducer(this.subflowNode, event);
    }

    /**
     * public api function to run the rules from actionCall validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        const event = new CustomEvent(VALIDATE_ALL);
        this.subflowNode = subflowReducer(this.subflowNode, event);
        return getErrorsFromHydratedElement(this.subflowNode);
    }

    get elementType() {
        return this.subflowNode && this.subflowNode.elementType
            ? this.subflowNode.elementType
            : undefined;
    }

    get subtitle() {
        if (!this.subflowNode) {
            return '';
        }
        const flowName =
            this.subflowDescriptor != null
                ? this.subflowDescriptor.masterLabel
                : getValueFromHydratedItem(this.subflowNode.flowName);
        return format(this.labels.subtitle, flowName);
    }

    get runInMode() {
        if (!this.subflowNode) {
            return '';
        }
        const flowRunInMode = this.subflowRunInMode != null
                ? this.subflowRunInMode.name
                : '';
        return format(this.labels.runInMode, flowRunInMode);
    }

    get parameterListConfig() {
        const inputs = this.subflowVariablesDescriptor
            ? this.subflowNode.inputAssignments
            : [];
        const outputs = this.subflowVariablesDescriptor
            ? this.subflowNode.outputAssignments
            : [];
        const warnings = getParameterListWarnings(inputs, outputs, this.labels);
        return {
            inputHeader: this.labels.inputHeader,
            outputHeader: this.labels.outputHeader,
            emptyInputsTitle: this.labels.emptyInputsTitle,
            emptyInputsBody: format(
                this.labels.emptyInputsBody,
                this.labels.subflowTypeLabel
            ),
            emptyOutputsTitle: this.labels.emptyOutputsTitle,
            emptyOutputsBody: format(
                this.labels.emptyOutputsBody,
                this.labels.subflowTypeLabel
            ),
            sortInputs: true,
            sortOutputs: true,
            inputs,
            outputs,
            warnings,
            emptyInputsOutputsBody: this.labels.emptyInputsOutputsBody,
            emptyInputsOutputsTitle: this.labels.emptyInputsOutputsTitle
        };
    }

    /**
     * @param {object} event - property changed event coming from label-description component and parameter-item component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.subflowNode = subflowReducer(this.subflowNode, event);
    }
}
