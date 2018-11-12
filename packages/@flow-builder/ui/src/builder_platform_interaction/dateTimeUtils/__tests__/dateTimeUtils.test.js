import {
    formatDateTime,
    createMetadataDateTime,
    normalizeDateTime,
    getFormat,
    isValidFormattedDateTime,
    parseFormattedDateTime,
    parseMetadataDateTime,
} from '../dateTimeUtils';
import {
    parseDateTimeUTC,
    syncUTCToWallTime,
    syncWallTimeToUTC,
    getLocale,
} from 'lightning/internalLocalizationService';
import {
    getLocalizationService,
} from 'lightning/configProvider';


describe('date-time-utils', () => {
    const localizationService = getLocalizationService();

    describe('getFormat', () => {
        const mockLocale = {
            shortDatetimeFormat: 'mm/dd/yyyy hh:mm:ss',
            shortDateFormat: 'mm/dd/yyyy',
        };

        beforeAll(() => {
            getLocale.mockReturnValue(mockLocale);
        });

        it('gets the short datetime format when isDateTime is true', () => {
            const format = getFormat(true);
            expect(format).toEqual(mockLocale.shortDatetimeFormat);
        });

        it('gets the short date format by default', () => {
            const format = getFormat();
            expect(format).toEqual(mockLocale.shortDateFormat);
        });
    });

    describe('isValidFormattedDateTime', () => {
        it('throws an error if the literal is not a string', () => {
            expect(() => {
                isValidFormattedDateTime(42, true);
            }).toThrow();
        });

        it('returns true for a valid datetime literal', () => {
            const mockDatetimeLiteral = '12/31/1999, 11:59 pm';
            const isDateTime = true;
            localizationService.parseDateTimeUTC.mockReturnValueOnce(new Date());

            const isValid = isValidFormattedDateTime(mockDatetimeLiteral, isDateTime);
            expect(isValid).toEqual(true);
        });

        it('returns true for a valid date litearl', () => {
            const mockDateLiteral = '12/31/1999';
            localizationService.parseDateTimeUTC.mockReturnValueOnce(new Date());

            const isValid = isValidFormattedDateTime(mockDateLiteral);
            expect(isValid).toEqual(true);
        });

        it('returns false for an invalid datetime literal', () => {
            const mockDatetimeLiteral = 'bad date time literal';
            const isDateTime = true;
            localizationService.parseDateTimeUTC.mockReturnValueOnce(new Date(mockDatetimeLiteral));

            const isValid = isValidFormattedDateTime(mockDatetimeLiteral, isDateTime);
            expect(isValid).toEqual(false);
        });

        it('returns false for an invalid date literal', () => {
            const mockDatetimeLiteral = 'bad date literal';
            localizationService.parseDateTimeUTC.mockReturnValueOnce(new Date(mockDatetimeLiteral));

            const isValid = isValidFormattedDateTime(mockDatetimeLiteral);
            expect(isValid).toEqual(false);
        });
    });

    describe('parseFormattedDateTime', () => {
        it('throws an error if the literal is not a string', () => {
            expect(() => {
                parseFormattedDateTime(42, true);
            }).toThrow();
        });

        it('returns an object with date and dateLiteral', () => {
            const result = parseFormattedDateTime('some text');
            expect(result).toHaveProperty('date');
            expect(result).toHaveProperty('dateLiteral');
        });

        it('returns null for date property when given an invalid literal', () => {
            const badDateLiteral = '99/99/1999';
            localizationService.parseDateTimeUTC.mockReturnValueOnce(new Date(badDateLiteral));

            const { date } = parseFormattedDateTime(badDateLiteral);
            expect(date).toBeNull();
        });

        it('returns a javascript date object for date property when given a valid literal', () => {
            const mockLocale = {
                shortDatetimeFormat: 'mm/dd/yyyy hh:mm:ss',
                shortDateFormat: 'mm/dd/yyyy',
            };
            getLocale.mockReturnValueOnce(mockLocale);
            const mockDate = new Date();
            const literal = '12/31/1999';
            localizationService.parseDateTimeUTC.mockReturnValueOnce(mockDate);

            const { date } = parseFormattedDateTime(literal, true);
            expect(date).toBeInstanceOf(Date);
            expect(date).toBe(mockDate);
            expect(localizationService.parseDateTimeUTC).toHaveBeenCalledWith(literal, mockLocale.shortDatetimeFormat);
        });
    });

    describe('parseMetadataDateTime', () => {
        it('throws an error if the literal is not a string', () => {
            expect(() => {
                parseMetadataDateTime(42, true);
            }).toThrow();
        });

        it('returns an object with date and dateLiteral', () => {
            const result = parseMetadataDateTime('some text');
            expect(result).toHaveProperty('date');
            expect(result).toHaveProperty('dateLiteral');
        });

        it('returns null for date property when given an invalid literal', () => {
            const badDateLiteral = '99/99/1999';
            parseDateTimeUTC.mockReturnValueOnce(new Date(badDateLiteral));

            const { date } = parseMetadataDateTime(badDateLiteral);
            expect(date).toBeNull();
        });

        it('returns a javascript date object for date property when given a valid literal', () => {
            const mockDate = new Date();
            parseDateTimeUTC.mockReturnValueOnce(mockDate);

            const { date } = parseMetadataDateTime('12/31/1999');
            expect(date).toBeInstanceOf(Date);
            expect(date).toBe(mockDate);
        });

        it('returns the given date literal without leading or trailing whitespace', () => {
            const literal = '12/31/1999';

            const { dateLiteral } = parseMetadataDateTime(`     ${literal}    `);
            expect(dateLiteral).toEqual(literal);
        });
    });

    describe('normalizeDateTime', () => {
        const mockLocale = {
            timezone: 'America/LosAngeles',
            shortDatetimeFormat: 'mm/dd/yyyy hh:mm:ss',
            shortDateFormat: 'mm/dd/yyyy',
        };

        it('throws an error if the literal is not a string', () => {
            expect(() => {
                normalizeDateTime(42, true);
            }).toThrow();
        });

        it('returns the trimmed date literal when given an invalid literal', () => {
            const dateLiteral = '2018-99-99';
            const result = normalizeDateTime(`    ${dateLiteral}   `);
            expect(result).toEqual(dateLiteral);
        });

        it('returns a formatted date string when given a valid literal', () => {
            const mockDate = new Date();
            parseDateTimeUTC.mockReturnValueOnce(mockDate);
            const mockFormattedDate = '12/31/1999';
            localizationService.formatDateUTC.mockReturnValueOnce(mockFormattedDate);
            const dateLiteral = '1999-12-31';

            const result = normalizeDateTime(dateLiteral);
            expect(localizationService.formatDateUTC).toHaveBeenCalledWith(mockDate.toISOString(), mockLocale.shortDateFormat);
            expect(result).toEqual(mockFormattedDate);
        });

        it('returns a formatted date time string when given a valid literal', () => {
            getLocale.mockReturnValueOnce(mockLocale);
            const mockDatetime = new Date();
            parseDateTimeUTC.mockReturnValue(mockDatetime);
            const mockWallTime = new Date();
            syncUTCToWallTime.mockReturnValueOnce(mockWallTime);
            const mockFormattedDatetime = '12/31/1999, 11:59 pm';
            localizationService.formatDateTimeUTC.mockReturnValue(mockFormattedDatetime);
            const datetimeLiteral = '1999-12-31T23:59:00.000+0000';

            const result = normalizeDateTime(datetimeLiteral, true);
            expect(result).toEqual(mockFormattedDatetime);
            expect(syncUTCToWallTime).toHaveBeenCalledWith(mockDatetime, mockLocale.timezone);
            expect(localizationService.formatDateTimeUTC).toHaveBeenCalledWith(mockWallTime.toISOString(), mockLocale.shortDatetimeFormat);
        });
    });

    describe('createMetadataDateTime', () => {
        const mockLocale = {
            timezone: 'America/LosAngeles',
        };

        it('throws an error if the literal is not a string', () => {
            expect(() => {
                createMetadataDateTime(42, true);
            }).toThrow();
        });

        it('returns null when given an invalid literal', () => {
            const dateLiteral = '2018-99-99';
            const result = createMetadataDateTime(`    ${dateLiteral}   `);
            expect(result).toEqual(null);
        });

        it('returns an ISO 8601 date string when given a valid date literal', () => {
            const dateLiteral = '12/31/1999';
            const mockDate = new Date('1999-12-31');
            localizationService.parseDateTimeUTC.mockReturnValueOnce(mockDate);

            const result = createMetadataDateTime(dateLiteral);
            expect(result).toEqual(mockDate.toISOString());
        });

        it('returns an ISO 8601 date time string when given a valid date time literal', () => {
            getLocale.mockReturnValue(mockLocale);
            const datetimeLiteral = '12/31/1999 11:59 pm';
            const mockDate = new Date('1999-12-31T23:59:00.000+0000');
            localizationService.parseDateTimeUTC.mockReturnValueOnce(mockDate);
            const utcDate = new Date('2000-01-01T06:59:00.000+0000');
            syncWallTimeToUTC.mockReturnValueOnce(utcDate);

            const result = createMetadataDateTime(datetimeLiteral, true);
            expect(result).toEqual(utcDate.toISOString());
            expect(syncWallTimeToUTC).toHaveBeenCalledWith(mockDate, mockLocale.timezone);
        });
    });

    describe('formatDateTime', () => {
        const mockLocale = {
            shortDatetimeFormat: 'mm/dd/yyyy hh:mm:ss',
            shortDateFormat: 'mm/dd/yyyy',
        };

        beforeAll(() => {
            getLocale.mockReturnValue(mockLocale);
        });

        afterAll(() => {
            getLocale.mockReset();
        });

        it('throws an error if the literal is not a string', () => {
            expect(() => {
                formatDateTime(42, true);
            }).toThrow();
        });

        it('returns the trimmed date literal when given an invalid literal', () => {
            const dateLiteral = '2018-99-99';
            const result = formatDateTime(`    ${dateLiteral}   `);
            expect(result).toEqual(dateLiteral);
        });

        it('returns a formatted date string when given a valid date literal', () => {
            const dateLiteral = '12/31/1999';
            const mockDate = new Date('1999-12-31');
            localizationService.parseDateTimeUTC.mockReturnValueOnce(mockDate);
            localizationService.formatDateUTC.mockReturnValueOnce(dateLiteral);

            const result = formatDateTime(dateLiteral);
            expect(result).toEqual(dateLiteral);
            expect(localizationService.formatDateUTC).toHaveBeenCalledWith(mockDate.toISOString(), mockLocale.shortDateFormat);
        });

        it('returns a formatted date time string when given a valid date time literal', () => {
            const datetimeLiteral = '12/31/1999 11:59 pm';
            const mockDate = new Date('1999-12-31T23:59:00.000+0000');
            localizationService.parseDateTimeUTC.mockReturnValueOnce(mockDate);
            localizationService.formatDateTimeUTC.mockReturnValueOnce(datetimeLiteral);

            const result = formatDateTime(datetimeLiteral, true);
            expect(result).toEqual(datetimeLiteral);
            expect(localizationService.formatDateTimeUTC).toHaveBeenCalledWith(mockDate.toISOString(), mockLocale.shortDatetimeFormat);
        });
    });
});