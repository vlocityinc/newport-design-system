import { showCustomOverlay } from 'lightning-overlay-utils';
import { createElement } from 'engine';
import MessageDialog from 'builder_platform_interaction-message-dialog';

/**
 * Shows a modal
 * @param {object} body Component to be used in the body of the modal
 * @returns {Promise} which resolves with successful modal creation
 */
export function showModal(body) {
    return showCustomOverlay({
        modal: 'modal',
        body,
        bodyClass: 'slds-p-around_none'
    });
}

/**
 * Shows a confirmation dialog
 * @param {object} dialogAttributes Holds the attributes to set on MessageDialog
 * @param {function} callback function to be called upon confirmation (secondary button)
 * @returns {object} dialog
 */
export function showConfirmationDialog(dialogAttributes, callback) {
    const dialog = createElement('builder_platform_interaction-message-dialog', {
        is: MessageDialog
    });
    dialog.title = dialogAttributes.title;
    dialog.bodyText = dialogAttributes.bodyText;

    dialog.primaryActionText = dialogAttributes.primaryButton.actionText;
    dialog.primaryVariant = dialogAttributes.primaryButton.variant;

    dialog.secondaryActionText = dialogAttributes.secondaryButton.actionText;
    dialog.secondaryVariant = dialogAttributes.secondaryButton.variant;

    showModal(dialog).then(panel => {
        dialog.handlePrimaryCallback = () => {
            panel.close();
        };
        dialog.handleSecondaryCallback = () => {
            panel.close();
            if (callback && callback.call) {
                callback.call();
            }
        };
    });
    return dialog;
}