import { Element, api } from 'engine';

export default class Combobox extends Element {
    @api
    label;

    @api
    value;

    @api
    disabled;

    @api
    set menuData(data) {
        this._menuData = data;
    }

    @api
    get menuData() {
        return this._menuData;
    }

    @api
    set errorMessage(error){}

    @api
    get errorMessage(){}
}
