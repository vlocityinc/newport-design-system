import {createElement} from 'lwc';
import RichTextEditor from "../resourcedRichTextEditor";
import { getShadowRoot } from 'lwc-test-utils';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-resourced-rich-text-editor', {
        is: RichTextEditor
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockReturnValue([]),
    };
});

jest.mock('../richTextConverter', () => {
    return {
        convertHTMLToQuillHTML: (htmlText) => `<converted>${htmlText}</converted>`
    };
});

const selectors = {
    label: 'label',
    abbr: 'abbr',
    inputRichText: 'lightning-input-rich-text'
};

const getLabelElement = (richTextEditor) => {
    return getShadowRoot(richTextEditor).querySelector(selectors.label);
};

const getInputRichTextElement = (richTextEditor) => {
    return getShadowRoot(richTextEditor).querySelector(selectors.inputRichText);
};

describe('Rich Text Editor', () => {
    let richTextEditor;
    describe('label', () => {
        it('should have an asterisk when required', () => {
            richTextEditor = createComponentUnderTest({required: true, label : 'Help Text'});
            const labelElement = getLabelElement(richTextEditor);
            expect(labelElement.textContent).toMatch('Help Text');
            const abbrElement = labelElement.querySelector(selectors.abbr);
            expect(abbrElement.textContent).toBe('*');
        });
        it('should not have an asterisk when not required', () => {
            richTextEditor = createComponentUnderTest({required: false, label : 'Help Text'});
            const labelElement = getLabelElement(richTextEditor);
            expect(labelElement.textContent).toMatch('Help Text');
            const abbrElement = labelElement.querySelector(selectors.abbr);
            expect(abbrElement).toBeNull();
        });
    });
    describe('events', () => {
        let eventCallback;
        const expectValueChangedEventWithValue = (value, error = null) => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({ value, error });
        };
        const fireChangeEvent = (element, value) => {
            element.dispatchEvent(new CustomEvent('change', {detail: {value}}));
        };
        beforeEach(() => {
            eventCallback = jest.fn();
        });
        it('Should convert the html to quill html on first change event', () => {
            // Given
            const htmlText = '<li>first</li><li>second</li>';
            richTextEditor = createComponentUnderTest({value: htmlText});
            const inputRichTextElement = getInputRichTextElement(richTextEditor);
            richTextEditor.addEventListener('change', eventCallback);

            // When we click on a non-empty lightning-input-rich-text, a change event is fired
            fireChangeEvent(inputRichTextElement, htmlText);

            // Then
            expectValueChangedEventWithValue(`<converted>${htmlText}</converted>`, null);
        });
        it('Should fire change event on change when html text is empty', () => {
            const htmlText = '';
            richTextEditor = createComponentUnderTest({value: htmlText});
            const inputRichTextElement = getInputRichTextElement(richTextEditor);
            richTextEditor.addEventListener('change', eventCallback);

            // When we click on an empty lightning-input-rich-text, no change event is fired
            // A change event is fired when we modify text
            fireChangeEvent(inputRichTextElement, 'a');

            // Then
            expectValueChangedEventWithValue('a', null);
        });
        it('Should fire change event on change', () => {
            // Given
            richTextEditor = createComponentUnderTest({value: '<p>hello</p>'});
            const inputRichTextElement = getInputRichTextElement(richTextEditor);
            fireChangeEvent(inputRichTextElement, '<p>hello</p>');
            richTextEditor.addEventListener('change', eventCallback);
            validateTextWithMergeFields.mockReturnValue([]);

            // When
            fireChangeEvent(inputRichTextElement, '<p>hello <b>world</b></p>');

            // Then
            expectValueChangedEventWithValue('<p>hello <b>world</b></p>', null);
        });
        it('Should fire change event on change with validation errors', () => {
            // Given
            richTextEditor = createComponentUnderTest({value: ''});
            const inputRichTextElement = getInputRichTextElement(richTextEditor);
            fireChangeEvent(inputRichTextElement, '');
            richTextEditor.addEventListener('change', eventCallback);
            const validationError = {
                errorType : 'unknownMergeField',
                message : 'The "unknownMergeField" resource doesn\'t exist in this flow.'
            };
            validateTextWithMergeFields.mockReturnValue([validationError]);

            // When
            fireChangeEvent(inputRichTextElement, '{!unknownMergeField}');

            // Then
            expectValueChangedEventWithValue('{!unknownMergeField}', validationError.message);
        });
    });
});