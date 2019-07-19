import { LightningElement, api, track } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    getEntitiesMenuData,
    getEventTypesMenuData,
    apexClassesMenuDataSelector
} from 'builder_platform_interaction/expressionUtils';
import { isObject } from 'builder_platform_interaction/commonUtils';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { memoize } from 'builder_platform_interaction/commonUtils';

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
        APEX: 'apex'
    };

    /**
     * The entity type that will be displayed in the combobox
     * If not specified defaults to all entity types.
     * @type {String}
     */
    _crudFilterType;

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
     * True if the entity picker has been initialized, false by default
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
    _state = {};

    /**
     * Set the entity type of @member _crudFilterType
     * Use only for entity menu data when in sobject mode.
     * Changing the crudFilter.
     * @param {String} crudFilterType the new filter type
     */
    set crudFilterType(crudFilterType) {
        this._crudFilterType = crudFilterType;
        if (
            this._isInitialized &&
            this.mode === EntityResourcePicker.ENTITY_MODE.SOBJECT
        ) {
            this.populateEntityMenuData();
        }
    }

    @api
    get crudFilterType() {
        return this._crudFilterType;
    }

    set mode(mode) {
        if (this._mode !== mode) {
            if (this._mode === EntityResourcePicker.ENTITY_MODE.APEX) {
                this.selector = null;
                this._unsubscribeStore();
                this._unsubscribeStore = null;
            } else if (mode === EntityResourcePicker.ENTITY_MODE.APEX) {
                this.selector = memoize(apexClassesMenuDataSelector);
                this._unsubscribeStore = Store.getStore().subscribe(this.handleStoreChange);
            }

            this._mode = mode;

            this._updateState();
        }
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
     * A unique id for this resource picker(guid)
     * Required if you want validation on done
     * @type {String}
     */
    @api
    rowIndex;

    /**
     * The combobox item that represents the value selected
     * @param {module:base-resource-picker.item|String} itemOrDisplayText the new item
     */
    set value(itemOrDisplayText) {
        if (isObject(itemOrDisplayText)) {
            this._state.item = itemOrDisplayText;
            this._state.displayText = null;
        } else {
            this._state.item = this._fullEntityMenuData ? this._fullEntityMenuData.find(item => item.value === itemOrDisplayText) : null;
            this._state.displayText = this._state.item ? null : itemOrDisplayText;
        }
    }

    @api
    get value() {
        return this._state.item || this._state.displayText;
    }

    handleComboboxChange(event) {
        this.value = event.detail.item || event.detail.displayText;
    }

    handleItemSelected(event) {
        this.value = event.detail.item || event.detail.displayText;
    }

    renderedCallback() {
        if (!this._isInitialized) {
            this._baseResourcePicker = this.template.querySelector(
                BaseResourcePicker.SELECTOR
            );
            this._isInitialized = true;
            this._updateState();
        }
    }

    disconnectedCallback() {
        if (typeof this._unsubscribeStore === 'function') {
            this._unsubscribeStore();
            this._unsubscribeStore = null;
        }
        this._isInitialized = false;
    }

    /**
     * Populates the menu data based on mode & crud filter when relevant
     * Uses the BaseResourcePicker instance to set the full menu data
     */
    populateEntityMenuData(newMode = this.mode) {
        const fetchMenuDataForEntityMode = {
                [EntityResourcePicker.ENTITY_MODE.APEX]: () =>
                    this.selector(Store.getStore().getCurrentState()),
                [EntityResourcePicker.ENTITY_MODE.EVENT]: getEventTypesMenuData,
                [EntityResourcePicker.ENTITY_MODE.SOBJECT]: () =>
                    getEntitiesMenuData(this._crudFilterType)
        };
        this._fullEntityMenuData = fetchMenuDataForEntityMode[newMode]();
        this._baseResourcePicker.setMenuData(this._fullEntityMenuData || []);
        this._baseResourcePicker.showActivityIndicator = !this._fullEntityMenuData;
    }

    // when loading the entity resource picker for the first time, we only get the api value (displayText) not the item
    // to dislay the correct label we need to query for the matching menu item
    // this may go away if combobox eventually does this work
    _initializeItemFromDisplayText() {
        if (this._fullEntityMenuData && !this._state.item && this._state.displayText) {
            const item = this._fullEntityMenuData.find(menuItem => menuItem.value === this._state.displayText);
            if (item) {
                this._state.item = item;
                this._state.displayText = null;
            }
        }
    }

    _updateState() {
        if (this._isInitialized) {
            this.populateEntityMenuData();
            this._initializeItemFromDisplayText();
        }
    }

    handleStoreChange = () => {
        this._updateState();
    }
}
