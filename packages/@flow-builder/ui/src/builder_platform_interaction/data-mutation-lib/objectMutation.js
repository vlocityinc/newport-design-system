/**
 * Helper method that set function will call.
 * Recursively traverses an object based on the given path
 * and uses Object.assign to update the property at the end of the path with
 * the given value
 * @param {Object}      obj   current object being ispected
 * @param {Array}       path  current path
 * @param {Object}      value value that will be set once end of path is reached
 * @returns {Object}          the new object with the updated value
 */
const setValue = (obj, path, value) => {
    if (path.length === 0) {
        // base case:
        // we do not have a path just return a clone of the object
        return Object.assign({}, obj);
    } else if (path.length === 1) {
        // base case:
        // we have reached the last key so we can now set the value to the desired key object pair
        const key = path[0];
        // make a new object with an updated property
        return Object.assign({}, obj, { [key] : value });
    }
    // recursively call the set function and assign the results to our current object
    const key = path[0];
    return Object.assign({}, obj, { [key] : setValue(obj[key], path.slice(1), value) });
};

/**
 * Create a new object with updated properties
 * It can be used for creating a new object by calling the function without any argument.
 * @param {Object} obj existing object
 * @param {Object} props properties to be updated
 * @return {Object} new object with updated properties
 */
export function updateProperties(obj = {}, props = {}) {
    return Object.assign({}, obj, props);
}

/**
 * Helper function that takes in a string path and converts to
 * an array of keys
 * NOTE: This assumes that you DO NOT have keys with notation keyName[digit]
 * Instead any array bracket notation is assumed to be accessing an index in the
 * value at the key position. So a string path with items[0].value would
 * be converted into a path of ['items', '0', 'value' ]
 * @param {String} string the string path we will convert to an array path
 * @returns {Array}     array of keys that represent a path in an object
 */
export const stringToPath = (string) => {
    if (Array.isArray(string)) {
        // if we get an array we assume it is already a correct path
        return string;
    } else if (typeof string !== 'string') {
        // if we get a non string path we just return an empty path array
        return [];
    }

    // regex that matches string paths with [digit]. and [digit] pattern in them
    const regex = /(\[)(\d)(\])(\.{0,1})/gi;
    // replace all matching patterns with dot notation
    const newString = string.replace(regex, (match, leftBracket, digit, rightBracket, rightPeriod) => {
        return rightPeriod ? '.' + digit + '.' : '.' + digit;
    });
    // convert string path to array of keys
    return newString.split('.');
};

/**
 * Set the value of the object at the given path
 * Does not mutate the given object
 * This util is meant to be used by a function that needs to
 * update a complex nested object in an immuatable way.
 * If you just want to update a javascript object please
 * use dot notation, that works much better.
 * @param {Object}          obj   the object given
 * @param {Array/String}    path  the path to the part of the object you want to update. Can be '.' period separated string path
 * @param {Object}          value the value to be set at the path
 * @returns {Object}              the new object with the updated vaue
 */
export const set = (obj = {}, path = [], value = undefined) => {
    const keys = stringToPath(path);
    const retObj = setValue(obj, keys, value);
    return retObj;
};

/**
 * Create a new object with only allowed props.
 * It makes shallow copy of the properties.
 * If there are no allowed properties, then empty object will be returned
 * @param {Object} obj existing object
 * @param {Array} allowedProps properties which are allowed in new object
 * @return {Object} new object with only allowed properties
 */
export function pick(obj = {}, allowedProps = []) {
    const filterKeysRule = (key) => obj.hasOwnProperty(key);
    return allowedProps.filter(filterKeysRule).reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
}

/**
 * Create a new object with all the properties except omit one. It is opposite of pick function.
 * It makes shallow copy of the properties.
 * If there are no omitted properties, then new object with all the properties will be returned
 * @param {Object} obj existing object
 * @param {Array} omitProps array of omitted properties
 * @return {Object} new object without omitted properties
 */
export function omit(obj = {}, omitProps = []) {
    const filterKeysRule = (key) => omitProps.indexOf(key) === -1;
    return Object.keys(obj).filter(filterKeysRule).reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
}
