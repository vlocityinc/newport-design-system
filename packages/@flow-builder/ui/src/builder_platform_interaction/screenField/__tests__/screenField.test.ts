import { createElement } from 'lwc';
import ScreenField from '../screenField';
import {
    createTestScreenField,
    SCREEN_NO_DEF_VALUE,
    setDocumentBodyChildren,
    ticks,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { accountSObjectVariable, flowWithAllElementsUIModel } from 'mock/storeData';
import { createAutomaticField } from 'builder_platform_interaction/elementFactory';
import { ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/contextLib', () => require('builder_platform_interaction_mocks/contextLib'));

jest.mock('builder_platform_interaction/sobjectLib', () => ({
    getFieldsForEntity: jest.fn().mockImplementation(() => mockAccountFields)
}));

const emptyFieldName = '';
const fieldName = 'foo';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-field', {
        is: ScreenField
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

beforeAll(() => {
    // @ts-ignore
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    // @ts-ignore
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
        const renderedInputField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_INPUT_FIELD
        );
        expect(renderedInputField).not.toEqual(null);
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
        const textAreaField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_TEXT_AREA_FIELD
        );
        expect(textAreaField).not.toEqual(null);
        expect(textAreaField.label).toBe('[' + LABELS.fieldTypeLabelLargeTextArea + ']');
    });
});

describe('input screen field with a label', () => {
    let testScreenField;
    beforeEach(() => {
        const textBoxField = createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE);
        testScreenField = createComponentUnderTest({
            screenfield: textBoxField
        });
    });
    it('Actual label is used', async () => {
        await ticks(1);
        const renderedInputField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_INPUT_FIELD
        );
        expect(renderedInputField).not.toEqual(null);
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
        const textAreaField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_TEXT_AREA_FIELD
        );
        expect(textAreaField).not.toEqual(null);
        expect(textAreaField.label).toBe(fieldName);
    });
});

describe('display text screen field with errors', () => {
    it('displays an error card', async () => {
        const displayTextField = createTestScreenField(fieldName, 'DisplayText', 'Displayed text');
        displayTextField.fieldText.error = 'error';
        const testScreenField = createComponentUnderTest({
            screenfield: displayTextField
        });

        await ticks(1);
        const renderedFieldCard = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_FIELD_CARD
        );
        expect(renderedFieldCard).not.toEqual(null);
        expect(renderedFieldCard.title).toBe('FlowBuilderScreenEditor.invalidScreenfield');
    });
});

describe('display text screen field with text', () => {
    const displayText = 'show this';
    let testScreenField;
    beforeEach(() => {
        const displayTextField = createTestScreenField(fieldName, 'DisplayText', displayText);
        testScreenField = createComponentUnderTest({
            screenfield: displayTextField
        });
    });
    it('Actual text is used is used', async () => {
        await ticks(1);
        const renderedField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_DISPLAY_FIELD
        );
        expect(renderedField).not.toEqual(null);
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
        const renderedField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_DISPLAY_FIELD
        );
        expect(renderedField).not.toEqual(null);
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
        const renderedInputField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_INPUT_FIELD
        );
        expect(renderedInputField).not.toEqual(null);
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
        const renderedInputField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_INPUT_FIELD
        );
        expect(renderedInputField).not.toEqual(null);
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
        const renderedInputField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_INPUT_FIELD
        );
        expect(renderedInputField).not.toEqual(null);
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
        const renderedInputField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_INPUT_FIELD
        );
        expect(renderedInputField).not.toEqual(null);
        expect(renderedInputField.value).toBe('10');
    });
});

describe('section field', () => {
    let testScreenField;
    beforeEach(() => {
        const sectionField = createTestScreenField('Section', 'Section');
        testScreenField = createComponentUnderTest({
            screenfield: sectionField
        });
    });
    it('Section preview is displayed', async () => {
        await ticks(1);
        const renderedSectionField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_SECTION_FIELD
        );
        expect(renderedSectionField).not.toEqual(null);
        expect(renderedSectionField.title).toBe('Section');
    });
});

describe('automatic fields', () => {
    it('shows Text field as an input field with expected values', () => {
        const automaticField = createAutomaticField(ScreenFieldName.TextBox, `${accountSObjectVariable.name}.Name`);
        const testScreenField = createComponentUnderTest({
            screenfield: automaticField
        });
        const renderedField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_INPUT_FIELD
        );
        expect(renderedField.typeName).toEqual(ScreenFieldName.TextBox);
        expect(renderedField.required).toEqual(false);
    });
    it('shows Long Text Area field as a Text Area field with expected values', () => {
        const automaticField = createAutomaticField(
            ScreenFieldName.LargeTextArea,
            `${accountSObjectVariable.name}.Description`
        );
        const testScreenField = createComponentUnderTest({
            screenfield: automaticField
        });
        const renderedField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_TEXT_AREA_FIELD
        );
        expect(renderedField).not.toEqual(null);
        expect(renderedField.required).toEqual(false);
    });
    it('shows "Picklist" field as a simple screen field card (in preview not available mode) with correct text, title, icon, without adding any input field', () => {
        const automaticField = createAutomaticField(
            ScreenFieldName.DropdownBox,
            `${accountSObjectVariable.name}.Industry`
        );
        const testScreenField = createComponentUnderTest({
            screenfield: automaticField
        });
        const screenFieldCard = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_FIELD_CARD
        );
        expect(screenFieldCard).toMatchObject({
            text: 'FlowBuilderScreenEditor.fieldExtensionPreviewDescription',
            title: 'Industry',
            icon: 'standard:picklist_type'
        });
        const screenInputField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_INPUT_FIELD
        );
        expect(screenInputField).toBeNull();
    });
    it('shows an error when automatic field has errors', () => {
        const objectFieldReference = `${accountSObjectVariable.name}.iDoNotExist`;
        const automaticField = {
            fieldType: FlowScreenFieldType.ObjectProvided,
            objectFieldReference,
            type: {
                label: objectFieldReference
            },
            hasErrors: true
        };
        const testScreenField = createComponentUnderTest({
            screenfield: automaticField
        });
        const renderedField = testScreenField.shadowRoot.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SCREEN_FIELD_CARD
        );
        expect(renderedField).not.toBeNull();
        expect(renderedField).toMatchObject({
            text: objectFieldReference,
            title: 'FlowBuilderScreenEditor.invalidScreenfield'
        });
    });
});

// TODO - add tests where default value is a reference for each field type
