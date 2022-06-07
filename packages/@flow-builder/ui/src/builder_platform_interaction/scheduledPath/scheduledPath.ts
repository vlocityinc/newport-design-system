import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { DeleteScheduledPathEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import { FLOW_TRIGGER_SAVE_TYPE, RECORD_TIGGER_EVENT, TIME_OPTION } from 'builder_platform_interaction/flowMetadata';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { fetchFieldsForEntity, getEntity } from 'builder_platform_interaction/sobjectLib';
import { RECORD_TRIGGER_TYPE_LABEL_LOOKUP } from 'builder_platform_interaction/triggerTypeLib';
import { api, LightningElement } from 'lwc';
import { LABELS } from './scheduledPathLabels';
const { format } = commonUtils;

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    TIME_SOURCE_COMBOBOX: '.timeSourceCombobox',
    OFFSET_NUMBER_INPUT: '.offsetNumberInput',
    OFFSET_UNIT: '.offsetUnitAndDirectionCombobox',
    BATCH_SIZE_INPUT: '.batchSizeInput'
};

export default class ScheduledPath extends LightningElement {
    @api scheduledPath;
    @api object;
    @api recordTriggerType;

    labels = LABELS;
    timeSourceOptions: { label: string; value: string }[] = [];

    /** Focus the label field of the label description component */
    @api focus() {
        const labelDescription = this.template.querySelector(SELECTORS.LABEL_DESCRIPTION) as HTMLElement;
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
        },
        {
            label: this.labels.timeOptionMinutesAfterLabel,
            value: TIME_OPTION.MINUTES_AFTER
        },
        {
            label: this.labels.timeOptionMinutesBeforeLabel,
            value: TIME_OPTION.MINUTES_BEFORE
        },
        {
            label: this.labels.timeOptionMonthsAfterLabel,
            value: TIME_OPTION.MONTHS_AFTER
        },
        {
            label: this.labels.timeOptionMonthsBeforeLabel,
            value: TIME_OPTION.MONTHS_BEFORE
        }
    ];

    RECORD_TRIGGER_EVENT_LABEL_LOOKUP = {
        [FLOW_TRIGGER_SAVE_TYPE.CREATE]: this.labels.startElementRecordCreated,
        [FLOW_TRIGGER_SAVE_TYPE.UPDATE]: this.labels.startElementRecordUpdated,
        [FLOW_TRIGGER_SAVE_TYPE.DELETE]: this.labels.startElementRecordDeleted,
        [FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE]: this.labels.startElementRecordCreatedUpdated
    };

    get scheduledPathDescriptionLabel() {
        return format(
            LABELS.scheduledPathDescription,
            RECORD_TRIGGER_TYPE_LABEL_LOOKUP[getValueFromHydratedItem(this.recordTriggerType)]
        );
    }

    get timeSourceValue() {
        return getValueFromHydratedItem(this.scheduledPath.timeSource);
    }

    get offsetNumberValue() {
        return getValueFromHydratedItem(this.scheduledPath.offsetNumber);
    }

    get offsetUnitValue() {
        return getValueFromHydratedItem(this.scheduledPath.offsetUnit);
    }

    get timeSourceComboboxOptions() {
        return this.timeSourceOptions;
    }

    get batchSizeNumberValue() {
        const val = getValueFromHydratedItem(this.scheduledPath.maxBatchSize);
        // TODO: if unset maxBatchSize default value of scheduledPath is no longer 0, this condition can be removed
        return val === 0 ? null : val;
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
            const entity = getEntity(getValueFromHydratedItem(this.object))!;
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
        this.resetError(timeSourceCombobox, this.scheduledPath.timeSource.error);
        this.setInputErrorMessage(timeSourceCombobox, this.scheduledPath.timeSource.error);

        const offsetNumberInput = this.template.querySelector(SELECTORS.OFFSET_NUMBER_INPUT);
        this.resetError(offsetNumberInput, this.scheduledPath.offsetNumber.error);
        this.setInputErrorMessage(offsetNumberInput, this.scheduledPath.offsetNumber.error);

        const offsetUnitCombobox = this.template.querySelector(SELECTORS.OFFSET_UNIT);
        this.resetError(offsetUnitCombobox, this.scheduledPath.offsetUnit.error);
        this.setInputErrorMessage(offsetUnitCombobox, this.scheduledPath.offsetUnit.error);

        const batchSizeInput = this.template.querySelector(SELECTORS.BATCH_SIZE_INPUT) as any;
        if (batchSizeInput.value) {
            this.resetError(batchSizeInput, this.scheduledPath.maxBatchSize.error, false);
            this.setInputErrorMessage(batchSizeInput, this.scheduledPath.maxBatchSize.error);
        }
    }

    /**
     * Reset the error of the input
     * The lightning-input component does not provide an easy way to reset errors
     * We need to remove requiredness (our only constraint) and report validity
     * Then put the constraint back to its previous state
     *
     * @param element - the input element
     * @param error - the current error of the element
     * @param isRequired - the previous state of the constraint, default value is true, which means the input element is requried
     */
    resetError(element, error, isRequired = true) {
        if (element && !error) {
            element.required = false;
            element.setCustomValidity('');
            element.showHelpMessageIfInvalid();
            element.required = isRequired;
        }
    }

    /**
     * Sets the CustomValidity if there is a valid error message.
     *
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
     * @param {object} event - Click Event to delete the scheduled path
     */
    handleDelete(event) {
        event.stopPropagation();

        const deleteScheduledPathEvent = new DeleteScheduledPathEvent(this.scheduledPath.guid);
        this.dispatchEvent(deleteScheduledPathEvent);
    }

    handlePropertyChanged(event) {
        event.detail.guid = this.scheduledPath.guid;
    }

    /**
     * Handles the event for time source value change.
     * Fires the propertyChangedEvent to be handled by the parent.
     *
     * @param event
     */
    handleTimeSourceValueChanged(event) {
        const propertyChangedEvent = new PropertyChangedEvent(
            'timeSource',
            event.detail.value,
            null,
            this.scheduledPath.guid
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
            this.scheduledPath.timeSource.value,
            null,
            this.scheduledPath.guid
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
            this.scheduledPath.offsetUnit.value,
            null,
            this.scheduledPath.guid
        );
        this.dispatchEvent(propertyChangedEvent);
    }

    /**
     * Handles the event for off set number focus out.
     * Fires the propertyChangedEvent to be handled by the parent.
     *
     * @param event
     */
    handleOffsetNumberChanged(event) {
        const propertyChangedEvent = new PropertyChangedEvent(
            'offsetNumber',
            event.target.value,
            null,
            this.scheduledPath.guid
        );
        this.dispatchEvent(propertyChangedEvent);
    }

    /**
     * Handles the event for time offset unit change.
     * Fires the propertyChangedEvent to be handled by the parent.
     *
     * @param event
     */
    handleoffsetUnitValueChanged(event) {
        const propertyChangedEvent = new PropertyChangedEvent(
            'offsetUnit',
            event.detail.value,
            null,
            this.scheduledPath.guid
        );
        this.dispatchEvent(propertyChangedEvent);
    }

    /**
     * Handles the event for batch size change under Advanced Options.
     * Fires the propertyChangedEvent to be handled by the parent.
     *
     * @param event - the event fires when batch size input component is about to lose focus
     */
    handleBatchSizeNumberChanged(event) {
        const propertyChangedEvent = new PropertyChangedEvent(
            'maxBatchSize',
            event.target.value,
            null,
            this.scheduledPath.guid
        );
        this.dispatchEvent(propertyChangedEvent);
    }
}
