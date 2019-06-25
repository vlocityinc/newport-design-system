import { emailScreenFieldAutomaticOutputGuid } from 'mock/storeData';

/**
 * Extension (ie: Lightning component) screenfield mocked resource details in output automatic mode (email)
 */
export const mockExtensionScreenfieldAutomaticOutputsModeResourceDetails = {
    title: 'Outputs from email1',
    elementType: 'SCREEN_FIELD',
    elementGuid: emailScreenFieldAutomaticOutputGuid,
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
    storeOutputAutomatically: true,
    extensionName: 'flowruntime:email'
};

/**
 * Extension (ie: Lightning component) screenfield mocked resource details NOT in output automatic mode (email)
 */
export const mockExtensionScreenfieldNotInAutomaticOutputsModeResourceDetails = {
    title: 'Outputs from email1',
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
