import { LightningElement, api } from 'lwc';
import { LABELS } from './validationEditorLabels';
import { ValidationRuleChangedEvent } from 'builder_platform_interaction/events';
import { generateGuid } from 'builder_platform_interaction/storeLib';

/*
 * Common component that can be used in various property editors where a Validation Rule
 * is used.
 */
export default class ValidationEditor extends LightningElement {
    _ferovPickerId = generateGuid();
    _rteId = generateGuid();

    @api element;
    @api required = false;
    @api hideNewResource = false;

    labels = LABELS;

    handleFormulaExpressionValueChanged = event => {
        if (event && event.detail) {
            event.stopPropagation();
            const formulaDisplayedValue = {
                value: event.detail.value,
                error: event.detail.error
            };
            const errorDisplayedValue = this.template.querySelector(
                '.property-input.errorMessage'
            ).value;
            this.handleFormulaExpressionOrErrorMessageChanged(
                formulaDisplayedValue,
                errorDisplayedValue
            );
        }
    };

    handleErrorMessageValueChanged = event => {
        if (event && event.detail) {
            event.stopPropagation();
            const formulaDisplayedValue = this.template.querySelector(
                '.property-input.formulaExpression'
            ).value;
            const errorDisplayedValue = {
                value: event.detail.value,
                error: event.detail.error
            };
            this.handleFormulaExpressionOrErrorMessageChanged(
                formulaDisplayedValue,
                errorDisplayedValue
            );
        }
    };

    handleFormulaExpressionOrErrorMessageChanged = (
        formulaExpression,
        errorMessage
    ) => {
        const ifFormulaExpressionHasValue =
            formulaExpression.value && formulaExpression.value.length > 0;
        const ifErrorMessageHasValue =
            errorMessage.value && errorMessage.value.length > 0;
        let errorOnFormulaExpression = formulaExpression.error,
            errorOnErrorMessage = errorMessage.error;

        if (!ifFormulaExpressionHasValue && !ifErrorMessageHasValue) {
            errorOnFormulaExpression = null;
            errorOnErrorMessage = null;
        } else if (ifFormulaExpressionHasValue && !ifErrorMessageHasValue) {
            errorOnErrorMessage = LABELS.cannotBeBlank;
        } else if (!ifFormulaExpressionHasValue && ifErrorMessageHasValue) {
            errorOnFormulaExpression = LABELS.cannotBeBlank;
        }

        // TODO fire only if it really changed (W-5780103)
        this.dispatchEvent(
            new ValidationRuleChangedEvent({
                formulaExpression: {
                    value: formulaExpression.value,
                    error: errorOnFormulaExpression
                },
                errorMessage: {
                    value: errorMessage.value,
                    error: errorOnErrorMessage
                }
            })
        );
    };
}
