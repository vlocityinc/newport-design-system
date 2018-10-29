import { createElement } from 'lwc';
import ScreenField from "../screenField";
import { createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { getShadowRoot } from 'lwc-test-utils';
import { createScreenField } from "builder_platform_interaction/elementFactory";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const SELECTORS = {
    INPUT_FIELD: 'builder_platform_interaction-screen-input-field',
    TEXT_AREA_FIELD: 'builder_platform_interaction-screen-textarea-field',
    DISPLAY_FIELD: 'builder_platform_interaction-screen-display-text-field',
    SCREEN_FIELD_CARD: 'builder_platform_interaction-screen-field-card'
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

const createAndMutateField = (name, fieldType, defaultValue, config) => {
    const field = createTestScreenField(name, fieldType, defaultValue, config);

    // TODO - As part of W-5483251, we can remove this call. Once test builder utils
    // are updated to use elementFactory, we won't need this.
    const mutatedField = createScreenField(field);
    return mutatedField;
};

describe('input screen field with no label', () => {
    let testScreenField;
    beforeEach(() => {
        const textBoxField = createAndMutateField(emptyFieldName, 'TextBox', SCREEN_NO_DEF_VALUE);
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
        const textAreaField = createAndMutateField(emptyFieldName, 'LargeTextArea', SCREEN_NO_DEF_VALUE);
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
        const textAreaField = createAndMutateField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE);
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
        const textAreaField = createAndMutateField(fieldName, 'LargeTextArea', SCREEN_NO_DEF_VALUE);
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

describe('display text screen field with errors', () => {
    it('displays an error card', () => {
        const textAreaField = createAndMutateField(fieldName, 'DisplayText', 'Displayed text');
        textAreaField.fieldText.error = 'error';
        const testScreenField = createComponentUnderTest({
            screenfield: textAreaField
        });

        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.SCREEN_FIELD_CARD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.title).toBe('FlowBuilderScreenEditor.invalidScreenfield');
        });
    });
});

describe('display text screen field with text', () => {
    const displayText = 'show this';
    let testScreenField;
    beforeEach(() => {
        const textAreaField = createAndMutateField(fieldName, 'DisplayText', displayText);
        testScreenField = createComponentUnderTest({
            screenfield: textAreaField
        });
    });
    it('Actual text is used is used', () => {
        return Promise.resolve().then(() => {
            const renderedField = getShadowRoot(testScreenField).querySelector(SELECTORS.DISPLAY_FIELD);
            expect(renderedField).toBeDefined();
            expect(renderedField.value).toBe(displayText);
        });
    });
});

describe('display text screen field with no text', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createAndMutateField(emptyFieldName, 'DisplayText', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Placeholder text is used', () => {
        return Promise.resolve().then(() => {
            const renderedField = getShadowRoot(testScreenField).querySelector(SELECTORS.DISPLAY_FIELD);
            expect(renderedField).toBeDefined();
            expect(renderedField.value).toBe('[' + LABELS.fieldTypeLabelDisplayText + ']');
        });
    });
});

describe('currency field with no default', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createAndMutateField(emptyFieldName, 'Currency', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('No default value is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.INPUT_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.value).not.toBeDefined();
        });
    });
});


describe('currency field with literal default', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createAndMutateField(emptyFieldName, 'Currency', 10, {defaultValueFerovProcess: true});
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Literal default is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.INPUT_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.value).toBe('10');
        });
    });
});

describe('number field with no default', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createAndMutateField(emptyFieldName, 'Number', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('No default value is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.INPUT_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.value).not.toBeDefined();
        });
    });
});


describe('number field with literal default', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createAndMutateField(emptyFieldName, 'Number', 10, {defaultValueFerovProcess: true});
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Literal default is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedInputField = getShadowRoot(testScreenField).querySelector(SELECTORS.INPUT_FIELD);
            expect(renderedInputField).toBeDefined();
            expect(renderedInputField.value).toBe('10');
        });
    });
});

// TODO - add tests where default value is a reference for each field type


