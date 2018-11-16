import { LightningElement, api, track }  from 'lwc';
import {
    normalizeRHS,
    getMenuData,
} from "builder_platform_interaction/expressionUtils";
import {
    getRHSTypes,
    RULE_OPERATOR,
} from "builder_platform_interaction/ruleLib";
import { isObject } from "builder_platform_interaction/commonUtils";
import { Store } from 'builder_platform_interaction/storeLib';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';

let storeInstance;

export default class FerovResourcePicker extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-ferov-resource-picker';

    @track
    _customValidity;

    @track
    _value;

    @track
    _comboboxConfig = {};

    @track
    _elementConfig;

    /**
     * The allowed param types based on the rule service
     * @type {Object}
     */
    @track
    paramTypes = null;

    /**
     * The current value of the picker
     * @param {module:base-resource-picker.item|String} newValue the new value for the picker
     */
    set value(newValue) {
        this._value = newValue;
    }

    @api
    get value() {
        return this._value;
    }

    /**
     * The combobox config for the resource picker
     * @param {module:base-resource-picker.ComboboxConfig} newComboboxConfig the new combobox config object
     */
    set comboboxConfig(newComboboxConfig) {
        this._comboboxConfig = newComboboxConfig;
        this._isInitialized = false;
    }

    @api
    get comboboxConfig() {
        return this._comboboxConfig;
    }

    /**
     * Custom error message to display
     * @param {String} message - The error message
     */
    @api
    setCustomValidity(message) {
        this._customValidity = message;
        if (this._baseResourcePicker) {
            this._baseResourcePicker.setCustomValidity(message);
        }
    }

    /**
     * Set the error message through props
     * @param {String} error the new error message
     */
    set errorMessage(error) {
        this.setCustomValidity(error);
    }

    @api
    get errorMessage() {
        return this._customValidity;
    }

    /**
     * The element config using which selector is determined for the element type while getting elements for menu data.
     * Eg: {element, shouldBeWritable} element is the element type this expression builder is inside,
     * shouldBeWritable is so property editors can specify the data they need.
     * @param {module:ferov-resource-picker.ElementConfig} newElementConfig the new element config
     */
    set elementConfig(newElementConfig) {
        this._elementConfig = newElementConfig;
        this._isInitialized = false;
    }

    @api
    get elementConfig() {
        return this._elementConfig;
    }

    /**
     * Holds the rules used for fetching full menu data, taken from the rule service. We should not need to modify this
     * @type {module:rules.operatorRule[]}
     */
    set rules(rules) {
        this._rules = Array.isArray(rules) ? rules : [];
    }

    @api
    get rules() {
        return this._rules;
    }

    /**
     * The element type of the property editor from element config.
     * @type {String}
     */
    @api
    propertyEditorElementType;

    /**
     * The element param that represents the left hand side in operator rules.
     * @type {module:operator-rule-util.param}
     */
    @api
    elementParam;

    /**
     * If set to true, global constants will not show up
     * @type {Boolean}
     */
    @api
    hideGlobalConstants = false;

    /**
     * Set it to true to hide 'New Resource' as first item in combobox menu data.
     * @type {Boolean}
     */
    @api
    hideNewResource = false;

    @api
    hideSystemVariables = false;

    @api
    showGlobalVariables = false;

    get parentItem() {
        return this.value && this.value.parent;
    }

    /**
     * If true, hasNext will be set to true for sobjectVariables,
     * and the allowedParamTypes will be passed to the combobox to enable validating fields
     */
    get enableFieldDrilldown() {
        return !!this.comboboxConfig.enableFieldDrilldown;
    }

    get allowedParamTypes() {
        // The combobox needs these paramTypes to validate certain cases when there are multiple levels of menuData,
        // otherwise it will rely on what's in the current menuData
        if (this.enableFieldDrilldown) {
            return this.paramTypes;
        }
        return null;
    }

    /**
     * True if the component has been initialized, false otherwise. This is so we do not populate menu data twice on initializing api values
     * @type {Boolean}
     */
    _isInitialized = false;

    /**
     * The full menu data available for selection based on the resource picker props
     * @type {Object[]}
     */
    _menuData;

    /**
     * Store unsubscribe function.
     */
    _unsubscribeStore;

    /**
     * Holds the rules used for fetching full menu data, taken from the rule service. We should not need to modify this
     * @type {module:rules.operatorRule[]}
     */
    _rules;

    /** Event handlers */

    handleItemSelected(event) {
        this.value = event.detail.item;
    }

    handleComboboxChanged(event) {
        const item = event.detail.item;
        const displayText = event.detail.displayText;

        this.value = item && !this.errorMessage ? item : displayText;
    }

    handleFetchMenuData(event) {
        const selectedItem = event.detail.item;
        this.populateMenuData(selectedItem);
    }

    constructor() {
        super();
        storeInstance = Store.getStore();
        this._unsubscribeStore = storeInstance.subscribe(this.handleStoreChange);
    }

    disconnectedCallback() {
        if (typeof this._unsubscribeStore === 'function') {
            this._unsubscribeStore();
        }
    }

    renderedCallback() {
        if (!this._isInitialized) {
            this._baseResourcePicker = this.template.querySelector(BaseResourcePicker.SELECTOR);

            const identifier = isObject(this.value) ? this.value.value : this.value;
            this.initializeResourcePicker(normalizeRHS(identifier));
        }
    }

    /** HELPER METHODS */

    initializeResourcePicker = (normalizedValue) => {
        // on first render we want to replace the given value with the itemOrDisplayText from normalized value
        this.value = normalizedValue.itemOrDisplayText;
        this.populateMenuData(this.parentItem, normalizedValue.fields);
        this._isInitialized = true;
    }

    /**
     * Callback from the store for changes in store.
     */
    handleStoreChange = () => {
        this.populateMenuData();
    };

    populateParamTypes = () => {
        this.paramTypes = this.elementConfig ? null : getRHSTypes(this.propertyEditorElementType, this.elementParam, RULE_OPERATOR.ASSIGN, this.rules);
        return this.paramTypes;
    };

    populateMenuData = (parentItem, fields) => {
        if (this._baseResourcePicker) {
            this._baseResourcePicker.setMenuData(
                getMenuData(this.elementConfig, this.propertyEditorElementType, this.populateParamTypes, !this.hideGlobalConstants,
                    this.enableFieldDrilldown, storeInstance, !this.hideNewResource, parentItem, fields, !this.hideSystemVariables, this.showGlobalVariables));
        }
    }
}