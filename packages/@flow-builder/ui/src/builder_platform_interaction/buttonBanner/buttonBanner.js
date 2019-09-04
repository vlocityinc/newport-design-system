import { LightningElement, api } from 'lwc';
import { logInteraction } from 'builder_platform_interaction/loggingUtils';

export default class ButtonBanner extends LightningElement {
    @api
    link;

    @api
    label;

    handleClick() {
        logInteraction('app-exchange-button', 'left-panel', null, 'click');
    }
}
