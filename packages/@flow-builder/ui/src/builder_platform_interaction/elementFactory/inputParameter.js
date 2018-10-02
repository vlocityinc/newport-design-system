import { createFEROV, createFEROVMetadataObject } from './ferov';
import { createParameterListRowItem } from './base/baseList';

export const valuePropertyName = 'value';
export const valueDataTypePropertyName = 'valueDataType';

export function createInputParameter(inputParameter = {}) {
    const { name, value, valueDataType} = inputParameter;

    let valueFerov;
    if (!valueDataType) {
        valueFerov = createFEROV(value, valuePropertyName, valueDataTypePropertyName);
    }
    const newInputParameter = Object.assign({
            name,
            value,
            valueDataType
        },
        valueFerov);
    return createParameterListRowItem(newInputParameter);
}

export function createInputParameterMetadataObject(inputParameter) {
    if (!inputParameter) {
        throw new Error('inputParameter is not defined');
    }

    const { name, value } = inputParameter;

    let valueFerov;
    if (value) {
        const ferov = createFEROVMetadataObject(inputParameter, valuePropertyName, valueDataTypePropertyName);
        valueFerov = { value: ferov };
    }

    return Object.assign({}, {name}, valueFerov);
}