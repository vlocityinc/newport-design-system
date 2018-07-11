import { GLOBAL_CONSTANTS } from './global-constants';

/**
 * Checks if the id passed in might point to a non-element resource such as
 * Global Constants, Global Variables, or System Variables
 *
 * @param {String} id             id to check
 * @returns {Boolean}    true if the id might point to a non-element resource, false otherwise
 */
export const isNonElementResourceId = (id) => {
    return id && id.startsWith('$');
};

/**
 * Returns Global Constant referenced by id
 *
 * @param {String} id           points to a global constant
 * @returns {Object|undefined}  if the id was valid, the object it references will be returned, otherwise undefined
 */
export const getNonElementResource = (id) => {
    if (!isNonElementResourceId(id)) {
        throw new Error(`id didn't follow the rules for non-element resource labels, was ${id}`);
    }
    // TODO system & global variables will also be handled here W-5067879
    return GLOBAL_CONSTANTS[id];
};

export { GLOBAL_CONSTANTS } from './global-constants';