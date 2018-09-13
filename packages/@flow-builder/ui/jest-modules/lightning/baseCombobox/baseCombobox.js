import { LightningElement,api } from 'lwc';

export default class BaseCombobox extends LightningElement {
    @api
    inputText;

    handleSelect(event) {
        // stop propagation since input.setSelectionRange triggers this with no value in test
        event.stopPropagation();
    }
}