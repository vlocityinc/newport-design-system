import { Element, api } from 'engine';

/**
 * Dummy lightning input component for use by Jest tests
 * @param {string} textEntered - The value
 * 
 * @ScrumTeam Process UI
 * @author Aaron Liebling
 * @since 214
 */
export default class LightningInput extends Element {
    @api label;
    @api value;
    @api maxLength;
    @api variant;
    @api required;
    @api name;
    @api fieldLevelHelp;

    @api mockUserInput = (textEntered) => {
        Object.defineProperty(this, 'value', {
            value: textEntered
        });
    }
}
