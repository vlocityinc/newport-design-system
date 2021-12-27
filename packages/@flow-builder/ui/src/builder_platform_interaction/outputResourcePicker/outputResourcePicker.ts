import outputPlaceholder from '@salesforce/label/FlowBuilderCombobox.outputPlaceholder';
import { removeLastCreatedInlineResource, updateInlineResourceProperties } from 'builder_platform_interaction/actions';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { isObject } from 'builder_platform_interaction/commonUtils';
import { getMenuData, normalizeFEROV } from 'builder_platform_interaction/expressionUtils';
import { getInlineResource } from 'builder_platform_interaction/inlineResourceUtils';
import { getOutputRules, getRHSTypes, RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { api, LightningElement, track } from 'lwc';

const { logInteraction } = loggingUtils;

let storeInstance;

export default class OutputResourcePicker extends LightningElement {
    @track
    _customValidity;

    @track
    _value;

    @track
    _comboboxConfig: ComboboxConfig = {};

    /**
     * The allowed param types based on the rule service
     *
     * @type {Object}
     */
    @track
    paramTypes: {} | null = null;

    /**
     * A unique id for this resource picker(guid)
     * Required if you want validation on done
     *
     * @type {string}
     */
    @api
    rowIndex;

    @track
    inlineItem = null;

    /**
     * The current value of the picker
     *
     * @param {module:base-resource-picker.item | string} newValue the new value for the picker
     */
    set value(newValue) {
        // TODO: W-5511396 this should only be if the value's "level" has changed
        if (this._value !== newValue) {
            this._isInitialized = false;
        }
        this._value = newValue;
    }

    @api
    get value() {
        return this._value;
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
     * The combobox config for the resource picker
     *
     * @param {module:base-resource-picker.ComboboxConfig} newComboboxConfig the new combobox config object
     */
    set comboboxConfig(newComboboxConfig) {
        this._comboboxConfig = Object.assign({}, newComboboxConfig, {
            literalsAllowed: false,
            placeholder: outputPlaceholder
        });
        this._isInitialized = false;
    }

    @api
    get comboboxConfig() {
        return this._comboboxConfig;
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
     * Supports pill display?
     */
    @api
    isPillSupported = false;

    /**
     * If true, hasNext will be set to true for all menu items
     */
    get enableFieldDrilldown() {
        return !!this.comboboxConfig.enableFieldDrilldown;
    }

    get parentItem() {
        return this.value && this.value.parent;
    }

    get elementConfig() {
        return {
            elementType: this.propertyEditorElementType,
            shouldBeWritable: true
        };
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

    /** Event handlers */

    handleFetchMenuData(event) {
        const selectedItem = event.detail.item;
        this.populateMenuData(selectedItem);
    }

    /**
     * Handler for when a user clicks on new resource button from the combobox
     * Update the store and save the rowIndex of the comobobox
     *
     * @param event
     */
    handleAddInlineResource = (event) => {
        if (event && event.detail && event.detail.position && typeof event.detail.position === 'string') {
            storeInstance.dispatch(
                updateInlineResourceProperties({
                    lastInlineResourceRowIndex: event.detail.position
                })
            );
            logInteraction('output-inline-resource', 'combobox', null, 'click');
        }
    };

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
            this.initializeResourcePicker(this.normalizeValue(identifier));
        }
    }

    /** HELPER METHODS */

    initializeResourcePicker = (normalizedValue) => {
        // on first render we want to replace the given value with the normalized value
        this._value = normalizedValue;
        this.populateMenuData(this.parentItem);
        this._isInitialized = true;
    };

    /**
     * Callback from the store for changes in store.
     */
    handleStoreChange = () => {
        this.populateMenuData();
    };

    populateParamTypes = () => {
        this.paramTypes = getRHSTypes(
            this.propertyEditorElementType,
            this.elementParam,
            RULE_OPERATOR.ASSIGN,
            getOutputRules()
        );
        return this.paramTypes;
    };

    populateMenuData = (parentItem?) => {
        if (this._baseResourcePicker) {
            getMenuData(
                this.elementConfig,
                this.propertyEditorElementType,
                this.populateParamTypes,
                storeInstance,
                parentItem,
                undefined,
                {
                    allowGlobalConstants: false,
                    showGlobalVariables: false,
                    enableFieldDrilldown: this.enableFieldDrilldown,
                    includeNewResource: true,
                    allowSObjectFieldsTraversal: false
                }
            ).then((menuData) => {
                this._baseResourcePicker.setMenuData(menuData);
                this.setInlineResource(menuData);
            });
        }
    };

    /**
     * set the newly created resource in the combobox
     *
     * @param menuData
     */
    setInlineResource = (menuData) => {
        const { lastInlineResourceRowIndex: inlineResourceRowIndex, lastInlineResourceGuid: inlineGuid } =
            storeInstance.getCurrentState().properties;
        if (inlineGuid && inlineResourceRowIndex === this.rowIndex) {
            const inlineResource = getInlineResource(inlineGuid, menuData);
            if (inlineResource) {
                this.inlineItem = inlineResource;
                storeInstance.dispatch(removeLastCreatedInlineResource);
            }
        }
    };

    /**
     * This function handles any identifier that may be passed to the picker,
     * such as GUIDs for flow elements, and returns what
     * the expression builder will need to use to work with that.
     *
     * @param {string} identifier    Used to identify the value (e.g. GUID for flow elements)
     * @returns normalizedValue      value to pass to the combobox
     */
    normalizeValue = (identifier) => {
        return normalizeFEROV(identifier).itemOrDisplayText;
    };
}
