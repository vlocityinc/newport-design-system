import { LightningElement, api, track } from 'lwc';
import { scheduleTriggerReducer } from './scheduleTriggerReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from './scheduleTriggerEditorLabels';
import { ELEMENT_TYPE, START_ELEMENT_FIELDS, FLOW_TRIGGER_FREQUENCY } from 'builder_platform_interaction/flowMetadata';
import { PropertyChangedEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';

const SELECTORS = {
    START_DATE: '.startDate',
    START_TIME: '.startTime'
};

const { ONCE, DAILY, WEEKLY } = FLOW_TRIGGER_FREQUENCY;

/**
 * Property Editor for scheduled trigger
 */
export default class ScheduleTriggerEditor extends LightningElement {
    /**
     * Internal state for the record change trigger editor
     */
    @track
    startElement;

    labels = LABELS;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    get node() {
        return this.startElement;
    }

    set node(newValue) {
        this.startElement = newValue || {};
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.startElement;
    }

    get elementType() {
        return ELEMENT_TYPE.START_ELEMENT;
    }

    get startDate() {
        return this.startElement.startDate ? this.startElement.startDate.value : null;
    }

    get startTime() {
        return this.startElement.startTime ? this.startElement.startTime.value : null;
    }

    get frequency() {
        return this.startElement.frequency ? this.startElement.frequency.value : ONCE;
    }

    get frequencyOptions() {
        return [
            {
                label: LABELS.triggerFrequencyOnce,
                value: ONCE
            },
            {
                label: LABELS.triggerFrequencyDaily,
                value: DAILY
            },
            {
                label: LABELS.triggerFrequencyWeekly,
                value: WEEKLY
            }
        ];
    }

    /**
     * Validates an input field leveraging built-in lightning-input validation
     * @param {String} selector - the selector for the input
     * @param {Array} errors - the errors array to append errors to
     */
    _validateInput(selector, errors) {
        const input = this.template.querySelector(selector);
        if (input && !input.reportValidity()) {
            errors.push({ key: input.name, errorString: '' });
        }
    }

    /**
     * public api function to run the rules from record change trigger validation library
     * @returns {Array} list of errors
     */
    @api
    validate() {
        const event = { type: VALIDATE_ALL };
        this.startElement = scheduleTriggerReducer(this.startElement, event);
        const errors = getErrorsFromHydratedElement(this.startElement);

        // leverage lightning-input for date + time input validation
        this._validateInput(SELECTORS.START_DATE, errors);
        this._validateInput(SELECTORS.START_TIME, errors);

        return errors;
    }

    /**
     * Updates a field by creating a PropertyChangedEvent and passing it to the reducer
     * @param {String} prop - the name of the field to update
     * @param {String} value - the value for the field
     */
    _updateField(prop, value) {
        const event = new PropertyChangedEvent(prop, value);
        this.startElement = scheduleTriggerReducer(this.startElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));
    }

    handleFrequencyChange = event => {
        this._updateField(START_ELEMENT_FIELDS.FREQUENCY, event.detail.value);
    };

    handleStartDateChange = event => {
        this._updateField(START_ELEMENT_FIELDS.START_DATE, event.detail.value);
    };

    handleStartTimeChange = event => {
        this._updateField(START_ELEMENT_FIELDS.START_TIME, event.detail.value);
    };
}
