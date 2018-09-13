import { LightningElement, api } from 'lwc';
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";

export default class ScreenExtensionField extends LightningElement {
    @api screenfield;
    labels = LABELS;

    get displayName() {
        return this.screenfield.type.label !== null ? this.screenfield.type.label : this.screenfield.type.name;
    }
}