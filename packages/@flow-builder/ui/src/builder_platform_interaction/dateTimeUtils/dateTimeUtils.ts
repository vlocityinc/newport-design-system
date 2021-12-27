// @ts-nocheck
import shortDateFormat from '@salesforce/i18n/dateTime.shortDateFormat';
import shortDateTimeFormat from '@salesforce/i18n/dateTime.shortDateTimeFormat';
import timeZone from '@salesforce/i18n/timeZone';
import { getLocalizationService } from 'lightning/configProvider';
import { parseDateTimeUTC, syncUTCToWallTime, syncWallTimeToUTC } from 'lightning/internalLocalizationService';

/**
 * Returns the default date or datetime format for user's locale
 *
 * @param {boolean} isDateTime true for the datetime format, false for date format
 * @returns {string} default date or date time format for the user's locale
 */
export const getFormat = (isDateTime = false) => {
    if (isDateTime) {
        return shortDateTimeFormat;
    }
    return shortDateFormat;
};

/**
 * Information about a parsed date that came from a string literal
 *
 * @typedef {Object.<string, string>} parsedDate
 * @param {Date} date A JavaScript UTC Date object, or null if dateLiteral is invalid
 * @param {string} dateLiteral the date or datetime parsed
 */

/**
 * Parse a string literal into a UTC date
 *
 * @param {string} literal date or datetime literal to parse
 * @param {boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @param {boolean} isFormattedDate true if literal is formatted to user's locale format, false if literal is ISO8601 format
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
        dateLiteral
    };
};

/**
 * Parse a string literal in ISO8601 format into a UTC date
 *
 * @param {string} literal date or date time literal in user's locale format
 * @param {boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {parsedDate} the parsed date
 */
export const parseMetadataDateTime = (literal, isDateTime = false) => {
    return parseDateTime(literal, isDateTime);
};

/**
 * Parse a string literal in the user's date/datetime locale format into a UTC date
 * Use this when you want to parse a date/datetime literal in the user's locale format
 *
 * @param {string} literal date or date time literal in user's locale format
 * @param {boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {parsedDate} the parsed date
 */
export const parseFormattedDateTime = (literal, isDateTime = false) => {
    return parseDateTime(literal, isDateTime, true);
};

/**
 * Check if the given string literal is a valid date
 *
 * @param {string} literal the string literal to be tested as a valid date
 * @param {boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {boolean} true if a valid date, false otherwise
 */
export const isValidFormattedDateTime = (literal, isDateTime = false) => {
    const { date } = parseFormattedDateTime(literal, isDateTime);
    return !!date;
};

/**
 * Check if the given ISO string literal is a valid date
 *
 * @param {string} literal the string literal to be tested as a valid date
 * @param {boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {boolean} true if a valid date, false otherwise
 */
export const isValidMetadataDateTime = (literal, isDateTime) => {
    const { date } = parseMetadataDateTime(literal, isDateTime);
    return !!date;
};

/**
 * Normalize a date or datetime literal into the user's locale format and current time zone
 * Use this when you are transforming an ISO 8601 UTC date into the user's locale & time zone
 *
 * @param {string} literal date literal to parse and format
 * @param {boolean} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {string} normalized date or datetime text in user's locale format and timezone. The given param literal
 * is returned if not a valid date or datetime
 */
export const normalizeDateTime = (literal, isDateTime = false) => {
    const { date, dateLiteral } = parseMetadataDateTime(literal, isDateTime);

    if (date) {
        if (isDateTime) {
            const timezone = timeZone;
            const wallDate = syncUTCToWallTime(date, timezone);
            return getLocalizationService().formatDateTimeUTC(wallDate.toISOString(), getFormat(isDateTime));
        }
        return getLocalizationService().formatDateUTC(date.toISOString(), getFormat(isDateTime));
    }
    return dateLiteral;
};

/**
 * Create an ISO 8601 UTC date from a date or datetime literal
 * Use this when transforming a date/datetime literal in the user's locale & timezone into
 * a date for store or metadata
 *
 * @param {string} literal date literal to parse and format
 * @param {string} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {string | null} ISO 8601 UTC date or datetime text. Null if literal is not a valid date/datetime
 */
export const createMetadataDateTime = (literal, isDateTime = false) => {
    const { date } = parseFormattedDateTime(literal, isDateTime);

    if (date) {
        if (isDateTime) {
            const timezone = timeZone;
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
 *
 * @param {string} literal date literal to parse and format
 * @param {string} isDateTime true if literal is a datetime, false if literal is a date
 * @returns {string} date or datetime text in user's locale format. The given param literal is returned
 * if not a valid date or datetime
 */
export const formatDateTime = (literal, isDateTime = false) => {
    const { date, dateLiteral } = parseFormattedDateTime(literal, isDateTime);
    if (date) {
        if (isDateTime) {
            return getLocalizationService().formatDateTimeUTC(date.toISOString(), getFormat(isDateTime));
        }
        return getLocalizationService().formatDateUTC(date.toISOString(), getFormat(isDateTime));
    }
    return dateLiteral;
};

/**
 * Formats a UTC datetime into the user's default locale format
 * Use this when you want to transform a UTC datetime into the user's locale format
 *
 * @param {Date} datetime to format
 * @param date
 * @returns {string} datetime text in user's locale format.
 */
export const formatDateTimeUTC = (date) => {
    return getLocalizationService().formatDateTimeUTC(date);
};

/**
 * Formats a UTC datetime into the user's default locale format and extracts the day of the week
 * Use this when you want to get the day of the week from a UTC datetime, according to the user's locale
 *
 * @param {Date} datetime to format
 * @param date
 * @returns {string} text containing the abbreviated version of the day of the week, according to the
 * user's locale format.
 */
export const getDayOfTheWeek = (date) => {
    return getLocalizationService().formatDateTimeUTC(date, 'EEE');
};
