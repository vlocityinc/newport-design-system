import { createElement } from 'lwc';
import FormulaTextarea from '../formula-textarea';
import { ValueChangedEvent } from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';
import { validateTextWithMergeFields } from 'builder_platform_interaction-merge-field-lib';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-formula-textarea', { is: FormulaTextarea });
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction-merge-field-lib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockResolvedValue([]),
    };
});

describe('Formula textarea', () => {
    let formulaTextareaComponent;
    let textareaComponent;
    beforeEach(() => {
        formulaTextareaComponent = createComponentUnderTest();
        textareaComponent = getShadowRoot(formulaTextareaComponent).querySelector('lightning-textarea');
    });
    describe('Events', () => {
        let eventCallback;
        const expectValueChangedEventWithValue = (value, error) => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({ detail: { value, error } });
        };
        beforeEach(async () => {
            eventCallback = jest.fn();
            formulaTextareaComponent.addEventListener(ValueChangedEvent.EVENT_NAME, eventCallback);
        });
        it('fires valueChanged event on focusout', async () => {
            textareaComponent.mockUserInput('1+1');
            textareaComponent.dispatchEvent(new CustomEvent('focusout'));
            await Promise.resolve();
            expectValueChangedEventWithValue('1+1', null);
        });
        it('fires valueChanged event on focusout with validation errors', async () => {
            // Given
            const validationError = {
                errorType : 'errorType',
                message : 'errorMessage',
                startIndex : 0,
                endIndex : 0
            };
            validateTextWithMergeFields.mockResolvedValue([validationError]);

            // When
            textareaComponent.mockUserInput('{!unknownMergeField}');
            textareaComponent.dispatchEvent(new CustomEvent('focusout'));
            await Promise.resolve();

            // Then
            expectValueChangedEventWithValue('{!unknownMergeField}', [validationError]);
        });
    });
});