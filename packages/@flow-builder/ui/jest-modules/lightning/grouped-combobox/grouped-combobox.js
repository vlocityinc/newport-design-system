import { Element, api } from 'engine';

export default class GroupedCombobox extends Element {
    @api label;
    @api items;
    @api value;
    @api inputText;
    @api inputIconName;
    @api placeholder;
    @api disabled;
    @api messageWhenValueMissing;
    @api showActivityIndicator;

    @api
    setCustomValidity(value) {
        this._errorMessage = value;
    }

    @api
    get validity() {
        return this._errorMessage;
    }
}
