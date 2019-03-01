import { FLOW_PROCESS_TYPE } from "builder_platform_interaction/flowMetadata";

import featured from "@salesforce/label/FlowBuilderProcessTypeTemplates.featured";
import templates from "@salesforce/label/FlowBuilderProcessTypeTemplates.templates";
import newFlowTitle from "@salesforce/label/FlowBuilderProcessTypeTemplates.newFlowTitle";
import newFlowDescription from "@salesforce/label/FlowBuilderProcessTypeTemplates.newFlowDescription";
import newAutolaunchedFlowTitle from '@salesforce/label/FlowBuilderProcessTypeTemplates.newAutolaunchedFlowTitle';
import newAutolaunchedFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription';
import newUserProvisioningFlowTitle from "@salesforce/label/FlowBuilderProcessTypeTemplates.newUserProvisioningFlowTitle";
import newUserProvisioningFlowDescription from "@salesforce/label/FlowBuilderProcessTypeTemplates.newUserProvisioningFlowDescription";
import newFieldServiceMobileTitle from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceMobileTitle';
import newFieldServiceMobileDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceMobileDescription';
import newFieldServiceWebTitle from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceWebTitle';
import newFieldServiceWebDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceWebDescription';
import newProcessTypeTitle from '@salesforce/label/FlowBuilderProcessTypeTemplates.newProcessTypeTitle';
import newProcessTypeDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newProcessTypeDescription';

export const LABELS = {
    featured,
    templates,
    newProcessTypeTitle,
    newProcessTypeDescription,
    [FLOW_PROCESS_TYPE.FLOW] : {
        title : newFlowTitle,
        description : newFlowDescription,
    },
    [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW] : {
        title : newAutolaunchedFlowTitle,
        description : newAutolaunchedFlowDescription,
    },
    [FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW] : {
        title : newUserProvisioningFlowTitle,
        description : newUserProvisioningFlowDescription,
    },
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE] : {
        title : newFieldServiceMobileTitle,
        description : newFieldServiceMobileDescription,
    },
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB] : {
        title : newFieldServiceWebTitle,
        description : newFieldServiceWebDescription,
    },
};