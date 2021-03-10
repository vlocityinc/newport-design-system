import { LightningElement, api } from 'lwc';

export default class LearnMoreCard extends LightningElement {
    @api
    popupTriggerLabel = '';

    @api
    popupTriggerTitle = '';

    @api
    sideText = '';

    @api
    popupCloseButtonTitle = '';

    @api
    popupCloseButtonAssistiveText = '';

    @api
    popupBodyText = '';

    @api
    popupLinkLabel = '';

    @api
    popupLinkUrl = '';

    get popup() {
        return this.template.querySelector('lightning-popup');
    }

    handlePopupTriggerClick() {
        const referenceElement = this.template.querySelector('.popup-trigger');
        this.popup.show(referenceElement, {
            reference: { vertical: 'bottom', horizontal: 'center' },
            popup: { vertical: 'top', horizontal: 'left' },
            padding: -1,
            offset: -1.5
        });
    }

    // Skipping the autofocus of the first tabbable element (which would focus the close icon)
    handlePopupAutofocus(e: Event) {
        e.preventDefault();
    }

    handlePopupCloseClick() {
        this.popup.close();
    }
}
