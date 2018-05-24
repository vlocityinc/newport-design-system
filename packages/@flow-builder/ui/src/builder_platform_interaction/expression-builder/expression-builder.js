import { Element, api, track } from 'engine';
import { RowContentsChangedEvent } from 'builder_platform_interaction-events';
import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { EXPRESSION_PROPERTY_TYPE, getElementsForMenuData, filterMatches, normalizeLHS, isElementAllowed, normalizeRHS, filterFieldsForChosenElement, sanitizeGuid } from 'builder_platform_interaction-expression-utils';
import { getRulesForContext, getLHSTypes, getOperators, getRHSTypes, transformOperatorsForCombobox, elementToParam } from 'builder_platform_interaction-rule-lib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { isUndefinedOrNull } from 'builder_platform_interaction-common-utils';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;

const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const RHSDT = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

const RHSG = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID;

let element;
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
        rhsMenuData: [], // the menu data being passed to rhs combobox
    };

    @api
    showOperator;

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
    @api
    set expression(expression) {
        // TODO error handling? W-4755917
        // TODO handle literals, "hi my name is {!firstName}" W-4817362
        // TODO handle multi-level merge fields W-4723095
        if (expression[LHS] && expression[LHS].value) {
            this.state.normalizedLHS = normalizeLHS(expression[LHS].value, element, (lhsIdentifier) => {
                if (!this._fetchedLHSInfo) {
                    this._fetchedLHSInfo = true;
                    const newExpression = updateProperties(this.state.expression, {[LHS] : {value : lhsIdentifier, error: expression[LHS].error}});
                    this.firePropertyChangedEvent(newExpression);
                }
            });
        }
        if (expression[OPERATOR]) {
            this.setOperatorErrorMessage(expression[OPERATOR].error);
        }

        // TODO default operator case W-4912900
        if (expression[RHS] && !isUndefinedOrNull(expression[RHS].value)) {
            this.state.normalizedRHS = normalizeRHS(expression[RHS].value ? expression[RHS].value : expression[RHS], (rhsIdentifier) => {
                if (!this._fetchedRHSInfo) {
                    this._fetchedRHSInfo = true;
                    const newExpression = updateProperties(this.state.expression, {[RHS] : {value : rhsIdentifier, error: expression[RHS].error}});
                    this.firePropertyChangedEvent(newExpression);
                }
            });
        }

        if (expression[LHS].value && expression[OPERATOR]) {
            const rhsTypes = getRHSTypes(this.state.normalizedLHS.parameter, expression[OPERATOR].value, rules);
            this._fullRHSMenuData = getElementsForMenuData({element}, rhsTypes, true);
            this.state.rhsMenuData = this._fullRHSMenuData;
        }

        this.state.expression = expression;
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

    /**
     * @typedef expressionConfig
     * @param {String} elementType    the parent element of this expression
     * @param {String} objectType     the sObject which this expression is based on, i.e. for the LHS fields
     * @param {String[]} lhsFields    fields to be used for the LHS of this expression
     */

    @api
    set configuration(config) {
        contextConfig = config;
        element = contextConfig.elementType;
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

    get operatorMenuData() {
        return transformOperatorsForCombobox(getOperators(this.state.normalizedLHS.parameter, rules));
    }

    get rhsMenuData() {
        return this.state.rhsMenuData;
    }

    /**
     * These are the text strings that should be displayed by the comboBoxes
     */
    get operatorComboBoxValue() {
        return this.state.expression[OPERATOR] ? this.state.expression[OPERATOR].value : null;
    }

    /**
     * If there is nothing in the LHS, operator and RHS should be disabled
     */
    get operatorDisabled() {
        return false;
        // TODO: determine this logic W-4712116
    }

    get rhsDisabled() {
        return false;
        // TODO: determine this logic W-4712116
    }

    /* ***************** */
    /* Private Variables */
    /* ***************** */

    _fullLHSMenuData = [];

    _fullRHSMenuData = [];

    _clearedProperty = { value: '', error: null };

    _fetchedLHSInfo = false;

    _fetchedRHSInfo = false;

    handleLHSValueChanged(event) {
        event.stopPropagation();
        const newLHSItem = event.detail.item;
        const newValue = newLHSItem ? newLHSItem.value : event.detail.displayText;
        const expressionUpdates = {[LHS] : {value : newValue, error: event.detail.error}};

        const complexGuid = sanitizeGuid(newValue);
        const flowElement = getElementByGuid(complexGuid.guid);
        let elementOrField;
        // if lhs's value is a entity field (it could be flowElement.fieldApiName or objectType.fieldApiName)
        if (complexGuid.fieldName) {
            // get the object type (entity name)
            const objectType = (flowElement) ? flowElement.objectType : contextConfig.objectType;
            getFieldsForEntity(objectType, (fields) => {
                elementOrField = fields[complexGuid.fieldName];
            });
        } else {
            elementOrField = flowElement;
        }
        if (elementOrField) {
            const newLHSParam = elementToParam(elementOrField);
            if (!getOperators(newLHSParam, rules).includes(this.state.expression.operator.value)) {
                expressionUpdates[OPERATOR] = this._clearedProperty;
                expressionUpdates[RHS] = this._clearedProperty;
                expressionUpdates[RHSDT] = this._clearedProperty;
                expressionUpdates[RHSG] = this._clearedProperty;
            } else {
                const rhsTypes = getRHSTypes(newLHSParam, this.state.expression.operator.value, rules);
                const rhsValid = isElementAllowed(rhsTypes, elementToParam(getElementByGuid(this.state.expression.rightHandSideGuid.value)));
                if (!rhsValid) {
                    expressionUpdates[RHS] = this._clearedProperty;
                    expressionUpdates[RHSDT] = this._clearedProperty;
                    expressionUpdates[RHSG] = this._clearedProperty;
                }
            }
        }
        const newExpression = updateProperties(this.state.expression, expressionUpdates);
        this.firePropertyChangedEvent(newExpression);
    }

    firePropertyChangedEvent(newExpression) {
        const propertyChangedEvent = new RowContentsChangedEvent(newExpression);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleOperatorChanged(event) {
        event.stopPropagation();
        const newOperator = event.detail.value;
        const expressionUpdates = {[OPERATOR]: {value: newOperator, error: null}};
        if (this.state.expression.rightHandSideGuid) {
            const rhsTypes = getRHSTypes(this.state.normalizedLHS.parameter, newOperator, rules);
            const rhsValid = isElementAllowed(rhsTypes, elementToParam(getElementByGuid(this.state.expression.rightHandSideGuid.value)));
            if (!rhsValid) {
                expressionUpdates[RHS] = this._clearedProperty;
                expressionUpdates[RHSDT] = this._clearedProperty;
                expressionUpdates[RHSG] = this._clearedProperty;
            }
        }
        const newExpression = updateProperties(this.state.expression, expressionUpdates);
        const propertyChangedEvent = new RowContentsChangedEvent(newExpression);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleRHSValueChanged(event) {
        event.stopPropagation();
        const newRHSItem = event.detail.item;
        const errorMessage = event.detail.error;
        let rhsAndRHSDT;
        if (newRHSItem) {
            rhsAndRHSDT = {
                [RHS]: {value: newRHSItem.displayText, error: errorMessage},
                [RHSDT]: {value: FEROV_DATA_TYPE.REFERENCE, error: null},
                [RHSG]: {value: newRHSItem.value, error: null}
            };
        } else {
            // TODO: not all literals are strings! dealing with literals in W-4795778
            rhsAndRHSDT = {
                [RHS]: {value: event.detail.displayText, error: errorMessage},
                [RHSDT]: {value: FEROV_DATA_TYPE.STRING, error: null},
            };
        }
        const newExpression = updateProperties(this.state.expression, rhsAndRHSDT);
        const propertyChangedEvent = new RowContentsChangedEvent(newExpression, errorMessage);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleFilterLHSMatches(event) {
        this.state.lhsMenuData = filterMatches(event.detail.value, this._fullLHSMenuData, event.detail.isMergeField);
    }

    handleFilterRHSMatches(event) {
        this.state.rhsMenuData = filterMatches(event.detail.value, this._fullRHSMenuData, event.detail.isMergeField);
    }

    handleFetchLHSMenuData(event) {
        const selectedItem = event.detail.item;
        if (selectedItem) {
            getFieldsForEntity((selectedItem.subText instanceof Array) ? selectedItem.subTextNoHighlight : selectedItem.subText, (fields) => {
                this._fullLHSMenuData = this.state.lhsMenuData = filterFieldsForChosenElement(selectedItem, getLHSTypes(rules), fields, true, true);
            });
        } else {
            this._fullLHSMenuData = this.state.lhsMenuData = getElementsForMenuData({element, shouldBeWritable: true}, getLHSTypes(rules), true);
        }
    }

    handleFetchRHSMenuData(event) {
        const selectedItem = event.detail.item;
        if (selectedItem) {
            getFieldsForEntity((selectedItem.subText instanceof Array) ? selectedItem.subTextNoHighlight : selectedItem.subText, (fields) => {
                this._fullRHSMenuData = this.state.rhsMenuData = filterFieldsForChosenElement(selectedItem, getLHSTypes(rules), fields, true, true);
            });
        } else {
            this._fullRHSMenuData = this.state.rhsMenuData = getElementsForMenuData({element}, getRHSTypes(this.state.normalizedLHS.parameter, this.state.expression[OPERATOR].value, rules), true);
        }
    }

    getLHSMenuData(config) {
        let menuData;
        switch (element) {
            // TODO: this switch statement will be used when the expression-builder needs more than just
            // elementType to determine the correct menuData. For example, for Record Lookup, the
            // config could contain the selected SObject type so the correct set of fields will be provided
            case ELEMENT_TYPE.RECORD_LOOKUP:
                menuData = filterFieldsForChosenElement({value: config.objectType}, getLHSTypes(rules), config.lhsFields, false, false);
                break;
            default:
                menuData = getElementsForMenuData({element, shouldBeWritable: true}, getLHSTypes(rules), true);
        }
        this._fullLHSMenuData = this.state.lhsMenuData = menuData;
    }

    setOperatorErrorMessage(errorMessage) {
        const lightningCombobox = this.template.querySelector('.operator');
        if (lightningCombobox) {
            lightningCombobox.setCustomValidity(errorMessage);
            lightningCombobox.showHelpMessageIfInvalid();
        }
    }
}
