import { LightningElement, api } from 'lwc';
import { isItemHydratedWithErrors } from "builder_platform_interaction/dataMutationLib";
import { getFieldChoiceData } from "builder_platform_interaction/screenEditorUtils";

/**
 * Wrapper used to represent visual preview of radio screen fields.
 */
export default class ScreenRadioField extends LightningElement {
    @api field;
    @api label;
    @api value;
    @api helpText;  // TODO: haven't been able to figure out how to display this.
    @api required;

    get choices() {
        return getFieldChoiceData(this.field);
    }

    get displayLabel() {
        return isItemHydratedWithErrors(this.label) ? this.label.value : this.label;
    }
}