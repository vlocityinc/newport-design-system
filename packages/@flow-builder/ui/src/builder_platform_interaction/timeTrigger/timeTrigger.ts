import { LightningElement, api } from 'lwc';
import { LABELS } from './timeTriggerLabels';
import { getEntity, fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';
import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { format } from 'builder_platform_interaction/commonUtils';

export default class TimeTrigger extends LightningElement {
    @api timeTrigger;
    @api object;
    @api recordTriggerType;

    labels = LABELS;
    timeSourceOptions: { label: string; value: string }[] = [];

    TIME_OPTIONS: { label: string; value: string }[] = [
        {
            label: this.labels.timeOptionDaysAfterLabel,
            value: TIME_OPTION.DAYS_AFTER
        },
        {
            label: this.labels.timeOptionDaysBeforeLabel,
            value: TIME_OPTION.DAYS_BEFORE
        },
        {
            label: this.labels.timeOptionHoursAfterLabel,
            value: TIME_OPTION.HOURS_AFTER
        },
        {
            label: this.labels.timeOptionHoursBeforeLabel,
            value: TIME_OPTION.HOURS_BEFORE
        }
    ];

    RECORD_TRIGGER_TYPE: { label: string; value: string }[] = [
        {
            label: this.labels.hoverTriggerCreated,
            value: FLOW_TRIGGER_SAVE_TYPE.CREATE
        },
        {
            label: this.labels.hoverTriggerUpdated,
            value: FLOW_TRIGGER_SAVE_TYPE.UPDATE
        },
        {
            label: this.labels.hoverTriggerDeleted,
            value: FLOW_TRIGGER_SAVE_TYPE.DELETE
        },
        {
            label: this.labels.hoverTriggerCreatedOrUpdated,
            value: FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE
        }
    ];

    get timeSourceValue() {
        return getValueFromHydratedItem(this.timeTrigger.timeSource);
    }

    get offsetNumberValue() {
        return getValueFromHydratedItem(this.timeTrigger.offsetNumber);
    }

    get offsetUnitValue() {
        return getValueFromHydratedItem(this.timeTrigger.offsetUnit);
    }

    get timeSourceComboboxOptions() {
        return this.timeSourceOptions;
    }

    connectedCallback() {
        this.updateTimeSourceOptions();
    }

    /**
     * Retrives the dropdown menu options for the time source combobox
     */
    updateTimeSourceOptions() {
        const eventDateOptions: { label: string; value: string }[] = [];
        if (this.object && this.object.value) {
            const entity = getEntity(getValueFromHydratedItem(this.object));
            const trigger = this.getTrigger(getValueFromHydratedItem(this.recordTriggerType));
            eventDateOptions.push({
                label: format(LABELS.recordTriggerEventLabel, entity.apiName, trigger),
                value: LABELS.recordTriggerEventValueLabel
            });
            fetchFieldsForEntity(entity.apiName)
                .then((fields) => {
                    Object.keys(fields).forEach((key) => {
                        if (fields[key].dataType === 'DateTime') {
                            eventDateOptions.push({
                                label: `${entity.apiName}: ${fields[key].label}`,
                                value: fields[key].apiName
                            });
                        }
                    });
                    this.timeSourceOptions = eventDateOptions;
                })
                .catch((errorMessage) => {
                    throw new Error('error: ' + errorMessage);
                });
        }
        return [];
    }

    /**
     * Retrieve the value for trigger type for composing the UI message
     * @returns trigger type
     */
    getTrigger(recTriggerType: string): string | undefined {
        const triggerType = this.RECORD_TRIGGER_TYPE.find((element) => element.value === recTriggerType);
        return triggerType ? triggerType.label : undefined;
    }

    handlePropertyChanged(event) {
        event.detail.guid = this.timeTrigger.guid;
    }

    /**
     * Handles the event for time source value change.
     * Fires the propertyChangedEvent to be handled by the parent.
     */
    handleTimeSourceValueChanged(event) {
        const propertyChangedEvent = new PropertyChangedEvent(
            'timeSource',
            event.detail.value,
            null,
            this.timeTrigger.guid
        );
        this.dispatchEvent(propertyChangedEvent);
    }

    /**
     * Handles the event for off set number focus out.
     * Fires the propertyChangedEvent to be handled by the parent.
     */
    handleOffsetNumberChanged(event) {
        const propertyChangedEvent = new PropertyChangedEvent(
            'offsetNumber',
            event.target.value,
            null,
            this.timeTrigger.guid
        );
        this.dispatchEvent(propertyChangedEvent);
    }

    /**
     * Handles the event for time offset unit change.
     * Fires the propertyChangedEvent to be handled by the parent.
     */
    handleoffsetUnitValueChanged(event) {
        const propertyChangedEvent = new PropertyChangedEvent(
            'offsetUnit',
            event.detail.value,
            null,
            this.timeTrigger.guid
        );
        this.dispatchEvent(propertyChangedEvent);
    }
}
