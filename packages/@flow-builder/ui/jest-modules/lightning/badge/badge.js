import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning badge component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 216
 */
export default class LightningBadge extends LightningElement {
    @api title;
    @api label;
}