import { GLOBAL_CONSTANT_OBJECTS, GLOBAL_CONSTANT_PREFIX } from './global-constants';

/**
 * Checks if the id passed in might point to a non-element resource such as
 * Global Constants, Global Variables, or System Variables
 *
 * @param {String} id             id to check
 * @returns {Boolean}    true if the id might point to a non-element resource, false otherwise
 */
export const isNonElementResourceId = (id) => {
    // TODO system & global variables will be handled here W-5067879
    return id && id.startsWith(GLOBAL_CONSTANT_PREFIX);
};

/**
 * Returns Global Constant, Global Variable, or System Variable referenced by id
 *
 * @param {String} id           points to a global constant
 * @returns {Object|undefined}  if the id was valid, the object it references will be returned, otherwise undefined
 */
export const getNonElementResource = (id) => {
    // TODO system & global variables will be handled here W-5067879
    return GLOBAL_CONSTANT_OBJECTS[id];
};

export { GLOBAL_CONSTANT_PREFIX, GLOBAL_CONSTANTS, GLOBAL_CONSTANT_OBJECTS } from './global-constants';