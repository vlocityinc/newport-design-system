/**
 * Function for making deep copy of an object
 * @param {Object} obj object to be copied
 * @returns {Object} new copied object
 * @private
 */
export function deepCopy(obj) {
    // TODO: check for performance issue. If there are any performance issue, then update this method.
    return JSON.parse(JSON.stringify(obj));
}
