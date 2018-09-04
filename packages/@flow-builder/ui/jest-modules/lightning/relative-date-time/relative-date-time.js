import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning relative-date-time component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @since 218
 */
export default class LightningRelativeDateTime extends LightningElement {
    @api value;
}