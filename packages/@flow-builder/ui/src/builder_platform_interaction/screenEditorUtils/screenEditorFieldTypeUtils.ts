import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { getAllCachedExtensionTypes, EXTENSION_TYPE_SOURCE } from 'builder_platform_interaction/flowExtensionLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

export const SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME = 'componentVisibility';

const FEROV_TYPES = {
    String: ['TEXT', 'STRING', 'PASSWORD', 'PASSWORDFIELD'],
    Number: ['CURRENCY', 'NUMBER', 'DECIMAL', 'FLOAT', 'DOUBLE', 'LONG', 'INT', 'INTEGER', 'SHORT', 'BYTE'],
    Date: ['DATE'],
    DateTime: ['DATETIME', 'DATE-TIME'],
    Boolean: ['BOOLEAN']
};

type ScreenFieldType = {
    name: string;
    fieldType: FlowScreenFieldType;
    dataType?: string;
    label?: string;
    icon?: string;
    category?: string;
    type?: string;
    description?: string;
};

/**
 * All screen field types
 * Property type represents the actual data type of the field (used as part of ferov handling)
 */
const screenFieldTypes: ScreenFieldType[] = [
    {
        name: 'TextBox',
        fieldType: FlowScreenFieldType.InputField,
        dataType: 'String',
        label: LABELS.fieldTypeLabelTextField,
        icon: 'standard:textbox',
        category: LABELS.fieldCategoryInput,
        type: 'String'
    },
    {
        name: 'LargeTextArea',
        fieldType: FlowScreenFieldType.LargeTextArea,
        dataType: undefined,
        label: LABELS.fieldTypeLabelLargeTextArea,
        icon: 'standard:textarea',
        category: LABELS.fieldCategoryInput,
        type: 'String'
    },
    {
        name: 'Number',
        fieldType: FlowScreenFieldType.InputField,
        dataType: 'Number',
        label: LABELS.fieldTypeLabelNumber,
        icon: 'standard:number_input',
        category: LABELS.fieldCategoryInput,
        type: 'Number'
    },
    {
        name: 'Currency',
        fieldType: FlowScreenFieldType.InputField,
        dataType: 'Currency',
        label: LABELS.fieldTypeLabelCurrency,
        icon: 'standard:currency_input',
        category: LABELS.fieldCategoryInput,
        type: 'Number'
    },
    {
        name: 'Date',
        fieldType: FlowScreenFieldType.InputField,
        dataType: 'Date',
        label: LABELS.fieldTypeLabelDate,
        icon: 'standard:date_input',
        category: LABELS.fieldCategoryInput,
        type: 'Date'
    },
    {
        name: 'DateTime',
        fieldType: FlowScreenFieldType.InputField,
        dataType: 'DateTime',
        label: LABELS.fieldTypeLabelDateTime,
        icon: 'standard:date_time',
        category: LABELS.fieldCategoryInput,
        type: 'DateTime'
    },
    {
        name: 'Password',
        fieldType: FlowScreenFieldType.PasswordField,
        dataType: undefined,
        label: LABELS.fieldTypeLabelPassword,
        icon: 'standard:password',
        category: LABELS.fieldCategoryInput,
        type: 'String'
    },
    {
        name: 'Checkbox',
        fieldType: FlowScreenFieldType.InputField,
        dataType: 'Boolean',
        label: LABELS.fieldTypeLabelCheckbox,
        icon: 'standard:task2',
        category: LABELS.fieldCategoryInput,
        type: 'Boolean'
    },
    {
        // TODO: Set dataType to null once W-5795949 is completed
        name: 'RadioButtons',
        fieldType: FlowScreenFieldType.RadioButtons,
        dataType: 'String',
        label: LABELS.fieldTypeLabelRadioButtons,
        icon: 'standard:radio_button',
        category: LABELS.fieldCategoryInput
    },
    {
        // TODO: Set dataType to null once W-5795949 is completed
        name: 'DropdownBox',
        fieldType: FlowScreenFieldType.DropdownBox,
        dataType: 'String',
        label: LABELS.fieldTypeLabelPicklist,
        icon: 'standard:picklist_type',
        category: LABELS.fieldCategoryInput
    },
    {
        name: 'MultiSelectCheckboxes',
        fieldType: FlowScreenFieldType.MultiSelectCheckboxes,
        dataType: 'String',
        label: LABELS.fieldTypeLabelMultiSelectCheckboxes,
        icon: 'standard:multi_select_checkbox',
        category: LABELS.fieldCategoryInput
    },
    {
        name: 'MultiSelectPicklist',
        fieldType: FlowScreenFieldType.MultiSelectPicklist,
        dataType: 'String',
        label: LABELS.fieldTypeLabelMultiSelectPicklist,
        icon: 'standard:multi_picklist',
        category: LABELS.fieldCategoryInput
    },
    {
        name: 'DisplayText',
        fieldType: FlowScreenFieldType.DisplayText,
        dataType: undefined,
        label: LABELS.fieldTypeLabelDisplayText,
        icon: 'standard:display_text',
        category: LABELS.fieldCategoryDisplay,
        type: 'String'
    },
    {
        name: 'Section',
        fieldType: FlowScreenFieldType.RegionContainer,
        label: LABELS.fieldTypeLabelSection,
        icon: 'standard:section',
        category: LABELS.fieldCategoryDisplay,
        description: LABELS.fieldTypeDescriptionSection
    },
    {
        name: 'ObjectProvided',
        fieldType: FlowScreenFieldType.ObjectProvided
    }
];

/**
 * Returns all screen field types (excluding extensions), including name, fieldType, dataType, label (localized), icon and category (localized)
 * @return {array} - The field types
 */
export function getAllScreenFieldTypes() {
    return screenFieldTypes;
}

/**
 * Returns a local representation of the field type for the given extension (that will eventually be replaced by the server version)
 * @param {String} name - The FQN of the extension
 * @returns {FlowScreenFieldType} - The type
 */
export function getLocalExtensionFieldType(name) {
    return {
        name,
        fieldType: FlowScreenFieldType.ComponentInstance,
        label: name,
        icon: 'standard:lightning_component',
        source: EXTENSION_TYPE_SOURCE.LOCAL
    };
}

export function getSectionFieldType() {
    return {
        name: 'Section',
        fieldType: FlowScreenFieldType.RegionContainer,
        label: LABELS.fieldTypeLabelSection,
        icon: 'standard:display_text',
        category: LABELS.fieldCategoryDisplay
    };
}

export function getColumnFieldType() {
    return {
        name: 'Column',
        fieldType: FlowScreenFieldType.Region
    };
}

/**
 * Returns a type given a name
 * @param {string} name - The name of the type
 * @returns {object} - The type
 * @throws if type can't be found
 */
export function getScreenFieldTypeByName(name) {
    name = name && name.toLowerCase();
    return [...getAllScreenFieldTypes(), ...getAllCachedExtensionTypes(), getColumnFieldType()].find(
        (type) => type.name.toLowerCase() === name
    );
}

/**
 * Returns the type object corresponding to the given field (determined by looking at the fieldType and the dataType
 * @param {object} field - The screen field
 * @returns {object} - The corresponding type
 * @throws if type can't be found
 */
export function getScreenFieldType(field) {
    const fieldType = field.fieldType;
    const dataType = field.dataType;

    let allTypes = getAllScreenFieldTypes();
    allTypes = allTypes.concat(getColumnFieldType());

    for (const type of allTypes) {
        if (fieldType === type.fieldType && dataType === type.dataType) {
            return type;
        }

        // Special case for choice based fields.
        // A reality, these choice based fields have a dataType associated with them. However, we generically
        // lump each type of choice based fields as one type in the screenFieldTypes map and dataType is ignored.
        // For this check only, just check the fieldType and ignore dataType.
        if (
            fieldType === type.fieldType &&
            (fieldType === FlowScreenFieldType.RadioButtons || fieldType === FlowScreenFieldType.DropdownBox)
        ) {
            return type;
        }
    }

    throw new Error('No type found for ' + fieldType + ', ' + dataType);
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is an extension field type
 */
export function isExtensionField(field) {
    return field && field.fieldType === FlowScreenFieldType.ComponentInstance;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a DisplayText field (non-rich text)
 */
export function isDisplayTextField(field) {
    return field && field.fieldType === FlowScreenFieldType.DisplayText;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a date field
 */
export function isDateField(field) {
    return field && field.dataType === 'Date';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a dateTime field
 */
export function isDateTimeField(field) {
    return field && field.dataType === 'DateTime';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is an input field
 */
export function isInputField(field) {
    return field && field.fieldType === FlowScreenFieldType.InputField;
}

/**
 * @param field - field to test
 * @returns {*|boolean} Indicates if the specified field is a number field.
 */
export function isNumberField(field) {
    return field && field.dataType === 'Number';
}

/**
 * @param field - field to test
 * @returns {*|boolean} Indicates if the specified field is a currency field.
 */
export function isCurrencyField(field) {
    return field && field.dataType === 'Currency';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a text area field
 */
export function isTextAreaField(field) {
    return field && field.fieldType === FlowScreenFieldType.LargeTextArea;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a password field
 */
export function isPasswordField(field) {
    return field && field.fieldType === FlowScreenFieldType.PasswordField;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a radio field
 */
export function isRadioField(field) {
    return field && field.fieldType === FlowScreenFieldType.RadioButtons;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a multi-select checkbox field
 */
export function isMultiSelectCheckboxField(field) {
    return field && field.fieldType === FlowScreenFieldType.MultiSelectCheckboxes;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a multi-select picklist field
 */
export function isMultiSelectPicklistField(field) {
    return field && field.fieldType === FlowScreenFieldType.MultiSelectPicklist;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a picklist field
 */
export function isPicklistField(field) {
    return field && field.fieldType === FlowScreenFieldType.DropdownBox;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a region container (section) field
 */
export function isRegionContainerField(field) {
    return field && field.fieldType === FlowScreenFieldType.RegionContainer;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a region (column) field
 */
export function isRegionField(field) {
    return field && field.fieldType === FlowScreenFieldType.Region;
}

export function isAutomaticField(field) {
    return field && field.fieldType === FlowScreenFieldType.ObjectProvided;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if the specified field is a choice based field.
 */
export function isChoiceField(field) {
    return (
        field &&
        (isPicklistField(field) ||
            isMultiSelectCheckboxField(field) ||
            isMultiSelectPicklistField(field) ||
            isRadioField(field))
    );
}

/**
 * @param {string} dataType - The dataType to look up.
 * @returns {string} The corresponding FLOW_DATA_TYPE. Returns null there is no match.
 */
export function getFlowDataTypeByName(dataType) {
    if (dataType) {
        // Lightning Component attributes support field types in various number flavors, which all map to number
        // in Flow metadata.
        let lcType = dataType.toUpperCase();
        if (
            lcType === 'DECIMAL' ||
            lcType === 'DOUBLE' ||
            lcType === 'INTEGER' ||
            lcType === 'LONG' ||
            lcType === 'INT'
        ) {
            lcType = 'NUMBER';
        }

        for (const typeName in FLOW_DATA_TYPE) {
            if (FLOW_DATA_TYPE[typeName].value.toUpperCase() === lcType) {
                return FLOW_DATA_TYPE[typeName].value;
            }
        }
    }
    return null;
}

/**
 * @param {string} dataType - The dataType to look up.
 * @returns {string} The corresponding iconName. Returns null there is no match.
 */
export function getIconNameFromDataType(dataType) {
    if (dataType) {
        // Lightning Component attributes support field types in various number flavors, which all map to number
        // in Flow metadata.
        let lcType = dataType.toUpperCase();
        if (
            lcType === 'DECIMAL' ||
            lcType === 'DOUBLE' ||
            lcType === 'INTEGER' ||
            lcType === 'LONG' ||
            lcType === 'INT'
        ) {
            lcType = 'NUMBER';
        }

        for (const typeName in FLOW_DATA_TYPE) {
            if (FLOW_DATA_TYPE[typeName].value.toUpperCase() === lcType) {
                return FLOW_DATA_TYPE[typeName].utilityIconName;
            }
        }
    }
    return null;
}

/**
 * Returns the ferov type from a field type
 * @param {FlowScreenFieldType} fieldType - The field type
 * @returns {String} - The type
 */
export function getFerovTypeFromFieldType(fieldType) {
    if (fieldType) {
        return getFerovTypeFromTypeName(fieldType.dataType || fieldType.fieldType);
    }

    return null;
}

/**
 * Maps the provided type to one of the ferov types (number, string, boolean, date and datetime)
 *
 * @param {String} type - The type
 * @returns {String} - The ferov type
 */
export function getFerovTypeFromTypeName(type) {
    if (type) {
        const ucType = type.toUpperCase();
        // try flow data type conversion
        let flowType = getFlowDataTypeByName(ucType);
        if (!flowType) {
            flowType = ucType;
        } else {
            flowType = flowType.toUpperCase();
        }

        for (const ferovType in FEROV_TYPES) {
            if (FEROV_TYPES[ferovType].find((t) => t === flowType)) {
                return ferovType;
            }
        }
    }

    return null;
}

export function getPlaceHolderLabel(fieldName) {
    for (const type of getAllScreenFieldTypes()) {
        if (fieldName === type.name) {
            return '[' + type.label + ']';
        } else if (fieldName === getColumnFieldType().name) {
            return LABELS.defaultColumnLabel;
        }
    }
    throw new Error('No type found for ' + fieldName);
}

/**
 * Returns an array of the choices associated with the given screenField.
 * If field.choiceReferences is empty, an empty array is returned.
 * @param {object} field - the field from which the choiceReferences should be extracted.
 */
export function getFieldChoiceData(field) {
    if (field.choiceReferences && field.choiceReferences.length > 0) {
        return field.choiceReferences.map((choice) => {
            if (
                choice &&
                choice.choiceReference &&
                choice.choiceReference.value &&
                choice.choiceReference.value !== '' &&
                !choice.choiceReference.error
            ) {
                const choiceElement = getElementByGuid(choice.choiceReference.value);
                if (!choiceElement) {
                    throw new Error('Unable to find element associated with choice: ' + choice.choiceReference.value);
                }

                return {
                    value: choiceElement.guid,
                    guid: choiceElement.guid,
                    label: {
                        value: '{!' + choiceElement.name + '}',
                        error: getErrorFromChoice(choice)
                    },
                    name: choiceElement.name,
                    defaultValueOption: choiceElement.elementType === ELEMENT_TYPE.CHOICE
                };
            }
            // When a new choice is being added to a screen field, there will be
            // no data for the choice yet. In that case, display this placeholder data.
            return {
                value: '',
                guid: '',
                label: { value: null, error: getErrorFromChoice(choice) },
                name: '',
                defaultValueOption: false
            };
        });
    }
    return [];
}

export function hasScreenFieldVisibilityCondition(field) {
    return field.visibilityRule && field.visibilityRule.conditions.length > 0;
}

function getErrorFromChoice(choice) {
    if (choice && choice.choiceReference) {
        return choice.choiceReference.error;
    }
    return null;
}
