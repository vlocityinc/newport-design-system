import { generateGuid } from 'builder_platform_interaction-store-lib';

// **************************************** MODEL SUPPORT FUNCTIONS *********************************************
export function createEmptyScreenNode() {
    return {
        allowBack: true,
        allowFinish: true,
        allowPause: true,
        description: '',
        elementType: 'SCREEN',
        helpText: '',
        label: '',
        name: '',
        pausedText: '',
        showFooter: true,
        showHeader: true,
        rules: [],
        fields: []
    };
}

// Returns a new screen empty node (TODO: This is not used right now, should be used from the FB palette if necessary)
export const createEmptyNodeOfType = (type) => {
    return {
        guid: generateGuid,
        fieldType: type.fieldType,
        dataType: type.dataType
    };
};
