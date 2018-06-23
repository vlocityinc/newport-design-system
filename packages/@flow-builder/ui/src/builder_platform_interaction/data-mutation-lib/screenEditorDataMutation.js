import { getScreenFieldType, getValueFromFerov, getFerovFromValue } from 'builder_platform_interaction-screen-editor-utils';

export const mutateScreenField = field => {
    field.type = getScreenFieldType(field);

    if (field.hasOwnProperty('defaultValue')) {
        field._defaultValue = field.defaultValue;
        delete field.defaultValue;
        Object.defineProperty(field, 'defaultValue', {
            configurable: true,
            get() {
                return getValueFromFerov(field._defaultValue, field.dataType);
            },
            set(value) {
                field._defaultValue = getFerovFromValue(value, field.dataType);
            }
        });
    }

    return field;
};

export const demutateScreenField = field => {
    delete field.type;
    delete field.defaultValue;
    field.defaultValue = field._defaultValue;
    delete field._defaultValue;

    return field;
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

    screen.getFieldIndexByGUID = function (guid) {
        if (this.fields) {
            return this.fields.findIndex(field => {
                return field.guid === guid;
            });
        }

        return -1;
    };

    return screen;
};

export const demutateScreen = screen => {
    for (const field of screen.fields) {
        demutateScreenField(field);
    }

    delete screen.getFieldByGUID;
    delete screen.getFieldIndexByGUID;
    delete screen.getFieldIndex;
    return screen;
};

