const PROVIDED_IMPL = {
    getLocale: () => {
        return {
            langLocale: 'english'
        }
    },
    getLocalizationService: () => {
        return {
            isBefore: jest.fn(() => { return true }),
            isAter: jest.fn(() => { return true }),
            isSame: jest.fn(() => { return true }),
            formatDateTimeUTC: jest.fn(() => { return '' }),
            formatDate: jest.fn(() => { return '' }),
            formatTime: jest.fn(() => { return '' }) ,
            parseDateTimeUTC: jest.fn(() => { return '' }),
            parseDateTime: jest.fn((dateTimeString, format) => {
                const validDateTime = [
                    '12/31/2018',
                    '12-12-2009',
                    '1 1 2018',
                    '12122009',
                    '12-12-2009 11:32:59',
                    '1 1 2018 10:11'
                ]

                if (format && format === 'MM/DD/YYYY HH:mm:ss') {
                    return validDateTime.includes(dateTimeString) ? new Date(dateTimeString) : null;
                }
            }),
        }

    }
}

export function getLocale() {
    return PROVIDED_IMPL && PROVIDED_IMPL.getLocale();
}

export function getLocalizationService() {
    return PROVIDED_IMPL && PROVIDED_IMPL.getLocalizationService();
}
