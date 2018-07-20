import { Element, api } from 'engine';

/**
 * Dummy lightning badge component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 216
 */
export default class LightningBadge extends Element {
    @api title;
    @api label;
}