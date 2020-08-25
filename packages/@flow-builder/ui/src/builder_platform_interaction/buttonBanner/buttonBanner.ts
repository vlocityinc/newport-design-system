// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';

const { logInteraction } = loggingUtils;

export default class ButtonBanner extends LightningElement {
    @api
    link;

    @api
    label;

    handleClick() {
        logInteraction('app-exchange-button', 'left-panel', null, 'click');
    }
}
