import { api, LightningElement } from 'lwc';

export default class LearnMoreCard extends LightningElement {
    @api
    popupTriggerLabel = '';

    @api
    sideText = '';

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

    // Focus the popup link instead of its first tabbable element, which would be the close icon
    handlePopupAutofocus(e: Event) {
        e.preventDefault();
        this.template.querySelector('lightning-formatted-url').focus();
    }

    handlePopupKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            e.stopPropagation();
        }
    }

    handlePopupCloseClick() {
        this.popup.close();
    }
}
