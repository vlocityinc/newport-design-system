import { createElement } from 'lwc';
import ScreenExtensionPropertiesEditor from 'builder_platform_interaction/screenExtensionPropertiesEditor';
import {
    query,
    createTestScreenField,
    getAdvancedOptionCheckbox,
    getUseAdvancedOptionComponent
} from 'builder_platform_interaction/builderTestUtils';
import { screenExtensionPropertiesReducer } from '../screenExtensionPropertiesReducer';
import { UseAdvancedOptionsSelectionChangedEvent } from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements))
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = require.requireActual('../../ruleLib/ruleLib.js');
    return {
        getRulesForElementType: jest
            .fn()
            .mockImplementation(() => [])
            .mockName('getRulesForElementType'),
        RULE_TYPES: actual.RULE_TYPES,
        PARAM_PROPERTY: actual.PARAM_PROPERTY
    };
});

jest.mock('../screenExtensionPropertiesReducer.js', () => {
    return {
        screenExtensionPropertiesReducer: jest.fn()
    };
});

jest.mock('builder_platform_interaction/screenComponentVisibilitySection', () =>
    require('builder_platform_interaction_mocks/screenComponentVisibilitySection')
);

let mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(processType => {
    return processType === 'flow' ? 'Supported' : 'Unsupported';
});

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = require.requireActual(
        '../../processTypeLib/processTypeLib.js'
    );
    const FLOW_AUTOMATIC_OUTPUT_HANDLING =
        actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: processType =>
            mockGetProcessTypeAutomaticOutPutHandlingSupport(processType)
    };
});

const SELECTORS = {
    CONTAINER_DIV: 'div.container',
    NAME_FIELD:
        'builder_platform_interaction-screen-property-field[name="name"]',
    INPUT_EDITOR:
        'builder_platform_interaction-screen-extension-attribute-editor[attributeType="input"]',
    OUTPUT_EDITOR:
        'builder_platform_interaction-screen-extension-attribute-editor[attributeType="output"]',
    OUTPUTS_SECTION: 'lightning-accordion[activeSectionName="outputsSection"]',
    COMPONENT_VISIBILITY:
        'lightning-accordion-section[name="componentVisibility"]'
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

const parametersComparator = (p1, p2, forInputs) => {
    if (forInputs && p1.isRequired !== p2.isRequired) {
        return p1.isRequired ? -1 : 1;
    }
    const p1Label = (p1.label || p1.apiName || '').toLowerCase();
    const p2Label = (p2.label || p2.apiName || '').toLowerCase();
    return p1Label.localeCompare(p2Label);
};

const createField = properties => {
    properties.field = createTestScreenField(
        'lcField',
        'Extension',
        DESCRIPTOR_NAME
    );
    properties.field.inputParameters = JSON.parse(
        JSON.stringify(INPUT_PARAMETERS)
    );
    properties.field.outputParameters = JSON.parse(
        JSON.stringify(OUTPUT_PARAMETERS)
    );
};

const createDescription = properties => {
    properties.extensionDescription = {
        name: DESCRIPTOR_NAME,
        inputParameters: JSON.parse(JSON.stringify(DESCRIPTOR_PARAMETERS)), // Hacky deep cloning
        outputParameters: JSON.parse(JSON.stringify(DESCRIPTOR_PARAMETERS)) // Hacky deep cloning
    };
};

function createComponentForTest(properties) {
    const el = createElement(
        'builder_platform_interaction-screen-extension-properties-editor',
        { is: ScreenExtensionPropertiesEditor }
    );
    Object.assign(el, properties);
    document.body.appendChild(el);
    return el;
}

const createComponentForTestWithProperties = () => {
    const el = createElement(
        'builder_platform_interaction-screen-extension-properties-editor',
        { is: ScreenExtensionPropertiesEditor }
    );
    const properties = {};
    createField(properties);
    createDescription(properties);
    Object.assign(el, { processType: 'something' });
    Object.assign(el, properties);
    document.body.appendChild(el);
    return el;
};

const runTest = (
    createFieldRequired,
    createDescriptionRequired,
    propertiesProcessor,
    testCallback
) => {
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
    return Promise.resolve().then(() => {
        testCallback(extensionEditor);
    });
};

const testEditors = (selector, propertyName) => {
    let props = null;
    const propertiesProcessor = properties => {
        props = properties;
    };

    return runTest(true, true, propertiesProcessor, extensionEditor => {
        const attEditors = query(extensionEditor, selector, true);
        expect(attEditors).toHaveLength(DESCRIPTOR_PARAMETERS.length);
        let descParams = props.extensionDescription[propertyName];
        expect(attEditors).toHaveLength(descParams.length);

        // Check there's an attribute editor per parameter in the extension Descriptor and that the attribute and the descriptor match for every editor
        let fieldParams = props.field[propertyName];
        attEditors.forEach(attEditor => {
            if (attEditor.attribute) {
                expect(attEditor.attribute.name.value).toEqual(
                    attEditor.descriptor.apiName
                );
                const fieldParamsCount = fieldParams.length;
                fieldParams = fieldParams.filter(
                    fieldParam =>
                        fieldParam.name.value !== attEditor.attribute.name.value
                );
                expect(fieldParams).toHaveLength(fieldParamsCount - 1); // Make sure we only removed 1
            }

            const descParamsCount = descParams.length;
            descParams = descParams.filter(
                descParam => descParam.apiName !== attEditor.descriptor.apiName
            );
            expect(descParams).toHaveLength(descParamsCount - 1); // Make sure we only removed 1
        });

        expect(fieldParams).toHaveLength(0);
        expect(descParams).toHaveLength(0);
    });
};

describe('Screen Extension Properties Editor', () => {
    it('does not render its container when the field is not set', () => {
        return runTest(false, true, null, editor => {
            expect(query(editor, SELECTORS.CONTAINER_DIV)).toBeNull();
        });
    });

    it('renders its container when the field is set', () => {
        return runTest(true, true, null, editor => {
            expect(query(editor, SELECTORS.CONTAINER_DIV)).not.toBeNull();
        });
    });

    it('only renders its container when the extension description is not set', () => {
        return runTest(true, false, null, editor => {
            const containerDiv = query(editor, SELECTORS.CONTAINER_DIV);
            expect(containerDiv.childElementCount).toBe(0);
        });
    });

    it('displays name, input and output parameters', () => {
        return runTest(true, true, null, editor => {
            expect(query(editor, SELECTORS.NAME_FIELD)).not.toBeNull();
            expect(query(editor, SELECTORS.INPUT_EDITOR, true)).toHaveLength(
                DESCRIPTOR_PARAMETERS.length
            );
            expect(query(editor, SELECTORS.OUTPUTS_SECTION)).not.toBeNull();
            expect(query(editor, SELECTORS.OUTPUT_EDITOR, true)).toHaveLength(
                DESCRIPTOR_PARAMETERS.length
            );
        });
    });

    it('does not render the outputs section if the component does not have any output attributes', () => {
        const propertiesProcessor = properties => {
            properties.extensionDescription.outputParameters = [];
            properties.field.outputParameters = [];
        };

        return runTest(true, true, propertiesProcessor, editor => {
            expect(query(editor, SELECTORS.OUTPUTS_SECTION)).toBeNull();
        });
    });

    it('sorts input parameters by requirenesss and name', () => {
        return runTest(true, true, null, editor => {
            const inputs = query(editor, SELECTORS.INPUT_EDITOR, true);
            expect(inputs).toHaveLength(DESCRIPTOR_PARAMETERS.length);

            const names = inputs.map(
                input => input.descriptor.label || input.descriptor.apiName
            );
            const expectedNames = DESCRIPTOR_PARAMETERS.sort((p1, p2) =>
                parametersComparator(p1, p2, true)
            ).map(p => p.label || p.apiName);
            expect(names).toEqual(expectedNames);
        });
    });

    it('sorts output parameters alphabetically', () => {
        return runTest(true, true, null, editor => {
            const outputs = query(editor, SELECTORS.OUTPUT_EDITOR, true);
            expect(outputs).toHaveLength(DESCRIPTOR_PARAMETERS.length);

            const names = outputs.map(
                input => input.descriptor.label || input.descriptor.apiName
            );
            const expectedNames = DESCRIPTOR_PARAMETERS.sort((p1, p2) =>
                parametersComparator(p1, p2, false)
            ).map(p => p.label || p.apiName);
            expect(names).toEqual(expectedNames);
        });
    });

    it('can handle multiple mappings for an output parameter', () => {
        const propertiesProcessor = properties => {
            properties.field.outputParameters.push(
                properties.field.outputParameters[0]
            ); // Add second mapping for first parameter
        };

        return runTest(true, true, propertiesProcessor, editor => {
            expect(query(editor, SELECTORS.OUTPUTS_SECTION)).not.toBeNull();
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
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(() => {
                return 'Supported';
            });
            const extensionEditor = createComponentForTestWithProperties();

            return Promise.resolve().then(() => {
                const useAdvancedOptionsCheckbox = getAdvancedOptionCheckbox(
                    extensionEditor
                );
                expect(useAdvancedOptionsCheckbox).toBeDefined();
                expect(useAdvancedOptionsCheckbox.checked).toBe(false);
            });
        });
        it('does not show up Use Advanced Options when Automated Output disabled', () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(() => {
                return 'Unsupported';
            });
            const extensionEditor = createComponentForTestWithProperties();

            return Promise.resolve().then(() => {
                expect(
                    getUseAdvancedOptionComponent(extensionEditor)
                ).toBeNull();
            });
        });
        it('handles use advanced option checkbox event', () => {
            mockGetProcessTypeAutomaticOutPutHandlingSupport = jest.fn(() => {
                return 'Supported';
            });
            const extensionEditor = createComponentForTestWithProperties();
            const expectedEvent = new UseAdvancedOptionsSelectionChangedEvent(
                true
            );

            return Promise.resolve().then(async () => {
                getUseAdvancedOptionComponent(extensionEditor).dispatchEvent(
                    expectedEvent
                );

                await Promise.resolve();
                expect(screenExtensionPropertiesReducer).toHaveBeenCalled();
                expect(
                    screenExtensionPropertiesReducer.mock.calls[0][0]
                ).toMatchObject({
                    extensionDescription: {
                        inputParameters: expect.anything(),
                        outputParameters: expect.anything()
                    },
                    outputParameters: expect.anything(),
                    storeOutputAutomatically: true
                });
                expect(
                    screenExtensionPropertiesReducer.mock.calls[0][1].detail
                ).toMatchObject({
                    useAdvancedOptions: true
                });
            });
        });
    });
});
