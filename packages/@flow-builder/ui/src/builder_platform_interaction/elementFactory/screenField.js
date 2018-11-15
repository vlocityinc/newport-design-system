import {
    isChoiceField,
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
import { getElementByGuid } from "builder_platform_interaction/storeUtils";

const elementType = ELEMENT_TYPE.SCREEN_FIELD;

export function createScreenField(screenField = {}) {
    const newScreenField = baseElement(screenField);
    const {
        fieldText = '',
        extensionName,
        fieldType,
        isNewField = false, // Client side only for purposes of editing new field only attributes.
        dataType,
        helpText = '',
        defaultValue,
        defaultValueDataType,
        defaultSelectedChoiceReference
    } = screenField;
    let {
        type,
        scale,
        validationRule,
        inputParameters,
        isRequired = false,
        isVisible,
        outputParameters,
        choiceReferences = []
    } = screenField;
    if (isExtensionField(screenField)) {
        // Assign local extension type (using a local version of the field type that will be replaced when the real one is retrieved from the server
        type = getScreenFieldTypeByName(screenField.extensionName) || getLocalExtensionFieldType(screenField.extensionName);
        isRequired = true;
        inputParameters = screenField.inputParameters.map(inputParameter => createInputParameter(inputParameter));
        outputParameters = screenField.outputParameters.map(outputParameter => createOutputParameter(outputParameter));
    } else {
        type = getScreenFieldType(screenField);
        inputParameters = [];
        outputParameters = [];
    }

    let defaultValueFerovObject;
    if (!defaultValueDataType) {
        defaultValueFerovObject = createFEROV(
            defaultValue,
            DEFAULT_VALUE_PROPERTY,
            DEFAULT_VALUE_DATA_TYPE_PROPERTY
        );
    }

    choiceReferences = choiceReferences.map((choiceReference) => createChoiceReference(choiceReference));

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

    if (screenField.hasOwnProperty("isVisible")) {
        isVisible = screenField.isVisible;
    }

    return Object.assign(
        newScreenField,
        {
            choiceReferences,
            dataType,
            defaultValue,
            defaultValueDataType,
            validationRule,
            extensionName,
            fieldType,
            fieldText,
            helpText,
            inputParameters,
            isVisible,
            isNewField,
            isRequired,
            outputParameters,
            scale,
            type,
            elementType,
            defaultSelectedChoiceReference
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
    const newScreenField = {
            isRequired: type.dataType === 'Boolean' ? true : false,
            defaultValue: '',
            dataType: type.dataType,
            extensionName: type.name,
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

    // Always add a placeholder choice for any choice based fields.
    if (type.name === 'RadioButtons' || type.name === 'MultiSelectCheckboxes' || type.name === 'DropdownBox' || type.name === 'MultiSelectPicklist') {
        newScreenField.choiceReferences = [''];
    }

    return createScreenField(newScreenField);
}

export function createScreenFieldMetadataObject(screenField) {
    if (!screenField) {
        throw new Error("screenField is not defined");
    }

    // Unflatten these properties.
    const { extensionName, defaultValue, dataType, helpText, isRequired, fieldText, fieldType, name, validationRule, defaultSelectedChoiceReference } = screenField;
    let { scale, inputParameters, outputParameters, choiceReferences } = screenField;

    // Convert scale back to number. MD expects this to be a number, but within FlowBuilder, we want it to be a string.
    if (scale != null && typeof scale === 'string') {
        scale = Number(scale);
    }

    let defaultValueMetadataObject;
    if (defaultValue) {
        const defaultValueFerov = createFEROVMetadataObject(screenField, DEFAULT_VALUE_PROPERTY, DEFAULT_VALUE_DATA_TYPE_PROPERTY);
        defaultValueMetadataObject = { defaultValue : defaultValueFerov };
    }

    if (isExtensionField(screenField)) {
        inputParameters = inputParameters.map(inputParameter => createInputParameterMetadataObject(inputParameter));
        outputParameters = outputParameters.map(outputParameter => createOutputParameterMetadataObject(outputParameter));
    }

    choiceReferences = choiceReferences.map((choiceReference) => createChoiceReferenceMetadatObject(choiceReference));

    const mdScreenField = Object.assign({},
        {
            choiceReferences,
            dataType,
            fieldText,
            fieldType,
            helpText,
            inputParameters,
            isRequired,
            name,
            outputParameters,
            scale,

        },
        defaultValueMetadataObject,
    );

    // Only allowed when the field type is extension.
    if (isExtensionField(screenField)) {
        mdScreenField.extensionName = extensionName;
    }

    if (validationRule.formulaExpression) {
        mdScreenField.validationRule = validationRule;
    }

    if (isChoiceField(screenField)) {
        mdScreenField.defaultSelectedChoiceReference = defaultSelectedChoiceReference;
    }

    return mdScreenField;
}

export function createChoiceReference(choiceReference) {
    let newChoiceReference;
    if (!choiceReference) {
        newChoiceReference = '';
    } else {
        newChoiceReference = choiceReference.choiceReference || choiceReference;
    }
    return {
        choiceReference: newChoiceReference
    };
}

function createChoiceReferenceMetadatObject(choiceReferenceObject) {
    const { choiceReference } = choiceReferenceObject;
    if (!choiceReference) {
        throw new Error('Choice reference is not defined');
    }
    const { name } = getElementByGuid(choiceReference);
    return name;
}