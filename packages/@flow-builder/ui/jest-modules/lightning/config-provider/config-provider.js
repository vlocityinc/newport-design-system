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
            parseDateTime: jest.fn(() => { return '' }),
        }

    }
}

export function getLocale() {
    return PROVIDED_IMPL && PROVIDED_IMPL.getLocale();
}

export function getLocalizationService() {
    return PROVIDED_IMPL && PROVIDED_IMPL.getLocalizationService();
}
