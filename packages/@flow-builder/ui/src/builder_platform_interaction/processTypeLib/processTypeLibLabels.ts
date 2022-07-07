// @ts-nocheck
import newAppProcessDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newAppProcessDescription';
import newAutolaunchedFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription';
import newCMSOrchestrationDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newCMSOrchestrationDescription';
import newCMSOrchestrationLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newCMSOrchestrationLabel';
import newContactRequestFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newContactRequestFlowDescription';
import newEvaluationFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newEvaluationFlowDescription';
import newFieldServiceMobileDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceMobileDescription';
import newFieldServiceWebDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFieldServiceWebDescription';
import newFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newFlowDescription';
import newOrchestrationLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newOrchestrationLabel';
import newPlatformEventFlowLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newPlatformEventFlowLabel';
import newProcessTypeDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newProcessTypeDescription';
import newRecordChangedFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newRecordChangedFlowDescription';
import newRecordChangedFlowLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newRecordChangedFlowLabel';
import newRecordChangedOrchestrationLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newRecordChangedOrchestrationLabel';
import newScheduledFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newScheduledFlowDescription';
import newScheduledFlowLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newScheduledFlowLabel';
import newSegmentJourneyLabel from '@salesforce/label/FlowBuilderProcessTypeTemplates.newSegmentJourneyLabel';
import newUserProvisioningFlowDescription from '@salesforce/label/FlowBuilderProcessTypeTemplates.newUserProvisioningFlowDescription';
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';

export const LABELS = {
    newProcessTypeDescription,
    [FLOW_PROCESS_TYPE.FLOW]: newFlowDescription,
    [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: newAutolaunchedFlowDescription,
    [FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW]: newUserProvisioningFlowDescription,
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE]: newFieldServiceMobileDescription,
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB]: newFieldServiceWebDescription,
    [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW]: newContactRequestFlowDescription,
    [FLOW_PROCESS_TYPE.ORCHESTRATOR]: newAppProcessDescription,
    [FLOW_TRIGGER_TYPE.SCHEDULED]: newScheduledFlowDescription,
    [FLOW_TRIGGER_TYPE.BEFORE_SAVE]: newRecordChangedFlowDescription,
    [FLOW_TRIGGER_TYPE.BEFORE_DELETE]: newRecordChangedFlowDescription,
    [FLOW_TRIGGER_TYPE.AFTER_SAVE]: newRecordChangedFlowDescription,
    [FLOW_PROCESS_TYPE.EVALUATION_FLOW]: newEvaluationFlowDescription,
    [FLOW_PROCESS_TYPE.CMS_ORCHESTRATOR]: newCMSOrchestrationDescription
};

export const TRIGGER_TYPE_LABELS = {
    [FLOW_TRIGGER_TYPE.SCHEDULED]: newScheduledFlowLabel,
    [FLOW_TRIGGER_TYPE.BEFORE_SAVE]: newRecordChangedFlowLabel,
    [FLOW_TRIGGER_TYPE.BEFORE_DELETE]: newRecordChangedFlowLabel,
    [FLOW_TRIGGER_TYPE.AFTER_SAVE]: newRecordChangedFlowLabel,
    [FLOW_TRIGGER_TYPE.PLATFORM_EVENT]: newPlatformEventFlowLabel,
    [FLOW_TRIGGER_TYPE.SEGMENT]: newSegmentJourneyLabel
};

export const PROCESS_TRIGGER_TYPE_LABELS = {
    [FLOW_PROCESS_TYPE.ORCHESTRATOR + FLOW_TRIGGER_TYPE.NONE]: newOrchestrationLabel,
    [FLOW_PROCESS_TYPE.ORCHESTRATOR + FLOW_TRIGGER_TYPE.AFTER_SAVE]: newRecordChangedOrchestrationLabel,
    [FLOW_PROCESS_TYPE.CMS_ORCHESTRATOR + FLOW_TRIGGER_TYPE.NONE]: newCMSOrchestrationLabel
};
