import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { LightningElement, track } from 'lwc';
import { LABELS } from './screenEditorAutomaticFieldLegalPopoverLabels';

export default class ScreenEditorAutomaticFieldLegalPopover extends LightningElement {
    protected labels = LABELS;
    private needToDisplayLegalPopup = true;
    @track
    private automaticFieldLegalAgreements?: string;

    connectedCallback() {
        fetchOnce(SERVER_ACTION_TYPE.GET_AUTOMATIC_FIELD_BETA_URLS).then(
            ({ automaticFieldLegalAgreements }) => (this.automaticFieldLegalAgreements = automaticFieldLegalAgreements)
        );
    }

    get hasAgreementUrl() {
        return !!this.automaticFieldLegalAgreements;
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

    renderedCallback() {
        if (this.needToDisplayLegalPopup) {
            this.needToDisplayLegalPopup = false;
            this.showPopup();
        }
    }

    showPopup() {
        const popupLocation = this.template.querySelector('.popupLocation');
        this.popup.show(popupLocation, {
            reference: { horizontal: 'left', vertical: 'top' },
            popup: { horizontal: 'left', vertical: 'bottom' },
            padding: 1,
            offset: 1
        });
    }

    handleCloseButtonClick = () => {
        this.popup.close();
    };

    get popup() {
        return this.template.querySelector('lightning-popup');
    }
}
