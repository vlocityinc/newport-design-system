import { createFEROV, createFEROVMetadataObject } from './ferov';

export const valuePropertyName = 'value';
export const valueDataTypePropertyName = 'valueDataType';

export function createInputParameter(inputParameter = {}) {
    const { name, value } = inputParameter;

    let valueFerov;
    if (value) {
        if (value.hasOwnProperty(valueDataTypePropertyName)) {
            valueFerov = value;
        } else {
            valueFerov = createFEROV(value, valuePropertyName, valueDataTypePropertyName);
        }
    }

    return Object.assign({}, {name}, valueFerov);
}

export function createInputParameterMetadataObject(inputParameter) {
    if (!inputParameter) {
        throw new Error('inputParameter is not defined');
    }

    const { name, value } = inputParameter;

    let valueFerov;
    if (value) {
        valueFerov = createFEROVMetadataObject(inputParameter, valuePropertyName, valueDataTypePropertyName);
    }

    return Object.assign({}, {name}, valueFerov);
}