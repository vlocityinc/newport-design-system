import { LightningElement, api, track } from 'lwc';

import { getLocale } from 'lightning/internalLocalizationService';
import { format } from 'builder_platform_interaction/commonUtils';
import {
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_FREQUENCY,
    START_ELEMENT_FIELDS
} from 'builder_platform_interaction/flowMetadata';
import { startReducer } from './startReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';

import { LABELS } from './startEditorLabels';

const UNSET_TRIGGER_TYPE = '';

const SELECTORS = {
    START_DATE: '.startDate',
    START_TIME: '.startTime'
};

/**
 * Screen for the start element
 */
export default class StartEditor extends LightningElement {
    /**
     * Internal state for the start editor
     */
    @track
    startElement;

    labels = LABELS;

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

    /**
     * public api function to run the rules from start validation library
     * @returns {Array} list of errors
     */
    @api
    validate() {
        const event = { type: VALIDATE_ALL };
        this.startElement = startReducer(this.startElement, event);
        const errors = getErrorsFromHydratedElement(this.startElement);

        // leverage lightning-input for date + time input validation
        this._validateInput(SELECTORS.START_DATE, errors);
        this._validateInput(SELECTORS.START_TIME, errors);

        return errors;
    }

    get showScheduleSection() {
        return this.triggerType === FLOW_TRIGGER_TYPE.SCHEDULED;
    }

    get startDate() {
        return this.startElement.startDate
            ? this.startElement.startDate.value
            : null;
    }

    get startTime() {
        return this.startElement.startTime
            ? this.startElement.startTime.value
            : null;
    }

    get frequency() {
        return this.startElement.frequency
            ? this.startElement.frequency.value
            : FLOW_TRIGGER_FREQUENCY.ONCE;
    }

    get frequencyOptions() {
        return [
            {
                label: LABELS.triggerFrequencyOnce,
                value: FLOW_TRIGGER_FREQUENCY.ONCE
            },
            {
                label: LABELS.triggerFrequencyDaily,
                value: FLOW_TRIGGER_FREQUENCY.DAILY
            },
            {
                label: LABELS.triggerFrequencyWeekly,
                value: FLOW_TRIGGER_FREQUENCY.WEEKLY
            }
        ];
    }

    get triggerType() {
        return this.startElement.triggerType
            ? this.startElement.triggerType.value
            : UNSET_TRIGGER_TYPE;
    }

    get triggerTypeOptions() {
        return [
            {
                label: LABELS.triggerTypeAutomatically,
                value: UNSET_TRIGGER_TYPE
            },
            {
                label: LABELS.triggerTypeScheduled,
                value: FLOW_TRIGGER_TYPE.SCHEDULED
            }
        ];
    }

    get startTimeInputHelp() {
        return format(this.labels.startTimeInputHelp, getLocale().timezone);
    }

    handleTriggerTypeChange = event => {
        this._updateField(
            START_ELEMENT_FIELDS.TRIGGER_TYPE,
            event.detail.value
        );
    };

    handleFrequencyChange = event => {
        this._updateField(START_ELEMENT_FIELDS.FREQUENCY, event.detail.value);
    };

    handleStartDateChange = event => {
        this._updateField(START_ELEMENT_FIELDS.START_DATE, event.detail.value);
    };

    handleStartTimeChange = event => {
        this._updateField(START_ELEMENT_FIELDS.START_TIME, event.detail.value);
    };

    /**
     * Updates a field by creating a PropertyChangedEvent and passing it to the reducer
     * @param {String} prop - the name of the field to update
     * @param {String} value - the value for the field
     */
    _updateField(prop, value) {
        const event = new PropertyChangedEvent(prop, value);
        this.startElement = startReducer(this.startElement, event);
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
}
