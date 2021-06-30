import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { LightningElement, track, api } from 'lwc';
import { createScreenLegalNoticeDismissedEvent } from 'builder_platform_interaction/events';
import { LABELS } from './screenEditorLegalPopoverLabels';

export default class ScreenEditorLegalPopover extends LightningElement {
    protected labels = LABELS;
    private needToFocusOnUrl = true;

    private needToUpdatePopupPosition = true;

    @track
    private screensLegalAgreementsUrl?: string;

    @track _notices = [];

    @api
    get notices() {
        return this._notices;
    }

    set notices(notices) {
        if (this._notices !== notices) {
            // So that focus is shifted to Legal Notice only when a new notice is added to popup
            if (notices.length > this._notices.length) {
                this.needToFocusOnUrl = true;
            }
            // So that when re-rendering happens, popup is re-positioned to the right place
            this.needToUpdatePopupPosition = true;
            this._notices = notices;
        }
    }

    connectedCallback() {
        fetchOnce(SERVER_ACTION_TYPE.GET_AUTOMATIC_FIELD_BETA_URLS).then(
            ({ automaticFieldLegalAgreements }) => (this.screensLegalAgreementsUrl = automaticFieldLegalAgreements)
        );
    }

    handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            // do not propagate ESC as it would close the (aura) property editor dialog
            event.stopPropagation();
            this.dispatchEvent(createScreenLegalNoticeDismissedEvent());
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
        if (this.needToUpdatePopupPosition) {
            this.needToUpdatePopupPosition = false;
            // Renders the popup at the right location
            this.showPopup();
        }
        if (this.needToFocusOnUrl && this.screensLegalAgreementsUrl != null) {
            this.needToFocusOnUrl = false;
            // formattedUrlElement is null if popup already closed
            this.formattedUrlElement?.focus();
        }
    }

    showPopup() {
        const popupLocation = this.template.querySelector('.popupLocation');
        // This is done in order to re-render the popup at the right position
        this.popupElement.close();
        this.popupElement.show(popupLocation, {
            reference: { horizontal: 'left', vertical: 'top' },
            popup: { horizontal: 'left', vertical: 'bottom' },
            padding: 1,
            offset: 1
        });
    }

    handleCloseButtonClick = () => {
        this.dispatchEvent(createScreenLegalNoticeDismissedEvent());
    };

    get formattedUrlElement() {
        // returns the url element for the latest notice added
        return this.popupElement?.querySelectorAll('lightning-formatted-url')[
            this.notices.length - 1
        ] as HTMLElement | null;
    }

    get popupElement() {
        return this.template.querySelector('lightning-popup');
    }
}
