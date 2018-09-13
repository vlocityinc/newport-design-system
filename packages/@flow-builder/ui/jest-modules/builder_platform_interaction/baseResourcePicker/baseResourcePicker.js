import { LightningElement, api } from 'lwc';

export default class BaseResourcePicker extends LightningElement {
    @api
    comboboxConfig;

    @api
    value;

    @api
    errorMessage;

    @api
    setMenuData(newMenuData) {
        this._fullMenuData = newMenuData;
    }

    @api
    get fullMenuData() {
        return this._fullMenuData;
    }

    static getComboboxConfig() {
        return {};
    }

    @api
    allowedParamTypes;
}