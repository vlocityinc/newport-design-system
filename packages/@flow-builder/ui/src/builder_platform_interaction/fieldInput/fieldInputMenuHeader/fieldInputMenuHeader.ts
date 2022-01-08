import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement } from 'lwc';

const { withKeyboardInteractions } = keyboardInteractionUtils;

const selectors = {};

export default class FieldInputMenuHeader extends withKeyboardInteractions(LightningElement) {
    dom = lwcUtils.createDomProxy(this, selectors);

    getKeyboardInteractions() {
        return [];
    }
}
