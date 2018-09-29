import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { baseResource, baseElementsArrayToMap } from "./base/baseElement";
import { baseResourceMetadataObject } from "./base/baseMetadata";
import { createFEROV, createFEROVMetadataObject } from './ferov';

const elementType = ELEMENT_TYPE.VARIABLE;
const DEFAULT_VALUE_PROPERTY = 'defaultValue';
export const FEROV_DATA_TYPE_PROPERTY = 'ferovDataType';

/**
 * Either creates a new variable or create a new copy of existing variable
 * @param {Object} variable existing variable which needs to be copied
 * @return {Object} newVariable new variable which is created
 */
export function createVariable(variable = {}) {
    const newVariable = baseResource(variable);
    const { dataType = null, isCollection = false, isInput = false, isOutput = false, objectType = null, scale = 2, value} = variable;
    let valueFerov;
    if (value) {
        valueFerov = createFEROV(value, DEFAULT_VALUE_PROPERTY, FEROV_DATA_TYPE_PROPERTY);
    }
    const { defaultValue = null, ferovDataType = null } = valueFerov || variable;
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
    const { isCollection = false, isInput = false, isOutput = false, scale, dataType, objectType } = variable;
    let valueFerovObject;
    const valueFerov = createFEROVMetadataObject(
        variable,
        DEFAULT_VALUE_PROPERTY,
        FEROV_DATA_TYPE_PROPERTY
    );
    if (valueFerov) {
        valueFerovObject = { value : valueFerov };
    }
    Object.assign(newVariable, {
        dataType,
        isCollection,
        isInput,
        isOutput,
        objectType,
        scale,
    }, valueFerovObject);
    return newVariable;
}
