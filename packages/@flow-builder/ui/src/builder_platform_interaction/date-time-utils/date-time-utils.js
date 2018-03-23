/**
 * Taking this method from lightning-date-time-utils
 * TODO Ideally would like to have the entire file,
 * but can't due to some precheckin restrictions
 */

import { getLocalizationService } from 'lightning-config-provider';

const localizationService = getLocalizationService();

export function parseDateTime(dateTimeString, format, strictMode) {
    return localizationService.parseDateTime(
        dateTimeString,
        format,
        strictMode
    );
}
