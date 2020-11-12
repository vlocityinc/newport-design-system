import { api, LightningElement } from 'lwc';
import {
    getErrorsFromHydratedElement,
    getValueFromHydratedItem,
    ValueWithError
} from 'builder_platform_interaction/dataMutationLib';
import {
    ComboboxStateChangedEvent,
    DeleteConditionEvent,
    PropertyChangedEvent,
    UpdateConditionEvent,
    UpdateNodeEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import { LABELS } from './steppedStageItemEditorLabels';
import { steppedStageItemReducer } from './steppedStageItemReducer';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { ELEMENT_TYPE, FLOW_TRANSACTION_MODEL } from 'builder_platform_interaction/flowMetadata';
import {
    getOtherItemsInSteppedStage,
    ParameterListRowItem,
    SteppedStageItem
} from 'builder_platform_interaction/elementFactory';
import { ComboboxItem } from 'builder_platform_interaction/flowModel';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { fetchDetailsForInvocableAction, InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import {
    getParameterListWarnings,
    MERGE_WITH_PARAMETERS,
    ParameterListConfig,
    REMOVE_UNSET_PARAMETERS
} from 'builder_platform_interaction/calloutEditorLib';
import { FLOW_AUTOMATIC_OUTPUT_HANDLING } from 'builder_platform_interaction/processTypeLib';
import { removeCurlyBraces } from 'builder_platform_interaction/commonUtils';

enum ENTRY_CRITERIA {
    ON_STAGE_START = 'on_stage_start',
    ON_STEP_COMPLETE = 'on_step_complete'
}

const HIDDEN_INPUT_PARAMETER_NAMES = ['appProcessInstanceId', 'appProcessStepInstanceId'];

export default class SteppedStageItemEditor extends LightningElement {
    labels = LABELS;

    element?: SteppedStageItem;

    selectedEntryCriteria?: ENTRY_CRITERIA;

    // For step based entry criteria
    entryCriteriaAvailableStepItems: ComboboxItem[] = [];
    entryCriteriaSelectedItem?: ComboboxItem;

    isActionsFetched = false;

    availableActions: InvocableAction[] = [];

    actionElementType = ELEMENT_TYPE.ACTION_CALL;
    actionParameterListConfig?: ParameterListConfig;
    invocableActionParametersDescriptor?: InvocableAction;

    displayActionSpinner = false;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    editorParams;

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

        if (this.element.entryCriteria.length === 0) {
            this.selectedEntryCriteria = ENTRY_CRITERIA.ON_STAGE_START;
        } else {
            this.selectedEntryCriteria = ENTRY_CRITERIA.ON_STEP_COMPLETE;
        }
        const otherItems: SteppedStageItem[] = getOtherItemsInSteppedStage(this.element.guid);

        this.entryCriteriaAvailableStepItems = [];

        otherItems.forEach((steppedStageItem) => {
            const comboboxItem: ComboboxItem = {
                type: 'option-card',
                dataType: FLOW_DATA_TYPE.STRING.value,
                text: steppedStageItem.label,
                displayText: steppedStageItem.label || '',
                value: steppedStageItem.name || ''
            };

            // This depends on steppedStageItem entry criteria always having the shape
            // "devName" "EqualTo" "Completed".  For 230, we only parse the LHS devName
            if (
                this.element!.entryCriteria.length > 0 &&
                this.element!.entryCriteria[0].leftHandSide!.value === steppedStageItem.guid
            ) {
                this.entryCriteriaSelectedItem = comboboxItem;
            }

            this.entryCriteriaAvailableStepItems.push(comboboxItem);
        });

        this.setInputParameters();
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
            }
        ];
    }

    get stepStartValue(): string {
        return this.stepStartOptions[0].value;
    }

    get openSections(): string[] {
        return ['startSection', 'itemImplementationSection', 'finishSection'];
    }

    get isStartCriteriaBasedOnStep(): boolean {
        return this.selectedEntryCriteria === ENTRY_CRITERIA.ON_STEP_COMPLETE;
    }

    get showParameterList(): boolean {
        return !!this.actionParameterListConfig;
    }

    setActionParameterListConfig() {
        const inputs = this.filterActionInputParameters(this.element!.inputParameters);
        const outputs = this.element!.outputParameters;

        const warnings = getParameterListWarnings(inputs, outputs, this.labels);

        const storeOutputAutomatically = false;
        const automaticOutputHandlingSupported: FLOW_AUTOMATIC_OUTPUT_HANDLING =
            FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        const flowTransactionModel = getValueFromHydratedItem(FLOW_TRANSACTION_MODEL.AUTOMATIC);
        this.actionParameterListConfig = {
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
                actionName: this.element.action.actionName.value
            };
        }

        return null;
    }

    async connectedCallback() {
        this.displayActionSpinner = true;

        try {
            const workitemActions = await fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, {
                flowProcessType: this.processType
            });
            this.displayActionSpinner = false;
            this.isActionsFetched = true;
            this.availableActions = workitemActions;

            if (this.selectedAction) {
                this.setInputParameters();
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
            return (
                !HIDDEN_INPUT_PARAMETER_NAMES.includes(<string>inputParameter.name) &&
                !HIDDEN_INPUT_PARAMETER_NAMES.includes((<ValueWithError>inputParameter.name).value)
            );
        });
    }

    async setInputParameters() {
        if (!this.selectedAction) {
            return;
        }

        this.displayActionSpinner = true;

        let parameters: ParameterListRowItem[];
        try {
            parameters = (await fetchDetailsForInvocableAction(this.selectedAction)).parameters;
        } catch (e) {
            this.displayActionSpinner = false;
            return;
        }

        const event = new CustomEvent(MERGE_WITH_PARAMETERS, {
            detail: parameters
        });

        // Update the merged parameters
        this.element = steppedStageItemReducer(this.element!, event);

        this.setActionParameterListConfig();

        this.displayActionSpinner = false;
    }

    updateNodeForFieldLevelCommit() {
        const removeUnsetParamsEvent = new CustomEvent(REMOVE_UNSET_PARAMETERS);
        this.element = steppedStageItemReducer(this.element!, removeUnsetParamsEvent);
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    /**
     * @param event - property changed event coming from the label description component
     */
    handleLabelDescriptionPropertyChangedEvent(event: PropertyChangedEvent) {
        event.stopPropagation();

        this.element = steppedStageItemReducer(this.element!, event);

        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    /**
     * @param event - property changed event coming from parameter list component
     */
    handleParameterPropertyChangedEvent(event: PropertyChangedEvent) {
        event.stopPropagation();

        const inputParam: ParameterListRowItem | undefined = this.element!.inputParameters.find(
            (p) => p.rowIndex === (<ParameterListRowItem>event.detail).rowIndex
        );
        // Only update the element if an actual change in value has occurred
        const sanitizedValue = removeCurlyBraces(event.detail.value);
        if (!inputParam!.value || (<ValueWithError>inputParam!.value).value !== sanitizedValue) {
            this.element = steppedStageItemReducer(this.element!, event);

            this.updateNodeForFieldLevelCommit();
        }
    }

    handleStepStartChanged(event: CustomEvent) {
        this.selectedEntryCriteria = event.detail.value;

        if (this.selectedEntryCriteria === ENTRY_CRITERIA.ON_STAGE_START) {
            const deleteEntryCriteriaEvent = new DeleteConditionEvent(this.element!.guid, 0);

            this.element = steppedStageItemReducer(this.element!, deleteEntryCriteriaEvent);
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    handleActionSelected(e: ValueChangedEvent<InvocableAction>) {
        if (e.detail.value.actionName) {
            // Update the selected action
            this.element = steppedStageItemReducer(this.element!, e);

            this.setInputParameters();

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
            this.element = steppedStageItemReducer(this.element!, updateEntryCriteria);
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }
}
