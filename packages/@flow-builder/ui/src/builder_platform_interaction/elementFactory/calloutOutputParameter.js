import { createParameterListRowItem } from './base/baseList';

export function createCalloutOutputParameter(outputParameter = {}) {
    let newOutputParameter;
    if (outputParameter.hasOwnProperty('assignToReference')) {
        const { name, assignToReference } = outputParameter;
        newOutputParameter = Object.assign({}, { name, value: assignToReference, valueDataType: 'reference' });
    } else {
        newOutputParameter = Object.assign({}, outputParameter);
    }
    newOutputParameter = createParameterListRowItem(newOutputParameter);
    return newOutputParameter;
}

export function createCalloutOutputParameterMetadataObject(outputParameter) {
    if (!outputParameter) {
        throw new Error('outputParameter is not defined');
    }
    return {name: outputParameter.name, assignToReference: outputParameter.value};
}