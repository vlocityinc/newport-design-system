// @ts-nocheck
import recordChangeTriggerTypeInputLabel from '@salesforce/label/FlowBuilderStartEditor.recordChangeTriggerTypeInputLabel';
import createOrUpdateInputLabel from '@salesforce/label/FlowBuilderStartEditor.createOrUpdateInputLabel';
import recordTriggerTypeUpdated from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeUpdated';
import recordTriggerTypeCreated from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeCreated';
import recordTriggerTypeCreatedOrUpdated from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeCreatedOrUpdated';
import recordTriggerTypeDeleted from '@salesforce/label/FlowBuilderStartEditor.recordTriggerTypeDeleted';
import triggerTypeBeforeSave from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeSave';
import triggerTypeBeforeDelete from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeDelete';
import triggerTypeAfterSave from '@salesforce/label/FlowBuilderStartEditor.triggerTypeAfterSave';
import triggerTypeBeforeSaveDescription from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeSaveDescription';
import triggerTypeAfterSaveDescription from '@salesforce/label/FlowBuilderStartEditor.triggerTypeAfterSaveDescription';
import triggerTypeBeforeDeleteDescription from '@salesforce/label/FlowBuilderStartEditor.triggerTypeBeforeDeleteDescription';
import requiredLabel from '@salesforce/label/FlowBuilderStartEditor.requiredLabel';
import noUndeleteFlowMessage from '@salesforce/label/FlowBuilderStartEditor.noUndeleteFlowMessage';
import runOnSuccessScheduledPathCheckboxLabel from '@salesforce/label/FlowBuilderStartEditor.runOnSuccessScheduledPathCheckboxLabel';
import chooseObjectAndRecord from '@salesforce/label/FlowBuilderStartEditor.chooseObjectAndRecord';
import contextObjectHeader from '@salesforce/label/FlowBuilderStartEditor.contextObjectHeader';
import object from '@salesforce/label/FlowBuilderRecordEditor.object';
import objectPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.objectPlaceholder';
import editTriggerObjectLabel from '@salesforce/label/FlowBuilderElementConfig.editTriggerObjectLabel';
import contextObjectDescription from '@salesforce/label/FlowBuilderStartEditor.contextObjectDescription';
import editTriggerLabel from '@salesforce/label/FlowBuilderElementConfig.editTriggerLabel';
import editTriggerDescription from '@salesforce/label/FlowBuilderElementConfig.editTriggerDescription';
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

export const LABELS = {
    createOrUpdateInputLabel,
    recordChangeTriggerTypeInputLabel,
    recordTriggerTypeUpdated,
    recordTriggerTypeCreated,
    recordTriggerTypeCreatedOrUpdated,
    recordTriggerTypeDeleted,
    triggerTypeBeforeSave,
    triggerTypeAfterSave,
    triggerTypeBeforeDelete,
    triggerTypeBeforeSaveDescription,
    triggerTypeAfterSaveDescription,
    triggerTypeBeforeDeleteDescription,
    requiredLabel,
    noUndeleteFlowMessage,
    runOnSuccessScheduledPathCheckboxLabel,
    chooseObjectAndRecord,
    contextObjectHeader,
    contextObjectDescription,
    editTriggerObjectLabel,
    contextObjectDeleteDescription,
    filterRecordsDescription,
    object,
    objectPlaceholder,
    requireRecordChangeOption,
    requireChangeOptionsHelptext,
    disableRadioGroupStartText,
    editTriggerLabel,
    editTriggerDescription,
    setConditionsHeaderLabel,
    setConditionsDescription
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
