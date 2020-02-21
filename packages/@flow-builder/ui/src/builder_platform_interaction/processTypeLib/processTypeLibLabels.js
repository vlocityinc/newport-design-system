import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';

import newFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFlowDescription';
import newAutolaunchedFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription';
import newUserProvisioningFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newUserProvisioningFlowDescription';
import newFieldServiceMobileDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceMobileDescription';
import newFieldServiceWebDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceWebDescription';
import newProcessTypeDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newProcessTypeDescription';
import newContactRequestFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newContactRequestFlowDescription';
import newScheduledFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newScheduledFlowDescription';
import newBeforeSaveFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newBeforeSaveFlowDescription';
import newScheduledFlowLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newScheduledFlowLabel';
import newBeforeSaveFlowLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newBeforeSaveFlowLabel';

export const LABELS = {
    newProcessTypeDescription,
    [FLOW_PROCESS_TYPE.FLOW]: newFlowDescription,
    [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: newAutolaunchedFlowDescription,
    [FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW]: newUserProvisioningFlowDescription,
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE]: newFieldServiceMobileDescription,
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB]: newFieldServiceWebDescription,
    [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW]: newContactRequestFlowDescription,
    [FLOW_TRIGGER_TYPE.SCHEDULED]: newScheduledFlowDescription,
    [FLOW_TRIGGER_TYPE.BEFORE_SAVE]: newBeforeSaveFlowDescription
};

export const TRIGGER_TYPE_LABELS = {
    [FLOW_TRIGGER_TYPE.SCHEDULED]: newScheduledFlowLabel,
    [FLOW_TRIGGER_TYPE.BEFORE_SAVE]: newBeforeSaveFlowLabel,
    [FLOW_TRIGGER_TYPE.AFTER_SAVE]: newBeforeSaveFlowLabel // This should probably be changed to newRecordChangeFlow
};
