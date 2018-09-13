import { LightningElement, api } from 'lwc';
import baseResourcePicker from '../../../modules/builder_platform_interaction/baseResourcePicker/baseResourcePicker.js';

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

    static getComboboxConfig = (label, placeholder, errorMessage, literalsAllowed, required, disabled, type) => {
        return baseResourcePicker.getComboboxConfig(label, placeholder, errorMessage, literalsAllowed, required, disabled, type);
    };

    @api
    allowedParamTypes;
}