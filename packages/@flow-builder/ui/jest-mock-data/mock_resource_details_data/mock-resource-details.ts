// @ts-nocheck
import {
    emailScreenFieldAutomaticOutput,
    screenElement,
    actionCallAutomaticOutput,
    actionCallLocalActionAutomaticOutput,
    subflowAutomaticOutput
} from 'mock/storeData';
import {
    loopAccountAutomaticOutput,
    loopOnTextCollectionAutomaticOutput,
    loopOnApexTypeCollectionAutoOutput
} from 'mock/storeDataAutolaunched';

/**
 * Extension (ie: Lightning component) screenfield mocked resource details in output automatic mode (email)
 */
export const mockExtensionScreenfieldAutomaticOutputsModeResourceDetails = {
    title: 'email1',
    elementType: 'SCREEN_FIELD',
    elementGuid: emailScreenFieldAutomaticOutput.guid,
    typeLabel: 'Screen Component',
    typeIconName: 'utility:connected_apps',
    apiName: 'email1',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: 'e02b01cb-0cb0-4e42-8939-3b8d36af2ff8',
        name: 'email1',
        elementGuidsReferenced: ['e02b01cb-0cb0-4e42-8939-3b8d36af2ff8'],
        iconName: 'standard:display_text',
        isCanvasElement: false
    },
    usedByElements: [
        {
            guid: screenElement.guid,
            label: 'screen1',
            name: 'screen1',
            elementGuidsReferenced: ['e02b01cb-0cb0-4e42-8939-3b8d36af2ff8'],
            iconName: 'standard:screen',
            isCanvasElement: true
        }
    ],
    asResource: true,
    storeOutputAutomatically: true,
    extensionName: 'flowruntime:email'
};

/**
 * Extension (ie: Lightning component) screenfield mocked resource details NOT in output automatic mode (email)
 */
export const mockExtensionScreenfieldNotInAutomaticOutputsModeResourceDetails = {
    title: 'email1',
    elementType: 'SCREEN_FIELD',
    elementGuid: 'e02b01cb-0cb0-4e42-8939-3b8d36af2ff8',
    typeLabel: 'Screen Component',
    typeIconName: 'utility:connected_apps',
    apiName: 'email1',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: 'e02b01cb-0cb0-4e42-8939-3b8d36af2ff8',
        name: 'email1',
        elementGuidsReferenced: ['e02b01cb-0cb0-4e42-8939-3b8d36af2ff8'],
        iconName: 'standard:display_text',
        isCanvasElement: false
    },
    usedByElements: [
        {
            guid: '7a3dd6c8-4eeb-4468-acee-6104c0bea63a',
            label: 'screen1',
            name: 'screen1',
            elementGuidsReferenced: ['e02b01cb-0cb0-4e42-8939-3b8d36af2ff8'],
            iconName: 'standard:screen',
            isCanvasElement: true
        }
    ],
    asResource: true,
    storeOutputAutomatically: false,
    extensionName: 'flowruntime:email'
};

/**
 * Get Records mocked resource details in output automatic mode
 */
export const mockGetRecordsAutomaticOutputModeResourceDetails = {
    title: 'Account from myGetAccount2',
    elementType: 'RecordQuery',
    elementGuid: '9955802e-230e-44a7-a59e-f18c621678f6',
    typeLabel: 'Get Records',
    typeIconName: 'utility:sobject',
    apiName: 'myGetAccount2',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: '9955802e-230e-44a7-a59e-f18c621678f6',
        label: 'myGetAccount2',
        name: 'myGetAccount2',
        elementGuidsReferenced: ['9955802e-230e-44a7-a59e-f18c621678f6'],
        iconName: 'standard:record_lookup',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: true
};

/**
 * Record variable of Account type (storeOutputAutomatically is undefined for such a resource)
 */
export const mockAccountRecordVariable = {
    title: 'vAccount',
    elementType: 'Variable',
    elementGuid: 'd29c8d97-798a-4a5c-9556-9ca068fe8999',
    typeLabel: 'Record (Single) Variable',
    typeIconName: 'utility:sobject',
    description: '',
    apiName: 'vAccount',
    editable: true,
    deletable: true,
    usedByElements: [],
    asResource: true
};

/**
 * Action (submit for approval) mocked resource details in output automatic mode
 */
export const mockActionSubmitForApprovalAutomaticOutputsModeResourceDetails = {
    title: 'Outputs from actionCallAutomaticOutput',
    elementType: 'ActionCall',
    elementGuid: actionCallAutomaticOutput.guid,
    typeLabel: 'Action',
    typeIconName: 'utility:fallback',
    apiName: 'actionCallAutomaticOutput',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: actionCallAutomaticOutput.guid,
        label: 'actionCallAutomaticOutput',
        name: 'actionCallAutomaticOutput',
        elementGuidsReferenced: [actionCallAutomaticOutput.guid],
        iconName: 'standard:custom_notification',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: true
};

/**
 * Action (submit for approval) mocked resource details NOT in output automatic mode
 */
export const mockActionSubmitForApprovalNotInAutomaticOutputsModeResourceDetails = {
    title: 'Outputs from Submit_for_Approval',
    elementType: 'ActionCall',
    elementGuid: '221e7daa-d78e-4d39-a37d-2ff9b6d460da',
    typeLabel: 'Action',
    typeIconName: 'utility:fallback',
    apiName: 'Submit_for_Approval',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: '221e7daa-d78e-4d39-a37d-2ff9b6d460da',
        label: 'Submit for Approval',
        name: 'Submit_for_Approval',
        elementGuidsReferenced: ['221e7daa-d78e-4d39-a37d-2ff9b6d460da'],
        iconName: 'standard:custom_notification',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: false
};

/**
 * Action (local action) mocked resource details in output automatic mode
 */
export const mockActionLocalActionInAutomaticOutputsModeResourceDetails = {
    title: 'Outputs from myLocalAction',
    elementType: 'ActionCall',
    elementGuid: actionCallLocalActionAutomaticOutput.guid,
    typeLabel: 'Action',
    typeIconName: 'utility:fallback',
    apiName: 'myLocalAction',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: actionCallLocalActionAutomaticOutput.guid,
        label: 'myLocalAction',
        name: 'myLocalAction',
        elementGuidsReferenced: [actionCallLocalActionAutomaticOutput.guid],
        iconName: 'standard:custom_notification',
        isCanvasElement: true
    },
    usedByElements: [
        {
            guid: '7625d1c3-ef2a-4aa8-a699-c27e853fa854',
            name: 'textTplt',
            elementGuidsReferenced: [actionCallLocalActionAutomaticOutput.guid],
            iconName: 'standard:text_template',
            isCanvasElement: false
        }
    ],
    asResource: true,
    storeOutputAutomatically: true
};

/**
 * Action (local action) mocked resource details NOT in output automatic mode
 */
export const mockActionLocalActionNotInAutomaticOutputsModeResourceDetails = {
    title: 'Outputs from myLocalAction',
    elementType: 'ActionCall',
    elementGuid: 'a315f61f-9151-4c4a-9561-aaf4e52e0899',
    typeLabel: 'Action',
    typeIconName: 'utility:fallback',
    apiName: 'myLocalAction',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: 'a315f61f-9151-4c4a-9561-aaf4e52e0899',
        label: 'myLocalAction',
        name: 'myLocalAction',
        elementGuidsReferenced: ['a315f61f-9151-4c4a-9561-aaf4e52e0899'],
        iconName: 'standard:custom_notification',
        isCanvasElement: true
    },
    usedByElements: [
        {
            guid: '7625d1c3-ef2a-4aa8-a699-c27e853fa854',
            name: 'textTplt',
            elementGuidsReferenced: ['a315f61f-9151-4c4a-9561-aaf4e52e0899'],
            iconName: 'standard:text_template',
            isCanvasElement: false
        }
    ],
    asResource: true,
    storeOutputAutomatically: false
};

/**
 * Apex action mocked resource details in output automatic mode
 */
export const mockApexActionInAutomaticOutputsModeResourceDetails = {
    title: 'Outputs from apex_action1',
    elementType: 'APEX_CALL',
    elementGuid: 'e83d93e7-95ee-4fba-82c5-ee4179e29b31',
    typeLabel: 'Action',
    typeIconName: 'utility:fallback',
    apiName: 'apex_action1',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: 'e83d93e7-95ee-4fba-82c5-ee4179e29b31',
        label: 'apex action1',
        name: 'apex_action1',
        elementGuidsReferenced: ['e83d93e7-95ee-4fba-82c5-ee4179e29b31'],
        iconName: 'standard:apex',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: true
};

/**
 * Apex action mocked resource details NOT in output automatic mode
 */
export const mockApexActionNotInAutomaticOutputsModeResourceDetails = {
    title: 'Outputs from apex_action1',
    elementType: 'APEX_CALL',
    elementGuid: 'e83d93e7-95ee-4fba-82c5-ee4179e29b31',
    typeLabel: 'Action',
    typeIconName: 'utility:fallback',
    apiName: 'apex_action1',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: 'e83d93e7-95ee-4fba-82c5-ee4179e29b31',
        label: 'apex action1',
        name: 'apex_action1',
        elementGuidsReferenced: ['e83d93e7-95ee-4fba-82c5-ee4179e29b31'],
        iconName: 'standard:apex',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: false
};

/**
 * Create Record mocked resource details in output automatic mode
 */
export const mockCreateRecordAutomaticOutputModeResourceDetails = {
    title: 'AccountId from create_account_auto',
    elementType: 'RecordCreate',
    elementGuid: '6a010534-a5f0-485e-bb01-e6f0940c060c',
    typeLabel: 'Variable',
    typeIconName: 'utility:text',
    apiName: 'create_account_auto',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: '6a010534-a5f0-485e-bb01-e6f0940c060c',
        label: 'create account auto',
        name: 'create_account_auto',
        elementGuidsReferenced: ['6a010534-a5f0-485e-bb01-e6f0940c060c'],
        iconName: 'standard:record_create',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: true
};

/**
 * Create Record mocked resource details NOT in output automatic mode
 */
export const mockCreateRecordNotInAutomaticOutputModeResourceDetails = {
    title: 'AccountId from create_account_auto',
    elementType: 'RecordCreate',
    elementGuid: '6a010534-a5f0-485e-bb01-e6f0940c060c',
    typeLabel: 'Variable',
    typeIconName: 'utility:text',
    apiName: 'create_account_auto',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: '6a010534-a5f0-485e-bb01-e6f0940c060c',
        label: 'create account auto',
        name: 'create_account_auto',
        elementGuidsReferenced: ['6a010534-a5f0-485e-bb01-e6f0940c060c'],
        iconName: 'standard:record_create',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: false
};

export const mockApexActionInAutomaticOutputsModeAnonymousStringResourceDetails = {
    title: 'String from string_anonymous',
    elementType: 'APEX_CALL',
    elementGuid: '7ba0c9f6-68f2-40d3-8cdf-36292a6e5562',
    typeLabel: 'Apex Action',
    typeIconName: 'utility:text',
    apiName: 'string_anonymous',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: '7ba0c9f6-68f2-40d3-8cdf-36292a6e5562',
        label: 'string anonymous',
        name: 'string_anonymous',
        elementGuidsReferenced: ['7ba0c9f6-68f2-40d3-8cdf-36292a6e5562'],
        iconName: 'standard:apex',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: true,
    isSystemGeneratedOutput: true
};

/**
 * Subflow mocked resource details in output automatic mode
 */
export const mockSubflowInAutomaticOutputModeResourceDetails = {
    title: 'Outputs from subflow1',
    elementType: 'Subflow',
    elementGuid: subflowAutomaticOutput.guid,
    typeLabel: 'Subflow',
    typeIconName: 'utility:flow',
    apiName: 'subflow1',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: subflowAutomaticOutput.guid,
        label: 'subflow1',
        name: 'subflow1',
        elementGuidsReferenced: [subflowAutomaticOutput.guid],
        iconName: 'standard:flow',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: true
};

/**
 * Loop on Apex type defined collection mocked resource details in output automatic mode
 */
export const mockLoopOnApexTypeInAutomaticOutputModeResourceDetails = {
    title: 'Current Looped ApexComplexTypeTestOne216 from loop_apex_coll',
    elementType: 'Loop',
    elementGuid: loopOnApexTypeCollectionAutoOutput.guid,
    typeLabel: 'Apex-Defined Variable',
    typeIconName: 'utility:apex',
    apiName: 'loop_apex_coll',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: loopOnApexTypeCollectionAutoOutput.guid,
        label: 'loop apex coll',
        name: 'loop_apex_coll',
        elementGuidsReferenced: [loopOnApexTypeCollectionAutoOutput.guid],
        iconName: 'standard:loop',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: true
};

/**
 * Loop on Sobject collection mocked resource details in output automatic mode
 */
export const mockLoopOnSObjectInAutomaticOutputModeResourceDetails = {
    title: 'Account from loop_accounts',
    elementType: 'Loop',
    elementGuid: loopAccountAutomaticOutput.guid,
    typeLabel: 'Record (Single) Variable',
    typeIconName: 'utility:sobject',
    apiName: 'loop_accounts',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: loopAccountAutomaticOutput.guid,
        label: 'loop accounts',
        name: 'loop_accounts',
        elementGuidsReferenced: [loopAccountAutomaticOutput.guid],
        iconName: 'standard:loop',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: true
};

/**
 * Loop on text collection mocked resource details in output automatic mode
 */
export const mockLoopOnTextInAutomaticOutputModeResourceDetails = {
    title: 'Current Looped Text from loop_text',
    elementType: 'Loop',
    elementGuid: loopOnTextCollectionAutomaticOutput.guid,
    typeLabel: 'Loop',
    typeIconName: 'utility:text',
    apiName: 'loop_text',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: loopOnTextCollectionAutomaticOutput.guid,
        label: 'loop text',
        name: 'loop_text',
        elementGuidsReferenced: [loopOnTextCollectionAutomaticOutput.guid],
        iconName: 'standard:loop',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true,
    storeOutputAutomatically: true
};
