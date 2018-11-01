/* Labels */
import subtitle from "@salesforce/label/FlowBuilderInvocableActionEditor.subtitle";
import inputTabHeader from "@salesforce/label/FlowBuilderInvocableActionEditor.inputTabHeader";
import outputTabHeader from "@salesforce/label/FlowBuilderInvocableActionEditor.outputTabHeader";
import emptyInputsTitle from "@salesforce/label/FlowBuilderCalloutEditor.emptyInputsTitle";
import emptyInputsBody from "@salesforce/label/FlowBuilderCalloutEditor.emptyInputsBody";
import emptyOutputsTitle from "@salesforce/label/FlowBuilderCalloutEditor.emptyOutputsTitle";
import emptyOutputsBody from "@salesforce/label/FlowBuilderCalloutEditor.emptyOutputsBody";
import badgeWillCauseErrors from "@salesforce/label/FlowBuilderInvocableActionEditor.badgeWillCauseErrors";
import warningNotAvailable from "@salesforce/label/FlowBuilderInvocableActionEditor.warningNotAvailable";
import coreActionTypeLabel from "@salesforce/label/FlowBuilderInvocableActionEditor.coreActionTypeLabel";
import apexTypeLabel from "@salesforce/label/FlowBuilderInvocableActionEditor.apexTypeLabel";
import emailAlertTypeLabel from "@salesforce/label/FlowBuilderInvocableActionEditor.emailAlertTypeLabel";

import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

export const LABELS = {
    subtitle,
    inputTabHeader,
    outputTabHeader,
    emptyInputsTitle,
    emptyInputsBody,
    emptyOutputsTitle,
    emptyOutputsBody,
    badgeWillCauseErrors,
    warningNotAvailable,
    coreActionTypeLabel,
    apexTypeLabel,
    emailAlertTypeLabel,
};

export const ACTION_TYPE_LABEL = {
        [ELEMENT_TYPE.ACTION_CALL]: LABELS.coreActionTypeLabel,
        [ELEMENT_TYPE.APEX_CALL]: LABELS.apexTypeLabel,
        [ELEMENT_TYPE.EMAIL_ALERT]: LABELS.emailAlertTypeLabel,
    };