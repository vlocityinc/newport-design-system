import { LightningElement } from 'lwc';
import { LABELS } from "./waitTimeEventLabels";

const timeEventType = {
    absoluteTime: 'ABSOLUTE_TIME',
    directRecordTime: 'DIRECT_RECORD_TIME'
};

export default class WaitTimeEvent extends LightningElement {
    labels = LABELS;

    get timeTypeValueOptions() {
        return [{ 'label': LABELS.absoluteTimeLabel, 'value': timeEventType.absoluteTime },
            { 'label': LABELS.directRecordTimeLabel, 'value': timeEventType.directRecordTime }];
    }

    get timeTypeValue() {
        return null;
    }

    handletimeTypeValueChanged(event) {
        event.stopPropagation();
        // do nothing for now
    }
}