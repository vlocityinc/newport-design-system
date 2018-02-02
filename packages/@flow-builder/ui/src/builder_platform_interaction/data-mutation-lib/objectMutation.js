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
