import { RepeatScheduleFrequencyChangedEvent } from 'builder_platform_interaction/events';
import { api, LightningElement } from 'lwc';
import { LABELS } from './repeatScheduleLabels';

export default class RepeatSchedule extends LightningElement {
    labels = LABELS;

    @api
    repeatScheduleOptions: UI.RepeatScheduleOptions = [];

    @api
    value;

    handleFrequencyChange = (event) => {
        event.stopPropagation();
        this.dispatchEvent(new RepeatScheduleFrequencyChangedEvent(event.detail.value));
    };
}
