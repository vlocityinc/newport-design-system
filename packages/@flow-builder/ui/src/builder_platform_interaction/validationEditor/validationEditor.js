import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { hydrateIfNecessary } from "builder_platform_interaction/dataMutationLib";

/*
 * Common component that can be used in various property editors where a Validation Rule
 * is used.
 */
export default class ValidationEditor extends LightningElement {
    @api element;
    @api required = false;

    labels = LABELS;

    get validationRuleErrorValue() {
        return hydrateIfNecessary(this.element.errorMessage);
    }

    get validationRuleFormulaValue() {
        return hydrateIfNecessary(this.element.formulaExpression);
    }

    handleValueChanged = (event) => {
        event.stopPropagation();
        const propertyName = event.srcElement.name;
        const newValue = this.template.querySelector('.property-input.' + propertyName).value;
        const currentValue = this.element[propertyName] ? this.element[propertyName].value : null;

        if ((currentValue || newValue)  && currentValue !== newValue) {
            const hydratedNewValue = hydrateIfNecessary(newValue);
            const hydratedCurrentValue = hydrateIfNecessary(currentValue);
            const error = event.detail ? event.detail.error : null;
            const guid = event.detail ? event.detail.guid : null;
            // Hydrate the current value before sending in to ensure the new value is hydrated also.
            this.dispatchEvent(new PropertyChangedEvent(propertyName, hydratedNewValue, error, guid, hydratedCurrentValue));
        }
    }
}