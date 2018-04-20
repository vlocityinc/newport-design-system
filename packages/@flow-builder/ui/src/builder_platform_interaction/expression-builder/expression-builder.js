import { Element, api, track } from 'engine';
import { RowContentsChangedEvent } from 'builder_platform_interaction-events';
import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { EXPRESSION_PROPERTY_TYPE, getElementsForMenuData, filterMatches, normalizeLHS, retrieveRHSVal } from 'builder_platform_interaction-expression-utils';
import { getRulesForElementType, getLHSTypes, getOperators, getRHSTypes, transformOperatorsForCombobox } from 'builder_platform_interaction-rule-lib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;

const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const RHSDT = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

let element;
let rules;

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
        rhsDisplay: undefined, // for the rhs combobox to display, as the rhs could be passed as a guid
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
            this.state.normalizedLHS = normalizeLHS(expression[LHS].value);
        }
        // TODO default operator case W-4912900
        if (expression[RHS] && expression[RHS].value) {
            this.state.rhsDisplay = retrieveRHSVal(expression[RHS].value);
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

    @api
    set elementType(type) {
        element = type;
        rules = getRulesForElementType(element);
        this._fullLHSMenuData = this.state.lhsMenuData = getElementsForMenuData({element, shouldBeWritable: true}, getLHSTypes(rules), true);
    }

    @api
    get elementType() {
        return element;
    }

    get lhsMenuData() {
        return this.state.lhsMenuData;
    }

    get operatorMenuData() {
        return transformOperatorsForCombobox(getOperators(this.state.normalizedLHS.parameter, rules));
    }

    get rhsMenuData() {
        let rhsMenuData;
        if (this.state.normalizedLHS.display && this.state.expression[OPERATOR]) {
            const rhsTypes = getRHSTypes(this.state.normalizedLHS.parameter, this.state.expression[OPERATOR].value, rules);
            this._fullRHSMenuData = getElementsForMenuData({element}, rhsTypes, true);
            rhsMenuData = this._fullRHSMenuData;
        }
        return rhsMenuData;
    }

    /**
     * These are the text strings that should be displayed by the comboBoxes
     */
    get operatorComboBoxValue() {
        return this.state.expression[OPERATOR] ? this.state.expression[OPERATOR].value : null;
    }

    /**
     * These are the errors associated with each comboBox, if any
     */
    get lhsError() {
        return this.expression[LHS] ? this.expression[LHS].error : null;
    }

    get operatorError() {
        return this.expression[OPERATOR] ? this.expression[OPERATOR].error : null;
    }

    get rhsError() {
        return this.expression[RHS] ? this.expression[RHS].error : null;
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

    handleLHSValueChanged(event) {
        event.stopPropagation();
        const newExpression = updateProperties(this.state.expression, {[LHS] : {value : event.detail.value, error: event.detail.error}});
        const propertyChangedEvent = new RowContentsChangedEvent(newExpression);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleOperatorChanged(event) {
        event.stopPropagation();
        const newExpression = updateProperties(this.state.expression, {[OPERATOR] : {value : event.detail.value, error : null}});
        const propertyChangedEvent = new RowContentsChangedEvent(newExpression);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleRHSValueChanged(event) {
        event.stopPropagation();
        const rhsAndRHSDT = {
            [RHS] : {value : event.detail.value, error: event.detail.error},
            [RHSDT] : {value : FEROV_DATA_TYPE.REFERENCE, error: event.detail.error}
        };
        const newExpression = updateProperties(this.state.expression, rhsAndRHSDT);
        const propertyChangedEvent = new RowContentsChangedEvent(newExpression, event.detail.error);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleFilterLHSMatches(event) {
        this.state.lhsMenuData = filterMatches(event.detail.value, this._fullLHSMenuData);
    }

    handleFilterRHSMatches(event) {
        this.state.rhsMenuData = filterMatches(event.detail.value, this._fullRHSMenuData);
    }

    handleFetchLHSMenuData() {
        // TODO  W-4723095
    }

    handleFetchOperatorMenuData() {
        // TODO  W-4723095
    }

    handleFetchRHSMenuData() {
        // TODO  W-4723095
    }
    // TODO: validation
}
