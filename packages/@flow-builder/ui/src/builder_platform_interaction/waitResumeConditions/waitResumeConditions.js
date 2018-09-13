import { LightningElement, track } from 'lwc';
import { LABELS } from "./waitResumeConditionsLabels";

const resumeEventType = {
    timeEventType: 'TIME_EVENT_TYPE',
    platformEventType: 'PLATFORM_EVENT_TYPE'
};

export default class WaitResumeConditions extends LightningElement {
    labels = LABELS;

    /**
     * internal state for the wait-resume-condition
     */
    // TODO: W-5395888 set isPlatformEventTypeSelected and isTimeEventTypeSelected via @api to set re-displaying an existing wait node.
    @track isPlatformEventTypeSelected = false;
    @track isTimeEventTypeSelected = false;

    get resumeEventType() {
        return [{ 'label': LABELS.timeEventTypeLabel, 'value': resumeEventType.timeEventType },
            { 'label': LABELS.platformEventTypeLabel, 'value': resumeEventType.platformEventType }];
    }

    handleOptionSelected(event) {
        event.stopPropagation();
        this.isTimeEventTypeSelected = event.detail.value === resumeEventType.timeEventType;
        this.isPlatformEventTypeSelected = event.detail.value === resumeEventType.platformEventType;
    }
}