// @ts-nocheck
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { isObject } from 'builder_platform_interaction/commonUtils';
import { filterFieldsForChosenElement } from 'builder_platform_interaction/expressionUtils';
import { isLookupTraversalSupported } from 'builder_platform_interaction/mergeFieldLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getTriggerType } from 'builder_platform_interaction/storeUtils';
import { api, LightningElement, track } from 'lwc';

export default class FieldPicker extends LightningElement {
    @track
    state = {
        fields: null,
        item: null,
        displayText: null
    };

    @api
    required = false;

    @api
    disabled;

    @api
    rowIndex;

    @api
    label;

    @api
    placeholder;

    @api
    errorMessage;

    @api
    showActivityIndicator = false;

    @api
    isPillSupported = false;

    _menuData;

    /**
     * The inner base resource picker component, used to set the full menu data
     *
     * @type {BaseResourcePicker}
     */
    _baseResourcePicker;

    /**
     * True if the field picker has been initialized, false by default
     *
     * @type {boolean}
     */
    _isInitialized = false;

    /**
     * The combobox item that represents the value selected
     *
     * @param {UI.ComboboxItem | string} itemOrDisplayText - the new item object (ComboboxItem) or the value of the text to display
     */
    set value(itemOrDisplayText: UI.ComboboxItem | string) {
        if (isObject(itemOrDisplayText)) {
            this.state.item = itemOrDisplayText;
            this.state.displayText = null;
        } else {
            this.state.item = this._menuData ? this._menuData.find((item) => item.value === itemOrDisplayText) : null;
            this.state.displayText = this.state.item ? null : itemOrDisplayText;
        }
    }

    @api
    get value() {
        return this.state.item || this.state.displayText;
    }

    /**
     * @param {Object} newFields map of the queriedFields from recordNode.queriedFields
     */
    set fields(newFields) {
        if (newFields) {
            this.state.fields = newFields;
            this.populateFieldMenuData();
            if (!this.state.item && this.state.displayText && this._menuData) {
                this.state.item = this._menuData.find((item) => item.value === this.state.displayText);
            }
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

    get enableLookupTraversal() {
        return this.isLookupTraversalSupported();
    }

    renderedCallback() {
        if (!this._isInitialized) {
            this._baseResourcePicker = this.template.querySelector(BaseResourcePicker.SELECTOR);
            this._isInitialized = true;

            if (this.fields) {
                this.populateFieldMenuData();
            }
        }
    }

    isLookupTraversalSupported() {
        return isLookupTraversalSupported(Store.getStore().getCurrentState().properties.processType, getTriggerType());
    }

    /**
     * Populates the field menu data for the selected entity
     * Uses the BaseResourcePicker instance to set the full menu data
     */
    populateFieldMenuData() {
        if (this._baseResourcePicker) {
            this._menuData = filterFieldsForChosenElement(null, this.fields, {
                showAsFieldReference: false,
                showSubText: true,
                allowSObjectFieldsTraversal: this.isLookupTraversalSupported()
            });
            this._baseResourcePicker.setMenuData(this._menuData);
        }
    }
}
