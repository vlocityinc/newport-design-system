import { LightningElement, api, track } from 'lwc';
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

const isFieldOnSobjectVar = true;

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

    // TODO: W-5239664 both the below can be mostly (if not entirely) reused by the other wrappers
    // TODO: W-5222299 both the below won't need to be callbacks once we start front loading the field retrieval.
    populateLhsStateForField(fields, parent, fieldName) {
        // TODO: W-4960448: the field will appear empty briefly when fetching the first time
        const field = fields[fieldName];
        field.isCollection = false;
        this.state.lhsIsField = true;
        this.state.lhsParam = elementToParam(field);
        this.state.lhsValue = mutateFieldToComboboxShape(field, parent, isFieldOnSobjectVar, isFieldOnSobjectVar);
        this.state.lhsActivePicklistValues = field.activePicklistValues || false;
        this.state.lhsFields = fields;
    }

    populateRhsStateForField(fields, parent, fieldName) {
        // TODO: W-4960448: the field will appear empty briefly when fetching the first time
        this.state.rhsIsField = true;
        this.state.rhsValue = mutateFieldToComboboxShape(fields[fieldName], parent, isFieldOnSobjectVar, isFieldOnSobjectVar);
        this.state.rhsFields = fields;
    }

    populateLhsState(lhs) {
        this.resetLhsAuxillaryAttributes();
        this.state.lhsError = lhs.error;
        this.state.lhsValue = lhs.value;

        if (lhs.value && !lhs.error) {
            const complexGuid = sanitizeGuid(lhs.value);
            const fer = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);

            // TODO: W-5222299 this check can be removed when merge field validation is no longer asynchronous
            if (fer) {
                const lhsItem = mutateFlowResourceToComboboxShape(fer);
                if (complexGuid.fieldName) {
                    getFieldsForEntity(lhsItem.objectType, (fields) => {
                        this.populateLhsStateForField(fields, lhsItem, complexGuid.fieldName);
                    });
                } else {
                    this.state.lhsValue = lhsItem;
                    this.state.lhsParam = elementToParam(fer);
                }
            }
        }
    }

    populateRhsState(rhs, guid) {
        this.resetRhsAuxillaryAttributes();
        this.state.rhsError = rhs.error;
        this.state.rhsGuid = guid || null;
        this.state.rhsValue = rhs.value;

        if (!rhs.error && guid) {
            const complexGuid = sanitizeGuid(guid);
            const fer = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);

            // TODO: W-5222299 this check can be removed when merge field validation is no longer asynchronous
            if (fer) {
                const rhsItem = mutateFlowResourceToComboboxShape(fer);
                if (complexGuid.fieldName) {
                    getFieldsForEntity(fer.objectType, (fields) => {
                        this.populateRhsStateForField(fields, rhsItem, complexGuid.fieldName);
                    });
                } else {
                    this.state.rhsValue = rhsItem;
                }
            }
        }
    }

    resetLhsAuxillaryAttributes() {
        this.state.lhsParam = this.state.lhsIsField = false;
        this.state.lhsActivePicklistValues = this.state.lhsFields = null;
    }

    resetRhsAuxillaryAttributes() {
        this.state.rhsIsField = false;
        this.state.rhsFields = null;
    }

    isIncompleteExpression(exp) {
        return !exp[LHS] || !exp[OPERATOR] || !exp[RHS];
    }
}