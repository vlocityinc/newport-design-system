import getDefaultTimeZone from '@salesforce/apex/interaction.FlowBuilderController.getDefaultTimeZone';
import getTimeZones from '@salesforce/apex/interaction.FlowBuilderController.getTimeZones';
import { ValueChangedEvent } from 'builder_platform_interaction/events';
import { SORT_ORDER } from 'builder_platform_interaction/recordEditorLib';
import { stringComparator } from 'builder_platform_interaction/sortLib';
import { api, LightningElement, wire } from 'lwc';
import { LABELS } from './timeZonePickerLabels';

/**
 * Time Zone picker that uses the base lightning-combobox component. The picker displays
 * the available time zones where each display is the GMT offset, time zone, and time zone id
 * The value is the timeZoneSidKey of the time zone that was selected
 */
export default class TimeZonePicker extends LightningElement {
    /**
     * the timeZoneSidKey selected ie "America/New_York"
     *
     */
    @api
    value!: string | null;

    @api
    required = false;

    // sort option
    @api
    sortOrder: Metadata.SortOrder = SORT_ORDER.ASC;

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
        const options = (this.timeZoneData?.data || []).map((timezone) => {
            return {
                value: timezone.apiValue,
                label: timezone.display
            };
        });
        // sort options by label
        return options.sort(stringComparator('label', this.sortOrder === SORT_ORDER.DESC));
    }

    handleTimeZoneChange(event) {
        event.stopPropagation();
        const timeZoneSidKey = event.detail?.value;
        this.dispatchEvent(new ValueChangedEvent(timeZoneSidKey));
    }
}
