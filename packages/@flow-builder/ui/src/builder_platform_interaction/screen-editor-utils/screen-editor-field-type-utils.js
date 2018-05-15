import {
    localizeString,
    I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT,
    I18N_KEY_SCREEN_FIELD_CATEGORY_DISPLAY,
    I18N_KEY_SCREEN_FIELD_CATEGORY_CUSTOM,
    I18N_KEY_SCREEN_FIELD_TYPE_LABEL_TEXT_FIELD,
    I18N_KEY_SCREEN_FIELD_TYPE_LABEL_LARGE_TEXT_AREA,
    I18N_KEY_SCREEN_FIELD_TYPE_LABEL_NUMBER,
    I18N_KEY_SCREEN_FIELD_TYPE_LABEL_CURRENCY,
    I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DATE,
    I18N_KEY_SCREEN_FIELD_TYPE_LABEL_PASSWORD,
    I18N_KEY_SCREEN_FIELD_TYPE_LABEL_CHECKBOX,
    // I18N_KEY_SCREEN_FIELD_TYPE_LABEL_RADIO_BUTTONS,
    I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DISPLAY_TEXT,
    I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DISPLAY_RICH_TEXT
} from 'builder_platform_interaction-screen-editor-i18n-utils';

// Screen Fields Templates -- INCOMPLETE - TODO W-4967572
const baseScreenFieldTemplate = {
    'General Info': ['label', 'developerName', 'defaultValue'],
    'Input Validation': ['validate', 'validationFormula', 'validationError'],
    'Help Text': ['helpText']
};

const textScreenFieldTemplate = {
    'General Info': ['label', 'developerName', 'defaultValue', 'required'],
    'Input Validation': ['validate', 'validationFormula', 'validationError'],
    'Help Text': ['helpText']
};

const numberScreenFieldTemplate = {
    'General Info': ['label', 'developerName', 'defaultValue', 'scale', 'required'],
    'Input Validation': ['validate', 'validationFormula', 'validationError'],
    'Help Text': ['helpText']
};

const displayTextScreenFieldTemplate = {
    'General Info': ['developerName', 'displayText']
};

// Screen field types INCOMPLETE - TODO W-4967572
// QUESTION FOR UI TEAM: Are we planning to return localized labels from the server side or translate everything locally based on keys?
const screenFieldTypes = [
    {
        name: 'TextBox',
        fieldType: 'InputField',
        dataType: 'String',
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_TEXT_FIELD),
        icon: 'utility:type_tool',
        template: textScreenFieldTemplate,
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT)
    }, { /* cambiar */
        name: 'LargeTextArea',
        fieldType: 'LargeTextArea',
        dataType: undefined,
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_LARGE_TEXT_AREA),
        icon: 'utility:type_tool',
        template: textScreenFieldTemplate,
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT)
    }, {
        name: 'Number',
        fieldType: 'InputField',
        dataType: 'Number',
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_NUMBER),
        icon: 'utility:topic2',
        template: numberScreenFieldTemplate,
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT)
    }, {
        name: 'Currency',
        fieldType: 'InputField',
        dataType: 'Currency',
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_CURRENCY),
        icon: 'utility:moneybag',
        template: numberScreenFieldTemplate,
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT)
    }, {
        name: 'Date',
        fieldType: 'InputField',
        dataType: 'Date',
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DATE),
        icon: 'utility:event',
        template: textScreenFieldTemplate, /* Change when all templates are available */
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT)
    }, {
        name: 'Password',
        fieldType: 'PasswordField',
        dataType: undefined,
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_PASSWORD),
        icon: 'utility:lock',
        template: textScreenFieldTemplate, /* Change when all templates are available */
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT)
    }, {
        name: 'Checkbox',
        fieldType: 'InputField',
        dataType: 'Boolean',
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_CHECKBOX),
        icon: 'utility:check',
        template: baseScreenFieldTemplate,
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT)
    }, /* {
        name: 'Radio',
        fieldType: 'InputField',
        dataType: '',
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_RADIO_BUTTONS),
        icon: 'standard:contact_list',
        template: baseScreenFieldTemplate,
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_INPUT)
    }, */ {
        name: 'DisplayText',
        fieldType: 'DisplayText',
        dataType: undefined,
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DISPLAY_TEXT),
        icon: 'utility:type_tool',
        template: displayTextScreenFieldTemplate,
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_DISPLAY)
    }, {
        name: 'DisplayText',
        fieldType: 'DisplayText',
        dataType: undefined,
        label: localizeString(I18N_KEY_SCREEN_FIELD_TYPE_LABEL_DISPLAY_RICH_TEXT),
        icon: 'utility:type_tool',
        template: displayTextScreenFieldTemplate,
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_DISPLAY)
    }, {
        name: 'c:accountPicker',
        fieldType: 'ComponentInstance',
        dataType: undefined,
        label: 'Account Picker',
        icon: 'utility:connected_apps', // 'standard:custom_notification', //Removing this until we clarify how to change the size and the background of icons in the palette
        template: baseScreenFieldTemplate, /* Change when all templates are available */
        category: localizeString(I18N_KEY_SCREEN_FIELD_CATEGORY_CUSTOM)
    }
];

export function getAllScreenFieldTypes() {
    return screenFieldTypes;
}

// Creates an empty screen field
export function createEmptyNodeOfType(type) {
    return {
        isRequired: false,
        helpText: null,
        defaultValue: {
            dateValue: null,
            stringValue: null,
            dateTimeValue: null,
            booleanValue: false,
            numberValue :null,
            elementReference: null,
            inputValue: {
                converterName: null,
                label: null,
                value: null
            }
        },
        dataType: type.dataType,
        name: 'New ' + type.name + ' screen field',
        choiceReferences: null,
        defaultSelectedChoiceReference: null,
        fieldType: type.fieldType,
        inputParameters: null,
        fieldText: null,
        outputParameters: null
    };
}

// Returns a field type object from the enum from a field
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