import { generateGuid } from 'builder_platform_interaction-store-lib';
import { getScreenFieldType } from './screen-editor-field-type-utils.js';

// ********************************** CLIENT SIDE MODEL **********************************
function decorateScreenField(field) {
    field.guid = generateGuid();
    field.type = getScreenFieldType(field);

    if (field.hasOwnProperty('defaultValue')) {
        field._defaultValue = field.defaultValue;
        delete field.defaultValue;
        Object.defineProperty(field, 'defaultValue', {
            configurable: true,
            get() {
                const value = field._defaultValue;
                if (value) {
                    if (value.elementReference) {
                        return '{!' + value.elementReference + '}';
                    } else if (field.dataType === 'Currency' || field.dataType === 'Number') {
                        return value.numberValue;
                    } else if (field.dataType === 'Date') {
                        return value.dateValue;
                    } else if (field.dataType === 'Boolean') {
                        return value.booleanValue;
                    }

                    return value.stringValue;
                }

                return value;
            },
            set(value) {
                if (value.startsWith('{!') && value.endsWith('}')) { // TODO Check how the CFD sends default values to the server
                    field._defaultValue.elementReference = value.substring(2, value.length - 1);
                } else if (field.dataType === 'Currency' || field.dataType === 'Number') {
                    field._defaultValue.numberValue = value;
                } else if (field.dataType === 'Date') {
                    field._defaultValue.dateValue = value;
                } else if (field.dataType === 'Boolean') {
                    field._defaultValue.booleanValue = value;
                } else {
                    field._defaultValue.stringValue = value;
                }
            }
        });
    }
}

export function decorateScreen(screen) {
    for (const field of screen.fields) {
        decorateScreenField(field);
    }

    screen.getFieldIndex = function (field) {
        for (let i = 0; i < this.fields.length; i++) {
            if (field.guid === this.fields[i].guid) {
                return i;
            }
        }

        return -1;
    };

    screen.getFieldByGUID = function (guid) {
        for (const field of this.fields) {
            if (field.guid === guid) {
                return field;
            }
        }

        return undefined;
    };

    return screen;
}

export function undecorateScreen(screen) {
    for (const field of screen.fields) {
        delete field.guid;
        delete field.type;
        delete field.defaultValue;
        field.defaultValue = field._defaultValue;
        delete field._defaultValue;
    }

    delete screen.getFieldByGUID;
    delete screen.getFieldIndex;
    return screen;
}
// ********************************** END CLIENT SIDE MODEL **********************************

// **************************************** MODEL SUPPORT FUNCTIONS *********************************************
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

// Returns a new screen empty node (TODO: This is not used right now, should be used from the FB palette if necessary)
export const createEmptyNodeOfType = (type) => {
    return {
        guid: generateGuid,
        fieldType: type.fieldType,
        dataType: type.dataType
    };
};
