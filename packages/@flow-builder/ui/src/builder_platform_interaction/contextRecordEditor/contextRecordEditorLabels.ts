// @ts-nocheck
import everyTimeConditionsMet from '@salesforce/label/FlowBuilderRecordEditor.everyTimeConditionsMet';
import object from '@salesforce/label/FlowBuilderRecordEditor.object';
import objectPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.objectPlaceholder';
import onlyWhenChangesMeetConditions from '@salesforce/label/FlowBuilderRecordEditor.onlyWhenChangesMeetConditions';
import requireChangeOptionsHelptext from '@salesforce/label/FlowBuilderRecordEditor.requireChangeOptionsHelptext';
import requireRecordChangeOption from '@salesforce/label/FlowBuilderRecordEditor.requireRecordChangeOption';
import chooseObjectAndRecord from '@salesforce/label/FlowBuilderStartEditor.chooseObjectAndRecord';
import contextObjectDeleteDescription from '@salesforce/label/FlowBuilderStartEditor.contextObjectDeleteDescription';
import contextObjectDescription from '@salesforce/label/FlowBuilderStartEditor.contextObjectDescription';
import contextObjectHeader from '@salesforce/label/FlowBuilderStartEditor.contextObjectHeader';
import disableRadioGroupStartText from '@salesforce/label/FlowBuilderStartEditor.disableRadioGroupStartText';
import filterRecordsDescription from '@salesforce/label/FlowBuilderStartEditor.filterRecordsDescription';
import { EXECUTE_OUTCOME_WHEN_OPTION_VALUES } from 'builder_platform_interaction/flowMetadata';

export const LABELS = {
    chooseObjectAndRecord,
    contextObjectHeader,
    contextObjectDescription,
    contextObjectDeleteDescription,
    filterRecordsDescription,
    object,
    objectPlaceholder,
    requireRecordChangeOption,
    requireChangeOptionsHelptext,
    disableRadioGroupStartText
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
