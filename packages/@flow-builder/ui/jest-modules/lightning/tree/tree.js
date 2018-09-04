import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning tree component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class LightningTree extends LightningElement {
    @api items;
}
