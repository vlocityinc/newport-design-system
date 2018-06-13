import { Element, api } from 'engine';

export default class ConnectorPicker extends Element {
    @api data;
    @api comboboxOptions;
    @api bodyText;
    @api comboBoxLabel;
    @api targetElementLabel;

    _pickerValue;

    @api validate() {
        return [];
    }

    @api getNode() {
        return this._pickerValue;
    }

    get connectorPickerTitle() {
        return `${this.bodyText} "${this.targetElementLabel}".`;
    }

    get defaultOptionAndValue() {
        this._pickerValue = this.comboboxOptions[0].value;
        return this._pickerValue;
    }

    /**
     * Keeps track of the current selected value
     * @param {Object} event - onchange event coming from connector-picker
     */
    handlePickerValueChange(event) {
        this._pickerValue = event.detail.value;
    }
}