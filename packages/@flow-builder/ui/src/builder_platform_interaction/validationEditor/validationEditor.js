import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';

/*
 * Common component that can be used in various property editors where a Validation Rule
 * is used.
 */
export default class ValidationEditor extends LightningElement {
    @api element;
    @api required = false;

    labels = LABELS;

    get validationRuleErrorValue() {
        return this.element.errorMessage ? this.element.errorMessage.value : null;
    }

    get validationRuleFormulaValue() {
        return this.element.formulaExpression ? this.element.formulaExpression.value : null;
    }

    handleValueChanged = (event) => {
        let currentValue = this.validationRuleErrorValue;
        if (event.detail.propertyName === 'errorMessage') {
            currentValue = this.validationRuleErrorValue;
        } else if (event.detail.propertyName === 'formulaExpression') {
            currentValue = this.validationRuleFormulaValue;
        } else {
            throw new Error('Invalid property type: ' + event.detail.propertyName);
        }

        if (currentValue !== event.detail.value) {
            // Hydrate the current value before sending in to ensure the new value is hydrated also.
            this.dispatchEvent(new PropertyChangedEvent(event.detail.propertyName, event.detail.value, event.detail.error, this.element.guid, {value: currentValue, error: null}));
        }
        event.stopPropagation();
    }
}