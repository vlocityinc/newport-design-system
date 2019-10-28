import { LightningElement, api, track } from 'lwc';
import {
    fetchFieldsForEntity,
    getAllEntities
} from 'builder_platform_interaction/sobjectLib';
import {
    ELEMENT_TYPE,
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    FLOW_TRIGGER_FREQUENCY,
    START_ELEMENT_FIELDS
} from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { startReducer } from './startReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { LABELS } from './startEditorLabels';
import { orgHasBeforeSaveEnabled } from 'builder_platform_interaction/contextLib';

const UNSET_TRIGGER_SAVE_TYPE = '';

const SELECTORS = {
    START_DATE: '.startDate',
    START_TIME: '.startTime'
};

const { CREATE, UPDATE, CREATE_OR_UPDATE } = FLOW_TRIGGER_SAVE_TYPE;
const { NONE, BEFORE_SAVE, SCHEDULED } = FLOW_TRIGGER_TYPE;
const { ONCE, DAILY, WEEKLY } = FLOW_TRIGGER_FREQUENCY;

const noneRadioOption = { label: LABELS.triggerTypeAutomatically, value: NONE };
const beforeSaveRadioOption = {
    label: LABELS.triggerTypeRecordUpdateOrCreate,
    value: BEFORE_SAVE
};
const scheduledRadioOption = {
    label: LABELS.triggerTypeScheduled,
    value: SCHEDULED
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

    @track
    fields;

    labels = LABELS;

    @api
    get node() {
        return this.startElement;
    }

    set node(newValue) {
        this.startElement = newValue || {};
        this.updateFields();
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

    get elementType() {
        return ELEMENT_TYPE.START_ELEMENT;
    }

    get showScheduleSection() {
        return this.triggerType === SCHEDULED;
    }

    get showRecordCreateOrUpdate() {
        return this.triggerType === BEFORE_SAVE;
    }

    get showObjectSection() {
        return (
            this.triggerType === SCHEDULED || this.triggerType === BEFORE_SAVE
        );
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
            : ONCE;
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

    get triggerType() {
        return this.startElement.triggerType.value;
    }

    get saveType() {
        return this.startElement.saveType
            ? this.startElement.saveType.value
            : UNSET_TRIGGER_SAVE_TYPE;
    }

    get triggerObjectSectionHeader() {
        switch (this.triggerType) {
            case BEFORE_SAVE:
                return this.labels.createOrUpdateSectionHeader;
            case SCHEDULED:
                return this.labels.chooseObjectAndRecord;
            default:
                return 'unsupported trigger type';
        }
    }

    get triggerTypeOptions() {
        const triggerOptions = [noneRadioOption, scheduledRadioOption];

        // Checking if before save is enabled
        if (orgHasBeforeSaveEnabled()) {
            triggerOptions.splice(1, 0, beforeSaveRadioOption);
        }

        return triggerOptions;
    }

    get createOrUpdateOptions() {
        return [
            {
                label: LABELS.triggerTypeCreated,
                value: CREATE
            },
            {
                label: LABELS.triggerTypeUpdated,
                value: UPDATE
            },
            {
                label: LABELS.triggerTypeCreatedOrUpdated,
                value: CREATE_OR_UPDATE
            }
        ];
    }

    get flowTriggerDescription() {
        switch (this.triggerType) {
            case NONE:
                return this.labels.autoLaunchTriggerDescription;
            case BEFORE_SAVE:
                return this.labels.createOrUpdateTriggerDescription;
            case SCHEDULED:
                return this.labels.scheduledTriggerDescription;
            default:
                return 'unsupported trigger type';
        }
    }

    // TODO W-6568649
    // Regex used to remove "({0})" and any leading single whitespace
    get startTimeInputHelp() {
        return this.labels.startTimeInputHelp.replace(/\s?\(\{(\d+)\}\)/gm, '');
    }

    /**
     * @returns {Object} configuration to pass to entity-resource-picker component
     */
    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object, // Label
            this.labels.objectPlaceholder, // Placeholder
            this.startElement.object.error, // errorMessage
            false, // literalsAllowed
            false, // required
            false, // disabled
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    /**
     * @returns {Object} configuration to pass to entity-resource-picker component. This is a required field
     */
    get entityComboboxConfigRequired() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object, // Label
            this.labels.objectPlaceholder, // Placeholder
            this.startElement.object.error, // errorMessage
            false, // literalsAllowed
            true, // required
            false, // disabled
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    /**
     * @returns {string} entity label if any found for current selected entity empty string otherwise
     */
    get resourceDisplayText() {
        const entityToDisplay = getAllEntities().find(
            entity => entity.apiName === this.recordEntityName
        );
        return entityToDisplay ? entityToDisplay.entityLabel : '';
    }

    /**
     * set the entity name (object) and load fields accordingly
     * @param {string} newValue - new entity name
     */
    set recordEntityName(newValue) {
        this.startElement.object.value = newValue;
        this.updateFields();
    }

    /**
     * @returns {string} entity name (object)
     */
    get recordEntityName() {
        return this.startElement.object.value;
    }

    get showRecordFilterSection() {
        return this.recordEntityName && this.showScheduleSection;
    }

    /**
     * @returns {Object} the entity fields
     */
    get recordFields() {
        return this.fields;
    }

    handleTriggerTypeChange = event => {
        this._updateField(
            START_ELEMENT_FIELDS.TRIGGER_TYPE,
            event.detail.value
        );
    };

    handleTriggerSaveTypeChange = event => {
        this._updateField(
            START_ELEMENT_FIELDS.TRIGGER_SAVE_TYPE,
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
     * @param {Object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        const { item, error, displayText } = event.detail;
        const oldRecordEntityName = this.recordEntityName;
        const newRecordEntityName = (item && item.value) || displayText;
        if (newRecordEntityName !== oldRecordEntityName) {
            this.updateProperty(
                'object',
                newRecordEntityName,
                error,
                false,
                oldRecordEntityName
            );
            this.recordEntityName = newRecordEntityName;
        }
    }

    /**
     * Handle filterType change and via reducer update element's state accordingly
     * @param {Object} event - event
     */
    handleFilterTypeChanged(event) {
        event.stopPropagation();
        const { filterType, error } = event.detail;
        this.updateProperty(
            'filterType',
            filterType,
            error,
            true,
            this.startElement.filterType
        );
    }

    /**
     * @param {Object} event - property changed event coming from label-description component or the list item changed events (add/update/delete)
     */
    handlePropertyOrListItemChanged(event) {
        event.stopPropagation();
        this.startElement = startReducer(this.startElement, event);
    }

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

    /**
     * update the fields of the selected entity
     */
    updateFields() {
        this.fields = {};
        if (this.recordEntityName) {
            fetchFieldsForEntity(this.recordEntityName)
                .then(fields => {
                    this.fields = fields;
                })
                .catch(() => {
                    // fetchFieldsForEntity displays an error message
                });
        }
    }

    /**
     * Instantiates property changed event based to handle property change and updating via element's reducer state accordingly
     * @param {string} propertyName - name of the property changed
     * @param {Object|string|boolean} newValue - new value to be passed to property
     * @param {string} error - error on property
     * @param {boolean} ignoreValidate - true if we do not want to have specific property validation
     * @param {Object|string|boolean} oldValue - property's previous value
     */
    updateProperty(propertyName, newValue, error, ignoreValidate, oldValue) {
        const propChangedEvent = new PropertyChangedEvent(
            propertyName,
            newValue,
            error,
            null,
            oldValue
        );
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.startElement = startReducer(this.startElement, propChangedEvent);
    }
}
