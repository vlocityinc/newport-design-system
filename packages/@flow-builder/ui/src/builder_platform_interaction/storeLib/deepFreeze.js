/**
 * Freeze an object and recursively freeze each property.
 * Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 *
 * deepFreeze is not performance efficient and we would remove its usage before the release. W-4916277
 *
 * NOTE: THIS FUNCTION IS MEANT TO USE ONLY IN STORE. DO NOT USE IT ANYWHERE ELSE.
 *
 * @param {Object} obj to freeze
 * @returns {Object} returns the frozen object
 */
export function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).map(prop => {
        // Freeze prop if it is an object and is not already frozen
        if (
            obj[prop] !== null &&
            typeof obj[prop] === 'object' &&
            !Object.isFrozen(obj)
        ) {
            return deepFreeze(obj[prop]);
        }
        return prop;
    });
    return Object.freeze(obj);
}
