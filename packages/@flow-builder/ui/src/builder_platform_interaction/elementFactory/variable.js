import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { baseResource, baseElementsArrayToMap } from "./base/baseElement";
import { baseResourceMetadataObject } from "./base/baseMetadata";
import { createFEROV, createFEROVMetadataObject, getDataTypeKey } from './ferov';

const elementType = ELEMENT_TYPE.VARIABLE;
export const DEFAULT_VALUE_PROPERTY = 'defaultValue';
export const DEFAULT_VALUE_DATA_TYPE_PROPERTY = getDataTypeKey(DEFAULT_VALUE_PROPERTY);

const subtypeProperties = {
    [FLOW_DATA_TYPE.APEX.value]: 'apexClass',
    [FLOW_DATA_TYPE.SOBJECT.value]: 'objectType',
};

/**
 * Either creates a new variable or create a new copy of existing variable
 * @param {Object} variable existing variable which needs to be copied
 * @return {Object} newVariable new variable which is created
 */
export function createVariable(variable = {}) {
    const newVariable = baseResource(variable);
    const { dataType = null, isCollection = false, isInput = false, isOutput = false, objectType = null, apexClass = null, subtype = null, scale = 2, value} = variable;
    let valueFerov;
    if (value) {
        valueFerov = createFEROV(value, DEFAULT_VALUE_PROPERTY, DEFAULT_VALUE_DATA_TYPE_PROPERTY);
    }
    const { defaultValue = null, defaultValueDataType = null } = valueFerov || variable;
    Object.assign(newVariable, {
        elementType,
        isCollection,
        isInput,
        isOutput,
        dataType,
        subtype: objectType || apexClass || subtype,
        scale,
        defaultValue,
        defaultValueDataType,
    });
    return newVariable;
}

/**
 * Create a new copy of existing variable in shape as expected by store.
 * @param {Object} variable existing variable which needs to be copied
 * @return {Object} Map containing guid as key and new variable as value
 */
export function createVariableForStore(variable) {
    if (!variable) {
        throw new Error('variable is not defined');
    }
    const newVariable = createVariable(variable);
    return baseElementsArrayToMap([newVariable]);
}

/**
 * Create a new copy of existing variable in shape as expected by flow metadata.
 * @param {Object} variable existing variable which needs to be copied
 * @return {Object} newVariable new variable which is created
 */
export function createVariableMetadataObject(variable) {
    if (!variable) {
        throw new Error('variable is not defined');
    }
    const newVariable = baseResourceMetadataObject(variable);
    const { isCollection = false, isInput = false, isOutput = false, scale, dataType, subtype } = variable;
    let valueFerovObject;
    const valueFerov = createFEROVMetadataObject(
        variable,
        DEFAULT_VALUE_PROPERTY,
        DEFAULT_VALUE_DATA_TYPE_PROPERTY
    );
    if (valueFerov) {
        valueFerovObject = { value : valueFerov };
    }
    if (subtype) {
        newVariable[subtypeProperties[dataType]] = subtype;
    }
    Object.assign(newVariable, {
        dataType,
        isCollection,
        isInput,
        isOutput,
        scale,
    }, valueFerovObject);
    return newVariable;
}
