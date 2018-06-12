/**
 * Checks whether the passed parameter is specifically undefined or null and not an empty string.
 * @param {String} value The string to check
 * @returns {Boolean} Whether value is undefined or null
 */
export const isUndefinedOrNull = (value) => {
    return (value === undefined || value === null);
};

/**
 * Formats the input date into 'MM/DD/YYYY' for date or 'MM/DD/YYYY HH:MM:SS TZ' for date time
 * Note: Date format is not final yet and might change.
 * @param {String} dateValue input Date value
 * @param {boolean} isDateTime whether to append time
 * @returns {String} formatted date string
 */
export const formatDate = (dateValue, isDateTime) => {
    const datePart = (dateValue.getMonth() + 1).toString().padStart(2, 0) + '/'
        + dateValue.getDate().toString().padStart(2, 0) + '/' + dateValue.getFullYear();
    if (isDateTime) {
        return datePart + ' ' + dateValue.toTimeString();
    }
    return datePart;
};

/**
 * Determines if item is an object
 * @param {*} item The item in question of being an object
 * @returns {Boolean} Whether item is an object or not
 */
export const isObject = (item) => {
    return (typeof item === 'object' && !Array.isArray(item) && !isUndefinedOrNull(item));
};