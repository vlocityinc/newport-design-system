import { createParameterListRowItem } from './base/baseList';

export function createOutputParameter(outputParameter = {}) {
    const { name, assignToReference, value, valueDataType } = outputParameter;

    let valueFerov;
    if (!valueDataType) {
        valueFerov = Object.assign({}, {
            name,
            value: assignToReference,
            valueDataType: 'reference'
        });
    }
    const newOutputParameter = Object.assign({
        name,
        value,
        valueDataType
    },
    valueFerov);
    return createParameterListRowItem(newOutputParameter);
}

export function createOutputParameterMetadataObject(outputParameter) {
    if (!outputParameter) {
        throw new Error('outputParameter is not defined');
    }

    const { name, value } = outputParameter;

    return Object.assign({}, {
        name,
        assignToReference: value
    });
}