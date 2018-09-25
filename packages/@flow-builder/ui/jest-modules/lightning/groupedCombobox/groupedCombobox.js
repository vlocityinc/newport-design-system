import { LightningElement, api } from 'lwc';

export default class GroupedCombobox extends LightningElement {
    @api label;
    @api items;
    @api value;
    @api inputText;
    @api inputIconName;
    @api placeholder;
    @api disabled;
    @api messageWhenValueMissing;
    @api showActivityIndicator;
    @api required;
    @api variant;

    @api
    setCustomValidity(value) {
        this._errorMessage = value;
    }

    @api
    get validity() {
        return this._errorMessage;
    }

    @api
    checkValidity() {
        return this.validity;
    }

    @api
    showHelpMessageIfInvalid() {
        // shows the error message
    }

    @api
    focusAndOpenDropdownIfNotEmpty() {
        // toggle dropdown menu
    }
}
