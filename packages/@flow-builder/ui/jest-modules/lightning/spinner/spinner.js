import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning spinner component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @since 216
 */
export default class LightningSpinner extends LightningElement {
    @api alternativeText;
    @api size = 'medium';
    @api variant;
}