import { Element, api } from 'engine';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
/**
 * Alert/confirmation message dialog
 * @since 216
 */
export default class MessageDialog extends Element {
    @api title;
    @api bodyText;

    @api primaryActionText;
    @api secondaryActionText;

    @api handlePrimaryCallback;
    @api handleSecondaryCallback;

    @api primaryVariant;
    @api secondaryVariant;

    labels = LABELS;

    handlePrimaryButtonClick() {
        if (typeof this.handlePrimaryCallback === 'function') {
            this.handlePrimaryCallback.call();
        }
    }

    handleSecondaryButtonClick() {
        if (typeof this.handleSecondaryCallback === 'function') {
            this.handleSecondaryCallback.call();
        }
    }
}
