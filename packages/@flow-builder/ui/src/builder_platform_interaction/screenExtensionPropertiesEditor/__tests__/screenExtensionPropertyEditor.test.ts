// @ts-nocheck
import { createElement } from 'lwc';
import ScreenExtensionPropertiesEditor from 'builder_platform_interaction/screenExtensionPropertiesEditor';
import {
    query,
    createTestScreenField,
    getAdvancedOptionCheckbox,
    getUseAdvancedOptionComponent,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { screenExtensionPropertiesEventReducer } from '../screenExtensionPropertiesReducer';
import {
    UseAdvancedOptionsSelectionChangedEvent,
    ItemSelectedEvent,
    ConfigurationEditorChangeEvent,
    ConfigurationEditorTypeMappingChangeEvent,
    DynamicTypeMappingChangeEvent,
    PropertyChangedEvent,
    ComboboxStateChangedEvent
} from 'builder_platform_interaction/events';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    createFlowExtensionWithDynamicTypes,
    createScreenFieldWithDynamicTypes
} from './screenExtensionDynamicTypesMocks';
import { createScreenFieldForCPE, createFlowExtensionForCPE } from './screenExtensionCustomPropertyEditorMocks';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn((data) => Object.values(data.elements))
    };
});

jest.mock('builder_platform_interaction/translatorLib', () => ({
    translateUIModelToFlow: jest.fn(),
    swapDevNamesToGuids: jest.fn(),
    swapUidsForDevNames: jest.fn()
}));

jest.mock('builder_platform_interaction/builderUtils', () => ({
    createConfigurationEditor: jest.fn()
}));

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/ruleLib');
    return {
        getRulesForElementType: jest
            .fn()
            .mockImplementation(() => [])
            .mockName('getRulesForElementType'),
        RULE_TYPES: actual.RULE_TYPES,
        PARAM_PROPERTY: actual.PARAM_PROPERTY
    };
});

jest.mock('../screenExtensionPropertiesReducer', () => {
    const actual = jest.requireActual('../screenExtensionPropertiesReducer');
    return {
        screenExtensionPropertiesEventReducer: jest.fn().mockImplementation((state) => state),
        screenExtensionPropertiesPropsToStateReducer: actual.screenExtensionPropertiesPropsToStateReducer
    };
});

jest.mock('builder_platform_interaction/screenComponentVisibilitySection', () =>
    require('builder_platform_interaction_mocks/screenComponentVisibilitySection')
);

let mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn((processType) => {
    return processType === 'flow' ? 'Supported' : 'Unsupported';
});

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    const FLOW_AUTOMATIC_OUTPUT_HANDLING = actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: (processType) =>
            mockGetProcessTypeAutomaticOutPutHandlingSupport(processType)
    };
});

const SELECTORS = {
    CONTAINER_DIV: 'div.container',
    NAME_FIELD: 'builder_platform_interaction-screen-property-field[name="name"]',
    CUSTOM_PROPERTY_EDITOR: 'builder_platform_interaction-custom-property-editor',
    DYNAMIC_TYPE_MAPPINGS: 'builder_platform_interaction-entity-resource-picker',
    INPUT_EDITOR: 'builder_platform_interaction-screen-extension-attribute-editor[attributeType="input"]',
    OUTPUT_EDITOR: 'builder_platform_interaction-screen-extension-attribute-editor[attributeType="output"]',
    COMPONENT_VISIBILITY: 'builder_platform_interaction-screen-component-visibility-section',
    H3: 'h3',
    OUTPUT_IN_ACCORDION: '.outputInAccordion',
    OUTPUT_BEFORE_ACCORDION: '.outputBeforeAccordion'
};

const DESCRIPTOR_NAME = 'c:requiredAttTestComponent';

const DESCRIPTOR_PARAMETERS = [
    {
        apiName: 'stringAttr',
        dataType: 'string',
        description: 'String Attribute Description',
        hasDefaultValue: false,
        isRequired: true,
        label: undefined,
        isInput: true,
        isOutput: true,
        maxOccurs: 1,
        objectType: undefined
    },
    {
        apiName: 'dateAttr',
        dataType: 'date',
        defaultValue: '02/02/2002',
        description: 'Date Attribute Description',
        hasDefaultValue: true,
        isRequired: true,
        label: 'Date Attribute',
        isInput: true,
        isOutput: true,
        maxOccurs: 1,
        objectType: undefined
    },
    {
        apiName: 'datetimeAttr',
        dataType: 'datetime',
        description: 'Datetime Attribute Description',
        hasDefaultValue: false,
        isRequired: true,
        label: 'Datetime Attribute',
        isInput: true,
        isOutput: true,
        maxOccurs: 1,
        objectType: undefined
    },
    {
        apiName: 'ZZZATTR',
        dataType: 'string',
        description: 'Uppercase attribute for testing',
        hasDefaultValue: false,
        isRequired: true,
        label: 'Uppercase attribute',
        isInput: true,
        isOutput: true,
        maxOccurs: 1,
        objectType: undefined
    },
    {
        apiName: 'zzzzAttr',
        dataType: 'number',
        description: 'Camelcase attribute for testing',
        hasDefaultValue: false,
        isRequired: true,
        label: 'Camelcase attribute',
        isInput: true,
        isOutput: true,
        maxOccurs: 1,
        objectType: undefined
    },
    {
        apiName: 'aNotRequired',
        dataType: 'string',
        description: 'Requiredness order test attribute',
        hasDefaultValue: false,
        isRequired: false,
        label: undefined,
        isInput: true,
        isOutput: true,
        maxOccurs: 1,
        objectType: undefined
    },
    {
        apiName: 'bRequired',
        dataType: 'string',
        description: 'Requiredness order test attribute',
        hasDefaultValue: false,
        isRequired: true,
        label: undefined,
        isInput: true,
        isOutput: true,
        maxOccurs: 1,
        objectType: undefined
    }
];

const INPUT_PARAMETERS = [
    {
        name: { value: DESCRIPTOR_PARAMETERS[1].apiName, error: null },
        value: { value: '2003-03-03T08:00:00.000+0000', error: null },
        valueDataType: 'DateTime'
    },
    {
        name: { value: DESCRIPTOR_PARAMETERS[0].apiName, error: null },
        value: { value: '{!var1}', error: null },
        valueDataType: 'reference'
    },
    {
        name: { value: DESCRIPTOR_PARAMETERS[3].apiName, error: null },
        value: { value: 'attribute value', error: null },
        valueDataType: 'string'
    }
];

const OUTPUT_PARAMETERS = [
    {
        name: { value: DESCRIPTOR_PARAMETERS[0].apiName, error: null },
        value: { value: '{!var1}', error: null },
        valueDataType: 'reference'
    },
    {
        name: { value: DESCRIPTOR_PARAMETERS[2].apiName, error: null },
        value: { value: '{!var2}', error: null },
        valueDataType: 'reference'
    }
];
const getStoreOutputVariableTitleElement = (extensionEditor) =>
    Array.from(extensionEditor.shadowRoot.querySelectorAll(SELECTORS.H3)).find(
        (h3) => h3.textContent && h3.textContent === LABELS.extensionOutputsHeader
    );

const parametersComparator = (p1, p2, forInputs) => {
    if (forInputs && p1.isRequired !== p2.isRequired) {
        return p1.isRequired ? -1 : 1;
    }
    const p1Label = (p1.label || p1.apiName || '').toLowerCase();
    const p2Label = (p2.label || p2.apiName || '').toLowerCase();
    return p1Label.localeCompare(p2Label);
};

const createField = (
    properties,
    inputParameters = deepCopy(INPUT_PARAMETERS),
    outputParameters = deepCopy(OUTPUT_PARAMETERS),
    storeOutputAutomatically = true
) => {
    properties.field = createTestScreenField('lcField', 'Extension', DESCRIPTOR_NAME, {}, storeOutputAutomatically);
    properties.field.inputParameters = inputParameters;
    properties.field.outputParameters = outputParameters;
};

const createDescription = (
    properties,
    inputParam = deepCopy(DESCRIPTOR_PARAMETERS),
    outputParam = deepCopy(DESCRIPTOR_PARAMETERS)
) => {
    properties.extensionDescription = {
        name: DESCRIPTOR_NAME,
        inputParameters: inputParam,
        outputParameters: outputParam
    };
};

function createComponentForTest(properties) {
    const el = createElement('builder_platform_interaction-screen-extension-properties-editor', {
        is: ScreenExtensionPropertiesEditor
    });
    Object.assign(el, properties);
    document.body.appendChild(el);
    return el;
}

const createComponentForTestWithProperties = () => {
    const el = createElement('builder_platform_interaction-screen-extension-properties-editor', {
        is: ScreenExtensionPropertiesEditor
    });
    const properties = {};
    createField(properties);
    createDescription(properties);
    Object.assign(el, { processType: 'something' });
    Object.assign(el, properties);
    document.body.appendChild(el);
    return el;
};

const createComponentForTestWithNoOutput = () => {
    const el = createElement('builder_platform_interaction-screen-extension-properties-editor', {
        is: ScreenExtensionPropertiesEditor
    });
    const properties = {};
    createField(properties, INPUT_PARAMETERS, [], false);
    createDescription(properties, DESCRIPTOR_PARAMETERS, []);
    Object.assign(el, { processType: 'something' });
    Object.assign(el, properties);
    document.body.appendChild(el);
    return el;
};

const createComponentForTestInAdvancedModeWithOutput = () => {
    const el = createElement('builder_platform_interaction-screen-extension-properties-editor', {
        is: ScreenExtensionPropertiesEditor
    });
    const properties = {};
    createField(properties, deepCopy(INPUT_PARAMETERS), deepCopy(OUTPUT_PARAMETERS), false);
    createDescription(properties, deepCopy(DESCRIPTOR_PARAMETERS), deepCopy(DESCRIPTOR_PARAMETERS));
    Object.assign(el, { processType: 'something' });
    Object.assign(el, properties);
    document.body.appendChild(el);
    return el;
};

const runTest = async (createFieldRequired, createDescriptionRequired, propertiesProcessor, testCallback) => {
    const properties = {};
    if (createFieldRequired) {
        createField(properties);
    }

    if (createDescriptionRequired) {
        createDescription(properties);
    }

    if (propertiesProcessor) {
        propertiesProcessor(properties);
    }

    const extensionEditor = createComponentForTest(properties);
    await ticks(1);
    testCallback(extensionEditor);
};

const testEditors = (selector, propertyName) => {
    let props = null;
    const propertiesProcessor = (properties) => {
        props = properties;
    };

    return runTest(true, true, propertiesProcessor, (extensionEditor) => {
        const attEditors = query(extensionEditor, selector, true);
        expect(attEditors).toHaveLength(DESCRIPTOR_PARAMETERS.length);
        let descParams = props.extensionDescription[propertyName];
        expect(attEditors).toHaveLength(descParams.length);

        // Check there's an attribute editor per parameter in the extension Descriptor and that the attribute and the descriptor match for every editor
        let fieldParams = props.field[propertyName];
        attEditors.forEach((attEditor) => {
            if (attEditor.attribute) {
                expect(attEditor.attribute.name.value).toEqual(attEditor.descriptor.apiName);
                const fieldParamsCount = fieldParams.length;
                fieldParams = fieldParams.filter(
                    (fieldParam) => fieldParam.name.value !== attEditor.attribute.name.value
                );
                expect(fieldParams).toHaveLength(fieldParamsCount - 1); // Make sure we only removed 1
            }

            const descParamsCount = descParams.length;
            descParams = descParams.filter((descParam) => descParam.apiName !== attEditor.descriptor.apiName);
            expect(descParams).toHaveLength(descParamsCount - 1); // Make sure we only removed 1
        });

        expect(fieldParams).toHaveLength(0);
        expect(descParams).toHaveLength(0);
    });
};

function forceRender(element) {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    document.body.appendChild(element);
}

describe('Screen Extension Properties Editor', () => {
    it('does not render its container when the field is not set', () => {
        return runTest(false, true, null, (editor) => {
            expect(query(editor, SELECTORS.CONTAINER_DIV)).toBeNull();
        });
    });

    it('renders its container when the field is set', () => {
        return runTest(true, true, null, (editor) => {
            expect(query(editor, SELECTORS.CONTAINER_DIV)).not.toBeNull();
        });
    });

    it('only renders its container when the extension description is not set', () => {
        return runTest(true, false, null, (editor) => {
            const containerDiv = query(editor, SELECTORS.CONTAINER_DIV);
            expect(containerDiv.childElementCount).toBe(0);
        });
    });

    it('displays name, input and output parameters', () => {
        return runTest(true, true, null, (editor) => {
            expect(query(editor, SELECTORS.NAME_FIELD)).not.toBeNull();
            expect(query(editor, SELECTORS.INPUT_EDITOR, true)).toHaveLength(DESCRIPTOR_PARAMETERS.length);
            expect(query(editor, SELECTORS.OUTPUT_EDITOR, true)).toHaveLength(DESCRIPTOR_PARAMETERS.length);
        });
    });

    it('sorts input parameters by requirenesss and name', () => {
        return runTest(true, true, null, (editor) => {
            const inputs = query(editor, SELECTORS.INPUT_EDITOR, true);
            expect(inputs).toHaveLength(DESCRIPTOR_PARAMETERS.length);

            const names = inputs.map((input) => input.descriptor.label || input.descriptor.apiName);
            const expectedNames = DESCRIPTOR_PARAMETERS.sort((p1, p2) => parametersComparator(p1, p2, true)).map(
                (p) => p.label || p.apiName
            );
            expect(names).toEqual(expectedNames);
        });
    });

    it('sorts output parameters alphabetically', () => {
        return runTest(true, true, null, (editor) => {
            const outputs = query(editor, SELECTORS.OUTPUT_EDITOR, true);
            expect(outputs).toHaveLength(DESCRIPTOR_PARAMETERS.length);

            const names = outputs.map((input) => input.descriptor.label || input.descriptor.apiName);
            const expectedNames = DESCRIPTOR_PARAMETERS.sort((p1, p2) => parametersComparator(p1, p2, false)).map(
                (p) => p.label || p.apiName
            );
            expect(names).toEqual(expectedNames);
        });
    });

    it('does not render the outputs section if the component does not have any output attributes', () => {
        const propertiesProcessor = (properties) => {
            properties.extensionDescription.outputParameters = [];
            properties.field.outputParameters = [];
        };

        return runTest(true, true, propertiesProcessor, (editor) => {
            expect(getStoreOutputVariableTitleElement(editor)).not.toBeDefined();
        });
    });

    it('does render the outputs section if the component does have output attributes', () => {
        return runTest(true, true, null, (editor) => {
            expect(getStoreOutputVariableTitleElement(editor)).toBeDefined();
        });
    });

    it('can handle multiple mappings for an output parameter', () => {
        const propertiesProcessor = (properties) => {
            properties.field.outputParameters.push(properties.field.outputParameters[0]); // Add second mapping for first parameter
        };

        return runTest(true, true, propertiesProcessor, (editor) => {
            const outputs = query(editor, SELECTORS.OUTPUT_EDITOR, true);
            expect(outputs).toHaveLength(DESCRIPTOR_PARAMETERS.length + 1);
        });
    });

    it('sets the right attributes to inputs', () => {
        return testEditors(SELECTORS.INPUT_EDITOR, 'inputParameters');
    });

    it('sets the right attributes to outputs', () => {
        return testEditors(SELECTORS.OUTPUT_EDITOR, 'outputParameters');
    });

    describe('Automated output', () => {
        it('shows up Use Advanced Options when Automated Output enabled', () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(() => 'Supported');
            const extensionEditor = createComponentForTestWithProperties();
            const useAdvancedOptionsCheckbox = getAdvancedOptionCheckbox(extensionEditor);
            expect(useAdvancedOptionsCheckbox).toBeDefined();
            expect(useAdvancedOptionsCheckbox.checked).toBe(false);
        });
        it('has empty styling on Use Advanced Option component', () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(() => 'Supported');
            const extensionEditor = createComponentForTestWithProperties();
            const useAdvancedOptionComponent = getUseAdvancedOptionComponent(extensionEditor);
            const inputParentDivCss = useAdvancedOptionComponent.shadowRoot.querySelector('div');
            expect(inputParentDivCss.className).toBe('');
        });
        it('does not show up Use Advanced Options when Automated Output disabled', () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn().mockImplementationOnce(() => 'Unsupported');
            const extensionEditor = createComponentForTestWithProperties();
            expect(getUseAdvancedOptionComponent(extensionEditor)).toBeNull();
        });
        it('handles use advanced option checkbox event', async () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(() => 'Supported');
            const extensionEditor = createComponentForTestWithProperties();
            const expectedEvent = new UseAdvancedOptionsSelectionChangedEvent(true);
            await Promise.resolve();
            getUseAdvancedOptionComponent(extensionEditor).dispatchEvent(expectedEvent);
            await Promise.resolve();
            expect(screenExtensionPropertiesEventReducer).toHaveBeenCalled();
            expect(screenExtensionPropertiesEventReducer.mock.calls[0][0]).toMatchObject({
                outputParameters: expect.anything(),
                storeOutputAutomatically: true
            });
            expect(screenExtensionPropertiesEventReducer.mock.calls[0][1]).toMatchObject({
                extensionDescription: {
                    inputParameters: expect.anything(),
                    outputParameters: expect.anything()
                }
            });
            expect(screenExtensionPropertiesEventReducer.mock.calls[0][2].detail).toMatchObject({
                useAdvancedOptions: true
            });
        });
        it('does not show the checkbox up when screen field has no output', () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(() => 'Supported');
            const extensionEditor = createComponentForTestWithNoOutput();
            expect(getUseAdvancedOptionComponent(extensionEditor)).toBeNull();
        });
        it('does not show the store output variable section when screen field has no output', () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(() => 'Supported');
            const extensionEditor = createComponentForTestWithNoOutput();
            expect(getStoreOutputVariableTitleElement(extensionEditor)).not.toBeDefined();
        });
        it('shows up output in advanced section when advanced mode enabled and automatic output is supported', () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(() => 'Supported');
            const extensionEditor = createComponentForTestInAdvancedModeWithOutput();
            expect(extensionEditor.shadowRoot.querySelector(SELECTORS.OUTPUT_IN_ACCORDION)).not.toBeNull();
            expect(extensionEditor.shadowRoot.querySelector(SELECTORS.OUTPUT_BEFORE_ACCORDION)).toBeNull();
        });
        it('not shows up output in advanced section when advanced mode enabled and automatic output is not supported', () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn().mockImplementationOnce(() => 'Unsupported');
            const extensionEditor = createComponentForTestInAdvancedModeWithOutput();
            expect(extensionEditor.shadowRoot.querySelector(SELECTORS.OUTPUT_BEFORE_ACCORDION)).not.toBeNull();
            expect(extensionEditor.shadowRoot.querySelector(SELECTORS.OUTPUT_IN_ACCORDION)).toBeNull();
        });
    });

    describe('custom property editor', () => {
        const createComponentWithCPE = () =>
            createComponentForTest({
                configurationEditor: 'c:lookup',
                field: createScreenFieldForCPE(),
                extensionDescription: createFlowExtensionForCPE(),
                processType: 'Something'
            });

        it('renders', () => {
            createComponentWithCPE();
        });

        it('handles cpe property change event', async () => {
            const propertyEditorCmp = createComponentWithCPE();
            const cpeCmp = propertyEditorCmp.shadowRoot.querySelector(SELECTORS.CUSTOM_PROPERTY_EDITOR);
            const handler = jest.fn();
            propertyEditorCmp.addEventListener(PropertyChangedEvent.EVENT_NAME, handler);
            cpeCmp.dispatchEvent(new ConfigurationEditorChangeEvent('inputName', 'newInputValue', 'String'));
            await Promise.resolve();
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail).toMatchObject({
                propertyName: '$$input$$.inputName',
                value: { value: 'newInputValue', error: null },
                error: null,
                guid: 'newInputValue',
                oldValue: { value: 'inputValue', error: null },
                listIndex: undefined,
                dataType: 'String'
            });
        });

        it('handles cpe type mapping change event', async () => {
            const propertyEditorCmp = createComponentWithCPE();
            const cpeCmp = propertyEditorCmp.shadowRoot.querySelector(SELECTORS.CUSTOM_PROPERTY_EDITOR);
            const handler = jest.fn();
            propertyEditorCmp.addEventListener(DynamicTypeMappingChangeEvent.EVENT_NAME, handler);
            cpeCmp.dispatchEvent(new ConfigurationEditorTypeMappingChangeEvent('T', 'Account'));
            await Promise.resolve();
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail).toMatchObject({
                typeName: 'T',
                typeValue: 'Account',
                error: undefined,
                rowIndex: undefined
            });
        });

        it('renders entity picker for each generic type', () => {
            const editor = createComponentWithCPE();
            const pickers = query(editor, SELECTORS.DYNAMIC_TYPE_MAPPINGS, true);
            expect(pickers).toHaveLength(0);
        });

        it('renders CFV ', () => {
            const editor = createComponentWithCPE();
            const cfv = query(editor, SELECTORS.COMPONENT_VISIBILITY, true);
            expect(cfv).toHaveLength(1);
        });
    });

    describe('dynamic types', () => {
        const createComponentWithDynmicTypes = () =>
            createComponentForTest({
                field: createScreenFieldWithDynamicTypes(),
                extensionDescription: createFlowExtensionWithDynamicTypes(),
                processType: 'Something'
            });

        it('renders', () => {
            createComponentWithDynmicTypes();
        });

        it('renders entity picker for each generic type', async () => {
            const editor = createComponentWithDynmicTypes();
            const pickers = query(editor, SELECTORS.DYNAMIC_TYPE_MAPPINGS, true);
            expect(pickers).toHaveLength(2);
            expect(pickers[0].comboboxConfig).toMatchObject({
                label: 'First sobject',
                required: true,
                allowSObjectFields: false,
                fieldLevelHelp: 'This is the first object'
            });
            expect(pickers[0].value).toBe('Asset');
            expect(pickers[0].rowIndex).toBeDefined();
            expect(pickers[1].comboboxConfig).toMatchObject({
                label: 'Second sobject',
                required: true,
                allowSObjectFields: false,
                fieldLevelHelp: 'This is the second object'
            });
            expect(pickers[1].value).toBe('');
            expect(pickers[1].rowIndex).toBeDefined();
        });

        it('does not render input and output parameters while not all generic types are bound', () => {
            const editor = createComponentWithDynmicTypes();
            const inputs = query(editor, SELECTORS.INPUT_EDITOR, true);
            expect(inputs).toHaveLength(0);
            const outputs = query(editor, SELECTORS.OUTPUT_EDITOR, true);
            expect(outputs).toHaveLength(0);
        });

        it('handles ItemSelected entity picker event', async () => {
            const editor = createComponentWithDynmicTypes();
            const pickers = query(editor, SELECTORS.DYNAMIC_TYPE_MAPPINGS, true);
            const handler = jest.fn();
            editor.addEventListener(DynamicTypeMappingChangeEvent.EVENT_NAME, handler);
            pickers[1].dispatchEvent(
                new ItemSelectedEvent({
                    value: 'Account'
                })
            );
            await Promise.resolve();
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail).toMatchObject({
                typeName: 'S',
                typeValue: 'Account',
                error: undefined,
                rowIndex: expect.anything()
            });
        });

        it('handles CoboboxStateChanged entity picker event', async () => {
            const editor = createComponentWithDynmicTypes();
            const pickers = query(editor, SELECTORS.DYNAMIC_TYPE_MAPPINGS, true);
            const handler = jest.fn();
            editor.addEventListener(DynamicTypeMappingChangeEvent.EVENT_NAME, handler);
            pickers[1].dispatchEvent(
                new ComboboxStateChangedEvent({ value: 'Engine' }, 'This is an engine', null, false)
            );
            await Promise.resolve();
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail).toMatchObject({
                typeName: 'S',
                typeValue: 'Engine',
                error: null,
                rowIndex: expect.anything()
            });
        });

        it('renders input and output parameters when all generic types are bound', async () => {
            const editor = createComponentWithDynmicTypes();
            let inputs = query(editor, SELECTORS.INPUT_EDITOR, true);
            expect(inputs).toHaveLength(0);
            let outputs = query(editor, SELECTORS.OUTPUT_EDITOR, true);
            expect(outputs).toHaveLength(0);

            editor.field = Object.assign({}, editor.field, {
                dynamicTypeMappings: [
                    {
                        typeName: 'T',
                        typeValue: 'Account'
                    },
                    {
                        typeName: 'S',
                        typeValue: 'Engine'
                    }
                ]
            });

            forceRender(editor);

            await Promise.resolve();

            inputs = query(editor, SELECTORS.INPUT_EDITOR, true);
            expect(inputs).toHaveLength(2);
            outputs = query(editor, SELECTORS.OUTPUT_EDITOR, true);
            expect(outputs).toHaveLength(0);
        });

        it('disables entity pickers when the field is not new', async () => {
            const editor = createComponentWithDynmicTypes();
            const pickers = query(editor, SELECTORS.DYNAMIC_TYPE_MAPPINGS, true);
            expect(pickers[0].comboboxConfig.disabled).toBe(false);
            expect(pickers[1].comboboxConfig.disabled).toBe(false);
            editor.field = Object.assign({}, editor.field, {
                isNewField: false
            });

            forceRender(editor);

            await Promise.resolve();

            expect(pickers[0].comboboxConfig.disabled).toBe(true);
            expect(pickers[1].comboboxConfig.disabled).toBe(true);
        });
    });
});
