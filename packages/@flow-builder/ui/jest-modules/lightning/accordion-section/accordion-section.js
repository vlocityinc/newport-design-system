import { Element, api } from 'engine';

/**
 * Dummy lightning accordion section component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Lovi Yu
 * @since 218
 */
export default class LightningAccordionSection extends Element {
    @api name;
    @api label;
}