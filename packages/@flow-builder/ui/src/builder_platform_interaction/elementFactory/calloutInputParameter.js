import { createFEROV, createFEROVMetadataObject } from './ferov';
import { createParameterListRowItem } from './base/baseList';
import { valuePropertyName, valueDataTypePropertyName } from './inputParameter';

export function createCalloutInputParameter(inputParameter = {}) {
    const {name, value} = inputParameter;
    let newInputParameter;
    if (!inputParameter.hasOwnProperty(valueDataTypePropertyName)) {
        newInputParameter = Object.assign({}, {name}, createFEROV(value, valuePropertyName, valueDataTypePropertyName));
    } else {
        newInputParameter = Object.assign({}, inputParameter);
    }
    newInputParameter = createParameterListRowItem(newInputParameter);
    return newInputParameter;
}

export function createCalloutInputParameterMetadataObject(inputParameter) {
    if (!inputParameter) {
        throw new Error('inputParameter is not defined');
    }

    const { name, value } = inputParameter;

    let valueFerov;
    if (value) {
        valueFerov = createFEROVMetadataObject(inputParameter, valuePropertyName, valueDataTypePropertyName);
    }

    return {name, value: valueFerov};
}