import { Element, api }  from 'engine';
import { getElementsForMenuData } from 'builder_platform_interaction-expression-utils';
import { getRulesForContext, getRHSTypes, RULE_OPERATOR } from 'builder_platform_interaction-rule-lib';

const SELECTORS = {
    BASE_RESOURCE_PICKER: 'builder_platform_interaction-base-resource-picker'
};

export default class FerovResourcePicker extends Element {
    /**
     * The value item to set on combobox.
     * @type {module:expression-utils.MenuItem|String}
     */
    @api
    value;

    /**
     * Flow combobox config
     * @param {module:base-resource-picker.ComboboxConfig} newComboboxConfig the new combobox config object
     */
    @api
    set comboboxConfig(newComboboxConfig) {
        this._comboboxConfig = newComboboxConfig;
        this._isInitialized = false;
    }

    @api
    get comboboxConfig() {
        return this._comboboxConfig;
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
     * The element config using which selector is determined for the element type while getting elements for menu data.
     * Eg: {element, shouldBeWritable} element is the element type this expression builder is inside,
     * shouldBeWritable is so property editors can specify the data they need.
     * @type {Object} the element config
     */
    @api
    elementConfig;

    /**
     * Set it to true to show 'New Resource' as first item in combobox menu data.
     * @type {Boolean}
     */
    @api
    showNewResource = false;

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

    _comboboxConfig;

    renderedCallback() {
        if (!this._isInitialized) {
            this._baseResourcePicker = this.template.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
            this.populateFerovMenuData();
            this._isInitialized = true;
        }
    }

    /** HELPER METHODS */

    /**
     * Fetch them menu data and set it on the base resource picker.
     * If elementConfig is set use that to fetch the menu data.
     */
    populateFerovMenuData() {
        if (!this.elementConfig) {
            this._rules = getRulesForContext({ elementType: this.propertyEditorElementType });
            const paramTypes = getRHSTypes(this.propertyEditorElementType, this.elementParam, RULE_OPERATOR.ASSIGN, this._rules);
            this._menuData = getElementsForMenuData({ elementType: this.propertyEditorElementType }, paramTypes, this.showNewResource);
        } else {
            this._menuData = getElementsForMenuData(this.elementConfig, null, this.showNewResource);
        }
        this._baseResourcePicker.setMenuData(this._menuData);
    }
}