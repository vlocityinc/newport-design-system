import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { baseResource, baseElementsArrayToMap } from "./base/baseElement";
import { baseResourceMetadataObject } from "./base/baseMetadata";
import { createFEROV, createFEROVMetadataObject } from './ferov';
import { DEFAULT_VALUE_PROPERTY, DEFAULT_VALUE_DATA_TYPE_PROPERTY } from './variable';

const elementType = ELEMENT_TYPE.CONSTANT;

/**
 * Either creates a new constant or create a new copy of existing constant
 * @param {Object} constant existing constant which needs to be copied
 * @return {Object} newConstant new constant which is created
 */
export function createConstant(constant = {}) {
    const newConstant = baseResource(constant);
    const { dataType = null, value } = constant;
    let valueFerov;
    if (value) {
        valueFerov = createFEROV(value, DEFAULT_VALUE_PROPERTY, DEFAULT_VALUE_DATA_TYPE_PROPERTY);
    }
    const { defaultValue = null, defaultValueDataType = null } = valueFerov || constant;
    Object.assign(newConstant, {
        elementType,
        dataType,
        defaultValue,
        defaultValueDataType
    });
    return newConstant;
}

/**
 * Create a new copy of existing constant in shape as expected by store.
 * @param {Object} constant existing constant which needs to be copied
 * @return {Object} Map containing guid as key and new constant as value
 */
export function createConstantForStore(constant) {
    if (!constant) {
        throw new Error('constant is not defined');
    }
    const newConstant = createConstant(constant);
    return baseElementsArrayToMap([newConstant]);
}

/**
 * Create a new copy of existing constant in shape as expected by flow metadata.
 * @param {Object} constant existing constant which needs to be copied
 * @return {Object} newConstant new constant which is created
 */
export function createConstantMetadataObject(constant) {
    if (!constant) {
        throw new Error('constant is not defined');
    }
    const newConstant = baseResourceMetadataObject(constant);
    const { dataType } = constant;
    let valueFerovObject;
    const valueFerov = createFEROVMetadataObject(
        constant,
        DEFAULT_VALUE_PROPERTY,
        DEFAULT_VALUE_DATA_TYPE_PROPERTY
    );
    if (valueFerov) {
        valueFerovObject = { value : valueFerov };
    }

    Object.assign(newConstant, {
        dataType
    }, valueFerovObject);
    return newConstant;
}
