import { Element, api } from 'engine';

/**
 * Dummy lightning checkbox-group component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @since 216
 */
export default class LightningCheckboxGroup extends Element {
    @api value;
    @api label;
    @api options;
}