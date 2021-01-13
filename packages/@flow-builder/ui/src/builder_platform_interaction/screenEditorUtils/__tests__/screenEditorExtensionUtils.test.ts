// @ts-nocheck
import {
    processRequiredParamsForExtensionsInScreen,
    processScreenExtensionTypes
} from 'builder_platform_interaction/screenEditorUtils';
import { createTestScreen, createTestScreenField } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid(guid) {
            const values = guid.split('--');
            if (values.length === 2) {
                const type = values[0];
                const name = values[1];
                return {
                    dataType: type,
                    elementType: 'VARIABLE',
                    guid,
                    isCanvasElement: false,
                    isCollection: false,
                    name
                };
            }
            // getElementByGuid returns undefined if no element can be found, this is by design
            return undefined;
        },
        getElementByDevName: jest.fn(),
        getDuplicateDevNameElements: jest.fn(),
        isDevNameInStore: jest.fn(),
        getProcessType: jest.fn(),
        getTriggerType: jest.fn(),
        shouldUseAutoLayoutCanvas: jest.fn()
    };
});

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/flowExtensionLib');
    return {
        getAllCachedExtensionTypes: () => {
            return [
                {
                    name: 'c:fakeCmpName1',
                    fieldType: 'ComponentInstance',
                    dataType: undefined,
                    label: 'Fake Component 1',
                    icon: 'utility:type_tool',
                    category: 'Input',
                    source: 'local'
                },
                {
                    name: 'c:fakeCmpName2',
                    fieldType: 'ComponentInstance',
                    dataType: undefined,
                    label: 'Fake Component 2',
                    icon: 'utility:type_tool',
                    category: 'Input'
                }
            ];
        },
        getCachedExtensions: (names) => {
            const cachedExtensions = [];
            names.forEach((name) => {
                cachedExtensions.push({
                    name,
                    inputParameters: [{ apiName: name + 'input1', isRequired: true, defaultValue: null }]
                });
            });
            return cachedExtensions;
        },
        getCachedExtensionType(fieldName) {
            if (fieldName !== 'localExtension') {
                return fieldName;
            }
            return undefined;
        },
        EXTENSION_TYPE_SOURCE: actual.EXTENSION_TYPE_SOURCE
    };
});

describe('processRequiredParamsForExtensionsInScreen function', () => {
    let screen;
    beforeEach(() => {
        screen = createTestScreen('Screen1', null);
        const lcField = createTestScreenField('lcfield1', 'Extension', 'c:fakeCmpName1');
        screen.fields.push(lcField);
    });
    it('adds the required input params to each LC field when there are two LC fields, each using a different component', () => {
        const lcField2 = createTestScreenField('lcfield2', 'Extension', 'c:fakeCmpName2');
        screen.fields.push(lcField2);
        processRequiredParamsForExtensionsInScreen(screen);
        const fields = screen.fields;
        expect(fields[8].inputParameters[1]).toBeDefined();
        expect(fields[8].inputParameters[1].name).toBeDefined();
        expect(fields[8].inputParameters[1].name.value).toBe('c:fakeCmpName1input1');
        expect(fields[9].inputParameters[1]).toBeDefined();
        expect(fields[9].inputParameters[1].name).toBeDefined();
        expect(fields[9].inputParameters[1].name.value).toBe('c:fakeCmpName2input1');
    });
    it('adds the required input params to each LC field when there are two LC fields, both for using the same component', () => {
        const lcField2 = createTestScreenField('lcfield2', 'Extension', 'c:fakeCmpName1');
        screen.fields.push(lcField2);
        processRequiredParamsForExtensionsInScreen(screen);
        const fields = screen.fields;
        expect(fields[8].inputParameters[1]).toBeDefined();
        expect(fields[8].inputParameters[1].name).toBeDefined();
        expect(fields[8].inputParameters[1].name.value).toBe('c:fakeCmpName1input1');
        expect(fields[9].inputParameters[1]).toBeDefined();
        expect(fields[9].inputParameters[1].name).toBeDefined();
        expect(fields[9].inputParameters[1].name.value).toBe('c:fakeCmpName1input1');
    });
});

describe('processScreenExtensionTypes function', () => {
    let screen;
    beforeEach(() => {
        screen = createTestScreen('Screen1', null);
    });
    it('extension available in local but not from server', () => {
        const lcField = createTestScreenField('lcfield1', 'Extension', 'localExtension');
        screen.fields.push(lcField);
        processScreenExtensionTypes(screen);
        expect(screen.error).toBeDefined();
        const fields = screen.fields;
        expect(fields[0].name.error).toBeDefined();
    });
    it('extension component available in local and retrieved from server', () => {
        const lcField1 = createTestScreenField('lcfield1', 'Extension', 'c:fakeCmpName1');
        screen.fields.push(lcField1);
        processScreenExtensionTypes(screen);
        expect(screen.error).toBeUndefined();
        const fields = screen.fields;
        expect(fields[0].name.error).toBe(null);
    });
});
