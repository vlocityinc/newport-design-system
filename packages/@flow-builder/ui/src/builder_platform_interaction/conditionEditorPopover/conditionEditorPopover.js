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

    _updateConditionPromise = Promise.resolve();

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
        this._updateConditionPromise.then(() => {
            event.stopPropagation();

            const validatedCondition = conditionEditorValidation.validateAll({
                condition: [this.condition]
            }).condition[0];

            this.condition = updateProperties(
                this.condition,
                validatedCondition
            );

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
        });
    };

    handleUpdateCondition = event => {
        event.stopPropagation();

        const newValue = event.detail.newValue;

        // W-6359316: When clicking on the "done" button, if an input has the focus, this will code will
        // run first, before the done button's onclick event is fired. Unfortunately the lwc framework will rerender
        // the UI after this method runs, and before the done's event is processed. This might result in the button's onclick
        // firiing on an element that is located where the done button used to be.
        // Adding a delay here insures that the done button's onclick is queued before any updates to the UI occur.
        // This can be removed when W-6434223 is fixed
        // Work item here: https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000007CF9FIAW/view
        this._updateConditionPromise = new Promise(resolve => {
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => resolve(), 100);
        }).then(() => {
            this.condition = updateProperties(this.condition, newValue);
        });
    };
}
