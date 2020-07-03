// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelLabels';
import { format } from 'builder_platform_interaction/commonUtils';

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

    copyAndUpdateDebugTraceObject() {
        this.getStartInterviewInfo();
        for (let i = 1; i < this.debugData.debugTrace.length; i++) {
            this.debugTraces.push(this.debugData.debugTrace[i]);
        }
        this.getEndInterviewInfo();
    }

    /**
     * Add the start time to Interview Started debug Info
     */
    getStartInterviewInfo() {
        const startedInfo = this.debugData.debugTrace[0].debugInfo.split([NEWLINE]).slice(1);
        startedInfo.push(format(LABELS.interviewStartedAt, this.formatDateHelper(this.debugData.startInterviewTime)));
        if (startedInfo[0].includes(LABELS.interviewStartHeader)) {
            this.debugTraces.push({
                elementApiName: startedInfo[0],
                debugInfo: startedInfo.join(NEWLINE)
            });
        }
    }

    getEndInterviewInfo() {
        let end;
        const duration = (
            (this.debugData.endInterviewTime.getTime() - this.debugData.startInterviewTime.getTime()) /
            60
        ).toFixed(2);
        switch (this.debugData.interviewStatus) {
            case FINISHED:
                end = {
                    elementApiName: LABELS.interviewFinishHeader,
                    debugInfo:
                        format(LABELS.interviewFinishedAt, this.formatDateHelper(this.debugData.endInterviewTime)) +
                        NEWLINE +
                        format(LABELS.interviewFinishDuration, duration)
                };
                break;
            case ERROR:
                end = {
                    elementApiName: LABELS.interviewError,
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

    formatDateHelper(dateTime) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return dateTime.toLocaleDateString(undefined, options);
    }
}
