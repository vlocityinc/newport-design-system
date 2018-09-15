import { LightningElement, api } from 'lwc';
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { addGuidAndCurrentValueToEvent } from "builder_platform_interaction/screenEditorUtils";

/*
 * Screen element property editor
 */
export default class ScreenDisplayTextFieldPropertiesEditor extends LightningElement {
    @api field;
    labels = LABELS;

    handlePropertyChanged = (event) => {
        this.dispatchEvent(addGuidAndCurrentValueToEvent(event, this.field));
        event.stopPropagation();
    }
}