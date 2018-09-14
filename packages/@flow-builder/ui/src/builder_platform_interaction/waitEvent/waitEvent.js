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

    @api showDelete;

    handleDelete(event) {
        event.stopPropagation();

        // TODO as part of current story: refactor the delete outcome event to be generic for both outcomes and wait events
        // https://gus.lightning.force.com/a07B0000004YWEKIA4

        // const deleteWaitEventEvent = new DeleteOutcomeEvent(this.outcome.guid);
        // this.dispatchEvent(deleteOutcomeEvent);
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
