import { LightningElement, api, track } from 'lwc';
import { getEntitiesMenuData, getEventTypesMenuData, getApexClassMenuData } from 'builder_platform_interaction/expressionUtils';
import { isObject } from 'builder_platform_interaction/commonUtils';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';

/**
 * Object resource picker that has one BaseResourcePicker. The picker shows sobject, apex, or event type menu data.
 * Note: this component follows the convention from the combobox where we have displayText and value
 * DisplayText is just a string, use this when you are loading from the store or have just a literal/merge field
 * Value should be used when you have a combobox menu item (taken from CombbooxValueChanged event)
 * @class EntityResourcePicker
 * @extends {Element}
 */
export default class EntityResourcePicker extends LightningElement {
    static ENTITY_MODE = {
        SOBJECT: 'sobject',
        EVENT: 'event',
        APEX: 'apex',
    };

    /**
     * The entity type that will be displayed in the combobox
     * If not specified defaults to all entity types.
     * @type {String}
     */
    _crudFilterType;

    /**
     * Combobox item displayed in the combobox
     * @type {module:base-resource-picker.item}
     */
    _item;

    /**
     * the display text to show in the combobox
     * @type {String}
     */
    _displayText;

    /**
     * The full entity menu data
     * @type {Object[]}
     */
    _fullEntityMenuData;

    /**
     * The inner base resource picker component, used to set the full menu data
     * @type {BaseResourcePicker}
     */
    _baseResourcePicker;

    /**
     * True if the enitty picker has been initialized, false by default
     * @type {Boolean}
     */
    _isInitialized = false;

    /**
     * Determines what menu data will be loaded
     * @type {String}
     */
    _mode = EntityResourcePicker.ENTITY_MODE.SOBJECT;

    /**
     * Internal state of entity resource picker
     * @typedef {Object}
     * @property {module:base-resource-picker.item} item the currently selected combobox menu item
     * @property {String} displayText the display text of the combobox used for literals/merge fields
     */
    @track
    state = {};

    /**
     * Set the entity type of @member _crudFilterType
     * Use only for entity menu data when in sobject mode.
     * Changing the crudFilter.
     * @param {String} crudFilterType the new filter type
     */
    set crudFilterType(crudFilterType) {
        this._crudFilterType = crudFilterType;
        if (this._isInitialized && this.mode === EntityResourcePicker.ENTITY_MODE.SOBJECT) {
            this.populateEntityMenuData();
        }
    }

    @api
    get crudFilterType() {
        return this._crudFilterType;
    }

    set mode(mode) {
        if (this._isInitialized && this._mode !== mode) {
            this.populateEntityMenuData(mode);
        }
        this._mode = mode;
    }

    @api
    get mode() {
        return this._mode;
    }

    /**
     * Set the combobox config object
     * @type {module:base-resource-picker.ComboboxConfig}
     */
    @api
    comboboxConfig;

    /**
     * The combobox item that represents the value selected
     * @param {module:base-resource-picker.item|String} itemOrDisplayText the new item
     */
    set value(itemOrDisplayText) {
        // if the user passes down display text we check if we already have a stored item
        if (!isObject(itemOrDisplayText) && isObject(this.state.itemOrDisplayText) && this._isInitialized) {
            // if the existing item does not match the given display text we attempt to match it to the menu data
            if (this.state.itemOrDisplayText.value !== itemOrDisplayText) {
                this.state.itemOrDisplayText = this.matchDisplayTextWithMenuDataItem(itemOrDisplayText);
            }
        } else {
            // if the consumer passes down an item we override existing state and pass it down to combobox
            this.state.itemOrDisplayText = itemOrDisplayText;
        }
    }

    @api
    get value() {
        return this.state.itemOrDisplayText;
    }

    matchDisplayTextWithMenuDataItem(displayText) {
        const foundValue = this._fullEntityMenuData.find((item => item.value === displayText));
        return foundValue;
    }

    handleComboboxChange(event) {
        this.state.itemOrDisplayText = event.detail.item || event.detail.displayText;
    }

    handleItemSelected(event) {
        this.state.itemOrDisplayText = event.detail.item || event.detail.displayText;
    }

    renderedCallback() {
        if (!this._isInitialized) {
            this._baseResourcePicker = this.template.querySelector(BaseResourcePicker.SELECTOR);
            this.populateEntityMenuData();
            this._isInitialized = true;
            // when loading the entity resource picker for the first time, we only get the api value (displayText) not the item
            // to dislay the correct label we need to query for the matching menu item
            // this may go away if combobox eventually does this work
            if (!isObject(this.value)) {
                const foundValue = this._fullEntityMenuData.find((item => item.value === this.state.itemOrDisplayText));
                this.state.itemOrDisplayText = foundValue || this.state.itemOrDisplayText;
            }
        }
    }

    /**
     * Populates the menu data based on mode & crud filter when relevant
     * Uses the BaseResourcePicker instance to set the full menu data
     */
    populateEntityMenuData(newMode = this.mode) {
        const fetchMenuDataForEntityMode = {
            [EntityResourcePicker.ENTITY_MODE.APEX]: getApexClassMenuData,
            [EntityResourcePicker.ENTITY_MODE.EVENT]: getEventTypesMenuData,
            [EntityResourcePicker.ENTITY_MODE.SOBJECT]: () => getEntitiesMenuData(this._crudFilterType),
        };
        this._fullEntityMenuData = fetchMenuDataForEntityMode[newMode]();
        this._baseResourcePicker.setMenuData(this._fullEntityMenuData);
    }
}