// @ts-nocheck
import startElementSelectObject from '@salesforce/label/FlowBuilderCanvasElement.startElementSelectObject';
import editTriggerLabel from '@salesforce/label/FlowBuilderElementConfig.editTriggerLabel';
import formulaLabel from '@salesforce/label/FlowBuilderFormulaTextarea.formulaLabel';
import formulaValidationSpinnerAlternativeText from '@salesforce/label/FlowBuilderFormulaTextarea.formulaValidationSpinnerAlternativeText';
import everyTimeConditionsMet from '@salesforce/label/FlowBuilderRecordEditor.everyTimeConditionsMet';
import object from '@salesforce/label/FlowBuilderRecordEditor.object';
import objectPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.objectPlaceholder';
import onlyWhenChangesMeetConditions from '@salesforce/label/FlowBuilderRecordEditor.onlyWhenChangesMeetConditions';
import requireChangeOptionsHelptext from '@salesforce/label/FlowBuilderRecordEditor.requireChangeOptionsHelptext';
import requireRecordChangeOption from '@salesforce/label/FlowBuilderRecordEditor.requireRecordChangeOption';
import requireRecordChangeOptionOrchestrator from '@salesforce/label/FlowBuilderRecordEditor.requireRecordChangeOptionOrchestrator';
import required from '@salesforce/label/FlowBuilderResourcedTextArea.inputRequiredTitle';
import resourcePickerPlaceholder from '@salesforce/label/FlowBuilderResourcedTextArea.resourcePickerPlaceholder';
import resourcePickerTitle from '@salesforce/label/FlowBuilderResourcedTextArea.resourcePickerTitle';
import chooseObjectAndRecord from '@salesforce/label/FlowBuilderStartEditor.chooseObjectAndRecord';
import contextObjectDeleteDescription from '@salesforce/label/FlowBuilderStartEditor.contextObjectDeleteDescription';
import contextObjectHeader from '@salesforce/label/FlowBuilderStartEditor.contextObjectHeader';
import createOrUpdateInputLabel from '@salesforce/label/FlowBuilderStartEditor.createOrUpdateInputLabel';
import createOrUpdateInputLabelOrchestrator from '@salesforce/label/FlowBuilderStartEditor.createOrUpdateInputLabelOrchestrator';
import disableRadioGroupStartText from '@salesforce/label/FlowBuilderStartEditor.disableRadioGroupStartText';
import filterRecordsDescription from '@salesforce/label/FlowBuilderStartEditor.filterRecordsDescription';
import formulasForConditionsHelpText from '@salesforce/label/FlowBuilderStartEditor.formulasForConditionsHelpText';
import formulasForConditionsInfoLabel from '@salesforce/label/FlowBuilderStartEditor.formulasForConditionsInfoLabel';
import newInfoBadgeLabel from '@salesforce/label/FlowBuilderStartEditor.newInfoBadgeLabel';
import noUndeleteFlowMessage from '@salesforce/label/FlowBuilderStartEditor.noUndeleteFlowMessage';
import recordChangeContextObjectDescription from '@salesforce/label/FlowBuilderStartEditor.recordChangeContextObjectDescription';
import recordChangeContextObjectDescriptionOrchestrator from '@salesforce/label/FlowBuilderStartEditor.recordChangeContextObjectDescriptionOrchestrator';
import recordChangeTriggerTypeAfterSave from '@salesforce/label/FlowBuilderStartEditor.recordChangeTriggerTypeAfterSave';
import recordChangeTriggerTypeBeforeSave from '@salesforce/label/FlowBuilderStartEditor.recordChangeTriggerTypeBeforeSave';
import recordChangeTriggerTypeInputLabel from '@salesforce/label/FlowBuilderStartEditor.recordChangeTriggerTypeInputLabel';
import recordTriggerTypeCreated from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeCreated';
import recordTriggerTypeCreatedOrUpdated from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeCreatedOrUpdated';
import recordTriggerTypeDeleted from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeDeleted';
import recordTriggerTypeUpdated from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeUpdated';
import requiredLabel from '@salesforce/label/FlowBuilderStartEditor.requiredLabel';
import runAsyncScheduledPathCheckboxLabel from '@salesforce/label/FlowBuilderStartEditor.runAsyncScheduledPathCheckboxLabel';
import setConditionsDescription from '@salesforce/label/FlowBuilderStartEditor.setConditionsDescription';
import setConditionsDescriptionOrchestrator from '@salesforce/label/FlowBuilderStartEditor.setConditionsDescriptionOrchestrator';
import setConditionsHeaderLabel from '@salesforce/label/FlowBuilderStartEditor.setConditionsHeaderLabel';
import triggerTypeAfterSaveDescription from '@salesforce/label/FlowBuilderStartEditor.triggerTypeAfterSaveDescription';
import triggerTypeBeforeDelete from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeDelete';
import triggerTypeBeforeDeleteDescription from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeDeleteDescription';
import triggerTypeBeforeSaveDescription from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeSaveDescription';
import { EXECUTE_OUTCOME_WHEN_OPTION_VALUES } from 'builder_platform_interaction/flowMetadata';

export const LABELS = {
    createOrUpdateInputLabel,
    recordChangeTriggerTypeInputLabel,
    recordTriggerTypeUpdated,
    recordTriggerTypeCreated,
    recordTriggerTypeCreatedOrUpdated,
    recordTriggerTypeDeleted,
    recordChangeTriggerTypeBeforeSave,
    recordChangeTriggerTypeAfterSave,
    triggerTypeBeforeDelete,
    triggerTypeBeforeSaveDescription,
    triggerTypeAfterSaveDescription,
    triggerTypeBeforeDeleteDescription,
    requiredLabel,
    noUndeleteFlowMessage,
    runAsyncScheduledPathCheckboxLabel,
    chooseObjectAndRecord,
    contextObjectHeader,
    recordChangeContextObjectDescription,
    startElementSelectObject,
    contextObjectDeleteDescription,
    filterRecordsDescription,
    object,
    objectPlaceholder,
    requireRecordChangeOption,
    requireChangeOptionsHelptext,
    disableRadioGroupStartText,
    editTriggerLabel,
    setConditionsHeaderLabel,
    setConditionsDescription,
    createOrUpdateInputLabelOrchestrator,
    recordChangeContextObjectDescriptionOrchestrator,
    setConditionsDescriptionOrchestrator,
    requireRecordChangeOptionOrchestrator,
    formulaLabel,
    formulaValidationSpinnerAlternativeText,
    newInfoBadgeLabel,
    formulasForConditionsInfoLabel,
    formulasForConditionsHelpText,
    resourcePickerTitle,
    resourcePickerPlaceholder,
    required
};

export const requireRecordChangeOptions = () => {
    return [
        {
            label: everyTimeConditionsMet,
            value: EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET
        },
        {
            label: onlyWhenChangesMeetConditions,
            value: EXECUTE_OUTCOME_WHEN_OPTION_VALUES.ONLY_WHEN_CHANGES_MEET_CONDITIONS
        }
    ];
};
