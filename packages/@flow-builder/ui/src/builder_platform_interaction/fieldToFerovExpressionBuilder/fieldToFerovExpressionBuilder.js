import { LightningElement, api, track } from 'lwc';
import {
    sanitizeGuid,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';
import {
    EXPRESSION_PROPERTY_TYPE,
    LHS_DISPLAY_OPTION,
    populateLhsStateForField,
    populateRhsState
} from 'builder_platform_interaction/expressionUtils';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;

const RHSDT = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

export default class FieldToFerovExpressionBuilder extends LightningElement {
    @track
    state = {
        objectType: undefined,
        expression: undefined,
        lhsDescribe: {},
        lhsDisplayOption: LHS_DISPLAY_OPTION.SOBJECT_FIELD,
        operatorValue: undefined,
        operatorError: undefined,
        rhsDescribe: {}
    };

    @api
    lhsLabel;

    @api
    lhsPlaceholder;

    lhsMustBeWritable = false;

    @api
    operatorLabel;

    @api
    operatorPlaceholder;

    @api
    defaultOperator;

    /**
     * True if operator combobox should be hidden
     */
    @track
    hideOperator = false;

    @api
    operatorIconName = '';

    get operatorValue() {
        return this.state.operatorValue;
    }

    get operatorError() {
        return this.state.operatorError;
    }

    /**
     * True if RHS is a FER, false if RHS is a FEROV
     */
    @track
    rhsIsFer = false;

    @api
    rhsLabel;

    @api
    rhsPlaceholder;

    @api
    get objectType() {
        return this.state.objectType;
    }

    /**
     * Object type of the fields that should be on the LHS
     * @param {Object} object   the api name of the sobject type
     */
    set objectType(object) {
        this.state.objectType = object;
        this.populateLhsState();
    }

    @api
    get expression() {
        return this.state.expression;
    }

    /**
     * The expression to be displayed. If there is no operator in the expression,
     * the operator combobox is not shown. If the operator combobox should be shown,
     * but a value has not been selected yet, pass empty string for the value & error.
     *
     * @param {Object} expression   Has LHS, OPERATOR, RHS each as a hydrated value.
     */
    set expression(expression) {
        this.state.expression = expression;
        this.populateLhsState();
        if (expression[OPERATOR]) {
            this.state.operatorValue = expression[OPERATOR].value;
            this.state.operatorError = expression[OPERATOR].error;
        } else {
            this.hideOperator = true;
        }

        // if RHSDT doesn't exist as a separate property, then RHS must be a FER
        this.rhsIsFer = !expression[RHSDT];

        populateRhsState(expression, values => {
            this.state.rhsDescribe = values;
        });
    }

    @api
    containerElement;

    @api
    rules;

    @api
    get lhsFields() {
        return this._lhsFields;
    }

    set lhsFields(fields) {
        if (fields) {
            this._lhsFields = fields;
            this.populateLhsState();
        }
    }

    _lhsFields;

    /**
     * blocks field validation on rhs.
     * @type {boolean}
     */
    @api
    blockRhsValidation = false;

    /**
     * hides FEROV-specific menu data (like global constants)
     * @type {boolean}
     */
    @api
    hideFerovMenuData = false;

    /**
     * Set it to true to hide 'New Resource' option in combobox menu data.
     * @type {Boolean}
     */
    @api hideNewResource = false;

    /**
     * hides system variables on menu.
     * @type {boolean}
     */
    @api hideSystemVariables = false;

    /**
     * Populates the state values for the LHS of the expression such as the display value
     * and what fields should show up in the menudata.
     */
    populateLhsState() {
        if (
            !this.state.expression ||
            !this.state.objectType ||
            !this.lhsFields
        ) {
            return;
        }
        const lhs = this.state.expression[LHS];

        this.state.lhsDescribe = {
            value: lhs.value,
            error: lhs.error,
            param: null,
            activePicklistValues: null,
            fields: null
        };

        if (lhs.value && !lhs.error) {
            const complexGuid = sanitizeGuid(lhs.value);
            const fieldParent = { value: this.state.objectType };
            const isFieldOnSobjectVar = false;
            this.state.lhsDescribe = updateProperties(
                this.state.lhsDescribe,
                populateLhsStateForField(
                    this.lhsFields,
                    complexGuid.fieldName,
                    fieldParent,
                    isFieldOnSobjectVar
                )
            );
        }
    }
}
