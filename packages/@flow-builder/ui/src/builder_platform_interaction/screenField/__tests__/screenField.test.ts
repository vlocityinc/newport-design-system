// @ts-nocheck
import { createElement } from 'lwc';
import ScreenField from '../screenField';
import { createTestScreenField, SCREEN_NO_DEF_VALUE, ticks } from 'builder_platform_interaction/builderTestUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { getCachedExtensionType } from 'builder_platform_interaction/flowExtensionLib';
import { orgHasComponentPreview } from 'builder_platform_interaction/contextLib';
import * as contextLibMock from 'builder_platform_interaction/contextLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn((data) => Object.values(data.elements))
    };
});

jest.mock('builder_platform_interaction/contextLib', () => ({
    orgHasFlowScreenSections: jest.fn(),
    orgHasComponentPreview: jest.fn().mockImplementation(() => {
        return true;
    })
}));

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    return Object.assign({}, require('builder_platform_interaction_mocks/flowExtensionLib'), {
        getCachedExtensionType: jest.fn().mockImplementation((extensionName) => {
            const TEST_EXTENSION_TYPES = {
                'c:fakeAuraCmp': 'aura',
                'c:fakeLwc': 'lwc',
                'flowruntime:lookup': 'lwc'
            };
            const values = {
                extensionType: TEST_EXTENSION_TYPES.extensionName,
                fieldType: 'ComponentInstance',
                name: extensionName
            };
            return values;
        })
    });
});

jest.mock('aura', () => {
    return {
        createComponent: jest.fn().mockImplementation((cmpName, attr, callback) => {
            const mockComponent = {
                destroy: jest.fn(),
                getElement: () => {}
            };
            callback(mockComponent, 'SUCCESS', null);
        }),

        renderComponent: jest.fn().mockImplementation(() => {})
    };
});

window.$A = {
    unrender: jest.fn(),
    afterRender: jest.fn()
};

const SELECTORS = {
    INPUT_FIELD: 'builder_platform_interaction-screen-input-field',
    TEXT_AREA_FIELD: 'builder_platform_interaction-screen-textarea-field',
    DISPLAY_FIELD: 'builder_platform_interaction-screen-display-text-field',
    SCREEN_FIELD_CARD: 'builder_platform_interaction-screen-field-card',
    SECTION_FIELD: 'builder_platform_interaction-screen-section-field',
    EXTENSION_FIELD: 'builder_platform_interaction-screen-extension-field'
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

describe('custom Aura field is not previewed', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'c:fakeCmpName1');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Dummy preview is shown', async () => {
        await ticks(1);
        const dummyComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeDefined();
        const realComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(realComponentField).toBeNull();
    });
});

describe('custom LWC field is not previewed', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'c:fakeLwc');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Dummy preview is shown', async () => {
        await ticks(1);
        const dummyComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeDefined();
        const realComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(realComponentField).toBeNull();
    });
});

describe('Standard LWC field is previewed, when on allow list', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:address');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Real component is shown in preview', async () => {
        await ticks(1);
        const realComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(realComponentField).toBeDefined();
        const dummyComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeNull();
    });
});

describe('Standard LWC field is not previewed, when not on allow list', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:lookup');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Dummy preview is shown', async () => {
        await ticks(1);
        const dummyComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeDefined();
        const realComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(realComponentField).toBeNull();
    });
});

describe('Component allowed for preview is not previewed when org perm is disabled', () => {
    let testScreenField;
    const shouldOrgAllowPreview = (allow) => {
        orgHasComponentPreview.mockImplementation(() => {
            return allow;
        });
    };
    beforeEach(() => {
        shouldOrgAllowPreview(false);
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:address');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Dummy preview is shown', async () => {
        await ticks(1);
        const dummyComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeDefined();
        const realComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(realComponentField).toBeNull();
    });
});

describe('Component is not previewed if component descriptor is not avaialable', () => {
    let testScreenField;
    const cachedInfo = () => {
        getCachedExtensionType.mockImplementation(() => {
            return '';
        });
    };
    beforeEach(() => {
        cachedInfo();
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:address');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Dummy preview is shown', async () => {
        await ticks(1);
        const realComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(realComponentField).toBeNull();
        const dummyComponentField = testScreenField.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeDefined();
    });
});

// TODO - add tests where default value is a reference for each field type
