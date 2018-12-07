import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning icon component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class LightningIcon extends LightningElement {
    @api alternativeText;
    @api iconName;
    @api size = 'medium';
    @api variant;
    @api title;
}
