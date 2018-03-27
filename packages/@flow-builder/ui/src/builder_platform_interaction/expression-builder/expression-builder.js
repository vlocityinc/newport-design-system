import { Element, api, track } from 'engine';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-constant';
import { RowContentsChangedEvent } from 'builder_platform_interaction-events';
import { Store } from 'builder_platform_interaction-store-lib';
import { getElementsForMenuData, filterMatches } from 'builder_platform_interaction-expression-utils';
import { getRulesForElementType, getLHSTypes, getOperators, getRHSTypes, transformOperatorsForCombobox } from 'builder_platform_interaction-rule-lib';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;

const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

let storeInstance;
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
        lhsValue: undefined,
        lhsMenuData: undefined,
        operatorValue: undefined,
        operatorOptions: undefined,
        rhsValue: undefined,
        rhsMenuData: undefined,
    };

    constructor() {
        super();
        storeInstance = Store.getStore();
    }

    @api
    showoperator;

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
            const lhsElement = storeInstance.getCurrentState().elements[expression[LHS].value];
            if (lhsElement) {
                this.state.lhsValue = lhsElement;
                this.state.operatorOptions = getOperators(lhsElement, rules);
            }
        }
        if (expression[OPERATOR] && expression[OPERATOR].value && this.state.operatorOptions) {
            this.state.operatorValue = expression[OPERATOR].value;
            const rhsTypes = getRHSTypes(this.state.lhsValue, this.state.operatorValue, rules);
            this._fullRHSMenuData = this.state.rhsMenuData = getElementsForMenuData(storeInstance.getCurrentState().elements, storeInstance.getCurrentState().variables, rhsTypes);
        } else {
            // TODO default case W-4817341
        }
        if (expression[RHS] && expression[RHS].value && this.state.rhsMenuData) {
            const rhsElement = storeInstance.getCurrentState().elements[expression[RHS].value];
            if (rhsElement) {
                this.state.rhsValue = rhsElement;
            } else {
                this.state.rhsValue = expression[RHS].value;
            }
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
    set elementType(type) {
        element = type;
        rules = getRulesForElementType(element);
        this._fullLHSMenuData = this.state.lhsMenuData = getElementsForMenuData(storeInstance.getCurrentState().elements, storeInstance.getCurrentState().variables, getLHSTypes(rules));
    }

    @api
    get elementType() {
        return element;
    }

    get lhsMenuData() {
        return this.state.lhsMenuData;
    }

    set lhsMenuData(menuData) {
        this.state.lhsMenuData = menuData;
    }

    get operatorMenuData() {
        return this.state.operatorOptions ? transformOperatorsForCombobox(this.state.operatorOptions) : [];
    }

    set operatorMenuData(menuData) {
        this.state.operatorOptions = menuData;
    }

    get rhsMenuData() {
        return this.state.rhsMenuData;
    }

    set rhsMenuData(menuData) {
        this.state.rhsMenuData = menuData;
    }


    /**
     * These are the text strings that should be displayed by the comboBoxes
     */
    get lhsComboBoxValue() {
        if (this.state.lhsValue && this.state.lhsValue.hasOwnProperty('name')) {
            return '{!' + this.state.lhsValue.name + '}';
        }
        return this.state.lhsValue;
    }

    get operatorComboBoxValue() {
        return this.state.operatorValue;
    }

    get rhsComboBoxValue() {
        if (this.state.rhsValue && this.state.rhsValue.hasOwnProperty('name')) {
            return '{!' + this.state.rhsValue.name + '}';
        }
        return this.state.rhsValue;
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
        // TODO: determine this logic W-4712116
    }

    get rhsDisabled() {
        // TODO: determine this logic W-4712116
    }

    /* ***************** */
    /* Private Variables */
    /* ***************** */

    _fullLHSMenuData = [];

    _fullRHSMenuData = [];

    handleLHSValueChanged(event) {
        event.stopPropagation();

        const propertyChangedEvent = new RowContentsChangedEvent(LHS, event.detail.value, event.detail.error);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleOperatorChanged(event) {
        event.stopPropagation();

        const propertyChangedEvent = new RowContentsChangedEvent(OPERATOR, event.detail.value);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleRHSValueChanged(event) {
        event.stopPropagation();

        const propertyChangedEvent = new RowContentsChangedEvent(RHS, event.detail.value, event.detail.error);
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
