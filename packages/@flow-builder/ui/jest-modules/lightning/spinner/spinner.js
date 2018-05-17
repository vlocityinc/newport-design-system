import { Element, api } from 'engine';

/**
 * Dummy lightning spinner component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @since 216
 */
export default class LightningSpinner extends Element {
    @api alternativeText;
    @api size = 'medium';
    @api variant;
}