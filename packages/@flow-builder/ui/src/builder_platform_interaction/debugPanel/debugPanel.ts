// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelLabels';
import { format } from 'builder_platform_interaction/commonUtils';

/**
 * This is the debug panel that shows the debug run info on builder canvas (debugMode)
 *
 * - Mutate debug trace so that there's a title & body per debug accordion
 * - Add time (start time, finish time, duration)
 * - Show error if debug run fails
 */

const FINISHED = 'FINISHED';
const ERROR = 'ERROR';
const NEWLINE = '\\n';

export default class DebugPanel extends LightningElement {
    _debugData;
    debugTraces = [];

    /* this is the error message for a failed debug run, not per flow element errors */
    errorMessage = '';

    headerTitle = LABELS.debugInspector;

    get hasErrors() {
        return this.debugData && this.debugData.error && !!this.debugData.error[0];
    }

    @api
    get debugData() {
        return this._debugData;
    }

    set debugData(value) {
        this._debugData = value;
        this.updateProperties(this._debugData);
    }

    updateProperties(data) {
        this.debugTraces = [];
        if (!this.hasErrors && data && data.debugTrace) {
            this.copyAndUpdateDebugTraceObject();
        } else if (this.hasErrors) {
            this.errorMessage = format(LABELS.faultMessage, data.error);
        }
    }

    /**
     * Unable to directly mutate the passed object: this.debugData
     * So add additional start and end info and create new title field (first element in debugInfo)
     */
    copyAndUpdateDebugTraceObject() {
        this.getStartInterviewInfo();
        for (let i = 1; i < this.debugData.debugTrace.length; i++) {
            const trace = this.debugData.debugTrace[i].debugInfo.split(NEWLINE).filter(e => {
                return !!e;
            });
            this.debugTraces.push({
                title: trace[0],
                debugInfo: trace.slice(1).join(NEWLINE)
            });
        }
        this.getEndInterviewInfo();
    }

    /**
     * Add the start time to Interview Started debug Info
     */
    getStartInterviewInfo() {
        const startedInfo = this.debugData.debugTrace[0].debugInfo.split(NEWLINE).filter(e => {
            return !!e;
        });
        startedInfo.push(format(LABELS.interviewStartedAt, this.formatDateHelper(this.debugData.startInterviewTime)));
        if (startedInfo[0].includes(LABELS.interviewStartHeader)) {
            this.debugTraces.push({
                title: startedInfo[0],
                debugInfo: startedInfo.slice(1).join(NEWLINE)
            });
        }
    }

    /**
     * Adding additional trace that is not returned by backend.
     * Error/Finished Header, Interview finish time, Interview Duration
     */
    getEndInterviewInfo() {
        let end;
        /** getTime() returns ms. Converting to seconds and dividing by 10 because duration seems to be overestimated now*/
        const duration = (
            (this.debugData.endInterviewTime.getTime() - this.debugData.startInterviewTime.getTime()) /
            600
        ).toFixed(2);
        switch (this.debugData.interviewStatus) {
            case FINISHED:
                end = {
                    title: LABELS.interviewFinishHeader,
                    debugInfo:
                        format(LABELS.interviewFinishedAt, this.formatDateHelper(this.debugData.endInterviewTime)) +
                        NEWLINE +
                        format(LABELS.interviewFinishDuration, duration)
                };
                break;
            case ERROR:
                end = {
                    title: LABELS.interviewError,
                    debugInfo:
                        format(LABELS.interviewErrorAt, this.formatDateHelper(this.debugData.endInterviewTime)) +
                        NEWLINE +
                        format(LABELS.interviewFinishDuration, duration)
                };
                break;
            default:
                end = {};
                break;
        }
        this.debugTraces.push(end);
    }

    /**
     * Formats dateTime ie: July 6, 2020, 8:58AM
     * @param dateTime
     */
    formatDateHelper(dateTime) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return dateTime.toLocaleDateString(undefined, options);
    }
}
