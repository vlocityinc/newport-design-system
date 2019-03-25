import {createElement} from 'lwc';
import RichTextEditor from "../resourcedRichTextEditor";
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';

jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-resourced-rich-text-editor', {
        is: RichTextEditor
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

const focusoutEvent = new FocusEvent('focusout', {
    'bubbles'   : true,
    'cancelable': true,
});

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

const SELECTORS = {
    SPAN_LABEL: 'span.slds-form-element__label',
    ABBR: 'abbr',
    DIV_PARENT_INPUT_RICH_TEXT_FEROV_PICKER: '.container.slds-grid.slds-grid_vertical',
    INPUT_RICH_TEXT: 'lightning-input-rich-text',
    FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker'
};

const getChildElement = ({shadowRoot : richTextEditorShadowRoot}, selector) => richTextEditorShadowRoot.querySelector(selector);

describe('Rich Text Editor', () => {
    let richTextEditor;
    describe('label', () => {
        it('should have an asterisk when required', () => {
            richTextEditor = createComponentUnderTest({required: true, label : 'Help Text'});
            const spanLabelElement = getChildElement(richTextEditor, SELECTORS.SPAN_LABEL);
            expect(spanLabelElement.textContent).toMatch('Help Text');
            const abbrElement = spanLabelElement.querySelector(SELECTORS.ABBR);
            expect(abbrElement.textContent).toBe('*');
        });
        it('should not have an asterisk when not required', () => {
            richTextEditor = createComponentUnderTest({required: false, label : 'Help Text'});
            const spanLabelElement = getChildElement(richTextEditor, SELECTORS.SPAN_LABEL);
            expect(spanLabelElement.textContent).toMatch('Help Text');
            const abbrElement = spanLabelElement.querySelector(SELECTORS.ABBR);
            expect(abbrElement).toBeNull();
        });
        it("accessibility (ariaLabelledBy attribute reflecting label id on parent div of ferov resources picker and input rich text)", () => {
            richTextEditor = createComponentUnderTest({required: true, label : 'Help Text'});
            const labelElementIdAttribute = getChildElement(richTextEditor, SELECTORS.SPAN_LABEL).id;
            const divParentInputRichTextFerovPicker = getChildElement(richTextEditor, SELECTORS.DIV_PARENT_INPUT_RICH_TEXT_FEROV_PICKER);
            expect(divParentInputRichTextFerovPicker.ariaLabelledBy).toBe(labelElementIdAttribute);
        });
    });
    describe('before Rich Text Editor activation', () => {
        it('replaces new lines with <br />, as is done at runtime', () => {
            const htmlText = 'first line\nsecond line';
            richTextEditor = createComponentUnderTest({value: htmlText});
            const inputRichTextElement = getChildElement(richTextEditor, SELECTORS.INPUT_RICH_TEXT);
            expect(inputRichTextElement.value).toBe('first line<br />second line');
            expect(richTextEditor.value).toBe(htmlText);
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
        describe('when Rich Text Editor is activated', () => {
            it('replaces new lines with <br />, as is done at runtime on first change event', () => {
                // Given
                const htmlText = 'first line\nsecond line';
                richTextEditor = createComponentUnderTest({value: htmlText});
                const inputRichTextElement = getChildElement(richTextEditor, SELECTORS.INPUT_RICH_TEXT);
                richTextEditor.addEventListener('change', eventCallback);

                // When we click on a non-empty lightning-input-rich-text, a change event is fired
                fireChangeEvent(inputRichTextElement, htmlText);

                // Then
                expectValueChangedEventWithValue(`<converted>first line<br />second line</converted>`, null);
            });
            it('Should convert the html to quill html on first change event', () => {
                // Given
                const htmlText = '<li>first</li><li>second</li>';
                richTextEditor = createComponentUnderTest({value: htmlText});
                const inputRichTextElement = getChildElement(richTextEditor, SELECTORS.INPUT_RICH_TEXT);
                richTextEditor.addEventListener('change', eventCallback);

                // When we click on a non-empty lightning-input-rich-text, a change event is fired
                fireChangeEvent(inputRichTextElement, htmlText);

                // Then
                expectValueChangedEventWithValue(`<converted>${htmlText}</converted>`, null);
            });
        });
        it('Should fire change event on change when value is empty', () => {
            const htmlText = '';
            richTextEditor = createComponentUnderTest({value: htmlText});
            const inputRichTextElement = getChildElement(richTextEditor, SELECTORS.INPUT_RICH_TEXT);
            richTextEditor.addEventListener('change', eventCallback);

            // When we click on an empty lightning-input-rich-text, no change event is fired
            // A change event is fired when we modify text
            fireChangeEvent(inputRichTextElement, 'a');

            // Then
            expectValueChangedEventWithValue('a', null);
        });
        it('Should fire change event on change when value is null', () => {
            const htmlText = null;
            richTextEditor = createComponentUnderTest({value: htmlText});
            const inputRichTextElement = getChildElement(richTextEditor, SELECTORS.INPUT_RICH_TEXT);
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
            const inputRichTextElement = getChildElement(richTextEditor, SELECTORS.INPUT_RICH_TEXT);
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
            const inputRichTextElement = getChildElement(richTextEditor, SELECTORS.INPUT_RICH_TEXT);
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
    describe('Resource picker', () => {
        let inputRichTextElement;
        let resourcePicker;
        beforeEach(() => {
            richTextEditor = createComponentUnderTest({value: 'the existing text'});
            inputRichTextElement = getChildElement(richTextEditor, SELECTORS.INPUT_RICH_TEXT);
            resourcePicker = getChildElement(richTextEditor, SELECTORS.FEROV_RESOURCE_PICKER);
        });
        it('Should insert corresponding merge field in the text when an item is selected', () => {
            const itemSelectedEvent = new CustomEvent('itemselected', {detail: {item: {displayText: '{$Flow.CurrentDate}'}}});
            resourcePicker.dispatchEvent(itemSelectedEvent);
            return Promise.resolve().then(() => {
                expect(inputRichTextElement.insertTextAtCursor).toHaveBeenCalledWith('{$Flow.CurrentDate}');
            });
        });
        it('Should reset value on focusout', () => {
            resourcePicker.value = "";
            resourcePicker.dispatchEvent(focusoutEvent);
            return Promise.resolve().then(() => {
                expect(resourcePicker.value).toBeNull();
            });
        });
    });
});