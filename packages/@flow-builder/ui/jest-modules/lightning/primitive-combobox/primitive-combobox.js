import { Element, api } from 'engine';

/**
 * Dummy lightning input component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Aaron Liebling
 * @since 214
 */
export default class PrimitiveCombobox extends Element {
    @api label;
    @api items;
    @api value;
    @api inputText;
    @api inputIconName;
    @api placeholder;
    @api disabled;
    @api messageWhenValueMissing;
    @api spinnerActive;
}
