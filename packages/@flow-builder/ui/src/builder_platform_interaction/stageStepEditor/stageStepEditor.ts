import { api, LightningElement, track } from 'lwc';
import {
    getErrorsFromHydratedElement,
    getValueFromHydratedItem,
    ValueWithError
} from 'builder_platform_interaction/dataMutationLib';
import {
    ComboboxStateChangedEvent,
    CreateEntryConditionsEvent,
    DeleteAllConditionsEvent,
    PropertyChangedEvent,
    UpdateConditionEvent,
    UpdateNodeEvent,
    ValueChangedEvent,
    OrchestrationActionValueChangedEvent,
    DeleteOrchestrationActionEvent
} from 'builder_platform_interaction/events';
import { LABELS } from './stageStepEditorLabels';
import { stageStepReducer } from './stageStepReducer';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { ELEMENT_TYPE, FLOW_TRANSACTION_MODEL } from 'builder_platform_interaction/flowMetadata';
import {
    ASSIGNEE_DATA_TYPE_PROPERTY_NAME,
    ASSIGNEE_PROPERTY_NAME,
    createFEROVMetadataObject,
    getOtherItemsInOrchestratedStage,
    ParameterListRowItem,
    RELATED_RECORD_INPUT_PARAMETER_NAME,
    StageStep
} from 'builder_platform_interaction/elementFactory';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import { FEROV_DATA_TYPE, FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { fetchDetailsForInvocableAction, InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import {
    getParameterListWarnings,
    MERGE_WITH_PARAMETERS,
    ParameterListConfig,
    REMOVE_UNSET_PARAMETERS
} from 'builder_platform_interaction/calloutEditorLib';
import { FLOW_AUTOMATIC_OUTPUT_HANDLING } from 'builder_platform_interaction/processTypeLib';
import { removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { LIGHTNING_INPUT_VARIANTS } from 'builder_platform_interaction/screenEditorUtils';
import {
    getFerovDataTypeForValidId,
    getResourceByUniqueIdentifier
} from 'builder_platform_interaction/expressionUtils';

export enum ENTRY_CRITERIA {
    ON_STAGE_START = 'on_stage_start',
    ON_STEP_COMPLETE = 'on_step_complete',
    ON_DETERMINATION_COMPLETE = 'on_determination_complete'
}

export enum EXIT_CRITERIA {
    ON_STEP_COMPLETE = 'on_step_complete',
    ON_DETERMINATION_COMPLETE = 'on_determination_complete'
}

// Standard inputs that should not show up as inputs associated with the selected action
const STANDARD_INPUT_PREFIX = 'ActionInput__';

export default class StageStepEditor extends LightningElement {
    labels = LABELS;

    element?: StageStep;

    selectedEntryCriteria?: ENTRY_CRITERIA;
    selectedExitCriteria?: EXIT_CRITERIA;

    // For step based entry criteria
    entryConditionsAvailableStepItems: UI.ComboboxItem[] = [];
    entryConditionsSelectedItem?: UI.ComboboxItem;

    entryActionsAvailableActionItems: UI.ComboboxItem[] = [];
    entryActionsSelectedItem?: UI.ComboboxItem;

    isActionsFetched = false;

    availableActions: InvocableAction[] = [];
    availableDeterminationActions: InvocableAction[] = [];

    actionElementType = ELEMENT_TYPE.ACTION_CALL;

    actionParameterListConfig?: ParameterListConfig;
    invocableActionParametersDescriptor?: InvocableAction;

    entryActionParameterListConfig?: ParameterListConfig;
    entryInvocableActionParametersDescriptor?: InvocableAction;

    exitActionParameterListConfig?: ParameterListConfig;
    exitInvocableActionParametersDescriptor?: InvocableAction;

    displayActionSpinner = false;

    actorPickerId = generateGuid();

    rules = [];

    @track
    actorErrorMessage;

    recordPickerId = generateGuid();
    recordErrorMessage;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    editorParams;

    constructor() {
        super();
        this.rules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.STAGE_STEP);
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.element;
    }

    /**
     * public api function to run the rules from stage validation library
     * @returns list of errors
     */
    @api validate(): object {
        // const event = { type: VALIDATE_ALL };
        return getErrorsFromHydratedElement(this.element);
    }

    // getter and setter for nodes don't work well with mixins
    // currently need to be copied here for each property editor node
    @api
    get node() {
        return this.element;
    }

    set node(newValue) {
        this.element = newValue;

        if (!this.element) {
            return;
        }

        // infer selected Entry Criteria on-load
        if (!this.selectedEntryCriteria) {
            if (this.element.entryAction && this.element.entryAction.actionName) {
                // entryAction exists and has populated data
                this.selectedEntryCriteria = ENTRY_CRITERIA.ON_DETERMINATION_COMPLETE;
            } else if (
                this.element.entryConditions &&
                this.element.entryConditions instanceof Array &&
                this.element.entryConditions.length > 0
            ) {
                this.selectedEntryCriteria = ENTRY_CRITERIA.ON_STEP_COMPLETE;
            } else {
                this.selectedEntryCriteria = ENTRY_CRITERIA.ON_STAGE_START;
            }
        }

        // infer selected Exit Criteria on-load
        if (!this.selectedExitCriteria) {
            if (this.element.exitAction && this.element.exitAction.actionName) {
                this.selectedExitCriteria = EXIT_CRITERIA.ON_DETERMINATION_COMPLETE;
            } else {
                this.selectedExitCriteria = EXIT_CRITERIA.ON_STEP_COMPLETE;
            }
        }

        const otherItems: StageStep[] = getOtherItemsInOrchestratedStage(this.element.guid);

        this.entryConditionsAvailableStepItems = [];

        otherItems.forEach((stageStep) => {
            const comboboxItem: UI.ComboboxItem = {
                type: 'option-card',
                dataType: FLOW_DATA_TYPE.STRING.value,
                text: stageStep.label,
                displayText: stageStep.label || '',
                value: `${stageStep.guid}.Status` || ''
            };

            // This depends on stageStep entry criteria always having the shape
            // "devName.status" "EqualTo" "Completed".  For 230, we only parse the LHS devName
            if (
                this.element!.entryConditions &&
                this.element!.entryConditions.length > 0 &&
                this.element!.entryConditions[0].leftHandSide!.value === `${stageStep.guid}.Status`
            ) {
                this.entryConditionsSelectedItem = comboboxItem;
            }

            this.entryConditionsAvailableStepItems.push(comboboxItem);
        });

        this.setActionParameters(this.selectedAction, ORCHESTRATED_ACTION_CATEGORY.STEP);

        this.entryActionParameterListConfig = undefined;
        if (this.selectedEntryAction) {
            this.setActionParameters(this.selectedEntryAction, ORCHESTRATED_ACTION_CATEGORY.ENTRY);
        }

        this.exitActionParameterListConfig = undefined;
        if (this.selectedExitAction) {
            this.setActionParameters(this.selectedExitAction, ORCHESTRATED_ACTION_CATEGORY.EXIT);
        }
    }

    get isLabelCollapsibleToHeader() {
        return this.editorParams && this.editorParams.panelConfig.isLabelCollapsibleToHeader;
    }

    get styleForLabelDescription() {
        if (!this.isLabelCollapsibleToHeader) {
            return 'slds-p-horizontal_small slds-p-top_small';
        }
        return '';
    }

    get stepStartOptions() {
        return [
            {
                label: LABELS.startOptionStageStart,
                value: ENTRY_CRITERIA.ON_STAGE_START
            },

            {
                label: LABELS.startOptionBasedOnOtherStep,
                value: ENTRY_CRITERIA.ON_STEP_COMPLETE
            },

            {
                label: LABELS.basedOnCustomFlow,
                value: ENTRY_CRITERIA.ON_DETERMINATION_COMPLETE
            }
        ];
    }

    get stepCompletesOptions() {
        return [
            {
                label: LABELS.whenStepIsComplete,
                value: EXIT_CRITERIA.ON_STEP_COMPLETE
            },

            {
                label: LABELS.basedOnCustomFlow,
                value: EXIT_CRITERIA.ON_DETERMINATION_COMPLETE
            }
        ];
    }

    get stepStartValue(): string {
        return this.stepStartOptions[0].value;
    }

    get isStartCriteriaBasedOnStep(): boolean {
        return this.selectedEntryCriteria === ENTRY_CRITERIA.ON_STEP_COMPLETE;
    }

    get isStartCriteriaBasedOnCustomAction(): boolean {
        return this.selectedEntryCriteria === ENTRY_CRITERIA.ON_DETERMINATION_COMPLETE;
    }

    get isExitCriteriaBasedOnCustomAction(): boolean {
        return this.selectedExitCriteria === EXIT_CRITERIA.ON_DETERMINATION_COMPLETE;
    }

    get showParameterList(): boolean {
        return !!this.actionParameterListConfig;
    }

    get showEntryParameterList(): boolean {
        return !!this.entryActionParameterListConfig;
    }

    get showExitParameterList(): boolean {
        return !!this.exitActionParameterListConfig;
    }

    createActionParameterListConfig(
        inputParams: ParameterListRowItem[],
        outputParams: ParameterListRowItem[]
    ): ParameterListConfig {
        const inputs = this.filterActionInputParameters(inputParams);
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

    /**
     * Returns the information about the action element in which the configurationEditor is defined
     */
    get actionElementInfo() {
        const actionInfo = { apiName: '', type: 'Action' };
        if (this.invocableActionParametersDescriptor) {
            actionInfo.apiName = this.invocableActionParametersDescriptor.actionName;
            actionInfo.type = this.invocableActionParametersDescriptor.actionType;
        }
        return actionInfo;
    }

    get selectedAction(): InvocableAction | null {
        if (this.element && this.element.action && this.element.action.actionName.value !== '') {
            return {
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: this.element.action.actionType.value,
                actionName: this.element.action.actionName.value,
                inputParameters: [],
                outputParameters: []
            };
        }

        return null;
    }

    /**
     * Returns the information about the action element in which the configurationEditor is defined
     */
    get entryActionElementInfo() {
        const actionInfo = { apiName: '', type: 'Action' };
        if (this.entryInvocableActionParametersDescriptor) {
            actionInfo.apiName = this.entryInvocableActionParametersDescriptor.actionName;
            actionInfo.type = this.entryInvocableActionParametersDescriptor.actionType;
        }
        return actionInfo;
    }

    get selectedEntryAction(): InvocableAction | null {
        if (
            this.element &&
            this.element.entryAction &&
            this.element.entryAction.actionName &&
            this.element.entryAction.actionType
        ) {
            return {
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: this.element.entryAction.actionType.value,
                actionName: this.element.entryAction.actionName.value,
                inputParameters: [],
                outputParameters: []
            };
        }
        return null;
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

    get recordValue() {
        return this.element?.relatedRecordItem ? this.element.relatedRecordItem.value : null;
    }

    get recordComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.recordSelectorLabel, // Label
            this.labels.recordSelectorPlaceholder, // Placeholder
            this.error, // errorMessage
            true, // literalsAllowed
            true, // required
            false, // disabled
            FLOW_DATA_TYPE.STRING.value,
            true, // enableFieldDrilldown,
            true, // allowSObjectFields
            LIGHTNING_INPUT_VARIANTS.STANDARD,
            this.labels.recordSelectorTooltip // Field-level Help
        );
    }

    get recordElementParam() {
        return {
            dataType: FLOW_DATA_TYPE.STRING.value,
            collection: false
        };
    }

    get actorValue() {
        if (this.element && this.element.assignees && this.element.assignees.length > 0) {
            if (this.element.assignees[0].assignee.elementReference) {
                return this.element.assignees[0].assignee.elementReference;
            }
            return this.element.assignees[0].assignee.assignee;
        }
        return null;
    }

    get propertyEditorElementType() {
        return ELEMENT_TYPE.STAGE_STEP;
    }

    get entryCriteriaHelpText() {
        if (this.selectedEntryCriteria === ENTRY_CRITERIA.ON_DETERMINATION_COMPLETE) {
            return this.labels.criteriaActionHelpText;
        } else if (this.selectedEntryCriteria === ENTRY_CRITERIA.ON_STEP_COMPLETE) {
            return this.labels.criteriaBasedOnStepHelpText;
        }
        // a value of null will not display any Tooltip Icon
        return null;
    }

    get exitCriteriaHelpText() {
        if (this.selectedExitCriteria === EXIT_CRITERIA.ON_DETERMINATION_COMPLETE) {
            return this.labels.criteriaActionHelpText;
        }
        // a value of null will not display any Tooltip Icon
        return null;
    }

    get actorComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.actorSelectorLabel, // Label
            this.labels.actorSelectorPlaceholder, // Placeholder
            this.error, // errorMessage
            true, // literalsAllowed
            true, // required
            false, // disabled
            FLOW_DATA_TYPE.STRING.value,
            true, // enableFieldDrilldown,
            true, // allowSObjectFields
            LIGHTNING_INPUT_VARIANTS.STANDARD,
            this.labels.actorSelectorTooltip // Field-level Help
        );
    }

    get actorElementParam() {
        return {
            dataType: FLOW_DATA_TYPE.STRING.value,
            collection: false
        };
    }

    get resourcePickerRules() {
        return this.rules;
    }

    async connectedCallback() {
        this.displayActionSpinner = true;

        try {
            const actions = await fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, {
                flowProcessType: this.processType
            });

            this.displayActionSpinner = false;
            this.isActionsFetched = true;

            const stepActions: InvocableAction[] = [];
            const determinationActions: InvocableAction[] = [];
            actions.forEach((action) =>
                action.type === 'flow' ? determinationActions.push(action) : stepActions.push(action)
            );

            this.availableActions = stepActions;
            this.availableDeterminationActions = determinationActions;

            if (this.selectedAction) {
                await this.setActionParameters(this.selectedAction, ORCHESTRATED_ACTION_CATEGORY.STEP);
            }
            if (this.selectedEntryAction) {
                await this.setActionParameters(this.selectedEntryAction, ORCHESTRATED_ACTION_CATEGORY.ENTRY);
            }
            if (this.selectedEntryAction) {
                await this.setActionParameters(this.selectedExitAction, ORCHESTRATED_ACTION_CATEGORY.EXIT);
            }
        } catch (err) {
            this.isActionsFetched = true;
            this.displayActionSpinner = false;
        }
    }

    /**
     * Filters out input parameters that are for engine use only.
     * For later releases, we'll investigate excluding them on the server side
     *
     * @param inputParameters
     */
    filterActionInputParameters(inputParameters: ParameterListRowItem[] = []): ParameterListRowItem[] {
        return inputParameters.filter((inputParameter: ParameterListRowItem) => {
            return typeof inputParameter.name === 'string'
                ? !inputParameter.name.startsWith(STANDARD_INPUT_PREFIX)
                : !inputParameter.name.value.startsWith(STANDARD_INPUT_PREFIX);
        });
    }

    async setActionParameters(action: InvocableAction | null, actionCategory: ORCHESTRATED_ACTION_CATEGORY) {
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
                parameters,
                actionCategory
            }
        });

        // Update the merged parameters
        this.element = stageStepReducer(this.element!, event);

        // use actionCategory here
        if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.STEP) {
            this.actionParameterListConfig = this.createActionParameterListConfig(
                this.element!.inputParameters,
                this.element!.outputParameters
            );
        } else if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.ENTRY) {
            this.entryActionParameterListConfig = this.createActionParameterListConfig(
                this.element!.entryActionInputParameters,
                []
            );
        } else if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.EXIT) {
            this.exitActionParameterListConfig = this.createActionParameterListConfig(
                this.element!.exitActionInputParameters,
                []
            );
        }

        this.displayActionSpinner = false;
    }

    updateNodeForFieldLevelCommit(rowIndex: UI.Guid) {
        const removeUnsetParamsEvent = new CustomEvent(REMOVE_UNSET_PARAMETERS, {
            detail: {
                rowIndex
            }
        });
        this.element = stageStepReducer(this.element!, removeUnsetParamsEvent);
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    /**
     * @param event - property changed event coming from the label description component
     */
    handleLabelDescriptionPropertyChangedEvent(event: PropertyChangedEvent) {
        event.stopPropagation();

        this.element = stageStepReducer(this.element!, event);

        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    /**
     * @param event - property changed event coming from parameter list component
     */
    handleParameterPropertyChangedEvent(event: PropertyChangedEvent) {
        event.stopPropagation();

        const inputParam: ParameterListRowItem | undefined = ([] as ParameterListRowItem[])
            .concat(
                this.element!.inputParameters,
                this.element!.entryActionInputParameters,
                this.element!.exitActionInputParameters
            )
            .find((p) => p.rowIndex === (<ParameterListRowItem>event.detail).rowIndex);
        // Only update the element if an actual change in value has occurred
        const sanitizedValue = removeCurlyBraces(event.detail.value);
        if (!!inputParam && (!inputParam.value || (<ValueWithError>inputParam.value).value !== sanitizedValue)) {
            this.element = stageStepReducer(this.element!, event);

            this.updateNodeForFieldLevelCommit(inputParam.rowIndex);
        }
    }

    handleStepStartChanged(event: CustomEvent) {
        this.selectedEntryCriteria = event.detail.value;

        // delete any alternative Entry Criteria Metadata if necessary

        if (this.selectedEntryCriteria === ENTRY_CRITERIA.ON_STAGE_START) {
            const deleteEntryCriteriaEvent = new DeleteAllConditionsEvent(this.element!.guid);
            this.element = stageStepReducer(this.element!, deleteEntryCriteriaEvent);

            const deleteEntryActionEvent = new DeleteOrchestrationActionEvent(
                this.element!.guid,
                ORCHESTRATED_ACTION_CATEGORY.ENTRY
            );
            this.element = stageStepReducer(this.element!, deleteEntryActionEvent);

            this.dispatchEvent(new UpdateNodeEvent(this.element));
        } else if (this.selectedEntryCriteria === ENTRY_CRITERIA.ON_STEP_COMPLETE) {
            const deleteEntryActionEvent = new DeleteOrchestrationActionEvent(
                this.element!.guid,
                ORCHESTRATED_ACTION_CATEGORY.ENTRY
            );
            this.element = stageStepReducer(this.element!, deleteEntryActionEvent);
            this.element = stageStepReducer(this.element!, new CreateEntryConditionsEvent(this.element!.guid));
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    handleStepCompletesChanged(event: CustomEvent) {
        this.selectedExitCriteria = event.detail.value;

        // delete any alternative Exit Criteria Metadata if necessary
        if (this.selectedExitCriteria === EXIT_CRITERIA.ON_STEP_COMPLETE) {
            const deleteExitActionEvent = new DeleteOrchestrationActionEvent(
                this.element!.guid,
                ORCHESTRATED_ACTION_CATEGORY.EXIT
            );
            this.element = stageStepReducer(this.element!, deleteExitActionEvent);
            this.element = stageStepReducer(this.element!, new CreateEntryConditionsEvent(this.element!.guid));
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    async handleActionSelected(e: ValueChangedEvent<InvocableAction>) {
        if (e.detail.value.actionName) {
            const actionCategory = ORCHESTRATED_ACTION_CATEGORY.STEP;
            const orchEvt = new OrchestrationActionValueChangedEvent(actionCategory, e.detail.value, e.detail.error);

            // Update the selected action
            this.element = stageStepReducer(this.element!, orchEvt);

            await this.setActionParameters(this.selectedAction, actionCategory);

            // Update the node in the store
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    async handleEntryActionSelected(e: ValueChangedEvent<InvocableAction>) {
        if (e.detail.value.actionName) {
            const actionCategory = ORCHESTRATED_ACTION_CATEGORY.ENTRY;
            const orchEvt = new OrchestrationActionValueChangedEvent(actionCategory, e.detail.value, e.detail.error);

            // Update the selected action
            this.element = stageStepReducer(this.element!, orchEvt);

            await this.setActionParameters(this.selectedEntryAction, actionCategory);

            // Update the node in the store
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    async handleExitActionSelected(e: ValueChangedEvent<InvocableAction>) {
        if (e.detail.value.actionName) {
            const actionCategory = ORCHESTRATED_ACTION_CATEGORY.EXIT;
            const orchEvt = new OrchestrationActionValueChangedEvent(actionCategory, e.detail.value, e.detail.error);
            // Update the selected action
            this.element = stageStepReducer(this.element!, orchEvt);

            await this.setActionParameters(this.selectedExitAction, actionCategory);

            // Update the node in the store
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    handleEntryCriteriaItemChanged(e: ComboboxStateChangedEvent) {
        if (e.detail.item) {
            const updateEntryCriteria = new UpdateConditionEvent(this.element!.guid, 0, {
                leftValueReference: e.detail.item.value,
                operator: 'EqualTo',
                rightValue: {
                    stringValue: 'Completed'
                }
            });
            this.element = stageStepReducer(this.element!, updateEntryCriteria);
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    handleActorChanged = (event) => {
        event.stopPropagation();

        let assignee = event.detail.item ? event.detail.item.value : event.detail.displayText;
        if (assignee === '') {
            assignee = null;
        }

        let ferovDataType: string | null = FEROV_DATA_TYPE.STRING;
        if (getResourceByUniqueIdentifier(assignee)) {
            ferovDataType = getFerovDataTypeForValidId(assignee);
        }

        const assignees = [
            {
                assignee: createFEROVMetadataObject(
                    {
                        assignee,
                        assigneeDataType: ferovDataType
                    },
                    ASSIGNEE_PROPERTY_NAME,
                    ASSIGNEE_DATA_TYPE_PROPERTY_NAME
                ),
                assigneeType: 'User'
            }
        ];
        const error = event.detail.item ? event.detail.item.error : event.detail.error;
        const updateActor = new PropertyChangedEvent('assignees', assignees, error);
        this.element = stageStepReducer(this.element!, updateActor);
        this.actorErrorMessage = error;
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    };

    handleRecordChanged = (event) => {
        event.stopPropagation();

        let recordIdValue = event.detail.item ? event.detail.item.value : event.detail.displayText;
        if (recordIdValue === '') {
            recordIdValue = null;
        }

        let valueDataType: string = FEROV_DATA_TYPE.STRING;
        if (getResourceByUniqueIdentifier(recordIdValue)) {
            const ferovDataType: string | null = getFerovDataTypeForValidId(recordIdValue);
            if (ferovDataType) {
                valueDataType = ferovDataType;
            }
        }

        const error = event.detail.item ? event.detail.item.error : event.detail.error;

        const inputParam: ParameterListRowItem | undefined = this.element!.inputParameters.find((p) => {
            const name = typeof p.name === 'string' ? p.name : p.name.value;
            return name === RELATED_RECORD_INPUT_PARAMETER_NAME;
        });

        // Only update the element if an actual change in value has occurred
        const sanitizedValue = removeCurlyBraces(recordIdValue);
        if (!inputParam || !inputParam.value || (<ValueWithError>inputParam.value).value !== sanitizedValue) {
            let valueToSet: ParameterListRowItem | null = null;

            if (recordIdValue) {
                valueToSet = {
                    // Empty string only if no action has been selected yet
                    rowIndex: inputParam ? inputParam.rowIndex : '',
                    name: RELATED_RECORD_INPUT_PARAMETER_NAME,
                    value: recordIdValue,
                    valueDataType
                };
            }

            const updateRecord = new PropertyChangedEvent('relatedRecordItem', valueToSet, error);
            this.element = stageStepReducer(this.element!, updateRecord);

            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    };
}
