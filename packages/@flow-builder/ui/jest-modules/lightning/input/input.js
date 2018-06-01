import { Element, api } from 'engine';

/**
 *
 * Dummy lightning input component for use by Jest tests
 * @param {string} textEntered - The value
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
    @api messageToggleActive;
    @api messageToggleInactive;
    @api variant;
    @api checked;
    @api messageWhenValueMissing;
    @api disabled;
    @api fieldLevelHelp;
    @api formatter;
    @api min;
    @api max;
    @api name;

    @api mockUserInput = (textEntered) => {
        Object.defineProperty(this, 'value', {
            value: textEntered,
            // required to be able to directly change the value input.value = 'desired'
            // this is necessary to support overriding what a user has typed in some cases
            writable: true
        });
    }

    @api setCustomValidity = jest.fn();
    @api showHelpMessageIfInvalid = jest.fn();
}
