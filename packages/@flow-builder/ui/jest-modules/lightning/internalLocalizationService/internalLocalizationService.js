
const parseDateTimeUTC = jest.fn().mockName('parseDateTimeUTC');
const formatDateUTC = jest.fn().mockName('formatDateUTC');
const formatDateTimeUTC = jest.fn().mockName('formatDateTimeUTC');
const syncUTCToWallTime = jest.fn().mockName('syncUTCToWallTime');
const syncWallTimeToUTC = jest.fn().mockName('syncWallTimeToUTC');
const getLocale = jest.fn().mockName('getLocale').mockReturnValue({dateFormat: 'mm/dd/yyyy', datetimeFormat: 'mm/dd/yyyy hh:mm:ss'});

export { getLocale };
export { syncWallTimeToUTC };
export { syncUTCToWallTime };
export { formatDateTimeUTC };
export { formatDateUTC };
export { parseDateTimeUTC };