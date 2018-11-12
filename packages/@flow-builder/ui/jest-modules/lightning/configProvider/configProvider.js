const mockGetLocalizationService = {
    formatDateUTC: jest.fn().mockName('formatDateUTC'),
    formatDateTimeUTC: jest.fn().mockName('formatDateTimeUTC'),
    parseDateTimeUTC: jest.fn().mockName('parseDateTimeUTC'),
};

export const getLocalizationService = jest.fn().mockImplementation(() => mockGetLocalizationService);