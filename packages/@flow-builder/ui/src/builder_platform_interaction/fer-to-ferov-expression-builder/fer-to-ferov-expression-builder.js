import { LightningElement, api, track } from "lwc";
import { sanitizeGuid } from 'builder_platform_interaction-data-mutation-lib';
import {
    EXPRESSION_PROPERTY_TYPE,
    getResourceByUniqueIdentifier,
    mutateFlowResourceToComboboxShape,
    mutateFieldToComboboxShape,
} from 'builder_platform_interaction-expression-utils';
import { elementToParam } from 'builder_platform_interaction-rule-lib';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;

const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const RHSG = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID;

const isFieldOnSobject = true;

export default class FerToFerovExpressionBuilder extends LightningElement {
    @track
    state = {
        expression: undefined,
        lhsValue: undefined,
        lhsParam: undefined,
        lhsError: undefined,
        lhsActivePicklistValues: undefined,
        lhsIsField: undefined,
        rhsValue: undefined,
        rhsGuid: undefined,
        rhsError: undefined,
        rhsFields: undefined,
        rhsLiteralsAllowed: true,
        rhsIsField: false,
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
    get expression() {
        return this.state.expression;
    }

    set expression(expression) {
        if (this.isIncompleteExpression(expression)) {
            throw new Error('expression is not properly formed');
        }
        this.state.expression = expression;
        this.populateLhsState(expression[LHS]);
        this.populateRhsState(expression[RHS], expression[RHSG] ? expression[RHSG].value : null);
    }

    @api
    containerElement;

    populateLhsState(lhs) {
        this.state.lhsError = lhs.error;

        if (lhs.error) {
            this.state.lhsValue = lhs.value;
            this.clearLhsAuxillaryAttributes();
        } else if (lhs.value) {
            const identifier = lhs.value;
            const complexGuid = sanitizeGuid(identifier);
            const fer = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);
            if (!fer) {
                throw new Error('invalid LHS value but no error');
            }
            const lhsItem = mutateFlowResourceToComboboxShape(fer);
            if (complexGuid.fieldName) {
                this.state.lhsIsField = true;
                getFieldsForEntity(lhsItem.objectType, (fields) => {
                    const field = fields[complexGuid.fieldName];
                    field.isCollection = false;
                    this.state.lhsParam = elementToParam(field);
                    this.state.lhsValue = mutateFieldToComboboxShape(field, lhsItem, true, true);
                    this.state.lhsActivePicklistValues = field.activePicklistValues || false;
                    this.state.lhsFields = fields;
                });
            } else {
                this.clearLhsAuxillaryAttributes();
                this.state.lhsValue = lhsItem;
                this.state.lhsParam = elementToParam(fer);
            }
        } else {
            this.clearLhsAuxillaryAttributes();
        }
    }

    populateRhsState(rhs, guid) {
        this.state.rhsError = rhs.error;

        if (rhs.error || !guid) {
            this.state.rhsValue = rhs.value;
            this.clearRhsAuxillaryAttributes();
            this.state.rhsGuid = null;
        } else {
            this.state.rhsGuid = guid;
            const complexGuid = sanitizeGuid(guid);
            const fer = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);
            if (!fer) {
                throw new Error('invalid RHS value but no error');
            }
            const rhsItem = mutateFlowResourceToComboboxShape(fer);
            if (complexGuid.fieldName) {
                // TODO: W-4960448: the field will appear empty briefly when fetching the first time
                getFieldsForEntity(fer.objectType, (fields) => {
                    this.state.rhsIsField = true;
                    this.state.rhsValue = mutateFieldToComboboxShape(fields[complexGuid.fieldName], rhsItem, isFieldOnSobject, isFieldOnSobject);
                    this.state.rhsFields = fields;
                });
            } else {
                this.clearRhsAuxillaryAttributes();
            }
        }
    }

    clearLhsAuxillaryAttributes() {
        this.state.lhsParam = this.state.lhsIsField = false;
        this.state.lhsActivePicklistValues = this.state.lhsFields = null;
    }

    clearRhsAuxillaryAttributes() {
        this.state.rhsIsField = false;
        this.state.rhsFields = null;
    }

    isIncompleteExpression(exp) {
        return !exp[LHS] || !exp[OPERATOR] || !exp[RHS];
    }
}