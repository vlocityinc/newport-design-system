import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { LightningElement, track } from 'lwc';
import { LABELS } from './screenEditorAutomaticFieldLegalPopoverLabels';

export default class ScreenEditorAutomaticFieldLegalPopover extends LightningElement {
    protected labels = LABELS;
    private needToDisplayLegalPopup = true;
    private needToFocusOnUrl = true;
    @track
    private automaticFieldLegalAgreementsUrl?: string;

    connectedCallback() {
        fetchOnce(SERVER_ACTION_TYPE.GET_AUTOMATIC_FIELD_BETA_URLS).then(
            ({ automaticFieldLegalAgreements }) =>
                (this.automaticFieldLegalAgreementsUrl = automaticFieldLegalAgreements)
        );
    }

    handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            // do not propagate ESC as it would close the (aura) property editor dialog
            event.stopPropagation();
        }
    };

    handleClickout = (event: Event) => {
        event.preventDefault();
    };

    handleAutofocus(e: Event) {
        // we will focus on the popup link once we get the url
        e.preventDefault();
    }

    renderedCallback() {
        if (this.needToDisplayLegalPopup) {
            this.needToDisplayLegalPopup = false;
            this.showPopup();
        } else if (this.needToFocusOnUrl && this.automaticFieldLegalAgreementsUrl != null) {
            this.needToFocusOnUrl = false;
            // formattedUrlElement is null if popup already closed
            this.formattedUrlElement?.focus();
        }
    }

    showPopup() {
        const popupLocation = this.template.querySelector('.popupLocation');
        this.popupElement.show(popupLocation, {
            reference: { horizontal: 'left', vertical: 'top' },
            popup: { horizontal: 'left', vertical: 'bottom' },
            padding: 1,
            offset: 1
        });
    }

    handleCloseButtonClick = () => {
        this.popupElement.close();
    };

    get formattedUrlElement() {
        return this.popupElement?.querySelector('lightning-formatted-url') as HTMLElement | null;
    }

    get popupElement() {
        return this.template.querySelector('lightning-popup');
    }
}
