import getDefaultTimeZone from '@salesforce/apex/interaction.FlowBuilderController.getDefaultTimeZone';
import getTimeZones from '@salesforce/apex/interaction.FlowBuilderController.getTimeZones';
import { ValueChangedEvent } from 'builder_platform_interaction/events';
import { api, LightningElement, wire } from 'lwc';
import { LABELS } from './timeZonePickerLabels';

/**
 * Time Zone picker that uses the base lightning-combobox component. The picker displays
 * the available time zones where each display is the GMT offset, time zone, and time zone id
 * The value is the timeZoneId of the time zone that was selected
 */
export default class TimeZonePicker extends LightningElement {
    /**
     * the timeZoneId selected ie "America/New_York"
     *
     */
    @api
    value!: string | null;

    @wire(getTimeZones)
    timeZoneData;

    @wire(getDefaultTimeZone)
    wiredDefaultTimeZone({ data: defaultTimeZone }) {
        // the picker does not have a value, use the default time zone instead
        if (defaultTimeZone && !this.value) {
            const defaultTimeZoneId = defaultTimeZone.apiValue;
            this.dispatchEvent(new ValueChangedEvent(defaultTimeZoneId));
        }
    }

    get label() {
        return LABELS.timeZoneLabel;
    }

    get timeZoneOptions() {
        return (this.timeZoneData?.data || []).map((timezone) => {
            return {
                value: timezone.apiValue,
                label: timezone.display
            };
        });
    }

    handleTimeZoneChange(event) {
        event.stopPropagation();
        const timeZoneId = event.detail?.value;
        this.dispatchEvent(new ValueChangedEvent(timeZoneId));
    }
}
