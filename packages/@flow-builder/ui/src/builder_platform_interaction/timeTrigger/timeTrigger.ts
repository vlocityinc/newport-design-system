import { LightningElement, api } from 'lwc';
import { LABELS } from './timeTriggerLabels';
import { getEntity, fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { PropertyChangedEvent, DeleteTimeTriggerEvent } from 'builder_platform_interaction/events';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';
import { FLOW_TRIGGER_SAVE_TYPE, RECORD_TIGGER_EVENT } from 'builder_platform_interaction/flowMetadata';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { format } from 'builder_platform_interaction/commonUtils';
import { RECORD_TRIGGER_TYPE_LABEL_LOOKUP } from 'builder_platform_interaction/triggerTypeLib';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    TIME_SOURCE_COMBOBOX: '.timeSourceCombobox',
    OFFSET_NUMBER_INPUT: '.offsetNumberInput',
    OFFSET_UNIT: '.offsetUnitAndDirectionCombobox'
};

export default class TimeTrigger extends LightningElement {
    @api timeTrigger;
    @api object;
    @api recordTriggerType;

    labels = LABELS;
    timeSourceOptions: { label: string; value: string }[] = [];

    /** Focus the label field of the label description component */
    @api focus() {
        const labelDescription = this.template.querySelector(SELECTORS.LABEL_DESCRIPTION);
        labelDescription.focus();
    }

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

    RECORD_TRIGGER_EVENT_LABEL_LOOKUP = {
        [FLOW_TRIGGER_SAVE_TYPE.CREATE]: this.labels.startElementRecordCreated,
        [FLOW_TRIGGER_SAVE_TYPE.UPDATE]: this.labels.startElementRecordUpdated,
        [FLOW_TRIGGER_SAVE_TYPE.DELETE]: this.labels.startElementRecordDeleted,
        [FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE]: this.labels.startElementRecordCreatedUpdated
    };

    get timeTriggerDescriptionLabel() {
        return format(
            LABELS.scheduledPathDescription,
            RECORD_TRIGGER_TYPE_LABEL_LOOKUP[getValueFromHydratedItem(this.recordTriggerType)]
        );
    }

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
            eventDateOptions.push({
                label: format(
                    this.RECORD_TRIGGER_EVENT_LABEL_LOOKUP[getValueFromHydratedItem(this.recordTriggerType)],
                    entity.apiName
                ),
                value: RECORD_TIGGER_EVENT
            });
            fetchFieldsForEntity(entity.apiName)
                .then((fields) => {
                    Object.keys(fields).forEach((key) => {
                        if (
                            fields[key].isWorkflowFilterable &&
                            (fields[key].dataType === 'DateTime' || fields[key].dataType === 'Date')
                        ) {
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

    renderedCallback() {
        const timeSourceCombobox = this.template.querySelector(SELECTORS.TIME_SOURCE_COMBOBOX);
        this.resetError(timeSourceCombobox, this.timeTrigger.timeSource.error);
        this.setInputErrorMessage(timeSourceCombobox, this.timeTrigger.timeSource.error);

        const offsetNumberInput = this.template.querySelector(SELECTORS.OFFSET_NUMBER_INPUT);
        this.resetError(offsetNumberInput, this.timeTrigger.offsetNumber.error);
        this.setInputErrorMessage(offsetNumberInput, this.timeTrigger.offsetNumber.error);

        const offsetUnitCombobox = this.template.querySelector(SELECTORS.OFFSET_UNIT);
        this.resetError(offsetUnitCombobox, this.timeTrigger.offsetUnit.error);
        this.setInputErrorMessage(offsetUnitCombobox, this.timeTrigger.offsetUnit.error);
    }

    /**
     * Reset the error of the input
     * The lightning-input component does not provide an easy way to reset errors
     * We need to remove requiredness (our only constraint) and report validity
     * Then put the constraint back to its prevous state
     */
    resetError(element, error) {
        if (element && !error) {
            element.required = false;
            element.setCustomValidity('');
            element.showHelpMessageIfInvalid();
            element.required = true;
        }
    }

    /** Sets the CustomValidity if there is a valid error message.
     * @param element - the input component
     * @param error - the current error of the element
     */
    setInputErrorMessage(element, error) {
        if (element && error) {
            element.setCustomValidity(error);
            element.showHelpMessageIfInvalid();
        }
    }

    /**
     * @param {object} event - Click Event to delete the time trigger
     */
    handleDelete(event) {
        event.stopPropagation();

        const deleteTimeTriggerEvent = new DeleteTimeTriggerEvent(this.timeTrigger.guid);
        this.dispatchEvent(deleteTimeTriggerEvent);
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
     * Handles the TimeSource focus out event.
     * Fires the propertyChangedEvent for the parent to do combobox property validation.
     */
    handleTimeSourceFocusOut() {
        const propertyChangedEvent = new PropertyChangedEvent(
            'timeSource',
            this.timeTrigger.timeSource.value,
            null,
            this.timeTrigger.guid
        );
        this.dispatchEvent(propertyChangedEvent);
    }

    /**
     * Handles the OffsetUnit focus out event.
     * Fires the propertyChangedEvent for the parent to do combobox property validation.
     */
    handleOffsetUnitFocusOut() {
        const propertyChangedEvent = new PropertyChangedEvent(
            'offsetUnit',
            this.timeTrigger.offsetUnit.value,
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
