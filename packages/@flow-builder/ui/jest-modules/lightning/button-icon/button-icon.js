import { Element, api } from 'engine';

/**
 * Dummy lightning button component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */
export default class LightningButtonIcon extends Element {
    @api alternativeText;
    @api iconName;
    @api size = 'small';
    @api variant;
    @api disabled;
}
