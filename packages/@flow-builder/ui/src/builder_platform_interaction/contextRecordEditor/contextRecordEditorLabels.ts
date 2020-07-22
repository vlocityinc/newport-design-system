// @ts-nocheck
import chooseObjectAndRecord from '@salesforce/label/FlowBuilderStartEditor.chooseObjectAndRecord';
import contextObjectHeader from '@salesforce/label/FlowBuilderStartEditor.contextObjectHeader';
import object from '@salesforce/label/FlowBuilderRecordEditor.object';
import objectPlaceholder from '@salesforce/label/FlowBuilderRecordEditor.objectPlaceholder';
import contextObjectDescription from '@salesforce/label/FlowBuilderStartEditor.contextObjectDescription';
import contextObjectDeleteDescription from '@salesforce/label/FlowBuilderStartEditor.contextObjectDeleteDescription';
import filterRecordsDescription from '@salesforce/label/FlowBuilderStartEditor.filterRecordsDescription';
import requireRecordChangeOption from '@salesforce/label/FlowBuilderRecordEditor.requireRecordChangeOption';
import everyTimeConditionsMet from '@salesforce/label/FlowBuilderRecordEditor.everyTimeConditionsMet';
import onlyWhenChangesMeetConditions from '@salesforce/label/FlowBuilderRecordEditor.onlyWhenChangesMeetConditions';
import { EXECUTE_OUTCOME_WHEN_OPTION_VALUES } from 'builder_platform_interaction/flowMetadata';

export const LABELS = {
    chooseObjectAndRecord,
    contextObjectHeader,
    contextObjectDescription,
    contextObjectDeleteDescription,
    filterRecordsDescription,
    object,
    objectPlaceholder,
    requireRecordChangeOption
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
