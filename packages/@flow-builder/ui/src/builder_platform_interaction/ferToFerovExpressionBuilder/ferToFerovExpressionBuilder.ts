// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { updateProperties, sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import {
    EXPRESSION_PROPERTY_TYPE,
    getResourceByUniqueIdentifier,
    LHS_DISPLAY_OPTION,
    populateRhsState,
    normalizeFEROV
} from 'builder_platform_interaction/expressionUtils';
import { elementToParam } from 'builder_platform_interaction/ruleLib';
import { isObject } from 'builder_platform_interaction/commonUtils';
import { isLookupTraversalSupported } from 'builder_platform_interaction/mergeFieldLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getTriggerType } from 'builder_platform_interaction/storeUtils';

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
            value: '',
            error: undefined,
            isField: false,
            fields: null
        }
    };

    /**
     * Set to true to hide the 'New Resource' option in combobox menu data
     * @type {Boolean}
     */
    @api
    hideNewResource;

    @api
    hideGlobalVariables = false;

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
    variant;

    @api
    get expression() {
        return this.state.expression;
    }

    set expression(expression) {
        this.state.expression = expression;
        this.populateLhsState();
        populateRhsState(expression, (values) => {
            this.state.rhsDescribe = values;
        });
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

    isLookupTraversalSupported() {
        return isLookupTraversalSupported(Store.getStore().getCurrentState().properties.processType, getTriggerType());
    }

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
            fields: null
        };

        if (lhs.value) {
            const fer = getResourceByUniqueIdentifier(lhs.value);

            if (fer) {
                if (this.isFieldOnVariable(lhs.value)) {
                    this.state.lhsDisplayOption = LHS_DISPLAY_OPTION.FIELD_ON_VARIABLE;
                }
                const normalizedFer = normalizeFEROV(lhs.value, {
                    allowSObjectFieldsTraversal: this.isLookupTraversalSupported()
                });
                if (isObject(normalizedFer)) {
                    if (normalizedFer.fields) {
                        this.state.lhsDescribe = updateProperties(
                            this.state.lhsDescribe,
                            this.populateLhsStateForField({
                                value: normalizedFer.itemOrDisplayText,
                                fields: normalizedFer.fields
                            })
                        );
                    } else {
                        this.state.lhsDescribe.value = normalizedFer.itemOrDisplayText;
                        this.state.lhsDescribe.param = elementToParam(fer);
                    }
                } else {
                    this.state.lhsDescribe.value = normalizedFer.itemOrDisplayText;
                }
            }
        }
    }

    isFieldOnVariable(value) {
        return !!sanitizeGuid(value).fieldNames;
    }

    populateLhsStateForField(normalizedFer) {
        const { value, fields } = normalizedFer;
        const lhsState = {
            fields,
            value
        };
        const fieldNames = sanitizeGuid(value.value).fieldNames;
        const fieldName = fieldNames && fieldNames[fieldNames.length - 1];
        if (fieldName && fields[fieldName]) {
            const field = fields[fieldName];
            lhsState.activePicklistValues = field.activePicklistValues || false;
            lhsState.param = elementToParam(field);
        }
        return lhsState;
    }
}
