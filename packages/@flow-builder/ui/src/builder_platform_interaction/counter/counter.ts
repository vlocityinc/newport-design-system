import { ValueChangedEvent } from 'builder_platform_interaction/events';
import { api, LightningElement } from 'lwc';
import { LABELS } from './counterLabels';

export default class Counter extends LightningElement {
    @api count;
    labels = LABELS;

    handleIncrement() {
        this.dispatchValueChangedEvent(++this.count);
    }

    handleDecrement() {
        if (this.count > 0) {
            this.dispatchValueChangedEvent(--this.count);
        }
    }

    dispatchValueChangedEvent(value) {
        const valueChangedEvent = new ValueChangedEvent(value);
        this.dispatchEvent(valueChangedEvent);
    }
}
