import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement, track } from 'lwc';

const selectors = {
    slot: (slotName) => `slot[name="${slotName}"]`
};

/**
 * Template with header, body and footer sections for alc menus
 */
export default class AlcMenuTemplate extends LightningElement {
    dom = lwcUtils.createDomProxy(this);

    @track
    showHeader = true;

    @track
    showBody = true;

    @track
    showFooter = true;

    connectedCallback(): void {
        this.classList.add('menu', 'overlay', 'slds-dropdown');
    }

    /**
     * Checks if a slot is empty
     *
     * @param slotName - The slot name
     * @returns true iff the slot is empty
     */
    isSlotEmpty(slotName: string) {
        // computes the selector using the slot tagged template
        const selector = selectors.slot(slotName);

        const slot = this.dom.as<HTMLSlotElement>()[selector];
        return slot.assignedElements().length === 0;
    }

    /**
     * Handles showing/hidding sections when slot changes are detected
     */
    handleSlotChange() {
        this.showHeader = !this.isSlotEmpty('header');
        this.showBody = !this.isSlotEmpty('body');
        this.showFooter = !this.isSlotEmpty('footer');
    }
}
