import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning input rich text component for use by Jest tests
 * @param {string} textEntered - The value
 *
 * @ScrumTeam Process Services
 * @author Raji Srikantan
 * @since 216
 */
export default class LightningInputRichText extends LightningElement {
    @api name;
    @api label;
    @api formats;
    @api value;
    @api variant;

    @api mockUserInput = (textEntered) => {
        Object.defineProperty(this, 'value', {
            value: textEntered
        });
    }
}