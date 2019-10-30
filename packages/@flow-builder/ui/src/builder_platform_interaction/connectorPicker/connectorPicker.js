import { LightningElement, api } from 'lwc';
import { format } from 'builder_platform_interaction/commonUtils';

export default class ConnectorPicker extends LightningElement {
    // eslint-disable-next-line @lwc/lwc/valid-api
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
        return this.pickerValue;
    }

    get connectorPickerTitle() {
        return format(this.bodyText, this.targetElementLabel);
    }

    get pickerValue() {
        return this._pickerValue != null || this.comboboxOptions[0].value;
    }

    /**
     * Keeps track of the current selected value
     * @param {Object} event - onchange event coming from connector-picker
     */
    handlePickerValueChange(event) {
        this._pickerValue = event.detail.value;
    }
}
