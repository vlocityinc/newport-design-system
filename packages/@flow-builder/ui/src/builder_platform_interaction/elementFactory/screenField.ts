// @ts-nocheck
import {
    isTextAreaField,
    isChoiceField,
    isExtensionField,
    isRegionContainerField,
    isRegionField,
    getSectionFieldType,
    getColumnFieldType,
    getLocalExtensionFieldType,
    getScreenFieldTypeByName,
    getScreenFieldType,
    InputsOnNextNavToAssocScrnOption,
    getScreenFieldName,
    ScreenFieldName
} from 'builder_platform_interaction/screenEditorUtils';
import { createFEROV, createFEROVMetadataObject } from './ferov';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from './outputParameter';
import { baseElement, createCondition, automaticOutputHandlingSupport } from './base/baseElement';

import { createConditionMetadataObject } from './base/baseMetadata';

import { CONDITION_LOGIC, ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { DEFAULT_VALUE_PROPERTY, DEFAULT_VALUE_DATA_TYPE_PROPERTY } from './variable';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { createValidationRuleObject } from './base/baseValidationInput';
import { generateGuid, Store } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { createDataTypeMappingsMetadataObject, createDynamicTypeMappings } from './dynamicTypeMapping';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';

const elementType = ELEMENT_TYPE.SCREEN_FIELD;

const INPUTS_ON_NEXT_NAV_TO_ASSOC_SCRN_DEFAULT = InputsOnNextNavToAssocScrnOption.USE_STORED_VALUES;

export function createScreenField(screenField: UI.ScreenField, isNewField = false) {
    const newScreenField = baseElement(screenField);
    const {
        fieldText = '',
        extensionName,
        fieldType,
        helpText = '',
        defaultValueIndex = generateGuid(),
        dataTypeMappings,
        objectFieldReference
    } = screenField;
    let {
        type,
        inputParameters,
        dataType,
        isRequired = false,
        outputParameters,
        storeOutputAutomatically,
        dynamicTypeMappings,
        fields,
        inputsOnNextNavToAssocScrn
    } = screenField;
    if (isExtensionField(screenField)) {
        // Assign local extension type (using a local version of the field type that will be replaced when the real one is retrieved from the server
        type =
            getScreenFieldTypeByName(screenField.extensionName) ||
            getLocalExtensionFieldType(screenField.extensionName);
        isRequired = true;
        dynamicTypeMappings = createDynamicTypeMappings(dataTypeMappings || dynamicTypeMappings);
        inputParameters = inputParameters
            .filter((inputParameter) => !!inputParameter.value)
            .map((inputParameter) => createInputParameter(inputParameter));

        if (storeOutputAutomatically) {
            dataType = FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value;
            outputParameters = [];
        } else {
            storeOutputAutomatically = false;
            dataType = undefined;
            outputParameters = outputParameters.map((outputParameter) => createOutputParameter(outputParameter));
        }
        fields = [];
        if (inputsOnNextNavToAssocScrn == null) {
            inputsOnNextNavToAssocScrn = isNewField
                ? INPUTS_ON_NEXT_NAV_TO_ASSOC_SCRN_DEFAULT
                : InputsOnNextNavToAssocScrnOption.USE_STORED_VALUES;
        }
    } else {
        storeOutputAutomatically = undefined;
        type = screenField.fieldType === FlowScreenFieldType.ObjectProvided ? type : getScreenFieldType(screenField);
        if (isRegionField(screenField)) {
            inputParameters = inputParameters.map((inputParameter) => createInputParameter(inputParameter));
        } else {
            inputParameters = [];
        }
        outputParameters = [];
        dynamicTypeMappings = undefined;
    }
    if (dynamicTypeMappings) {
        dynamicTypeMappings = { dynamicTypeMappings };
    }

    const {
        defaultValue,
        defaultValueDataType,
        scale,
        validationRule,
        isVisible,
        choiceReferences,
        visibilityRule,
        defaultValueFerovObject
    } = getCommonValues(screenField);

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
            visibilityRule,
            fields,
            inputsOnNextNavToAssocScrn,
            objectFieldReference
        },
        dynamicTypeMappings,
        storeOutputAutomatically !== undefined ? { storeOutputAutomatically } : {},
        objectFieldReference !== undefined ? { objectFieldReference } : {},
        defaultValueFerovObject
    );
}

const getCommonValues = (screenField) => {
    const { defaultValueDataType, defaultSelectedChoiceReference } = screenField;
    let {
        scale,
        validationRule,
        isVisible,
        choiceReferences = [],
        visibilityRule,
        defaultValue,
        defaultValueFerovObject
    } = screenField;
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
    if (defaultSelectedChoiceReference) {
        defaultValue = {
            elementReference: defaultSelectedChoiceReference
        };
        defaultValueFerovObject = createFEROV(defaultValue, DEFAULT_VALUE_PROPERTY, DEFAULT_VALUE_DATA_TYPE_PROPERTY);
    }
    choiceReferences = choiceReferences.map((choiceReference) => createChoiceReference(choiceReference));

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

    return {
        defaultValue,
        defaultValueDataType,
        scale,
        validationRule,
        isVisible,
        choiceReferences,
        visibilityRule,
        defaultValueFerovObject
    };
};

/**
 * Recursively created duplicated screen fields using the childReferences property on a given screen field
 * @param {Object} screenField - Screen Field in Store
 * @param {Object []} originalFieldReferences - childReferences of a given screen
 * @param {Object []} duplicatedScreenFields - Contains duplicated screen field objects (The guid, name and childReferences are updated in baseElement)
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements
 */
function _getDuplicatedNestedScreenFields(
    screenField,
    originalFieldReferences,
    duplicatedScreenFields,
    cutOrCopiedChildElements
) {
    let newScreenField = createScreenField(screenField);
    if (originalFieldReferences) {
        newScreenField = Object.assign(newScreenField, {
            childReferences: originalFieldReferences
        });

        for (let i = 0; i < originalFieldReferences.length; i++) {
            const screenFieldReference = originalFieldReferences[i];
            // Using the cutOrCopiedChildElements to get the original screen field in case it has been deleted
            // and not available in the store
            const nestedScreenField = cutOrCopiedChildElements
                ? cutOrCopiedChildElements[screenFieldReference.childReference]
                : getElementByGuid(screenFieldReference.childReference);

            _getDuplicatedNestedScreenFields(
                nestedScreenField,
                nestedScreenField.childReferences,
                duplicatedScreenFields,
                cutOrCopiedChildElements
            );
        }
    }

    duplicatedScreenFields.push(newScreenField);
}

/**
 * Function to get all the duplicated screen fields (including the nested ones)
 * @param {Object} screenField - Screen Field in Store
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements
 * @returns duplicatedScreenFields - An array containing all the duplicated screen fields
 */
export function createDuplicateNestedScreenFields(screenField = {}, cutOrCopiedChildElements) {
    const duplicatedScreenFields = [];
    _getDuplicatedNestedScreenFields(
        screenField,
        screenField.childReferences,
        duplicatedScreenFields,
        cutOrCopiedChildElements
    );
    return duplicatedScreenFields;
}

/**
 * Called when opening a property editor or copying a screen element. We are taking all the field
 * references and converting them into full fledged field objects.
 * @param {screenFieldInStore} screenField
 * @return {screenFieldInPropertyEditor} Screen field in the shape expected by a property editor
 */
export function createScreenFieldWithFields(screenField = {}) {
    const newScreenField =
        screenField.fieldType === FlowScreenFieldType.ObjectProvided
            ? createAutomaticFieldFromScreenField(screenField)
            : createScreenField(screenField);
    const { childReferences = [] } = screenField;
    const newChildFields = [];

    for (let i = 0; i < childReferences.length; i++) {
        const childReference = childReferences[i];
        const field = getElementByGuid(childReference.childReference);
        const childScreenField = createScreenFieldWithFields(field);
        newChildFields.push(childScreenField);
    }

    Object.assign(newScreenField, {
        fields: newChildFields
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
    let childReferences = [];

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const childScreenField = createScreenFieldWithFieldReferences(field, screenFields, fieldName, i + 1);
        screenFields.push(childScreenField);
        childReferences = updateScreenFieldReferences(childReferences, childScreenField);
    }

    Object.assign(newScreenField, {
        childReferences,
        fields: [],
        name: fieldName
    });

    return newScreenField;
}

const createAutomaticFieldType = (typeName: string, entityField) => {
    const { name, dataType, icon, category, type } = getScreenFieldTypeByName(typeName);
    const fieldType = FlowScreenFieldType.ObjectProvided;
    const label = entityField.label;
    return { name, dataType, icon, category, type, fieldType, label };
};

const createAutomaticFieldFromScreenField = (
    screenField: UI.ScreenField,
    { elements }: UI.Elements = Store.getStore().getCurrentState()
): UI.ScreenField => {
    const { objectFieldReference } = screenField;
    return createAutomaticFieldFromEntityField(
        getVariableOrField(objectFieldReference, elements),
        objectFieldReference
    );
};

const objectFieldReferenceToLabel = (objectFieldReference: string): string => {
    const sanitizedGuid = sanitizeGuid(objectFieldReference!);
    const element = getElementByGuid(sanitizedGuid.guidOrLiteral);
    return element ? [element.name, ...sanitizedGuid.fieldNames].join('.') : objectFieldReference;
};

const createAutomaticFieldFromEntityField = (
    entityField: FieldDefinition,
    objectFieldReference: string,
    typeName?: string
): UI.ScreenField => {
    const newScreenField = baseElement();
    const {
        defaultValue,
        defaultValueDataType,
        validationRule,
        isVisible,
        choiceReferences,
        visibilityRule,
        defaultValueFerovObject
    } = getCommonValues(newScreenField);
    typeName = typeName ? typeName : entityField ? getScreenFieldName(entityField) : undefined;
    return Object.assign(newScreenField, {
        name: undefined,
        isRequired: entityField ? entityField.required : undefined,
        isCreateable: entityField ? entityField.creatable : undefined,
        isUpdateable: entityField ? entityField.editable : undefined,
        defaultValue,
        defaultValueDataType,
        dataType: entityField ? entityField.dataType : undefined,
        type: typeName
            ? createAutomaticFieldType(typeName, entityField)
            : { label: objectFieldReferenceToLabel(objectFieldReference) },
        fieldText: entityField ? entityField.label : objectFieldReferenceToLabel(objectFieldReference),
        helpText: (entityField && entityField.inlineHelpText) || '',
        fieldType: FlowScreenFieldType.ObjectProvided,
        precision: entityField ? entityField.precision : undefined,
        scale: entityField ? entityField.scale : undefined,
        length: entityField ? entityField.length : undefined,
        inputParameters: [],
        outputParameters: [],
        validationRule,
        fields: [],
        choiceReferences,
        visibilityRule,
        isVisible,
        defaultValueFerovObject,
        objectFieldReference,
        hasErrors: entityField === undefined
    });
};

export const createAutomaticField = (
    typeName: string,
    objectFieldReference: string,
    { elements }: UI.Elements = Store.getStore().getCurrentState()
): UI.ScreenField => {
    return createAutomaticFieldFromEntityField(
        getVariableOrField(objectFieldReference, elements),
        objectFieldReference,
        typeName
    );
};

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

    let newScreenField = {
        name: undefined,
        isRequired: type.dataType === FLOW_DATA_TYPE.BOOLEAN.value,
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
        fields: [],
        inputsOnNextNavToAssocScrn: undefined
    };

    // Add a single default column for section fields
    if (type.name === getSectionFieldType().name) {
        newScreenField.name = ScreenFieldName.Section + (sectionCount + 1);
        const newChildScreenField = createScreenField(createEmptyColumn('12'), true);
        newScreenField.fields = [newChildScreenField];
    } else if (type.name === getColumnFieldType().name) {
        Object.assign(newScreenField, createEmptyColumn(undefined));
    } else if (
        // Always add a placeholder choice for any choice based fields.
        type.name === FlowScreenFieldType.RadioButtons ||
        type.name === FlowScreenFieldType.MultiSelectCheckboxes ||
        type.name === FlowScreenFieldType.DropdownBox ||
        type.name === FlowScreenFieldType.MultiSelectPicklist
    ) {
        newScreenField.choiceReferences = [''];
    }

    newScreenField = createScreenField(newScreenField, true);
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
        isRequired,
        fieldType,
        validationRule,
        visibilityRule,
        dynamicTypeMappings,
        childReferences,
        inputsOnNextNavToAssocScrn,
        objectFieldReference
    } = screenField;
    let {
        fieldText,
        name,
        dataType,
        helpText,
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

    let defaultValueMetadataObject, defaultSelectedChoiceReference;
    if (defaultValue) {
        if (shouldSetDefaultSelectedChoiceReference(screenField, choiceReferences, defaultValue)) {
            defaultSelectedChoiceReference = defaultValue;
        } else {
            const defaultValueFerov = createFEROVMetadataObject(
                screenField,
                DEFAULT_VALUE_PROPERTY,
                DEFAULT_VALUE_DATA_TYPE_PROPERTY
            );
            defaultValueMetadataObject = { defaultValue: defaultValueFerov };
        }
    }

    let dataTypeMappings;
    if (isExtensionField(screenField)) {
        inputParameters = inputParameters.map((inputParameter) => createInputParameterMetadataObject(inputParameter));
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
            outputParameters = outputParameters
                .filter((outputParameter) => outputParameter.value)
                .map((outputParameter) => createOutputParameterMetadataObject(outputParameter));
            storeOutputAutomatically = automaticOutputHandlingSupport() ? false : undefined;
        }
        dataTypeMappings = createDataTypeMappingsMetadataObject(dynamicTypeMappings);
    } else if (isRegionField(screenField)) {
        inputParameters = inputParameters.map((inputParameter) => createInputParameterMetadataObject(inputParameter));
    } else if (fieldType === FlowScreenFieldType.ObjectProvided) {
        fieldText = undefined;
        name = undefined;
        dataType = undefined;
        helpText = undefined;
    }

    choiceReferences = choiceReferences.map((choiceReference) => createChoiceReferenceMetadatObject(choiceReference));
    fields = fields.map((field) => createScreenFieldMetadataObject(field));
    if (childReferences && childReferences.length > 0) {
        fields = childReferences.map((childReference) => {
            return createScreenFieldMetadataObject(getElementByGuid(childReference.childReference));
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
            fields,
            inputsOnNextNavToAssocScrn,
            objectFieldReference
        },
        dataTypeMappings,
        storeOutputAutomatically !== undefined ? { storeOutputAutomatically } : {},
        objectFieldReference !== undefined ? { objectFieldReference } : {},
        defaultValueMetadataObject
    );

    createAndAssignVisibilityRuleMetadataObject(mdScreenField, visibilityRule);

    // Only allowed when the field type is extension.
    if (isExtensionField(screenField)) {
        mdScreenField.extensionName = extensionName;
    }

    if (validationRule && validationRule.formulaExpression) {
        mdScreenField.validationRule = createValidationRuleObject(validationRule);
    }

    if (isChoiceField(screenField) && defaultSelectedChoiceReference) {
        mdScreenField.defaultSelectedChoiceReference = defaultSelectedChoiceReference;
    }

    return mdScreenField;
}

function shouldSetDefaultSelectedChoiceReference(screenField, choiceReferenceObjects, defaultValue) {
    return (
        isChoiceField(screenField) &&
        choiceReferenceObjects.find((choiceReferenceObject) => {
            const choice = getElementByGuid(choiceReferenceObject.choiceReference);
            if (choice) {
                return choice.elementType === ELEMENT_TYPE.CHOICE && choice.guid === defaultValue;
            }
            return false;
        })
    );
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
        conditions: conditions.map((condition) => createCondition(condition)),
        conditionLogic
    };
}

function createAndAssignVisibilityRuleMetadataObject(mdScreenField, visibilityRule) {
    let { conditions } = visibilityRule;

    if (conditions && conditions.length > 0) {
        conditions = conditions.map((condition) => createConditionMetadataObject(condition));
        Object.assign(mdScreenField, {
            visibilityRule: {
                conditionLogic: visibilityRule.conditionLogic,
                conditions
            }
        });
    }
}

function createEmptyColumn(width) {
    // TODO: Define the 'width' parameter name as a const somewhere
    const columnWidthParameter = {
        name: 'width',
        value: width,
        valueDataType: FLOW_DATA_TYPE.STRING.value
    };
    return {
        name: 'NewColumn',
        guid: generateGuid(),
        fieldType: getColumnFieldType().fieldType,
        fields: [],
        inputParameters: [columnWidthParameter]
    };
}

function updateScreenFieldReferences(childReferences = [], field) {
    if (!field || !field.guid) {
        throw new Error('Either field or field.guid is not defined');
    }
    return [
        ...childReferences,
        {
            childReference: field.guid
        }
    ];
}
