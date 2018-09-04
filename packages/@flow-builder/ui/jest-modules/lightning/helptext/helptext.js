import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning helptext component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Aaron Liebling
 * @since 216
 */
export default class LightningHelpText extends LightningElement {
    @api content;
}
