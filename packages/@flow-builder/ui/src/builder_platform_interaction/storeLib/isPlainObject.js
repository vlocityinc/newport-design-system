/**
 * Validates if object is valid or not
 * @param {Object} obj object to be validated
 * @returns {Boolean} true if obj is valid, else false
 */
export function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    let prototype = obj;
    while (Object.getPrototypeOf(prototype) !== null) {
        prototype = Object.getPrototypeOf(prototype);
    }

    return Object.getPrototypeOf(obj) === prototype;
}
