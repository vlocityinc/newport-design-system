import { LightningElement, api } from 'lwc';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { MultiSelectComboboxEvent, DefaultMultiSelectComboboxEvent } from 'builder_platform_interaction/events';
import { LABELS } from './multiSelectComboboxLabels';
import { format } from 'builder_platform_interaction/commonUtils';
export default class MultiSelectCombobox extends LightningElement {
    _options;

    @api placeholderText;

    _openDropDown = false;

    selectedValue = '';

    @api
    get options() {
        return this._options;
    }

    set options(value) {
        this._options = Object.assign([], value);
        this.showSelectedValues();
    }

    get openDropDown() {
        return this._openDropDown;
    }

    handleDropDown() {
        if (this._openDropDown) {
            this._openDropDown = false;
        } else {
            this._openDropDown = true;
        }
    }

    /*
     * Update the original option list when a click event (optionState) occurs.
     * (a) Mutate the option list:
     *   - a default option is select-clicked: deselect all custom options
     *   - a custom option is select-clicked: deselect all default options
     * (b) Select default option when all custom options are deselected
     *   - also tells the child component multiSelectOption to render a check mark for default option
     */
    checkOrUncheckOptions(optionState) {
        const cloneOptions = deepCopy(this._options);
        // (a)
        for (let i = 0; i < cloneOptions.length; i++) {
            const curOption = cloneOptions[i];
            if (curOption.label === optionState.label) {
                curOption.isSelected = optionState.isSelected;
            }
            if (
                optionState.isSelected &&
                ((optionState.isDefault && !curOption.isDefault) || (!optionState.isDefault && curOption.isDefault))
            ) {
                curOption.isSelected = false;
            }
        }

        // (b)
        const deselectedCustomOpts = cloneOptions.filter((e) => !e.isDefault && !e.isSelected);
        const defaultOpts = cloneOptions.filter((e) => e.isDefault);
        if (deselectedCustomOpts.length + defaultOpts.length === cloneOptions.length) {
            for (let i = 0; i < defaultOpts.length; i++) {
                defaultOpts[i].isSelected = true;
            }
        }
        return cloneOptions;
    }

    handleCustomSelection(event) {
        this._options = Object.assign([], this.checkOrUncheckOptions(event.detail));
        this.showSelectedValues();
        if (event.detail.isDefault && event.detail.isSelected) {
            this.dispatchEvent(new DefaultMultiSelectComboboxEvent(this._options));
        } else {
            this.dispatchEvent(new MultiSelectComboboxEvent(this._options));
        }
    }

    showSelectedValues() {
        const selections = this._options.filter((e) => e.isSelected);
        if (selections.length > 1) {
            this.selectedValue = format(LABELS.optionsSelected, selections.length);
        } else {
            this.selectedValue = selections.map((e) => e.label);
        }
    }
}
