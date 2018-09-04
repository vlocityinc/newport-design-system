import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning formatted rich text component for use by Jest tests
 *
 * @ScrumTeam Process Services
 * @author Raji Srikantan
 * @since 216
 */
export default class LightningFormattedRichText extends LightningElement {
    @api title;
    @api value;
    @api disableLinkify;
}