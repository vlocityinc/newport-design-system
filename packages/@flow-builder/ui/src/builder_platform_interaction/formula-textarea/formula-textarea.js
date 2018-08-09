import { Element, api, track } from 'engine';
import { ValueChangedEvent } from 'builder_platform_interaction-events';
import { LABELS } from './formula-textarea-labels';
import { validateTextWithMergeFields } from 'builder_platform_interaction-merge-field-lib';

const SELECTORS = {
    TEXTAREA: 'lightning-textarea',
};

export default class FormulaTextarea extends Element {
    labels = LABELS;

    @track
    state = {
        expression : '',
        error : null,
        spinnerActive : false
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
            textarea.setCustomValidity(this.state.error ? this.state.error : '');
            textarea.showHelpMessageIfInvalid();
        }
    }

    getTextArea() {
        return this.template.querySelector(SELECTORS.TEXTAREA);
    }

    handleTextareaFocusOut(event) {
        const value = event.target.value;
        this.state.expression = value;
        this.state.spinnerActive = true;
        validateTextWithMergeFields(value, { allowGlobalConstants : false }).then(errors => {
            this.state.spinnerActive = false;
            this.state.expression = value;
            const valueChangedEvent = errors.length === 0 ? new ValueChangedEvent(this.state.expression) : new ValueChangedEvent(this.state.expression, errors);
            this.dispatchEvent(valueChangedEvent);
        });
    }
}