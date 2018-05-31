import { Element, api } from 'engine';

/**
 * Dummy lightning input rich text component for use by Jest tests
 * @param {string} textEntered - The value
 *
 * @ScrumTeam Process Services
 * @author Raji Srikantan
 * @since 216
 */
export default class LightningInputRichText extends Element {
    @api name;
    @api label;
    @api formats;

    @api mockUserInput = (textEntered) => {
        Object.defineProperty(this, 'value', {
            value: textEntered
        });
    }
}