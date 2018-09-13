import { LightningElement, api, track } from 'lwc';
import { LABELS } from "./waitEventLabels";

export default class WaitEvent extends LightningElement {
    labels = LABELS;

    @track element;

    @api get waitEvent() {
        return this.element;
    }

    set waitEvent(waitEvent) {
        this.element = waitEvent;
    }

    handleDelete(event) {
        event.stopPropagation();
        // do nothing for now
    }

    handlePropertyChanged(event) {
        event.stopPropagation();
        // do nothing for now
    }

    get upperCaseWaitConditionsTabText() {
        return LABELS.waitConditionsTabText.toUpperCase();
    }

    get upperCaseResumeConditionsTabText() {
        return LABELS.resumeConditionsTabText.toUpperCase();
    }
}
