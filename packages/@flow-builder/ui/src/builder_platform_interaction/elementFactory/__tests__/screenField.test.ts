// @ts-nocheck
import {
    createScreenField,
    createDuplicateNestedScreenFields,
    createScreenFieldWithFieldReferences,
    createScreenFieldMetadataObject,
    createEmptyScreenFieldOfType,
    createScreenFieldWithFields
} from '../screenField';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getProcessTypeAutomaticOutPutHandlingSupport } from 'builder_platform_interaction/processTypeLib';
import { getColumnFieldType, InputsOnNextNavToAssocScrnOption } from 'builder_platform_interaction/screenEditorUtils';
import * as contextLibMock from 'builder_platform_interaction/contextLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';

expect.extend(deepFindMatchers);

const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = 'flow';
const componentScreenFieldEmailStoreGuid = '0ca39158-9508-4b85-b1b6-28564b4ba4c0';

jest.mock('builder_platform_interaction/contextLib', () => {
    return Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
        orgHasFlowScreenSections: jest.fn()
    });
});
jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING: actual.FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn()
    };
});

jest.mock('builder_platform_interaction/storeLib', () => {
    const getCurrentState = function () {
        return {
            properties: {
                processType: MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
            }
        };
    };
    const getStore = function () {
        return {
            getCurrentState
        };
    };
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn()
    };
});

const mockGetScreenFieldTypeByNameEmail = () => ({
    category: 'Input',
    description: 'Email Component',
    fieldType: 'ComponentInstance',
    genericTypes: undefined,
    icon: 'standard:email',
    label: 'Email',
    marker: undefined,
    name: 'flowruntime:email',
    source: 'server'
});

jest.mock('builder_platform_interaction/screenEditorUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/screenEditorUtils');
    return Object.assign({}, actual, {
        getScreenFieldTypeByName: jest.fn().mockImplementation((name) => {
            if (name === 'Column') {
                return actual.getScreenFieldTypeByName(name);
            } else if (name === 'Section') {
                return actual.getScreenFieldTypeByName(name);
            }
            return mockGetScreenFieldTypeByNameEmail();
        })
    });
});

const componentScreenFieldMetadata = {
    choiceReferences: [],
    extensionName: 'flowruntime:email',
    fields: [],
    fieldType: 'ComponentInstance',
    dataTypeMappings: [
        {
            typeName: 'T',
            typeValue: 'Asset'
        }
    ],
    inputParameters: [
        {
            name: 'placeholder',
            value: {
                stringValue: 'your email address'
            }
        }
    ],
    visibilityRule: {
        conditionLogic: 'and',
        conditions: [
            {
                operator: 'EqualTo'
            }
        ]
    },
    isRequired: true,
    name: 'myEmail',
    outputParameters: [],
    scale: 0
};

const componentAutomaticOutputScreenFieldMetadata = () => ({
    ...componentScreenFieldMetadata,
    storeOutputAutomatically: true
});

const componentAutomaticOutputScreenFieldMetadataWithResetValuesOnNext = () => {
    const comp = componentAutomaticOutputScreenFieldMetadata();
    comp.inputsOnNextNavToAssocScrn = InputsOnNextNavToAssocScrnOption.RESET_VALUES;
    return comp;
};

const componentScreenFieldEmailMetadata = () => ({
    choiceReferences: [],
    extensionName: 'flowruntime:email',
    fields: [],
    fieldType: 'ComponentInstance',
    inputParameters: [
        {
            name: 'placeholder',
            value: {
                stringValue: 'your email address'
            }
        }
    ],
    visibilityRule: {
        conditionLogic: 'and',
        conditions: [
            {
                operator: 'EqualTo'
            }
        ]
    },
    isRequired: true,
    name: 'myEmail',
    outputParameters: [],
    scale: 0
});

const sectionScreenFieldMetadata = () => ({
    choiceReferences: [],
    dataType: undefined,
    fieldText: undefined,
    fieldType: 'RegionContainer',
    fields: [componentScreenFieldEmailMetadata()],
    helpText: undefined,
    inputParameters: undefined,
    isRequired: undefined,
    name: 'section',
    outputParameters: undefined,
    scale: undefined
});

const componentScreenFieldEmailStore = () => ({
    guid: componentScreenFieldEmailStoreGuid,
    name: 'myEmail',
    choiceReferences: [],
    dataType: undefined,
    defaultSelectedChoiceReference: undefined,
    defaultValue: '',
    defaultValueDataType: undefined,
    defaultValueIndex: '60c55df3-dd55-49de-80ae-f1ed8c294e11',
    elementType: 'SCREEN_FIELD',
    extensionName: 'flowruntime:email',
    fields: [],
    fieldText: '',
    fieldType: 'ComponentInstance',
    helpText: '',
    inputParameters: [
        {
            rowIndex: '0bd35e51-fa6e-4694-8ea3-4f31e6ec7e02',
            name: 'placeholder',
            value: 'your email address',
            valueDataType: 'String'
        }
    ],
    isNewField: false,
    isRequired: true,
    isVisible: undefined,
    outputParameters: [],
    scale: '0',
    storeOutputAutomatically: false,
    visibilityRule: {
        conditionLogic: 'and',
        conditions: [
            {
                operator: 'EqualTo'
            }
        ]
    }
});

const componentAutomaticOutputScreenFieldStore = () => ({
    guid: '06001014-dce2-4206-add3-d73bdcc38174',
    name: 'myEmail',
    choiceReferences: [],
    dataType: 'LightningComponentOutput',
    defaultValue: '',
    defaultValueIndex: '5d457ada-a9de-41b0-8225-847942f4f69b',
    validationRule: {
        formulaExpression: null,
        errorMessage: null
    },
    extensionName: 'flowruntime:email',
    fields: [],
    fieldType: 'ComponentInstance',
    fieldText: '',
    helpText: '',
    dynamicTypeMappings: [
        {
            typeName: 'T',
            typeValue: 'Asset'
        }
    ],
    inputParameters: [
        {
            rowIndex: '9950e933-80b8-4352-b1d1-3c186f502765',
            name: 'placeholder',
            value: 'your email address',
            valueDataType: 'String'
        }
    ],
    isNewField: false,
    isRequired: true,
    outputParameters: [],
    scale: '0',
    type: {
        name: 'flowruntime:email',
        fieldType: 'ComponentInstance',
        label: 'flowruntime:email',
        icon: 'standard:lightning_component',
        source: 'local'
    },
    elementType: 'SCREEN_FIELD',
    visibilityRule: {
        conditionLogic: 'and',
        conditions: [
            {
                operator: 'EqualTo'
            }
        ]
    },
    storeOutputAutomatically: true
});

const componentAutomaticOutputScreenFieldStoreWithUseStoredValuesOnNext = () => {
    const comp = componentAutomaticOutputScreenFieldStore();
    comp.inputsOnNextNavToAssocScrn = InputsOnNextNavToAssocScrnOption.USE_STORED_VALUES;
    return comp;
};

const sectionScreenFieldStore = () => ({
    guid: 'section',
    name: 'section',
    choiceReferences: [],
    fields: [],
    childReferences: [{ childReference: componentScreenFieldEmailStoreGuid }],
    fieldType: 'RegionContainer',
    isNewField: false,
    type: {
        name: 'Section',
        fieldType: 'RegionContainer'
    },
    elementType: 'SCREEN_FIELD',
    visibilityRule: {
        conditions: []
    }
});

const foundElementGuidPrefix = 'found';
getElementByGuid.mockImplementation((guid) => {
    if (guid === componentScreenFieldEmailStoreGuid) {
        return componentScreenFieldEmailStore();
    }
    return {
        guid: foundElementGuidPrefix + guid,
        fieldType: 'InputField',
        dataType: 'Boolean'
    };
});

describe('screenField', () => {
    describe('Add new Component on the screen (createEmptyScreenFieldOfType)', () => {
        describe('LC screen field (automatic output handling supported)', () => {
            let actualResult;
            beforeEach(() => {
                getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Supported');
                actualResult = createEmptyScreenFieldOfType('flowruntime:email');
            });
            it('"storeOutputAutomatically" should be true', () => {
                expect(actualResult.storeOutputAutomatically).toBe(true);
            });
        });
        describe('LC screen field (automatic output handling unsupported)', () => {
            let actualResult;
            beforeEach(() => {
                getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Unsupported');
                actualResult = createEmptyScreenFieldOfType('flowruntime:email');
            });
            it('"storeOutputAutomatically" should be false', () => {
                expect(actualResult.storeOutputAutomatically).toBe(false);
            });
        });
        describe('section field', () => {
            it('is created for type with name "Section"', () => {
                contextLibMock.orgHasFlowScreenSections.mockReturnValue(true);
                const result = createEmptyScreenFieldOfType('Section');

                expect(result.name).toEqual('Section1');
            });
        });
        describe('column field', () => {
            it('is created for type with name "Column"', () => {
                const result = createEmptyScreenFieldOfType(getColumnFieldType().name);

                expect(result).toMatchObject({
                    name: 'NewColumn',
                    fieldText: '',
                    fieldType: 'Region',
                    fields: [],
                    inputParameters: [
                        expect.objectContaining({
                            name: 'width',
                            value: '',
                            valueDataType: FLOW_DATA_TYPE.STRING.value
                        })
                    ]
                });
            });
        });
        describe('"inputsOnNextNavToAssocScrn"', () => {
            it('defaut value is UseStoredValues', () => {
                const actualResult = createEmptyScreenFieldOfType('flowruntime:email');
                expect(actualResult.inputsOnNextNavToAssocScrn).toEqual(
                    InputsOnNextNavToAssocScrnOption.USE_STORED_VALUES
                );
            });
        });
    });
    describe('screenField flow metadata => UI model', () => {
        describe('LC screen field with automatic output handling', () => {
            let screenFieldMetadata;
            beforeEach(() => {
                screenFieldMetadata = componentAutomaticOutputScreenFieldMetadata();
                getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Supported');
            });
            it('has no common mutable object with screen field metadata passed as parameter', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult).toHaveNoCommonMutableObjectWith(screenFieldMetadata);
            });
            it('"outputParameters" should be an empty array', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.outputParameters).toEqual([]);
            });
            it('should have a LIGHTNING_COMPONENT_OUTPUT datatype', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.dataType).toBe(FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value);
                expect(actualResult.isCollection).toBeFalsy();
                expect(actualResult.subtype).toBeFalsy();
            });
            it('"storeOutputAutomatically" should be true', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.storeOutputAutomatically).toBe(true);
            });
            it('should have one type mapping', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult).toHaveProperty('dynamicTypeMappings');
                expect(actualResult.dynamicTypeMappings).toHaveLength(1);
                expect(actualResult.dynamicTypeMappings[0]).toMatchObject({
                    typeName: 'T',
                    typeValue: 'Asset'
                });
            });
        });
        describe('"inputsOnNextNavToAssocScrn"', () => {
            it('is translated as "UseStoredValues" when not set', () => {
                const screenFieldMetadata = componentAutomaticOutputScreenFieldMetadataWithResetValuesOnNext();
                delete screenFieldMetadata.inputsOnNextNavToAssocScrn;
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.inputsOnNextNavToAssocScrn).toEqual(
                    InputsOnNextNavToAssocScrnOption.USE_STORED_VALUES
                );
            });
            it('value is preserved when set', () => {
                const screenFieldMetadata = componentAutomaticOutputScreenFieldMetadataWithResetValuesOnNext();
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.inputsOnNextNavToAssocScrn).toEqual(InputsOnNextNavToAssocScrnOption.RESET_VALUES);
            });
        });
        describe('LC screen field (automatic output handling not supported)', () => {
            let screenFieldMetadata;
            beforeEach(() => {
                screenFieldMetadata = componentScreenFieldEmailMetadata();
                getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Unsupported');
            });
            it('"outputParameters" should be an empty array', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.outputParameters).toEqual([]);
            });
            it('should have a datatype undefined', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.dataType).toBeUndefined();
                expect(actualResult.isCollection).toBeFalsy();
                expect(actualResult.subtype).toBeFalsy();
            });
            it('"storeOutputAutomatically" should be false', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult.storeOutputAutomatically).toBe(false);
            });
            it('has no dynamic type mappings', () => {
                const actualResult = createScreenField(screenFieldMetadata);
                expect(actualResult).not.toHaveProperty('dynamicTypeMappings');
            });
        });
        describe('section field', () => {
            let screenFieldMetadata;
            beforeEach(() => {
                screenFieldMetadata = sectionScreenFieldMetadata();
            });
            it('should have a datatype undefined', () => {
                const actualResult = createScreenFieldWithFieldReferences(screenFieldMetadata);
                expect(actualResult.dataType).toBeUndefined();
                expect(actualResult.isCollection).toBeFalsy();
                expect(actualResult.subtype).toBeFalsy();
                expect(actualResult.childReferences).toHaveLength(1);
            });
        });
    });
    describe('Creating duplicated screen fields', () => {
        it('screen fields without any nested fields', () => {
            const result = createDuplicateNestedScreenFields({
                guid: 'screenField1',
                fieldType: 'InputField',
                dataType: 'Boolean'
            });
            expect(result[0]).toMatchObject({
                guid: 'screenField1',
                fieldType: 'InputField',
                dataType: 'Boolean'
            });
        });
        it('screen fields with any nested fields (Sections and Columns)', () => {
            const sectionField = {
                guid: 'sectionField1',
                fieldType: 'RegionContainer',
                childReferences: [{ childReference: 'columnField' }]
            };

            const result = createDuplicateNestedScreenFields(sectionField);
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                guid: 'foundcolumnField',
                fieldType: 'InputField',
                dataType: 'Boolean'
            });

            expect(result[1]).toMatchObject({
                guid: 'sectionField1',
                fieldType: 'RegionContainer',
                dataType: undefined
            });
        });
    });
    describe('screenField UI Model => screenEditor', () => {
        describe('section field', () => {
            it('has child fields', () => {
                const result = createScreenFieldWithFields(sectionScreenFieldStore());
                expect(result.fields).toHaveLength(1);
                expect(result.fields[0].name).toEqual('myEmail');
            });
        });
    });
    describe('screenField UI model => flow metadata', () => {
        describe('LC screen field with automatic output handling support', () => {
            beforeEach(() => {
                getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Supported');
            });
            describe('screen field with store output automatically', () => {
                it('converts to flow metadata', () => {
                    const actualResult = createScreenFieldMetadataObject(componentAutomaticOutputScreenFieldStore());

                    expect(actualResult).toMatchObject(componentAutomaticOutputScreenFieldMetadata());
                });
                it('has no common mutable object with screen field from store passed as parameter', () => {
                    const screenFieldStore = componentAutomaticOutputScreenFieldStore();
                    const actualResult = createScreenFieldMetadataObject(screenFieldStore);
                    expect(actualResult).toHaveNoCommonMutableObjectWith(screenFieldStore);
                });
                it('has dynamic type mappings', () => {
                    const actualResult = createScreenFieldMetadataObject(componentAutomaticOutputScreenFieldStore());
                    expect(actualResult).toHaveProperty('dataTypeMappings');
                    expect(actualResult.dataTypeMappings).toHaveLength(1);
                    expect(actualResult.dataTypeMappings[0]).toEqual({
                        typeName: 'T',
                        typeValue: 'Asset'
                    });
                });
            });
            describe('screen field with manual output', () => {
                let screenFieldWithManualOutput;
                beforeEach(() => {
                    screenFieldWithManualOutput = componentAutomaticOutputScreenFieldStore();
                    screenFieldWithManualOutput.storeOutputAutomatically = false;
                });
                it('ScreenField with empty manual value should be filtered to not appear in the output parameter list', () => {
                    screenFieldWithManualOutput.outputParameters = [
                        {
                            name: 'value',
                            rowIndex: '60441777-29c3-42ed-935c-adf0b0176f0a',
                            value: '',
                            valueDataType: 'reference'
                        }
                    ];
                    const actualResult = createScreenFieldMetadataObject(screenFieldWithManualOutput);
                    expect(actualResult.outputParameters).toHaveLength(0);
                });
                it('convert to flow metadata', () => {
                    const actualResult = createScreenFieldMetadataObject(screenFieldWithManualOutput);
                    expect(actualResult).toMatchObject(componentScreenFieldMetadata);
                    expect(actualResult.storeOutputAutomatically).toBe(false);
                });
            });
        });
        describe('LC screen field (automatic output handling not supported)', () => {
            beforeAll(() => {
                getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue('Unsupported');
            });
            it('convert to flow metadata', () => {
                const actualResult = createScreenFieldMetadataObject(componentScreenFieldEmailStore());
                expect(actualResult).toMatchObject(componentScreenFieldEmailMetadata());
                expect(actualResult.storeOutputAutomatically).not.toBeDefined();
                expect(actualResult).not.toHaveProperty('dataTypeMappings');
            });
            it('convert to flow metadata should remove the storeOutputAutomatically if processType does not support it', () => {
                const actualResult = createScreenFieldMetadataObject(componentAutomaticOutputScreenFieldStore());
                expect(actualResult).toMatchObject(componentScreenFieldEmailMetadata());
                expect(actualResult.storeOutputAutomatically).not.toBeDefined();
            });
        });
        describe('section field', () => {
            let screenFieldStore;
            beforeAll(() => {
                screenFieldStore = sectionScreenFieldStore();
            });
            it('convert to flow metadata', () => {
                const actualResult = createScreenFieldMetadataObject(screenFieldStore);
                expect(actualResult).toMatchObject(sectionScreenFieldMetadata());
            });
        });
        describe('"inputsOnNextNavToAssocScrn"', () => {
            it('is properly saved in flow metadata when set', () => {
                const actualResult = createScreenFieldMetadataObject(
                    componentAutomaticOutputScreenFieldStoreWithUseStoredValuesOnNext()
                );
                expect(actualResult.inputsOnNextNavToAssocScrn).toEqual(
                    InputsOnNextNavToAssocScrnOption.USE_STORED_VALUES
                );
            });
        });
    });
});
