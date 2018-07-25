/**
 * Taking this method from lightning-date-time-utils
 * TODO Ideally would like to have the entire file,
 * but can't due to some precheckin restrictions
 */

import { getLocalizationService } from 'lightning-config-provider';

const localizationService = getLocalizationService();

// the date format we want to pass on save to the metadata api
export const METADATA_DATE_FORMAT = 'yyyy-MM-dd';

export const DATE_TIME_DISPLAY_FORMAT = 'MM/dd/yyyy h:mm:ss a [GMT]ZZ';
// Used for the validation error message as suggested date time format
export const DATE_TIME_DISPLAY_FORMAT_NO_TIME_ZONE = 'MM/dd/yyyy h:mm:ss a';
export const DATE_DISPLAY_FORMAT = 'MM/dd/yyyy';

/**
 * Parses a string to a JavaScript Date, using forgiving parsing rather
 * than strict validation. Any valid format for default US locale should be allowed.
 * @param {String} dateTimeString - The datetime string to be parsed.
 * @return {Date} A JavaScript Date object, or null if dateTimeString is invalid
 */
export function parseDateTime(dateTimeString) {
    return localizationService.parseDateTime(dateTimeString);
}

/**
 * Formats a date or datetime.
 * @param {String|Date} value - A date or datetime string in ISO8601 format, or a Date object
 * @param {boolean} isDateTime - Specify whether the value is a date or date time
 * @return {String} A formatted and localized (according to the user locale) date or datetime string.
 */
export function formatDateTime(value, isDateTime) {
    if (isDateTime) {
        return localizationService.formatDateTime(value, DATE_TIME_DISPLAY_FORMAT);
    }
    return localizationService.formatDate(value, DATE_DISPLAY_FORMAT);
}

/**
 * Validates the date string is a validate date time
 *
 * @param {String} dateString input date string
 * @returns {*} null if invalid date string otherwise parsed DateTime
 */
export function getValidDateTime(dateString) {
    if (dateString) {
        const date = parseDateTime(dateString);
        // Metadata API doesn't support dates before 1000
        if (date && date.getFullYear() < 1000) {
            return null;
        }
        return date;
    }
    return null;
}
