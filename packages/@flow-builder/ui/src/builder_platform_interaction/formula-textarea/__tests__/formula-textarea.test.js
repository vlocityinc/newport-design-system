import { createElement } from 'engine';
import FormulaTextarea from '../formula-textarea';
import { ValueChangedEvent } from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-formula-textarea', { is: FormulaTextarea });
    document.body.appendChild(el);
    return el;
};

describe('Formula textarea', () => {
    let formulaTextareaComponent;
    let textareaComponent;
    beforeEach(() => {
        formulaTextareaComponent = createComponentUnderTest();
        textareaComponent = getShadowRoot(formulaTextareaComponent).querySelector('lightning-textarea');
    });
    describe('Events', () => {
        let eventCallback;
        const expectValueChangedEventWithValue = (value) => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({ detail: { value } });
        };
        beforeEach(async () => {
            eventCallback = jest.fn();
            formulaTextareaComponent.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
        });
        it('fires valueChanged event on blur when scale is changed', async () => {
            textareaComponent.mockUserInput('1+1');
            textareaComponent.dispatchEvent(new CustomEvent('focusout'));
            await Promise.resolve();
            expectValueChangedEventWithValue('1+1');
        });
    });
});