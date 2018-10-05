import { LightningElement, track } from 'lwc';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { LABELS } from './waitPlatformEventLabels';
import { isObject } from 'builder_platform_interaction/commonUtils';

export default class WaitPlatformEvent extends LightningElement {
    labels = LABELS;

    outputParameterItem = {
        label: LABELS.platformEventOutputLabel,
        iconName: 'utility:events',
    };

    /**
     * Selected event type from the sobject picker
     */
    @track
    selectedEventType;

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get eventTypeComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.eventLabel,
            LABELS.selectEventLabel,
            null,
            false,
            true,
        );
    }

    handleEventTypeChanged(event) {
        event.stopPropagation();
        const eventTypeItem = event.detail.item;
        if (isObject(eventTypeItem)) {
            this.selectedEventType = event.detail.item.value;
        }
    }
}