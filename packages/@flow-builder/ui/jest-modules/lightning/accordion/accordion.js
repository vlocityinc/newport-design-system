import { Element, api } from 'engine';

/**
 * Dummy lightning accordion component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Lovi Yu
 * @since 218
 */
export default class LightningAccordion extends Element {
    @api allowMultipleSectionsOpen;
    @api activeSectionName;
}