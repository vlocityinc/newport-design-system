// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './debugPanelLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import { deepCopy } from 'builder_platform_interaction/storeLib';

const FINISHED = 'FINISHED';
const ERROR = 'ERROR';
const NEWLINE = '\\n';

export default class DebugPanel extends LightningElement {
    @api debugData;
    debugTraces = [];
    errorMessage = '';

    headerTitle = LABELS.debugInspector;

    get hasErrors() {
        return this.debugData && this.debugData.error && !!this.debugData.error[0];
    }

    copyAndUpdateDebugTraceObject() {
        this.getStartInterviewInfo();
        for (let i = 1; i < this.debugData.debugTrace.length; i++) {
            this.debugTraces.push(deepCopy(this.debugData.debugTrace[i]));
        }
        this.getEndInterviewInfo();
    }

    connectedCallback() {
        if (!this.hasErrors && this.debugData && this.debugData.debugTrace) {
            this.copyAndUpdateDebugTraceObject();
        } else if (this.hasErrors) {
            this.errorMessage = format(LABELS.faultMessage, this.debugData.error);
        }
    }

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
