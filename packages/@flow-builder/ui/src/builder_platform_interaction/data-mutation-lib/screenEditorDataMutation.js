import { isExtensionField, getLocalExtensionFieldType, getScreenFieldTypeByName, getScreenFieldType } from 'builder_platform_interaction-screen-editor-utils';
import { mutateFEROV, deMutateFEROV } from './ferovEditorDataMutation';

export const mutateScreenField = field => {
    if (isExtensionField(field)) {
        const type = getScreenFieldTypeByName(field.extensionName);
        if (type) {
            field.type = type;
        } else { // Assign local extension type (using a local version of the field type that will be replaced when the real one is retrieved from the server
            field.type = getLocalExtensionFieldType(field.extensionName);
        }

        // Mutate param ferovs
        const inputs = [];
        for (const param of field.inputParameters) {
            inputs.push(mutateFEROV(param, 'value', {
                valueProperty: 'value',
                dataTypeProperty: 'valueDataType',
            }));
        }

        field.inputParameters = inputs;
    } else {
        field.type = getScreenFieldType(field);
    }

    if (field.hasOwnProperty('defaultValue')) {
        field = mutateFEROV(field, 'defaultValue', {
            valueProperty: 'defaultValue',
            dataTypeProperty: 'defaultValueDataType',
        });
    }

    // Convert scale property to string, which is needed for validation purposes.
    // Saving it as a string allows it be hydrated.
    if (field.scale != null && typeof field.scale === 'number') {
        field.scale = field.scale.toString();
    }

    return field;
};

export const demutateScreenField = field => {
    delete field.type;
    delete field.isNewMode;

    // Convert scale back to number. MD expects this to be a number, but within FlowBuilder, we want it to be a string.
    if (field.scale != null && typeof field.scale === 'string') {
        field.scale = Number(field.scale);
    }

    if (field.hasOwnProperty('defaultValue')) {
        field = deMutateFEROV(field, 'defaultValue', {
            valueProperty: 'defaultValue',
            dataTypeProperty: 'defaultValueDataType',
        });
    }

    if (isExtensionField(field)) {
        // Mutate param ferovs
        const inputs = [];
        for (const param of field.inputParameters) {
            inputs.push(deMutateFEROV(param, 'value', {
                valueProperty: 'value',
                dataTypeProperty: 'valueDataType',
            }));
        }

        field.inputParameters = inputs;
    }

    return field;
};

export const mutateScreen = screen => {
    const fields = [];
    if (screen.fields) {
        for (const field of screen.fields) {
            fields.push(mutateScreenField(field));
        }
    }

    screen.fields = fields;

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
    const fields = [];
    if (screen.fields) {
        for (const field of screen.fields) {
            fields.push(demutateScreenField(field));
        }
    }

    screen.fields = fields;

    delete screen.getFieldByGUID;
    delete screen.getFieldIndexByGUID;
    delete screen.getFieldIndex;
    return screen;
};

