/**
 * Checks whether the passed parameter is specifically undefined or null and not an empty string.
 * @param {String} value The string to check
 * @returns {Boolean} Whether value is undefined or null
 */
export const isUndefinedOrNull = (value) => {
    return (value === undefined || value === null);
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
 * Remove curly braces and bang from the value if it exists.
 * @param {string}      value to remove the curly braces
 * @return {string}     string without curly braces and bang
 */
export const removeCurlyBraces = (value) =>  {
    if (value && value.startsWith('{!') && value.endsWith('}')) {
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
 * Searches fields within the given object to see if there are any matches with the given filter
 * pattern. A filter result is returned which contains a visible flag.
 *
 * Sample input object:
 * <pre><code>
 * {
 *     name: 'Somefoothing'
 * }
 *
 * Sample input filter:
 * <pre><code>
 * {
 *     pattern: 'foo',
 *     fields: [ 'name' ]
 * }
 * </code></pre>
 *
 * Sample filter result using the input given above:
 * <pre><code>
 * {
 *     visible: true
 * }
 * </pre></code>
 *
 * @param {Object} obj the object to search for matches in
 * @param {Object} filter specifies the filter pattern and list of object fields to search
 * @returns {Object} the filter result
 */
export const applyFilter = (obj, filter)  => {
    if (isUndefinedOrNull(filter)) {
        return {
            visible: true
        };
    }

    if (!isObject(obj)) {
        throw new TypeError('obj must be defined and non-null');
    }

    if (!isObject(filter)) {
        throw new TypeError('filter must be an object');
    }

    if (typeof filter.pattern !== 'string' || filter.pattern.length === 0) {
        throw new TypeError('filter must have a non-empty pattern string');
    }

    if (!Array.isArray(filter.fields) || filter.fields.length === 0) {
        throw new TypeError('filter must have a non-empty fields array');
    }

    const regex = RegExp(filter.pattern, 'i');
    let visible = false;
    for (let i = 0; i < filter.fields.length; i++) {
        const field = filter.fields[i];
        const text = obj[field];
        visible = regex.test(text);
    }

    return {
        visible
    };
};

// see https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
// RULE#1
const HTML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
};
const HTML_ESCAPER_REGEX = /[&<>"'/]/g;

/**
 * HTML Escape an untrusted string before inserting it into HTML element content
 *
 * To be used when you want to put untrusted data directly into the HTML body somewhere.
 * This includes inside normal tags like div, p, b, td, etc.
 * However, this is absolutely not sufficient for other HTML contexts
 * @param {String} string The string to escape for inserting into HTML
 * @returns {String} the escaped string
 */
export const escapeHtml = (string) => string.replace(HTML_ESCAPER_REGEX, (match) => HTML_ESCAPES[match]);