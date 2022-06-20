import newResourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.newResourceLabel';
import newTypedResourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.newTypedResourceLabel';
import quickCreateResourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.quickCreateResourceLabel';
import resourceLabel from '@salesforce/label/FlowBuilderExpressionUtils.resourceLabel';
import { removeLastCreatedInlineResource, updateInlineResourceProperties } from 'builder_platform_interaction/actions';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { isObject } from 'builder_platform_interaction/commonUtils';
import { NewResourceEvent } from 'builder_platform_interaction/events';
import { getMenuData, normalizeFEROV } from 'builder_platform_interaction/expressionUtils';
import { getInlineResource } from 'builder_platform_interaction/inlineResourceUtils';
import { isLookupTraversalSupported } from 'builder_platform_interaction/mergeFieldLib';
import { getRHSTypes, RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';
import { commonUtils, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { getTriggerType } from 'builder_platform_interaction/storeUtils';
import { api, LightningElement, track } from 'lwc';

const { format } = commonUtils;

const { logInteraction } = loggingUtils;

let storeInstance;

export default class FerovResourcePicker extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-ferov-resource-picker';

    @track
    _customValidity;

    @track
    _value;

    @track
    _comboboxConfig: ComboboxConfig = {};

    @track
    _elementConfig;

    @api
    activePicklistValues;

    /**
     * The allowed param types based on the rule service
     *
     * @type {Object}
     */
    @track
    paramTypes = null;

    @track
    inlineItem = null;

    /**
     * A unique id for this resource picker(guid)
     * Required if you want validation on done
     *
     * @type {string}
     */
    @api
    rowIndex;
    _baseResourcePicker: any;

    /**
     * The current value of the picker
     *
     * @param {module:base-resource-picker.item|string} newValue the new value for the picker
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
     *
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
     *
     * @param {string} message - The error message
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
     *
     * @param {string} error the new error message
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
     *
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
     *
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
     *
     * @type {string}
     */
    @api
    propertyEditorElementType;

    /**
     * The element param that represents the left hand side in operator rules.
     *
     * @type {module:operator-rule-util.param}
     */
    @api
    elementParam;

    /**
     * If set to true, global constants will not show up
     *
     * @type {boolean}
     */
    @api
    hideGlobalConstants = false;

    /**
     * Set it to true to hide 'New Resource' as first item in combobox menu data.
     *
     * @type {boolean}
     */
    @api
    hideNewResource = false;

    @api
    newResourceTypeLabel;

    @api
    includeQuickCreateResourceOption;

    @api
    hideSystemVariables = false;

    @api
    hideGlobalVariables = false;

    @api
    lookupByDevName = false;

    /**
     * Set it to true if this resource picker is used in the context of a formula editor,
     * in which case the menu data will be populated differently
     */
    @api
    forFormula = false;

    /**
     * Supports pill display?
     */
    @api
    isPillSupported = false;
    /**
     * Set it to true to hide $Flow system variable in the Global Variables category
     */
    @api
    hideFlowSystemVariable = false;

    /**
     * Define the configuration for when a new resource is created inline
     */
    @api
    newResourceInfo: UI.NewResourceInfo = {};

    get parentItem() {
        return this.value && this.value.parent;
    }

    /**
     * If true, hasNext will be set to true for sobjectVariables,
     * and the allowedParamTypes will be passed to the combobox to enable validating fields
     *
     * @returns {boolean} - whether or not this instance of the ferov resource picker supports drilling down on sObjectVariables
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

    get enableLookupTraversal() {
        return this.isLookupTraversalSupported();
    }

    /**
     * True if the component has been initialized, false otherwise. This is so we do not populate menu data twice on initializing api values
     *
     * @type {boolean}
     */
    _isInitialized = false;

    /**
     * The full menu data available for selection based on the resource picker props
     *
     * @type {Object[]}
     */
    _menuData;

    /**
     * Store unsubscribe function.
     */
    _unsubscribeStore;

    /**
     * Holds the rules used for fetching full menu data, taken from the rule service. We should not need to modify this
     *
     * @type {module:rules.operatorRule[]}
     */
    _rules;

    _quickCreateResourceText: string | undefined;

    /** Event handlers */

    handleItemSelected(event) {
        if (this.isPicklistItem(event.detail.item)) {
            // if picklist, the value should be the displayText that the user sees and we need to clear the item
            const displayText = event.detail.item.displayText;
            event.detail.displayText = displayText;
            event.detail.item = null;
            this._value = displayText;
        } else {
            this._value = event.detail.item;
        }
    }

    handleComboboxChanged(event) {
        if (this.isPicklistItem(event.detail.item)) {
            // if picklist, the value should be the displayText that the user sees and we need to clear the item
            event.detail.displayText = event.detail.item.displayText;
            event.detail.item = null;
        }
        const item = event.detail.item;
        const displayText = event.detail.displayText;

        this._value = item && !this.errorMessage ? item : displayText;
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

    /**
     * Callback from the store for changes in store.
     */
    handleStoreChange = () => {
        this.populateMenuData();
    };

    handleTextChanged = (event) => {
        event.stopPropagation();
        if (this.includeQuickCreateResourceOption && this._quickCreateResourceText !== event.detail.text) {
            this._quickCreateResourceText = event.detail.text;
            let newResourceItemText;
            if (this._quickCreateResourceText) {
                const resourceTypelabel = this.newResourceTypeLabel ? this.newResourceTypeLabel : resourceLabel;
                newResourceItemText = format(
                    quickCreateResourceLabel,
                    this._quickCreateResourceText,
                    resourceTypelabel
                );
            } else {
                newResourceItemText = this.newResourceTypeLabel
                    ? format(newTypedResourceLabel, this.newResourceTypeLabel)
                    : format(newResourceLabel, resourceLabel);
            }
            if (this._menuData?.length > 0) {
                this._menuData[0].displayText = newResourceItemText;
                this._menuData[0].text = newResourceItemText;
            }
        }
    };

    /**
     * Handler for when a user clicks on new resource button from the combobox
     * Update the store and save the rowIndex of the comobobox
     *
     * @param {NewResourceEvent} event The event that contains all the information about the new resource being added
     */
    handleAddInlineResource = (event: NewResourceEvent) => {
        if (event && event.detail && event.detail.position && typeof event.detail.position === 'string') {
            let newResourceConfig: UI.NewResourceInfo = this.newResourceInfo;
            if (this.includeQuickCreateResourceOption && this._quickCreateResourceText) {
                newResourceConfig = {
                    ...this.newResourceInfo,
                    userProvidedText: this._quickCreateResourceText
                };
            }
            event.detail.newResourceInfo = newResourceConfig;

            storeInstance.dispatch(
                updateInlineResourceProperties({
                    lastInlineResourceRowIndex: event.detail.position
                })
            );

            logInteraction(`ferov-inline-resource`, 'combobox', null, 'click');
        }
    };
    disconnectedCallback() {
        if (typeof this._unsubscribeStore === 'function') {
            this._unsubscribeStore();
        }
    }

    isLookupTraversalSupported() {
        return isLookupTraversalSupported(storeInstance.getCurrentState().properties.processType, getTriggerType());
    }

    renderedCallback() {
        if (!this._isInitialized) {
            this._baseResourcePicker = this.template.querySelector(BaseResourcePicker.SELECTOR);

            const identifier = isObject(this.value) ? this.value.value : this.value;
            this.initializeResourcePicker(
                normalizeFEROV(identifier, {
                    allowSObjectFieldsTraversal: this.isLookupTraversalSupported(),
                    lookupByDevName: this.lookupByDevName
                })
            );
        }
    }

    /** HELPER METHODS */

    isPicklistItem(item) {
        const matchPicklistItem = (picklistItem) => {
            if (picklistItem.label) {
                return picklistItem.value + '-' + picklistItem.label === item.value;
            }
            return picklistItem.value === item.value;
        };
        return item && this.activePicklistValues && this.activePicklistValues.find(matchPicklistItem);
    }

    initializeResourcePicker = (normalizedValue) => {
        // on first render we want to replace the given value with the itemOrDisplayText from normalized value
        this._value = normalizedValue.itemOrDisplayText;
        this.populateMenuData(this.parentItem, normalizedValue.fields);
        this._isInitialized = true;
    };

    populateParamTypes = () => {
        this.paramTypes = this.elementConfig
            ? this.elementConfig.allowedParamTypes
            : getRHSTypes(this.propertyEditorElementType, this.elementParam, RULE_OPERATOR.ASSIGN, this.rules);
        return this.paramTypes;
    };

    populateMenuData = (parentItem?, fields?) => {
        if (this._baseResourcePicker) {
            getMenuData(
                this.elementConfig,
                this.propertyEditorElementType,
                this.populateParamTypes,
                storeInstance,
                parentItem,
                fields,
                {
                    newResourceTypeLabel: this.newResourceTypeLabel,
                    activePicklistValues: this.activePicklistValues,
                    traversalConfig: {
                        isEnabled: this.enableFieldDrilldown,
                        allowSObjectFieldsTraversal: this.isLookupTraversalSupported(),
                        allowSObjectField: this.comboboxConfig.allowSObjectFields
                    },
                    filter: {
                        allowGlobalConstants: !this.hideGlobalConstants,
                        includeNewResource: !this.hideNewResource,
                        showSystemVariables: !this.hideSystemVariables,
                        showGlobalVariables: !this.hideGlobalVariables,
                        forFormula: this.forFormula,
                        showFlowSystemVariable: !this.hideFlowSystemVariable
                    }
                }
            ).then((menuData) => {
                this._menuData = menuData;
                this._baseResourcePicker.setMenuData(menuData);
                this.setInlineResource(menuData);
            });
        }
    };

    setInlineResource = (menuData) => {
        const { lastInlineResourceRowIndex: inlineResourceRowIndex, lastInlineResourceGuid: inlineGuid } =
            storeInstance.getCurrentState().properties;
        if (inlineGuid && inlineResourceRowIndex === this.rowIndex) {
            const inlineResource = getInlineResource(inlineGuid, menuData);
            if (inlineResource) {
                if (this.errorMessage) {
                    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
                    this.errorMessage = null;
                }
                this.inlineItem = inlineResource;
                storeInstance.dispatch(removeLastCreatedInlineResource);
            }
        }
    };
}
