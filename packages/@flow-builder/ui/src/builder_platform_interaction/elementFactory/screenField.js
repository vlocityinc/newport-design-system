import {
    isExtensionField,
    getLocalExtensionFieldType,
    getScreenFieldTypeByName,
    getScreenFieldType
} from "builder_platform_interaction/screenEditorUtils";
import { createFEROV, createFEROVMetadataObject } from './ferov';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from './outputParameter';
import { baseElement } from "./base/baseElement";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { DEFAULT_VALUE_PROPERTY, DEFAULT_VALUE_DATA_TYPE_PROPERTY } from "./variable";

const elementType = ELEMENT_TYPE.SCREEN_FIELD;

export function createScreenField(screenField = {}) {
    const newScreenField = baseElement(screenField);
    const {
        fieldText = '',
        extensionName = null,
        fieldType,
        isNewField = false, // Client side only for purposes of editing new field only attributes.
        isRequired = false,
        isVisible = false,
        dataType,
        helpText = '',
        choiceReferences = [],
        defaultValue,
        defaultValueDataType
    } = screenField;
    let {
        type,
        scale,
        validationRule,
        inputParameters,
        outputParameters,
    } = screenField;
    if (isExtensionField(screenField)) {
        // Assign local extension type (using a local version of the field type that will be replaced when the real one is retrieved from the server
        type = getScreenFieldTypeByName(screenField.extensionName) || getLocalExtensionFieldType(screenField.extensionName);

        inputParameters = screenField.inputParameters.map(inputParameter => createInputParameter(inputParameter));
        outputParameters = screenField.outputParameters.map(outputParameter => createOutputParameter(outputParameter));
    } else {
        type = getScreenFieldType(screenField);
    }

    let defaultValueFerovObject;
    if (!defaultValueDataType) {
        defaultValueFerovObject = createFEROV(
            defaultValue,
            DEFAULT_VALUE_PROPERTY,
            DEFAULT_VALUE_DATA_TYPE_PROPERTY
        );
    }

    const previewDefaultValue = defaultValue;

    // Convert scale property to string, which is needed for validation purposes.
    // Saving it as a string allows it be hydrated.
    if (scale != null && typeof scale === 'number') {
        scale = scale.toString();
    }

    if (validationRule && validationRule.formulaExpression) {
        validationRule = Object.assign({}, validationRule);
    } else {
        validationRule = {formulaExpression: null, errorMessage: null};
    }

    return Object.assign(
        newScreenField,
        {
            choiceReferences,
            dataType,
            defaultValue,
            defaultValueDataType,
            previewDefaultValue,
            validationRule,
            extensionName,
            fieldType,
            fieldText,
            helpText,
            inputParameters,
            isNewField,
            isRequired,
            isVisible,
            outputParameters,
            scale,
            type,
            elementType
        },
        defaultValueFerovObject
    );
}

/**
 * Creates an empty screen field of the given type
 * @param {String} typeName - The field type
 * @return {object} - The new screen field
 */
export function createEmptyScreenFieldOfType(typeName) {
    const type = getScreenFieldTypeByName(typeName);

    let choiceReferences = [];
    // Always add a placeholder choice for any choice based fields.
    if (type.name === 'Radio' || type.name === 'MultiSelectCheckboxes' || type.name === 'DropdownBox' || type.name === 'MultiSelectPicklist') {
        choiceReferences = [''];
    }

    const newScreenField = {
            isRequired: type.dataType === 'Boolean' ? true : false,
            defaultValue: '',
            dataType: type.dataType,
            extensionName: type.name,
            choiceReferences,
            defaultSelectedChoiceReference: '',
            fieldType: type.fieldType,
            isNewField: true, // used to enable various functionality for newly created fields only
            scale: '0', // Store as string for validation purposes.
            inputParameters: [],
            outputParameters: [],
            validationRule: {
                formulaExpression: '',
                errorMessage: ''
           }
    };

    return createScreenField(newScreenField);
}

export function createScreenFieldMetadataObject(screenField) {
    if (!screenField) {
        throw new Error("screenField is not defined");
    }

    // Unflatten these properties.
    const { extensionName, choiceReferences, defaultValue, dataType, helpText, isRequired, fieldText, fieldType, name, validationRule } = screenField;
    let { scale, inputParameters, outputParameters } = screenField;

    // Convert scale back to number. MD expects this to be a number, but within FlowBuilder, we want it to be a string.
    if (scale != null && typeof scale === 'string') {
        scale = Number(scale);
    }

    let defaultValueMetadataObject;
    if (defaultValue) {
        const defaultValueFerov = createFEROVMetadataObject(screenField, 'defaultValue', 'defaultValueDataType');
        defaultValueMetadataObject = { defaultValue : defaultValueFerov };
    }

    if (isExtensionField(screenField)) {
        inputParameters = inputParameters.map(inputParameter => createInputParameterMetadataObject(inputParameter));
        outputParameters = outputParameters.map(outputParameter => createOutputParameterMetadataObject(outputParameter));
    }

    const mdScreenField = Object.assign({},
        {
            choiceReferences,
            dataType,
            extensionName,
            fieldText,
            fieldType,
            helpText,
            inputParameters,
            isRequired,
            name,
            outputParameters,
            scale
        },
        defaultValueMetadataObject
    );

    if (validationRule.formulaExpression) {
        mdScreenField.validationRule = validationRule;
    }

    return mdScreenField;
}