import { LightningElement, api, track } from 'lwc';
import { recordChangeTriggerReducer } from './recordChangeTriggerReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from './recordChangeTriggerLabels';
import {
    ELEMENT_TYPE,
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    START_ELEMENT_FIELDS
} from 'builder_platform_interaction/flowMetadata';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';

const { CREATE, UPDATE, CREATE_AND_UPDATE } = FLOW_TRIGGER_SAVE_TYPE;
const { BEFORE_SAVE, AFTER_SAVE } = FLOW_TRIGGER_TYPE;

/**
 * Property Editor record change trigger
 */
export default class RecordChangeTriggerEditor extends LightningElement {
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

    get triggerType() {
        return this.startElement.triggerType ? this.startElement.triggerType.value : BEFORE_SAVE;
    }

    get saveType() {
        return this.startElement.recordTriggerType ? this.startElement.recordTriggerType.value : CREATE;
    }

    get createOrUpdateOptions() {
        return [
            {
                label: LABELS.recordTriggerTypeCreated,
                value: CREATE
            },
            {
                label: LABELS.recordTriggerTypeUpdated,
                value: UPDATE
            },
            {
                label: LABELS.recordTriggerTypeCreatedOrUpdated,
                value: CREATE_AND_UPDATE
            }
        ];
    }

    get triggerTypeOptions() {
        return [
            {
                label: LABELS.triggerTypeBeforeSave,
                value: BEFORE_SAVE
            },
            {
                label: LABELS.triggerTypeAfterSave,
                value: AFTER_SAVE
            }
        ];
    }

    get isBeforeSave() {
        return this.startElement.triggerType.value === BEFORE_SAVE;
    }

    get isAfterSave() {
        return this.startElement.triggerType.value === AFTER_SAVE;
    }

    /**
     * public api function to run the rules from record change trigger validation library
     * @returns {Array} list of errors
     */
    @api
    validate() {
        const event = { type: VALIDATE_ALL };
        this.startElement = recordChangeTriggerReducer(this.startElement, event);

        return getErrorsFromHydratedElement(this.startElement);
    }

    /**
     * Updates a field by creating a PropertyChangedEvent and passing it to the reducer
     * @param {String} prop - the name of the field to update
     * @param {String} value - the value for the field
     */
    _updateField(prop, value) {
        const event = new PropertyChangedEvent(prop, value);
        this.startElement = recordChangeTriggerReducer(this.startElement, event);
    }

    handleTriggerSaveTypeChange = event => {
        this._updateField(START_ELEMENT_FIELDS.TRIGGER_SAVE_TYPE, event.detail.value);
    };

    handleTypeBeforeSave() {
        this._updateField(START_ELEMENT_FIELDS.TRIGGER_TYPE, BEFORE_SAVE);
    }

    handleTypeAfterSave() {
        this._updateField(START_ELEMENT_FIELDS.TRIGGER_TYPE, AFTER_SAVE);
    }
}
