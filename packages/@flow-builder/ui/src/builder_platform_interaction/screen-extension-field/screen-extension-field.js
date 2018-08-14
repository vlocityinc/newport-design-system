import { LightningElement, api } from "lwc";
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

export default class ScreenExtensionField extends LightningElement {
    @api screenfield;
    labels = LABELS;
}