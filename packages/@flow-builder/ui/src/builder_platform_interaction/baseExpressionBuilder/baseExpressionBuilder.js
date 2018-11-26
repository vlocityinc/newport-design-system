import { LightningElement, api, track } from 'lwc';
import { RowContentsChangedEvent } from "builder_platform_interaction/events";
import { sanitizeGuid } from "builder_platform_interaction/dataMutationLib";
import {
    EXPRESSION_PROPERTY_TYPE,
    getStoreElements,
    filterAndMutateMenuData,
    filterFieldsForChosenElement,
    getResourceByUniqueIdentifier,
    getFerovDataTypeForValidId,
    isElementAllowed,
    filterMatches,
    LHS_DISPLAY_OPTION,
    getSecondLevelItems,
} from "builder_platform_interaction/expressionUtils";
import {
    getLHSTypes,
    getOperators,
    getRHSTypes,
    transformOperatorsForCombobox,
    elementToParam,
    isCollectionRequired,
    PARAM_PROPERTY,
    RULE_OPERATOR,
} from "builder_platform_interaction/ruleLib";
import { FEROV_DATA_TYPE, FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { isObject, isUndefined } from "builder_platform_interaction/commonUtils";
import { Store } from 'builder_platform_interaction/storeLib';
import genericErrorMessage from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;
const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;
const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;
const RHSDT = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

const DATA_TYPE = PARAM_PROPERTY.DATA_TYPE;

const CLEAR_VALUE = '';
const CLEAR_ERROR = null;
const CLEARED_PROPERTY = {value: CLEAR_VALUE, error: CLEAR_ERROR};

const SHOW_SUBTEXT = true;
const DISABLE_HAS_NEXT = false;

const LHS_FIELDS = 'lhsFields';
const RHS_FIELDS = 'rhsFields';
const LHS_FULL_MENU_DATA = 'lhsFullMenuData';
const LHS_FILTERED_MENU_DATA = 'lhsFilteredMenuData';
const RHS_FULL_MENU_DATA = 'rhsFullMenuData';
const RHS_FILTERED_MENU_DATA = 'rhsFilteredMenuData';

let storeInstance;

export default class BaseExpressionBuilder extends LightningElement {
    @track
    state = {
        operatorAndRhsDisabled: true,
        lhsParam: undefined,
        [LHS_FIELDS]: undefined,
        lhsParamTypes: undefined,
        lhsActivePicklistValues: undefined,
        [RHS_FIELDS]: undefined,
        [LHS_FULL_MENU_DATA]: undefined,
        [LHS_FILTERED_MENU_DATA]: undefined,
        [RHS_FULL_MENU_DATA]: undefined,
        [RHS_FILTERED_MENU_DATA]: undefined,
    };

    /**
     * @param {Object[]} rules  Rules to use when fetching menudata
     */
    set rules(rules) {
        this._rules = rules;
        this.setLhsMenuData();
    }

    @api
    get rules() {
        return this._rules;
    }

    /**
     * @param {String} elementType  the ELEMENT_TYPE of the property editor
     */
    set containerElement(elementType) {
        this._containerElement = elementType;
        this.setLhsMenuData();
    }

    @api
    get containerElement() {
        return this._containerElement;
    }

    /**
     * @param {String} object  the api name of the fields displayed on the LHS, if any
     */
    set objectType(object) {
        this._objectType = object;
        this.setLhsMenuData();
    }

    @api
    get objectType() {
        return this._objectType;
    }

    @api
    lhsPlaceholder;

    @api
    lhsLabel;

    @api
    lhsValue;

    @api
    lhsError;

    /**
     * @param {String[]} fields  fields that will populate the LHS menu data
     */
    set lhsFields(fields) {
        this.state[LHS_FIELDS] = fields;
        this.setLhsMenuData();
    }

    @api
    get lhsFields() {
        return this.state[LHS_FIELDS];
    }

    /**
     * @param {rules/param} param  the param representing the LHS, used for the rules
     */
    set lhsParam(param) {
        this.state.lhsParam = param;
        this._operatorMenuData = undefined;
        this.setLhsMenuData();
        if (param) {
            this.state.operatorAndRhsDisabled = false;

            this._rhsParamTypes = undefined;
            this.setRhsMenuData();
            this._rhsDataType = this.getRhsDataType();
        } else {
            this.state.operatorAndRhsDisabled = true;

            this.state[RHS_FULL_MENU_DATA] = this.state[RHS_FILTERED_MENU_DATA] = undefined;
        }
    }

    @api
    get lhsParam() {
        return this.state.lhsParam;
    }

    /**
     * @param {Object[]} values  the picklist values associated with the LHS value, if the LHS value is a field
     */
    set lhsActivePicklistValues(values) {
        this.state.lhsActivePicklistValues = values;
        this.setRhsMenuData();
    }

    @api
    get lhsActivePicklistValues() {
        return this.state.lhsActivePicklistValues;
    }

    /**
     * @param {String} display  LHS_DISPLAY_OPTION determines how LHS should be displayed
     */
    set lhsDisplayOption(display) {
        if (!Object.values(LHS_DISPLAY_OPTION).find(option => option === display)) {
            throw new Error(`Display option must be one of the predefined options but instead was ${display}`);
        }
        this._lhsDisplayOption = display;
        this.setLhsMenuData();
    }

    @api
    get lhsDisplayOption() {
        return this._lhsDisplayOption;
    }

    @api
    operatorLabel;

    /**
     * @param {String} value  operator value for the expression
     */
    set operatorValue(value) {
        this._operatorValue = value;
        this._rhsParamTypes = undefined;
        this.state[RHS_FULL_MENU_DATA] = this.state[RHS_FILTERED_MENU_DATA] = undefined;
        this.setRhsMenuData();
        this._rhsDataType = this.getRhsDataType();
    }

    @api
    get operatorValue() {
        return this._operatorValue;
    }

    @api
    operatorError;

    @api
    hideOperator = false;

    @api
    operatorPlaceholder;

    @api
    rhsLabel;

    @api
    rhsValue;

    @api
    rhsError;

    @api
    blockRhsValidation = false;

    /**
     * @param {Boolean} isFer   true if RHS is a FER, false if RHS is a FEROV
     */
    set rhsIsFer(isFer) {
        this._rhsIsFer = isFer;
        this.setRhsMenuData();
    }

    @api
    get rhsIsFer() {
        return this._rhsIsFer;
    }

    /**
     * @param {Boolean} isField  true if the RHS is a field on an sobject var
     */
    set rhsIsField(isField) {
        this._rhsIsField = isField;
        this.setRhsMenuData();
    }

    @api
    get rhsIsField() {
        return this._rhsIsField;
    }

    /**
     * @param {Object[]} fields  fields to populate RHS menu data, if drilling into an sobject var
     */
    set rhsFields(fields) {
        this.state[RHS_FIELDS] = fields;
        this.setRhsMenuData();
    }

    @api
    get rhsFields() {
        return this.state[RHS_FIELDS];
    }

    @api
    rhsPlaceholder;

    /**
     * @param {Boolean} allowed  true if RHS is a FEROV
     */
    set rhsLiteralsAllowed(allowed) {
        this._rhsLiteralsAllowedForContext = allowed;
        this._rhsDataType = this.getRhsDataType();
    }

    @api
    get rhsLiteralsAllowed() {
        return !this.rhsIsFer && this._rhsLiteralsAllowedForContext && !isCollectionRequired(this.getRhsParamTypes(), this._rhsDataType);
    }

    get rhsDataType() {
        return this._rhsDataType || FEROV_DATA_TYPE.STRING;
    }

    /**
     * @returns {rules/param[]|undefined} the params from the rules, based on LHS and operator value, that should be used to
     * filter menu data for the RHS
     * OR if RHS is a FER we do not want to pass down the allowedParamTypes because we want to force the combobox to validate against the menu data
     */
    get rhsParamTypes() {
        return this.rhsIsFer ? undefined : this.getRhsParamTypes();
    }

    @api
    get hideFerovMenuData() {
        return this._hideFerovMenuData;
    }

    /**
     * @type {boolean} hide hides FEROV-specific menu data (like global constants) when set to true.
     */
    set hideFerovMenuData(hide) {
        this._hideFerovMenuData = !!hide;
        this.setRhsMenuData();
    }

    @api
    get hideSystemVariables() {
        return this._hideSystemVariables;
    }

    /**
     * @type {boolean} hide hides system variables menu options.
     */
    set hideSystemVariables(hide) {
        this._hideSystemVariables = !!hide;
        this.setRhsMenuData();
    }

    /**
     * Set it to true to hide 'New Resource' option in combobox menu data.
     * @type {Boolean}
     */
    @api hideNewResource = false;

    _containerElement;
    _objectType;
    _rules;
    _lhsDisplayOption;
    _operatorValue;
    _operatorMenuData;
    _rhsDataType;
    _rhsIsField;
    _rhsIsFer;
    _rhsParamTypes;
    _rhsLiteralsAllowedForContext = false;
    _unsubscribeStore;
    _hideFerovMenuData = false;
    _hideSystemVariables = false;

    /**
     * Sets LHS menu data if all the necessary attributes have been initialized
     */
    setLhsMenuData() {
        if (!this.areAllDefined([this.containerElement, this.rules, this.lhsFields,
            this.lhsDisplayOption])) {
            return;
        }
        this.lhsParamTypes = getLHSTypes(this.containerElement, this.rules);

        const isFieldMenuData = this.lhsFields && (this.lhsDisplayOption !== LHS_DISPLAY_OPTION.NOT_FIELD);
        const parentMenuItem = isFieldMenuData ? this.getLhsParent() : null;
        this.populateLhsMenuData(isFieldMenuData, parentMenuItem);
    }

    /**
     * Sets operator menu data if all the necessary attributes have been initialized
     */
    get operatorMenuData() {
        if (this.areAllDefined([this.containerElement, this.lhsParam]) && !this._operatorMenuData) {
            let operators = [];
            if (this.lhsParam) {
                operators = getOperators(this.containerElement, this.lhsParam, this._rules);
            } else if (this.operatorValue) {
                // we want to display the current operator
                operators = [this.operatorValue];
            }
            this._operatorMenuData = transformOperatorsForCombobox(operators);
        }
        return this._operatorMenuData;
    }

    /**
     * Sets RHS menu data if all the necessary attributes have been initialized
     */
    setRhsMenuData() {
        if (!this.areAllDefined([this.containerElement, this.lhsActivePicklistValues,
            this.rhsIsField, this.rhsFields, this.rhsIsFer]) || !this.lhsParam || !this.operatorForRules()) {
            return;
        }

        const isFieldMenuData = this.rhsIsField && this.rhsFields && this.rhsValue;
        const parentMenuItem = isFieldMenuData ? this.rhsValue.parent : null;
        this.populateRhsMenuData(isFieldMenuData, parentMenuItem);
    }

    /**
     * Determines dataType allowed on RHS based on the rules and the current LHS and operator value
     */
    getRhsDataType(lhsParam = this.lhsParam, rhsTypes = this.getRhsParamTypes()) {
        let dataType = null;
        if (this._rhsLiteralsAllowedForContext && rhsTypes) {
            const allowedDataTypes = this.getPossibleRHSDataTypes(rhsTypes);

            // Currency & Number are treated the same by the combobox, so we shouldn't consider them as multiple different types
            if (allowedDataTypes.length > 1 && allowedDataTypes.includes(FLOW_DATA_TYPE.CURRENCY.value) && allowedDataTypes.includes(FLOW_DATA_TYPE.NUMBER.value)) {
                allowedDataTypes.splice(allowedDataTypes.indexOf(FLOW_DATA_TYPE.CURRENCY.value), 1);
            }

            if (allowedDataTypes.length === 1) {
                dataType = allowedDataTypes[0];
            } else if (allowedDataTypes.length > 1 && lhsParam[DATA_TYPE]) {
                dataType = lhsParam[DATA_TYPE];
            }
        }
        return dataType;
    }

    /**
     * Initializes rhsParamTypes if they are undefined
     *
     * @returns {rules/param[]} The param types that should be used to build rhs menu data & validate rhs when it's a ferov
     */
    getRhsParamTypes() {
        if (!this._rhsParamTypes) {
            this._rhsParamTypes = getRHSTypes(this.containerElement, this.lhsParam, this.operatorForRules(), this._rules);
        }
        return this._rhsParamTypes;
    }

    /**
     * @returns {String[]}  dataTypes allowed on RHS based on the rules and the current LHS and operator value
     */
    getPossibleRHSDataTypes(rhsTypes) {
        return Object.keys(rhsTypes)
            .filter(key => rhsTypes[key][0] && rhsTypes[key][0][DATA_TYPE])
            .map(key => rhsTypes[key][0][DATA_TYPE]);
    }

    /**
     * After rendering we are setting the operator error (if it exists)
     * via setCustomValidity
     */
    renderedCallback() {
        this.setOperatorErrorMessage(this.operatorError);
    }

    /**
     * Sets validity & shows error on the operator combobox
     *
     * @param {String} errorMessage   errorMessage to be set on the operator combobox
     */
    setOperatorErrorMessage(errorMessage) {
        if (!this.hideOperator) {
            const lightningCombobox = this.template.querySelector('.operator');
            lightningCombobox.setCustomValidity(errorMessage);
            lightningCombobox.showHelpMessageIfInvalid();
        }
    }

    constructor() {
        super();
        storeInstance = Store.getStore();
        this._unsubscribeStore = storeInstance.subscribe(this.handleStoreChange);
    }
    /**
     * Unsubscribe from the store.
     */
    disconnectedCallback() {
        if (typeof this._unsubscribeStore === 'function') {
            this._unsubscribeStore();
        }
    }
    /**
     * Callback from the store for changes in store.
     */
    handleStoreChange = () => {
        this.setLhsMenuData();
        this.setRhsMenuData();
    };

    /**
     * Toggles whether operator & RHS are disabled
     *
     * @param {Object} event    itemSelected event
     */
    handleLhsItemSelected(event) {
        this.state.operatorAndRhsDisabled = false;

        if (!this._operatorMenuData || !this._operatorMenuData.length) {
            const selectedLhs = this.getElementOrField(event.detail.item.value, this.lhsFields);
            this._operatorMenuData = transformOperatorsForCombobox(getOperators(this.containerElement, selectedLhs, this._rules));
        }
    }

    /**
     * Toggles whether operator & RHS are disabled, and filters LHS menu data based on user entry
     *
     * @param {Object} event   filterMatches event
     */
    handleFilterLhsMatches(event) {
        event.stopPropagation();
        // TODO: W-5340967 add the full combobox value to filter matches so it can be used here
        this.state.operatorAndRhsDisabled = !this.template.querySelector('.lhs').value;
        if (this.state[LHS_FULL_MENU_DATA]) {
            this.state[LHS_FILTERED_MENU_DATA] = filterMatches(event.detail.value, this.state[LHS_FULL_MENU_DATA], event.detail.isMergeField);
        }
    }

    /**
     * Filters RHS menu data based on user entry
     *
     * @param {Object} event   filterMatches event
     */
    handleFilterRhsMatches(event) {
        event.stopPropagation();
        if (this.state[RHS_FULL_MENU_DATA]) {
            this.state[RHS_FILTERED_MENU_DATA] = filterMatches(event.detail.value, this.state[RHS_FULL_MENU_DATA], event.detail.isMergeField);
        }
    }

    /**
     * Fetches new level of menu data for LHS
     *
     * @param {Object} event   fetchMenuData event
     */
    handleFetchLhsMenuData(event) {
        if (event.detail.item) {
            this.state.operatorAndRhsDisabled = false;
        }
        this.populateLhsMenuData(!!event.detail.item, event.detail.item);
    }

    /**
     * Fetches new level of menu data for RHS
     *
     * @param {Object} event   fetchMenuData event
     */
    handleFetchRhsMenuData(event) {
        this.populateRhsMenuData(!!event.detail.item, event.detail.item);
    }

    /**
     * Helper method to pass values to populateMenuData which never change for LHS
     *
     * @param {Boolean} getFields       true if the menu data should be fields
     * @param {Object} parentMenuItem   object representing the parent object of the fields, if getFields is true
     */
    populateLhsMenuData(getFields, parentMenuItem) {
        const shouldBeWritable = true;
        const isDisplayedAsFieldReference = this.lhsDisplayOption !== LHS_DISPLAY_OPTION.SOBJECT_FIELD;

        this.populateMenuData(getFields, parentMenuItem, LHS_FULL_MENU_DATA, LHS_FILTERED_MENU_DATA, LHS_FIELDS,
            this.lhsParamTypes, shouldBeWritable, isDisplayedAsFieldReference);
    }

    /**
     * Helper method to pass values to populateMenuData which never change for RHS
     *
     * @param {Boolean} getFields       true if the menu data should be fields
     * @param {Object} parentMenuItem   object representing the parent object of the fields, if getFields is true
     */
    populateRhsMenuData(getFields, parentMenuItem) {
        const isDisplayedAsFieldReference = true;

        // if only FERs are allowed, RHS must be writable
        const shouldBeWritable = this.rhsIsFer;

        // the picklist values of the field are shown as helpers when RHS can be FEROV - if RHS must be a FER they aren't applicable
        const picklistValues = this.rhsIsFer ? null : this.lhsActivePicklistValues;

        this.populateMenuData(getFields, parentMenuItem, RHS_FULL_MENU_DATA, RHS_FILTERED_MENU_DATA, RHS_FIELDS,
            this.getRhsParamTypes(), shouldBeWritable, isDisplayedAsFieldReference, !this.rhsIsFer, picklistValues);
    }

    /**
     * Generic helper function to handle populating fields for LHS or RHS
     *
     * @param {Boolean} getFields                      true if the menu data should be fields
     * @param {Object} parentMenuItem                  object representing the parent object of the fields, if getFields is true
     * @param {String} fullMenuData                    the name of the property on the state where the full menu data should be stored
     * @param {String} filteredMenuData                the name of the property on the state where the filtered menu data should be stored
     * @param {Object[]} preFetchedFields              the name of the property on the state which holds the fields for the menu data
     * @param {rule/param[]} paramTypes                the param types that should be used to filter the menu data
     * @param {Boolean} shouldBeWritable               true if the items in the menu data must be writable
     * @param {Boolean} isDisplayedAsFieldReference    true if the items should be displayed as fields on sobject variables when chosen
     * @param {Boolean} isFerov                        true if this combobox holds FEROVs
     * @param {String[]} picklistValues                list of picklist values that should be included in menu data
     */
    populateMenuData(getFields, parentMenuItem, fullMenuData, filteredMenuData, preFetchedFields, paramTypes,
        shouldBeWritable, isDisplayedAsFieldReference, isFerov, picklistValues) {
        const config = {
            elementType: this.containerElement,
            shouldBeWritable,
        };

        const setFieldMenuData = (fields = this.state[preFetchedFields]) => {
            this.state[preFetchedFields] = fields;
            this.state[fullMenuData] = this.state[filteredMenuData] = filterFieldsForChosenElement(parentMenuItem, paramTypes, fields, isDisplayedAsFieldReference, SHOW_SUBTEXT);
        };

        if (getFields) {
            let preFetchedFieldsObjectType;
            // get the sobject type from the first field
            for (const prop in this.state[preFetchedFields]) {
                if (this.state[preFetchedFields].hasOwnProperty(prop)) {
                    preFetchedFieldsObjectType = this.state[preFetchedFields][prop].sobjectName;
                    break;
                }
            }
            // get fields if preFetchedFields is empty or of the wrong sobject
            if (parentMenuItem && (!this.state[preFetchedFields] || preFetchedFieldsObjectType !== parentMenuItem.objectType)) {
                getSecondLevelItems(config, parentMenuItem.objectType, setFieldMenuData);
            } else {
                setFieldMenuData();
            }
        } else {
            const menuDataElements = getStoreElements(storeInstance.getCurrentState(), config);
            this.state[fullMenuData] = this.state[filteredMenuData] = filterAndMutateMenuData(menuDataElements, paramTypes,
                !this.hideNewResource, isFerov && !this.hideFerovMenuData, DISABLE_HAS_NEXT, picklistValues, !this.hideSystemVariables);
        }
    }

    areAllDefined(attributes) {
        const undefinedIndex = attributes.findIndex((attribute) => {
            return isUndefined(attribute);
        });
        return undefinedIndex < 0;
    }

    /**
     * @param {String} value       a guid
     * @param {Object[]} fields    fields populating the relevant menu data, if there are any
     * @returns {Object}           Object representing the field or the FER represented by the guid
     */
    getElementOrField(value, fields) {
        const fieldName = sanitizeGuid(value).fieldName;

        return fieldName ? fields[fieldName] : getResourceByUniqueIdentifier(value);
    }

    /**
     * Clears RHS if it has become invalid
     *
     * @param {Object} expressionUpdates    represents any changes that are already being made to the expression
     * @param {rules/param} lhsParam        representation of the lhs value that can be used with the rules
     * @param {String} operator             operator value
     */
    clearRhsIfNecessary(expressionUpdates, lhsParam, operator, rhsTypes) {
        if (this.rhsValue && this.rhsValue.value) {
            const rhsElementOrField = this.getElementOrField(this.rhsValue.value, this.rhsFields);
            const rhsValid = isElementAllowed(rhsTypes, elementToParam(rhsElementOrField));
            if (!rhsValid) {
                expressionUpdates[RHS] = CLEARED_PROPERTY;
            }
        }
    }

    resetRhsProperties(expressionUpdates, lhsParam, operator) {
        const rhsTypes = getRHSTypes(this.containerElement, lhsParam, operator, this._rules);
        this.clearRhsIfNecessary(expressionUpdates, lhsParam, operator, rhsTypes);

        const rhsDataType = operator ? this.getRhsDataType(lhsParam, rhsTypes) : CLEAR_VALUE;
        if (!this.rhsIsFer && rhsDataType !== this._rhsDataType) {
            expressionUpdates[RHSDT] = {value: rhsDataType, error: CLEAR_ERROR};
        }
    }

    /**
     * Creates new object representing the updates for the operator, and checks updated operator and RHS validity
     *
     * @param {Object} event  ComboboxStateChangedEvent that was fired from the LHS combobox
     */
    handleLhsValueChanged(event) {
        event.stopPropagation();
        const expressionUpdates = {};
        let newLhsParam;
        let newValue = event.detail.displayText || CLEAR_VALUE;
        let newError = event.detail.error || CLEAR_ERROR;

        // update LHS value & error
        const lhsElementOrField = event.detail.item ? this.getElementOrField(event.detail.item.value, this.lhsFields) : null;
        if (lhsElementOrField && !newError) {
            newValue = event.detail.item.value;
            newLhsParam = elementToParam(lhsElementOrField);
        } else if (newValue && !newError) {
            newError = genericErrorMessage;
        }
        expressionUpdates[LHS] = {value: newValue, error: newError};

        // clear operator if necessary
        if (this.operatorValue && !(newLhsParam && getOperators(this.containerElement, newLhsParam, this._rules).includes(this.operatorValue))) {
            expressionUpdates[OPERATOR] = CLEARED_PROPERTY;
        }

        // clear or update rhs & rhs data type if necessary
        this.resetRhsProperties(expressionUpdates, newLhsParam, this.operatorForRules());

        this.fireRowContentsChangedEvent(expressionUpdates);
    }

    /**
     * Creates new object representing the updates for the operator, and checks updated RHS validity
     *
     * @param {Object} event  ComboboxStateChangedEvent that was fired from the operator combobox
     */
    handleOperatorChanged(event) {
        event.stopPropagation();
        const newOperator = event.detail.value;
        const expressionUpdates = {[OPERATOR]: {value: newOperator, error: CLEAR_ERROR}};

        this.resetRhsProperties(expressionUpdates, this.lhsParam, newOperator);

        this.fireRowContentsChangedEvent(expressionUpdates);
    }

    /**
     * Uses the new value of the RHS to also determine new values for the guid and datatype of the ferov
     *
     * @param {Object} event  ComboboxStateChangedEvent that was fired from the RHS combobox
     */
    handleRhsValueChanged(event) {
        event.stopPropagation();
        const rhsItem = event.detail.item;
        let error = event.detail.error || CLEAR_ERROR;
        let rhs = event.detail.displayText;
        let rhsdt = rhs ? this._rhsDataType : CLEAR_VALUE;

        // if rhsItem in the event payload is an object then we know the user selected an item from the menu data
        if (isObject(rhsItem) && !error) {
            // an item's unique id is stored in value
            rhs = rhsItem.value;
            // this data type covers the error case, or if the item represents a picklist value
            rhsdt = FEROV_DATA_TYPE.STRING;
            if (getResourceByUniqueIdentifier(rhsItem.value) || rhsItem.parent) {
                // if it's a store element it's FEROV dataType is 'REFERENCE', or it may be a faked element e.g. global constant false
                rhsdt = getFerovDataTypeForValidId(rhsItem.value);
            } else if (!this.lhsActivePicklistValues || !this.lhsActivePicklistValues.find((picklistItem) => picklistItem.value === rhsItem.value)) {
                // if it isn't uniquely identifiable, and it's not a faked item for a picklist value, something else is wrong
                rhs = event.detail.displayText;
                error = genericErrorMessage;
            }
        }

        const expressionUpdates = {
            [RHS]: {value: rhs, error},
        };
        // if the rhs is a fer, we can store it as a single value without needing to preserve datatype or guid separately
        if (!this.rhsIsFer) {
            expressionUpdates[RHSDT] = {value: rhsdt, error: CLEAR_ERROR};
        }
        this.fireRowContentsChangedEvent(expressionUpdates);
    }

    fireRowContentsChangedEvent(newExpression) {
        this._rhsParamTypes = undefined;
        const rowContentsChangedEvent = new RowContentsChangedEvent(newExpression);
        this.dispatchEvent(rowContentsChangedEvent);
    }

    /**
     * To build menu data for a set of fields, information is needed about the parent object of those fields
     * @returns {Object} the parent of the fields, or a mock object with the necessary information
     */
    getLhsParent() {
        return this.objectType && this._lhsDisplayOption === LHS_DISPLAY_OPTION.SOBJECT_FIELD ?
            // This shape is needed for checking preFetchedFields & mutating to combobox field shape
            {
                objectType: this.objectType,
                value: this.objectType
            }
            : this.lhsValue.parent;
    }

    operatorForRules() {
        return this.hideOperator ? RULE_OPERATOR.ASSIGN : this.operatorValue;
    }
}
