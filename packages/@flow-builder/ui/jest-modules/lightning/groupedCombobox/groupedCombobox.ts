// @ts-nocheck
import { api, LightningElement } from 'lwc';

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
    @api fieldLevelHelp;

    @api
    setCustomValidity(value) {
        this._errorMessage = value;
    }

    handleBlur() {
        this._hasFocus = false;
    }

    handleFocus() {
        this._hasFocus = true;
    }

    @api
    get validity() {
        let missingErr;
        if (!this.disabled && !this._hasFocus && this.required && !this.value) {
            missingErr = 'FlowBuilderValidation.cannotBeBlank';
        }
        return this._errorMessage || missingErr;
    }

    @api
    checkValidity() {
        return this.validity;
    }

    @api
    showHelpMessageIfInvalid = jest.fn().mockName('showHelpMessageIfInvalid');

    @api
    focusAndOpenDropdownIfNotEmpty() {
        // toggle dropdown menu
    }

    @api
    focus() {}
}
