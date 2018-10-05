import { LightningElement, track } from 'lwc';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './waitPlatformEventLabels';
import { isObject } from 'builder_platform_interaction/commonUtils';

export default class WaitPlatformEvent extends LightningElement {
    labels = LABELS;

    /**
     * Selected event type from the sobject picker
     */
    @track
    selectedEventType;

    @track
    outputParameterItem = {
        label: LABELS.platformEventOutputLabel,
        iconName: 'utility:events',
        dataType: FLOW_DATA_TYPE.SOBJECT.value,
    };

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

    get elementType() {
        return ELEMENT_TYPE.WAIT;
    }

    handleEventTypeChanged(event) {
        event.stopPropagation();
        const eventTypeItem = event.detail.item;
        if (isObject(eventTypeItem)) {
            this.outputParameterItem.objectType = this.selectedEventType = eventTypeItem.objectType;
        }
    }
}