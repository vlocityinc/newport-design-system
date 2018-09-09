import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { baseResource, baseElementsArrayToMap } from './base/base-element';
import { baseResourceMetadataObject } from './base/base-metadata';
import { createFEROV, createFEROVMetadataObject } from './ferov';

const elementType = ELEMENT_TYPE.VARIABLE;
const DEFAULT_VALUE_PROPERTY = 'defaultValue';
const FEROV_DATA_TYPE_PROPERTY = 'ferovDataType';

export function createVariable(variable = {}) {
    const newVariable = baseResource(variable);
    const { dataType = null, isCollection = false, isInput = false, isOutput = false, objectType = null, scale = 0, value} = variable;
    let valueFerov;
    if (value) {
        valueFerov = createFEROV(value, DEFAULT_VALUE_PROPERTY, FEROV_DATA_TYPE_PROPERTY);
    }
    const { defaultValue = null, ferovDataType = null, defaultValueGuid = null } = valueFerov || variable;
    Object.assign(newVariable, {
        elementType,
        isCollection,
        isInput,
        isOutput,
        dataType,
        objectType,
        scale,
        defaultValue,
        ferovDataType,
        defaultValueGuid
    });
    return newVariable;
}

export function createVariableForStore(variable = {}) {
    const newVariable = createVariable(variable);

    return baseElementsArrayToMap([newVariable]);
}

export function createVariableMetadataObject(variable) {
    if (!variable) {
        throw new Error('variable is not defined');
    }
    const newVariable = baseResourceMetadataObject(variable);
    const { isCollection = false, isInput = false, isOutput = false, scale = 0, dataType, objectType } = variable;
    const valueFerov = createFEROVMetadataObject(
        variable,
        DEFAULT_VALUE_PROPERTY,
        FEROV_DATA_TYPE_PROPERTY
    );
    Object.assign(newVariable, {
        dataType,
        isCollection,
        isInput,
        isOutput,
        objectType,
        scale,
        value: valueFerov
    });
    return newVariable;
}
