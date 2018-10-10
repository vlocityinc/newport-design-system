import { LightningElement, api, track } from 'lwc';
import { filterFieldsForChosenElement } from "builder_platform_interaction/expressionUtils";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";

export default class FieldPicker extends LightningElement {
    @track
    state = {
        fields: [],
        value: '',
    };

    @api
    required;

    @api
    disabled;

    @api
    label;

    @api
    placeholder;

    @api
    errorMessage;

    /**
     * The inner base resource picker component, used to set the full menu data
     * @type {BaseResourcePicker}
     */
    _baseResourcePicker;

    /**
     * True if the field picker has been initialized, false by default
     * @type {Boolean}
     */
    _isInitialized = false;

    /**
     * @param {String} newValue the selected queried field
     */
    set value(newValue) {
        this.state.value = newValue;
    }

    @api
    get value() {
        return this.state.value;
    }

    /**
     * @param {String[]} newFields the queriedFields from recordNode.queriedFields
     */
    set fields(newFields) {
        if (newFields) {
            this.state.fields = newFields;
            this.populateFieldMenuData();
        }
    }

    @api
    get fields() {
        return this.state.fields;
    }

    /**
     * create the combobox config
     */
    get comboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.label,
            this.placeholder,
            undefined, // passing error message through template
            false,
            this.required,
            this.disabled
        );
    }

    renderedCallback() {
        if (!this._isInitialized) {
            this._baseResourcePicker = this.template.querySelector(BaseResourcePicker.SELECTOR);
            this._isInitialized = true;

            this.populateFieldMenuData();
        }
    }

    /**
     * Populates the field menu data for the selected entity
     * Uses the BaseResourcePicker instance to set the full menu data
     */
    populateFieldMenuData() {
        if (this._baseResourcePicker) {
            this._baseResourcePicker.setMenuData(filterFieldsForChosenElement(null, null, this.fields, false, true));
        }
    }
}
