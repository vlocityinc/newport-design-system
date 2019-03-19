import { LightningElement, api, track } from 'lwc';
import { sanitizeGuid, updateProperties } from "builder_platform_interaction/dataMutationLib";
import {
    EXPRESSION_PROPERTY_TYPE,
    getResourceByUniqueIdentifier,
    mutateFlowResourceToComboboxShape,
    LHS_DISPLAY_OPTION,
    populateLhsStateForField,
    populateRhsState,
    getSecondLevelItems,
} from "builder_platform_interaction/expressionUtils";
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { elementToParam } from "builder_platform_interaction/ruleLib";

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

export default class FerToFerovExpressionBuilder extends LightningElement {
    @track
    state = {
        expression: undefined,
        lhsValue: undefined,
        lhsParam: undefined,
        lhsError: undefined,
        lhsActivePicklistValues: undefined,
        lhsDisplayOption: undefined,
        rhsDescribe: {
            value : '',
            error : undefined,
            isField : false,
            fields : null
        }
    };

    @api
    lhsLabel;

    @api
    lhsPlaceholder;

    @api
    lhsMustBeWritable = false;

    @api
    operatorLabel;

    @api
    operatorPlaceholder;

    @api
    defaultOperator;

    @api
    rhsLabel;

    @api
    rhsPlaceholder;

    @track
    rhsIsFer = false;

    @api
    get expression() {
        return this.state.expression;
    }

    set expression(expression) {
        this.state.expression = expression;
        this.populateLhsState();
        populateRhsState(expression,
            (values) => {
                this.state.rhsDescribe = values;
            }
        );
    }

    @api
    get containerElement() {
        return this._containerElement;
    }

    set containerElement(element) {
        this._containerElement = element;
        this.populateLhsState();
    }

    @api
    rules;

    _containerElement;

    populateLhsState() {
        if (!this.state.expression || !this.containerElement) {
            return;
        }
        const lhs = this.state.expression[LHS];
        this.state.lhsDisplayOption = LHS_DISPLAY_OPTION.NOT_FIELD;

        this.state.lhsDescribe = {
            value: lhs.value,
            error: lhs.error,
            param: null,
            activePicklistValues: null,
            fields: null,
        };

        if (lhs.value && !lhs.error) {
            const fer = getResourceByUniqueIdentifier(lhs.value);

            if (fer) {
                const lhsItem = mutateFlowResourceToComboboxShape(fer);
                const fieldName = sanitizeGuid(lhs.value).fieldName;
                if (fieldName) {
                    getSecondLevelItems({ elementType: this.containerElement, shouldBeWritable: this.lhsMustBeWritable },
                        lhsItem, (fields) => {
                        const isFieldOnSobjectVar = true;
                        this.state.lhsDisplayOption = LHS_DISPLAY_OPTION.FIELD_ON_VARIABLE;
                        if (fields && fields[fieldName]) {
                            this.state.lhsDescribe = updateProperties(this.state.lhsDescribe,
                                populateLhsStateForField(fields, fieldName, lhsItem, isFieldOnSobjectVar));
                        } else {
                            this.state.lhsDescribe.value = addCurlyBraces(fer.name + '.' + fieldName);
                        }
                    });
                } else {
                    this.state.lhsDescribe.value = lhsItem;
                    this.state.lhsDescribe.param = elementToParam(fer);
                }
            }
        }
    }
}