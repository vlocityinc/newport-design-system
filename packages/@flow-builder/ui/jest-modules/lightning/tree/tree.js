import { Element, api } from 'engine';

/**
 * Dummy lightning tree component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class LightningTree extends Element {
    @api items;
}
