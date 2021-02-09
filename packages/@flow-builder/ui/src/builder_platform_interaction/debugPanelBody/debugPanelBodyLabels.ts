import resultLabel from '@salesforce/label/DebugLogEmail.RecordElementResult';
import faultMess from '@salesforce/label/DebugLogEmail.FaultMessage';
import failedFind from '@salesforce/label/DebugLogEmail.FastLookupFailed';
import inputLabel from '@salesforce/label/FlowDebug.InputValues';
import errorBody from '@salesforce/label/InteractionRuntimeError.ErrorBody';
import equals from '@salesforce/label/InteractionMdApiFlowComparisonOperator.EqualTo';

const govInfo = 'Element Governor Limits Info';

export const LABELS = {
    resultLabel,
    faultMess,
    failedFind,
    inputLabel,
    govInfo,
    errorBody,
    equals
};
