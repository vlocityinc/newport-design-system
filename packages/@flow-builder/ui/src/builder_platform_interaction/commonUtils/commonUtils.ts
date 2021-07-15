/**
 * Checks whether the passed parameter is specifically undefined or null and not an empty string.
 *
 * @param {string} value The string to check
 * @returns {boolean} Whether value is undefined or null
 */
export const isUndefinedOrNull = (value: any): value is undefined | null => {
    return value == null;
};

/**
 * Returns true if the input value is undefined.
 *
 * @param {Object} value input
 * @returns {boolean} true if undefined otherwise false.
 */
export const isUndefined = (value: any): value is undefined => {
    return value === undefined;
};

/**
 * Determines if item is an object
 *
 * @param {*} item The item in question of being an object
 * @returns {boolean} Whether item is an object or not
 */
export const isObject = (item: any) => {
    return typeof item === 'object' && !Array.isArray(item) && !isUndefinedOrNull(item);
};

/*
 * Append curly braces and bang to the value.
 * @param {string}      value input
 * @return {string}     returns value surrounded by curly braces and bang
 */
export const addCurlyBraces = (value: string) => {
    return '{!' + value + '}';
};

/**
 * Splits a string by period. If no period, returns the string
 *
 * @param value The string to split
 * @param separator The separator string to split the value. Defaults to period.
 * @returns The string split by given separator
 */
export const splitStringBySeparator = (value: string, separator = '.') => {
    return value.split(separator);
};

/**
 * Remove curly braces and bang from the value if it exists.
 *
 * @param value to remove the curly braces
 * @returns string without curly braces and bang
 */
export const removeCurlyBraces = (value: string) => {
    if (isReference(value)) {
        return value.substring(2, value.length - 1);
    }
    return value;
};

/**
 * Validates the value is a number with optional decimal.
 *
 * @param {string} value input number string
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
 *
 * @param value - the value to be converted in to a valid dev name
 * @returns The sanitized, dev name safe version of the value passed in
 */
export const sanitizeDevName = (value: string) => {
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
 *
 * @param value the string to escape
 * @returns a RegExp escaped string
 */
export const escapeForRegExp = (value: string) => {
    if (typeof value !== 'string') {
        throw new TypeError('value must be a string');
    }

    // $& means the whole matched string
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const REFERENCE_REGEX = /^\{![^}]+\}$/;

/**
 * Checks to see if the specified value is a reference, such as {!myVar}
 *
 * @param value to check.
 * @returns if value is a reference.
 */
export function isReference(value: string): boolean {
    // matches references e.g {!var} or {!Flow.CurrentRecord}
    // doesn't match templates that start and end with curly braces e.g. {!Flow.CurrentRecord}{!Flow.CurrentRecord}
    return typeof value === 'string' && REFERENCE_REGEX.test(value);
}

/**
 * Checks if a property is set on a given object, and returns it's value if so; else, return true by default
 *
 * @param object
 * @param propertyName
 */
export function getPropertyOrDefaultToTrue(object: Object, propertyName: string) {
    return object.hasOwnProperty(propertyName) && object[propertyName] !== undefined ? object[propertyName] : true;
}

export const APP_EXCHANGE_LINK = 'https://appexchange.salesforce.com/appxStore?type=Flow';

/**
 * Simple memoizer, which holds on to a most recent successful invocation and its result.
 *
 * @param func The function to memoize.
 */
export function memoize(func: Function) {
    if (!(typeof func === 'function')) {
        throw new Error('Not a function');
    }

    let everInvoked = false;
    let lastArguments;
    let lastResult;
    return function () {
        // Invoke the memoized function, but only if never invoked or if the arguments are different.
        if (everInvoked === false || !equalArguments(lastArguments, arguments)) {
            lastResult = func.apply(null, arguments);
            lastArguments = arguments;
            everInvoked = true;
        }
        return lastResult;
    };
}

/**
 * Basicaly converts possible string boolean values into real booleans
 *
 * @param rawValue - dirty value about to be sanitized could be false, true or "false", "true"
 * @returns corresponding "pure" boolean value (eg: 'false' => false)
 */
export const sanitizeBoolean = (rawValue?: string | boolean) => {
    return rawValue ? rawValue !== 'false' : false;
};

/**
 * Compares two arrays for equality. For the two arrays to be equal they should either be
 * the same arrays or they should contain exact same elements and in the same order.
 *
 * @param left One array to compare.
 * @param right Another array to compare.
 * @returns 'true' if the arrays are equal. Otherwise - 'false'.
 */
function equalArguments(left: IArguments, right: IArguments) {
    if (left === null || left === undefined || left.length !== right.length) {
        return false;
    }

    for (let i = 0; i < right.length; i++) {
        if (left[i] !== right[i]) {
            return false;
        }
    }

    return true;
}

/**
 * @param obj
 * @param prop
 */
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}

/**
 * User defined names cannot have _ at the beginning of the string.
 * To be used in cases where need to define a name for the elements, but don't want to conflict with any user defined name.
 *
 * @param name non-internalized name
 * @returns internal name
 */
export function generateInternalName(name: string): string {
    return '_' + name;
}
