import { LightningElement, api } from 'lwc';
const baseResourcePicker = require('builder_platform_interaction/baseResourcePicker').default;

export default class BaseResourcePicker extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-base-resource-picker';
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

    static getComboboxConfig = (label, placeholder, errorMessage, literalsAllowed, required, disabled, type, enableFieldDrilldown, variant) => {
        return baseResourcePicker.getComboboxConfig(label, placeholder, errorMessage, literalsAllowed, required, disabled, type, enableFieldDrilldown, variant);
    };

    @api
    allowedParamTypes;
    
    @api
    showActivityIndicator;
}