import { Element, api, track, unwrap } from 'engine';
import {
    getElementsForMenuData,
    filterMatches,
    getEntitiesMenuData,
    RESOURCE_PICKER_MODE,
} from 'builder_platform_interaction-expression-utils';
import { getRulesForContext, getRHSTypes, RULE_PROPERTY_INFO } from 'builder_platform_interaction-rule-lib';

const { DATA_TYPE, IS_COLLECTION, ELEMENT_TYPE } = RULE_PROPERTY_INFO;

/**
 * Reusable resource picker that displays a list of Flow Elements or SObject entities
 * This component consumes the data retrieved by the sobject-lib meaning you can
 * configure which entity types you want to display in the menu item dropdown
 * It also makes use of expression-utils so you can configure which Flow Elements get displayed
 * TODO: W-4961822 add logic for dealing with fetch menu data event for going to next level in combobox (select fields)
 */
export default class ResourcePicker extends Element {
    /**
     * holds the rules used for fetching full menu data, taken from the rule service. We should not need to modify this
     * @type {Object[]}
     */
    _rules;

    /**
     * The full menu data available for selection based on the resource picker props
     * @type {Object[]}
     */
    _fullMenuData;

    /**
     * True if the component has been initialized, false otherwise. This is so we do not populate menu data twice on initializing api values
     * @type {Boolean}
     */
    _isInitialized = false;

    /**
     * the actual value of the combobox item (contains text, value, and id)
     * @typedef {Object} item
     * @property {String} type  the type of menu data display type ex: option-inline
     * @property {String} text  the text that will be displayed by the combobox (can be highlighted)
     * @property {String} subtext the subtext that will displayed below the text
     * @property {String} displayText   the value displayed in the input field when this menu item is selected
     * @property {String} iconName  the icon that will be displayed next to the menu item in a dropdown list
     * @property {String} value the id or api name of the value stored by the flow combobox. This is what we want to put in store/events
    */

    /**
     * the state of the resource picker containing the current item and the menu data
     * @typedef {Object} resourcePickerState
     * @property {item} the currently selected menu item
     * @property {Object[]} the current menu data held by the combobox, not necessarily the full menu data
     */
    @track
    state = {};

    /**
     * the label shown by the resource picker
     * @type {String}
     */
    @api
    label;

    /**
     * placeholder text displayed in the input field
     * @type {String}
     */
    @api
    placeholder;

    /**
     * True if resource picker is disabled, false otherwise
     * @type {Boolean}
     */
    @api
    disabled;

    /**
     * True if the resource picker is a required field, false otherwise
     * @type {Boolean}
     */
    @api
    required;

    /**
     *  boolean value. True if literals are allowed in the combobox, false otherwise
     *  @type {Boolean}
     */
    @api
    literalsAllowed;

    /**
     * initial value of the resource picker, ex: the object type when loading sobject variable
     * @type {String}
     */
    @api
    initialItem;

    /**
     * The mode of the resource picker. Depending on the mode, we retrieve ferov data or entity/field data
     * TODO: W-4961822
     * there is no mechanism to retreive the fields if a user selects one of the entities in the dropdown
     * will likely have to add another "mode" option that specifies when you want to retrieve fields for a given entity
     * depending on the mode we are in, we populate our menu data with FEROVs or entities
     * @type {String}
     */
    @api
    mode;

    /** ENTITY MODE ATTRIBUTES */

    /**
     * when displaying sobjects, we can specify which entities we want to display
     * ex: CREATABLE, DELETABLE, UPDATABLE
     * @type {String}
     */
    @api
    crudFilterType;

    /** FEROV MODE ATTRIBUTES */
    // NOTE: This may be converted into a config object like expression builder if this list gets too long especially once we start caring about other rule param props

    /**
     * the data type of the element/value that you are setting with the resource picker
     * you can think of this as your LHS data type
     * For example: In variable editor, this would be the data type of the variable element
     * For example: In Record Create, the "variable" used to assign the record ID would have data type "text"
     * @param {String} dataType         the data type of the element being set by the resource picker
     */
    @api
    set elementDataType(dataType) {
        /** @member {String} */
        this._elementDataType = dataType;
        // if the component has not been initialized yet, do not populate menu data
        if (this._isInitialized) {
            this.populateMenuData();
        }
    }

    @api
    get elementDataType() {
        return this._elementDataType;
    }

    /**
     * the collection flag of the element/value that you are setting with the resource picker
     * you can think of this as your LHS collection boolean value
     * For example: In the variable editor, this would be true if the variable was a collection
     * @param {Boolean} elementIsCollection     the collection boolean value of the element being set by the resource picker
     */
    @api
    set elementIsCollection(elementIsCollection) {
        /** @member {Boolean} */
        this._elementIsCollection = elementIsCollection;
        // if the component has not been initialized yet, do not populate menu data
        if (this._isInitialized) {
            this.populateMenuData();
        }
    }

    @api
    get elementIsCollection() {
        return this._elementIsCollection;
    }

    /**
     * the element type of the element/value that you are setting with the resource picker
     * you can think of this as your LHS element type
     * For example: In record create, when choosing the variable to assign the record ID the element type is "VARIABLE"
     * @param {String} elementType      the element type of the element being set by the resource picker
     */
    @api
    set elementType(elementType) {
        /** @member {String} */
        this._elementType = elementType;
        // if the component has not been initialized yet, do not populate menu data
        if (this._isInitialized) {
            this.populateMenuData();
        }
    }

    @api
    get elementType() {
        return this._elementType;
    }

    get myItem() {
        return this.state.item;
    }

    // this is used to populate menu data when first creating the resource picker
    connectedCallback() {
        this.populateMenuData();
        this._isInitialized = true;
    }

    /** EVENT HANDLERS */

    handleFilterMatches(event) {
        event.stopPropagation();
        this.state.menuData = filterMatches(event.detail.value, this._fullMenuData);
    }

    handleValueChange(event) {
        // if we are in ferov mode we allow items and literals
        // TODO: W-5013881 remove unwrap when LWC team makes changes to wrapping event payloads in membranes
        this.state.item = event.detail.item ? unwrap(event.detail.item) : event.detail.displayText;
    }


    /** HELPER METHODS */

    populateFerovMenuData() {
        this._rules = getRulesForContext({elementType: this._elementType});
        const elementParam = {
            [DATA_TYPE]: this._elementDataType,
            [IS_COLLECTION]: this._elementIsCollection,
            [ELEMENT_TYPE]: this._elementType
        };
        const rhsTypes = getRHSTypes(this._elementType, elementParam, 'Assign', this._rules);
        this._fullMenuData = getElementsForMenuData({ elementType: this._elementType}, rhsTypes, false);
        this.state.menuData = this._fullMenuData;
    }

    populateEntityMenuData() {
        this._fullMenuData = getEntitiesMenuData(this.crudFilterType);
        this.state.menuData = this._fullMenuData;
        /*
        when first initializing the entity menu data, our item will NOT have a value prop meaning it was not selected through combobox
        the item was given from store as a prop and only contains the api name. We want to get the entire item information
        */
        if (!this._isInitialized && this.initialItem && !this.initialItem.value) {
            const foundItem = this.state.menuData.find(item => item.value === this.initialItem);
            this.state.item = foundItem;
        }
    }

    populateMenuData() {
        switch (this.mode) {
            case RESOURCE_PICKER_MODE.FEROV_MODE:
                this.populateFerovMenuData();
                break;
            case RESOURCE_PICKER_MODE.ENTITY_MODE:
                this.populateEntityMenuData();
                break;
            // TODO: add case for populating with fields of entities
            default:
                break;
        }
    }
}