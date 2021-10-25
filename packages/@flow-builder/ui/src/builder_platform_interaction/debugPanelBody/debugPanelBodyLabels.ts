import resultLabel from '@salesforce/label/DebugLogEmail.RecordElementResult';
import faultMess from '@salesforce/label/DebugLogEmail.FaultMessage';
import inputLabel from '@salesforce/label/FlowDebug.InputValues';
import errorBody from '@salesforce/label/InteractionRuntimeError.ErrorBody';
import equals from '@salesforce/label/InteractionMdApiFlowComparisonOperator.EqualTo';
import alarmEventHelpTextHeader from '@salesforce/label/FlowBuilderDebugPanel.alarmEventHelpTextHeader';
import waitEventSelectionLabel from '@salesforce/label/FlowBuilderDebugPanel.waitEventSelectionLabel';
import waitEventSelectionHelpText from '@salesforce/label/FlowBuilderDebugPanel.waitEventSelectionHelpText';
import waitEventSubmitLabel from '@salesforce/label/FlowBuilderDebugPanel.waitEventSubmitLabel';
import govInfo from '@salesforce/label/FlowBuilderDebugPanel.governorLimitsSubtitle';

// the following are "Failed to... <CRUD record(s)>" messages that need to have a warning icon
import failedRecordLookups from '@salesforce/label/DebugLogEmail.FastLookupFailed';
import failedRecordLookup from '@salesforce/label/DebugLogEmail.RecordLookupFailed';
import failedRecordCreates from '@salesforce/label/DebugLogEmail.FastCreateFailed';
import failedRecordCreate from '@salesforce/label/DebugLogEmail.RecordCreateFailed';
import failedRecordUpdates from '@salesforce/label/DebugLogEmail.FastUpdateFailed';
import failedRecordUpdate from '@salesforce/label/DebugLogEmail.RecordUpdateFailed';
import failedRecordDeletes from '@salesforce/label/DebugLogEmail.FastDeleteFailed';
import failedRecordDelete from '@salesforce/label/DebugLogEmail.RecordDeleteFailed';

import exitDetermination from '@salesforce/label/FlowStageStepActionType.ExitDetermination';

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
    waitEventSubmitLabel,
    exitDetermination
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
