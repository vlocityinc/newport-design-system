import {
    isTextAreaField,
    isChoiceField,
    isExtensionField,
    isPicklistField,
    isRegionContainerField,
    isRegionField,
    getColumnFieldType,
    getLocalExtensionFieldType,
    getScreenFieldTypeByName,
    getScreenFieldType
} from 'builder_platform_interaction/screenEditorUtils';
import { createFEROV, createFEROVMetadataObject } from './ferov';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from './outputParameter';
import { baseElement, createCondition, automaticOutputHandlingSupport } from './base/baseElement';

import { createConditionMetadataObject } from './base/baseMetadata';

import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { DEFAULT_VALUE_PROPERTY, DEFAULT_VALUE_DATA_TYPE_PROPERTY } from './variable';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { createValidationRuleObject } from './base/baseValidationInput';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { createDataTypeMappingsMetadataObject, createDynamicTypeMappings } from './dynamicTypeMapping';

const elementType = ELEMENT_TYPE.SCREEN_FIELD;

export function createScreenField(screenField = {}, isNewField = false) {
    const newScreenField = baseElement(screenField);
    const {
        fieldText = '',
        extensionName,
        fieldType,
        helpText = '',
        defaultValue,
        defaultValueDataType,
        defaultValueIndex = generateGuid(),
        defaultSelectedChoiceReference,
        dataTypeMappings
    } = screenField;
    let {
        type,
        scale,
        validationRule,
        inputParameters,
        dataType,
        isRequired = false,
        isVisible,
        outputParameters,
        choiceReferences = [],
        storeOutputAutomatically,
        visibilityRule,
        dynamicTypeMappings,
        fields
    } = screenField;
    if (isExtensionField(screenField)) {
        // Assign local extension type (using a local version of the field type that will be replaced when the real one is retrieved from the server
        type =
            getScreenFieldTypeByName(screenField.extensionName) ||
            getLocalExtensionFieldType(screenField.extensionName);
        isRequired = true;
        dynamicTypeMappings = createDynamicTypeMappings(dataTypeMappings || dynamicTypeMappings);
        inputParameters = inputParameters
            .filter(inputParameter => !!inputParameter.value)
            .map(inputParameter => createInputParameter(inputParameter));

        if (storeOutputAutomatically) {
            dataType = FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value;
            outputParameters = [];
        } else {
            storeOutputAutomatically = false;
            dataType = undefined;
            outputParameters = outputParameters.map(outputParameter => createOutputParameter(outputParameter));
        }
        fields = [];
    } else {
        storeOutputAutomatically = undefined;
        type = getScreenFieldType(screenField);
        if (isRegionField(screenField)) {
            inputParameters = inputParameters.map(inputParameter => createInputParameter(inputParameter));
        } else {
            inputParameters = [];
        }
        outputParameters = [];
        dynamicTypeMappings = undefined;
        // Picklist fields are always required at runtime since they always default to one of the options and there's no way to select a null or empty value option
        // To reflect this behavior in the builder, we default isRequired to true and make the checkbox disabled in the screen field property editor
        if (isPicklistField(screenField)) {
            isRequired = true;
        }
    }

    let defaultValueFerovObject;
    if (!defaultValueDataType) {
        // Temporary workaround to fix W-5886211
        // Todo: Update this as a part of W-5902485
        let updatedDefaultValue = defaultValue;
        if (isTextAreaField(screenField) && defaultValue && defaultValue.elementReference) {
            updatedDefaultValue = {
                stringValue: `{!${defaultValue.elementReference}}`
            };
        }

        defaultValueFerovObject = createFEROV(
            updatedDefaultValue,
            DEFAULT_VALUE_PROPERTY,
            DEFAULT_VALUE_DATA_TYPE_PROPERTY
        );
    }

    choiceReferences = choiceReferences.map(choiceReference => createChoiceReference(choiceReference));

    // Convert scale property to string, which is needed for validation purposes.
    // Saving it as a string allows it be hydrated.
    if (scale != null && typeof scale === 'number') {
        scale = scale.toString();
    }

    if (validationRule && validationRule.formulaExpression) {
        validationRule = createValidationRuleObject(validationRule);
    } else {
        validationRule = { formulaExpression: null, errorMessage: null };
    }

    visibilityRule = createVisibilityRuleObject(visibilityRule);

    if (screenField.hasOwnProperty('isVisible')) {
        isVisible = screenField.isVisible;
    }

    if (dynamicTypeMappings) {
        dynamicTypeMappings = { dynamicTypeMappings };
    }

    return Object.assign(
        newScreenField,
        {
            choiceReferences,
            dataType,
            defaultValue,
            defaultValueDataType,
            defaultValueIndex,
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
            defaultSelectedChoiceReference,
            visibilityRule,
            fields
        },
        dynamicTypeMappings,
        storeOutputAutomatically !== undefined ? { storeOutputAutomatically } : {},
        defaultValueFerovObject
    );
}

/**
 * Called when opening a property editor or copying a screen element. We are taking all the field
 * references and converting them into full fledged field objects.
 * @param {screenFieldInStore} screenField
 * @return {screenFieldInPropertyEditor} Screen field in the shape expected by a property editor
 */
export function createScreenFieldWithFields(screenField = {}) {
    const newScreenField = createScreenField(screenField);
    const { fieldReferences = [] } = screenField;
    const newChildFields = [];

    for (let i = 0; i < fieldReferences.length; i++) {
        const fieldReference = fieldReferences[i];
        const field = getElementByGuid(fieldReference.fieldReference);
        const childScreenField = createScreenFieldWithFields(field);
        newChildFields.push(childScreenField);
    }

    Object.assign(newScreenField, {
        fields: newChildFields,
        hasNoChildren: newChildFields.length === 0
    });

    return newScreenField;
}

/**
 * Create a screen field in the shape the store expects (with field references).  This is used when taking a
 * flow element and converting it for use in the store (either when we're loading an existing flow or when we
 * just clicked done on the property editor).
 * @param {Object} screenField - screen field from metadata
 * @param {Array} screenFields - An array for collecting all the screen fields that are contained, either directly or indirectly, by the current screen.
 * @param {String} parentName - The name of this screen field's parent. Used for autogeneration of unique api names.
 * @param {Number} index - The next available index. Used for autogeneration of unique api names.
 * @return {screenFieldInStore} screen field in the shape used by the store
 */
export function createScreenFieldWithFieldReferences(screenField = {}, screenFields = [], parentName, index) {
    const newScreenField = createScreenField(screenField);

    let fieldName = newScreenField.name;
    // TODO: We should do this better. What happens when we have more than one region container field
    // type? What should the naming convention be? Where should the '_Section' portion of the
    // name come from, because having it hard coded here isn't right.
    if (isRegionContainerField(newScreenField)) {
        fieldName = parentName + '_Section' + index;
    } else if (isRegionField(newScreenField)) {
        fieldName = parentName + '_Column' + index;
    }

    const { fields = [] } = screenField;
    let fieldReferences = [];

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const childScreenField = createScreenFieldWithFieldReferences(field, screenFields, fieldName, i + 1);
        screenFields.push(childScreenField);
        fieldReferences = updateScreenFieldReferences(fieldReferences, childScreenField);
    }

    Object.assign(newScreenField, {
        fieldReferences,
        fields: [],
        name: fieldName
    });

    return newScreenField;
}

/**
 * Creates an empty screen field of the given type
 * @param {String} typeName - The field type
 * @param {String} sectionCount - The number of sections in the current screen
 * @return {object} - The new screen field
 */
// TODO: (W-7251970) This function has special logic for different types. We
// should move the screen field type-specific logic to screen field type specific
// locations so this function can remain generic.
export function createEmptyScreenFieldOfType(typeName, sectionCount = 0) {
    const type = getScreenFieldTypeByName(typeName);

    // TODO: We need to replace all of the string literals with references to a
    // constant in screenEditorFieldTypesUtils
    let newScreenField = {
        name: type.name === 'Section' ? 'Section' + (sectionCount + 1) : undefined,
        isRequired: type.dataType === 'Boolean' ? true : false,
        defaultValue: '',
        dataType: type.dataType,
        extensionName: type.name,
        fieldType: type.fieldType,
        scale: '0', // Store as string for validation purposes.
        inputParameters: [],
        outputParameters: [],
        validationRule: {
            formulaExpression: '',
            errorMessage: ''
        },
        storeOutputAutomatically: automaticOutputHandlingSupport(),
        fields: []
    };

    // Add a single default column for section fields
    if (type.name === 'Section') {
        // TODO: Define the 'width' parameter name as a const somewhere
        const columnWidthParameter = { name: 'width', value: 12, valueDataType: FLOW_DATA_TYPE.STRING.value };
        const newChildScreenField = createScreenField(
            {
                name: newScreenField.name + '_Column1',
                fieldText: 'Column 1',
                guid: generateGuid(),
                fieldType: 'Region',
                fields: [],
                inputParameters: [columnWidthParameter]
            },
            true
        );
        newScreenField.fields = [newChildScreenField];
    } else if (type.name === getColumnFieldType().name) {
        Object.assign(newScreenField, {
            // TODO: correct name and fieldText. Also, this code needs to be consolidated
            // with the code above that creates the default column for a new section.
            name: newScreenField.name + '_Column1',
            fieldText: 'Column 1',
            guid: generateGuid(),
            fieldType: 'Region',
            fields: []
        });
    } else if (
        // Always add a placeholder choice for any choice based fields.
        type.name === 'RadioButtons' ||
        type.name === 'MultiSelectCheckboxes' ||
        type.name === 'DropdownBox' ||
        type.name === 'MultiSelectPicklist'
    ) {
        newScreenField.choiceReferences = [''];
    }

    newScreenField = createScreenField(newScreenField, true);
    newScreenField.hasNoChildren = newScreenField.fields.length === 0;
    return newScreenField;
}

export function createScreenFieldMetadataObject(screenField) {
    if (!screenField) {
        throw new Error('screenField is not defined');
    }

    // Unflatten these properties.
    const {
        extensionName,
        defaultValue,
        helpText,
        isRequired,
        fieldText,
        fieldType,
        name,
        validationRule,
        defaultSelectedChoiceReference,
        visibilityRule,
        dynamicTypeMappings,
        fieldReferences
    } = screenField;
    let {
        dataType,
        scale,
        inputParameters,
        outputParameters,
        choiceReferences,
        fields,
        storeOutputAutomatically
    } = screenField;

    // Convert scale back to number. MD expects this to be a number, but within FlowBuilder, we want it to be a string.
    if (scale != null && typeof scale === 'string') {
        scale = Number(scale);
    }

    let defaultValueMetadataObject;
    if (defaultValue) {
        const defaultValueFerov = createFEROVMetadataObject(
            screenField,
            DEFAULT_VALUE_PROPERTY,
            DEFAULT_VALUE_DATA_TYPE_PROPERTY
        );
        defaultValueMetadataObject = { defaultValue: defaultValueFerov };
    }

    let dataTypeMappings;
    if (isExtensionField(screenField)) {
        inputParameters = inputParameters.map(inputParameter => createInputParameterMetadataObject(inputParameter));
        if (storeOutputAutomatically && automaticOutputHandlingSupport()) {
            outputParameters = [];
            dataType = undefined;
        } else if (storeOutputAutomatically && !automaticOutputHandlingSupport()) {
            // if the user save the flow and change the process type which doesn't support the automatic output handling,
            // then we need to set the property storeOutputAutomatically to undefined.
            outputParameters = [];
            storeOutputAutomatically = undefined;
            dataType = undefined;
        } else {
            outputParameters = outputParameters.map(outputParameter =>
                createOutputParameterMetadataObject(outputParameter)
            );
            storeOutputAutomatically = undefined;
        }
        dataTypeMappings = createDataTypeMappingsMetadataObject(dynamicTypeMappings);
    } else if (isRegionField(screenField)) {
        inputParameters = inputParameters.map(inputParameter => createInputParameterMetadataObject(inputParameter));
    }

    choiceReferences = choiceReferences.map(choiceReference => createChoiceReferenceMetadatObject(choiceReference));
    fields = fields.map(field => createScreenFieldMetadataObject(field));
    if (fieldReferences && fieldReferences.length > 0) {
        fields = fieldReferences.map(fieldReference => {
            return createScreenFieldMetadataObject(getElementByGuid(fieldReference.fieldReference));
        });
    }

    if (dataTypeMappings) {
        dataTypeMappings = { dataTypeMappings };
    }

    const mdScreenField = Object.assign(
        {},
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
            fields
        },
        dataTypeMappings,
        storeOutputAutomatically !== undefined ? { storeOutputAutomatically } : {},
        defaultValueMetadataObject
    );

    let { conditions } = visibilityRule;

    if (conditions.length > 0) {
        conditions = conditions.map(condition => createConditionMetadataObject(condition));
        Object.assign(mdScreenField, {
            visibilityRule: {
                conditionLogic: visibilityRule.conditionLogic,
                conditions
            }
        });
    }

    // Only allowed when the field type is extension.
    if (isExtensionField(screenField)) {
        mdScreenField.extensionName = extensionName;
    }

    if (validationRule && validationRule.formulaExpression) {
        mdScreenField.validationRule = createValidationRuleObject(validationRule);
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

function createVisibilityRuleObject(visibilityRule) {
    if (!visibilityRule) {
        return {
            conditionLogic: CONDITION_LOGIC.NO_CONDITIONS,
            conditions: []
        };
    }

    const { conditions, conditionLogic } = visibilityRule;
    return {
        conditions: conditions.map(condition => createCondition(condition)),
        conditionLogic
    };
}

function updateScreenFieldReferences(fieldReferences = [], field) {
    if (!field || !field.guid) {
        throw new Error('Either field or field.guid is not defined');
    }
    return [
        ...fieldReferences,
        {
            fieldReference: field.guid
        }
    ];
}
