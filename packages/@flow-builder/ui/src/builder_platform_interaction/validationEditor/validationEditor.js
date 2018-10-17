import { LightningElement, api } from 'lwc';
import { LABELS } from './validationEditorLabels';
import { ValidationRuleChangedEvent } from 'builder_platform_interaction/events';

/*
 * Common component that can be used in various property editors where a Validation Rule
 * is used.
 */
export default class ValidationEditor extends LightningElement {
    @api element;
    @api required = false;

    labels = LABELS;

    handleValueChanged = (event) => {
        event.stopPropagation();
        const property = event.srcElement.name;
        const formulaDisplayedValue = (property === 'formulaExpression') ? {value: event.detail.value, error: event.detail.error} :
                                                                           this.template.querySelector('.property-input.formulaExpression').value;

        const errorDisplayedValue = (property === 'errorMessage') ? {value: event.detail.value, error: event.detail.error} :
                                                                    this.template.querySelector('.property-input.errorMessage').value;

        const hasFormula = formulaDisplayedValue.value && formulaDisplayedValue.value.length > 0;
        const hasError = errorDisplayedValue.value && errorDisplayedValue.value.length > 0;
        let formulaError = null, errorError = null;

        if (hasFormula ^ hasError) { // Validate conditional requiredness
            if (hasFormula) {
                errorError = LABELS.cannotBeBlank;
            } else {
                formulaError = LABELS.cannotBeBlank;
            }
        }

        // TODO fire only if it really changed
        this.dispatchEvent(new ValidationRuleChangedEvent({
            formulaExpression: {value: formulaDisplayedValue.value, error: formulaDisplayedValue.error || formulaError},
            errorMessage: {value: errorDisplayedValue.value, error: errorDisplayedValue.error || errorError}
        }));
    }
}