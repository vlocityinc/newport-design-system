import { createElement } from 'lwc';
import ScreenExtensionAttributeEditor from "builder_platform_interaction/ScreenExtensionAttributeEditor";
import { query } from "builder_platform_interaction/builderTestUtils";
import { EXTENSION_PARAM_PREFIX } from "builder_platform_interaction/screenEditorUtils";
import { PropertyChangedEvent } from "builder_platform_interaction/events";

jest.mock('builder_platform_interaction/outputResourcePicker', () => require('builder_platform_interaction_mocks/outputResourcePicker'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        getRulesForElementType: jest.fn().mockImplementation(() => []).mockName('getRulesForElementType'),
        RULE_TYPES: require.requireActual('builder_platform_interaction/ruleLib').RULE_TYPES,
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction/ruleLib').PARAM_PROPERTY,
    };
});

const SELECTORS = {
    ICON: 'lightning-icon',
    CONTAINER_DIV: 'div.container',
    INPUT_DIV: 'div.input',
    OUTPUT_DIV: 'div.output',
    PADDING_DIV: 'div.padding',
    PROPERTY_FIELD: 'builder_platform_interaction-screen-property-field',
    HELP_TEXT: 'lightning-helptext'
};

const DESCRIPTORS = {
    ACCOUNT: {
        apiName: 'accountAttr',
        dataType: 'sobject',
        description: 'accountAttr description',
        hasDefaultValue: false,
        isRequired: false,
        label: 'Account Attribute',
        maxOccurs: 1,
        objectType: 'Account'
    },
    STRING: {
        apiName: 'stringAttr',
        dataType: 'string',
        defaultValue: 'Default value for stringAttr:',
        description: 'Description for stringAttr',
        hasDefaultValue: true,
        isRequired: false,
        label: 'String Attribute',
        maxOccurs: 1
    }
};

const ATTRIBUTES = {
    ACCOUNT: {
        name: {value: DESCRIPTORS.ACCOUNT.apiName, error: null},
        value: {value: '{!acccontVar}', error: null},
        valueDataType: 'Account'
    },
    STRING: {
        name: {value: DESCRIPTORS.STRING.apiName, error: null},
        value: {value: 'Enter name', error: null},
        valueDataType: 'String'
    }
};

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-extension-attribute-editor', { is: ScreenExtensionAttributeEditor });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

const runTest = (createInput, createOutput, propertiesProcessor, test) => {
    const inputProperties = createInput ? { descriptor: Object.assign({}, DESCRIPTORS.STRING), attribute: Object.assign({}, ATTRIBUTES.STRING),  attributeType: 'input', index: 0 } : null;
    const outputProperties = createOutput ? { descriptor: Object.assign({}, DESCRIPTORS.ACCOUNT), attribute: Object.assign({}, ATTRIBUTES.ACCOUNT), attributeType: 'output', index: 0 } : null;

    if (propertiesProcessor) {
        propertiesProcessor(inputProperties, outputProperties);
    }

    const inputEditor = createInput ? createComponentForTest(inputProperties) : null;
    const outputEditor = createOutput ? createComponentForTest(outputProperties) : null;
    return Promise.resolve().then(() => {
        test(inputEditor, outputEditor);
    });
};

const testResourcePickerConfigAllowLiterals = (propertyProcessor, expectedValue) => {
    return runTest(true, false, propertyProcessor, (editor) => {
        const field = query(editor, SELECTORS.PROPERTY_FIELD);
        expect(field).not.toBeNull();
        expect(field.resourcePickerConfig.allowLiterals).toBe(expectedValue);
    });
};

describe('Screen Extension Attribute Editor', () => {
    it('does not render container when the descriptor is not set', () => {
        const propertyProcessor = (inputProperties) => {
            delete inputProperties.descriptor;
            delete inputProperties.attribute;
        };

        return runTest(true, false, propertyProcessor, (editor) => {
            expect(query(editor, SELECTORS.CONTAINER_DIV)).toBeNull();
        });
    });

    it('renders container when the descriptor is set', () => {
        return runTest(true, false, null, (inputEditor) => {
            expect(query(inputEditor, SELECTORS.CONTAINER_DIV)).not.toBeNull();
        });
    });

    it('displays the correct section based on attributeType', () => {
        return runTest(true, true, null, (inputEditor, outputEditor) => {
            expect(query(inputEditor, SELECTORS.INPUT_DIV)).not.toBeNull();
            expect(query(inputEditor, SELECTORS.OUTPUT_DIV)).toBeNull();
            expect(query(outputEditor, SELECTORS.INPUT_DIV)).toBeNull();
            expect(query(outputEditor, SELECTORS.OUTPUT_DIV)).not.toBeNull();
        });
    });

    it('does not display an icon for input attributes', () => {
        return runTest(true, false, null, (inputEditor) => {
            expect(query(inputEditor, SELECTORS.INPUT_DIV + ' ' + SELECTORS.ICON)).toBeNull();
        });
    });

    it('displays an icon for output attributes', () => {
        return runTest(false, true, null, (_, outputEditor) => {
            expect(query(outputEditor, SELECTORS.OUTPUT_DIV + ' ' + SELECTORS.ICON, true)).toHaveLength(1);
        });
    });

    it('displays a padding div for outputs with indices > 1', () => {
        const propertyProcessor = (_, outputProperties) => {
            outputProperties.index = 1;
        };

        return runTest(false, true, propertyProcessor, (_, outputEditor) => {
            const paddingDivs = query(outputEditor, SELECTORS.PADDING_DIV, true);
            expect(paddingDivs).toHaveLength(1);
            expect(paddingDivs[0].className).toEqual(expect.stringContaining('slds-p-top_xx-small'));
        });
    });

    it('does not display a padding div for outputs with index = 0', () => {
        return runTest(true, false, null, (outputEditor) => {
            expect(query(outputEditor, SELECTORS.PADDING_DIV, true)).toHaveLength(0);
        });
    });

    it('sets the right values in the screen property field for inputs', () => {
        return runTest(true, false, null, (inputEditor) => {
            const propertyField = query(inputEditor, SELECTORS.PROPERTY_FIELD);
            expect(propertyField).not.toBeNull();
            expect(propertyField.allowResourcesForParameter).toBe(true);
            expect(propertyField.allowResourcesForOutput).toBeFalsy();
            expect(propertyField.getAttribute('data-param-type')).toBe('input');
            expect(propertyField.helpText).toBe(DESCRIPTORS.STRING.description);
            expect(propertyField.label).toBe(DESCRIPTORS.STRING.label);
            expect(propertyField.name).toBe(DESCRIPTORS.STRING.apiName);
            expect(propertyField.required).toBe(DESCRIPTORS.STRING.isRequired);
            expect(propertyField.type).toBe(DESCRIPTORS.STRING.dataType);
            expect(propertyField.value).toMatchObject(ATTRIBUTES.STRING.value);
        });
    });

    it('sets the right values in the screen property field for outputs', () => {
        return runTest(false, true, null, (_, outputEditor) => {
            const propertyField = query(outputEditor, SELECTORS.PROPERTY_FIELD);
            expect(propertyField).not.toBeNull();
            expect(propertyField.allowResourcesForParameter).toBeFalsy();
            expect(propertyField.allowResourcesForOutput).toBe(true);
            expect(propertyField.hideTopPadding).toBe(true);
            expect(propertyField.getAttribute('data-param-type')).toBe('output');
            expect(propertyField.label).toBe(DESCRIPTORS.ACCOUNT.label);
            expect(propertyField.name).toBe(DESCRIPTORS.ACCOUNT.apiName);
            expect(propertyField.required).toBeFalsy();
            expect(propertyField.type).toBe(DESCRIPTORS.ACCOUNT.dataType);
            expect(propertyField.value).toMatchObject(ATTRIBUTES.ACCOUNT.value);
        });
    });

    it('displays helpText when the attribute descriptor provides a description', () => {
        return runTest(true, false, null, (inputEditor) => {
            expect(query(inputEditor, SELECTORS.HELP_TEXT)).not.toBeNull();
        });
    });

    it('does not display helpText when the attribute descriptor does not provide a description', () => {
        const propertyProcessor = (inputProperties) => {
            delete inputProperties.descriptor.description;
        };

        return runTest(true, false, propertyProcessor, (inputEditor) => {
            expect(query(inputEditor, SELECTORS.HELP_TEXT)).toBeNull();
        });
    });

    it('creates the resource picker configuration correctly', () => {
        const propertyProcessor = (_, outputProperties) => {
            outputProperties.descriptor.maxOccurs = 3;
        };

        const testChecker = (editor, allowLiterals, collection, elementConfig, hideGlobalConstants, hideNewResource, objectType) => {
            const field = query(editor, SELECTORS.PROPERTY_FIELD);
            expect(field).not.toBeNull();
            const config = field.resourcePickerConfig;
            expect(config.allowLiterals).toBe(allowLiterals);
            expect(config.collection).toBe(collection);
            expect(config.elementConfig).toBe(elementConfig);
            expect(config.hideGlobalConstants).toBe(hideGlobalConstants);
            expect(config.hideNewResource).toBe(hideNewResource);
            expect(config.objectType).toBe(objectType);
        };

        return runTest(true, true, propertyProcessor, (inputEditor, outputEditor) => {
            testChecker(inputEditor, true, false, null, false, false, undefined);
            testChecker(outputEditor, false, true, null, true, false, DESCRIPTORS.ACCOUNT.objectType);
        });
    });

    it('sets allowsLiterals to true for inputs of type other than sobject', () => {
        // input, string, maxoccurs = 1
        return testResourcePickerConfigAllowLiterals(null, true);
    });

    it('sets allowsLiterals to false for outputs regardless of type', () => {
        const propertyProcessor = (inputProperties) => {
            inputProperties.attributeType = 'output'; // output, string, maxoccurs = 1
        };

        return testResourcePickerConfigAllowLiterals(propertyProcessor, false);
    });

    it('sets allowsLiterals to false for maxoccurs > 1', () => {
        const propertyProcessor = (inputProperties) => {
            inputProperties.descriptor.maxOccurs = 2; // input, string, maxoccurs = 2
        };

        return testResourcePickerConfigAllowLiterals(propertyProcessor, false);
    });

    it('sets allowsLiterals to false for sobjects', () => {
        const propertyProcessor = (inputProperties) => {
            inputProperties.descriptor.dataType = 'sobject'; // input, sobject, maxoccurs = 1
        };

        return testResourcePickerConfigAllowLiterals(propertyProcessor, false);
    });

    it('value returns defaultvalue for input parameters without a value', () => {
        const propertyProcessor = (inputProperties) => {
            inputProperties.attribute = null;
        };

        return runTest(true, false, propertyProcessor, (inputEditor) => {
            const propertyField = query(inputEditor, SELECTORS.PROPERTY_FIELD);
            expect(propertyField.value).toBe(DESCRIPTORS.STRING.defaultValue);
        });
    });

    it('label returns apiName if descriptor does not have a label', () => {
        const propertyProcessor = (inputProperties) => {
            delete inputProperties.descriptor.label;
        };

        return runTest(true, false, propertyProcessor, (inputEditor) => {
            const propertyField = query(inputEditor, SELECTORS.PROPERTY_FIELD);
            expect(propertyField.label).toBe(DESCRIPTORS.STRING.apiName);
        });
    });

    it('propertyChange event handler modifies the event correctly', () => {
        const ATT_INDEX = 3;
        const propertyProcessor = (_, outputProperties) => {
            outputProperties.attributeIndex = ATT_INDEX;
        };

        return runTest(false, true, propertyProcessor, (_, outputEditor) => {
            const containerDiv = query(outputEditor, SELECTORS.CONTAINER_DIV);

            let event;
            containerDiv.addEventListener(PropertyChangedEvent.EVENT_NAME, (evt) => {
                event = evt;
            });

            const propertyField = containerDiv.querySelector(SELECTORS.PROPERTY_FIELD);
            propertyField.dispatchEvent(new PropertyChangedEvent(propertyField.name, {value: '{!accountVar2}', error: null}, null, null, propertyField.value, 0));

            expect(event.detail.propertyName).toBe(EXTENSION_PARAM_PREFIX.OUTPUT + '.' + DESCRIPTORS.ACCOUNT.apiName);
            expect(event.detail.required).toBe(DESCRIPTORS.ACCOUNT.isRequired);
            expect(event.detail.valueDataType).toBe(DESCRIPTORS.ACCOUNT.dataType);
            expect(event.detail.attributeIndex).toBe(ATT_INDEX);
        });
    });
});
