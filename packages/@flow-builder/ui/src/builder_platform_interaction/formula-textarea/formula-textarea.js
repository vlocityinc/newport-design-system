import { Element, api, track } from 'engine';
import { ValueChangedEvent } from 'builder_platform_interaction-events';
import { LABELS } from './formula-textarea-labels';

const SELECTORS = {
    TEXTAREA: 'lightning-textarea',
};

export default class FormulaTextarea extends Element {
    labels = LABELS;

    @track
    state = {
        expression : '',
        error : null
    }

    @api
    set expression(value) {
        this.state.expression = value;
    }

    @api
    get expression() {
        return this.state.expression;
    }

    @api
    get error() {
        return this.state.error;
    }

    @api
    set error(value) {
        this.state.error = value;
        const textarea = this.getTextArea();
        if (textarea) {
            if (this.state.error) {
                textarea.setCustomValidity(this.state.error);
                textarea.showHelpMessageIfInvalid();
            } else {
                textarea.setCustomValidity('');
            }
        }
    }

    getTextArea() {
        return this.template.querySelector(SELECTORS.TEXTAREA);
    }

    handleTextareaFocusOut(event) {
        const value = event.target.value;
        this.state.expression = value;
        const valueChangedEvent = new ValueChangedEvent(this.state.expression);
        this.dispatchEvent(valueChangedEvent);
    }
}