import { Element, api, track } from 'engine';
import { RowContentsChangedEvent } from 'builder_platform_interaction-events';
import { updateProperties, getValueFromHydratedItem, sanitizeGuid } from 'builder_platform_interaction-data-mutation-lib';
import {
    EXPRESSION_PROPERTY_TYPE,
    getElementsForMenuData,
    filterMatches,
    normalizeLHS,
    isElementAllowed,
    normalizeRHS,
    filterFieldsForChosenElement,
    OPERATOR_DISPLAY_OPTION,
    getResourceByUniqueIdentifier,
    getResourceFerovDataType,
} from 'builder_platform_interaction-expression-utils';
import { getRulesForContext, getLHSTypes, getOperators, getRHSTypes, transformOperatorsForCombobox,
    elementToParam, RULE_OPERATOR } from 'builder_platform_interaction-rule-lib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { isUndefinedOrNull, isObject } from 'builder_platform_interaction-common-utils';
import genericErrorMessage from "@salesforce/label/FlowBuilderCombobox.genericErrorMessage";

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;

const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const RHSDT = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

const RHSG = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID;

// the element type where this expression lives
let elementType;
let rules;
let contextConfig;

/**
 * Expression Builder for Flow Builder
 *
 * @ScrumTeam Process UI
 * @author Jesenia Garcia-Rovetta
 * @since 214
 */
export default class ExpressionBuilder extends Element {
    @track
    state = {
        expression: undefined, // the expression to be displayed
        normalizedLHS: {}, // contains display, for the combobox to display, and parameter, to use with the rules service
        normalizedRHS: {}, // for the rhs combobox to display, as the rhs could be passed as a guid
        lhsMenuData: [], // the menu data being passed to lhs combobox
        operatorMenuData: undefined,
        rhsMenuData: [], // the menu data being passed to rhs combobox
        rhsTypes: null,
    };

    @track
    allowRHSLiterals = true;

    @track
    operatorAndRHSDisabled;

    set rhsLiteralsAllowed(allowed) {
        this.allowRHSLiterals = allowed;
    }

    @api
    get rhsLiteralsAllowed() {
        return this.allowRHSLiterals;
    }

    @api
    operatorDisplayOption = OPERATOR_DISPLAY_OPTION.COMBOBOX;

    @api
    get expression() {
        return {};
    }

    /**
     * This holds all the information that describes the contents of these three comboBoxes.
     * It's expected to hold an lhs, operator, and rhs, each of which has a comboBox Value,
     * the comboBoxes menu data, and any error that should be associated with that comboBox.
     *
     * @param {Object} expression   The expression to be represented.
     */
    set expression(expression) {
        // TODO error handling? W-4755917
        // TODO handle literals, "hi my name is {!firstName}" W-4817362
        // TODO handle multi-level merge fields W-4723095
        this.state.expression = expression;

        const lhsVal = getValueFromHydratedItem(expression[LHS]);
        if (expression[LHS] && !isUndefinedOrNull(lhsVal)) {
            this.state.normalizedLHS = normalizeLHS(lhsVal, elementType, (lhsIdentifier) => {
                if (!this._fetchedLHSInfo) {
                    this._fetchedLHSInfo = true;
                    const newExpression = updateProperties(this.state.expression, {[LHS] : {value : lhsIdentifier, error: expression[LHS].error}});
                    this.firePropertyChangedEvent(newExpression);
                }
            });
        }

        if (this.state.normalizedLHS.item) {
            this.operatorAndRHSDisabled = false;
            this.state.operatorMenuData = transformOperatorsForCombobox(getOperators(elementType, this.state.normalizedLHS.parameter, rules));
        } else {
            this.operatorAndRHSDisabled = true;
        }

        if (this.lhsIsFieldOnSobjectVariable()) {
            getFieldsForEntity(this.state.normalizedLHS.item.parent.subText, (fields) => {
                this._fullLHSMenuData = this.state.lhsMenuData = filterFieldsForChosenElement(this.state.normalizedLHS.item.parent, getLHSTypes(elementType, rules), fields, true, true);
            });
        }

        if (expression[OPERATOR]) {
            this.setOperatorErrorMessage(expression[OPERATOR].error);
        }

        // TODO default operator case W-4912900
        const rhsGuid = getValueFromHydratedItem(expression[RHSG]);
        const rhsVal = rhsGuid ? rhsGuid : getValueFromHydratedItem(expression[RHS]);
        if (expression[RHS] && !isUndefinedOrNull(rhsVal)) {
            normalizeRHS(rhsVal, this.state.normalizedLHS)
                .then((normalizedRHS) => {
                    this.state.normalizedRHS = normalizedRHS;
                    this.updateRHSWithFieldOnLoad(normalizedRHS.itemOrDisplayText);
                    if (lhsVal && this.operatorForRules()) {
                        this.populateRHSMenuData();
                    }
                });
        }
    }

    /**
     * These are for the column labels, such as "Variable" or "Resource"
     */
    @api
    lhsLabel;

    @api
    operatorLabel;

    @api
    rhsLabel;

    @api
    lhsPlaceholder;

    @api
    operatorPlaceholder;

    @api
    rhsPlaceholder;

    /**
     * @typedef expressionConfig
     * @param {String} elementType    the parent element of this expression
     * @param {String} objectType     the sObject which this expression is based on, i.e. for the LHS fields
     * @param {String[]} lhsFields    fields to be used for the LHS of this expression
     */

    set configuration(config) {
        contextConfig = config;
        elementType = contextConfig.elementType;
        rules = getRulesForContext(contextConfig);
        this.getLHSMenuData(contextConfig);
    }

    @api
    get configuration() {
        return contextConfig;
    }

    get lhsMenuData() {
        return this.state.lhsMenuData;
    }

    get rhsMenuData() {
        return this.state.rhsMenuData;
    }

    get showOperatorCombobox() {
        return this.operatorDisplayOption === OPERATOR_DISPLAY_OPTION.COMBOBOX;
    }

    get hasOperatorReplacement() {
        return this.operatorDisplayOption === OPERATOR_DISPLAY_OPTION.RIGHT_ARROW || this.operatorDisplayOption === OPERATOR_DISPLAY_OPTION.LEFT_ARROW;
    }
    /**
     * These are the text strings that should be displayed by the comboBoxes
     */
    get operatorComboBoxValue() {
        return this.state.expression[OPERATOR] ? this.state.expression[OPERATOR].value : null;
    }

    /* ***************** */
    /* Private Variables */
    /* ***************** */

    _fullLHSMenuData = [];

    _fullRHSMenuData = [];

    _clearedProperty = { value: '', error: null };

    _fetchedLHSInfo = false;

    _fetchedRHSInfo = false;

    firePropertyChangedEvent(newExpression) {
        const propertyChangedEvent = new RowContentsChangedEvent(newExpression);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleLHSItemSelected(event) {
        this.operatorAndRHSDisabled = false;

        if (!this.state.operatorMenuData) {
            const normalizedNewLHS = normalizeLHS(event.detail.item.value);
            this.state.operatorMenuData = transformOperatorsForCombobox(getOperators(elementType, normalizedNewLHS.parameter, rules));
        }
    }

    handleLHSValueChanged(event) {
        event.stopPropagation();
        this.state.operatorMenuData = undefined;
        const newLHSItem = event.detail.item;
        const newValue = newLHSItem ? newLHSItem.value : event.detail.displayText;
        const expressionUpdates = {[LHS] : {value: newValue, error: event.detail.error}};

        const lhsElementOrField = this.getElementOrField(newValue);
        if (lhsElementOrField) {
            const newLHSParam = elementToParam(lhsElementOrField);
            if (this.showOperatorCombobox && !getOperators(elementType, newLHSParam, rules).includes(this.state.expression.operator.value)) {
                // if the current operator is not valid
                this.clearExpression(expressionUpdates, true);
            } else if (this.state.expression.rightHandSideGuid && this.state.expression.rightHandSideGuid.value) {
                // if the current operator is valid && RHS is a flow element reference
                this.state.rhsTypes = getRHSTypes(elementType, newLHSParam, this.operatorForRules(), rules);
                const rhsElementOrField = this.getElementOrField(this.state.expression.rightHandSideGuid.value);
                const rhsValid = isElementAllowed(this.state.rhsTypes, elementToParam(rhsElementOrField));
                if (!rhsValid) {
                    this.clearExpression(expressionUpdates);
                }
            }
        } else {
            // Operator & RHS will be invalid or disabled in this case
            this.clearExpression(expressionUpdates, true);
        }
        const newExpression = updateProperties(this.state.expression, expressionUpdates);
        this.firePropertyChangedEvent(newExpression);
    }

    getElementOrField(value) {
        const complexGuid = sanitizeGuid(value);
        const flowElement = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);
        let elementOrField;
        if (complexGuid.fieldName) {
            const objectType = (flowElement) ? flowElement.objectType : contextConfig.objectType;
            getFieldsForEntity(objectType, (fields) => {
                elementOrField = fields[complexGuid.fieldName];
            });
        } else {
            elementOrField = flowElement;
        }
        return elementOrField;
    }

    handleOperatorChanged(event) {
        event.stopPropagation();
        const newOperator = event.detail.value;
        const expressionUpdates = {[OPERATOR]: {value: newOperator, error: null}};
        this.state.rhsTypes = getRHSTypes(elementType, this.state.normalizedLHS.parameter, newOperator, rules);
        if (this.state.expression.rightHandSideGuid && this.state.expression.rightHandSideGuid.value) {
            // if RHS is a flow element reference
            const rhsElementOrField = this.getElementOrField(this.state.expression.rightHandSideGuid.value);
            const rhsValid = isElementAllowed(this.state.rhsTypes, elementToParam(rhsElementOrField));
            if (!rhsValid) {
                this.clearExpression(expressionUpdates);
            }
        }
        const newExpression = updateProperties(this.state.expression, expressionUpdates);
        const propertyChangedEvent = new RowContentsChangedEvent(newExpression);
        this.dispatchEvent(propertyChangedEvent);
    }

    /**
     * Sets the RHS in the state's expression to the given object containing rhs, rhs data type, and rhs guid. It also sets any error message passed in
     * Also fires a row contents changed event after updating the state's expression
     * @param {Object} rhsAndRHSDT normalized RHS that contains the rhs, rhs data type, and rhs guid values
     * @param {String} error the existing error message we want to include in the rhs
     */
    setRHSAndFireRowContentsChanged(rhsAndRHSDT, error) {
        const newExpression = updateProperties(this.state.expression, rhsAndRHSDT);
        const propertyChangedEvent = new RowContentsChangedEvent(newExpression, error);
        this.dispatchEvent(propertyChangedEvent);
    }

    updateRHSWithElement(rhsItem, element, errorMessage) {
        let error = errorMessage;
        // the item references an element, so we need to check if the element is allowed
        // Checking if the element is allowed covers the edge case where an sobject is in RHS but an RHS field was needed (user did not end up selecting field)
        if (!error && !rhsItem.parent && !isElementAllowed(this.state.rhsTypes, elementToParam(element))) {
            error = genericErrorMessage;
        }
        const dataType = getResourceFerovDataType(rhsItem.value);
        const rhsAndRHSDT = {
            [RHS]: {value: rhsItem.displayText, error},
            [RHSDT]: {value: dataType, error: null},
            [RHSG]: {value: rhsItem.value, error: null},
        };
        this.setRHSAndFireRowContentsChanged(rhsAndRHSDT, error);
    }

    updateRHSWithPicklistValue(rhsItem, errorMessage) {
        let error = errorMessage;
        // if an error does not already exist, we validate the picklist value
        if (isUndefinedOrNull(errorMessage)) {
            error = this.findPicklistValue(rhsItem.value) ? null : genericErrorMessage;
        }
        const rhsAndRHSDT = {
            [RHS]: {value: rhsItem.value, error},
            [RHSDT]: {value: FEROV_DATA_TYPE.STRING, error: null},
            [RHSG]: this._clearedProperty,
        };
        this.setRHSAndFireRowContentsChanged(rhsAndRHSDT, error);
    }

    updateRHSWithLiteral(displayText, errorMessage) {
        const rhsAndRHSDT = {
            [RHS]: {value: displayText, error: errorMessage},
            // Use LHS dataType to determine desired RHS dataType, because there's no way to tell what the user meant from the value they entered
            // ex: '123' could be a string or a number
            [RHSDT]: {value: this.lhsType, error: null},
            [RHSG]: this._clearedProperty,
        };
        this.setRHSAndFireRowContentsChanged(rhsAndRHSDT, errorMessage);
    }

    handleRHSValueChanged(event) {
        event.stopPropagation();
        const rhsItem = event.detail.item;
        const errorMessage = event.detail.error;

        // if rhsItem in the event payload is an object then we know the user selected an item from the menu data
        if (isObject(rhsItem)) {
            // check if the selected item references a flow element (or field on a flow element)
            const element = getResourceByUniqueIdentifier(rhsItem.value);
            if (element || rhsItem.parent) {
                // the item references an element so we update the rhs with that element reference
                this.updateRHSWithElement(rhsItem, element, errorMessage);
            } else {
                // if we did not get an element but we have an item then the user may have selected a picklist value
                this.updateRHSWithPicklistValue(rhsItem, errorMessage);
            }
        } else {
            // if the item is not an object we know the user typed in a literal
            this.updateRHSWithLiteral(event.detail.displayText, errorMessage);
        }
    }

    get lhsType() {
        if (this.state.normalizedLHS.parameter) {
            const allowedDataTypes = [];
            if (this.state.rhsTypes) {
                // This can contain Flow dataTypes and element types
                const typeKeys = Object.keys(this.state.rhsTypes);
                for (let i = 0; i < typeKeys.length; i++) {
                    const typeKey = typeKeys[i];
                    if (this.state.rhsTypes[typeKey][0].dataType) {
                        allowedDataTypes.push(this.state.rhsTypes[typeKey][0].dataType);
                    }
                }
            }

            // If more than one allowedDataType, default to LHS dataType
            if (allowedDataTypes.length === 1) {
                return allowedDataTypes[0];
            } else if (allowedDataTypes.length > 1 && this.state.normalizedLHS.parameter.dataType) {
                return this.state.normalizedLHS.parameter.dataType;
            }
        }
        return '';
    }

    clearExpression(newExpression, clearOperator = false) {
        if (clearOperator) {
            newExpression[OPERATOR] = this._clearedProperty;
        }
        newExpression[RHS] = this._clearedProperty;
        newExpression[RHSG] = this._clearedProperty;
        newExpression[RHSDT] = this._clearedProperty;
    }

    handleFilterLHSMatches(event) {
        this.operatorAndRHSDisabled = !this.template.querySelector('.lhs').value;

        this.state.lhsMenuData = filterMatches(event.detail.value, this._fullLHSMenuData, event.detail.isMergeField);
    }

    handleFilterRHSMatches(event) {
        this.state.rhsMenuData = filterMatches(event.detail.value, this._fullRHSMenuData, event.detail.isMergeField);
    }

    handleFetchLHSMenuData(event) {
        const selectedItem = event.detail.item;
        if (selectedItem) {
            getFieldsForEntity((selectedItem.subText instanceof Array) ? selectedItem.subTextNoHighlight : selectedItem.subText, (fields) => {
                this._fullLHSMenuData = this.state.lhsMenuData = filterFieldsForChosenElement(selectedItem, getLHSTypes(elementType, rules), fields, true, true);
            });
        } else {
            this._fullLHSMenuData = this.state.lhsMenuData = getElementsForMenuData({elementType, shouldBeWritable: true}, getLHSTypes(elementType, rules), true);
        }
    }

    handleFetchRHSMenuData(event) {
        const selectedItem = event.detail.item;
        if (selectedItem) {
            getFieldsForEntity((selectedItem.subText instanceof Array) ? selectedItem.subTextNoHighlight : selectedItem.subText, (fields) => {
                this._fullRHSMenuData = this.state.rhsMenuData = filterFieldsForChosenElement(selectedItem, this.state.rhsTypes, fields, true, true);
            });
        } else {
            this.populateRHSMenuData();
        }
    }

    getLHSMenuData(config) {
        let menuData;
        switch (elementType) {
            case ELEMENT_TYPE.RECORD_LOOKUP:
                menuData = filterFieldsForChosenElement({value: config.objectType}, getLHSTypes(elementType, rules), config.lhsFields, false, false);
                break;
            default:
                menuData = getElementsForMenuData({elementType, shouldBeWritable: true}, getLHSTypes(elementType, rules), true);
        }
        this._fullLHSMenuData = this.state.lhsMenuData = menuData;
    }

    // If the operator combobox is shown, use the user-entered operator with the rules service. If not, use 'Assign'
    operatorForRules() {
        return this.showOperatorCombobox ? (this.state.expression[OPERATOR] ? this.state.expression[OPERATOR].value : undefined) : RULE_OPERATOR.ASSIGN;
    }

    /** After rendering we are setting the operator error (if it exists)
     *  via setCustomValidity
     */
    renderedCallback() {
        const renderedOperator = this.state.expression[OPERATOR];
        if (renderedOperator && renderedOperator.error) {
            this.setOperatorErrorMessage(renderedOperator.error);
        }
    }

    setOperatorErrorMessage(errorMessage) {
        const lightningCombobox = this.template.querySelector('.operator');
        if (lightningCombobox) {
            lightningCombobox.setCustomValidity(errorMessage);
            lightningCombobox.showHelpMessageIfInvalid();
        }
    }

    populateRHSMenuData() {
        // helper variables so code is not so verbose
        const lhs = this.state.normalizedLHS;
        const rhsItem = this.state.normalizedRHS.itemOrDisplayText;
        const rhsFields = this.state.normalizedRHS.fields;
        const showAsFieldReference =  true;
        const showSubText = true;

        // populate the rhs menu data based on the LHS and operator
        this.state.rhsTypes = getRHSTypes(elementType, lhs.parameter, this.operatorForRules(), rules);
        let menuData;

        // In the case that the existing RHS is a field on the second level, get the field menu data
        if (rhsItem && rhsItem.parent && rhsFields) {
            // NOTE: should there be a case where we get the fields if not in rhsItem? They should have been retreived in normalize RHS operation
            menuData = filterFieldsForChosenElement(rhsItem.parent, this.state.rhsTypes, rhsFields, showAsFieldReference, showSubText);
        } else {
            menuData = getElementsForMenuData({elementType}, this.state.rhsTypes, true, true, false, this.state.normalizedLHS.activePicklistValues);
        }
        this._fullRHSMenuData = this.state.rhsMenuData = menuData;
    }

    /**
     * Finds the matching picklist value inside our list of active picklist values from the LHS field
     * @param {String} picklistApiValue the picklist value we want to find in our list of active picklist values
     * @returns {Object|undefined} the found picklist value, undefined if no value found
     */
    findPicklistValue(picklistApiValue) {
        if (this.state.normalizedLHS.activePicklistValues) {
            return this.state.normalizedLHS.activePicklistValues.find(item => item.value === picklistApiValue);
        }
        return undefined;
    }

    /**
     *  when loading the expression for the first time, we do not have all the information when the RHS is a field. So we need to update the expression RHS
     * @param {module:MenuDataGenerator.MenuItem} rhsItem combobox menu item representing chosen RHS
     */
    updateRHSWithFieldOnLoad = (rhsItem) => {
        if (!this._fetchedRHSInfo && rhsItem && rhsItem.parent) {
            this._fetchedRHSInfo = true;
            const expressionUpdates = {
                [RHS]: {value: rhsItem.displayText, error: this.state.expression[RHS].error},
                [RHSDT]: {value: FEROV_DATA_TYPE.REFERENCE, error: this.state.expression[RHSDT].error},
                [RHSG]: {value: rhsItem.value, error: this.state.expression[RHSG].error},
            };
            const newExpression = updateProperties(this.state.expression, expressionUpdates);
            this.firePropertyChangedEvent(newExpression);
        }
    }

    /**
     * lhsFields are in contextConfig when the top level of lhs menuData is fields.
     * @returns {Boolean} true if the LHS is the shape {!sobjectVariable.field}
     */
    lhsIsFieldOnSobjectVariable = () => {
        return this.state.normalizedLHS.item && this.state.normalizedLHS.item.parent && !contextConfig.lhsFields;
    };
}
