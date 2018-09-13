import {
    isExtensionField,
    getLocalExtensionFieldType,
    getScreenFieldTypeByName,
    getScreenFieldType
} from "builder_platform_interaction/screenEditorUtils";
import { createFEROV, createFEROVMetadataObject } from './ferov';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from './outputParameter';

export function createScreenField(screenField = {}) {
    let type;
    let { scale, inputParameters, outputParameters } = screenField;
    const { defaultValue, validationRule } = screenField;
    if (isExtensionField(screenField)) {
        inputParameters = [];
        outputParameters = [];
        // Assign local extension type (using a local version of the field type that will be replaced when the real one is retrieved from the server
        type = getScreenFieldTypeByName(screenField.extensionName) || getLocalExtensionFieldType(screenField.extensionName);

        inputParameters = inputParameters.map(inputParameter => createInputParameter(inputParameter));
        outputParameters = outputParameters.map(outputParameter => createOutputParameter(outputParameter));
    } else {
        type = getScreenFieldType(screenField);
    }

    // Flatten out these properties which makes validation easier.
    let errorMessage, formulaExpression;
    if (validationRule) {
        if (validationRule.errorMessage) {
            errorMessage = validationRule.errorMessage;
        }
        if (validationRule.formulaExpression) {
            formulaExpression = validationRule.formulaExpression;
        }
    }

    let defaultValueFerovObject;
    if (defaultValue) {
        defaultValueFerovObject = createFEROV(
            defaultValue,
            'defaultValue',
            'defaultValueDataType'
        );
    }

    // Convert scale property to string, which is needed for validation purposes.
    // Saving it as a string allows it be hydrated.
    if (scale != null && typeof scale === 'number') {
        scale = scale.toString();
    }

    return Object.assign(
        {},
        {
            errorMessage,
            formulaExpression,
            scale,
            type,
            inputParameters,
            outputParameters
        },
        defaultValueFerovObject
    );
}

export function createScreenFieldMetadataObject(screenField) {
    if (!screenField) {
        throw new Error("screenField is not defined");
    }

    // Unflatten these properties.
    const { errorMessage, formulaExpression, defaultValue } = screenField;
    let { scale, inputParameters, outputParameters } = screenField;

    let validationRule;
    if (errorMessage || formulaExpression) {
        validationRule = Object.assign({}, {formulaExpression, errorMessage});
    }

    // Convert scale back to number. MD expects this to be a number, but within FlowBuilder, we want it to be a string.
    if (scale != null && typeof scale === 'string') {
        scale = Number(scale);
    }

    let defaultValueMetadataObject;
    if (defaultValue) {
        defaultValueMetadataObject = createFEROVMetadataObject(defaultValue, 'defaultValue', 'defaultValueDataType');
    }

    if (isExtensionField(screenField)) {
        inputParameters = [];
        outputParameters = [];

        inputParameters = inputParameters.map(inputParameter => createInputParameterMetadataObject(inputParameter));
        outputParameters = outputParameters.map(outputParameter => createOutputParameterMetadataObject(outputParameter));
    }

    return Object.assign(
        {},
        {
            validationRule,
            scale,
            inputParameters,
            outputParameters
        },
        defaultValueMetadataObject
    );
}