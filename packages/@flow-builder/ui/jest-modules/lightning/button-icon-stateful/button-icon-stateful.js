import { Element, api } from 'engine';

/**
 * Dummy lightning button icon stateful component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 216
 */
export default class LightningButtonIcon extends Element {
    @api alternativeText;
    @api selected;
    @api variant;
    @api iconName;
    @api id;
    @api title;
}