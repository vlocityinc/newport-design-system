import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning button component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */
export default class LightningButtonIcon extends LightningElement {
    @api alternativeText;
    @api iconName;
    @api size = 'small';
    @api variant;
    @api disabled;
    @api iconClass;
}
