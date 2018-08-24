import { LightningElement, track } from 'lwc';

const SECTION = 'section';
export default class AccordionSection extends LightningElement {
    @track
    isSectionOpen = true;

    /**
     * @returns {string} sectionState slds for section header state
     */
    get sectionState() {
        return this.isSectionOpen ? 'slds-accordion__section slds-is-open' : 'slds-accordion__section';
    }

    /**
     * Toggles the section header state on click
     * @param {object} event - click event from accordion header section
     */
    handleAccordionHeaderClick(event) {
        if (event.currentTarget.id === SECTION) {
            this.isSectionOpen = !this.isSectionOpen;
        }
    }
}