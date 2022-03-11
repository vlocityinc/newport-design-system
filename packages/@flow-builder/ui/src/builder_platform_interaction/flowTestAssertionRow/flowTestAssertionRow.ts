import { UpdateTestAssertionEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getRulesForElementType, RULE_OPERATOR, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { commonUtils, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './flowTestAssertionRowLabels';
const { logInteraction } = loggingUtils;
const { format } = commonUtils;

const customMessageInput = '.test-editor-assertion-message-input';

export default class FlowTestAssertionRow extends LightningElement {
    labels = LABELS;

    _assertion;

    @api
    get assertion() {
        return this._assertion;
    }

    set assertion(data) {
        this._assertion = data;
        const input = this.template.querySelector(customMessageInput);
        if (input) {
            if (this._assertion.message) {
                input.setCustomValidity(this._assertion.message.error ? this._assertion.message.error : '');
                input.reportValidity();
            }
        }
    }

    @api
    index;

    @api
    showDeleteAssertion;

    elementTypeForExpressionBuilder = ELEMENT_TYPE.DECISION;
    rulesForExpressionBuilder = getRulesForElementType(RULE_TYPES.COMPARISON, this.elementTypeForExpressionBuilder);
    defaultOperator = RULE_OPERATOR.EQUAL_TO;

    handleAddCustomMessage(event) {
        event.stopPropagation();
        this.dispatchUpdateTestAssertionEvent({
            index: this.index,
            isExpressionChanged: false,
            isMessageChanged: true,
            expression: undefined,
            message: ''
        });
    }

    handleRemoveCustomErrorMessage(event) {
        event.stopPropagation();
        this.dispatchUpdateTestAssertionEvent({
            index: this.index,
            isExpressionChanged: false,
            isMessageChanged: true,
            expression: undefined,
            message: undefined
        });
    }

    handleUpdateCustomErrorMessage(event) {
        event.stopPropagation();
        const message = event.detail.value;
        this.dispatchUpdateTestAssertionEvent({
            index: this.index,
            isExpressionChanged: false,
            isMessageChanged: true,
            expression: undefined,
            message
        });
    }

    handleUpdatedExpression(event) {
        event.stopPropagation();
        const newValues = event.detail.newValue;
        const newExpression = Object.assign({}, this.assertion.expression, newValues);
        this.dispatchUpdateTestAssertionEvent({
            index: this.index,
            isExpressionChanged: true,
            isMessageChanged: false,
            expression: newExpression,
            message: undefined
        });
    }

    dispatchUpdateTestAssertionEvent(updateProps: {
        index: number;
        isExpressionChanged: boolean;
        isMessageChanged: boolean;
        expression?: UI.ExpressionFilter;
        message?: string;
    }) {
        const updateMessageEvent = new UpdateTestAssertionEvent(
            updateProps.index,
            updateProps.isExpressionChanged,
            updateProps.isMessageChanged,
            updateProps.expression,
            updateProps.message
        );
        this.dispatchEvent(updateMessageEvent);
    }

    get showCustomFieldMessageButton() {
        return this.assertion.message === undefined;
    }

    get labelForAssertionRow() {
        return format(LABELS.flowTestAssertionRowLabel, this.index + 1);
    }
}
