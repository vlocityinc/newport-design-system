import {
    getElementsForMenuData,
    getEntitiesMenuData,
    getStoreElements,
    filterAndMutateMenuData,
    getEventTypesMenuData,
    getSecondLevelItems,
    getResourceTypesMenuData
} from '../menuDataRetrieval.js';
import {
    numberParamCanBeAnything,
    stringParam,
    booleanParam,
    stageParam
} from 'mock/ruleService';
import * as store from 'mock/storeData';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as selectorsMock from 'builder_platform_interaction/selectors';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getAllEntities } from 'builder_platform_interaction/sobjectLib';
import {
    GLOBAL_CONSTANTS as gcLabels,
    GLOBAL_CONSTANT_OBJECTS as gcObjects,
    SYSTEM_VARIABLE_PREFIX
} from 'builder_platform_interaction/systemLib';
import { LABELS } from '../expressionUtilsLabels';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import variablePluralLabel from '@salesforce/label/FlowBuilderElementConfig.variablePluralLabel';
import {
    platformEvent1ApiName,
    platformEvent1Label
} from 'mock/eventTypesData';
import {
    getEventTypes,
    getFieldsForEntity
} from 'builder_platform_interaction/sobjectLib';
import { setSystemVariables } from '../../../../jest-modules/builder_platform_interaction/systemLib/systemLib';
import { getSystemVariables } from '../../systemLib/systemLib';
import { getPropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import { systemVariables } from 'mock/systemGlobalVars';
import { mockFlowRuntimeEmailFlowExtensionDescription } from 'mock/flowExtensionsData';
import { untilNoFailure } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const collectionVariable = LABELS.collectionVariablePluralLabel.toUpperCase();
const sobjectVariable = LABELS.sObjectPluralLabel.toUpperCase();
const sobjectCollectionVariable = LABELS.sObjectCollectionPluralLabel.toUpperCase();

/*
    Desired format output from getStoreElements
    [
        {
         label: "Collection Variable",
         items: [{collStrVar1}, {collStrVar2}]
        },
        {
         label: "SObject Variable",
         items: [{accVar1}]
        },
        {
         label: "Variable",
         items: [{numVar1}]
        },
        ...
    ]
 */

const sampleNumberParamTypes = {
    Number: [numberParamCanBeAnything],
    canBeSobjectField: true
};

const sampleStringParamTypes = {
    String: [stringParam]
};

const sampleBooleanParamTypes = {
    Boolean: [booleanParam]
};

const sampleStageParamTypes = {
    STAGE: [stageParam]
};

const parentSObjectItem = {
    dataType: FLOW_DATA_TYPE.SOBJECT.value,
    subtype: 'Account',
    displayText: 'recordVar'
};

const parentApexItem = {
    dataType: FLOW_DATA_TYPE.APEX.value,
    subtype: 'ApexClass',
    displayText: 'apexVar'
};

const parentLightningComponentScreenFieldItem = {
    dataType: FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value,
    displayText: 'emailComponent',
    value: store.emailScreenFieldAutomaticOutputGuid
};

jest.mock('builder_platform_interaction/apexTypeLib', () => {
    return {
        getPropertiesForClass: jest.fn()
    };
});

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    return {
        getCachedExtension: jest
            .fn()
            .mockImplementation(
                () => mockFlowRuntimeEmailFlowExtensionDescription
            )
    };
});

jest.mock('builder_platform_interaction/screenEditorUtils', () => {
    const actual = require.requireActual(
        '../../screenEditorUtils/screenEditorUtils.js'
    );
    return {
        getExtensionParamDescriptionAsComplexTypeFieldDescription:
            actual.getExtensionParamDescriptionAsComplexTypeFieldDescription
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    const sobjectLib = require.requireActual('../../sobjectLib/sobjectLib.js');
    return {
        getFieldsForEntity: jest
            .fn()
            .mockImplementation((entityName, callback) => {
                if (callback) {
                    callback(
                        require.requireActual('mock/serverEntityData')
                            .mockAccountFields
                    );
                }
            }),
        getAllEntities: jest.fn().mockImplementation(() => {
            return require.requireActual('mock/serverEntityData').mockEntities;
        }),
        getEventTypes: jest.fn().mockImplementation(() => {
            return require('mock/eventTypesData').mockEventTypes;
        }),
        ENTITY_TYPE: sobjectLib.ENTITY_TYPE
    };
});

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        writableElementsSelector: jest.fn(),
        sObjectOrSObjectCollectionByEntitySelector: jest.fn(),
        readableElementsSelector: jest.fn()
    };
});

jest.mock('builder_platform_interaction/dataTypeLib', () => {
    const actual = require.requireActual('../../dataTypeLib/dataTypeLib.js');
    const {
        ELEMENT_TYPE: elementType
    } = require('builder_platform_interaction/flowMetadata');
    return {
        getDataTypeLabel: actual.getDataTypeLabel,
        getDataTypeIcons: actual.getDataTypeIcons,
        FLOW_DATA_TYPE: actual.FLOW_DATA_TYPE,
        FEROV_DATA_TYPE: actual.FEROV_DATA_TYPE,
        isComplexType: actual.isComplexType,
        getFlowDataType: actual.getFlowDataType,
        getResourceTypes: jest.fn().mockImplementation(() => {
            return [
                { name: elementType.VARIABLE },
                { name: elementType.CONSTANT },
                { name: elementType.FORMULA }
            ];
        })
    };
});

jest.mock('builder_platform_interaction/elementLabelLib', () => {
    const actual = require.requireActual(
        '../../elementLabelLib/elementLabelLib.js'
    );
    return {
        getResourceLabel: jest
            .fn()
            .mockImplementation(resource => resource.name),
        getResourceCategory: actual.getResourceCategory
    };
});

describe('Menu data retrieval', () => {
    afterEach(() => {
        selectorsMock.writableElementsSelector.mockReset();
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReset();
        selectorsMock.readableElementsSelector.mockReset();
    });
    it('should sort alphabetically by category', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.numberVariableGuid],
            store.elements[store.accountSObjectVariableGuid],
            store.elements[store.stringCollectionVariable1Guid],
            store.elements[store.stringCollectionVariable2Guid],
            store.elements[store.dateVariableGuid]
        ]);
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        });
        expect(menuData[0].label).toBe(collectionVariable);
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[2].label).toBe(variablePluralLabel.toUpperCase());
    });
    it('should sort alphabetically within category', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.stringCollectionVariable1Guid],
            store.elements[store.stringCollectionVariable2Guid]
        ]);
        const collectionVariables = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0];
        expect(collectionVariables.items).toHaveLength(2);
        expect(collectionVariables.items[0].text).toBe(
            store.stringCollectionVariable1DevName
        );
        expect(collectionVariables.items[1].text).toBe(
            store.stringCollectionVariable2DevName
        );
    });
    it('should filter by allowed types', () => {
        jest.mock('builder_platform_interaction/ruleLib', () => {
            return {
                isMatch: jest
                    .fn()
                    .mockImplementationOnce(() => true)
                    .mockImplementationOnce(() => false)
            };
        });
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.numberVariableGuid],
            store.elements[store.stringCollectionVariable1Guid]
        ]);
        const allowedVariables = getElementsForMenuData(
            {
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                shouldBeWritable: true
            },
            sampleNumberParamTypes
        );
        expect(allowedVariables).toHaveLength(1);
        expect(allowedVariables[0].items).toHaveLength(1);
        expect(allowedVariables[0].items[0].displayText).toBe(
            addCurlyBraces(store.numberVariableDevName)
        );
    });
    it('should preserve devName in text & value field', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.numberVariableGuid]
        ]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.text).toBe(store.numberVariableDevName);
        expect(copiedElement.displayText).toBe(
            addCurlyBraces(store.numberVariableDevName)
        );
    });
    it('should set subText to subtype for sObject var', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.accountSObjectVariableGuid]
        ]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(store.account);
    });
    it('should set subText to label if there is a label', () => {
        selectorsMock.readableElementsSelector.mockReturnValue([
            store.elements[store.outcomeGuid]
        ]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.DECISION,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(store.outcomeDevName);
    });
    it('should set subText to dataType label if no subtype or label', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.numberVariableGuid]
        ]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(FLOW_DATA_TYPE.NUMBER.label);
    });

    it('should have New Resource as first element', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.numberVariableGuid]
        ]);
        const allowedVariables = getElementsForMenuData(
            {
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                shouldBeWritable: true
            },
            sampleNumberParamTypes,
            true
        );
        expect(allowedVariables).toHaveLength(2);
        expect(allowedVariables[0].text).toBe(
            'FlowBuilderExpressionUtils.newResourceLabel'
        );
        expect(allowedVariables[0].value).toBe('%%NewResource%%');
    });
    it('should include complex objects (non-collection) when fields are allowed', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.accountSObjectVariableGuid],
            store.elements[store.accountSObjectCollectionVariableGuid],
            store.elements[store.apexSampleVariableGuid],
            store.elements[store.apexSampleCollectionVariableGuid],
            store.elements[store.emailScreenFieldAutomaticOutputGuid],
            store.elements[store.lookupRecordAutomaticOutputGuid],
            store.elements[store.lookupRecordCollectionAutomaticOutputGuid]
        ]);
        const primitivesWithObjects = getElementsForMenuData(
            {
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                shouldBeWritable: true
            },
            sampleNumberParamTypes,
            false,
            true,
            false
        );
        expect(primitivesWithObjects).toEqual([
            {
                label: 'FLOWBUILDERELEMENTCONFIG.APEXVARIABLEPLURALLABEL',
                items: [
                    expect.objectContaining({
                        value: store.apexSampleVariableGuid
                    })
                ]
            },
            {
                label: 'FLOWBUILDERELEMENTCONFIG.SCREENFIELDPLURALLABEL',
                items: [
                    expect.objectContaining({
                        value: store.emailScreenFieldAutomaticOutputGuid
                    })
                ]
            },
            {
                label: 'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                items: [
                    expect.objectContaining({
                        value: store.accountSObjectVariableGuid
                    }),
                    expect.objectContaining({
                        value: store.lookupRecordAutomaticOutputGuid
                    })
                ]
            }
        ]);
        const primitivesNoObjects = getElementsForMenuData(
            {
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                shouldBeWritable: true
            },
            sampleNumberParamTypes,
            false,
            true,
            true
        );
        expect(primitivesNoObjects).toHaveLength(0);
    });
    it('should have only sobject variables', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
            jest
                .fn()
                .mockReturnValue([
                    store.elements[store.accountSObjectVariableGuid]
                ])
        );
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_LOOKUP,
            sObjectSelector: true
        });
        expect(menuData[0].label).toBe(sobjectVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(
            store.accountSObjectVariableGuid
        );
    });
    it('should have only sobject collection variables', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
            jest
                .fn()
                .mockReturnValue([
                    store.elements[store.accountSObjectCollectionVariableGuid]
                ])
        );
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_LOOKUP,
            sObjectSelector: true
        });
        expect(menuData[0].label).toBe(sobjectCollectionVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(
            store.accountSObjectCollectionVariableGuid
        );
    });
    it('should have one sobject variable and one sobject collection variable', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
            jest
                .fn()
                .mockReturnValue([
                    store.elements[store.accountSObjectVariableGuid],
                    store.elements[store.accountSObjectCollectionVariableGuid]
                ])
        );
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_LOOKUP,
            sObjectSelector: true
        });
        // TODO: W-5624868 when getElementsForMenuData is removed, this test should pass showSystemVariables = false so that menuData only expects length 2
        expect(menuData).toHaveLength(3);
        expect(menuData[0].label).toBe(sobjectCollectionVariable);
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(
            store.accountSObjectCollectionVariableGuid
        );
        expect(menuData[1].items).toHaveLength(1);
        expect(menuData[1].items[0].value).toEqual(
            store.accountSObjectVariableGuid
        );
    });
    it('should have only sobject variables (record Update)', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
            jest
                .fn()
                .mockReturnValue([
                    store.elements[store.accountSObjectVariableGuid]
                ])
        );
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_UPDATE,
            sObjectSelector: true
        });
        expect(menuData[0].label).toBe(sobjectVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(
            store.accountSObjectVariableGuid
        );
    });
    it('should have only sobject collection variables  (record Update)', () => {
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
            jest
                .fn()
                .mockReturnValue([
                    store.elements[store.accountSObjectCollectionVariableGuid]
                ])
        );
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_UPDATE,
            sObjectSelector: true
        });
        expect(menuData[0].label).toBe(sobjectCollectionVariable);
        expect(menuData[0].items).toHaveLength(1);
        expect(menuData[0].items[0].value).toEqual(
            store.accountSObjectCollectionVariableGuid
        );
    });
    it('should have dataType populated for number variable', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.numberVariableGuid]
        ]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.dataType).toBe(store.numberDataType);
        expect(copiedElement.subtype).toBeNull();
    });
    it('should have dataType and subtype populated for sObject var', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.elements[store.accountSObjectVariableGuid]
        ]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.dataType).toBe(FLOW_DATA_TYPE.SOBJECT.value);
        expect(copiedElement.subtype).toBe('Account');
    });
    it('should have the iconName and iconSize populated', () => {
        selectorsMock.writableElementsSelector.mockReturnValueOnce([
            store.elements[store.numberVariableGuid]
        ]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.iconName).toBe(
            FLOW_DATA_TYPE.NUMBER.utilityIconName
        );
        expect(copiedElement.iconSize).toBe('xx-small');
    });

    describe('disableHasNext', () => {
        it('should set hasNext to false for all menu items when true', () => {
            selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
                jest
                    .fn()
                    .mockReturnValue([
                        store.elements[store.accountSObjectVariableGuid],
                        store.elements[
                            store.accountSObjectCollectionVariableGuid
                        ]
                    ])
            );
            const menuData = getElementsForMenuData(
                {
                    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
                    sObjectSelector: true
                },
                null,
                false,
                false,
                true
            );

            expect(menuData[0].items[0].hasNext).toBeFalsy();
            expect(menuData[1].items[0].hasNext).toBeFalsy();
        });

        it('should not manipulate hasNext for all menu items when false', () => {
            selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
                jest
                    .fn()
                    .mockReturnValue([
                        store.elements[store.accountSObjectVariableGuid],
                        store.elements[
                            store.accountSObjectCollectionVariableGuid
                        ]
                    ])
            );
            const menuData = getElementsForMenuData(
                {
                    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
                    sObjectSelector: true
                },
                null,
                false,
                false
            );

            expect(menuData[0].items[0].hasNext).toBeFalsy();
            expect(menuData[1].items[0].hasNext).toBeTruthy();
        });
        selectorsMock.sObjectOrSObjectCollectionByEntitySelector.mockClear();
    });
    describe('RHS menuData', () => {
        it('should have active picklist values in menu data when LHS is picklist field', () => {
            selectorsMock.writableElementsSelector.mockReturnValue([
                store.elements[store.accountSObjectVariableGuid]
            ]);
            // configuration for menu data retrieval
            const allowedParamTypes = null;
            const includeNewResource = false;
            const allowSObjectForFields = false;
            const disableHasNext = false;
            const activePicklistValues = ['pick1', 'pick2'];

            const menuData = getElementsForMenuData(
                {
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
                    shouldBeWritable: true
                },
                allowedParamTypes,
                includeNewResource,
                allowSObjectForFields,
                disableHasNext,
                activePicklistValues
            );
            const picklistLabel =
                'FlowBuilderExpressionUtils.picklistValuesLabel';
            expect(menuData).toContainEqual(
                expect.objectContaining({ label: picklistLabel })
            );
            expect(menuData).toContainEqual(
                expect.objectContaining({ items: expect.any(Array) })
            );
        });
    });
    describe('global constants', () => {
        it('empty string should show in menuData when allowed', () => {
            // all global constants returned from selector
            selectorsMock.readableElementsSelector.mockReturnValue([
                gcObjects[gcLabels.BOOLEAN_FALSE],
                gcObjects[gcLabels.BOOLEAN_TRUE],
                gcObjects[gcLabels.EMPTY_STRING]
            ]);

            // only pass a string param for allowedParamTypes
            const menuData = getElementsForMenuData(
                { elementType: ELEMENT_TYPE.ASSIGNMENT },
                sampleStringParamTypes
            );

            // only the empty string global constant is added to the menu data
            expect(menuData).toContainEqual(
                expect.objectContaining({
                    label: LABELS.globalConstantCategory
                })
            );
            expect(menuData).toContainEqual(
                expect.objectContaining({ items: expect.any(Array) })
            );
            expect(menuData[0].items).toHaveLength(1);
        });
        it('true and false should show in menuData when allowed', () => {
            // all global constants returned from selector
            selectorsMock.readableElementsSelector.mockReturnValue([
                gcObjects[gcLabels.BOOLEAN_FALSE],
                gcObjects[gcLabels.BOOLEAN_TRUE],
                gcObjects[gcLabels.EMPTY_STRING]
            ]);

            // only pass a boolean param for allowedParamTypes
            const menuData = getElementsForMenuData(
                { elementType: ELEMENT_TYPE.ASSIGNMENT },
                sampleBooleanParamTypes
            );

            // only the boolean global constant is added to the menu data
            expect(menuData).toContainEqual(
                expect.objectContaining({
                    label: LABELS.globalConstantCategory
                })
            );
            expect(menuData).toContainEqual(
                expect.objectContaining({ items: expect.any(Array) })
            );
            expect(menuData[0].items).toHaveLength(2);
        });
    });
    describe('entities menu data', () => {
        it('uses api name for null label', () => {
            getAllEntities.mockImplementationOnce(() => {
                return require('mock/serverEntityData').mockEntitiesWithNoLabel;
            });
            const entityApiName = 'AcceptedEventRelation';
            const entitiesMenuData = getEntitiesMenuData();
            expect(entitiesMenuData).toBeDefined();
            expect(entitiesMenuData[0].displayText).toEqual(entityApiName);
            expect(entitiesMenuData[0].text).toEqual(entityApiName);
            expect(entitiesMenuData[0].subText).toEqual(entityApiName);
        });
    });

    describe('get store elements', () => {
        // TODO: W-5470931 more tests for getStoreElements
        it('returns elements based on element type', () => {
            selectorsMock.readableElementsSelector.mockReturnValue([
                store.elements[store.outcomeGuid]
            ]);
            const menuData = getStoreElements(jest.fn(), {
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                shouldBeWritable: false
            });
            expect(menuData).toHaveLength(1);
        });
    });

    describe('Filter and mutate menu data', () => {
        it('filters using data type param and returns in format combobox expects', () => {
            const menuData = filterAndMutateMenuData(
                [
                    store.elements[store.numberVariableGuid],
                    store.elements[store.dateVariableGuid]
                ],
                sampleNumberParamTypes
            );
            expect(menuData).toHaveLength(1);
            expect(menuData[0].items).toHaveLength(1);
            const element = menuData[0].items[0];
            expect(element.value).toBe(store.numberVariableGuid);
            expect(element.text).toBe(store.numberVariableDevName);
            expect(element.subText).toBe(FLOW_DATA_TYPE.NUMBER.label);
            expect(element.displayText).toBe(
                addCurlyBraces(store.numberVariableDevName)
            );
        });
        it('filters using element type', () => {
            const menuData = filterAndMutateMenuData(
                [
                    store.elements[store.stageGuid],
                    store.elements[store.dateVariableGuid]
                ],
                sampleStageParamTypes
            );
            expect(menuData).toHaveLength(1);
            expect(menuData[0].items).toHaveLength(1);
            const element = menuData[0].items[0];
            expect(element.value).toBe(store.stageGuid);
        });
    });

    describe('Event types menu data', () => {
        it('uses cache to fetch the data', () => {
            getEventTypesMenuData();
            const eventTypesMenuData = getEventTypesMenuData();
            expect(getEventTypes).toHaveBeenCalledTimes(1);
            expect(eventTypesMenuData).toBeDefined();
            expect(eventTypesMenuData).toHaveLength(3);
        });

        it('fetches and formats data', () => {
            const eventTypesMenuData = getEventTypesMenuData();
            expect(eventTypesMenuData).toBeDefined();
            expect(eventTypesMenuData).toHaveLength(3);
            expect(eventTypesMenuData[0].displayText).toEqual(
                platformEvent1Label
            );
            expect(eventTypesMenuData[0].text).toEqual(platformEvent1Label);
            expect(eventTypesMenuData[0].subText).toEqual(
                platformEvent1ApiName
            );
            expect(eventTypesMenuData[0].dataType).toEqual('SObject');
            expect(eventTypesMenuData[0].subtype).toEqual(
                platformEvent1ApiName
            );
        });
    });

    describe('getSecondLevelItems', () => {
        let mockSystemVariables;

        describe('system variables', () => {
            beforeEach(() => {
                setSystemVariables(systemVariables);
                mockSystemVariables = getSystemVariables();
            });
            it('calls the callback with all system variables when shouldBeWritable is false', () => {
                const callback = jest.fn();
                const mockConfig = {
                    elementType: ELEMENT_TYPE.WAIT,
                    shouldBeWritable: false
                };
                getSecondLevelItems(
                    mockConfig,
                    { subtype: SYSTEM_VARIABLE_PREFIX },
                    callback
                );
                expect(callback).toHaveBeenCalledWith(mockSystemVariables);
            });

            it('calls the callback with only writeable variables when shouldBeWritable is true', () => {
                const callback = jest.fn();
                const mockConfig = {
                    elementType: ELEMENT_TYPE.WAIT,
                    shouldBeWritable: true
                };
                getSecondLevelItems(
                    mockConfig,
                    { subtype: SYSTEM_VARIABLE_PREFIX },
                    callback
                );
                const filteredSystemVariables = callback.mock.calls[0][0];
                expect(Object.keys(filteredSystemVariables)).toHaveLength(3);
                expect(Object.keys(filteredSystemVariables)).toContain(
                    '$Flow.CurrentStage'
                );
                expect(Object.keys(filteredSystemVariables)).toContain(
                    '$Flow.ActiveStages'
                );
                expect(Object.keys(filteredSystemVariables)).toContain(
                    '$Flow.CurrentRecord'
                );
            });
        });
        it('should fetch fields for sobject variables', () => {
            const mockConfig = {
                elementType: ELEMENT_TYPE.WAIT,
                shouldBeWritable: false
            };
            getSecondLevelItems(mockConfig, parentSObjectItem, jest.fn());
            expect(getFieldsForEntity).toHaveBeenCalledTimes(1);
        });
        it('should fetch properties for apex variables', () => {
            const mockConfig = {
                elementType: ELEMENT_TYPE.WAIT,
                shouldBeWritable: false
            };
            getSecondLevelItems(mockConfig, parentApexItem, jest.fn());
            expect(getPropertiesForClass).toHaveBeenCalledTimes(1);
        });
        it('should fetch ouput parameters for LC screen field with automatic handling', async () => {
            const callback = jest.fn();
            const mockConfig = { elementType: ELEMENT_TYPE.SCREEN };
            getSecondLevelItems(
                mockConfig,
                parentLightningComponentScreenFieldItem,
                callback
            );
            await untilNoFailure(() => {
                expect(callback).toHaveBeenCalledTimes(1);
            });
            const secondLevelItems = callback.mock.calls[0][0];
            expect(Object.keys(secondLevelItems)).toEqual(
                expect.arrayContaining(['label', 'value'])
            );
        });
    });

    describe('getResourceTypesMenuData', () => {
        it('Get list of menu data based on the allowed resource types', () => {
            const resourceTypesMenuData = getResourceTypesMenuData();
            const expectedResourceTypes = [
                {
                    value: 'variable',
                    label: 'FlowBuilderNewResource.variableLabel'
                },
                {
                    value: 'constant',
                    label: 'FlowBuilderNewResource.constantLabel'
                },
                {
                    value: 'formula',
                    label: 'FlowBuilderNewResource.formulaLabel'
                }
            ];
            expect(resourceTypesMenuData).toHaveLength(3);
            expect(resourceTypesMenuData).toEqual(expectedResourceTypes);
        });
    });
    // TODO: write tests for gettings category once we switch to using labels
});
