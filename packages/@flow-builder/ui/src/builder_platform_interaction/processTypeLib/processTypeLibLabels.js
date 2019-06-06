import { FLOW_PROCESS_TYPE } from "builder_platform_interaction/flowMetadata";

import featured from "@salesforce/label/FlowBuilderProcessTypeTemplates.featured";
import templates from "@salesforce/label/FlowBuilderProcessTypeTemplates.templates";
import newFlowDescription from "@salesforce/label/FlowBuilderProcessTypeTemplates.newFlowDescription";
import newAutolaunchedFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription';
import newUserProvisioningFlowDescription from "@salesforce/label/FlowBuilderProcessTypeTemplates.newUserProvisioningFlowDescription";
import newFieldServiceMobileDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceMobileDescription';
import newFieldServiceWebDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceWebDescription';
import newProcessTypeDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newProcessTypeDescription';
import newContactRequestFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newContactRequestFlowDescription';
import spinnerAlternativeText from '@salesforce/label/FlowBuilderEditor.spinnerAlternativeText';
import errorLoadingProcessTypes from '@salesforce/label/FlowBuilderNewFlowModal.errorLoadingProcessTypes';
import errorLoadingTemplates from '@salesforce/label/FlowBuilderNewFlowModal.errorLoadingTemplates';
import errorLoadingTemplateData from '@salesforce/label/FlowBuilderNewFlowModal.errorLoadingTemplateData';

export const LABELS = {
    featured,
    templates,
    newProcessTypeDescription,
    spinnerAlternativeText,
    [FLOW_PROCESS_TYPE.FLOW] : newFlowDescription,
    [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW] : newAutolaunchedFlowDescription,
    [FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW] : newUserProvisioningFlowDescription,
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE] : newFieldServiceMobileDescription,
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB] : newFieldServiceWebDescription,
    [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW] : newContactRequestFlowDescription,
    errorLoadingProcessTypes,
    errorLoadingTemplates,
    errorLoadingTemplateData,
};