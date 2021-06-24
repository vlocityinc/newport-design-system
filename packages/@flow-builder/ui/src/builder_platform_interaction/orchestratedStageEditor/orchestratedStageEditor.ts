import { LightningElement, api } from 'lwc';
import {
    getErrorsFromHydratedElement,
    getValueFromHydratedItem,
    mergeErrorsFromHydratedElement,
    ValueWithError
} from 'builder_platform_interaction/dataMutationLib';
import {
    DeleteOrchestrationActionEvent,
    OrchestrationActionValueChangedEvent,
    PropertyChangedEvent,
    UpdateNodeEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import { LABELS } from './orchestratedStageEditorLabels';
import { orchestratedStageReducer } from './orchestratedStageReducer';
import { fetchDetailsForInvocableAction, InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { ELEMENT_TYPE, FLOW_TRANSACTION_MODEL } from 'builder_platform_interaction/flowMetadata';
import {
    getParameterListWarnings,
    MERGE_WITH_PARAMETERS,
    ParameterListConfig,
    REMOVE_UNSET_PARAMETERS
} from 'builder_platform_interaction/calloutEditorLib';
import { ParameterListRowItem } from 'builder_platform_interaction/elementFactory';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { FLOW_AUTOMATIC_OUTPUT_HANDLING } from 'builder_platform_interaction/processTypeLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';

enum EXIT_CRITERIA {
    ON_STEP_COMPLETE = 'on_step_complete',
    ON_DETERMINATION_COMPLETE = 'on_determination_complete'
}

export default class OrchestratedStageEditor extends LightningElement {
    element;

    labels = LABELS;

    isActionsFetched = false;
    availableDeterminationActions: InvocableAction[] = [];
    actionElementType = ELEMENT_TYPE.ACTION_CALL;

    exitActionParameterListConfig?: ParameterListConfig;
    exitInvocableActionParametersDescriptor?: InvocableAction;

    displayActionSpinner = false;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    editorParams;

    get isLabelCollapsibleToHeader() {
        return this.editorParams && this.editorParams.panelConfig.isLabelCollapsibleToHeader;
    }

    get styleForLabelDescription() {
        if (!this.isLabelCollapsibleToHeader) {
            return 'slds-p-horizontal_small slds-p-top_small';
        }
        return '';
    }

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.element;
    }

    /**
     * public api function to run the rules from stage validation library
     *
     * @returns list of errors
     */
    @api validate(): object {
        const event = new CustomEvent(VALIDATE_ALL);
        this.element = orchestratedStageReducer(this.element, event);

        return getErrorsFromHydratedElement(this.element);
    }

    // getter and setter for nodes don't work well with mixins
    // currently need to be copied here for each property editor node
    @api
    get node() {
        return this.element;
    }

    set node(newValue) {
        this.element = mergeErrorsFromHydratedElement(newValue, this.element);

        if (!this.element) {
            return;
        }

        // infer selected Exit Criteria on-load
        if (!this.selectedExitCriteria) {
            if (this.element.exitAction && this.element.exitAction.actionName) {
                this.selectedExitCriteria = EXIT_CRITERIA.ON_DETERMINATION_COMPLETE;
            } else {
                this.selectedExitCriteria = EXIT_CRITERIA.ON_STEP_COMPLETE;
            }
        }

        this.exitActionParameterListConfig = undefined;
        if (this.selectedExitAction) {
            this.setActionParameters(this.selectedExitAction);
        }
    }

    get stageCompletesOptions() {
        return [
            {
                label: LABELS.exitOptionBasedOnAllStepsComplete,
                value: EXIT_CRITERIA.ON_STEP_COMPLETE
            },

            {
                label: LABELS.basedOnCustomFlow,
                value: EXIT_CRITERIA.ON_DETERMINATION_COMPLETE
            }
        ];
    }

    get exitCriteriaHelpText() {
        if (this.selectedExitCriteria === EXIT_CRITERIA.ON_DETERMINATION_COMPLETE) {
            return this.labels.criteriaActionHelpText;
        }
        // a value of null will not display any Tooltip Icon
        return null;
    }

    get isExitCriteriaBasedOnCustomAction(): boolean {
        return this.selectedExitCriteria === EXIT_CRITERIA.ON_DETERMINATION_COMPLETE;
    }

    get showExitParameterList(): boolean {
        return !!this.exitActionParameterListConfig;
    }

    /**
     * Returns the information about the action element in which the configurationEditor is defined
     */
    get exitActionElementInfo() {
        const actionInfo = { apiName: '', type: 'Action' };
        if (this.exitInvocableActionParametersDescriptor) {
            actionInfo.apiName = this.exitInvocableActionParametersDescriptor.actionName;
            actionInfo.type = this.exitInvocableActionParametersDescriptor.actionType;
        }
        return actionInfo;
    }

    get selectedExitAction(): InvocableAction | null {
        if (
            this.element &&
            this.element.exitAction &&
            this.element.exitAction.actionName &&
            this.element.exitAction.actionType
        ) {
            return {
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: this.element.exitAction.actionType.value,
                actionName: this.element.exitAction.actionName.value,
                inputParameters: [],
                outputParameters: []
            };
        }
        return null;
    }

    async connectedCallback() {
        this.displayActionSpinner = true;

        try {
            const actions = await fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, {
                flowProcessType: this.processType
            });

            this.availableDeterminationActions = actions.filter((action) => action.type === 'flow');

            if (this.selectedExitAction) {
                this.setActionParameters(this.selectedExitAction);
            }
        } finally {
            this.isActionsFetched = true;
            this.displayActionSpinner = false;
        }
    }

    createActionParameterListConfig(
        inputParams: ParameterListRowItem[],
        outputParams: ParameterListRowItem[]
    ): ParameterListConfig {
        const inputs = inputParams;
        const outputs = outputParams;

        const warnings = getParameterListWarnings(inputs, outputs, this.labels);

        const storeOutputAutomatically = false;
        const automaticOutputHandlingSupported: FLOW_AUTOMATIC_OUTPUT_HANDLING =
            FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        const flowTransactionModel = getValueFromHydratedItem(FLOW_TRANSACTION_MODEL.AUTOMATIC);
        return {
            inputHeader: this.labels.inputHeader,
            outputHeader: this.labels.outputHeader,
            emptyInputsTitle: this.labels.emptyInputsTitle,
            emptyInputsBody: this.labels.thisActionHasNoInputBody,
            sortInputs: true,
            sortOutputs: true,
            flowTransactionModel,
            inputs,
            outputs,
            warnings,
            storeOutputAutomatically,
            automaticOutputHandlingSupported,
            emptyInputsOutputsBody: this.labels.thisActionHasNoInputOutputBody,
            emptyInputsOutputsTitle: this.labels.emptyInputsOutputsTitle
        };
    }

    async setActionParameters(action: InvocableAction | null) {
        if (!action) {
            return;
        }

        this.displayActionSpinner = true;

        let parameters: ParameterListRowItem[];
        try {
            parameters = (await fetchDetailsForInvocableAction(action)).parameters;
        } catch (e) {
            this.displayActionSpinner = false;
            return;
        }

        const event = new CustomEvent(MERGE_WITH_PARAMETERS, {
            detail: {
                parameters
            }
        });

        // Update the merged parameters
        this.element = orchestratedStageReducer(this.element!, event);

        this.exitActionParameterListConfig = this.createActionParameterListConfig(
            this.element!.exitActionInputParameters,
            []
        );

        this.displayActionSpinner = false;
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event) {
        event.stopPropagation();

        this.element = orchestratedStageReducer(this.element, event);

        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    handleStageCompletesChanged(event: CustomEvent) {
        this.selectedExitCriteria = event.detail.value;

        // delete any alternative Exit Criteria Metadata if necessary
        if (this.selectedExitCriteria === EXIT_CRITERIA.ON_STEP_COMPLETE) {
            const deleteExitActionEvent = new DeleteOrchestrationActionEvent(
                this.element!.guid,
                ORCHESTRATED_ACTION_CATEGORY.EXIT
            );
            this.element = orchestratedStageReducer(this.element!, deleteExitActionEvent);
        }
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    async handleExitActionSelected(e: ValueChangedEvent<InvocableAction>) {
        if (e.detail.value.actionName) {
            const actionCategory = ORCHESTRATED_ACTION_CATEGORY.EXIT;
            const orchEvt = new OrchestrationActionValueChangedEvent(actionCategory, e.detail.value, e.detail.error);
            // Update the selected action
            this.element = orchestratedStageReducer(this.element!, orchEvt);

            await this.setActionParameters(this.selectedExitAction);

            // Update the node in the store
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    updateNodeForFieldLevelCommit(rowIndex: UI.Guid) {
        const removeUnsetParamsEvent = new CustomEvent(REMOVE_UNSET_PARAMETERS, {
            detail: {
                rowIndex
            }
        });
        this.element = orchestratedStageReducer(this.element!, removeUnsetParamsEvent);
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    /**
     * @param event - property changed event coming from parameter list component
     */
    handleParameterPropertyChangedEvent(event: PropertyChangedEvent) {
        event.stopPropagation();

        const inputParam: ParameterListRowItem | undefined = this.element!.exitActionInputParameters.find(
            (p) => p.rowIndex === (<ParameterListRowItem>event.detail).rowIndex
        );
        // Only update the element if an actual change in value has occurred
        const sanitizedValue = removeCurlyBraces(event.detail.value);
        if (!!inputParam && (!inputParam!.value || (<ValueWithError>inputParam!.value).value !== sanitizedValue)) {
            this.element = orchestratedStageReducer(this.element!, event);

            this.updateNodeForFieldLevelCommit(inputParam!.rowIndex);
        }
    }

    get emptyInputs() {
        return this.exitActionParameterListConfig?.inputs.length === 0;
    }
}
