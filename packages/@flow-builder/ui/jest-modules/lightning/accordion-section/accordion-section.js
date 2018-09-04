import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning accordion section component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Lovi Yu
 * @since 218
 */
export default class LightningAccordionSection extends LightningElement {
    @api name;
    @api label;
}