import { LightningElement, api } from 'lwc';

/**
 *
 * Dummy lightning input component for use by Jest tests
 * @param {string} textEntered - The value
 *
 * @ScrumTeam Process UI
 * @author Aaron Liebling
 * @since 214
 */
export default class LightningInput extends LightningElement {
    @api type;
    @api label;
    @api value;
    @api required;
    @api maxLength;
    @api messageToggleActive;
    @api messageToggleInactive;
    @api variant;
    @api readOnly;
    @api checked;
    @api messageWhenValueMissing;
    @api disabled;
    @api fieldLevelHelp;
    @api formatter;
    @api min;
    @api max;
    @api name;
    @api messageWhenRangeOverflow;
    @api messageWhenRangeUnderflow;
    @api placeholder;
    @api setCustomValidity = jest.fn();
    @api showHelpMessageIfInvalid = jest.fn();
    @api validity = {};
}
