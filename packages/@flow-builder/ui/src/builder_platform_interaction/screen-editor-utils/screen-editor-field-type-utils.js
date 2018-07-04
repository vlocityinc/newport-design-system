import {LABELS} from 'builder_platform_interaction-screen-editor-i18n-utils';

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
        category: LABELS.fieldCategoryInput
    }, {
        name: 'LargeTextArea',
        fieldType: 'LargeTextArea',
        dataType: undefined,
        label: LABELS.fieldTypeLabelLargeTextArea,
        icon: 'utility:type_tool',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'Number',
        fieldType: 'InputField',
        dataType: 'Number',
        label: LABELS.fieldTypeLabelNumber,
        icon: 'utility:topic2',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'Currency',
        fieldType: 'InputField',
        dataType: 'Currency',
        label: LABELS.fieldTypeLabelCurrency,
        icon: 'utility:moneybag',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'Date',
        fieldType: 'InputField',
        dataType: 'Date',
        label: LABELS.fieldTypeLabelDate,
        icon: 'utility:event',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'DateTime',
        fieldType: 'InputField',
        dataType: 'DateTime',
        label: LABELS.fieldTypeLabelDateTime,
        icon: 'utility:event',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'Password',
        fieldType: 'PasswordField',
        dataType: undefined,
        label: LABELS.fieldTypeLabelPassword,
        icon: 'utility:lock',
        category: LABELS.fieldCategoryInput
    }, {
        name: 'Checkbox',
        fieldType: 'InputField',
        dataType: 'Boolean',
        label: LABELS.fieldTypeLabelCheckbox,
        icon: 'utility:check',
        category: LABELS.fieldCategoryInput
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
    }, {
        name: 'Extension',
        fieldType: 'ComponentInstance',
        dataType: undefined,
        label: 'Account Picker',
        icon: 'utility:connected_apps', // 'standard:custom_notification', //Removing this until we clarify how to change the size and the background of icons in the palette
        category: LABELS.fieldCategoryCustom
    }
];

/**
 * Returns all scren field types, including name, fieldType, dataType, label (localized), icon and category (localized)
 * @return {array} - The field types
 */
export function getAllScreenFieldTypes() {
    return screenFieldTypes;
}

/**
 * Returns a type given a name
 * @param {string} name - The name of the type
 * @returns {object} - The type
 * @throws if type can't be found
 */
export function getScreenFieldTypeByName(name) {
    for (const type of screenFieldTypes) {
        if (type.name.toLowerCase() === name.toLowerCase()) {
            return type;
        }
    }

    throw new Error('No such screen field type: ' + name);
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
        if (fieldType ===  type.fieldType && dataType === type.dataType) {
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
    return field && field.fieldType === 'ComponentInstance';
}

/**
 * @param {object} field - field to test
 * @returns {boolean} Indicates if specified field is a DisplayText field (non-rich text)
 */
export function isDisplayTextField(field) {
    return field && field.name === 'DisplayText';
}