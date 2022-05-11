import { keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement } from 'lwc';
import { LABELS } from './fieldInputBoxLabels';

const { withKeyboardInteractions } = keyboardInteractionUtils;

const selectors = {};

export default class FieldInputBox extends withKeyboardInteractions(LightningElement) {
    dom = lwcUtils.createDomProxy(this, selectors);

    labels = LABELS;
    searchText: string | undefined;

    getKeyboardInteractions() {
        return [];
    }
    handleKeyChange(evt) {
        this.searchText = evt.target.value;
    }
}
