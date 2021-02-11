import resultLabel from '@salesforce/label/DebugLogEmail.RecordElementResult';
import faultMess from '@salesforce/label/DebugLogEmail.FaultMessage';
import failedFind from '@salesforce/label/DebugLogEmail.FastLookupFailed';
import inputLabel from '@salesforce/label/FlowDebug.InputValues';
import errorBody from '@salesforce/label/InteractionRuntimeError.ErrorBody';
import equals from '@salesforce/label/InteractionMdApiFlowComparisonOperator.EqualTo';
import alarmEventHelpTextHeader from '@salesforce/label/FlowBuilderDebugPanel.alarmEventHelpTextHeader';
import waitEventSelectionLabel from '@salesforce/label/FlowBuilderDebugPanel.waitEventSelectionLabel';
import waitEventSelectionHelpText from '@salesforce/label/FlowBuilderDebugPanel.waitEventSelectionHelpText';
import waitEventSubmitLabel from '@salesforce/label/FlowBuilderDebugPanel.waitEventSubmitLabel';

const govInfo = 'Element Governor Limits Info';

export const LABELS = {
    resultLabel,
    faultMess,
    failedFind,
    inputLabel,
    govInfo,
    errorBody,
    equals,
    alarmEventHelpTextHeader,
    waitEventSelectionLabel,
    waitEventSelectionHelpText,
    waitEventSubmitLabel
};
