// @ts-nocheck
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';

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
