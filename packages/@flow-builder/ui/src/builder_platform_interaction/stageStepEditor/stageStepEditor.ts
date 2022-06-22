import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import {
    getParameterListWarnings,
    MERGE_WITH_PARAMETERS,
    ParameterListConfig,
    REMOVE_UNSET_PARAMETERS
} from 'builder_platform_interaction/calloutEditorLib';
import { isUndefinedOrNull, removeCurlyBraces } from 'builder_platform_interaction/commonUtils';
import {
    getErrorsFromHydratedElement,
    getValueFromHydratedItem,
    ValueWithError
} from 'builder_platform_interaction/dataMutationLib';
import { FEROV_DATA_TYPE, FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    ASSIGNEE_DATA_TYPE_PROPERTY_NAME,
    ASSIGNEE_PROPERTY_NAME,
    ASSIGNEE_RESOURCE_TYPE,
    ASSIGNEE_TYPE,
    createFEROVMetadataObject,
    getOtherItemsInOrchestratedStage,
    isParameterListRowItem,
    ParameterListRowItem,
    RELATED_RECORD_INPUT_PARAMETER_NAME,
    StageStep
} from 'builder_platform_interaction/elementFactory';
import {
    ComboboxStateChangedEvent,
    CreateEntryConditionsEvent,
    DeleteAllConditionsEvent,
    DeleteOrchestrationActionEvent,
    ItemSelectedEvent,
    ORCHESTRATED_ACTION_CATEGORY,
    OrchestrationActionValueChangedEvent,
    OrchestrationAssigneeChangedEvent,
    OrchestrationStageStepEditorValidateEvent,
    PropertyChangedEvent,
    RequiresAsyncProcessingChangedEvent,
    UpdateConditionEvent,
    UpdateEntryExitCriteriaEvent,
    UpdateNodeEvent,
    UpdateParameterItemEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import {
    getFerovDataTypeForValidId,
    getResourceByUniqueIdentifier
} from 'builder_platform_interaction/expressionUtils';
import {
    ACTION_TYPE,
    ELEMENT_TYPE,
    EntryCriteria,
    ExitCriteria,
    FLOW_TRANSACTION_MODEL,
    ICONS
} from 'builder_platform_interaction/flowMetadata';
import { getFlowIdsForNames, openFlow } from 'builder_platform_interaction/inlineOpenFlowUtils';
import { fetchDetailsForInvocableAction, InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { FLOW_AUTOMATIC_OUTPUT_HANDLING } from 'builder_platform_interaction/processTypeLib';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { LIGHTNING_INPUT_VARIANTS } from 'builder_platform_interaction/screenEditorUtils';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { updateAndValidateElementInPropertyEditor } from 'builder_platform_interaction/validation';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './stageStepEditorLabels';
import { stageStepReducer } from './stageStepReducer';

// Standard inputs that should not show up as inputs associated with the selected action
const STANDARD_INPUT_PREFIX = 'ActionInput__';

export default class StageStepEditor extends LightningElement {
    error;

    labels = LABELS;

    element?: StageStep;

    selectedEntryCriteria?: EntryCriteria;
    selectedExitCriteria?: ExitCriteria;

    // For step based entry criteria
    entryConditionsAvailableStepItems: UI.ComboboxItem[] = [];
    entryConditionsSelectedItem?: UI.ComboboxItem;

    entryActionsAvailableActionItems: UI.ComboboxItem[] = [];
    entryActionsSelectedItem?: UI.ComboboxItem;

    isActionsFetched = false;

    availableActions: InvocableAction[] = [];
    flowNamesToIds: {} = {};
    availableDeterminationActions: InvocableAction[] = [];

    actionElementType = ELEMENT_TYPE.ACTION_CALL;

    actionParameterListConfig?: ParameterListConfig;
    invocableActionParametersDescriptor?: InvocableAction;

    entryActionParameterListConfig?: ParameterListConfig;
    entryInvocableActionParametersDescriptor?: InvocableAction;

    exitActionParameterListConfig?: ParameterListConfig;
    exitInvocableActionParametersDescriptor?: InvocableAction;

    displayActionSpinner = false;
    displayAssigneeSpinner = false;

    @track
    assigneeRecordIds: { id: string }[] | undefined = undefined;

    rules: Rule[] = [];

    _assigneePickerGuid = generateGuid();
    get actorErrorMessage(): string {
        if (this.element?.assignees[0]?.assignee?.error) {
            return this.element?.assignees[0]?.assignee?.error;
        }
        return '';
    }

    entryActionErrorMessage;
    actionErrorMessage;
    exitActionErrorMessage;

    _relatedRecordPickerGuid = generateGuid();
    /**
     * display any relatedRecord errorMessage if
     * - it's not the first time opening the editor
     * - and relatedRecordItem is of type {@link UI.HydratedValue}
     *
     * @returns related record error message
     */
    get recordErrorMessage(): string {
        return (
            (!this.element?.isNew &&
                !isParameterListRowItem(this.element?.relatedRecordItem) &&
                this.element?.relatedRecordItem?.error) ||
            ''
        );
    }

    requiresAsyncProcessing;

    assigneeTypeOptions: { label: String; value: ASSIGNEE_TYPE | ASSIGNEE_RESOURCE_TYPE }[] = [
        {
            label: LABELS.assigneeTypeUser,
            value: ASSIGNEE_TYPE.User
        },
        {
            label: LABELS.assigneeTypeUserReference,
            value: ASSIGNEE_RESOURCE_TYPE.UserResource
        },
        {
            label: LABELS.assigneeTypeGroup,
            value: ASSIGNEE_TYPE.Group
        },
        {
            label: LABELS.assigneeTypeGroupReference,
            value: ASSIGNEE_RESOURCE_TYPE.GroupResource
        },
        {
            label: LABELS.assigneeTypeQueue,
            value: ASSIGNEE_TYPE.Queue
        },
        {
            label: LABELS.assigneeTypeQueueReference,
            value: ASSIGNEE_RESOURCE_TYPE.QueueResource
        }
    ];

    baseAssigneeRecordPickerAttributes = {
        source: 'FlowOrchestrationWorkItem',
        field: 'Assignee'
    };

    userRecordPickerAttributes = {
        ...this.baseAssigneeRecordPickerAttributes,
        label: LABELS.actorSelectorUserLabel,
        entities: [
            {
                name: 'User',
                label: 'Users'
            }
        ],
        placeholder: this.labels.actorSelectorUserPlaceholder
    };

    /**
     * The contextId is consumed by GroupLookupServiceFilterPlugin.java to ensure that only Public Groups and not Queues
     * are returned
     */
    groupRecordPickerAttributes = {
        ...this.baseAssigneeRecordPickerAttributes,
        label: LABELS.actorSelectorGroupLabel,
        contextId: 'orchestratorGroup',
        entities: [
            {
                name: 'Group',
                label: 'Group'
            }
        ],
        placeholder: this.labels.actorSelectorGroupPlaceholder
    };

    /**
     * The contextId is consumed by GroupLookupServiceFilterPlugin.java to ensure that only Queues and not Public Groups
     * are returned
     */
    queueRecordPickerAttributes = {
        ...this.baseAssigneeRecordPickerAttributes,
        label: LABELS.actorSelectorQueueLabel,
        contextId: 'orchestratorQueue',
        entities: [
            {
                name: 'Group',
                label: 'Queue'
            }
        ],
        placeholder: this.labels.actorSelectorQueuePlaceholder
    };

    assigneeRecordPickerAttributes = this.userRecordPickerAttributes;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    triggerType;

    _editorParams;

    @api
    get editorParams() {
        const params = { ...this._editorParams };
        const panelConfig = { ...this._editorParams?.panelConfig };

        if (this.isStepWithType(ACTION_TYPE.STEP_INTERACTIVE)) {
            panelConfig.customIcon = ICONS.interactiveStep;
        } else if (this.isStepWithType(ACTION_TYPE.STEP_BACKGROUND)) {
            panelConfig.customIcon = ICONS.backgroundStep;
        } else if (this.isStepWithType(undefined)) {
            return this._editorParams;
        } else {
            throw new Error('Action Type is not recognized in stageStepEditor');
        }

        params.panelConfig = panelConfig;
        return params;
    }

    set editorParams(params) {
        this._editorParams = params;
    }

    constructor() {
        super();
        this.rules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.STAGE_STEP);
    }

    /**
     * public api function to return the node
     *
     * @returns the node
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
        const event = new OrchestrationStageStepEditorValidateEvent(
            this._assigneePickerGuid,
            this._relatedRecordPickerGuid
        );
        this.element = stageStepReducer(this.element!, event);

        return getErrorsFromHydratedElement(this.element);
    }

    @api
    focus(): void {
        const labelDescription = this.template.querySelector(
            'builder_platform_interaction-label-description'
        ) as HTMLElement;
        labelDescription.focus?.();
    }

    // getter and setter for nodes don't work well with mixins
    // currently need to be copied here for each property editor node
    @api
    get node() {
        return this.element;
    }

    set node(newValue) {
        const oldElement = this.element;
        this.element = newValue;
        this.element = updateAndValidateElementInPropertyEditor(oldElement, newValue, this);

        if (!this.element) {
            return;
        }

        this.selectedEntryCriteria = (this.element.entryCriteria as ValueWithError).value as EntryCriteria;

        this.selectedExitCriteria = (this.element.exitCriteria as ValueWithError).value as ExitCriteria;

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

        this.setActionParameters(this.selectedEntryAction, ORCHESTRATED_ACTION_CATEGORY.ENTRY);
        this.setActionParameters(this.selectedAction, ORCHESTRATED_ACTION_CATEGORY.STEP);
        this.setActionParameters(this.selectedExitAction, ORCHESTRATED_ACTION_CATEGORY.EXIT);

        this.requiresAsyncProcessing = this.element.requiresAsyncProcessing;

        // Handle all assignee related set node changes
        this.setNodeAssignee();
    }

    /**
     * Set correct record picker config and
     * retrieve recordIds for assignees as needed
     *
     * @private
     */
    private setNodeAssignee() {
        const assignee = this.element?.assignees[0];

        if (!this.element || !assignee) {
            return;
        }

        const assigneeType =
            typeof assignee.assigneeType === 'string' ? assignee.assigneeType : assignee.assigneeType.value;

        if (assigneeType === ASSIGNEE_TYPE.User) {
            this.assigneeRecordPickerAttributes = this.userRecordPickerAttributes;
            this.assigneeReferenceComboBoxConfig = this.userReferenceComboBoxConfig;
        } else if (assigneeType === ASSIGNEE_TYPE.Group) {
            this.assigneeRecordPickerAttributes = this.groupRecordPickerAttributes;
            this.assigneeReferenceComboBoxConfig = this.groupReferenceComboBoxConfig;
        } else if (assigneeType === ASSIGNEE_TYPE.Queue) {
            this.assigneeRecordPickerAttributes = this.queueRecordPickerAttributes;
            this.assigneeReferenceComboBoxConfig = this.queueReferenceComboBoxConfig;
        }

        // populate assigneeRecordIds for all literals
        this.assigneeRecordIds = [];
        if (this.element.assignees?.length > 0) {
            this.displayAssigneeSpinner = true;

            Promise.all(
                this.element.assignees.map(async (assignee) => {
                    return assignee && assignee.assignee.value && !assignee.isReference
                        ? fetchOnce(SERVER_ACTION_TYPE.GET_RECORD_ID_BY_DEV_NAME, {
                              devName: getValueFromHydratedItem(assignee.assignee),
                              entity: getValueFromHydratedItem(assignee.assigneeType)
                          })
                        : null;
                })
            ).then((recordIds: string[]) => {
                const retrievedIds: string[] = recordIds.filter((recordId) => recordId !== null);
                this.assigneeRecordIds = retrievedIds.map((recordId) => {
                    return {
                        id: recordId
                    };
                });
                this.displayAssigneeSpinner = false;
            });
        }
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

    get stepStartOptions() {
        return [
            {
                label: LABELS.startOptionStageStart,
                value: EntryCriteria.ON_STAGE_START
            },

            {
                label: LABELS.startOptionBasedOnOtherStep,
                value: EntryCriteria.ON_STEP_COMPLETE
            },

            {
                label: LABELS.startOptionBasedOnCustomFlow,
                value: EntryCriteria.ON_DETERMINATION_COMPLETE
            }
        ];
    }

    get stepCompletesOptions() {
        return [
            {
                label: LABELS.whenStepIsComplete,
                value: ExitCriteria.ON_STEP_COMPLETE
            },

            {
                label: LABELS.completeOptionBasedOnCustomFlow,
                value: ExitCriteria.ON_DETERMINATION_COMPLETE
            }
        ];
    }

    get stepStartValue(): string {
        return this.stepStartOptions[0].value;
    }

    get isStepWithUserAction(): boolean {
        return this.isStepWithType(ACTION_TYPE.STEP_INTERACTIVE);
    }

    get actionSectionLabel(): string {
        return this.isStepWithUserAction
            ? this.labels.implementationSectionLabel
            : this.labels.autolaunchedFlowSectionLabel;
    }

    get actionTooltipLabel(): string {
        return this.labels.actionSelectorTooltip;
    }

    get isStartCriteriaBasedOnStep(): boolean {
        return this.selectedEntryCriteria === EntryCriteria.ON_STEP_COMPLETE;
    }

    get isStartCriteriaBasedOnCustomAction(): boolean {
        return this.selectedEntryCriteria === EntryCriteria.ON_DETERMINATION_COMPLETE;
    }

    get isExitCriteriaBasedOnCustomAction(): boolean {
        return this.selectedExitCriteria === ExitCriteria.ON_DETERMINATION_COMPLETE;
    }

    get showParameterList(): boolean {
        return this.selectedAction?.actionName && !this.actionErrorMessage && !!this.actionParameterListConfig;
    }

    get showExternalCalloutsCheckbox(): boolean {
        return this.selectedAction?.actionName && !this.actionErrorMessage && !this.isStepWithUserAction;
    }

    get showEntryParameterList(): boolean {
        return (
            this.selectedEntryAction?.actionName &&
            !this.entryActionErrorMessage &&
            !!this.entryActionParameterListConfig
        );
    }

    get showExitParameterList(): boolean {
        return (
            this.selectedExitAction?.actionName && !this.exitActionErrorMessage && !!this.exitActionParameterListConfig
        );
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
     * @returns the information about the action element in which the configurationEditor is defined
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
        if (this.element?.action.actionName.error) {
            this.actionErrorMessage = this.element?.action.actionName.error;
        }

        if (this.element && this.element.action && this.element.action.actionName.value !== '') {
            return {
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: this.element?.action.actionType.value,
                actionName: this.element?.action.actionName?.value,
                inputParameters: [],
                outputParameters: []
            };
        }

        return null;
    }

    /**
     * @returns the information about the action element in which the configurationEditor is defined
     */
    get entryActionElementInfo() {
        const actionInfo = { apiName: '', type: 'Action' };
        if (this.entryInvocableActionParametersDescriptor) {
            actionInfo.apiName = this.entryInvocableActionParametersDescriptor.actionName;
            actionInfo.type = this.entryInvocableActionParametersDescriptor.actionType;
        }
        return actionInfo;
    }

    /**
     * @returns The selected entry action
     */
    get selectedEntryAction(): InvocableAction | null {
        if (this.element?.entryAction.actionName.error) {
            this.entryActionErrorMessage = this.element?.entryAction.actionName.error;
        }

        if (this.element && this.element.entryAction && this.element.entryAction.actionName.value !== '') {
            return {
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: this.element?.entryAction?.actionType?.value,
                actionName: this.element?.entryAction?.actionName?.value,
                inputParameters: [],
                outputParameters: []
            };
        }

        return null;
    }

    /**
     * @returns the information about the action element in which the configurationEditor is defined
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
        if (this.element?.exitAction.actionName.error) {
            this.exitActionErrorMessage = this.element?.exitAction.actionName.error;
        }

        if (this.element && this.element.exitAction && this.element.exitAction.actionName.value !== '') {
            return {
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: this.element?.exitAction?.actionType?.value,
                actionName: this.element?.exitAction?.actionName?.value,
                inputParameters: [],
                outputParameters: []
            };
        }

        return null;
    }

    get recordValue() {
        return !(typeof this.element?.relatedRecordItem.value === 'string') &&
            this.element?.relatedRecordItem.value?.value
            ? this.element.relatedRecordItem.value.value
            : null;
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

    get isAssigneeReference() {
        return this.element?.assignees[0]?.isReference;
    }

    get selectedAssigneeType() {
        const assigneeType = getValueFromHydratedItem(this.element?.assignees[0]!.assigneeType);

        if (assigneeType === ASSIGNEE_TYPE.Group) {
            return this.element?.assignees[0]?.isReference ? ASSIGNEE_RESOURCE_TYPE.GroupResource : ASSIGNEE_TYPE.Group;
        } else if (assigneeType === ASSIGNEE_TYPE.Queue) {
            return this.element?.assignees[0]?.isReference ? ASSIGNEE_RESOURCE_TYPE.QueueResource : ASSIGNEE_TYPE.Queue;
        }
        return this.element?.assignees[0]?.isReference ? ASSIGNEE_RESOURCE_TYPE.UserResource : ASSIGNEE_TYPE.User;
    }

    get actorValue() {
        if (this.element?.assignees[0]?.assignee) {
            if (this.element.assignees[0].assignee?.elementReference) {
                return this.element.assignees[0].assignee.elementReference;
            }
            return this.element.assignees[0].assignee.value;
        }
        return null;
    }

    get propertyEditorElementType() {
        return ELEMENT_TYPE.STAGE_STEP;
    }

    get entryCriteriaHelpText() {
        if (this.selectedEntryCriteria === EntryCriteria.ON_DETERMINATION_COMPLETE) {
            return this.labels.criteriaActionHelpText;
        } else if (this.selectedEntryCriteria === EntryCriteria.ON_STEP_COMPLETE) {
            return this.labels.criteriaBasedOnStepHelpText;
        }
        // a value of null will not display any Tooltip Icon
        return null;
    }

    get exitCriteriaHelpText() {
        if (this.selectedExitCriteria === ExitCriteria.ON_DETERMINATION_COMPLETE) {
            return this.labels.criteriaActionHelpText;
        }
        // a value of null will not display any Tooltip Icon
        return null;
    }

    get userReferenceComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.actorSelectorUserReferenceLabel, // Label
            this.labels.actorSelectorUserReferencePlaceholder, // Placeholder
            this.error, // errorMessage
            false, // literalsAllowed
            true, // required
            false, // disabled
            FLOW_DATA_TYPE.STRING.value,
            true, // enableFieldDrilldown,
            true, // allowSObjectFields
            LIGHTNING_INPUT_VARIANTS.STANDARD,
            this.labels.actorSelectorUserReferenceTooltip // Field-level Help
        );
    }

    get groupReferenceComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.actorSelectorGroupReferenceLabel, // Label
            this.labels.actorSelectorGroupReferencePlaceholder, // Placeholder
            this.error, // errorMessage
            false, // literalsAllowed
            true, // required
            false, // disabled
            FLOW_DATA_TYPE.STRING.value,
            true, // enableFieldDrilldown,
            true, // allowSObjectFields
            LIGHTNING_INPUT_VARIANTS.STANDARD,
            this.labels.actorSelectorGroupReferenceTooltip // Field-level Help
        );
    }

    get queueReferenceComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.actorSelectorQueueReferenceLabel, // Label
            this.labels.actorSelectorQueueReferencePlaceholder, // Placeholder
            this.error, // errorMessage
            false, // literalsAllowed
            true, // required
            false, // disabled
            FLOW_DATA_TYPE.STRING.value,
            true, // enableFieldDrilldown,
            true, // allowSObjectFields
            LIGHTNING_INPUT_VARIANTS.STANDARD,
            this.labels.actorSelectorQueueReferenceTooltip // Field-level Help
        );
    }

    assigneeReferenceComboBoxConfig = this.userReferenceComboBoxConfig;

    get actorElementParam() {
        return {
            dataType: FLOW_DATA_TYPE.STRING.value,
            collection: false
        };
    }

    get resourcePickerRules() {
        return this.rules;
    }

    get isEntryActionInputsEmpty() {
        return this.entryActionParameterListConfig?.inputs.length === 0;
    }

    get isActionInputsEmpty() {
        return this.actionParameterListConfig?.inputs.length === 0;
    }

    get isExitActionInputsEmpty() {
        return this.exitActionParameterListConfig?.inputs.length === 0;
    }

    async connectedCallback() {
        this.displayActionSpinner = true;

        try {
            const actions = await fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, {
                flowProcessType: this.processType,
                flowTriggerType: this.triggerType
            });

            this.displayActionSpinner = false;
            this.isActionsFetched = true;

            const stepActions: InvocableAction[] = [];
            const determinationActions: InvocableAction[] = [];
            actions.forEach((action) => {
                if (action.type === ACTION_TYPE.EVALUATION_FLOW) {
                    determinationActions.push(action);
                } else if (
                    (action.type === ACTION_TYPE.STEP_INTERACTIVE && this.isStepWithUserAction) ||
                    (action.type === ACTION_TYPE.STEP_BACKGROUND && !this.isStepWithUserAction)
                ) {
                    stepActions.push(action);
                }
            });

            this.availableActions = stepActions;
            this.availableDeterminationActions = determinationActions;

            this.flowNamesToIds = await getFlowIdsForNames(actions.map((action) => action.name));

            await this.setActionParameters(this.selectedAction, ORCHESTRATED_ACTION_CATEGORY.STEP);
            await this.setActionParameters(this.selectedEntryAction!, ORCHESTRATED_ACTION_CATEGORY.ENTRY);
            await this.setActionParameters(this.selectedExitAction!, ORCHESTRATED_ACTION_CATEGORY.EXIT);
        } catch (err) {
            this.isActionsFetched = true;
            this.displayActionSpinner = false;
        }
    }

    isStepWithType(actionType: ACTION_TYPE | undefined): boolean {
        return this.element?.action.actionType === actionType || this.element?.action.actionType.value === actionType;
    }

    _numberOfRenders = 0;

    /**
     * LWC hook after rendering every component we are setting all errors via set Custom Validity
     * except initial rendering
     */
    renderedCallback() {
        this._numberOfRenders += 1;
        // We need to validate in the second render because the assignee ferov
        // picker does not have the appropriate value the first time
        if (!this.element?.isNew && this._numberOfRenders === 2) {
            this.validate();
        }
    }

    /**
     * Filters out input parameters that are for engine use only.
     * For later releases, we'll investigate excluding them on the server side
     *
     * @param inputParameters All input parameters for the action
     * @returns The filter input parameters
     */
    filterActionInputParameters(inputParameters: ParameterListRowItem[] = []): ParameterListRowItem[] {
        return inputParameters.filter((inputParameter: ParameterListRowItem) => {
            return typeof inputParameter.name === 'string'
                ? !inputParameter.name.startsWith(STANDARD_INPUT_PREFIX)
                : !inputParameter.name.value.startsWith(STANDARD_INPUT_PREFIX);
        });
    }

    async setActionParameters(action: InvocableAction | null, actionCategory: ORCHESTRATED_ACTION_CATEGORY) {
        let parameters: ParameterListRowItem[];

        if (!action?.actionName || !action?.actionType) {
            parameters = [];
        } else {
            this.displayActionSpinner = true;

            try {
                parameters = (await fetchDetailsForInvocableAction(action)).parameters;
            } catch (e) {
                this.displayActionSpinner = false;
                return;
            }
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

        // Update element entryCriteria
        const updateEntryCriteriaEvent = new UpdateEntryExitCriteriaEvent(
            ORCHESTRATED_ACTION_CATEGORY.ENTRY,
            this.selectedEntryCriteria
        );
        this.element = stageStepReducer(this.element!, updateEntryCriteriaEvent);

        // delete any alternative Entry Criteria Metadata if necessary

        if (this.selectedEntryCriteria === EntryCriteria.ON_STAGE_START) {
            const deleteEntryCriteriaEvent = new DeleteAllConditionsEvent(this.element!.guid);
            this.element = stageStepReducer(this.element!, deleteEntryCriteriaEvent);

            const deleteEntryActionEvent = new DeleteOrchestrationActionEvent(
                this.element!.guid,
                ORCHESTRATED_ACTION_CATEGORY.ENTRY
            );
            this.element = stageStepReducer(this.element!, deleteEntryActionEvent);

            this.dispatchEvent(new UpdateNodeEvent(this.element));
        } else if (this.selectedEntryCriteria === EntryCriteria.ON_STEP_COMPLETE) {
            const deleteEntryActionEvent = new DeleteOrchestrationActionEvent(
                this.element!.guid,
                ORCHESTRATED_ACTION_CATEGORY.ENTRY
            );
            this.element = stageStepReducer(this.element!, deleteEntryActionEvent);
            this.element = stageStepReducer(this.element!, new CreateEntryConditionsEvent(this.element!.guid));
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        } else if (this.selectedEntryCriteria === EntryCriteria.ON_DETERMINATION_COMPLETE) {
            const deleteEntryCriteriaEvent = new DeleteAllConditionsEvent(this.element!.guid);
            this.element = stageStepReducer(this.element!, deleteEntryCriteriaEvent);

            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    handleStepCompletesChanged(event: CustomEvent) {
        this.selectedExitCriteria = event.detail.value;

        // Update element exitCriteria
        const updateExitCriteriaEvent = new UpdateEntryExitCriteriaEvent(
            ORCHESTRATED_ACTION_CATEGORY.EXIT,
            this.selectedExitCriteria
        );
        this.element = stageStepReducer(this.element!, updateExitCriteriaEvent);

        // delete any alternative Exit Criteria Metadata if necessary
        if (this.selectedExitCriteria === ExitCriteria.ON_STEP_COMPLETE) {
            const deleteExitActionEvent = new DeleteOrchestrationActionEvent(
                this.element!.guid,
                ORCHESTRATED_ACTION_CATEGORY.EXIT
            );
            this.element = stageStepReducer(this.element!, deleteExitActionEvent);
            this.element = stageStepReducer(this.element!, new CreateEntryConditionsEvent(this.element!.guid));
        }
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    async handleActionSelected(e: ValueChangedEvent<InvocableAction>) {
        e.detail.value.actionType = this.element?.action?.actionType.value;
        this.actionSelected(ORCHESTRATED_ACTION_CATEGORY.STEP, e);
    }

    async handleEntryActionSelected(e: ValueChangedEvent<InvocableAction>) {
        e.detail.value.actionType = ACTION_TYPE.EVALUATION_FLOW;
        this.actionSelected(ORCHESTRATED_ACTION_CATEGORY.ENTRY, e);
    }

    async handleExitActionSelected(e: ValueChangedEvent<InvocableAction>) {
        e.detail.value.actionType = ACTION_TYPE.EVALUATION_FLOW;
        this.actionSelected(ORCHESTRATED_ACTION_CATEGORY.EXIT, e);
    }

    async actionSelected(actionCategory: ORCHESTRATED_ACTION_CATEGORY, e: ValueChangedEvent<InvocableAction>) {
        const orchEvt = new OrchestrationActionValueChangedEvent(actionCategory, e.detail.value, e.detail.error);

        // Update the selected action
        this.element = stageStepReducer(this.element!, orchEvt);

        // Only load parameters if a valid action is selected
        if (e.detail.value.actionName) {
            if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.STEP) {
                await this.setActionParameters(this.selectedAction, actionCategory);
            } else if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.ENTRY) {
                await this.setActionParameters(this.selectedEntryAction!, actionCategory);
            } else if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.EXIT) {
                await this.setActionParameters(this.selectedExitAction!, actionCategory);
            }
        }

        // Reset the external callouts checkbox
        if (!this.isStepWithUserAction && actionCategory === ORCHESTRATED_ACTION_CATEGORY.STEP) {
            this.element = stageStepReducer(this.element!, new RequiresAsyncProcessingChangedEvent(false));
        }

        const error = e.detail.item ? e.detail.item.error : e.detail.error;
        if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.STEP) {
            this.actionErrorMessage = error;
        } else if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.ENTRY) {
            this.entryActionErrorMessage = error;
        } else if (actionCategory === ORCHESTRATED_ACTION_CATEGORY.EXIT) {
            this.exitActionErrorMessage = error;
        }

        // Update the node in the store
        this.dispatchEvent(new UpdateNodeEvent(this.element));
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

    /**
     * The assignee type received by this event from the ui can be either an
     * ASSIGNEE_TYPE or an ASSIGNEE_RESOURCE_TYPE
     *
     * @param event Fired when the assignee type combobox is changed
     */
    handleAssigneeTypeChanged = (event) => {
        event.stopPropagation();

        const value = event.detail.value;

        let assigneeType = ASSIGNEE_TYPE.User;
        if (value === ASSIGNEE_TYPE.Group || value === ASSIGNEE_RESOURCE_TYPE.GroupResource) {
            assigneeType = ASSIGNEE_TYPE.Group;
        } else if (value === ASSIGNEE_TYPE.Queue || value === ASSIGNEE_RESOURCE_TYPE.QueueResource) {
            assigneeType = ASSIGNEE_TYPE.Queue;
        }

        const isReference =
            value === ASSIGNEE_RESOURCE_TYPE.UserResource ||
            value === ASSIGNEE_RESOURCE_TYPE.GroupResource ||
            value === ASSIGNEE_RESOURCE_TYPE.QueueResource;

        const updateActor = new OrchestrationAssigneeChangedEvent(
            createFEROVMetadataObject(
                {
                    assignee: null,
                    assigneeDataType: FEROV_DATA_TYPE.STRING
                },
                ASSIGNEE_PROPERTY_NAME,
                ASSIGNEE_DATA_TYPE_PROPERTY_NAME
            ),
            assigneeType,
            isReference
        );
        this.element = stageStepReducer(this.element!, updateActor);

        this.dispatchEvent(new UpdateNodeEvent(this.element));
    };

    /**
     * Used for combobox (reference)
     *
     * @param event Fired when the ferov resource picker value changes
     */
    handleActorChanged = (event) => {
        event.stopPropagation();
        this.updateAssignee(event.detail.item ? event.detail.item.value : event.detail.displayText, event.detail.error);
    };

    /**
     * Handles assignee reference ferov picker ItemSelectedEvent
     *
     * @param event ItemSelectedEvent
     */
    handleActorItemSelected = (event: ItemSelectedEvent) => {
        event.stopPropagation();
        this.updateAssignee(
            (event.detail.item ? event.detail.item.value : event.detail.displayText) || null,
            event.detail?.item?.error
        );
    };

    /**
     *
     * @param recordId recordId of the assignee entity
     */
    handleAssigneeEntitySelected = async (recordId: string) => {
        if (recordId) {
            const devName = await fetchOnce(SERVER_ACTION_TYPE.GET_RECORD_DEV_NAME_BY_ID, {
                recordId,
                entity: getValueFromHydratedItem(this.element?.assignees[0]?.assigneeType)
            });
            this.updateAssignee(<string>devName, '');
        } else {
            this.updateAssignee(null, '');
        }
    };

    /**
     * Processes assignee change, whether literal or resource
     *
     * @param assignee the new assignee
     * @param error any error if present
     */
    updateAssignee(assignee: string | null, error: string | null) {
        if (assignee === '') {
            assignee = null;
        }

        let ferovDataType: string | null = FEROV_DATA_TYPE.STRING;
        if (assignee && getResourceByUniqueIdentifier(assignee)) {
            ferovDataType = getFerovDataTypeForValidId(assignee);
        }

        const updateActor = new OrchestrationAssigneeChangedEvent(
            createFEROVMetadataObject(
                {
                    assignee,
                    assigneeDataType: ferovDataType
                },
                ASSIGNEE_PROPERTY_NAME,
                ASSIGNEE_DATA_TYPE_PROPERTY_NAME
            ),
            this.element?.assignees[0]?.assigneeType,
            this.element?.assignees[0]?.isReference,
            error
        );
        this.element = stageStepReducer(this.element!, updateActor);
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    handleRecordChanged = (event: ComboboxStateChangedEvent) => {
        event.stopPropagation();
        const recordIdValue = event.detail.item ? event.detail.item.value : event.detail.displayText;
        this.updateRelatedRecord(recordIdValue, event.detail.error);
    };

    /**
     * Handles related record ferov picker ItemSelectedEvent
     *
     * @param event ItemSelectedEvent
     */
    handleRecordItemSelected = (event: ItemSelectedEvent) => {
        event.stopPropagation();
        const recordIdValue = event.detail.item ? event.detail.item.value : event.detail.displayText;
        this.updateRelatedRecord(recordIdValue, event.detail?.item?.error);
    };

    /**
     * Processes relatedRecord change
     *
     * @param recordIdValue recordId of updated related record selection
     * @param error any error if present
     */
    updateRelatedRecord = (recordIdValue, error: string | null) => {
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

        const inputParam: ParameterListRowItem | undefined = this.element!.inputParameters.find((p) => {
            const name = typeof p.name === 'string' ? p.name : p.name.value;
            return name === RELATED_RECORD_INPUT_PARAMETER_NAME;
        });

        // Only update the element if an actual change in value has occurred
        const sanitizedValue = removeCurlyBraces(recordIdValue);
        if (!inputParam || !inputParam.value || (<ValueWithError>inputParam.value).value !== sanitizedValue) {
            // Need to update the inputParam manually if the current or new recordId is null/undefined. Need to if
            // the current is null because the call to stageStepReducer with PropertyChangedEvent below will call
            // removeAllUnsetParameters, which will erase the recordId param from inputParameters. We need to set it to
            // it's new value before that happens. If the new value is null, then we need to do this because dehydration
            // and rehydration of relatedRecordItem with a null value will cause it to lose it's properties that identify
            // it as a ParameterListRowItem, so the mapping in orchestratedStage.createOrchestratedStageMetadataObject will fail
            if (
                !!inputParam &&
                (recordIdValue === null || isUndefinedOrNull(getValueFromHydratedItem(inputParam.value)))
            ) {
                const paramUpdateEvent = new UpdateParameterItemEvent(
                    true,
                    inputParam.rowIndex,
                    RELATED_RECORD_INPUT_PARAMETER_NAME,
                    recordIdValue,
                    valueDataType,
                    error
                );
                this.element = stageStepReducer(this.element!, paramUpdateEvent);
            }

            const valueToSet: ParameterListRowItem | null = {
                // Empty string only if no action has been selected yet
                rowIndex: inputParam ? inputParam.rowIndex : '',
                name: RELATED_RECORD_INPUT_PARAMETER_NAME,
                value: recordIdValue,
                valueDataType
            };

            const updateRecord = new PropertyChangedEvent('relatedRecordItem', valueToSet, error);
            this.element = stageStepReducer(this.element!, updateRecord);

            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    };

    handleCheckboxClicked(event: CustomEvent) {
        event.stopPropagation();
        this.element = stageStepReducer(this.element!, new RequiresAsyncProcessingChangedEvent(event.detail.checked));
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    handleOpenFlowClicked() {
        const actionId = this.flowNamesToIds[this.selectedAction?.actionName];
        openFlow(actionId);
    }

    handleOpenEntryConditionFlowClicked() {
        const actionId = this.flowNamesToIds[this.selectedEntryAction?.actionName];
        openFlow(actionId);
    }

    handleOpenExitConditionFlowClicked() {
        const actionId = this.flowNamesToIds[this.selectedExitAction?.actionName];
        openFlow(actionId);
    }

    get showOpenFlow(): boolean {
        return this.selectedAction?.actionName && !this.actionErrorMessage;
    }

    get showOpenEntryConditionFlow(): boolean {
        return (
            this.selectedEntryAction?.actionName &&
            !this.entryActionErrorMessage &&
            this.selectedEntryCriteria === EntryCriteria.ON_DETERMINATION_COMPLETE
        );
    }

    get showOpenExitConditionFlow(): boolean {
        return (
            this.selectedExitAction?.actionName &&
            !this.exitActionErrorMessage &&
            this.selectedExitCriteria === ExitCriteria.ON_DETERMINATION_COMPLETE
        );
    }
}
