import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';

const { withKeyboardInteractions } = keyboardInteractionUtils;

export default class FieldInputMenuSection extends withKeyboardInteractions(LightningElement) {
    @api section;

    // TODO: a11y support will be done as part of another PR
    getKeyboardInteractions() {
        return [];
    }
}
