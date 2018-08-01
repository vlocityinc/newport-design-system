import { createElement } from 'engine';
import ScreenField from '../screen-field';
import { createTestScreenField, SCREEN_NO_DEF_VALUE } from 'builder_platform_interaction-builder-test-utils';
import { getShadowRoot } from 'lwc-test-utils';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const SELECTORS = {
    INPUT_FIELD: 'builder_platform_interaction-screen-input-field',
    TEXT_AREA_FIELD: 'builder_platform_interaction-screen-textarea-field',
    DISPLAY_FIELD: 'builder_platform_interaction-screen-display-text-field'
};

const emptyFieldName = '';
const fieldName = 'foo';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-field', {
        is: ScreenField
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('input screen field with no label', () => {
    let testScreenField;
    beforeEach(() => {
        const textBoxField = createTestScreenField(emptyFieldName, 'TextBox', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: textBoxField
        });
    });
    it('Placeholder label is used', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.INPUT_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.label).toBe('[' + LABELS.fieldTypeLabelTextField + ']');
        });
    });
});

describe('text area screen field with no label', () => {
    let testScreenField;
    beforeEach(() => {
        const textAreaField = createTestScreenField(emptyFieldName, 'LargeTextArea', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: textAreaField
        });
    });
    it('Placeholder label is used', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.TEXT_AREA_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.label).toBe('[' + LABELS.fieldTypeLabelLargeTextArea + ']');
        });
    });
});

describe('input screen field with a label', () => {
    let testScreenField;
    beforeEach(() => {
        const textAreaField = createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: textAreaField
        });
    });
    it('Actual label is used', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.INPUT_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.label).toBe(fieldName);
        });
    });
});

describe('text area screen field with a label', () => {
    let testScreenField;
    beforeEach(() => {
        const textAreaField = createTestScreenField(fieldName, 'LargeTextArea', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: textAreaField
        });
    });
    it('Actual label is used', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.TEXT_AREA_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.label).toBe(fieldName);
        });
    });
});

describe('display text screen field with text', () => {
    const displayText = 'show this';
    let testScreenField;
    beforeEach(() => {
        const textAreaField = createTestScreenField(fieldName, 'DisplayText', displayText);
        testScreenField = createComponentUnderTest({
            screenfield: textAreaField
        });
    });
    it('Actual text is used is used', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.DISPLAY_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.value).toBe(displayText);
        });
    });
});

describe('display text screen field with no text', () => {
    let testScreenField;
    beforeEach(() => {
        const textAreaField = createTestScreenField(emptyFieldName, 'DisplayText', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: textAreaField
        });
    });
    it('Placeholder text is used', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.DISPLAY_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.value).toBe('[' + LABELS.fieldTypeLabelDisplayText + ']');
        });
    });
});
