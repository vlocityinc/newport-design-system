import { Element, api } from 'engine';
import { localizeString, I18N_KEY_SCREEN_FIELD_EXTENSION_PREVIEW_DESCRIPTION } from 'builder_platform_interaction-screen-editor-i18n-utils';

export default class ExtensionScreenField extends Element {
    @api screenfield;
    description = localizeString(I18N_KEY_SCREEN_FIELD_EXTENSION_PREVIEW_DESCRIPTION);
}