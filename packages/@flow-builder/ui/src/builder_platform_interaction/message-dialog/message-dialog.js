import { Element, api } from 'engine';

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
