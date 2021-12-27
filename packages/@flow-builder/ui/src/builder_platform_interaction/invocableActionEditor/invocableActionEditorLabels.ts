// @ts-nocheck
/* Labels */
import emptyInputsOutputsTitle from '@salesforce/label/FlowBuilderCalloutEditor.emptyInputsOutputsTitle';
import emptyInputsTitle from '@salesforce/label/FlowBuilderCalloutEditor.emptyInputsTitle';
import thisActionHasNoInputBody from '@salesforce/label/FlowBuilderCalloutEditor.thisActionHasNoInputBody';
import thisActionHasNoInputOutputBody from '@salesforce/label/FlowBuilderCalloutEditor.thisActionHasNoInputOutputBody';
import apexTypeLabel from '@salesforce/label/FlowBuilderInvocableActionEditor.apexTypeLabel';
import badgeWillCauseErrors from '@salesforce/label/FlowBuilderInvocableActionEditor.badgeWillCauseErrors';
import coreActionTypeLabel from '@salesforce/label/FlowBuilderInvocableActionEditor.coreActionTypeLabel';
import editPropertyEditorTitle from '@salesforce/label/FlowBuilderInvocableActionEditor.editPropertyEditorTitle';
import emailAlertTypeLabel from '@salesforce/label/FlowBuilderInvocableActionEditor.emailAlertTypeLabel';
import inputHeader from '@salesforce/label/FlowBuilderInvocableActionEditor.inputHeader';
import outputHeader from '@salesforce/label/FlowBuilderInvocableActionEditor.outputHeader';
import subtitle from '@salesforce/label/FlowBuilderInvocableActionEditor.subtitle';
import warningNotAvailable from '@salesforce/label/FlowBuilderInvocableActionEditor.warningNotAvailable';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export const LABELS = {
    subtitle,
    inputHeader,
    outputHeader,
    emptyInputsTitle,
    thisActionHasNoInputBody,
    badgeWillCauseErrors,
    warningNotAvailable,
    coreActionTypeLabel,
    apexTypeLabel,
    emailAlertTypeLabel,
    editPropertyEditorTitle,
    thisActionHasNoInputOutputBody,
    emptyInputsOutputsTitle
};

export const ACTION_TYPE_LABEL = {
    [ELEMENT_TYPE.ACTION_CALL]: LABELS.coreActionTypeLabel,
    [ELEMENT_TYPE.APEX_CALL]: LABELS.apexTypeLabel,
    [ELEMENT_TYPE.EMAIL_ALERT]: LABELS.emailAlertTypeLabel
};
