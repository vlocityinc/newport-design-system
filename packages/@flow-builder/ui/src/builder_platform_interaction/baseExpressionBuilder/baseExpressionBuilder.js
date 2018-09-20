import { LightningElement, api, track } from 'lwc';
import { RowContentsChangedEvent } from "builder_platform_interaction/events";
import { sanitizeGuid } from "builder_platform_interaction/dataMutationLib";
import {
    EXPRESSION_PROPERTY_TYPE,
    getElementsForMenuData,
    filterFieldsForChosenElement,
    getResourceByUniqueIdentifier,
    getResourceFerovDataType,
    isElementAllowed,
    filterMatches,
    LHS_DISPLAY_OPTION,
} from "builder_platform_interaction/expressionUtils";
import {
    getLHSTypes,
    getOperators,
    getRHSTypes,
    transformOperatorsForCombobox,
    elementToParam,
    PARAM_PROPERTY,
    RULE_OPERATOR,
} from "builder_platform_interaction/ruleLib";
import { FEROV_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { getFieldsForEntity } from "builder_platform_interaction/sobjectLib";
import { isObject, isUndefined } from "builder_platform_interaction/commonUtils";

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;
const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;
const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;
const RHSG = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID;
const RHSDT = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

const DATA_TYPE = PARAM_PROPERTY.DATA_TYPE;
const COLLECTION_REQUIRED = PARAM_PROPERTY.IS_COLLECTION;

const CLEAR_VALUE = '';
const CLEAR_ERROR = null;
const CLEARED_PROPERTY = {value: CLEAR_VALUE, error: CLEAR_ERROR};

const SHOW_SUBTEXT = true;
const SHOW_NEW_RESOURCE = true;
const DISABLE_HAS_NEXT = false;

const LHS_FIELDS = 'lhsFields';
const RHS_FIELDS = 'rhsFields';
const LHS_FULL_MENU_DATA = 'lhsFullMenuData';
const LHS_FILTERED_MENU_DATA = 'lhsFilteredMenuData';
const RHS_FULL_MENU_DATA = 'rhsFullMenuData';
const RHS_FILTERED_MENU_DATA = 'rhsFilteredMenuData';

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
            this.setRhsDataType();
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
        this.setRhsDataType();
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
    rhsGuid;

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
        this.setRhsDataType();
    }

    @api
    get rhsLiteralsAllowed() {
        this.setRHSCollectionRequired();
        return this._rhsLiteralsAllowedForContext && !this._rhsCollectionRequiredByRules;
    }

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
    _rhsCollectionRequiredByRules;
    _rhsLiteralsAllowedForContext = false;

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
            this._operatorMenuData = transformOperatorsForCombobox(getOperators(this.containerElement, this.lhsParam, this._rules));
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
     * Initializes RHS paramtypes if they haven't been initialized
     *
     * @returns {rules/param[]} the params from the rules, based on LHS and operator value, that should be used to
     * filter menu data for the RHS
     */
    get rhsParamTypes() {
        if (!this._rhsParamTypes) {
            this._rhsParamTypes = getRHSTypes(this.containerElement, this.lhsParam, this.operatorForRules(), this._rules);
        }
        return this._rhsParamTypes;
    }

    /**
     * Sets dataType allowed on RHS based on the rules and the current LHS and operator value
     */
    setRhsDataType() {
        if (!this._rhsLiteralsAllowedForContext || !this.rhsParamTypes) {
            this._rhsDataType = null;
        } else {
            const allowedDataTypes = this.getPossibleRHSDataTypes();

            if (allowedDataTypes.length === 1) {
                this._rhsDataType = allowedDataTypes[0];
            } else if (allowedDataTypes.length > 1 && this.lhsParam[DATA_TYPE]) {
                this._rhsDataType = this.lhsParam[DATA_TYPE];
            } else {
                this._rhsDataType = null;
            }
        }
    }

    get rhsDataType() {
        return this._rhsDataType;
    }

    /**
     * @returns {String[]}  dataTypes allowed on RHS based on the rules and the current LHS and operator value
     */
    getPossibleRHSDataTypes() {
        return Object.keys(this.rhsParamTypes)
            .filter(key => this.rhsParamTypes[key][0][DATA_TYPE])
            .map(key => this.rhsParamTypes[key][0][DATA_TYPE]);
    }

    /**
     * Determines if a collection is required on the RHS based on the rules and the current LHS and operator value
     */
    setRHSCollectionRequired() {
        this._rhsCollectionRequiredByRules = true;

        if (!this.rhsParamTypes) {
            return;
        }

        const dataType = this._rhsDataType;
        if (dataType && this.rhsParamTypes[dataType]) {
            const dataTypeParams = this.rhsParamTypes[dataType];
            const paramLiteralAllowed = dataTypeParams.find((param) => {
                return !param[COLLECTION_REQUIRED];
            });
            this._rhsCollectionRequiredByRules = isUndefined(paramLiteralAllowed);
        }
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
            this.rhsParamTypes, shouldBeWritable, isDisplayedAsFieldReference, !this.rhsIsFer, picklistValues);
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
                getFieldsForEntity(parentMenuItem.objectType, setFieldMenuData);
            } else {
                setFieldMenuData();
            }
        } else {
            this.state[fullMenuData] = this.state[filteredMenuData] = getElementsForMenuData(config, paramTypes,
                SHOW_NEW_RESOURCE, isFerov, DISABLE_HAS_NEXT, picklistValues);
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
     * @returns {Object}           Object representing the field or the FER represented by the quid
     */
    getElementOrField(value, fields) {
        const complexGuid = sanitizeGuid(value);

        if (complexGuid.fieldName && !fields) {
            throw new Error('fields should have already been initialized');
        }

        return complexGuid.fieldName ? fields[complexGuid.fieldName] : getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);
    }

    /**
     * Clears all properties associated with the RHS
     * @param {Object} newExpression   the changes already being made to the expression
     */
    clearRhs(newExpression) {
        newExpression[RHS] = CLEARED_PROPERTY;
        if (!this.rhsIsFer) {
            newExpression[RHSG] = CLEARED_PROPERTY;
            newExpression[RHSDT] = CLEARED_PROPERTY;
        }
    }

    /**
     * Clears RHS if it has become invalid
     *
     * @param {Object} expressionUpdates    represents any changes that are already being made to the expression
     * @param {rules/param} lhsParam        representation of the lhs value that can be used with the rules
     * @param {String} operator             operator value
     */
    clearRhsIfNecessary(expressionUpdates, lhsParam, operator) {
        if (this.rhsGuid) {
            const newRhsTypes = getRHSTypes(this.containerElement, lhsParam, operator, this._rules);
            const rhsElementOrField = this.getElementOrField(this.rhsGuid, this.rhsFields);
            const rhsValid = isElementAllowed(newRhsTypes, elementToParam(rhsElementOrField));
            if (!rhsValid) {
                this.clearRhs(expressionUpdates);
            }
        }
    }

    /**
     * Creates new object representing the updates for the operator, and checks updated operator and RHS validity
     *
     * @param {Object} event  ComboboxStateChangedEvent that was fired from the LHS combobox
     */
    handleLhsValueChanged(event) {
        event.stopPropagation();
        const selectedItem = event.detail.item;
        const newValue = selectedItem ? selectedItem.value : event.detail.displayText;
        const expressionUpdates = {[LHS]: {value: newValue || CLEAR_VALUE, error: event.detail.error || CLEAR_ERROR}};
        this.state.operatorAndRhsDisabled = !!event.detail.error;

        if (selectedItem) {
            const lhsElementOrField = this.getElementOrField(newValue, this.lhsFields);
            const newLhsParam = elementToParam(lhsElementOrField);

            if (!this.hideOperator && !getOperators(this.containerElement, newLhsParam, this._rules).includes(this.operatorValue)) {
                // if the current operator is not valid
                expressionUpdates[OPERATOR] = CLEARED_PROPERTY;
                this.clearRhs(expressionUpdates);
            } else {
                this.clearRhsIfNecessary(expressionUpdates, newLhsParam, this.operatorForRules());
            }
        } else {
            // Operator & rhs will be invalid or disabled in this case
            if (!this.hideOperator) {
                expressionUpdates[OPERATOR] = CLEARED_PROPERTY;
            }
            this.clearRhs(expressionUpdates);
        }
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

        this.clearRhsIfNecessary(expressionUpdates, this.lhsParam, newOperator);

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
        const error = event.detail.error || CLEAR_ERROR;
        let rhs, rhsg, rhsdt;

        // if rhsItem in the event payload is an object then we know the user selected an item from the menu data
        if (isObject(rhsItem)) {
            // if the rhs is a fer, we can store it as a single value without needing to preserve datatype or guid separately
            if (this.rhsIsFer) {
                rhs = rhsItem.value;
            } else if (getResourceByUniqueIdentifier(rhsItem.value) || rhsItem.parent) {
                // rhs is a FEROV and the item references an element so we update the rhs with that element reference
                rhs = rhsItem.displayText;
                rhsg = rhsItem.value;
                rhsdt = getResourceFerovDataType(rhsItem.value);
            } else {
                // the item references a picklist value
                rhs = rhsItem.value;
                rhsdt = FEROV_DATA_TYPE.STRING;
            }
        } else {
            // rhs isn't an item, so it's a literal or blank
            rhs = event.detail.displayText;
            rhsdt = rhs ? this._rhsDataType : CLEAR_VALUE;
        }

        const expressionUpdates = {
            [RHS]: {value: rhs, error},
        };
        if (!this.rhsIsFer) {
            expressionUpdates[RHSDT] = {value: rhsdt, error: CLEAR_ERROR};
            expressionUpdates[RHSG] = {value: rhsg || CLEAR_VALUE, error: CLEAR_ERROR};
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
