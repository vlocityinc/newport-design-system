import { generateGuid } from 'builder_platform_interaction-store-lib';
import { getScreenFieldType } from './screen-editor-field-type-utils.js';
import { localizeString, REQUIRED_ERROR} from 'builder_platform_interaction-screen-editor-i18n-utils';

// Developer name validation regex - TODO Remove if the FB validation framework provides one
const DEV_NAME_REGEX = /[^a-zA-Z0-9_-]/gi;

// Node types for FSB
export const nodeType = {screenField: 'screenfield', screen: 'screen'};

// Validator for properties (TODO Remove if we decide to validate at the field level using a different mechanism (FB validation)
const validatorsMap = {
    developerNameValidator(value) {
        if (DEV_NAME_REGEX.test(value)) {
            return value + ' is not a valid name';
        }

        return null;
    }
};

// Metadata for the screen properties (most of this will be gone when we move from dynamic property editors to specific markup editors
const screenProperties = {
    label: {type: 'string', name: 'label', label: 'Name', value: null, required: true, validators: [], complexValue: false, readOnly: false},
    name: {type: 'string', name: 'name', label: 'Unique Name', value: null, required: true, validators: ['developerNameValidator'], complexValue: false, readOnly: false},
    description: {type: 'long_string', name: 'description', label: 'Description', value: null, required: false, validators: [], complexValue: false, readOnly: false},
    showHeader: {type: 'boolean', name: 'showHeader', label: 'Show Header', value: true, required: false, validators: [], complexValue: false, readOnly: false},
    showFooter: {type: 'boolean', name: 'showFooter', label: 'Show Footer', value: true, required: false, validators: [], complexValue: false, readOnly: false},
    allowFinish: {type: 'boolean', name: 'allowFinish', label: 'Allow Finish', value: true, required: false, validators: [], complexValue: false, readOnly: false},
    allowPrevious: {type: 'boolean', name: 'allowBack', label: 'Allow Previous', value: true, required: false, validators: [], complexValue: false, readOnly: false},
    allowPause: {type: 'boolean', name: 'allowPause', label: 'Allow Pause', value: true, required: false, validators: [], complexValue: false, readOnly: false},
    pausedMessage: {type: 'long_string', name: 'pausedMessage', label: 'Paused Message', value: null, required: false, validators: [], complexValue: false, readOnly: false},
    helpText: {type: 'long_string', name: 'helpText', label: null, value: null, required: false, validators: [], complexValue: false, readOnly: false}
};

// Metadata for the screen fields (most of this will be gone when we move from dynamic property editors to specific markup editors
const screenFieldProperties = {
    label: {type: 'string', name: 'fieldText', label: 'Label', value: undefined, required: false, validators: [], complexValue: false, readOnly: false},
    developerName: {type: 'string', name: 'name', label: 'Unique Name', value: undefined, required: true, validators: ['developerNameValidator'], complexValue: false, readOnly: false},
    defaultValue: {type: 'string', name: 'defaultValue', label: 'Default Value', value: undefined, required: false, validators: [], complexValue: true, readOnly: false},
    validate: {type: 'boolean', name: 'validate', label: 'Validate', value: true, required: false, validators: [], complexValue: false, readOnly: false},
    validationFormula: {type: 'long_string', name: 'validationFormula', label: 'Formula Expression', value: undefined, parent: 'validate', required: true, validators: [], complexValue: false, readOnly: false},
    validationError: {type: 'long_string', name: 'validationError', label: 'Error Message', value: undefined, parent: 'validate', required: true, validators: [], complexValue: false, readOnly: false},
    helpText: {type: 'long_string', name: 'helpText', label: "Text", value: undefined, required: false, validators: [], complexValue: false, readOnly: false},
    required: {type: 'boolean', name: 'isRequired', label: 'Required', value: false, required: false, validators: [], complexValue: false, readOnly: false},
    scale: {type: 'number', name: 'scale', label: 'Scale', value: 0, required: false, validators: [], complexValue: false, readOnly: false},
    displayText: {type: 'rich_string', name: 'fieldText', label: 'Display Text', value: undefined, required: false, validators: [], complexValue: false, readOnly: false}
};

// Template for a screen (will be gone when we implement a specific property editor for screens)
const screenPropertiesTemplate = {
    'General Info': ['label', 'name', 'description'],
    'Header and Footer': ['showHeader', 'showFooter'],
    'Navigation Actions': ['allowFinish', 'allowPrevious', 'allowPause', 'pausedMessage'],
    'Help Text': ['helpText']
};

// ********************************** CLIENT SIDE MODEL **********************************
// Creates a property to be used in the dynamic property editor
function createProperty(type, name, masterLabel, defaultValue, required, validators, parent, node, complexValue, readOnly) {
    return {
        guid: generateGuid(),
        type,
        name,
        masterLabel,
        defaultValue,
        node,
        required,
        validators,
        parent, // parent property
        complexValue,
        readOnly,
        parentElement: undefined, // element that this property belongs to

        validate(value, parentValue) {
            const errors = [];
            if (this.required && !value) {
                if (!this.parent || parentValue) {
                    errors.push(localizeString(REQUIRED_ERROR));
                }
            }

            if (this.validators) {
                for (const validatorName of this.validators) {
                    const error = validatorsMap[validatorName](value);
                    if (error) {
                        errors.push(error);
                    }
                }
            }

            return errors;
        },

        set value(value) {
            if (this.value !== value) {
                if (this.complexValue) {
                    const defValue = this.node[this.name];

                    if (value.startsWith('{!') && value.endsWith('}')) { // TODO Check how the CFD sends default values to the server
                        defValue.elementReference = value.substring(2, value.length - 1);
                    } else if (this.node.dataType === 'Currency' || this.node.dateType === 'Number') {
                        defValue.numberValue = value;
                    } else if (this.node.dataType === 'Date') {
                        defValue.dateValue = value;
                    } else if (this.node.dataType === 'Boolean') {
                        defValue.booleanValue = value;
                    } else {
                        defValue.stringValue = value;
                    }
                } else {
                    this.node[this.name] = value;
                }

                if (this.parentElement && this.parentElement.propertyValueChanged) {
                    this.parentElement.propertyValueChanged(this, value);
                }
            }
        },

        get value() {
            if (this.complexValue) {
                const value = this.node[this.name];
                if (value) {
                    if (value.elementReference) {
                        return '{!' + value.elementReference + '}';
                    }

                    if (this.node.dataType === 'Currency' || this.node.dateType === 'Number') {
                        return value.numberValue;
                    } else if (this.node.dataType === 'Date') {
                        return value.dateValue;
                    } else if (this.node.dataType === 'Boolean') {
                        return value.booleanValue;
                    }

                    return value.stringValue;
                }
            } else if (this.type === 'long_string') {
                return this.node[this.name];
                // return translateCFDtoQuill(this.node[this.name]); // TODO Move this to the appropriate place
            }

            return this.node[this.name];
        },

        get label() {
            return this.masterLabel; // TODO i18n
        },

        get visible() {
            return (parent) ? parent.value : true;
        }
    };
}

// Creates a category from its properties
function createCategory(name, properties) {
    const propertyMap = {};
    for (const property of properties) {
        propertyMap[property.name] = property;
    }

    return {
        name,
        properties,

        get label() {
            return this.name;
        },

        hasProperty(propertyName) {
            return propertyMap.hasOwnProperty(propertyName);
        },

        getProperty(propertyName) {
            return propertyMap[propertyName];
        }
    };
}

// Creates a screen field (with categories and properties)
function createScreenField(fieldNode) {
    const type = getScreenFieldType(fieldNode);
    let categories = null;
    if (type.fieldType === 'ComponentInstance') {
        // createProperty(type, name, masterLabel, defaultValue, required, validators, parent, node, complexValue)
        const nameProperties = [createProperty('string', 'extensionName', 'Component Name', fieldNode.extensionName, true, [], undefined, fieldNode, false, true)];
        categories = [];
        categories.push(createCategory('General Info', nameProperties));

        const inputProperties = [];
        for (const input of fieldNode.inputParameters) {
            const prop = createProperty('string', 'value', input.name, input.value, true, [], undefined, input, true, false);
            prop.parameterType = 'input';
            prop.parameterName = input.name;
            inputProperties.push(prop);
        }
        categories.push(createCategory('Inputs', inputProperties));

        const outputProperties = [];
        for (const output of fieldNode.outputParameters) {
            const prop = createProperty('string', 'assignToReference', output.name, output.assignToReference, true, [], undefined, output, false, false);
            prop.parameterType = 'output';
            prop.assignToReference = output.assignToReference;
            outputProperties.push(prop);
        }
        categories.push(createCategory('Outputs', outputProperties));
    } else {
        categories = createCategoriesFromTemplate(fieldNode, type.template, screenFieldProperties);

        // Swap parent property names by the actual parent property
        const allProperties = {};
        for (const category of categories) {
            for (const property of category.properties) {
                allProperties[property.name] = property;
            }
        }

        for (const propName in allProperties) {
            if (allProperties.hasOwnProperty(propName)) {
                const property = allProperties[propName];
                if (property.parent) {
                    if (!allProperties.hasOwnProperty(property.parent)) {
                        throw new Error(property.parent + ' specified as parent property of ' + property.name + ' does not exist');
                    }
                    property.parent = allProperties[property.parent];
                }
            }
        }
    }

    const screenField = {
        guid: generateGuid(),
        type,
        categories,
        nodeType: nodeType.screenField,

        get dataType() {
            return this.type.dataType;
        },

        get fieldType() {
            return this.type.fieldType;
        },

        get template() {
            return this.type.template;
        },

        get icon() {
            return this.type.icon;
        },

        getProperty(propertyName) {
            return getProperty(propertyName, this.categories);
        }
    };

    addChangeNotificationSupport(screenField);
    return processProperties(screenField);
}

// Creates a screen (categories and properties)
export function createScreen(screenNode) {
    const categories = createCategoriesFromTemplate(screenNode, screenPropertiesTemplate, screenProperties);
    const fields = [];
    for (const fieldNode of screenNode.fields) {
        fields.push(createScreenField(fieldNode));
    }

    const screen =  {
        guid: generateGuid(),
        node: screenNode,
        nodeType: nodeType.screen,
        categories,
        fields,

        getProperty(propertyName) {
            return getProperty(propertyName, this.categories);
        },

        addField(fieldNode) {
            // add field to node and template
            const field = createScreenField(fieldNode);
            this.fields.push(field);
            this.node.fields.push(fieldNode);
            return field;
        },

        removeField(field) {
            const idx = this.getFieldIndexByGUID(field.guid);
            if (idx > -1) {
                this.fields.splice(idx, 1);
                this.node.fields.splice(idx, 1);
            }
        },

        getFieldIndexByGUID(guid) {
            for (let i = 0; i < this.fields.length; i++) {
                if (this.fields[i].guid === guid) {
                    return i;
                }
            }

            return -1;
        },

        getFieldByGUID(guid) {
            const idx = this.getFieldIndexByGUID(guid);
            return (idx > -1) ? this.fields[idx] : undefined;
        }
    };

    addChangeNotificationSupport(screen);
    return processProperties(screen);
}

/* Adds all properties for all categories as a property of the parent object and sets the parent of all the properties to the parent element */
function processProperties(obj) {
    if (obj && obj.categories) {
        for (const category of obj.categories) {
            for (const property of category.properties) {
                property.parentElement = obj;
                if (!Object.hasOwnProperty(obj, property.name)) {
                    Object.defineProperty(obj, property.name, {
                        get() {
                            return property.value;
                        },
                        set(value) {
                            property.value = value;
                        }
                    });
                } else {
                    throw new Error('Object ' + obj + ' already has a ' + property.name + ' property.');
                }
            }
        }
    }

    return obj;
}

/* adds all change listener state and functions to an object */
function addChangeNotificationSupport(obj) {
    obj.listeners = [];

    obj.propertyValueChanged = function (property, newValue) {
        for (const listener of obj.listeners) {
            listener(property, newValue);
        }
    };

    obj.addChangeListener = function (listener) {
        obj.listeners.push(listener);
    };

    obj.removeChangeListener = function (listener) {
        obj.listeners.splice(obj.listeners.indexOf(listener), 1);
    };
}

// ********************************** END OF CLIENT SIDE MODEL **********************************

// Returns a new screen empty node (TODO: This is not used right now, should be used from the FB palette if necessary)
export function createEmptyScreenNode() {
    return {
        allowBack: true,
        allowFinish: true,
        allowPause: true,
        description: '',
        elementType: 'SCREEN',
        helpText: '',
        label: '',
        name: '',
        pausedText: '',
        showFooter: true,
        showHeader: true,
        rules: [],
        fields: []
    };
}

export function toDeveloperName(name) {
    return name.replace(DEV_NAME_REGEX, '_');
}

// Creates all the categories for a template
function createCategoriesFromTemplate(node, template, entityProperties) {
    const categories = [];
    const propertiesMap = {};

    for (const category in template) {
        if (template.hasOwnProperty(category)) {
            const propertyNames = template[category];
            const properties = [];
            for (const propertyName of propertyNames) {
                const tProperty = entityProperties[propertyName];
                const property = createProperty(tProperty.type, tProperty.name, tProperty.label, tProperty.value, tProperty.required, tProperty.validators, tProperty.parent, node, tProperty.complexValue, tProperty.readOnly);
                propertiesMap[property.name] = property;
                properties.push(property);
            }

            categories.push(createCategory(category, properties));
        }
    }

    return categories;
}

function getProperty(name, categories) {
    for (const category of categories) {
        if (category.hasProperty(name)) {
            return category.getProperty(name);
        }
    }

    return undefined;
}