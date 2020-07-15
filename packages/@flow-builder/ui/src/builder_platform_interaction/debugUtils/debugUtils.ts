// @ts-nocheck
import { LABELS } from './debugUtilsLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';

/**
 * @constant STATUS The Interview Status
 * @type {Object}
 */
export const STATUS = {
    FINISHED: 'FINISHED',
    ERROR: 'ERROR',
    WAITING: 'WAITING'
};

const NEWLINE = '\\n';

/**
 * Unable to directly mutate the passed object: debugData
 * Add start and end info and create new title field (first element in debugInfo)
 * @param {Object} debugData the debug interview response
 * @returns {Array} debugTraces array that contains objects representing each debug trace
 */
export function copyAndUpdateDebugTraceObject(debugData) {
    const debugTraces = [];
    debugTraces.push(getStartInterviewInfo(debugData));
    for (let i = 1; i < debugData.debugTrace.length; i++) {
        const trace = debugData.debugTrace[i].debugInfo.split(NEWLINE).filter(e => {
            return !!e;
        });
        debugTraces.push({
            title: convertElementTypeToTitleCase(trace[0]),
            debugInfo: trace.slice(1).join(NEWLINE),
            id: generateGuid()
        });
    }
    const end = getEndInterviewInfo(debugData);
    if (end) {
        debugTraces.push(end);
    }
    return debugTraces;
}

/**
 * Add the start time to Interview Started debug Info
 * @param {Object} debugData the debug interview response
 * @return {Object} start debug interview info
 */
function getStartInterviewInfo(debugData) {
    const startedInfo = debugData.debugTrace[0].debugInfo.split(NEWLINE).filter(e => {
        return !!e;
    });
    startedInfo.push(format(LABELS.interviewStartedAt, formatDateHelper(debugData.startInterviewTime)));
    return {
        title: startedInfo[0],
        debugInfo: startedInfo.slice(1).join(NEWLINE),
        id: generateGuid()
    };
}

/**
 * Adding additional trace that is not returned by backend.
 * Error/Finished Header, Interview finish time, Interview Duration
 * @param {Object} debugData the debug interview response
 * @return {Object} end debug interview info
 */
function getEndInterviewInfo(debugData) {
    let end;
    const duration = ((debugData.endInterviewTime.getTime() - debugData.startInterviewTime.getTime()) / 1000).toFixed(
        2
    );
    switch (debugData.interviewStatus) {
        case STATUS.FINISHED:
            end = {
                title: LABELS.interviewFinishHeader,
                debugInfo:
                    format(LABELS.interviewFinishedAt, formatDateHelper(debugData.endInterviewTime)) +
                    NEWLINE +
                    format(LABELS.interviewFinishDuration, duration),
                id: generateGuid()
            };
            break;
        case STATUS.ERROR:
            end = {
                title: LABELS.interviewError,
                debugInfo:
                    format(LABELS.interviewErrorAt, formatDateHelper(debugData.endInterviewTime)) +
                    NEWLINE +
                    format(LABELS.interviewFinishDuration, duration),
                id: generateGuid()
            };
            break;
        case STATUS.WAITING:
            end = {
                title: LABELS.pausedMessage,
                debugInfo: LABELS.waitingMessage,
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
 * @param dateTime Javascript Date object
 * @return {String} date in specified format in user default locale
 */
export function formatDateHelper(dateTime) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return dateTime.toLocaleDateString(undefined, options);
}

/**
 * Convert all capatilized ElementType to title case (ie CREATE RECORDS: createAcc to Create Records: createAcc)
 * @param str all cap string
 * @return {String} title case string
 */
export function convertElementTypeToTitleCase(str) {
    if (!str.includes(':')) {
        return str;
    }
    const colon = str.indexOf(':');
    const elementType = str.substr(0, colon).replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return elementType + str.substr(colon);
}
