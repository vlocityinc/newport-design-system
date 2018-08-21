import { LightningElement, api } from "lwc";
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

export default class ScreenExtensionField extends LightningElement {
    @api screenfield;
    labels = LABELS;

    get displayName() {
        return this.screenfield.type.label !== null ? this.screenfield.type.label : this.screenfield.type.name;
    }
}