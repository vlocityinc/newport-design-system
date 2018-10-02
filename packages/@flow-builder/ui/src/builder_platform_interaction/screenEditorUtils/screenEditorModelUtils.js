import { generateGuid } from "builder_platform_interaction/storeLib";

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
        defaultValue: '',
        dataType: type.dataType,
        name: '',
        extensionName: type.name,
        choiceReferences: [],
        defaultSelectedChoiceReference: '',
        fieldType: type.fieldType,
        inputParameters: [],
        fieldText: '',
        outputParameters: [],
        scale: '0', // Store as string for validation purposes.
        formulaExpression: '',
        errorMessage: ''
    };
}