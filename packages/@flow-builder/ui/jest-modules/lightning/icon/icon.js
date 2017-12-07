import { Element } from 'engine';

/**
 * Dummy lightning icon component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class LightningIcon extends Element {
    @api alternativeText;
    @api iconName;
    @api size = 'medium';
    @api variant;
}
