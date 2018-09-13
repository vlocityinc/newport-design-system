import { LightningElement, api, track } from 'lwc';
import { sanitizeGuid, updateProperties } from "builder_platform_interaction/dataMutationLib";
import {
    EXPRESSION_PROPERTY_TYPE,
    getResourceByUniqueIdentifier,
    mutateFlowResourceToComboboxShape,
    LHS_DISPLAY_OPTION,
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
        rhsDescribe: undefined,
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
        this.state.expression = expression;
        this.populateLhsState(expression[LHS]);
        populateRhsState(expression[RHS], expression[RHSG] ? expression[RHSG].value : null,
            (values) => {
                this.state.rhsDescribe = values;
            }
        );
    }

    @api
    containerElement;

    @api
    rules;

    populateLhsState(lhs) {
        this.state.lhsDisplayOption = LHS_DISPLAY_OPTION.NOT_FIELD;

        this.state.lhsDescribe = {
            value: lhs.value,
            error: lhs.error,
            param: null,
            activePicklistValues: null,
            fields: null,
        };

        if (lhs.value && !lhs.error) {
            const complexGuid = sanitizeGuid(lhs.value);
            const fer = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);

            if (fer) {
                const lhsItem = mutateFlowResourceToComboboxShape(fer);
                if (complexGuid.fieldName) {
                    getFieldsForEntity(lhsItem.objectType, (fields) => {
                        const isFieldOnSobjectVar = true;
                        this.state.lhsDescribe = updateProperties(this.state.lhsDescribe,
                            populateLhsStateForField(fields, complexGuid.fieldName, lhsItem, isFieldOnSobjectVar));
                        this.state.lhsDisplayOption = LHS_DISPLAY_OPTION.FIELD_ON_VARIABLE;
                    });
                } else {
                    this.state.lhsDescribe.value = lhsItem;
                    this.state.lhsDescribe.param = elementToParam(fer);
                }
            }
        }
    }
}