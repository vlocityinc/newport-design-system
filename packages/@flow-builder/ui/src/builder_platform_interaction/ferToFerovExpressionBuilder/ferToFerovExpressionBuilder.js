import { LightningElement, api, track } from 'lwc';
import { sanitizeGuid, updateProperties } from "builder_platform_interaction/dataMutationLib";
import {
    EXPRESSION_PROPERTY_TYPE,
    getResourceByUniqueIdentifier,
    mutateFlowResourceToComboboxShape,
    LHS_DISPLAY_OPTION,
    validateExpressionShape,
    populateLhsStateForField,
    populateRhsState,
} from "builder_platform_interaction/expressionUtils";
import { elementToParam } from "builder_platform_interaction/ruleLib";
import { getFieldsForEntity } from "builder_platform_interaction/sobjectLib";

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const RHSG = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID;

export default class FerToFerovExpressionBuilder extends LightningElement {
    @track
    state = {
        expression: undefined,
        lhsValue: undefined,
        lhsParam: undefined,
        lhsError: undefined,
        lhsActivePicklistValues: undefined,
        lhsDisplayOption: undefined,
        rhsValue: undefined,
        rhsGuid: undefined,
        rhsError: undefined,
        rhsFields: undefined,
        rhsIsField: undefined,
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
        validateExpressionShape(expression);
        this.state.expression = expression;
        this.populateLhsState(expression[LHS]);
        populateRhsState(expression[RHS], expression[RHSG] ? expression[RHSG].value : null,
            (values) => {
                this.state = updateProperties(this.state, values);
            });
    }

    @api
    containerElement;

    populateLhsState(lhs) {
        this.resetLhsAuxillaryAttributes();
        this.state.lhsError = lhs.error;
        this.state.lhsValue = lhs.value;

        if (lhs.value && !lhs.error) {
            const complexGuid = sanitizeGuid(lhs.value);
            const fer = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);

            if (fer) {
                const lhsItem = mutateFlowResourceToComboboxShape(fer);
                if (complexGuid.fieldName) {
                    getFieldsForEntity(lhsItem.objectType, (fields) => {
                        const isFieldOnSobjectVar = true;
                        this.state.lhsFields = fields;
                        this.state.lhsDisplayOption = LHS_DISPLAY_OPTION.FIELD_ON_VARIABLE;
                        this.state = updateProperties(this.state,
                            populateLhsStateForField(fields, complexGuid.fieldName, lhsItem, isFieldOnSobjectVar));
                    });
                } else {
                    this.state.lhsValue = lhsItem;
                    this.state.lhsParam = elementToParam(fer);
                }
            }
        }
    }

    resetLhsAuxillaryAttributes() {
        this.state.lhsParam = this.state.lhsActivePicklistValues = this.state.lhsFields = null;
        this.state.lhsDisplayOption = LHS_DISPLAY_OPTION.NOT_FIELD;
    }
}