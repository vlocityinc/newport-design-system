import { Element, api } from 'engine';
import connectorPickerTitlePrefix from '@label/FlowBuilderConnectorPicker.connectorPickerTitlePrefix';
import connectorPickerTitleSuffix from '@label/FlowBuilderConnectorPicker.connectorPickerTitleSuffix';

export default class ConnectorPicker extends Element {
    @api data;
    @api comboboxOptions;
    @api optionsLabel;
    @api targetElementLabel;

    _pickerValue;

    @api validate() {
        return [];
    }

    @api getNode() {
        return this._pickerValue;
    }

    get connectorPicketTitle() {
        return `${connectorPickerTitlePrefix} ${this.optionsLabel.toLowerCase()} ${connectorPickerTitleSuffix} "${this.targetElementLabel}"`;
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