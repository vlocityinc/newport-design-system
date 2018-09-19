import { LightningElement, api, track } from 'lwc';
import { LABELS } from "./waitEventLabels";
import {
    DeleteWaitEventEvent,
} from "builder_platform_interaction/events";

export default class WaitEvent extends LightningElement {
    labels = LABELS;

    @track element;

    @api get waitEvent() {
        return this.element;
    }

    set waitEvent(waitEvent) {
        this.element = waitEvent;
    }

    @api showDelete;

    handleDelete(event) {
        event.stopPropagation();

        const deleteWaitEventEvent = new DeleteWaitEventEvent(this.element.guid);
        this.dispatchEvent(deleteWaitEventEvent);
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
