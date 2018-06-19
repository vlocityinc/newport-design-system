import {
    showConfirmationDialog
} from 'builder_platform_interaction-builder-utils';

import {
    showCustomOverlayTestPanel
} from 'lightning-overlay-utils';

describe('Modal Utils', () => {
    it('Shows a confirmation dialog that has clickable buttons', () => {
        const attributes = {
            title: 'hello',
            primaryButton: {
                actionText: 'button1',
                variant: 'destructive'
            },
            secondaryButton: {
                actionText: 'button2',
                variant: 'neutral'
            }
        };

        const callback = jest.fn();
        const closeCallback = jest.fn();
        showCustomOverlayTestPanel.close = closeCallback;
        const dialog = showConfirmationDialog(attributes, callback);
        expect(dialog.title).toBe(attributes.title);
        expect(dialog.primaryActionText).toBe(attributes.primaryButton.actionText);
        expect(dialog.primaryVariant).toBe(attributes.primaryButton.variant);
        expect(dialog.secondaryActionText).toBe(attributes.secondaryButton.actionText);
        expect(dialog.secondaryVariant).toBe(attributes.secondaryButton.variant);

        return Promise.resolve().then(() => {
            document.body.appendChild(dialog);
            const primaryButton = dialog.querySelector(".primary-button");
            primaryButton.click();
            expect(callback).not.toHaveBeenCalled();
            expect(closeCallback).toHaveBeenCalled();
            const secondaryButton = dialog.querySelector(".secondary-button");
            secondaryButton.click();
            expect(callback).toHaveBeenCalled();
            expect(closeCallback).toHaveBeenCalledTimes(2);
            showCustomOverlayTestPanel.close = () => {};
        });
    });
});