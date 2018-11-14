import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { COMPONENT_INSTANCE, EXTENSION_TYPE_SOURCE, getAllCachedExtensionTypes, listExtensions } from "./screenEditorExtensionUtils";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

const FEROV_TYPES = {
    string: ['TEXT', 'STRING', 'PASSWORD', 'PASSWORDFIELD'],
    number: ['CURRENCY', 'NUMBER', 'DECIMAL', 'FLOAT', 'DOUBLE', 'LONG', 'INT', 'INTEGER', 'SHORT', 'BYTE'],
    date: ['DATE'],
    dateTime: ['DATETIME', 'DATE-TIME'],
    boolean: ['BOOLEAN']
};

/**
 * All screen field types
 * Property type represents the actual data type of the field (used as part of ferov handling)
 */
const screenFieldTypes = [
    {
        name: 'TextBox',
        fieldType: 'InputField',
        dataType: 'String',
        label: LABELS.fieldTypeLabelTextField,
        icon: 'utility:type_tool',
        category: LABELS.fieldCategoryInput,
        type: 'String'
    }, {
        name: 'LargeTextArea',
        fieldType: 'LargeTextArea',
        dataType: undefined,
        label: LABELS.fieldTypeLabelLargeTextArea,
        icon: 'utility:type_tool',
        category: LABELS.fieldCategoryInput,
        type: 'String'
    }, {
        name: 'Number',
        fieldType: 'InputField',
        dataType: 'Number',
        label: LABELS.fieldTypeLabelNumber,
        icon: 'utility:topic2',
        category: LABELS.fieldCategoryInput,
        type: 'Number'
    }, {
        name: 'Currency',
        fieldType: 'InputField',
        dataType: 'Currency',
        label: LABELS.fieldTypeLabelCurrency,
        icon: 'utility:moneybag',
        category: LABELS.fieldCategoryInput,
        type: 'Number'
    }, {
        name: 'Date',
        fieldType: 'InputField',
        dataType: 'Date',
        label: LABELS.fieldTypeLabelDate,
        icon: 'utility:event',
        category: LABELS.fieldCategoryInput,
        type: 'Date'
    }, {
        name: 'DateTime',
        fieldType: 'InputField',
        dataType: 'DateTime',
        label: LABELS.fieldTypeLabelDateTime,
        icon: 'utility:event',
        category: LABELS.fieldCategoryInput,
        type: 'DateTime'
    }, {
        name: 'Password',
        fieldType: 'PasswordField',
        dataType: undefined,
        label: LABELS.fieldTypeLabelPassword,
        icon: 'utility:lock',
        category: LABELS.fieldCategoryInput,
        type: 'String'
    }, {
        name: 'Checkbox',
        fieldType: 'InputField',
        dataType: 'Boolean',
        label: LABELS.fieldTypeLabelCheckbox,
        icon: 'utility:check',
        category: LABELS.fieldCategoryInput,
        type: 'Boolean'
    }, {
        name: 'RadioButtons',
        fieldType: 'RadioButtons',
        dataType: null,
        label: LABELS.fieldTypeLabelRadioButtons,
        icon: 'utility:radio_button',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'DropdownBox',
        fieldType: 'DropdownBox',
        dataType: null,
        label: LABELS.fieldTypeLabelPicklist,
        icon: 'utility:picklist_type',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'MultiSelectCheckboxes',
        fieldType: 'MultiSelectCheckboxes',
        dataType: 'String',
        label: LABELS.fieldTypeLabelMultiSelectCheckboxes,
        icon: 'utility:multi_select_checkbox',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'MultiSelectPicklist',
        fieldType: 'MultiSelectPicklist',
        dataType: 'String',
        label: LABELS.fieldTypeLabelMultiSelectPicklist,
        icon: 'utility:multi_picklist',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'DisplayText',
        fieldType: 'DisplayText',
        dataType: undefined,
        label: LABELS.fieldTypeLabelDisplayText,
        icon: 'utility:type_tool',
        category: LABELS.fieldCategoryDisplay,
        type: 'String'
    },
];
/*
 *  The display rich text component will be added in the future:
 *  {
        name: 'DisplayRichText',
        fieldType: 'DisplayText',
        dataType: undefined,
        label: LABELS.fieldTypeLabelDisplayRichText,
        icon: 'utility:type_tool',
        category: LABELS.fieldCategoryDisplay,
        type: 'String'
    }
 */

/**
 * Returns a Promise that will be resolved once the extension field types have been retrieved.
 *
 * @Returns {Promise} - The promise
 */
export function getExtensionFieldTypes() {
    const cachedFields = getAllCachedExtensionTypes();
    if (cachedFields && cachedFields.length) {
        return Promise.resolve(cachedFields);
    }

    return new Promise((resolve, reject) => {
        listExtensions(true, (data, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

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
 * @returns {FieldType} - The type
 */
export function getLocalExtensionFieldType(name) {
    return {
        name,
        fieldType: COMPONENT_INSTANCE,
        label: name,
        icon: 'utility:connected_apps', // 'standard:custom_notification', //Removing this until we clarify how to change the size and the background of icons in the palette
        source: EXTENSION_TYPE_SOURCE.LOCAL
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
    return [...screenFieldTypes, ...getAllCachedExtensionTypes()].find(type => type.name.toLowerCase() === name);
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

    for (const type of screenFieldTypes) {
        if (fieldType === type.fieldType && dataType === type.dataType) {
            return type;
        }

        // Special case for choice based fields.
        // A reality, these choice based fields have a dataType associated with them. However, we generically
        // lump each type of choice based fields as one type in the screenFieldTypes map and dataType is ignored.
        // For this check only, just check the fieldType and ignore dataType.
        if (fieldType === type.fieldType &&
            (fieldType === 'RadioButtons' || fieldType === 'DropdownBox')) {
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
    return field && field.fieldType === COMPONENT_INSTANCE;
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a DisplayText field (non-rich text)
 */
export function isDisplayTextField(field) {
    return field && field.fieldType === 'DisplayText';
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
    return field && field.fieldType === 'InputField';
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
    return field && field.fieldType === 'LargeTextArea';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a password field
 */
export function isPasswordField(field) {
    return field && field.fieldType === 'PasswordField';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a radio field
 */
export function isRadioField(field) {
    return field && field.fieldType === 'RadioButtons';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a multi-select checkbox field
 */
export function isMultiSelectCheckboxField(field) {
    return field && field.fieldType === 'MultiSelectCheckboxes';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a multi-select picklist field
 */
export function isMultiSelectPicklistField(field) {
    return field && field.fieldType === 'MultiSelectPicklist';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a picklist field
 */
export function isPicklistField(field) {
    return field && field.fieldType === 'DropdownBox';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if the specified field is a choice based field.
 */
export function isChoiceField(field) {
    return field && (isPicklistField(field) || isMultiSelectCheckboxField(field) ||
        isMultiSelectPicklistField(field) || isRadioField(field));
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
        if (lcType === 'DECIMAL' || lcType === 'DOUBLE' || lcType === 'INTEGER' || lcType === 'LONG' || lcType === 'INT') {
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
 * Returns the ferov type from a field type
 * @param {FieldType} fieldType - The field type
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
            if (FEROV_TYPES[ferovType].find(t => t === flowType)) {
                return ferovType;
            }
        }
    }

    return null;
}

export function getPlaceHolderLabel(fieldName) {
    for (const type of screenFieldTypes) {
        if (fieldName === type.name) {
            return '[' + type.label + ']';
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
            if (choice && choice.choiceReference && choice.choiceReference.value && choice.choiceReference.value !== "") {
                const choiceElement = getElementByGuid(choice.choiceReference.value);
                if (!choiceElement) {
                    throw new Error('Unable to find element: ' + choice);
                }

                // Figure out which property should be used as the label, based on choice type.
                let label;
                let defaultValueOption = false;
                if (choiceElement.elementType === ELEMENT_TYPE.PICKLIST_CHOICE_SET) {
                    label = choiceElement.picklistField;
                } else if (choiceElement.elementType === ELEMENT_TYPE.RECORD_CHOICE_SET) {
                    label = '[' + LABELS.dynamicRecordChoiceLabel + '] ' + choiceElement.displayField;
                } else if (choiceElement.elementType === ELEMENT_TYPE.CHOICE) {
                    // This choice can be used as a defaultValue. The other types cannot.
                    defaultValueOption = true;
                    label = choiceElement.choiceText;
                } else {
                    throw new Error("Unknown choice type: " + choiceElement.elementType);
                }

                return {
                    label,
                    guid:  choiceElement.guid,
                    value: choiceElement.guid,
                    displayValue: {value: '{!' + choiceElement.name + '}', error: getErrorFromChoice(choice)},
                    name: choiceElement.name,
                    defaultValueOption
                };
            }
            // When a new choice is being added to a screen field, there will be
            // no data for the choice yet. In that case, display this placeholder data.
            return {
                label: '',
                guid:  generateGuid(),
                value: '',
                displayValue: {value: null, error: getErrorFromChoice(choice)},
                name: '',
                defaultValueOption: false
            };
        });
    }
    return [];
}

function getErrorFromChoice(choice) {
    if (choice && choice.choiceReference) {
        return choice.choiceReference.error;
    }
    return null;
}