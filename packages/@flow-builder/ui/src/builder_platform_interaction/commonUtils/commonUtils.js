/**
 * Checks whether the passed parameter is specifically undefined or null and not an empty string.
 * @param {String} value The string to check
 * @returns {Boolean} Whether value is undefined or null
 */
export const isUndefinedOrNull = (value) => {
    return (value === undefined || value === null);
};

/**
 * Returns true if the input value is undefined.
 * @param {Object} value input
 * @return {boolean} true if undefined otherwise false.
 */
export const isUndefined = (value) => {
    return value === undefined;
};

/**
 * Determines if item is an object
 * @param {*} item The item in question of being an object
 * @returns {Boolean} Whether item is an object or not
 */
export const isObject = (item) => {
    return (typeof item === 'object' && !Array.isArray(item) && !isUndefinedOrNull(item));
};

/*
 * Append curly braces and bang to the value.
 * @param {string}      value input
 * @return {string}     returns value surrounded by curly braces and bang
 */
export const addCurlyBraces = (value) => {
    return '{!' + value + '}';
};

/**
 * Splits a string by period. If no period, returns the string
 * @param {*} value The string to split
 * @param {String} separator The separator string to split the value. Defaults to period.
 * @returns {Array} The string split by period
 */
export const splitStringBySeparator = (value, separator = '.') => {
    return value.split(separator);
};

/**
 * Remove curly braces and bang from the value if it exists.
 * @param {string}      value to remove the curly braces
 * @return {string}     string without curly braces and bang
 */
export const removeCurlyBraces = (value) =>  {
    if (isReference(value)) {
        return value.substring(2, value.length - 1);
    }
    return value;
};

/**
 * Formats an arbitrary number of arguments into a string by replacing {0}, {1}, ... {n} with the corresponding argument supplied after 'formatString'.
 *
 * @param {String} formatString The string to be formatted.
 * @param {String} args The list of arguments to splice into formatString.
 * @returns {String} a formatted String
 * @export
 */
export const format = (formatString, ...args) => {
    return formatString.replace(/\{(\d+)\}/gm, (match, index) => {
        const substitution = args[index];
        if (substitution === undefined) {
            return match;
        }
        return substitution + '';
    });
};

/**
 * Validates the value is a number with optional decimal.
 *
 * @param {String} value input number string
 * @returns {*} false if not a number else regex result array
 */
export const isValidNumber = (value) => {
    return value ? !isNaN(value) : false;
};

/**
 * Sanitize a string so it is a valid dev name
 * This includes:
 * Prepending an 'X' if it begins with a number
 * Stripping off preceding and trailing invalid characters
 * Replacing any number of concurrent invalid characters with a single underscore
 * Limiting to 80 characters
 * Where invalid characters are anything non-alphanumeric
 * @param {String} value - the value to be converted in to a valid dev name
 * @returns {String} The sanitized, dev name safe version of the value passed in
 */
export const sanitizeDevName = (value) => {
    value = value.replace(/[\W_]+/g, '_');
    value = value.replace(/_+$/, '');
    value = value.replace(/^_+/, '');

    if (value.match(/^\d/)) {
        value = 'X' + value;
    }

    value = value.substr(0, 80);

    return value;
};

/**
 * Escapes a string for use in a RegExp. The source was taken from:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 * @param {String} value the string to escape
 * @return {String} a RegExp escaped string
 */
export const escapeForRegExp = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError('value must be a string');
    }

    // $& means the whole matched string
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Checks to see if the specified value is a reference, such as {!myVar}
 * @param {string} value to check.
 * @return {boolean} if value is a reference.
 */
export function isReference(value) {
    return typeof value === 'string' && value.startsWith('{!') && value.endsWith('}');
}