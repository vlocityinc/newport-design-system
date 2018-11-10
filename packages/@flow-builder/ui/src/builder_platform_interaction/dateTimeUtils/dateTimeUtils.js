import {
    parseDateTimeUTC,
    syncUTCToWallTime,
    syncWallTimeToUTC,
    formatDateTimeUTC,
    formatDateUTC,
    getLocale,
} from 'lightning/internalLocalizationService';

import {
    getLocalizationService,
} from 'lightning/configProvider';

/**
 * Returns the default date or datetime format for user's locale
 * @param {Boolean} isDateTime true for the datetime format, false for date format
 * @returns {String} default date or date time format for the user's locale
 */
export const getFormat = (isDateTime = false) => {
    if (isDateTime) {
        return getLocale().datetimeFormat;
    }
    return getLocale().dateFormat;
};

/**
 * Information about a parsed date that came from a string literal
 * @typedef {Object.<String, String>} parsedDate
 * @param {Date} date A JavaScript UTC Date object, or null if dateLiteral is invalid
 * @param {String} dateLiteral the date or datetime parsed
 */

/**
 * Parse a string literal into a UTC date
 * @param {String} literal date or datetime literal to parse
 * @param {Boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @param {Boolean} isFormattedDate true if literal is formatted to user's locale format, false if literal is ISO8601 format
 * @returns {parsedDate} the parsed date
 */
const parseDateTime = (literal, isDateTime = false, isFormattedDate = false) => {
    if (typeof literal !== 'string') {
        throw new Error(`Date literal must be type string but instead was ${typeof literal}`);
    }
    const dateLiteral = literal.trim();
    let date;

    if (isFormattedDate) {
        // TODO W-5602291 this will hopefully get replaced if format param is exposed in lightning/internalLocalizationService
        date = getLocalizationService().parseDateTimeUTC(dateLiteral, getFormat(isDateTime));
    } else {
        date = parseDateTimeUTC(dateLiteral);
    }

    // some dates are in an invalid state and have no timestamp
    if (date instanceof Date && isNaN(date.valueOf())) {
        date = null;
    }

    return {
        date,
        dateLiteral,
    };
};

/**
 * Parse a string literal in ISO8601 format into a UTC date
 * @param {String} literal date or date time literal in user's locale format
 * @param {Boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {parsedDate} the parsed date
 */
export const parseMetadataDateTime  = (literal, isDateTime = false) => {
    return parseDateTime(literal, isDateTime);
};

/**
 * Parse a string literal in the user's date/datetime locale format into a UTC date
 * Use this when you want to parse a date/datetime literal in the user's locale format
 * @param {String} literal date or date time literal in user's locale format
 * @param {Boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {parsedDate} the parsed date
 */
export const parseFormattedDateTime = (literal, isDateTime = false) => {
    return parseDateTime(literal, isDateTime, true);
};

/**
 * Check if the given string literal is a valid date
 * @param {String} literal the string literal to be tested as a valid date
 * @returns {Boolean} true if a valid date, false otherwise
 */
export const isValidFormattedDateTime = (literal, isDateTime = false) => {
    const { date } = parseFormattedDateTime(literal, isDateTime);
    return !!date;
};

/**
 * Normalize a date or datetime literal into the user's locale format and current time zone
 * Use this when you are transforming an ISO 8601 UTC date into the user's locale & time zone
 * @param {String} literal date literal to parse and format
 * @param {Boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {String} normalized date or datetime text in user's locale format and timezone. The given param literal
 * is returned if not a valid date or datetime
 */
export const normalizeDateTime = (literal, isDateTime = false) => {
    const { date, dateLiteral } = parseMetadataDateTime(literal, isDateTime);

    if (date) {
        if (isDateTime) {
            const timezone = getLocale().timezone;
            const wallDate = syncUTCToWallTime(date, timezone);
            return formatDateTimeUTC(wallDate);
        }
        return formatDateUTC(date);
    }
    return dateLiteral;
};

/**
 * Create an ISO 8601 UTC date from a date or datetime literal
 * Use this when transforming a date/datetime literal in the user's locale & timezone into
 * a date for store or metadata
 * @param {String} literal date literal to parse and format
 * @param {String} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {String|null} ISO 8601 UTC date or datetime text. Null if literal is not a valid date/datetime
 */
export const createMetadataDateTime = (literal, isDateTime = false) => {
    const { date } = parseFormattedDateTime(literal, isDateTime);

    if (date) {
        if (isDateTime) {
            const timezone = getLocale().timezone;
            const utcDate = syncWallTimeToUTC(date, timezone);
            return utcDate.toISOString();
        }
        return date.toISOString();
    }
    return null;
};

/**
 * Formats a date or datetime literal into the user's locale format
 * Use this when you want to transform a date or datetime literal already in the user's timezone
 * and locale format into the user's locale format
 * @param {String} literal date literal to parse and format
 * @param {String} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {String} date or datetime text in user's locale format. The given param literal is returned
 * if not a valid date or datetime
 */
export const formatDateTime = (literal, isDateTime = false) => {
    const { date, dateLiteral } = parseFormattedDateTime(literal, isDateTime);
    if (date) {
        if (isDateTime) {
            return formatDateTimeUTC(date.toISOString());
        }
        return formatDateUTC(date.toISOString());
    }
    return dateLiteral;
};
