import { Element, api, track }  from 'engine';
import {
    getElementsForMenuData,
    filterFieldsForChosenElement,
    normalizeRHS,
} from 'builder_platform_interaction-expression-utils';
import {
    getRulesForContext,
    getRHSTypes,
    RULE_OPERATOR } from 'builder_platform_interaction-rule-lib';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';

const SELECTORS = {
    BASE_RESOURCE_PICKER: 'builder_platform_interaction-base-resource-picker'
};

export default class FerovResourcePicker extends Element {
    @track
    comboboxConfigState;

    /**
     * The value item to set on combobox.
     * @type {module:expression-utils.MenuItem|String}
     */
    @track
    initialValue;

    /**
     * The allowed param types based on the rule service
     * @type {Object}
     */
    @track
    paramTypes = null;

    @api get value() {
        const picker = this.template.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
        return picker ? picker.value : this.initialValue;
    }

    @api set value(newValue) {
        const picker = this.template.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
        if (picker) {
            picker.value = newValue;
        } else {
            this.initialValue = newValue;
        }
    }

    /**
     * Flow combobox config
     * @param {module:base-resource-picker.ComboboxConfig} newComboboxConfig the new combobox config object
     */
    @api
    set comboboxConfig(newComboboxConfig) {
        this.comboboxConfigState = newComboboxConfig;
        this._isInitialized = false;
    }

    @api
    get comboboxConfig() {
        return this.comboboxConfigState;
    }

    /**
     * Custom error message to display
     * @param {string} message - The error message
     */
    @api
    setCustomValidity(message) {
        this.template.querySelector(SELECTORS.BASE_RESOURCE_PICKER).setCustomValidity(message);
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
     * The element config using which selector is determined for the element type while getting elements for menu data.
     * Eg: {element, shouldBeWritable} element is the element type this expression builder is inside,
     * shouldBeWritable is so property editors can specify the data they need.
     * @param {module:ferov-resource-picker.ElementConfig} newElementConfig the new element config
     */
    @api
    set elementConfig(newElementConfig) {
        if (JSON.stringify(this._elementConfig) !== JSON.stringify(newElementConfig)) {
            this._elementConfig = newElementConfig;
            this._isInitialized = false;
            // re-populate menu data if the element config change
            this.populateFerovMenuData();
        }
    }

    @api
    get elementConfig() {
        return this._elementConfig;
    }

    /**
     * Set it to true to show 'New Resource' as first item in combobox menu data.
     * @type {Boolean}
     */
    @api
    showNewResource = false;

    get allowSobjectForFields() {
        return !this.disableSobjectForFields;
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

    _elementConfig;

    // Note: This method is retained for follow up refactor
    handleComboboxChanged(event) {
        event.toString();
    }

    handleFetchMenuData(event) {
        const selectedItem = event.detail.item;
        // if the event has combobox menu item that means they selected an sobject item from the dropdown
        if (selectedItem) {
            this.populateFieldMenuData(selectedItem);
        } else {
            this.populateFerovMenuData();
        }
    }

    renderedCallback() {
        if (!this._isInitialized) {
            this._baseResourcePicker = this.template.querySelector(SELECTORS.BASE_RESOURCE_PICKER);

            const identifier = this.value && (this.value.value || this.value.displayText);
            normalizeRHS(identifier)
                .then(this.initializeMenuData);
        }
    }

    /** HELPER METHODS */

    initializeMenuData = (normalizedValue) => {
        if (this.isSobjectField(normalizedValue.itemOrDisplayText)) {
            const item = normalizedValue.itemOrDisplayText;
            const fields = normalizedValue.fields;
            this.value = item;

            this.populateFieldMenuData(item.parent, fields);
        } else {
            this.populateFerovMenuData();
        }
    };

    /**
     * Populate menu data with fields from the given record
     * @param {Object} item, representing the record that the fields belong to
     * @param {Object} entityFields fields for @param item
     */
    populateFieldMenuData(item, entityFields) {
        const showAsFieldReference = true;
        const showSubText = true;

        this.populateRulesAndParamTypes();
        if (entityFields) {
            this._menuData = filterFieldsForChosenElement(item, this.paramTypes, entityFields, showAsFieldReference, showSubText);
            this.setFullMenuData(this._menuData);
        } else {
            // when handling fetch menu data (user selects new sobject) we will not have the fields yet
            const entityName = item.objectType;
            getFieldsForEntity(entityName, (fields) => {
                this._menuData = filterFieldsForChosenElement(item, this.paramTypes, fields, showAsFieldReference, showSubText);
                this.setFullMenuData(this._menuData);
            });
        }
    }

    /**
     * Fetch them menu data and set it on the base resource picker.
     * If elementConfig is set use that to fetch the menu data.
     */
    populateFerovMenuData() {
        if (this._baseResourcePicker) {
            if (!this._elementConfig) {
                this.populateRulesAndParamTypes();
                this._menuData = getElementsForMenuData({ elementType: this.propertyEditorElementType },
                    this.paramTypes, this.showNewResource, this.allowSobjectForFields, this.disableFieldDrilldown);
            } else {
                this._menuData = getElementsForMenuData(this._elementConfig, null, this.showNewResource, this.allowSobjectForFields, this.disableFieldDrilldown);
            }
            this.setFullMenuData(this._menuData);
        }
    }

    setFullMenuData(menuData) {
        if (this._baseResourcePicker) {
            this._baseResourcePicker.setMenuData(menuData);
            this._isInitialized = true;
        }
    }

    isSobjectField(item) {
        return item && item.parent;
    }

    populateRulesAndParamTypes() {
        this._rules = getRulesForContext({ elementType: this.propertyEditorElementType });
        this.paramTypes = getRHSTypes(this.propertyEditorElementType, this.elementParam, RULE_OPERATOR.ASSIGN, this._rules);
    }
}