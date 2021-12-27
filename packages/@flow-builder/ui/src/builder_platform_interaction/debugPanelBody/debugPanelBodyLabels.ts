import failedRecordCreates from '@salesforce/label/DebugLogEmail.FastCreateFailed';
import failedRecordDeletes from '@salesforce/label/DebugLogEmail.FastDeleteFailed';
// the following are "Failed to... <CRUD record(s)>" messages that need to have a warning icon
import failedRecordLookups from '@salesforce/label/DebugLogEmail.FastLookupFailed';
import failedRecordUpdates from '@salesforce/label/DebugLogEmail.FastUpdateFailed';
import faultMess from '@salesforce/label/DebugLogEmail.FaultMessage';
import failedRecordCreate from '@salesforce/label/DebugLogEmail.RecordCreateFailed';
import failedRecordDelete from '@salesforce/label/DebugLogEmail.RecordDeleteFailed';
import resultLabel from '@salesforce/label/DebugLogEmail.RecordElementResult';
import failedRecordLookup from '@salesforce/label/DebugLogEmail.RecordLookupFailed';
import failedRecordUpdate from '@salesforce/label/DebugLogEmail.RecordUpdateFailed';
import alarmEventHelpTextHeader from '@salesforce/label/FlowBuilderDebugPanel.alarmEventHelpTextHeader';
import govInfo from '@salesforce/label/FlowBuilderDebugPanel.governorLimitsSubtitle';
import waitEventSelectionHelpText from '@salesforce/label/FlowBuilderDebugPanel.waitEventSelectionHelpText';
import waitEventSelectionLabel from '@salesforce/label/FlowBuilderDebugPanel.waitEventSelectionLabel';
import waitEventSubmitLabel from '@salesforce/label/FlowBuilderDebugPanel.waitEventSubmitLabel';
import inputLabel from '@salesforce/label/FlowDebug.InputValues';
import equals from '@salesforce/label/InteractionMdApiFlowComparisonOperator.EqualTo';
import errorBody from '@salesforce/label/InteractionRuntimeError.ErrorBody';

export const LABELS = {
    resultLabel,
    faultMess,
    inputLabel,
    govInfo,
    errorBody,
    equals,
    alarmEventHelpTextHeader,
    waitEventSelectionLabel,
    waitEventSelectionHelpText,
    waitEventSubmitLabel
};

export const failedToCRUDRecordAbsoluteMatches = [
    failedRecordLookups,
    failedRecordLookup,
    failedRecordCreates,
    failedRecordCreate,
    failedRecordUpdate,
    failedRecordDelete
];

export const failedToCRUDRecordRelativeMatches = [
    failedRecordUpdates.replace('{0}', '').replace('.', '').trim(),
    failedRecordDeletes.replace('{0}', '').replace('.', '').trim()
];
