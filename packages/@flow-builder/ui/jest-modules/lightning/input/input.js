import { Element, api } from 'engine';

/**
 * Dummy lightning input component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Aaron Liebling
 * @since 214
 */
export default class LightningInput extends Element {
    @api type;
    @api label;
    @api value;
    @api required;
    @api maxLength;

    @api mockUserInput = (textEntered) => {
        Object.defineProperty(this, 'value', {
            value: textEntered
        });
    }

    @api setCustomValidity = jest.fn();
    @api showHelpMessageIfInvalid = jest.fn();
}
