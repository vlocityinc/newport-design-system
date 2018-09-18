import { LightningElement, api } from 'lwc';
import { isItemHydratedWithErrors } from "builder_platform_interaction/dataMutationLib";

/**
 * Wrapper used to represent visual preview of radio screen fields.
 */
export default class ScreenRadioField extends LightningElement {
    @api field;
    @api label;
    @api value;
    @api helpText;
    @api required;

    get choices() {
        // Placeholder values
        // TODO iterate through this.field.choiceReferences
        return [
            { 'label': 'label1', 'value': 'inputvalue2' },
            { 'label': 'label2', 'value': 'inputvalue1' }
        ];
    }

    get displayLabel() {
        return isItemHydratedWithErrors(this.label) ? this.label.value : this.label;
    }
}