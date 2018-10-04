import { LightningElement, api, track } from 'lwc';
import { LABELS } from "./waitResumeConditionsLabels";

const resumeEventType = {
    timeEventType: 'TIME_EVENT_TYPE',
    platformEventType: 'PLATFORM_EVENT_TYPE'
};

export default class WaitResumeConditions extends LightningElement {
    /**
     * The input parameters that defines the resume time for this wait event
     * @type {module:WaitTimeEvent.ResumeTimeParameter}
     */
    @api
    resumeTimeParameters;

    /**
     * The event type
     * @type {String}
     */
    @api
    eventType;

    /**
     * internal state for the wait-resume-condition
     */
    // TODO: W-5395888 set resumeEventType via @api to set re-displaying an existing wait node.
    @track
    resumeEventType = resumeEventType.timeEventType;

    labels = LABELS;

    resumeEventTypeOptions = [
        { 'label': LABELS.timeEventTypeLabel, 'value': resumeEventType.timeEventType },
        { 'label': LABELS.platformEventTypeLabel, 'value': resumeEventType.platformEventType},
    ];

    get isPlatformEventTypeSelected() {
        return this.resumeEventType === resumeEventType.platformEventType;
    }

    get isTimeEventTypeSelected() {
        return this.resumeEventType === resumeEventType.timeEventType;
    }

    handleOptionSelected(event) {
        event.stopPropagation();
        this.resumeEventType = event.detail.value;
    }
}