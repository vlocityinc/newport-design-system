import { LightningElement, api } from 'lwc';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    getRulesForElementType,
    RULE_TYPES,
    RULE_OPERATOR
} from 'builder_platform_interaction/ruleLib';

import { conditionEditorValidation } from './conditionEditorValidation';
import { isTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { LABELS } from './conditionEditorPopoverLabels';

export default class ConditionEditorPopover extends LightningElement {
    containerElement = ELEMENT_TYPE.SCREEN;

    @api
    condition;

    @api
    handleDone;

    @api
    lhsLabelHelpText;

    @api
    rhsLabelHelpText;

    labels = LABELS;
    defaultOperator = RULE_OPERATOR.EQUAL_TO;

    get rules() {
        return getRulesForElementType(
            RULE_TYPES.COMPARISON,
            this.containerElement
        );
    }

    handleDoneEditing = event => {
        event.stopPropagation();

        const validatedCondition = conditionEditorValidation.validateAll({
            condition: [this.condition]
        }).condition[0];

        this.condition = updateProperties(this.condition, validatedCondition);

        const { leftHandSide, operator, rightHandSide } = this.condition;

        if (
            !rightHandSide.error &&
            isTextWithMergeFields(rightHandSide.value)
        ) {
            rightHandSide.error = this.labels.stringWithMergeFieldsNotAllowedLabel;
        }

        const hasError =
            leftHandSide.error || operator.error || rightHandSide.error;

        if (!hasError) {
            this.handleDone(this.condition);
        }
    };

    handleUpdateCondition = event => {
        event.stopPropagation();

        const newValue = event.detail.newValue;
        this.condition = updateProperties(this.condition, newValue);
    };
}
