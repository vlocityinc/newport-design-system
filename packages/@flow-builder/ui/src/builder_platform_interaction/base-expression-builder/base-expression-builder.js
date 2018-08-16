import { LightningElement, api, track } from 'lwc';
import { RowContentsChangedEvent } from 'builder_platform_interaction-events';
import { sanitizeGuid } from 'builder_platform_interaction-data-mutation-lib';
import {
    EXPRESSION_PROPERTY_TYPE,
    getElementsForMenuData,
    filterFieldsForChosenElement,
    getResourceByUniqueIdentifier,
    getResourceFerovDataType,
    isElementAllowed,
    filterMatches,
} from 'builder_platform_interaction-expression-utils';
import {
    getRulesForContext,
    getLHSTypes,
    getOperators,
    getRHSTypes,
    transformOperatorsForCombobox,
    elementToParam,
    PARAM_PROPERTY,
} from 'builder_platform_interaction-rule-lib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { isObject, isUndefined } from 'builder_platform_interaction-common-utils';

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
        containerElement: undefined,
        operatorAndRhsDisabled: true,
        lhsParam: undefined,
        lhsIsField: undefined,
        [LHS_FIELDS]: undefined,
        lhsParamTypes: undefined,
        showLhsAsFieldReference: undefined,
        lhsActivePicklistValues: undefined,
        lhsFullMenuData: undefined,
        lhsFilteredMenuData: undefined,
        operatorValue: undefined,
        [RHS_FIELDS]: undefined,
        rhsIsField: undefined,
        rhsLiteralsAllowedForContext: undefined,
        [LHS_FULL_MENU_DATA]: undefined,
        [LHS_FILTERED_MENU_DATA]: undefined,
        [RHS_FULL_MENU_DATA]: undefined,
        [RHS_FILTERED_MENU_DATA]: undefined,
    };

    @api
    set containerElement(elementType) {
        this.state.containerElement = elementType;
        this._rules = getRulesForContext({elementType});
        if (!this._rules) {
            throw new Error('Something went wrong fetching the rules');
        }
        this.lhsParamTypes = getLHSTypes(elementType, this._rules);
        this.setLhsMenuData();
    }

    @api
    get containerElement() {
        return this.state.containerElement;
    }

    @api
    lhsPlaceholder;

    @api
    lhsLabel;

    @api
    lhsValue;

    @api
    lhsError;

    @api
    set lhsFields(fields) {
        this.state.lhsFields = fields;
        this.setLhsMenuData();
    }

    @api
    get lhsFields() {
        return this.state[LHS_FIELDS];
    }

    @api
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

    @api
    set lhsActivePicklistValues(values) {
        this.state.lhsActivePicklistValues = values;
        this.setRhsMenuData();
    }

    @api
    get lhsActivePicklistValues() {
        return this.state.lhsActivePicklistValues;
    }

    @api
    set lhsIsField(isField) {
        this.state.lhsIsField = isField;
        this.setLhsMenuData();
    }

    @api
    get lhsIsField() {
        return this.state.lhsIsField;
    }

    @api
    set showLhsAsFieldReference(show) {
        this.state.showLhsAsFieldReference = show;
        this.setLhsMenuData();
    }

    @api
    get showLhsAsFieldReference() {
        return this.state.showLhsAsFieldReference;
    }

    @api
    operatorLabel;

    @api
    set operatorValue(value) {
        this.state.operatorValue = value;
        this._rhsParamTypes = undefined;
        this.setRhsMenuData();
        this.setRhsDataType();
    }

    @api
    get operatorValue() {
        return this.state.operatorValue;
    }

    @api
    operatorError;

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

    @api
    set rhsIsField(isField) {
        this.state.rhsIsField = isField;
        this.setRhsMenuData();
    }

    @api
    get rhsIsField() {
        return this.state.rhsIsField;
    }

    @api
    set rhsFields(fields) {
        this.state[RHS_FIELDS] = fields;
        this.setRhsMenuData();
    }

    @api
    get rhsFields() {
        return this.state.rhsFields;
    }

    @api
    rhsPlaceholder;

    @api
    set rhsLiteralsAllowed(allowed) {
        this.state.rhsLiteralsAllowedForContext = allowed;
        this.setRhsDataType();
    }

    @api
    get rhsLiteralsAllowed() {
        this.setRHSCollectionRequired();
        return this.state.rhsLiteralsAllowedForContext && !this._rhsCollectionRequiredByRules;
    }

    _rules;
    _operatorMenuData;
    _rhsDataType;
    _rhsParamTypes;
    _rhsCollectionRequiredByRules;

    setLhsMenuData() {
        if (!this.areAllDefined([this.containerElement, this.lhsParam, this.lhsFields,
            this.lhsIsField, this.showLhsAsFieldReference])) {
            return;
        }

        const isFieldMenuData = this.lhsIsField && this.lhsFields && this.lhsValue;
        const parentMenuItem = isFieldMenuData ? this.lhsValue.parent : null;
        this.populateLhsMenuData(isFieldMenuData, parentMenuItem);
    }

    get operatorMenuData() {
        if (this.areAllDefined([this.containerElement, this.lhsParam]) && !this._operatorMenuData) {
            this._operatorMenuData = transformOperatorsForCombobox(getOperators(this.containerElement, this.lhsParam, this._rules));
        }
        return this._operatorMenuData;
    }

    setRhsMenuData() {
        if (!this.areAllDefined([this.containerElement, this.lhsActivePicklistValues,
            this.rhsIsField, this.rhsFields]) || !this.lhsParam || !this.operatorValue) {
            return;
        }

        const isFieldMenuData = this.rhsIsField && this.rhsFields && this.rhsValue;
        const parentMenuItem = isFieldMenuData ? this.rhsValue.parent : null;
        this.populateRhsMenuData(isFieldMenuData, parentMenuItem);
    }

    get rhsParamTypes() {
        if (!this._rhsParamTypes) {
            this._rhsParamTypes = getRHSTypes(this.containerElement, this.lhsParam, this.operatorValue, this._rules);
        }
        return this._rhsParamTypes;
    }

    setRhsDataType() {
        if (!this.state.rhsLiteralsAllowedForContext || !this.rhsParamTypes) {
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

        return this._rhsDataType;
    }

    get rhsDataType() {
        return this._rhsDataType;
    }

    getPossibleRHSDataTypes() {
        return Object.keys(this.rhsParamTypes)
            .filter(key => this.rhsParamTypes[key][0][DATA_TYPE])
            .map(key => this.rhsParamTypes[key][0][DATA_TYPE]);
    }

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

    /** After rendering we are setting the operator error (if it exists)
     *  via setCustomValidity
     */
    renderedCallback() {
        this.setOperatorErrorMessage(this.operatorError);
    }

    setOperatorErrorMessage(errorMessage) {
        const lightningCombobox = this.template.querySelector('.operator');
        lightningCombobox.setCustomValidity(errorMessage);
        lightningCombobox.showHelpMessageIfInvalid();
    }

    handleLhsItemSelected(event) {
        this.state.operatorAndRhsDisabled = false;

        if (!this._operatorMenuData || !this._operatorMenuData.length) {
            const selectedLhs = this.getElementOrField(event.detail.item.value, this.lhsFields);
            this._operatorMenuData = transformOperatorsForCombobox(getOperators(this.containerElement, selectedLhs, this._rules));
        }
    }

    handleFilterLhsMatches(event) {
        event.stopPropagation();
        // TODO: W-5340967 add the full combobox value to filter matches so it can be used here
        this.state.operatorAndRhsDisabled = !this.template.querySelector('.lhs').value;
        this.state[LHS_FILTERED_MENU_DATA] = filterMatches(event.detail.value, this.state[LHS_FULL_MENU_DATA], event.detail.isMergeField);
    }

    handleFilterRhsMatches(event) {
        event.stopPropagation();
        this.state[RHS_FILTERED_MENU_DATA] = filterMatches(event.detail.value, this.state[RHS_FULL_MENU_DATA], event.detail.isMergeField);
    }

    handleFetchLhsMenuData(event) {
        this.populateLhsMenuData(!!event.detail.item, event.detail.item);
    }

    handleFetchRhsMenuData(event) {
        this.populateRhsMenuData(!!event.detail.item, event.detail.item);
    }

    populateLhsMenuData(getFields, parentMenuItem) {
        const shouldBeWritable = false;

        this.populateMenuData(getFields, parentMenuItem, LHS_FULL_MENU_DATA, LHS_FILTERED_MENU_DATA, LHS_FIELDS,
            this.lhsParamTypes, shouldBeWritable, this.showLhsAsFieldReference);
    }

    populateRhsMenuData(getFields, parentMenuItem) {
        const isFerov = true;
        const showAsFieldReference = true;
        const shouldBeWritable = true;

        this.populateMenuData(getFields, parentMenuItem, RHS_FULL_MENU_DATA, RHS_FILTERED_MENU_DATA, RHS_FIELDS,
            this.rhsParamTypes, shouldBeWritable, showAsFieldReference, isFerov, this.lhsActivePicklistValues);
    }

    populateMenuData(getFields, parentMenuItem, fullMenuData, filteredMenuData, preFetchedFields, paramTypes,
        shouldBeWritable, showAsFieldReference, isFerov, picklistValues) {
        const config = {
            elementType: this.containerElement,
            shouldBeWritable,
        };

        const setFieldMenuData = (fields = this.state[preFetchedFields]) => {
            this.state[preFetchedFields] = fields;
            this.state[fullMenuData] = this.state[filteredMenuData] = filterFieldsForChosenElement(parentMenuItem, paramTypes, fields, showAsFieldReference, SHOW_SUBTEXT);
        };

        if (getFields) {
            if (parentMenuItem) {
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

    getElementOrField(value, fields) {
        const complexGuid = sanitizeGuid(value);

        if (complexGuid.fieldName && !fields) {
            throw new Error('fields should have already been initialized');
        }

        return complexGuid.fieldName ? fields[complexGuid.fieldName] : getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);
    }

    clearRhs(newExpression) {
        newExpression[RHS] = CLEARED_PROPERTY;
        newExpression[RHSG] = CLEARED_PROPERTY;
        newExpression[RHSDT] = CLEARED_PROPERTY;
    }

    clearRhsIfNecessary(expressionUpdates, lhsParam, operator) {
        if (this.rhsGuid) {
            const newRhsTypes = getRHSTypes(this.containerElement, lhsParam, operator, this._rules);
            const rhsElementOrField = this.getElementOrField(this.rhsGuid, this.rhsFields);
            const rhsValid = isElementAllowed(newRhsTypes, elementToParam(rhsElementOrField));
            if (!rhsValid) {
                this.clearRhs(expressionUpdates);
            }
        } else if (this.rhsValue) {
            // TODO: clear invalid literals
        }
    }

    handleLhsValueChanged(event) {
        event.stopPropagation();
        const selectedItem = event.detail.item;
        const newValue = selectedItem ? selectedItem.value : event.detail.displayText;
        const expressionUpdates = {[LHS]: {value: newValue || CLEAR_VALUE, error: event.detail.error || CLEAR_ERROR}};

        if (selectedItem) {
            const lhsElementOrField = this.getElementOrField(newValue, this.lhsFields);
            const newLhsParam = elementToParam(lhsElementOrField);

            if (!getOperators(this.containerElement, newLhsParam, this._rules).includes(this.operatorValue)) {
                // if the current operator is not valid
                expressionUpdates[OPERATOR] = CLEARED_PROPERTY;
                this.clearRhs(expressionUpdates);
            } else {
                this.clearRhsIfNecessary(expressionUpdates, newLhsParam, this.operatorValue);
            }
        } else {
            // Operator & rhs will be invalid or disabled in this case
            expressionUpdates[OPERATOR] = CLEARED_PROPERTY;
            this.clearRhs(expressionUpdates);
        }
        this.fireRowContentsChangedEvent(this.getUpdatedExpression(expressionUpdates));
    }

    handleOperatorChanged(event) {
        event.stopPropagation();
        const newOperator = event.detail.value;
        const expressionUpdates = {[OPERATOR]: {value: newOperator, error: CLEAR_ERROR}};

        this.clearRhsIfNecessary(expressionUpdates, this.lhsParam, newOperator);

        this.fireRowContentsChangedEvent(this.getUpdatedExpression(expressionUpdates));
    }

    handleRhsValueChanged(event) {
        event.stopPropagation();
        const rhsItem = event.detail.item;
        const error = event.detail.error || CLEAR_ERROR;
        let rhs, rhsg, rhsdt;

        // if rhsItem in the event payload is an object then we know the user selected an item from the menu data
        if (isObject(rhsItem)) {
            // check if the selected item references a flow element or field on a flow element
            if (getResourceByUniqueIdentifier(rhsItem.value) || rhsItem.parent) {
                // the item references an element so we update the rhs with that element reference
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
            [RHSDT]: {value: rhsdt, error: CLEAR_ERROR},
            [RHSG]: {value: rhsg || CLEAR_VALUE, error: CLEAR_ERROR},
        };
        this.fireRowContentsChangedEvent(this.getUpdatedExpression(expressionUpdates));
    }

    fireRowContentsChangedEvent(newExpression) {
        this._rhsParamTypes = undefined;
        const rowContentsChangedEvent = new RowContentsChangedEvent(newExpression);
        this.dispatchEvent(rowContentsChangedEvent);
    }

    getUpdatedExpression(expressionUpdates) {
        const propertyCurrentValues = {
            [LHS]: [LHS, this.lhsValue, this.lhsError],
            [OPERATOR]: [OPERATOR, this.operatorValue, this.operatorError],
            [RHS]: [RHS, this.rhsValue, this.rhsError],
            [RHSG]: [RHSG, this.rhsGuid, null],
        };

        const addPropertyToExpression = (property, itemOrLiteral, error) => {
            expressionUpdates[property] = {};
            expressionUpdates[property].value = itemOrLiteral ? itemOrLiteral.value || itemOrLiteral : CLEAR_VALUE;
            expressionUpdates[property].error = error || CLEAR_ERROR;
        };

        Object.keys(propertyCurrentValues).forEach((property) => {
            if (!expressionUpdates[property]) {
                addPropertyToExpression(...propertyCurrentValues[property]);
            }
        });

        if (!expressionUpdates[RHSDT]) {
            const rhsDataType = this.rhsGuid ? getResourceFerovDataType(this.rhsGuid) : this.rhsDataType || CLEAR_VALUE;
            expressionUpdates[RHSDT] = {value: rhsDataType, error: CLEAR_ERROR};
        }

        return expressionUpdates;
    }
}
