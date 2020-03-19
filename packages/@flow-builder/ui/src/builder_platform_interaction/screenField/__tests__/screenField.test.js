import { createElement } from 'lwc';
import ScreenField from '../screenField';
import { createTestScreenField, SCREEN_NO_DEF_VALUE, ticks } from 'builder_platform_interaction/builderTestUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import * as contextLibMock from 'builder_platform_interaction/contextLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements))
    };
});

jest.mock('builder_platform_interaction/contextLib', () => {
    return Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
        orgHasFlowScreenSections: jest.fn()
    });
});

const SELECTORS = {
    INPUT_FIELD: 'builder_platform_interaction-screen-input-field',
    TEXT_AREA_FIELD: 'builder_platform_interaction-screen-textarea-field',
    DISPLAY_FIELD: 'builder_platform_interaction-screen-display-text-field',
    SCREEN_FIELD_CARD: 'builder_platform_interaction-screen-field-card',
    SECTION_FIELD: 'builder_platform_interaction-screen-section-field'
};

const emptyFieldName = '';
const fieldName = 'foo';

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-screen-field', {
        is: ScreenField
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

beforeAll(() => {
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    Store.resetStore();
});

describe('input screen field with no label', () => {
    let testScreenField;
    beforeEach(() => {
        const textBoxField = createTestScreenField(emptyFieldName, 'TextBox', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: textBoxField
        });
    });
    it('Placeholder label is used', async () => {
        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(SELECTORS.INPUT_FIELD);
        expect(renderedInputField).toBeDefined();
        expect(renderedInputField.label).toBe('[' + LABELS.fieldTypeLabelTextField + ']');
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
    it('Placeholder label is used', async () => {
        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(SELECTORS.TEXT_AREA_FIELD);
        expect(renderedInputField).toBeDefined();
        expect(renderedInputField.label).toBe('[' + LABELS.fieldTypeLabelLargeTextArea + ']');
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
    it('Actual label is used', async () => {
        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(SELECTORS.INPUT_FIELD);
        expect(renderedInputField).toBeDefined();
        expect(renderedInputField.label).toBe(fieldName);
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
    it('Actual label is used', async () => {
        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(SELECTORS.TEXT_AREA_FIELD);
        expect(renderedInputField).toBeDefined();
        expect(renderedInputField.label).toBe(fieldName);
    });
});

describe('display text screen field with errors', () => {
    it('displays an error card', async () => {
        const textAreaField = createTestScreenField(fieldName, 'DisplayText', 'Displayed text');
        textAreaField.fieldText.error = 'error';
        const testScreenField = createComponentUnderTest({
            screenfield: textAreaField
        });

        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(renderedInputField).toBeDefined();
        expect(renderedInputField.title).toBe('FlowBuilderScreenEditor.invalidScreenfield');
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
    it('Actual text is used is used', async () => {
        await ticks(1);
        const renderedField = testScreenField.shadowRoot.querySelector(SELECTORS.DISPLAY_FIELD);
        expect(renderedField).toBeDefined();
        expect(renderedField.value).toBe(displayText);
    });
});

describe('display text screen field with no text', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField(emptyFieldName, 'DisplayText', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Placeholder text is used', async () => {
        await ticks(1);
        const renderedField = testScreenField.shadowRoot.querySelector(SELECTORS.DISPLAY_FIELD);
        expect(renderedField).toBeDefined();
        expect(renderedField.value).toBe('[' + LABELS.fieldTypeLabelDisplayText + ']');
    });
});

describe('currency field with no default', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField(emptyFieldName, 'Currency', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('No default value is displayed', async () => {
        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(SELECTORS.INPUT_FIELD);
        expect(renderedInputField).toBeDefined();
        expect(renderedInputField.value).toBe('');
    });
});

describe('currency field with literal default', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField(emptyFieldName, 'Currency', 10);
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Literal default is displayed', async () => {
        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(SELECTORS.INPUT_FIELD);
        expect(renderedInputField).toBeDefined();
        expect(renderedInputField.value).toBe('10');
    });
});

describe('number field with no default', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField(emptyFieldName, 'Number', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('No default value is displayed', async () => {
        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(SELECTORS.INPUT_FIELD);
        expect(renderedInputField).toBeDefined();
        expect(renderedInputField.value).toBe('');
    });
});

describe('number field with literal default', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField(emptyFieldName, 'Number', 10);
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Literal default is displayed', async () => {
        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(SELECTORS.INPUT_FIELD);
        expect(renderedInputField).toBeDefined();
        expect(renderedInputField.value).toBe('10');
    });
});

describe('section field', () => {
    let testScreenField;
    beforeEach(() => {
        contextLibMock.orgHasFlowScreenSections.mockReturnValue(true);
        const sectionField = createTestScreenField('Section', 'Section');
        testScreenField = createComponentUnderTest({
            screenfield: sectionField
        });
    });
    it('Section preview is displayed', async () => {
        await ticks(1);
        const renderedSectionField = testScreenField.shadowRoot.querySelector(SELECTORS.SECTION_FIELD);
        expect(renderedSectionField).toBeDefined();
        expect(renderedSectionField.title).toBe('Section');
    });
});
// TODO - add tests where default value is a reference for each field type
