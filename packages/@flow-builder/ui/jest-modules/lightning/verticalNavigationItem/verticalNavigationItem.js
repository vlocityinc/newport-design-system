import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning vertical navigation item component for use by Jest tests
 *
 * @ScrumTeam Action
 * @since 220
 */
export default class VerticalNavigationItem extends LightningElement {
    @api name;
    @api label;
}