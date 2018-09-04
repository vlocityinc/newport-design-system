import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning accordion component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Lovi Yu
 * @since 218
 */
export default class LightningAccordion extends LightningElement {
    @api allowMultipleSectionsOpen;
    @api activeSectionName;
}