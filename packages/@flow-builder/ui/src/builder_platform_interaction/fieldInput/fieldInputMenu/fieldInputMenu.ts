import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement } from 'lwc';

const { withKeyboardInteractions } = keyboardInteractionUtils;

const selectors = {};

export default class FieldInputMenu extends withKeyboardInteractions(LightningElement) {
    dom = lwcUtils.createDomProxy(this, selectors);

    sections = [];

    getKeyboardInteractions() {
        return [];
    }
}
