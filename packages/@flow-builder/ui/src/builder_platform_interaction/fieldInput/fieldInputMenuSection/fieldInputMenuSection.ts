import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';

const { withKeyboardInteractions } = keyboardInteractionUtils;

const selectors = {};

export default class FieldInputMenuSection extends withKeyboardInteractions(LightningElement) {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api section;

    getKeyboardInteractions() {
        return [];
    }
}
