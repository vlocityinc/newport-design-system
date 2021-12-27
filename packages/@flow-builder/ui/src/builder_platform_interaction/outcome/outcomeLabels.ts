// @ts-nocheck
/* Labels */
import andConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.andConditionLogicLabel';
import customConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.customConditionLogicLabel';
import lhsLabel from '@salesforce/label/FlowBuilderConditionList.lhsLabel';
import lhsPlaceholder from '@salesforce/label/FlowBuilderConditionList.lhsPlaceholder';
import operatorLabel from '@salesforce/label/FlowBuilderConditionList.operatorLabel';
import operatorPlaceholder from '@salesforce/label/FlowBuilderConditionList.operatorPlaceholder';
import orConditionLogicLabel from '@salesforce/label/FlowBuilderConditionList.orConditionLogicLabel';
import rhsLabel from '@salesforce/label/FlowBuilderConditionList.rhsLabel';
import deleteOutcomeLabel from '@salesforce/label/FlowBuilderOutcome.deleteOutcomeLabel';
import deleteOutcomeTitle from '@salesforce/label/FlowBuilderOutcome.deleteOutcomeTitle';
import disableRadioGroupDecisionText from '@salesforce/label/FlowBuilderOutcome.disableRadioGroupDecisionText';
import everyTimeConditionsMet from '@salesforce/label/FlowBuilderOutcome.everyTimeConditionsMet';
import executeOutcomeWhen from '@salesforce/label/FlowBuilderOutcome.executeOutcomeWhen';
import onlyWhenChangesMeetConditions from '@salesforce/label/FlowBuilderOutcome.onlyWhenChangesMeetConditions';
import outcomeApiName from '@salesforce/label/FlowBuilderOutcome.outcomeApiName';
import outcomeConditionsHeader from '@salesforce/label/FlowBuilderOutcome.outcomeConditionsHeader';
import outcomeDetailsHeader from '@salesforce/label/FlowBuilderOutcome.outcomeDetailsHeader';
import outcomeExecuteWhenOptionsHelptext from '@salesforce/label/FlowBuilderOutcome.outcomeExecuteWhenOptionsHelptext';

export const LABELS = {
    outcomeDetailsHeader,
    deleteOutcomeLabel,
    deleteOutcomeTitle,
    outcomeApiName,
    outcomeConditionsHeader,
    andConditionLogicLabel,
    orConditionLogicLabel,
    customConditionLogicLabel,
    lhsLabel,
    lhsPlaceholder,
    operatorLabel,
    operatorPlaceholder,
    rhsLabel,
    executeOutcomeWhen,
    everyTimeConditionsMet,
    onlyWhenChangesMeetConditions,
    outcomeExecuteWhenOptionsHelptext,
    disableRadioGroupDecisionText
};

export const EXECUTE_OUTCOME_WHEN_OPTION_VALUES = {
    EVERY_TIME_CONDITION_MET: 'trueEveryTime',
    ONLY_WHEN_CHANGES_MEET_CONDITIONS: 'trueOnChangeOnly'
};

export const outcomeExecuteWhenOptions = () => {
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
