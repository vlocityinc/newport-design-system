// @ts-nocheck
import { createElement } from 'lwc';
import ScreenField from 'builder_platform_interaction/screenField';
import { createTestScreenField, ticks } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { getCachedExtensionType } from 'builder_platform_interaction/flowExtensionLib';
import { orgHasComponentPreview } from 'builder_platform_interaction/contextLib';

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
    }),
    orgHasFlowBuilderDebug: jest.fn().mockImplementation(() => {
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
        }),
        isExtensionAttributeGlobalConstant: jest.requireActual('builder_platform_interaction/flowExtensionLib')
            .isExtensionAttributeGlobalConstant,
        isExtensionAttributeLiteral: jest.requireActual('builder_platform_interaction/flowExtensionLib')
            .isExtensionAttributeLiteral,
        isExtensionRefDisplayable: jest.fn(),
        getCachedExtensions: jest.fn().mockImplementation((extensions) => {
            const emailDescriptor = {
                inputParameters: [
                    {
                        apiName: 'disabled',
                        dataType: 'boolean',
                        isRequired: false,
                        hasDefaultValue: true,
                        defaultValue: '$GlobalConstant.False'
                    },
                    {
                        apiName: 'label',
                        dataType: 'string',
                        isRequired: true,
                        hasDefaultValue: true,
                        defaultValue: 'Email'
                    },
                    {
                        apiName: 'placeholder',
                        dataType: 'string',
                        isRequired: false,
                        hasDefaultValue: true,
                        defaultValue: 'you@example.com'
                    },
                    {
                        apiName: 'value',
                        dataType: 'string',
                        isRequired: false,
                        hasDefaultValue: false
                    }
                ],
                name: 'flowruntime:email'
            };
            const addressDescriptor = {
                inputParameters: [
                    {
                        apiName: 'city',
                        dataType: 'boolean',
                        isRequired: false,
                        hasDefaultValue: false
                    },
                    {
                        apiName: 'country',
                        dataType: 'string',
                        isRequired: false,
                        hasDefaultValue: false
                    },
                    {
                        apiName: 'addressLabel',
                        dataType: 'string',
                        isRequired: false,
                        hasDefaultValue: true,
                        defaultValue: 'Address'
                    }
                ],
                name: 'flowruntime:address'
            };
            const lookupDescriptor = {
                inputParameters: [
                    {
                        apiName: 'fieldApiName',
                        dataType: 'string',
                        isRequired: true,
                        hasDefaultValue: false
                    },
                    {
                        apiName: 'label',
                        dataType: 'string',
                        isRequired: true,
                        hasDefaultValue: false
                    },
                    {
                        apiName: 'objectApiName',
                        dataType: 'string',
                        isRequired: true,
                        hasDefaultValue: false
                    },
                    {
                        apiName: 'recordId',
                        dataType: 'string',
                        isRequired: true,
                        hasDefaultValue: false
                    }
                ],
                name: 'flowruntime:lookup'
            };

            const cachedDescriptors = [];
            for (const ext of extensions) {
                switch (ext) {
                    case 'flowruntime:email':
                        cachedDescriptors.push(emailDescriptor);
                        break;
                    case 'flowruntime:address':
                        cachedDescriptors.push(addressDescriptor);
                        break;
                    case 'flowruntime:lookup':
                        cachedDescriptors.push(lookupDescriptor);
                        break;
                    default:
                        break;
                }
            }
            return cachedDescriptors;
        })
    });
});

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
    document.body.appendChild(el);
    return el;
};

beforeAll(() => {
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    Store.resetStore();
});

describe('custom Aura field is not previewed', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'c:fakeCmpName1');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Dummy placeholder is present', async () => {
        await ticks(1);
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
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
    it('Dummy placeholder is present', async () => {
        await ticks(1);
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
    });
});

describe('LWC field is previewed when on allow list', () => {
    let testScreenField;
    beforeEach(() => {
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:address');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Extension field is present', async () => {
        await ticks(1);
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeNull();
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).not.toBeNull();
    });
});

describe('Component is not previewed if 1 required input param is missing', () => {
    let testScreenField;
    beforeEach(() => {
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
            }
        ];
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Dummy placeholder is present', async () => {
        await ticks(1);
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
    });
});

describe('Component is previewed if all required input params are literals', () => {
    let testScreenField;
    beforeEach(() => {
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
    it('Extension field is present', async () => {
        await ticks(1);
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).toBeNull();
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).not.toBeNull();
    });
});

describe('Component is not previewed when required param is a reference', () => {
    let testScreenField;
    beforeEach(() => {
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
                value: '{!foo}',
                name: { value: 'recordId' },
                valueDataType: 'Reference'
            }
        ];
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Dummy placeholder is present', async () => {
        await ticks(1);
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
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
        jest.mock('builder_platform_interaction/contextLib', () => {
            return Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
                orgHasComponentPreview() {
                    return false;
                }
            });
        });
        const field = createTestScreenField('lcfield1', 'Extension', 'flowruntime:address');
        testScreenField = createComponentUnderTest({
            screenfield: field
        });
    });
    it('Dummy placeholder is present', async () => {
        await ticks(1);
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
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
    it('Dummy placeholder is present', async () => {
        await ticks(1);
        const extensionFieldWrapper = testScreenField.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD_WRAPPER);
        expect(extensionFieldWrapper).not.toBeNull();
        const dummyComponentField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.SCREEN_FIELD_CARD);
        expect(dummyComponentField).not.toBeNull();
        const extensionField = extensionFieldWrapper.shadowRoot.querySelector(SELECTORS.EXTENSION_FIELD);
        expect(extensionField).toBeNull();
    });
});
