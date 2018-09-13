import {
    parseDateTime,
    formatDateTime,
    getValidDateTime,
    DATE_TIME_DISPLAY_FORMAT,
    DATE_DISPLAY_FORMAT,
    MIN_FULL_YEAR,
} from "../dateTimeUtils";
import { getLocalizationService } from "lightning/configProvider";

jest.mock('lightning/configProvider', () => {
    const mockGetLocalizationService = {
        parseDateTime: jest.fn().mockName('localizationService.parseDateTime'),
        formatDateTime: jest.fn().mockName('localizationService.formatDateTime'),
        formatDate: jest.fn().mockName('localizationService.formatDate'),
    };
    return {
        getLocalizationService: jest.fn().mockImplementation(() => mockGetLocalizationService),
    };
});

describe('date-time-utils', () => {
    const localizationService = getLocalizationService();
    const dateString = '12/31/1999';

    beforeEach(() => {
        localizationService.parseDateTime.mockClear();
        localizationService.formatDateTime.mockClear();
        localizationService.formatDate.mockClear();
    });

    it('parseDateTime util calls localization service parseDateTime', () => {
        parseDateTime(dateString);
        expect(localizationService.parseDateTime).toHaveBeenCalledTimes(1);
        expect(localizationService.parseDateTime).toHaveBeenCalledWith(dateString);
    });

    it('formatDateTime util calls localization service formatDateTime when given datetime string', () => {
        formatDateTime(dateString, true);
        expect(localizationService.formatDateTime).toHaveBeenCalledTimes(1);
        expect(localizationService.formatDateTime).toHaveBeenCalledWith(dateString, DATE_TIME_DISPLAY_FORMAT);
    });

    it('formatDateTime util calls localization service formatDate when given date string', () => {
        formatDateTime(dateString, false);
        expect(localizationService.formatDate).toHaveBeenCalledTimes(1);
        expect(localizationService.formatDate).toHaveBeenCalledWith(dateString, DATE_DISPLAY_FORMAT);
    });

    it('getValidDateTime util calls localization service parseDateTime when given a defined date string', () => {
        getValidDateTime(dateString);
        expect(localizationService.parseDateTime).toHaveBeenCalledTimes(1);
        expect(localizationService.parseDateTime).toHaveBeenCalledWith(dateString);
    });

    it('getValidDateTime util does not call localization service parseDateTime when given undefined date string and returns null', () => {
        const result = getValidDateTime(undefined);
        expect(localizationService.parseDateTime).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('getValidDateTime util returns null when given a date with year less than 1000', () => {
        const date = new Date(dateString);
        date.setFullYear(MIN_FULL_YEAR - 1);
        localizationService.parseDateTime.mockReturnValue(date);

        const result = getValidDateTime(date.toString());
        expect(localizationService.parseDateTime).toHaveBeenCalledWith(date.toString());
        expect(result).toBeNull();
    });

    it('getValidDateTime util returns a date when given a valid date', () => {
        const date = new Date(dateString);
        localizationService.parseDateTime.mockReturnValueOnce(date);

        const result = getValidDateTime(date.toString());
        expect(localizationService.parseDateTime).toHaveBeenCalledWith(date.toString());
        expect(result).toEqual(date);
    });
});