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
            formatDateUTC: jest.fn((dateString, format) => {
                if (format === 'yyyy-MM-dd') {
                    return dateString.split('T')[0];
                }
                return dateString;
            }),
            formatDate: jest.fn((dateValue) => {
                if (typeof dateValue === 'string' || dateValue instanceof String) {
                    return dateValue;
                }
                return (dateValue.getMonth() + 1).toString().padStart(2, 0) + '/'
                    + dateValue.getDate().toString().padStart(2, 0) + '/' + dateValue.getFullYear();
            }),
            formatTime: jest.fn(() => { return '' }),
            formatDateTime: jest.fn((dateValue) => {
                let dateObj = dateValue;
                if (typeof dateValue === 'string' || dateValue instanceof String) {
                    dateObj = new Date(dateValue);
                }
                const datePart = (dateObj.getMonth() + 1).toString().padStart(2, 0) + '/'
                 + dateObj.getDate().toString().padStart(2, 0) + '/' + dateObj.getFullYear();
                return datePart + ' ' + dateObj.toTimeString();
            }),
            parseDateTimeUTC: jest.fn((dateTimeString) => { return new Date(dateTimeString) }),
            parseDateTime: jest.fn((dateTimeString) => {
                const validDateTime = [
                    '12/31/2018',
                    '12-12-2009',
                    '1 1 2018',
                    '12122009',
                    '12-12-2009 11:32:59',
                    '1 1 2018 10:11'
                ];
                return validDateTime.includes(dateTimeString) ? new Date(dateTimeString) : null;
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
