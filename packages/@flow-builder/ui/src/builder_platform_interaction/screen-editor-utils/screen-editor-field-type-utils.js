import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { COMPONENT_INSTANCE, EXTENSION_TYPE_SOURCE, getAllCachedExtensionTypes, listExtensions } from './screen-editor-extension-utils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

/**
 * All screen field types
 */
const screenFieldTypes = [
    {
        name: 'TextBox',
        fieldType: 'InputField',
        dataType: 'String',
        label: LABELS.fieldTypeLabelTextField,
        icon: 'utility:type_tool',
        category: LABELS.fieldCategoryInput,
        defaultValueType: 'stringValue'
    }, {
        name: 'LargeTextArea',
        fieldType: 'LargeTextArea',
        dataType: undefined,
        label: LABELS.fieldTypeLabelLargeTextArea,
        icon: 'utility:type_tool',
        category: LABELS.fieldCategoryInput,
        defaultValueType: 'stringValue'
    }, {
        name: 'Number',
        fieldType: 'InputField',
        dataType: 'Number',
        label: LABELS.fieldTypeLabelNumber,
        icon: 'utility:topic2',
        category: LABELS.fieldCategoryInput,
        defaultValueType: 'numberValue'
    }, {
        name: 'Currency',
        fieldType: 'InputField',
        dataType: 'Currency',
        label: LABELS.fieldTypeLabelCurrency,
        icon: 'utility:moneybag',
        category: LABELS.fieldCategoryInput,
        defaultValueType: 'numberValue'
    }, {
        name: 'Date',
        fieldType: 'InputField',
        dataType: 'Date',
        label: LABELS.fieldTypeLabelDate,
        icon: 'utility:event',
        category: LABELS.fieldCategoryInput,
        defaultValueType: 'dateValue'
    }, {
        name: 'DateTime',
        fieldType: 'InputField',
        dataType: 'DateTime',
        label: LABELS.fieldTypeLabelDateTime,
        icon: 'utility:event',
        category: LABELS.fieldCategoryInput,
        defaultValueType: 'dateTimeValue'
    }, {
        name: 'Password',
        fieldType: 'PasswordField',
        dataType: undefined,
        label: LABELS.fieldTypeLabelPassword,
        icon: 'utility:lock',
        category: LABELS.fieldCategoryInput,
        defaultValueType: 'stringValue'
    }, {
        name: 'Checkbox',
        fieldType: 'InputField',
        dataType: 'Boolean',
        label: LABELS.fieldTypeLabelCheckbox,
        icon: 'utility:check',
        category: LABELS.fieldCategoryInput,
        defaultValueType: 'booleanValue'
    }, /* {
        name: 'Radio',
        fieldType: 'InputField',
        dataType: '',
        label: LABELS.fieldTypeLabelRadioButtons,
        icon: 'standard:contact_list',
        template: baseScreenFieldTemplate,
        category: LABELS.fieldCategoryInput
    }, */ {
        name: 'DisplayText',
        fieldType: 'DisplayText',
        dataType: undefined,
        label: LABELS.fieldTypeLabelDisplayText,
        icon: 'utility:type_tool',
        category: LABELS.fieldCategoryDisplay
    }, {
        name: 'DisplayRichText',
        fieldType: 'DisplayText',
        dataType: undefined,
        label: LABELS.fieldTypeLabelDisplayRichText,
        icon: 'utility:type_tool',
        category: LABELS.fieldCategoryDisplay
    }
];

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
    }

    throw new Error('No type found for ' + fieldType + ', ' + dataType);
}

/**
 * Returns the default value type for the specified field.
 * @param {object} field - The screen field
 * @returns {string} - The default type based on the field type (stringValue, numberValue, etc).
 * @throws if field type can't be found
 */
export function getDefaultValueType(field) {
    const fieldType = field.fieldType;
    const dataType = field.dataType;

    if (fieldType && dataType) {
        for (const type of screenFieldTypes) {
            if (fieldType === type.fieldType && dataType === type.dataType) {
                return type.defaultValueType;
            }
        }
    } else if (fieldType) {
        // Not all field types have dataTypes associated with them.
        for (const type of screenFieldTypes) {
            if (fieldType === type.fieldType) {
                return type.defaultValueType;
            }
        }
    }

    throw new Error('No default type found for ' + fieldType + ', ' + dataType);
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
 * @returns {boolean} Indicates if specified field is an input field
 */
export function isInputField(field) {
    return field && field.fieldType === 'InputField';
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

export function getPlaceHolderLabel(fieldName) {
    for (const type of screenFieldTypes) {
        if (fieldName === type.name) {
            return '[' + type.label + ']';
        }
    }
    throw new Error('No type found for ' + fieldName);
}