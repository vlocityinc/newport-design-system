import { generateGuid } from "builder_platform_interaction/storeLib";

/**
 * Creates an empty screen field of the given type
 * @param {object} type - The field type
 * @return {object} - The new screen field
 */
export function createEmptyNodeOfType(type) {
    let choiceReferences = [];
    // Always add a placeholder choice for any choice based fields.
    if (type.name === 'Radio' || type.name === 'MultiSelectCheckboxes') {
        choiceReferences = [''];
    }

    return {
        guid:generateGuid(),
        isRequired: type.dataType === 'Boolean' ? true : false,
        helpText: '',
        defaultValue: '',
        dataType: type.dataType,
        name: '',
        extensionName: type.name,
        choiceReferences,
        defaultSelectedChoiceReference: '',
        fieldType: type.fieldType,
        inputParameters: [],
        isNewField: true, // used to enable various functionality for newly created fields only
        fieldText: '',
        outputParameters: [],
        scale: '0', // Store as string for validation purposes.
        formulaExpression: '',
        errorMessage: ''
    };
}