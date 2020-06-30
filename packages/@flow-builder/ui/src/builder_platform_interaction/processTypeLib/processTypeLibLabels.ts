// @ts-nocheck
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';

import newFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFlowDescription';
import newAutolaunchedFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription';
import newUserProvisioningFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newUserProvisioningFlowDescription';
import newFieldServiceMobileDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceMobileDescription';
import newFieldServiceWebDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceWebDescription';
import newProcessTypeDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newProcessTypeDescription';
import newContactRequestFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newContactRequestFlowDescription';
import newScheduledFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newScheduledFlowDescription';
import newRecordChangedFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newRecordChangedFlowDescription';
import newAppProcessDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newAppProcessDescription';
import newScheduledFlowLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newScheduledFlowLabel';
import newRecordChangedFlowLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newRecordChangedFlowLabel';
import newPlatformEventFlowLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newPlatformEventFlowLabel';

export const LABELS = {
    newProcessTypeDescription,
    [FLOW_PROCESS_TYPE.FLOW]: newFlowDescription,
    [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: newAutolaunchedFlowDescription,
    [FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW]: newUserProvisioningFlowDescription,
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE]: newFieldServiceMobileDescription,
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB]: newFieldServiceWebDescription,
    [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW]: newContactRequestFlowDescription,
    [FLOW_PROCESS_TYPE.APP_PROCESS]: newAppProcessDescription,
    [FLOW_TRIGGER_TYPE.SCHEDULED]: newScheduledFlowDescription,
    [FLOW_TRIGGER_TYPE.BEFORE_SAVE]: newRecordChangedFlowDescription,
    [FLOW_TRIGGER_TYPE.BEFORE_DELETE]: newRecordChangedFlowDescription,
    [FLOW_TRIGGER_TYPE.AFTER_SAVE]: newRecordChangedFlowDescription
};

export const TRIGGER_TYPE_LABELS = {
    [FLOW_TRIGGER_TYPE.SCHEDULED]: newScheduledFlowLabel,
    [FLOW_TRIGGER_TYPE.BEFORE_SAVE]: newRecordChangedFlowLabel,
    [FLOW_TRIGGER_TYPE.BEFORE_DELETE]: newRecordChangedFlowLabel,
    [FLOW_TRIGGER_TYPE.AFTER_SAVE]: newRecordChangedFlowLabel,
    [FLOW_TRIGGER_TYPE.PLATFORM_EVENT]: newPlatformEventFlowLabel
};
