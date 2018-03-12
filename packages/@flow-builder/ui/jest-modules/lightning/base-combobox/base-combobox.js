import { Element,api } from 'engine';

export default class BaseCombobox extends Element {
    @api
    inputText;

    handleSelect(event) {
        // stop propagation since input.setSelectionRange triggers this with no value in test
        event.stopPropagation();
    }
}