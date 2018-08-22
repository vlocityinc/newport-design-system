import { LightningElement, api, track }  from "lwc";
import {
    getElementsForMenuData,
    filterFieldsForChosenElement,
    normalizeRHS,
} from 'builder_platform_interaction-expression-utils';
import {
    getRulesForContext,
    getRHSTypes,
    RULE_OPERATOR,
} from 'builder_platform_interaction-rule-lib';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { isObject } from 'builder_platform_interaction-common-utils';

const SELECTORS = {
    BASE_RESOURCE_PICKER: 'builder_platform_interaction-base-resource-picker'
};

export default class FerovResourcePicker extends LightningElement {
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
     * @param {module:base-resource-picker.item|String} value the new value for the picker
     */
    set value(value) {
        this._value = value;
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
     * If set to true, hasNext will be set to false for all menu items
     * @type {Boolean}
     */
    @api
    disableFieldDrilldown = false;

    /**
     * If set to true, sobjects will not show up in menu data to allow users to select fields
     * @type {Boolean}
     */
    @api
    disableSobjectForFields = false;

    /**
     * Set it to true to show 'New Resource' as first item in combobox menu data.
     * @type {Boolean}
     */
    @api
    showNewResource = false;

    get allowSobjectForFields() {
        return !this.disableSobjectForFields;
    }

    get parentItem() {
        return this.value && this.value.parent;
    }

    /**
     * Holds the rules used for fetching full menu data, taken from the rule service. We should not need to modify this
     * @type {Object[]}
     */
    _rules;

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

    /** Event handlers */

    handleItemSelected(event) {
        this.value = event.detail.item;
    }

    handleComboboxChanged(event) {
        const item = event.detail.item;
        const displayText = event.detail.displayText;

        this.value = item || displayText;
    }

    handleFetchMenuData(event) {
        const selectedItem = event.detail.item;
        // if the event has combobox menu item that means they selected an sobject item from the dropdown
        this.populateMenuData(selectedItem);
    }

    renderedCallback() {
        if (!this._isInitialized) {
            this._baseResourcePicker = this.template.querySelector(SELECTORS.BASE_RESOURCE_PICKER);

            const identifier = isObject(this.value) ? this.value.value : this.value;
            normalizeRHS(identifier)
                .then(this.initializeResourcePicker);
        }
    }

    /** HELPER METHODS */

    initializeResourcePicker = (normalizedValue) => {
        // on first render we want to replace the given value with the itemOrDisplayText from normalized value
        this.value = normalizedValue.itemOrDisplayText;

        this.populateMenuData(this.parentItem, normalizedValue.fields);
        this._isInitialized = true;
    }

    populateMenuData = (parentItem, fields) => {
        if (!this._baseResourcePicker) {
            return;
        }

        if (parentItem) {
            this.populateFieldMenuData(parentItem, fields);
        } else {
            this.populateFerovMenuData();
        }
    };

    /**
     * Populate menu data with fields from the given record
     * @param {Object} parentItem, representing the record that the fields belong to
     * @param {Object} entityFields fields for @param parentItem
     */
    populateFieldMenuData(parentItem, entityFields) {
        const showAsFieldReference = true;
        const showSubText = true;

        this.populateRulesAndParamTypes();
        if (entityFields) {
            this._menuData = filterFieldsForChosenElement(parentItem, this.paramTypes, entityFields, showAsFieldReference, showSubText);
            this.setFullMenuData(this._menuData);
        } else {
            // when handling fetch menu data (user selects new sobject) we will not have the fields yet
            const entityName = parentItem.objectType;
            getFieldsForEntity(entityName, (fields) => {
                this._menuData = filterFieldsForChosenElement(parentItem, this.paramTypes, fields, showAsFieldReference, showSubText);
                this.setFullMenuData(this._menuData);
            });
        }
    }

    /**
     * Fetch them menu data and set it on the base resource picker.
     * If elementConfig is set use that to fetch the menu data.
     */
    populateFerovMenuData() {
        if (!this._elementConfig) {
            this.populateRulesAndParamTypes();
            this._menuData = getElementsForMenuData({ elementType: this.propertyEditorElementType },
                this.paramTypes, this.showNewResource, this.allowSobjectForFields, this.disableFieldDrilldown);
        } else {
            this._menuData = getElementsForMenuData(this._elementConfig, null, this.showNewResource, this.allowSobjectForFields, this.disableFieldDrilldown);
        }
        this.setFullMenuData(this._menuData);
    }

    // set the menu data on the base resource picker component
    setFullMenuData(menuData) {
        this._baseResourcePicker.setMenuData(menuData);
    }

    isSobjectField(item) {
        return item && item.parent;
    }

    populateRulesAndParamTypes() {
        this._rules = getRulesForContext({ elementType: this.propertyEditorElementType });
        this.paramTypes = getRHSTypes(this.propertyEditorElementType, this.elementParam, RULE_OPERATOR.ASSIGN, this._rules);
    }
}