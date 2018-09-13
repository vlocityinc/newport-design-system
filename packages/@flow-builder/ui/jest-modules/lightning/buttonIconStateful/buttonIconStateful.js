import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning button icon stateful component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 216
 */
export default class LightningButtonIcon extends LightningElement {
    @api alternativeText;
    @api selected;
    @api variant;
    @api iconName;
    @api id;
    @api title;
}