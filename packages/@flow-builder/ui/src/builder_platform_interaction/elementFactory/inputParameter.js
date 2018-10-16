import { createFEROV, createFEROVMetadataObject, getDataTypeKey } from './ferov';
import { createParameterListRowItem } from './base/baseList';

export const VALUE_PROPERTY_NAME = 'value';
export const VALUE_DATA_TYPE_PROPERTY_NAME = getDataTypeKey(VALUE_PROPERTY_NAME);

export function createInputParameter(inputParameter = {}) {
    const { rowIndex, name, value, valueDataType } = inputParameter;

    let valueFerov;
    if (!valueDataType) {
        valueFerov = createFEROV(value, VALUE_PROPERTY_NAME, VALUE_DATA_TYPE_PROPERTY_NAME);
    }
    const newInputParameter = Object.assign({
        rowIndex,
        name,
        value,
        valueDataType
    }, valueFerov);
    return createParameterListRowItem(newInputParameter);
}

export function createInputParameterMetadataObject(inputParameter) {
    if (!inputParameter) {
        throw new Error('inputParameter is not defined');
    }

    const { name, value } = inputParameter;

    let valueFerov;
    if (value) {
        const ferov = createFEROVMetadataObject(inputParameter, VALUE_PROPERTY_NAME, VALUE_DATA_TYPE_PROPERTY_NAME);
        valueFerov = { value: ferov };
    }

    return Object.assign({}, {name}, valueFerov);
}