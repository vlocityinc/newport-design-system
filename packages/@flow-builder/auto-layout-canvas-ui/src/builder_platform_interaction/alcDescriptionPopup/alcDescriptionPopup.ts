import { api, LightningElement } from 'lwc';

export default class AlcDescriptionPopup extends LightningElement {
    @api description!: string;

    @api icon!: string;

    /**
     * Handles the mouse enter event and opens the popup
     *
     * @param event - mouse enter event object
     */
    popupSourceMouseEnter(event) {
        const popupSource = event.currentTarget.parentElement;
        if (popupSource) {
            popupSource.open({
                alignment: 'right',
                size: 'small',
                autoFlip: false
            });
        }
    }

    /**
     * Handles the mouse leave event and closes the popup
     *
     * @param event - mouse leave event object
     */
    popupSourceMouseLeave(event) {
        const popupSource = event.currentTarget.parentElement;
        if (popupSource) {
            popupSource.close();
        }
    }

    updateTabIndex() {
        const tabindex = this.getAttribute('tabindex');
        if (tabindex != null) {
            this.template
                .querySelector('lightning-button-icon')
                ?.shadowRoot?.querySelector('button')
                ?.setAttribute('tabindex', tabindex);
        }
    }

    renderedCallback(): void {
        // TEMP FIX FOR TABBING ISSUE IN CONNECTOR MENU
        // Overriding default tab index set in ListKeyboardInteraction.ts
        this.updateTabIndex();
    }
}
