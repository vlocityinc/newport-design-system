import { Element, api } from 'engine';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

export default class ScreenExtensionField extends Element {
    @api screenfield;
    labels = LABELS;
}