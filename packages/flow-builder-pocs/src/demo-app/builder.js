import { createElement } from 'lwc';
import DemoBuilder from 'demo-builder';

import configProviderService from 'lightning/configProvider';

const locale = {
    userLocaleLang: 'en',
    userLocaleCountry: 'CA',
    language: 'en',
    country: 'US',
    variant: '',
    langLocale: 'en_US',
    nameOfMonths: [
        {
            fullName: 'January',
            shortName: 'Jan'
        },
        {
            fullName: 'February',
            shortName: 'Feb'
        },
        {
            fullName: 'March',
            shortName: 'Mar'
        },
        {
            fullName: 'April',
            shortName: 'Apr'
        },
        {
            fullName: 'May',
            shortName: 'May'
        },
        {
            fullName: 'June',
            shortName: 'Jun'
        },
        {
            fullName: 'July',
            shortName: 'Jul'
        },
        {
            fullName: 'August',
            shortName: 'Aug'
        },
        {
            fullName: 'September',
            shortName: 'Sep'
        },
        {
            fullName: 'October',
            shortName: 'Oct'
        },
        {
            fullName: 'November',
            shortName: 'Nov'
        },
        {
            fullName: 'December',
            shortName: 'Dec'
        },
        {
            fullName: '',
            shortName: ''
        }
    ],
    nameOfWeekdays: [
        {
            fullName: 'Sunday',
            shortName: 'SUN'
        },
        {
            fullName: 'Monday',
            shortName: 'MON'
        },
        {
            fullName: 'Tuesday',
            shortName: 'TUE'
        },
        {
            fullName: 'Wednesday',
            shortName: 'WED'
        },
        {
            fullName: 'Thursday',
            shortName: 'THU'
        },
        {
            fullName: 'Friday',
            shortName: 'FRI'
        },
        {
            fullName: 'Saturday',
            shortName: 'SAT'
        }
    ],
    labelForToday: 'Today',
    firstDayOfWeek: 1,
    timezone: 'America/Los_Angeles',
    dateFormat: 'd-MMM-yyyy',
    shortDateFormat: 'dd/MM/yyyy',
    longDateFormat: 'MMMM d, yyyy',
    datetimeFormat: 'd-MMM-yyyy h:mm:ss a',
    shortDatetimeFormat: 'dd/MM/yyyy h:mm a',
    timeFormat: 'h:mm:ss a',
    shortTimeFormat: 'h:mm a',
    numberFormat: '#,##0.###',
    decimal: '.',
    grouping: ',',
    zero: '0',
    percentFormat: '#,##0%',
    currencyFormat: '¤#,##0.00;(¤#,##0.00)',
    currencyCode: 'USD',
    currency: '$',
    dir: 'ltr',
    lang: 'en-US',
    isEasternNameStyle: false
};

const serviceAPI = {
    getInitializer: undefined,
    getPathPrefix: undefined,
    getFormFactor: undefined,
    getToken: null,
    getLocale: () => locale,
    getLocalizationService: undefined,
    sanitizeDOM: undefined
};

configProviderService(serviceAPI);

document.querySelector('#main').appendChild(createElement('demo-builder', { is: DemoBuilder }));
