import { LightningElement, api, track } from 'lwc';
import { sanitizeGuid, updateProperties } from "builder_platform_interaction/dataMutationLib";
import {
    EXPRESSION_PROPERTY_TYPE,
    LHS_DISPLAY_OPTION,
    validateExpressionShape,
    populateLhsStateForField,
    populateRhsState,
} from "builder_platform_interaction/expressionUtils";

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const RHSG = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID;

export default class FieldToFerovExpressionBuilder extends LightningElement {
    @track
    state = {
        objectType: undefined,
        expression: undefined,
        lhsValue: undefined,
        lhsParam: undefined,
        lhsError: undefined,
        lhsDisplayOption: LHS_DISPLAY_OPTION.SOBJECT_FIELD,
        lhsActivePicklistValues: undefined,
        rhsValue: undefined,
        rhsGuid: undefined,
        rhsError: undefined,
        rhsFields: undefined,
        rhsIsField: undefined
    };

    @api
    lhsLabel;

    @api
    lhsPlaceholder;

    @api
    operatorLabel;

    @api
    operatorPlaceholder;

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

    set expression(expression) {
        validateExpressionShape(expression);
        this.state.expression = expression;
        this.populateLhsState();
        populateRhsState(expression[RHS], expression[RHSG] ? expression[RHSG].value : null,
            (values) => {
                this.state = updateProperties(this.state, values);
            });
    }

    @api
    containerElement;

    @api
    get lhsFields() {
        return this._lhsFields;
    }

    set lhsFields(fields) {
        if (fields && Object.keys(fields).length) {
            this._lhsFields = fields;
            this.populateLhsState();
        }
    }

    _lhsFields;

    /**
     * Populates the state values for the LHS of the expression such as the display value
     * and what fields should show up in the menudata.
     */
    populateLhsState() {
        if (!this.state.expression || !this.state.objectType || !this.lhsFields) {
            return;
        }
        const lhs = this.state.expression[LHS];

        this.resetLhsAuxillaryAttributes();

        this.state.lhsValue = lhs.value;
        this.state.lhsError = lhs.error;

        if (lhs.value && !lhs.error) {
            const complexGuid = sanitizeGuid(lhs.value);
            const fieldParent = {value: this.state.objectType};
            const isFieldOnSobjectVar = false;
            this.state = updateProperties(this.state,
                populateLhsStateForField(this.lhsFields, complexGuid.fieldName, fieldParent, isFieldOnSobjectVar));
        }
    }

    resetLhsAuxillaryAttributes() {
        this.state.lhsParam = this.state.lhsActivePicklistValues = this.state.lhsFields = null;
    }
}