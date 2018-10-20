import { GLOBAL_CONSTANT_OBJECTS, GLOBAL_CONSTANT_PREFIX } from "./globalConstants";
import { removeCurlyBraces } from "builder_platform_interaction/commonUtils";

/**
 * Checks if the id passed in might point to a non-element resource such as
 * Global Constants, Global Variables, or System Variables
 *
 * @param {String} id             id to check
 * @returns {Boolean}    true if the id might point to a non-element resource, false otherwise
 */
export const isNonElementResourceId = (id) => {
    if (!id) {
        return false;
    }
    const prefix = removeCurlyBraces(id).split('.')[0];
    return [GLOBAL_CONSTANT_PREFIX].indexOf(prefix) >= 0;
};

/**
 * Returns Global Constant, Global Variable, or System Variable referenced by id
 *
 * @param {String} id           points to a global constant
 * @returns {Object|undefined}  if the id was valid, the object it references will be returned, otherwise undefined
 */
export const getNonElementResource = (id) => {
    // TODO system & global variables will be handled here W-5067879
    return GLOBAL_CONSTANT_OBJECTS[removeCurlyBraces(id)];
};

export { GLOBAL_CONSTANT_PREFIX, GLOBAL_CONSTANTS, GLOBAL_CONSTANT_OBJECTS } from "./globalConstants";
export { setSystemVariables, getSystemVariables } from './systemVariables';
export { setGlobalVariables, getGlobalVariableTypes, getGlobalVariables } from './globalVariables';