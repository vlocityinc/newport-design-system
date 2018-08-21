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
        isRequired: type.dataType === 'Boolean' ? true : false,
        helpText: '',
        defaultValue: null,
        dataType: type.dataType,
        name: '',
        extensionName: type.name,
        choiceReferences: [],
        defaultSelectedChoiceReference: '',
        fieldType: type.fieldType,
        inputParameters: [],
        fieldText: null,
        outputParameters: [],
        scale: "0" // Store as string for validation purposes.
    };
}
