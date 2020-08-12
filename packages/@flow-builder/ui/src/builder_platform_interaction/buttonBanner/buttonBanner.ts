// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { loggingUtils } from '@flow-builder/common-utils';

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
