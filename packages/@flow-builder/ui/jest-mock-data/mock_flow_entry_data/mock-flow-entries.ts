// @ts-nocheck
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';

export const MOCK_ALL_FLOW_ENTRIES = [
    {
        label: 'Screen Flow',
        description: 'Screen Flow Description',
        icon: 'utility:desktop',
        recommended: true,
        processType: FLOW_PROCESS_TYPE.FLOW
    },
    {
        label: 'Record Changed',
        description: 'Record Changed Description',
        icon: 'utility:record_update',
        recommended: true,
        processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
        defaultTriggerType: FLOW_TRIGGER_TYPE.AFTER_SAVE,
        triggerTypes: [FLOW_TRIGGER_TYPE.AFTER_SAVE, FLOW_TRIGGER_TYPE.BEFORE_SAVE, FLOW_TRIGGER_TYPE.BEFORE_DELETE]
    },
    {
        label: 'Scheduled',
        description: 'Scheduled Autolaunch Flow Description',
        icon: 'utility:clock',
        recommended: true,
        processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
        defaultTriggerType: FLOW_TRIGGER_TYPE.SCHEDULED,
        triggerTypes: [FLOW_TRIGGER_TYPE.SCHEDULED]
    },
    {
        label: 'Autolaunched Flow',
        description: 'Autolaunch Flow Description',
        icon: 'utility:magicwand',
        recommended: true,
        processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
    },
    {
        label: 'Checkout Flow',
        description: 'Checkout Flow Description',
        icon: 'utility:cart',
        processType: FLOW_PROCESS_TYPE.CHECKOUT_FLOW
    },
    {
        label: 'Flow by value entry',
        description: 'Flow by value entry Description',
        icon: 'utility:flow',
        processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
        recommended: true,
        flow: {
            start: {
                triggerType: FLOW_TRIGGER_TYPE.BEFORE_SAVE
            },
            processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
        }
    },
    {
        description: 'FlowBuilderProcessTypeTemplates.newContactRequestFlowDescription',
        icon: 'utility:contact_request',
        label: 'Contact Request Flow',
        processType: FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW
    },
    {
        description: 'FlowBuilderProcessTypeTemplates.newFieldServiceWebDescription',
        icon: 'utility:insert_tag_field',
        label: 'Embedded Appointment Management Flow',
        processType: FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB
    },
    {
        description: 'FlowBuilderProcessTypeTemplates.newFieldServiceMobileDescription',
        icon: 'utility:phone_portrait',
        label: 'Field Service Mobile Flow',
        processType: FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE
    },
    {
        description: 'FlowBuilderProcessTypeTemplates.newUserProvisioningFlowDescription',
        icon: 'utility:user',
        label: 'User Provisioning Flow',
        processType: FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW
    },
    {
        description: 'FlowBuilderProcessTypeTemplates.newProcessTypeDescription',
        icon: 'utility:flow',
        label: 'Well no icon yet',
        processType: 'WeDoNotKnowYou'
    }
];
