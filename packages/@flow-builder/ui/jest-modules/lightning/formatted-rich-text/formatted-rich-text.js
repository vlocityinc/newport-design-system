import { Element, api } from 'engine';

/**
 * Dummy lightning formatted rich text component for use by Jest tests
 *
 * @ScrumTeam Process Services
 * @author Raji Srikantan
 * @since 216
 */
export default class LightningFormattedRichText extends Element {
    @api title;
    @api value;
}