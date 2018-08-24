import {createElement} from 'lwc';
import ScreenTextAreaPropertyField from '../resourced-textarea';
import { getShadowRoot } from 'lwc-test-utils';

const label = 'Help Text';
const changeEventName = 'change';
const itemText = '{!var}';
const resourcePickerVal = 'initialValue';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-resourced-textarea', {
        is: ScreenTextAreaPropertyField
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

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
        expect(element.value).toBe(expectedFinalText);
        expect(textarea.value).toBe(expectedFinalText);
        expect(textarea.selectionStart).toBe(expectedFinalCursorPosition);
        expect(textarea.selectionEnd).toBe(expectedFinalCursorPosition);
        expect(ferovResourcePicker.value).toBeNull();
        expect(changeEventCallback).toHaveBeenCalled();
    });
}

describe('Item selection from the resource picker', () => {
    it('Should insert the item when there is no text', () => {
        verifyItemInsertion('', 0, 0, itemText, itemText.length);
    });
    it('Should insert the item when the cursor is at the beginning of text', () => {
        const existingText = 'Sample Text';
        verifyItemInsertion(existingText, 0, 0, itemText + existingText, itemText.length);
    });
    it('Should insert the item when the cursor is in the middle of text', () => {
        verifyItemInsertion('Sample Text', 6, 6, 'Sample{!var} Text', 12);
    });
    it('Should insert the item when the cursor is at the end of text', () => {
        const existingText = 'Sample Text';
        const finalText = existingText + itemText;
        verifyItemInsertion(existingText, existingText.length,
            existingText.length, finalText, finalText.length);
    });
    it('Should insert the item when the cursor is on a new line', () => {
        const existingText = 'Sample Text\n';
        const finalText = existingText + itemText;
        verifyItemInsertion(existingText, existingText.length,
            existingText.length, finalText, finalText.length);
    });
    it('Should replace selected text with the inserted item', () => {
        const existingText = 'Sample Text';
        const finalText = 'Sample {!var}';
        verifyItemInsertion(existingText, 7, existingText.length, finalText, finalText.length);
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