// @ts-nocheck
import { LABELS } from './debugUtilsLabels';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

/**
 * @constant STATUS The Interview Status
 * @type {Object}
 */
export const STATUS = {
    FINISHED: 'FINISHED',
    ERROR: 'ERROR',
    WAITING: 'WAITING'
};

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ELEMENT_ERR_TITLE = LABELS.errorBody.replace(/ \{0\} \(\{1\}\)./, '').trim();

/**
 * Unable to directly mutate the passed object: debugData
 * Add start and end info and create new title field (first element in debugInfo)
 *
 * @param {Object} debugData the debug interview response
 * @returns {Array} debugTraces array that contains objects representing each debug trace
 */
export function copyAndUpdateDebugTraceObject(debugData) {
    const debugTraces = [];
    let copyTraces = [];
    let startIndex = 1;
    if (debugData.debugTrace[0].error != null) {
        // the first entry has an error, so treat it as a normal entry
        startIndex = 0;
    } else {
        debugTraces.push(getStartInterviewInfo(debugData));
    }
    for (let i = startIndex; i < debugData.debugTrace.length; i++) {
        const trace = debugData.debugTrace[i].lines.filter((e) => {
            return !!e;
        });
        debugTraces.push({
            titleWithApiName: makeElementTitle(debugData.debugTrace[i], true),
            titleWithLabel: makeElementTitle(debugData.debugTrace[i], false),
            lines: trace,
            entryType: debugData.debugTrace[i].entryType,
            error: debugData.debugTrace[i].error,
            limits:
                Array.isArray(debugData.debugTrace[i].limits) && debugData.debugTrace[i].limits.length > 0
                    ? debugData.debugTrace[i].limits.map((limit: String) => ({
                          limit: limit + '\n',
                          id: generateGuid()
                      }))
                    : undefined,
            id: generateGuid()
        });
    }

    let end;
    if (debugData.waitEvent) {
        const waitEvents = [];
        const resumeTime = new Map();
        let hasAlarmEvent = false;
        for (const property in debugData.waitEvent) {
            if (debugData.waitEvent[property]) {
                waitEvents.push({ label: property, value: property });
                const time = formatUTCTime(debugData.waitEvent[property]);
                resumeTime.set(property, time);
                hasAlarmEvent = true;
            }
        }

        if (hasAlarmEvent) {
            // If there's alarm event, which there could be navigation, then store successful transactions
            // This could be extended to non-alarm event and other navigation types
            copyTraces = Object.assign([], debugTraces);

            debugTraces.push({
                titleWithApiName: LABELS.waitEventSelectionHeader,
                titleWithLabel: LABELS.waitEventSelectionHeader,
                lines: [LABELS.alarmEventHelpText],
                waitevents: waitEvents,
                resumetime: resumeTime,
                id: generateGuid()
            });
        } else {
            debugTraces.push({
                titleWithApiName: LABELS.waitEventSelectionHeader,
                titleWithLabel: LABELS.waitEventSelectionHeader,
                lines: [LABELS.noAlarmEventLine],
                id: generateGuid()
            });

            end = getEndInterviewInfo(debugData);
        }
    } else {
        end = getEndInterviewInfo(debugData);
    }

    if (end) {
        debugTraces.push(end);
    }
    return {
        debugTraces,
        copyTraces
    };
}

/**
 * @param utcTime
 * @returns dateString in the utc format
 */
function formatUTCTime(utcTime) {
    const localeTime = new Date(utcTime).toLocaleString();
    const date = new Date(localeTime);
    const dateString =
        MONTH_NAMES[date.getMonth()] +
        ' ' +
        date.getDate() +
        ' ' +
        date.getFullYear() +
        ', ' +
        date.toLocaleTimeString();
    return dateString;
}

/**
 * Add the start time to Interview Started debug Info
 *
 * @param {Object} debugData the debug interview response
 * @returns {Object} start debug interview info
 */
function getStartInterviewInfo(debugData) {
    const startedInfo = debugData.debugTrace[0].lines.filter((e) => {
        return !!e;
    });
    startedInfo.push(format(LABELS.interviewStartedAt, formatDateHelper(debugData.startInterviewTime).dateAndTime));
    return {
        titleWithApiName: startedInfo[0],
        titleWithLabel: startedInfo[0],
        lines: startedInfo,
        id: generateGuid()
    };
}

/**
 * Adding additional trace that is not returned by backend.
 * Error/Finished Header, Interview finish time, Interview Duration
 *
 * @param {Object} debugData the debug interview response
 * @returns {Object} end debug interview info
 */
function getEndInterviewInfo(debugData) {
    let end;
    const duration = ((debugData.endInterviewTime.getTime() - debugData.startInterviewTime.getTime()) / 1000).toFixed(
        2
    );
    const dateTime = formatDateHelper(debugData.endInterviewTime);
    switch (debugData.interviewStatus) {
        case STATUS.FINISHED:
            end = {
                titleWithApiName: LABELS.interviewFinishHeader,
                titleWithLabel: LABELS.interviewFinishHeader,
                lines: [format(LABELS.interviewFinishedAt, duration, dateTime.date, dateTime.time)],
                id: generateGuid()
            };
            break;
        case STATUS.ERROR:
            end = {
                titleWithApiName: LABELS.interviewError,
                titleWithLabel: LABELS.interviewError,
                lines: [format(LABELS.interviewErrorAt, dateTime.date, dateTime.time, duration)],
                id: generateGuid()
            };
            break;
        case STATUS.WAITING:
            end = {
                titleWithApiName: LABELS.interviewPausedHeader,
                titleWithLabel: LABELS.interviewPausedHeader,
                lines: [LABELS.interviewPaused],
                id: generateGuid()
            };
            break;
        default:
            break;
    }
    return end;
}

/**
 * Formats dateTime ie: July 6, 2020, 8:58AM
 *
 * @param dateTime Javascript Date object
 * @param locale
 * @returns {string} date in specified format in user default locale
 */
export function formatDateHelper(dateTime, locale = undefined) {
    const dateAndTime = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = { year: 'numeric', month: 'long', day: 'numeric' };
    const time = { hour: 'numeric', minute: 'numeric' };
    return {
        dateAndTime: dateTime.toLocaleDateString(locale, dateAndTime),
        date: dateTime.toLocaleDateString(locale, date),
        time: dateTime.toLocaleTimeString(locale, time)
    };
}

/**
 * Format the title with api name or label for the element debug card
 * eg: elementType: elementApiName
 *
 * corner case: element error card format doesn't need colon
 * eg: Error element <elementApiName> (<elementType>)
 *
 * @param debugTrace the trace of a single entry
 * @param createTitleWithApi
 * @returns title
 */
export function makeElementTitle(debugTrace, createTitleWithApi) {
    let title = '';

    if (debugTrace.elementType && debugTrace.elementType.includes(ELEMENT_ERR_TITLE)) {
        return debugTrace.elementType;
    }

    if (debugTrace.elementType) {
        title += debugTrace.elementType;
    }

    if (createTitleWithApi && debugTrace.elementApiName) {
        title += ': ' + debugTrace.elementApiName;
    } else if (!createTitleWithApi && debugTrace.elementLabel) {
        title += ': ' + debugTrace.elementLabel;
    }

    return title;
}
