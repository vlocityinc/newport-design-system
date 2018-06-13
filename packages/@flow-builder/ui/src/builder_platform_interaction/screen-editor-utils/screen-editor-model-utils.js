import { generateGuid } from 'builder_platform_interaction-store-lib';

/**
 * Creates an empty screen
 * @returns {object} - The empty screen
 */
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

/**
 * Creates an empty screen field of the given type
 * @param {object} type - The field type
 * @return {object} - The new screen field
 */
export function createEmptyNodeOfType(type) {
    return {
        guid:generateGuid(),
        isRequired: false,
        helpText: null,
        defaultValue:null,
        dataType: type.dataType,
        name: '',
        choiceReferences: [],
        defaultSelectedChoiceReference: null,
        fieldType: type.fieldType,
        inputParameters: [],
        fieldText: null,
        label: null,
        outputParameters: []
    };
}
