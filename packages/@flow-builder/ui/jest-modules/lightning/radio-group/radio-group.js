import { Element, api } from 'engine';

/**
 * Dummy lightning radio-group component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @since 216
 */
export default class LightningRadioGroup extends Element {
    @api value;
    @api label;
    @api options;
    @api name;
    @api required;
}
