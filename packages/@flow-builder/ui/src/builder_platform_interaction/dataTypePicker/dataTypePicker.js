import { LightningElement, api, track } from 'lwc';
import { LABELS } from './dataTypePickerLabels';
import {
    FLOW_DATA_TYPE,
    SCALE_RANGE,
    SCALE_DEFAULT
} from 'builder_platform_interaction/dataTypeLib';
import { ValueChangedEvent } from 'builder_platform_interaction/events';

export default class DataTypePicker extends LightningElement {
    labels = LABELS;
    scaleRange = SCALE_RANGE;

    @track
    state = {};

    @track
    comboboxError;

    @api
    availableDataTypes = Object.values(FLOW_DATA_TYPE);

    @api
    typeAndCollectionDisabled = false;

    @api
    scaleDisabled = false;

    /**
     * Allow to edit the scale for datatypes that support scale (Currency and Number)
     */
    @api
    allowScale = false;

    /**
     * Allow to select a collection. If true a checkbox is displayed to select if datatype is a collection or not
     */
    @api
    allowCollection = false;

    @api
    required = false;

    @api
    collectionHelpText = null;

    @api
    helpText = null;

    @api
    className = 'slds-size_1-of-2';

    /**
     * @typedef {Object} SelectedDataType
     *
     * @property {string} newValue.dataType - the selected data type
     * @property {number} [newValue.scale] - scale for the selected data type (only for Currency and Number)
     * @property {boolean} [newValue.isCollection] - true if data type is a collection
     */

    /**
     * @return {SelectedDataType} - the selected data type
     */
    @api
    get value() {
        return this.state;
    }

    /**
     * @param {SelectedDataType} newValue - the selected data type
     */
    set value(newValue) {
        this.state = { ...newValue };
    }

    get showScale() {
        return (
            this.allowScale &&
            !this.state.isCollection &&
            (this.state.dataType === FLOW_DATA_TYPE.NUMBER.value ||
                this.state.dataType === FLOW_DATA_TYPE.CURRENCY.value)
        );
    }

    get comboboxClasses() {
        return `slds-form-element slds-col slds-grow ${this.className}`;
    }

    set comboboxErrorMessage(errorMessage) {
        this.comboboxError = errorMessage;
        this.validate();
    }

    @api
    get comboboxErrorMessage() {
        return this.comboboxError;
    }

    validate() {
        const comboboxInstance = this.getCombobox();
        if (comboboxInstance) {
            // set the custom validity to our error message
            comboboxInstance.setCustomValidity(this.comboboxError);
            // we only want to trigger validation if we have a property editor error message
            if (this.comboboxError) {
                comboboxInstance.showHelpMessageIfInvalid();
            }
        }
    }

    getCombobox() {
        return this.template.querySelector('lightning-combobox');
    }

    handleDataTypeChanged(event) {
        event.stopPropagation();
        this.state.dataType = event.detail.value;
        if (this.allowScale) {
            this.state.scale = SCALE_DEFAULT;
        }
        this.dispatchValueChangedEvent();
    }

    handleScaleBlur(event) {
        let newScale = Number(event.target.value);
        if (Number.isNaN(newScale)) {
            newScale = SCALE_DEFAULT;
        }
        newScale = Math.trunc(newScale);
        if (newScale > SCALE_RANGE.max) {
            newScale = SCALE_RANGE.max;
        }
        if (newScale < SCALE_RANGE.min) {
            newScale = SCALE_RANGE.min;
        }
        event.target.value = newScale;
        if (!event.target.valid) {
            event.target.reportValidity();
        }
        if (newScale !== this.state.scale) {
            this.state.scale = newScale;
            this.dispatchValueChangedEvent();
        }
    }

    handleScaleChanged(event) {
        event.stopPropagation();
    }

    handleCollectionChange(event) {
        event.stopPropagation();
        this.state.isCollection = event.detail.checked;
        this.dispatchValueChangedEvent();
    }

    dispatchValueChangedEvent() {
        const valueChangedEvent = new ValueChangedEvent(this.state);
        this.dispatchEvent(valueChangedEvent);
    }
}
