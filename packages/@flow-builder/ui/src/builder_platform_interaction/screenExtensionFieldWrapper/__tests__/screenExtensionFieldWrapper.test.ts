// @ts-nocheck
import { createElement } from 'lwc';
import ScreenField from 'builder_platform_interaction/screenField';
import { createTestScreenField, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { getCachedExtensionType } from 'builder_platform_interaction_mocks/flowExtensionLib';
import { orgHasComponentPreview } from 'builder_platform_interaction/contextLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';

const { logInteraction } = loggingUtils;

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/sharedUtils');

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn((data) => Object.values(data.elements))
    };
});

jest.mock('builder_platform_interaction/contextLib', () => ({
    orgHasFlowScreenSections: jest.fn(),
    orgHasComponentPreview: jest.fn().mockImplementation(() => {
        return true;
    }),
    orgHasFlowBuilderDebug: jest.fn().mockImplementation(() => {
        return true;
    })
}));

jest.mock('aura', () => {
    return {
        createComponent: jest.requireActual('aura').createComponent,
        renderComponent: jest.requireActual('aura').renderComponent
    };
});

window.$A = {
    unrender: jest.fn(),
    afterRender: jest.fn()
};

jest.mock('builder_platform_interaction/flowExtensionLib', () =>
    require('builder_platform_interaction_mocks/flowExtensionLib')
);

const SELECTORS = {
    SCREEN_FIELD_CARD: 'builder_platform_interaction-screen-field-card',
    EXTENSION_FIELD: 'builder_platform_interaction-screen-extension-field',
    EXTENSION_FIELD_WRAPPER: 'builder_platform_interaction-screen-extension-field-wrapper'
};

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-field', {
        is: ScreenField
    });
    if (props) {
        Object.assign(el, props);
    }
    setDocumentBodyChildren(el);
    return el;
};

beforeAll(() => {
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    Store.resetStore();
});

describe('Test1 - Logging via logInteraction', () => {
    let testScreenField;
    beforeEach(() => {
        logInteraction.mockClear();
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:address');
        field.inputParameters = [
            {
                value: { value: 'mock_guid' },
                name: { value: 'city' },
                valueDataType: 'reference'
            },
            {
                value: { value: 'mockGuid1' },
                name: { value: 'inputCountryOptions' },
                valueDataType: 'reference'
            },
            {
                value: { value: 'USA' },
                name: { value: 'country' },
                valueDataType: 'String'
            },
            {
                value: { value: '$GlobalConstant.EmptyString' },
                name: { value: 'addressLabel' },
                valueDataType: 'String'
            },
            {
                value: { value: '94105' },
                name: { value: 'postalCode' },
                valueDataType: 'String'
            },
            {
                value: { value: 'mockGuid3' },
                name: { value: 'inputProvinceOptions' },
                valueDataType: 'reference'
            },
            {
                value: { value: '' },
                name: { value: 'province' },
                valueDataType: 'String'
            },
            {
                value: { value: '$GlobalConstant.False' },
                name: { value: 'street' },
                valueDataType: 'Boolean'
            }
        ];
        field.defaultValue = 'USA';
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Logging is done on load', () => {
        expect(testScreenField).toBeDefined();
        expect(logInteraction).toHaveBeenCalled();
        expect(logInteraction.mock.calls[0][3]).toBe('load');
    });
    it('Logging is done on component close/disconnect', () => {
        expect(testScreenField).toBeDefined();
        expect(logInteraction).toHaveBeenCalled();
        expect(logInteraction.mock.calls[0][3]).toBe('close');
    });
    it('Extension name is logged', () => {
        expect(logInteraction.mock.calls[0][2].extensionName).toBe('flowruntime:address');
    });
    it('Component Preview Supported or not is logged', () => {
        expect(logInteraction.mock.calls[0][2].componentPreviewSupportedInOrg).toBeTruthy();
    });
    it('Dummy preview due to error is logged', () => {
        expect(logInteraction.mock.calls[0][2].dummyModeDueToError).toBeFalsy();
    });
    it('Dummy preview due to render error is logged', () => {
        expect(logInteraction.mock.calls[0][2].dummyModeDueToRenderError).toBeFalsy();
    });
    it('Preview type is logged', () => {
        expect(logInteraction.mock.calls[0][2].preview).toBeDefined();
    });
    it('Total number of input parameters', () => {
        expect(logInteraction.mock.calls[0][2].totalInputParameters).toEqual(8);
    });
    it('Number of literals', () => {
        expect(logInteraction.mock.calls[0][2].literals).toEqual(1);
    });
    it('Number of input parameters not set', () => {
        expect(logInteraction.mock.calls[0][2].notSet).toEqual(1);
    });
    it('Number of input parameters that are references', () => {
        expect(logInteraction.mock.calls[0][2].references).toEqual(3);
    });
    it('Number of input parameters that are globalConstants', () => {
        expect(logInteraction.mock.calls[0][2].globalConstants).toEqual(2);
    });
    it('Number of input parameters that are defaults', () => {
        expect(logInteraction.mock.calls[0][2].defaults).toEqual(1);
    });
});

describe('Test2 - custom Aura field is not previewed', () => {
    let testScreenField;
    beforeEach(() => {
        logInteraction.mockClear();
        const field = createTestScreenField('lcfield1', 'Extension', 'c:fakeCmpName1');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Dummy placeholder is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
    });
    it('Extension field is not present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
    });
    it('Dummy Preview is logged', () => {
        const loggedData = logInteraction.mock.calls[0][2];
        expect(loggedData.extensionName).toBe('c:fakeCmpName1');
        expect(loggedData.preview).toBe('Dummy Preview');
    });
});

describe('Test3 - custom LWC field is not previewed', () => {
    let testScreenField;
    beforeEach(() => {
        logInteraction.mockClear();
        const field = createTestScreenField('lcfield1', 'Extension', 'c:fakeLwc');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Dummy placeholder is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
    });
    it('Extension field is not present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
    });
    it('Dummy Preview is logged', () => {
        const loggedData = logInteraction.mock.calls[0][2];
        expect(loggedData.extensionName).toBe('c:fakeLwc');
        expect(loggedData.preview).toBe('Dummy Preview');
    });
});

describe('Test4 - LWC field is previewed when on allow list', () => {
    let testScreenField;
    beforeEach(() => {
        logInteraction.mockClear();
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:address');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Extension wrapper field is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Extension field is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).not.toBeNull();
    });
    it('Dummy field is not present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeNull();
    });
    it('Actual Preview is logged', () => {
        const loggedData = logInteraction.mock.calls[0][2];
        expect(loggedData.extensionName).toBe('flowruntime:address');
        expect(loggedData.preview).toBe('Actual Preview');
    });
});

describe('Test5 - Component is not previewed if 1 required input param is missing', () => {
    let testScreenField;
    beforeEach(() => {
        logInteraction.mockClear();
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:lookup');
        field.inputParameters = [
            {
                value: 'foo',
                name: { value: 'fieldApiName' },
                valueDataType: 'String'
            },
            {
                value: 'foo',
                name: { value: 'label' },
                valueDataType: 'String'
            }
        ];
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Screen extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Dummy placeholder is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
    });
    it('Extension field is not present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
    });
    it('Dummy Preview is logged', () => {
        const loggedData = logInteraction.mock.calls[0][2];
        expect(loggedData.extensionName).toBe('flowruntime:lookup');
        expect(loggedData.preview).toBe('Dummy Preview');
    });
});

describe('Test6 - Component is previewed if all required input params are literals', () => {
    let testScreenField;
    beforeEach(() => {
        logInteraction.mockClear();
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:lookup');
        field.inputParameters = [
            {
                value: 'foo',
                name: { value: 'fieldApiName' },
                valueDataType: 'String'
            },
            {
                value: 'foo',
                name: { value: 'objectApiName' },
                valueDataType: 'String'
            },
            {
                value: 'foo',
                name: { value: 'label' },
                valueDataType: 'String'
            },
            {
                value: 'foo',
                name: { value: 'recordId' },
                valueDataType: 'String'
            }
        ];
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Wrapper field is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Dummy field is not present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeNull();
    });
    it('Extension field is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).not.toBeNull();
    });
    it('Actual Preview is logged', () => {
        const loggedData = logInteraction.mock.calls[0][2];
        expect(loggedData.extensionName).toBe('flowruntime:lookup');
        expect(loggedData.preview).toBe('Actual Preview');
    });
});

describe('Test7 - Component is not previewed when required param is a reference', () => {
    let testScreenField;
    beforeEach(() => {
        logInteraction.mockClear();
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:lookup');
        field.inputParameters = [
            {
                value: 'foo',
                name: { value: 'fieldApiName' },
                valueDataType: 'String'
            },
            {
                value: 'foo',
                name: { value: 'objectApiName' },
                valueDataType: 'String'
            },
            {
                value: '{!foo}',
                name: { value: 'label' },
                valueDataType: 'Reference'
            }
        ];
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Dummy placeholder is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
    });
    it('Extension field is not present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
    });
    it('Dummy Preview is logged', () => {
        const loggedData = logInteraction.mock.calls[0][2];
        expect(loggedData.extensionName).toBe('flowruntime:lookup');
        expect(loggedData.preview).toBe('Dummy Preview');
    });
});

describe('Test8 - Component allowed for preview is not previewed when org perm is disabled', () => {
    let testScreenField;
    beforeAll(() => {
        orgHasComponentPreview.mockImplementation(() => false);
    });
    beforeEach(() => {
        logInteraction.mockClear();
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:address');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    afterAll(() => {
        orgHasComponentPreview.mockImplementation(() => true);
    });
    it('Extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Dummy placeholder is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
    });
    it('Extension field is not present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
    });
    it('Dummy Preview is logged', () => {
        const loggedData = logInteraction.mock.calls[0][2];
        expect(loggedData.extensionName).toBe('flowruntime:address');
        expect(loggedData.preview).toBe('Dummy Preview');
        expect(loggedData.componentPreviewSupportedInOrg).toBeFalsy();
    });
});

describe('Test9 - Component is not previewed if component descriptor is not avaialable', () => {
    let testScreenField;
    beforeAll(() => {
        getCachedExtensionType.mockImplementation(() => '');
    });
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:address');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    afterAll(() => {
        getCachedExtensionType.mockImplementation(
            () => jest.requireActual('builder_platform_interaction_mocks/flowExtensionLib').getCachedExtensionType
        );
    });
    it('Extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Dummy placeholder is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
    });
    it('Extension field is not present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
    });
    it('Dummy Preview is logged', () => {
        const loggedData = logInteraction.mock.calls[0][2];
        expect(loggedData.extensionName).toBe('flowruntime:address');
        expect(loggedData.preview).toBe('Dummy Preview');
    });
});

const describeSkip = describe.skip;

describeSkip('Test10 - Component uses GlobalConstant.True for String param', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:image');
        field.inputParameters = [
            {
                value: { value: '$GlobalConstant.True' },
                name: { value: 'imageName' },
                valueDataType: 'Boolean'
            }
        ];
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Foo Extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Foo Extension field is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).not.toBeNull();
    });
    it('Attribute has string version of true as its value', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField.attributes.imageName).toBeTruthy();
    });
});

describeSkip('Test11 - Component uses GlobalConstant.False for String param', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:image');
        field.inputParameters = [
            {
                value: { value: '$GlobalConstant.False' },
                name: { value: 'imageName' },
                valueDataType: 'Boolean'
            }
        ];
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Bar Extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it(' Bar Extension field is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).not.toBeNull();
    });
    it('Attribute has string version of false as its value', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField.attributes.imageName).toBeFalsy();
    });
});

describe('Test12 - Component uses GlobalConstant.True for Boolean param', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:email');
        field.inputParameters = [
            {
                value: { value: 'Your Email' },
                name: { value: 'label' },
                valueDataType: 'String'
            },
            {
                value: { value: '$GlobalConstant.True' },
                name: { value: 'disabled' },
                valueDataType: 'Boolean'
            }
        ];
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Extension field is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).not.toBeNull();
    });
    it('Attribute has the boolean version of true as its value', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField.attributes.disabled).toBeTruthy();
    });
});

describe('Test13 - Component uses GlobalConstant.False for Boolean param', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:email');
        field.inputParameters = [
            {
                value: { value: 'Your Email' },
                name: { value: 'label' },
                valueDataType: 'String'
            },
            {
                value: { value: '$GlobalConstant.False' },
                name: { value: 'disabled' },
                valueDataType: 'Boolean'
            }
        ];
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Extension wrapper is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
    });
    it('Extension field is present', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).not.toBeNull();
    });
    it('Attribute has the boolean version of false as its value', () => {
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField.attributes.disabled).toBeFalsy();
    });
});
