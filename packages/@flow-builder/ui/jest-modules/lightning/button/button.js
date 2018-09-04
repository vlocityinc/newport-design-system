import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning button component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class LightningButton extends LightningElement {
    @api id;
    @api title;
    @api name;
    @api value;
    @api label;
    @api variant = 'neutral';
    @api iconName;
    @api iconPosition = 'left';
    @api type = 'button';
    @api disabled = 'false';
}
