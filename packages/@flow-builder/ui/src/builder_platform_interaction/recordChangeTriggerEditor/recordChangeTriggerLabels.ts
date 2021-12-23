// @ts-nocheck
import recordChangeTriggerTypeInputLabel from '@salesforce/label/FlowBuilderStartEditor.recordChangeTriggerTypeInputLabel';
import createOrUpdateInputLabel from '@salesforce/label/FlowBuilderStartEditor.createOrUpdateInputLabel';
import recordTriggerTypeUpdated from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeUpdated';
import recordTriggerTypeCreated from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeCreated';
import recordTriggerTypeCreatedOrUpdated from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeCreatedOrUpdated';
import recordTriggerTypeDeleted from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeDeleted';
import recordChangeTriggerTypeBeforeSave from '@salesforce/label/FlowBuilderStartEditor.recordChangeTriggerTypeBeforeSave';
import triggerTypeBeforeDelete from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeDelete';
import recordChangeTriggerTypeAfterSave from '@salesforce/label/FlowBuilderStartEditor.recordChangeTriggerTypeAfterSave';
import triggerTypeBeforeSaveDescription from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeSaveDescription';
import triggerTypeAfterSaveDescription from '@salesforce/label/FlowBuilderStartEditor.triggerTypeAfterSaveDescription';
import triggerTypeBeforeDeleteDescription from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeDeleteDescription';
import requiredLabel from '@salesforce/label/FlowBuilderStartEditor.requiredLabel';
import noUndeleteFlowMessage from '@salesforce/label/FlowBuilderStartEditor.noUndeleteFlowMessage';
import runAsyncScheduledPathCheckboxLabel from '@salesforce/label/FlowBuilderStartEditor.runAsyncScheduledPathCheckboxLabel';
import chooseObjectAndRecord from '@salesforce/label/FlowBuilderStartEditor.chooseObjectAndRecord';
import contextObjectHeader from '@salesforce/label/FlowBuilderStartEditor.contextObjectHeader';
import object from '@salesforce/label/FlowBuilderRecordEditor.object';
import objectPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.objectPlaceholder';
import startElementSelectObject from '@salesforce/label/FlowBuilderCanvasElement.startElementSelectObject';
import recordChangeContextObjectDescription from '@salesforce/label/FlowBuilderStartEditor.recordChangeContextObjectDescription';
import editTriggerLabel from '@salesforce/label/FlowBuilderElementConfig.editTriggerLabel';
import contextObjectDeleteDescription from '@salesforce/label/FlowBuilderStartEditor.contextObjectDeleteDescription';
import filterRecordsDescription from '@salesforce/label/FlowBuilderStartEditor.filterRecordsDescription';
import requireRecordChangeOption from '@salesforce/label/FlowBuilderRecordEditor.requireRecordChangeOption';
import everyTimeConditionsMet from '@salesforce/label/FlowBuilderRecordEditor.everyTimeConditionsMet';
import onlyWhenChangesMeetConditions from '@salesforce/label/FlowBuilderRecordEditor.onlyWhenChangesMeetConditions';
import { EXECUTE_OUTCOME_WHEN_OPTION_VALUES } from 'builder_platform_interaction/flowMetadata';
import requireChangeOptionsHelptext from '@salesforce/label/FlowBuilderRecordEditor.requireChangeOptionsHelptext';
import disableRadioGroupStartText from '@salesforce/label/FlowBuilderStartEditor.disableRadioGroupStartText';
import setConditionsHeaderLabel from '@salesforce/label/FlowBuilderStartEditor.setConditionsHeaderLabel';
import setConditionsDescription from '@salesforce/label/FlowBuilderStartEditor.setConditionsDescription';
import createOrUpdateInputLabelOrchestrator from '@salesforce/label/FlowBuilderStartEditor.createOrUpdateInputLabelOrchestrator';
import recordChangeContextObjectDescriptionOrchestrator from '@salesforce/label/FlowBuilderStartEditor.recordChangeContextObjectDescriptionOrchestrator';
import setConditionsDescriptionOrchestrator from '@salesforce/label/FlowBuilderStartEditor.setConditionsDescriptionOrchestrator';
import requireRecordChangeOptionOrchestrator from '@salesforce/label/FlowBuilderRecordEditor.requireRecordChangeOptionOrchestrator';
import formulaLabel from '@salesforce/label/FlowBuilderFormulaTextarea.formulaLabel';
import formulaValidationSpinnerAlternativeText from '@salesforce/label/FlowBuilderFormulaTextarea.formulaValidationSpinnerAlternativeText';
import newInfoBadgeLabel from '@salesforce/label/FlowBuilderStartEditor.newInfoBadgeLabel';
import formulasForConditionsInfoLabel from '@salesforce/label/FlowBuilderStartEditor.formulasForConditionsInfoLabel';
import formulasForConditionsHelpText from '@salesforce/label/FlowBuilderStartEditor.formulasForConditionsHelpText';

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
    formulasForConditionsHelpText
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
