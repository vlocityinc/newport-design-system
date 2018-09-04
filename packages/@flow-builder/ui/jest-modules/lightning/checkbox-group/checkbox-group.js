import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning checkbox-group component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @since 216
 */
export default class LightningCheckboxGroup extends LightningElement {
    @api value;
    @api label;
    @api options;
}