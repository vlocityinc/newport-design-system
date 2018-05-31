import { getScreenFieldType } from 'builder_platform_interaction-screen-editor-utils';

const mutateScreenField = field => {
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
};

const demutateScreenField = field => {
    delete field.type;
    delete field.defaultValue;
    field.defaultValue = field._defaultValue;
    delete field._defaultValue;
};

export const mutateScreen = screen => {
    for (const field of screen.fields) {
        mutateScreenField(field);
    }

    screen.getFieldIndex = function (field) {
        if (this.fields) {
            return this.fields.findIndex(sfield => {
                return sfield.guid === field.guid;
            });
        }

        return -1;
    };

    screen.getFieldByGUID = function (guid) {
        if (this.fields) {
            return this.fields.find(field => {
                return field.guid === guid;
            });
        }

        return undefined;
    };

    return screen;
};

export const demutateScreen = screen => {
    for (const field of screen.fields) {
        demutateScreenField(field);
    }

    delete screen.getFieldByGUID;
    delete screen.getFieldIndex;
    return screen;
};

