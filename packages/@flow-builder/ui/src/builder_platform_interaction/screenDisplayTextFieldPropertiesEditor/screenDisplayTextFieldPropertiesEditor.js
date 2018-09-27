import { LightningElement, api } from 'lwc';
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { addCurrentValueToEvent } from "builder_platform_interaction/screenEditorCommonUtils";

/*
 * Screen element property editor
 */
export default class ScreenDisplayTextFieldPropertiesEditor extends LightningElement {
    @api field;
    labels = LABELS;

    handlePropertyChanged = (event) => {
        event.stopPropagation();
        this.dispatchEvent(addCurrentValueToEvent(event, this.field));
    }
}