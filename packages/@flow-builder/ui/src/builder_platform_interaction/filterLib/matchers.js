import {
    escapeForRegExp,
    isObject
} from 'builder_platform_interaction/commonUtils';

const validateMatcherArgs = (obj, key) => {
    if (!isObject(obj)) {
        throw new TypeError('matcher obj must be defined and non-null');
    }

    // Objects can technically have undefined, null, or empty string keys but it
    // seems like a coding error if that happens.
    if (typeof key !== 'string' || key.length === 0) {
        throw new TypeError('matcher key must be a non-empty string');
    }
};

const validateStringMatcherArgs = (obj, key, pattern) => {
    validateMatcherArgs(obj, key);
    if (typeof pattern !== 'string' || pattern.length === 0) {
        throw new TypeError(
            'string matcher pattern must be a non-empty pattern string'
        );
    }
};

/**
 * Returns true when obj[key] contains the given pattern. The comparison is
 * case-insensitive.
 *
 * @param {Object}
 *            obj the object to use for the matching
 * @param {String}
 *            key the object field to use for the comparison
 * @param {String}
 *            pattern the string to look for in obj[key]
 * @returns {Boolean} true when obj[key] contains the given pattern
 */
export const containsMatcher = (obj, key, pattern) => {
    validateStringMatcherArgs(obj, key, pattern);
    const regex = new RegExp(escapeForRegExp(pattern), 'i');
    return regex.test(obj[key]);
};

/**
 * Returns true when obj[key] starts with the given pattern. The comparison is
 * case-insensitive.
 *
 * @param {Object}
 *            obj the object to use for the matching
 * @param {String}
 *            key the object field to use for the comparison
 * @param {String}
 *            pattern the string to look for in obj[key]
 * @returns {Boolean} true when obj[key] starts with the given pattern
 */
export const startsWithMatcher = (obj, key, pattern) => {
    validateStringMatcherArgs(obj, key, pattern);
    const regex = new RegExp('^' + escapeForRegExp(pattern), 'i');
    return regex.test(obj[key]);
};

/**
 * Returns true when obj[key] equals the given value.
 *
 * @param {Object}
 *            obj the object to use for the comparison
 * @param {String}
 *            key the object field to use for the comparison
 * @param {String}
 *            value the expected value for obj[key]
 * @returns {Boolean} true when obj[key] equals the given value
 */
export const equalsMatcher = (obj, key, value) => {
    validateMatcherArgs(obj, key);
    return obj[key] === value;
};

/**
 * Returns true when obj[key] does not equal the given value.
 *
 * @param {Object}
 *            obj the object to use for the comparison
 * @param {String}
 *            key the object field to use for the comparison
 * @param {String}
 *            value the expected value for obj[key]
 * @returns {Boolean} true when obj[key] does not equal the given value
 */
export const notEqualsMatcher = (obj, key, value) => {
    validateMatcherArgs(obj, key);
    return obj[key] !== value;
};

/**
 * Returns true when obj[key] equals the given boolean value.
 *
 * @param {Object}
 *            obj the object to use for the comparison
 * @param {String}
 *            key the object field to use for the comparison
 * @param {String}
 *            value the expected boolean value for obj[key]
 * @returns {Boolean} true when obj[key] equals the given boolean value
 */
export const booleanMatcher = (obj, key, value) => {
    validateMatcherArgs(obj, key);
    if (typeof value !== 'boolean') {
        throw new TypeError('booleanMatcher value must be a boolean');
    }
    return value ? !!obj[key] : !obj[key];
};
