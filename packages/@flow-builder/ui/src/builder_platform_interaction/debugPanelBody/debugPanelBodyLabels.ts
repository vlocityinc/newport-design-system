import resultLabel from '@salesforce/label/DebugLogEmail.RecordElementResult';
import faultMess from '@salesforce/label/DebugLogEmail.FaultMessage';
import failedFind from '@salesforce/label/DebugLogEmail.FastLookupFailed';
import inputLabel from '@salesforce/label/FlowDebug.InputValues';
import dml from '@salesforce/label/FlowDebug.Dml';
import soql from '@salesforce/label/FlowDebug.Soql';
import dmlRow from '@salesforce/label/FlowDebug.Dml_Rows';
import soqlRow from '@salesforce/label/FlowDebug.SoqlRows';

const govInfo = 'Element Governor Limits Info';

export const LABELS = {
    resultLabel,
    faultMess,
    failedFind,
    inputLabel,
    dml,
    soql,
    dmlRow,
    soqlRow,
    govInfo
};
