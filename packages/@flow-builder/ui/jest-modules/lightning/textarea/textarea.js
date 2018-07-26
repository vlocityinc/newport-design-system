import { Element, api } from 'engine';

/**
 * Dummy lightning textarea component for use by Jest tests
 * @param {string} textEntered - The value
 *
 * @ScrumTeam Process UI
 * @author Aaron Liebling
 * @since 214
 */
export default class LightningTextArea extends Element {
    @api label;
    @api value;
    @api maxLength;
    @api variant;
    @api required;
    @api name;
    @api fieldLevelHelp;

    @api mockUserInput = (textEntered) => {
        Object.defineProperty(this, 'value', {
            value: textEntered,
            // required to be able to directly change the value input.value = 'desired'
            // this is necessary to support overriding what a user has typed in some cases
            writable: true
        });
    }
}
