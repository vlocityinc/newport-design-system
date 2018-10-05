import {createElement} from 'lwc';
import ResourcedTextarea from '../resourcedTextarea';
import { getShadowRoot } from 'lwc-test-utils';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';

const label = 'Help Text';
const changeEventName = 'change';
const itemText = '{!var}';
const resourcePickerVal = 'initialValue';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-resourced-textarea', {
        is: ResourcedTextarea
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockResolvedValue([]),
    };
});

const selectors = {
    label: 'label',
    abbr: 'abbr',
    textarea: 'textarea',
    ferovResourcePicker: 'builder_platform_interaction-ferov-resource-picker'
};

describe('Resourced text area label', () => {
    it('Should have the asterisk when required', () => {
        const element = createComponentUnderTest({required: true, label});
        const fullLabel = getShadowRoot(element).querySelector(selectors.label);
        expect(fullLabel.textContent).toMatch(label);
        const asterisk = fullLabel.querySelector(selectors.abbr);
        expect(asterisk.textContent).toMatch('*');
    });
    it('Should not have the asterisk when not required', () => {
        const element = createComponentUnderTest({required: false, label});
        const fullLabel = getShadowRoot(element).querySelector(selectors.label);
        expect(fullLabel.textContent).toMatch(label);
        const asterisk = fullLabel.querySelector(selectors.abbr);
        expect(asterisk).toBeFalsy();
    });
});

function verifyItemInsertion(existingText, selectionStart, selectionEnd, expectedFinalText, expectedFinalCursorPosition) {
    const element = createComponentUnderTest({value: existingText});
    const textarea = getShadowRoot(element).querySelector(selectors.textarea);
    textarea.setSelectionRange(selectionStart, selectionEnd);
    const ferovResourcePicker = getShadowRoot(element).querySelector(selectors.ferovResourcePicker);
    const changeEventCallback = jest.fn();
    element.addEventListener(changeEventName, changeEventCallback);
    ferovResourcePicker.value = resourcePickerVal;
    const itemSelectedEvent = new CustomEvent('itemselected', {detail: {item: {displayText: itemText}}});
    ferovResourcePicker.dispatchEvent(itemSelectedEvent);
    return Promise.resolve().then(() => {
        expect(element.value).toBe(existingText);
        expect(textarea.value).toBe(expectedFinalText);
        expect(textarea.selectionStart).toBe(expectedFinalCursorPosition);
        expect(textarea.selectionEnd).toBe(expectedFinalCursorPosition);
        expect(ferovResourcePicker.value).toBeNull();
        expect(changeEventCallback).toHaveBeenCalled();
    });
}

describe('Item selection from the resource picker', () => {
    it('Should insert the item when there is no text', () => {
        return verifyItemInsertion('', 0, 0, itemText, itemText.length);
    });
    it('Should insert the item when the cursor is at the beginning of text', () => {
        const existingText = 'Sample Text';
        return verifyItemInsertion(existingText, 0, 0, itemText + existingText, itemText.length);
    });
    it('Should insert the item when the cursor is in the middle of text', () => {
        return verifyItemInsertion('Sample Text', 6, 6, 'Sample{!var} Text', 12);
    });
    it('Should insert the item when the cursor is at the end of text', () => {
        const existingText = 'Sample Text';
        const finalText = existingText + itemText;
        return verifyItemInsertion(existingText, existingText.length,
            existingText.length, finalText, finalText.length);
    });
    it('Should insert the item when the cursor is on a new line', () => {
        const existingText = 'Sample Text\n';
        const finalText = existingText + itemText;
        return verifyItemInsertion(existingText, existingText.length,
            existingText.length, finalText, finalText.length);
    });
    it('Should replace selected text with the inserted item', () => {
        const existingText = 'Sample Text';
        const finalText = 'Sample {!var}';
        return verifyItemInsertion(existingText, 7, existingText.length, finalText, finalText.length);
    });
    it('Should not do anything if it has a next item', () => {
        const existingText = 'Sample Text';
        const element = createComponentUnderTest({value: existingText});
        const textarea = getShadowRoot(element).querySelector(selectors.textarea);
        textarea.setSelectionRange(0, 0);
        const itemSelectedEvent2 = new CustomEvent('itemselected', {detail: {item: {hasNext: true}}});
        const ferovResourcePicker = getShadowRoot(element).querySelector(selectors.ferovResourcePicker);
        const changeEventCallback = jest.fn();
        element.addEventListener(changeEventName, changeEventCallback);
        ferovResourcePicker.value = resourcePickerVal;
        ferovResourcePicker.dispatchEvent(itemSelectedEvent2);
        return Promise.resolve().then(() => {
            expect(element.value).toBe(existingText);
            expect(textarea.value).toBe(existingText);
            expect(textarea.selectionStart).toBe(0);
            expect(textarea.selectionEnd).toBe(0);
            expect(ferovResourcePicker.value).toBe(resourcePickerVal);
            expect(changeEventCallback).not.toHaveBeenCalled();
        });
    });
});

describe('Events from the textarea', () => {
    let eventCallback;

    const expectValueChangedEventWithValue = (value, error) => {
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0]).toMatchObject({ detail: { value, error } });
    };

    beforeEach(async () => {
        eventCallback = jest.fn();
    });

    it('Should fire change event on blur', async () => {
        const resourcedTextarea = createComponentUnderTest({value: '1+1'});
        resourcedTextarea.addEventListener('change', eventCallback);

        const textarea = getShadowRoot(resourcedTextarea).querySelector(selectors.textarea);
        textarea.dispatchEvent(new CustomEvent('blur'));
        await Promise.resolve();
        expectValueChangedEventWithValue('1+1', null);
    });

    it('Should fire change event on blur with validation errors', async () => {
        const resourcedTextarea = createComponentUnderTest({value: '{!unknownMergeField}'});
        resourcedTextarea.addEventListener('change', eventCallback);

        const validationError = {
            errorType : 'errorType',
            message : 'errorMessage',
            startIndex : 0,
            endIndex : 0
        };
        validateTextWithMergeFields.mockResolvedValue([validationError]);

        const textarea = getShadowRoot(resourcedTextarea).querySelector(selectors.textarea);
        textarea.dispatchEvent(new CustomEvent('blur'));
        await Promise.resolve();
        expectValueChangedEventWithValue('{!unknownMergeField}', validationError.message);
    });
});