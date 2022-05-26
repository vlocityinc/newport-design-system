import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';

const { withKeyboardInteractions } = keyboardInteractionUtils;

const selectors = {};

export default class FieldInputBoxPill extends withKeyboardInteractions(LightningElement) {
    static delegatesFocus = true;

    dom = lwcUtils.createDomProxy(this, selectors);

    @api label?: string;
    @api iconName?: string;

    getKeyboardInteractions() {
        return [];
    }
}
