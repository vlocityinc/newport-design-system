import {
    getParameterListWarnings,
    MERGE_WITH_PARAMETERS,
    ParameterListConfig,
    REMOVE_UNSET_PARAMETERS
} from 'builder_platform_interaction/calloutEditorLib';
import { removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { getValueFromHydratedItem, ValueWithError } from 'builder_platform_interaction/dataMutationLib';
import { OrchestratedStage, ParameterListRowItem } from 'builder_platform_interaction/elementFactory';
import {
    DeleteOrchestrationActionEvent,
    ORCHESTRATED_ACTION_CATEGORY,
    OrchestrationActionValueChangedEvent,
    PropertyChangedEvent,
    UpdateEntryExitCriteriaEvent,
    UpdateNodeEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import {
    ACTION_TYPE,
    ELEMENT_TYPE,
    FLOW_TRANSACTION_MODEL,
    StageExitCriteria
} from 'builder_platform_interaction/flowMetadata';
import { getFlowIdsForNames, openFlow } from 'builder_platform_interaction/inlineOpenFlowUtils';
import { fetchDetailsForInvocableAction, InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import PanelBasedPropertyEditor from 'builder_platform_interaction/panelBasedPropertyEditor';
import { FLOW_AUTOMATIC_OUTPUT_HANDLING } from 'builder_platform_interaction/processTypeLib';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { api } from 'lwc';
import { LABELS } from './orchestratedStageEditorLabels';
import { orchestratedStageReducer } from './orchestratedStageReducer';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description'
};
export default class OrchestratedStageEditor extends PanelBasedPropertyEditor<OrchestratedStage> {
    labels = LABELS;

    isActionsFetched = false;
    availableDeterminationActions: InvocableAction[] = [];
    actionElementType = ELEMENT_TYPE.ACTION_CALL;
    exitActionErrorMessage;

    exitActionParameterListConfig?: ParameterListConfig;

    exitInvocableActionParametersDescriptor?: InvocableAction;

    displayActionSpinner = false;

    selectedExitCriteria?: StageExitCriteria;

    flowNamesToIds: {} = {};

    elementBlackListFields = ['stageSteps'];

    constructor() {
        super(orchestratedStageReducer);
    }

    @api
    triggerType;

    @api
    focus() {
        const labelDescription = this.template.querySelector(SELECTORS.LABEL_DESCRIPTION) as any;
        labelDescription.focus?.();
    }

    get isLabelCollapsibleToHeader() {
        return this.editorParams?.panelConfig?.isLabelCollapsibleToHeader;
    }

    get styleForLabelDescription() {
        if (!this.isLabelCollapsibleToHeader) {
            return 'slds-p-horizontal_small slds-p-top_small';
        }
        return '';
    }

    override onSetNode(): void {
        this.selectedExitCriteria = (this.element.exitCriteria as ValueWithError).value as StageExitCriteria;

        if (this.selectedExitAction?.actionName) {
            this.setActionParameters(this.selectedExitAction);
        }
    }

    get stageCompletesOptions() {
        return [
            {
                label: LABELS.exitOptionBasedOnAllStepsComplete,
                value: StageExitCriteria.ON_STEP_COMPLETE
            },

            {
                label: LABELS.completeOptionBasedOnCustomFlow,
                value: StageExitCriteria.ON_DETERMINATION_COMPLETE
            }
        ];
    }

    get exitCriteriaHelpText() {
        if (this.selectedExitCriteria === StageExitCriteria.ON_DETERMINATION_COMPLETE) {
            return this.labels.criteriaActionHelpText;
        }
        // a value of null will not display any Tooltip Icon
        return null;
    }

    get isExitCriteriaBasedOnCustomAction(): boolean {
        return this.selectedExitCriteria === StageExitCriteria.ON_DETERMINATION_COMPLETE;
    }

    get showExitParameterList(): boolean {
        return (
            this.selectedExitAction?.actionName && !this.exitActionErrorMessage && !!this.exitActionParameterListConfig
        );
    }

    /**
     * Returns the information about the action element in which the configurationEditor is defined
     *
     * @returns The exit action.  This will always be an object, but if not a valid action,
     * apiName will be ''
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
        if (this.element?.exitAction?.actionName.error) {
            this.exitActionErrorMessage = this.element?.exitAction.actionName.error;
        }

        if (this.element && this.element.exitAction && this.element.exitAction.actionName.value !== '') {
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
                flowProcessType: this.processType,
                flowTriggerType: this.triggerType
            });

            this.availableDeterminationActions = actions.filter(
                (action) => action.type === ACTION_TYPE.EVALUATION_FLOW
            );

            this.flowNamesToIds = await getFlowIdsForNames(actions.map((action) => action.name));

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
        if (!action?.actionName) {
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
        this.element = this.reducer(this.element!, event);

        this.exitActionParameterListConfig = this.createActionParameterListConfig(
            this.element!.exitActionInputParameters,
            []
        );

        this.displayActionSpinner = false;
    }

    handleStageCompletesChanged(event: CustomEvent) {
        this.selectedExitCriteria = event.detail.value;

        // Update element exitCriteria
        const updateExitCriteriaEvent = new UpdateEntryExitCriteriaEvent(
            ORCHESTRATED_ACTION_CATEGORY.EXIT,
            this.selectedExitCriteria
        );
        this.element = this.reducer(this.element!, updateExitCriteriaEvent);

        // delete any alternative Exit Criteria Metadata if necessary
        if (this.selectedExitCriteria === StageExitCriteria.ON_STEP_COMPLETE) {
            const deleteExitActionEvent = new DeleteOrchestrationActionEvent(
                this.element!.guid,
                ORCHESTRATED_ACTION_CATEGORY.EXIT
            );
            this.element = this.reducer(this.element!, deleteExitActionEvent);
        }
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    async handleExitActionSelected(e: ValueChangedEvent<InvocableAction>) {
        e.detail.value!.actionType = ACTION_TYPE.EVALUATION_FLOW;
        const orchEvt = new OrchestrationActionValueChangedEvent(
            ORCHESTRATED_ACTION_CATEGORY.EXIT,
            e.detail.value,
            e.detail.error
        );
        this.element = this.reducer(this.element!, orchEvt);

        if (e.detail.value!.actionName) {
            await this.setActionParameters(this.selectedExitAction);
        }

        this.exitActionErrorMessage = e.detail.item ? e.detail.item.error : e.detail.error;

        // Update the node in the store
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    updateNodeForFieldLevelCommit(rowIndex: UI.Guid) {
        const removeUnsetParamsEvent = new CustomEvent(REMOVE_UNSET_PARAMETERS, {
            detail: {
                rowIndex
            }
        });
        this.updateElement(removeUnsetParamsEvent);
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
            this.element = this.reducer(this.element!, event);

            this.updateNodeForFieldLevelCommit(inputParam!.rowIndex);
        }
    }

    get emptyInputs() {
        return this.exitActionParameterListConfig?.inputs?.length === 0;
    }

    get showOpenExitConditionFlow(): boolean {
        return (
            this.selectedExitAction?.actionName &&
            !this.exitActionErrorMessage &&
            this.selectedExitCriteria === StageExitCriteria.ON_DETERMINATION_COMPLETE
        );
    }

    handleOpenExitConditionFlowClicked() {
        const flowId = this.flowNamesToIds[this.selectedExitAction?.actionName];
        openFlow(flowId);
    }
}
