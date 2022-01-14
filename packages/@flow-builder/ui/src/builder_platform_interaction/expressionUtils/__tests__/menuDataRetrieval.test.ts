// @ts-nocheck
import variablePluralLabel from '@salesforce/label/FlowBuilderElementConfig.variablePluralLabel';
import systemGlobalVariableCategoryLabel from '@salesforce/label/FlowBuilderSystemGlobalVariables.systemGlobalVariableCategory';
import { getPropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import { expectFieldsAreComplexTypeFieldDescriptions } from 'builder_platform_interaction/builderTestUtils';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { createExtensionDescription } from 'builder_platform_interaction/flowExtensionLib';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import {
    ENTITY_TYPE,
    fetchFieldsForEntity,
    getAllEntities,
    getEventTypes
} from 'builder_platform_interaction/sobjectLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    getSystemVariables,
    GLOBAL_CONSTANTS as gcLabels,
    GLOBAL_CONSTANT_OBJECTS as gcObjects,
    setGlobalVariables,
    setProcessTypeFeature,
    setSystemVariables,
    SYSTEM_VARIABLE_PREFIX
} from 'builder_platform_interaction/systemLib';
import { mockScreenElement } from 'mock/calloutData';
import { platformEvent1ApiName, platformEvent1Label } from 'mock/eventTypesData';
import { mockGlobalVariablesWithMultiPicklistField } from 'mock/globalVariableData';
import { booleanParam, numberParamCanBeAnything, stageParam, stringParam } from 'mock/ruleService';
import * as store from 'mock/storeData';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { startElement } from 'mock/storeDataRecordTriggered';
import { globalVariablesForFlow } from 'serverData/GetAllGlobalVariables/globalVariablesForFlow.json';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { flowExtensionDetails as mockFlowExtensionDetails } from 'serverData/GetFlowExtensionDetails/flowExtensionDetails.json';
import { flowWithActiveAndLatest as mockFlowWithActiveAndLatest } from 'serverData/GetFlowInputOutputVariables/flowWithActiveAndLatest.json';
import { systemVariablesForFlow as systemVariables } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import { LABELS } from '../expressionUtilsLabels';
import {
    filterAndMutateMenuData,
    filterFieldsForChosenElement,
    getChildrenItems,
    getChildrenItemsPromise,
    getEntitiesMenuData,
    getEventTypesMenuDataRunTime,
    getResourceTypesMenuData
} from '../menuDataRetrieval';

jest.mock('builder_platform_interaction/elementConfig', () => {
    const actual = jest.requireActual('builder_platform_interaction/elementConfig');

    const elementTypeToConfigMap = actual.elementTypeToConfigMap;
    elementTypeToConfigMap.STAGE_STEP.getChildrenItems = jest.fn().mockReturnValue({ a: 2 });
    return Object.assign({}, actual, {
        elementTypeToConfigMap
    });
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const collectionVariable = LABELS.collectionVariablePluralLabel.toUpperCase();
const sobjectVariable = LABELS.sObjectPluralLabel.toUpperCase();

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

const parentGlobalItem = {
    subtype: '$Organization'
};

const parentLightningComponentScreenFieldItem = {
    dataType: FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value,
    displayText: 'emailComponent',
    value: store.emailScreenFieldAutomaticOutput.guid
};

const parentLightningComponentScreenFieldItemInSection = {
    dataType: FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value,
    displayText: 'sliderComponent',
    value: 'region-container-1-region-2-lwc-comp'
};

const parentActionItem = {
    dataType: FLOW_DATA_TYPE.ACTION_OUTPUT.value,
    displayText: 'action',
    value: store.actionCallAutomaticOutput.guid
};

const parentSubflowItem = {
    dataType: FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value,
    displayText: 'subflow',
    value: store.subflowAutomaticOutput.guid
};

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

jest.mock('builder_platform_interaction/apexTypeLib', () => {
    return {
        getPropertiesForClass: jest.fn()
    };
});

jest.mock('builder_platform_interaction/flowExtensionLib', () =>
    require('builder_platform_interaction_mocks/flowExtensionLib')
);

jest.mock('builder_platform_interaction/invocableActionLib', () =>
    require('builder_platform_interaction_mocks/invocableActionLib')
);

jest.mock('builder_platform_interaction/sobjectLib', () => {
    const sobjectLib = jest.requireActual('builder_platform_interaction/sobjectLib');
    return {
        fetchFieldsForEntity: jest.fn().mockImplementation(() => Promise.resolve(mockAccountFields)),
        getAllEntities: jest.fn().mockImplementation(() => {
            return mockEntities;
        }),
        getWorkflowEnabledEntities: jest.fn().mockImplementation(() => {
            return jest.requireActual('mock/serverEntityData').mockWorkflowEnabledEntities;
        }),
        getEventTypes: jest.fn().mockImplementation(() => {
            return require('mock/eventTypesData').mockEventTypes;
        }),
        ENTITY_TYPE: sobjectLib.ENTITY_TYPE
    };
});

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        canElementContain: jest.fn().mockImplementation((element) => {
            return element.dataType === 'sobject';
        })
    };
});

jest.mock('builder_platform_interaction/dataTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataTypeLib');
    const { ELEMENT_TYPE: elementType } = require('builder_platform_interaction/flowMetadata');
    return {
        getDataTypeLabel: actual.getDataTypeLabel,
        getDataTypeIcons: actual.getDataTypeIcons,
        FLOW_DATA_TYPE: actual.FLOW_DATA_TYPE,
        FEROV_DATA_TYPE: actual.FEROV_DATA_TYPE,
        isComplexType: actual.isComplexType,
        getFlowDataType: actual.getFlowDataType,
        getResourceTypes: jest.fn().mockImplementation(() => {
            return [{ name: elementType.VARIABLE }, { name: elementType.CONSTANT }, { name: elementType.FORMULA }];
        })
    };
});

jest.mock('builder_platform_interaction/elementLabelLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/elementLabelLib');
    return {
        getResourceLabel: jest.fn().mockImplementation((resource) => resource.name),
        getResourceCategory: actual.getResourceCategory
    };
});

jest.mock('builder_platform_interaction/subflowsLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/subflowsLib');
    return {
        getActiveOrLatestFlowOutputVariables: jest.fn().mockImplementation((flowName) => {
            if (flowName === 'flowWithActiveAndLatest') {
                return actual.getActiveOrLatestInputOutputVariables(mockFlowWithActiveAndLatest).outputVariables;
            }
            return undefined;
        })
    };
});

jest.mock('../resourceUtils', () => {
    return {
        getScreenElement: jest.fn().mockImplementation(() => {
            return Object.assign({}, mockScreenElement, {
                getFieldByGUID: jest.fn().mockImplementation((guid) => {
                    let field;
                    if (guid === 'region-container-1-region-2-lwc-comp') {
                        field = mockScreenElement.fields[3].fields[1].fields[1];
                    }
                    return field;
                })
            });
        })
    };
});

describe('Menu data retrieval', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('RHS menuData', () => {
        it('should have active picklist values in menu data when LHS is picklist field', () => {
            const menuData = filterAndMutateMenuData([store.accountSObjectVariable], null, {
                includeNewResource: false,
                allowGlobalConstants: false,
                disableHasNext: false,
                activePicklistValues: ['pick1', 'pick2']
            });
            const picklistLabel = 'FlowBuilderExpressionUtils.picklistValuesLabel(2)';
            expect(menuData).toContainEqual(expect.objectContaining({ label: picklistLabel }));
            expect(menuData).toContainEqual(expect.objectContaining({ items: expect.any(Array) }));
        });
    });
    describe('global constants', () => {
        it('empty string should show in menuData when allowed', () => {
            // only pass a string param for allowedParamTypes
            const menuData = filterAndMutateMenuData(
                [gcObjects[gcLabels.BOOLEAN_FALSE], gcObjects[gcLabels.BOOLEAN_TRUE], gcObjects[gcLabels.EMPTY_STRING]],
                sampleStringParamTypes
            );

            // only the empty string global constant is added to the menu data
            expect(menuData).toContainEqual(
                expect.objectContaining({
                    label: LABELS.globalConstantCategory
                })
            );
            expect(menuData).toContainEqual(expect.objectContaining({ items: expect.any(Array) }));
            expect(menuData[0].items).toHaveLength(1);
        });
        it('true and false should show in menuData when allowed', () => {
            // only pass a boolean param for allowedParamTypes
            const menuData = filterAndMutateMenuData(
                [gcObjects[gcLabels.BOOLEAN_FALSE], gcObjects[gcLabels.BOOLEAN_TRUE], gcObjects[gcLabels.EMPTY_STRING]],
                sampleBooleanParamTypes
            );

            // only the boolean global constant is added to the menu data
            expect(menuData).toContainEqual(
                expect.objectContaining({
                    label: LABELS.globalConstantCategory
                })
            );
            expect(menuData).toContainEqual(expect.objectContaining({ items: expect.any(Array) }));
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

        it('filters on workflowEnabled entities', () => {
            const entitiesMenuData = getEntitiesMenuData(ENTITY_TYPE.WORKFLOW_ENABLED);
            expect(entitiesMenuData).toBeDefined();
            expect(entitiesMenuData[0].text).toEqual('testWFEnabledEntity');
        });
    });

    describe('Filter and mutate menu data', () => {
        it('should sort alphabetically by category', () => {
            const menuData = filterAndMutateMenuData([
                store.numberVariable,
                store.accountSObjectVariable,
                store.stringCollectionVariable1,
                store.stringCollectionVariable2,
                store.dateVariable
            ]);

            expect(menuData[0].label).toBe(collectionVariable);
            expect(menuData[1].label).toBe(sobjectVariable);
            expect(menuData[2].label).toBe(variablePluralLabel.toUpperCase());
            expect(menuData[3].label).toBe(systemGlobalVariableCategoryLabel);
        });
        it('should sort alphabetically within category', () => {
            const collectionVariables = filterAndMutateMenuData([
                store.stringCollectionVariable1,
                store.stringCollectionVariable2
            ])[0];

            expect(collectionVariables.items).toHaveLength(2);
            expect(collectionVariables.items[0].text).toBe(store.stringCollectionVariable1.name);
            expect(collectionVariables.items[1].text).toBe(store.stringCollectionVariable2.name);
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
            const allowedVariables = filterAndMutateMenuData(
                [store.numberVariable, store.stringCollectionVariable1],
                sampleNumberParamTypes
            );
            expect(allowedVariables[0].items).toHaveLength(1);
            expect(allowedVariables[0].items[0].displayText).toBe(addCurlyBraces(store.numberVariable.name));
        });
        it('should preserve devName in text & value field', () => {
            const copiedElement = filterAndMutateMenuData([store.numberVariable])[0].items[0];
            expect(copiedElement.text).toBe(store.numberVariable.name);
            expect(copiedElement.displayText).toBe(addCurlyBraces(store.numberVariable.name));
        });
        it('should set subText to subtype for sObject var', () => {
            const copiedElement = filterAndMutateMenuData([store.accountSObjectVariable])[0].items[0];
            expect(copiedElement.subText).toBe('Account');
        });
        it('should set subText to label if there is a label', () => {
            const copiedElement = filterAndMutateMenuData([store.decision1Outcome1])[0].items[0];
            expect(copiedElement.subText).toBe(store.decision1Outcome1.name);
        });
        it('should set subText to dataType label if no subtype or label', () => {
            const copiedElement = filterAndMutateMenuData([store.numberVariable])[0].items[0];
            expect(copiedElement.subText).toBe(FLOW_DATA_TYPE.NUMBER.label);
        });
        it('should have New Resource as first element', () => {
            const allowedVariables = filterAndMutateMenuData([store.numberVariable], sampleNumberParamTypes, {
                includeNewResource: true
            });
            expect(allowedVariables).toHaveLength(2);
            expect(allowedVariables[0].text).toBe(
                'FlowBuilderExpressionUtils.newResourceLabel(FlowBuilderExpressionUtils.resourceLabel)'
            );
            expect(allowedVariables[0].value).toBe('%%NewResource%%');
        });
        it('should include complex objects (non-collection) when fields are allowed', () => {
            const primitivesWithObjects = filterAndMutateMenuData(
                [
                    store.accountSObjectVariable,
                    store.accountSObjectCollectionVariable,
                    store.apexSampleVariable,
                    store.apexSampleCollectionVariable,
                    store.emailScreenFieldAutomaticOutput,
                    store.lookupRecordAutomaticOutput,
                    store.lookupRecordCollectionAutomaticOutput,
                    store.actionCallAutomaticOutput,
                    store.caseLogACallAutomatic // no outputs : should not be included
                ],
                sampleNumberParamTypes,
                {
                    includeNewResource: false,
                    allowGlobalConstants: true,
                    disableHasNext: false
                }
            );
            expect(primitivesWithObjects).toEqual([
                {
                    label: 'FLOWBUILDERELEMENTCONFIG.ACTIONPLURALLABEL',
                    items: [
                        expect.objectContaining({
                            value: store.actionCallAutomaticOutput.guid
                        })
                    ]
                },
                {
                    label: 'FLOWBUILDERELEMENTCONFIG.APEXVARIABLEPLURALLABEL',
                    items: [
                        expect.objectContaining({
                            value: store.apexSampleVariable.guid
                        })
                    ]
                },
                {
                    label: 'FLOWBUILDERELEMENTCONFIG.SCREENFIELDPLURALLABEL',
                    items: [
                        expect.objectContaining({
                            value: store.emailScreenFieldAutomaticOutput.guid
                        })
                    ]
                },
                {
                    label: 'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                    items: [
                        expect.objectContaining({
                            value: store.accountSObjectVariable.guid
                        }),
                        expect.objectContaining({
                            value: store.lookupRecordAutomaticOutput.guid
                        })
                    ]
                }
            ]);
            const primitivesNoObjects = filterAndMutateMenuData(
                [
                    store.accountSObjectVariable,
                    store.accountSObjectCollectionVariable,
                    store.apexSampleVariable,
                    store.apexSampleCollectionVariable,
                    store.emailScreenFieldAutomaticOutput,
                    store.lookupRecordAutomaticOutput,
                    store.lookupRecordCollectionAutomaticOutput,
                    store.actionCallAutomaticOutput,
                    store.caseLogACallAutomatic // no outputs : should not be included
                ],
                sampleNumberParamTypes,
                {
                    includeNewResource: false,
                    allowGlobalConstants: true,
                    disableHasNext: true
                }
            );
            expect(primitivesNoObjects).toHaveLength(0);
        });
        it('should have dataType populated for number variable', () => {
            const copiedElement = filterAndMutateMenuData([store.numberVariable])[0].items[0];
            expect(copiedElement.dataType).toBe('Number');
            expect(copiedElement.subtype).toBeNull();
        });
        it('should have dataType and subtype populated for sObject var', () => {
            const copiedElement = filterAndMutateMenuData([store.accountSObjectVariable])[0].items[0];
            expect(copiedElement.dataType).toBe(FLOW_DATA_TYPE.SOBJECT.value);
            expect(copiedElement.subtype).toBe('Account');
        });
        it('should have the iconName and iconSize populated', () => {
            const copiedElement = filterAndMutateMenuData([store.numberVariable])[0].items[0];
            expect(copiedElement.iconName).toBe(FLOW_DATA_TYPE.NUMBER.utilityIconName);
            expect(copiedElement.iconSize).toBe('xx-small');
        });
        it('filters using data type param and returns in format combobox expects', () => {
            const menuData = filterAndMutateMenuData(
                [store.numberVariable, store.dateVariable],
                sampleNumberParamTypes
            );
            expect(menuData).toHaveLength(1);
            expect(menuData[0].items).toHaveLength(1);
            const element = menuData[0].items[0];
            expect(element.value).toBe(store.numberVariable.guid);
            expect(element.text).toBe(store.numberVariable.name);
            expect(element.subText).toBe(FLOW_DATA_TYPE.NUMBER.label);
            expect(element.displayText).toBe(addCurlyBraces(store.numberVariable.name));
        });
        it('filters using element type', () => {
            const menuData = filterAndMutateMenuData([store.stageElement, store.dateVariable], sampleStageParamTypes);
            expect(menuData).toHaveLength(1);
            expect(menuData[0].items).toHaveLength(1);
            const element = menuData[0].items[0];
            expect(element.value).toBe(store.stageElement.guid);
        });
        it('sets hasNext true and rightIconName when hasNext enabled', () => {
            const menuData = filterAndMutateMenuData([store.apexCallAccountAutomaticOutput], undefined, {
                disableHasNext: false
            });

            const element = menuData[0].items[0];
            expect(element.hasNext).toBe(true);
            expect(element.rightIconName).toBeDefined();
            expect(element.rightIconName).not.toEqual('');
        });
        it('sets hasNext false and empty right icon when hasNext disabled', () => {
            const menuData = filterAndMutateMenuData([store.apexCallAccountAutomaticOutput], undefined, {
                disableHasNext: true
            });

            const element = menuData[0].items[0];
            expect(element.hasNext).toBe(false);
            expect(element.rightIconName).toBeDefined();
            expect(element.rightIconName).toEqual('');
        });
        it('ignores allowSObjectFields if hasNext false', () => {
            const menuData = filterAndMutateMenuData([store.apexCallAccountAutomaticOutput], undefined, {
                disableHasNext: true,
                allowSObjectField: true
            });

            const element = menuData[0].items[0];
            expect(element.hasNext).toBe(false);
            expect(element.rightIconName).toBeDefined();
            expect(element.rightIconName).toEqual('');
        });
        it('sets hasNext and right icon name when hasNext enabled only on not SObject when allowSObjectFields is false', () => {
            const menuData = filterAndMutateMenuData(
                [store.apexCallAccountAutomaticOutput, store.apexCallAutomaticAnonymousAccountOutput],
                undefined,
                {
                    disableHasNext: false,
                    allowSObjectField: false
                }
            );

            let element = menuData[0].items[0];
            expect(element.hasNext).toBe(true);
            expect(element.rightIconName).toBeDefined();
            expect(element.rightIconName).not.toEqual('');
            element = menuData[1].items[0];
            expect(element.hasNext).toBe(false);
            expect(element.rightIconName).toBeDefined();
            expect(element.rightIconName).toEqual('');
        });
        it('defaults showGlobalVariables to true', () => {
            setGlobalVariables(globalVariablesForFlow);
            setProcessTypeFeature('flow', ['GlobalVariables']);
            Store.setMockState({
                properties: {
                    processType: 'flow',
                    definitionId: '300xx000000bpCbAAI'
                },
                elements: {}
            });
            const menuData = filterAndMutateMenuData([], undefined, { showSystemVariables: false });
            const element = menuData[0].items[0];
            expect(element.value).toBe('$Api');
            Store.setMockState(flowWithAllElementsUIModel);
        });
        it('does not include section and column screen fields in the result', () => {
            const dummySection = {
                elementType: 'SCREEN_FIELD',
                fieldType: 'RegionContainer'
            };
            const dummyColumn = {
                elementType: 'SCREEN_FIELD',
                fieldType: 'Region'
            };
            const menuData = filterAndMutateMenuData([dummySection, dummyColumn], undefined, {
                showSystemVariables: false
            });
            expect(menuData).toHaveLength(0);
        });
        it('does not include scheduled paths in the result', () => {
            const dummyScheduledPath = {
                elementType: 'ScheduledPath'
            };
            const menuData = filterAndMutateMenuData([dummyScheduledPath], undefined, {
                showSystemVariables: false
            });
            expect(menuData).toHaveLength(0);
        });
        it('does not include automatic fields in the result', () => {
            const dummyAutomaticField = {
                elementType: 'SCREEN_FIELD',
                fieldType: FlowScreenFieldType.ObjectProvided
            };
            const menuData = filterAndMutateMenuData([dummyAutomaticField], undefined, {
                showSystemVariables: false
            });
            expect(menuData).toHaveLength(0);
        });
        it('should sort global/system variables alphabetically', () => {
            setProcessTypeFeature('Flow', ['GlobalVariables']);
            setGlobalVariables(globalVariablesForFlow);
            setSystemVariables(systemVariables);
            const menuData = filterAndMutateMenuData([]);
            expect(menuData[0].items.map((item) => item.text)).toEqual([
                '$Api',
                '$Flow',
                '$Organization',
                '$Profile',
                '$Setup',
                '$System',
                '$User',
                '$UserRole'
            ]);
        });
        it('sets hasNext false on $Record when allowSObjectFields is false and disableHasNext is false', () => {
            const menuData = filterAndMutateMenuData([startElement], undefined, {
                disableHasNext: false,
                allowSObjectField: false,
                showSystemVariables: false,
                showGlobalVariables: false
            });

            const element = menuData[0].items[0];
            expect(element.hasNext).toBe(false);
            expect(element.rightIconName).toBeDefined();
            expect(element.rightIconName).toEqual('');
        });
        it('should have New Resource as first element and the label should reflect the newResourceTypeLabel provided', () => {
            const menuData = filterAndMutateMenuData([], undefined, {
                includeNewResource: true,
                newResourceTypeLabel: 'test resource type'
            });
            expect(menuData).toHaveLength(2);
            expect(menuData[0].text).toBe('FlowBuilderExpressionUtils.newTypedResourceLabel(test resource type)');
        });
    });

    describe('Event types menu data', () => {
        it('uses cache to fetch the data', () => {
            getEventTypesMenuDataRunTime();
            const eventTypesMenuData = getEventTypesMenuDataRunTime();
            expect(getEventTypes).toHaveBeenCalledTimes(1);
            expect(eventTypesMenuData).toBeDefined();
            expect(eventTypesMenuData).toHaveLength(3);
        });

        it('fetches and formats data', () => {
            const eventTypesMenuData = getEventTypesMenuDataRunTime();
            expect(eventTypesMenuData).toBeDefined();
            expect(eventTypesMenuData).toHaveLength(3);
            expect(eventTypesMenuData[0].displayText).toEqual(platformEvent1Label);
            expect(eventTypesMenuData[0].text).toEqual(platformEvent1Label);
            expect(eventTypesMenuData[0].subText).toEqual(platformEvent1ApiName);
            expect(eventTypesMenuData[0].dataType).toEqual('SObject');
            expect(eventTypesMenuData[0].subtype).toEqual(platformEvent1ApiName);
        });
    });

    describe('getChildrenItemsPromise', () => {
        let mockSystemVariables;

        describe('system variables', () => {
            beforeEach(() => {
                setSystemVariables(systemVariables);
                mockSystemVariables = getSystemVariables();
            });
            it('returns all system variables', async () => {
                const items = await getChildrenItemsPromise({
                    subtype: SYSTEM_VARIABLE_PREFIX
                });
                expectFieldsAreComplexTypeFieldDescriptions(items);
                expect(items).toEqual(mockSystemVariables);
            });
        });
        it('should fetch fields for sobject variables', async () => {
            const items = await getChildrenItemsPromise(parentSObjectItem);
            expect(Object.keys(items)).toHaveLength(Object.keys(mockAccountFields).length);
            expectFieldsAreComplexTypeFieldDescriptions(items);
        });
        it('should return an empty map if cannot get fields', async () => {
            fetchFieldsForEntity.mockImplementationOnce(() =>
                Promise.reject(new Error('cannot get entity fields : No Access'))
            );
            const items = await getChildrenItemsPromise(parentSObjectItem);
            expect(items).toEqual({});
        });
        it('should fetch properties for apex variables', async () => {
            const items = await getChildrenItemsPromise(parentApexItem);
            expect(getPropertiesForClass).toHaveBeenCalledTimes(1);
            expectFieldsAreComplexTypeFieldDescriptions(items);
        });
        describe('global variables', () => {
            beforeEach(() => {
                setGlobalVariables(mockGlobalVariablesWithMultiPicklistField);
            });
            it('should fetch properties for global variables and hide multipicklist fields by default', async () => {
                const items = await getChildrenItemsPromise(parentGlobalItem);
                expect(Object.keys(items)).toEqual(expect.arrayContaining(['$Organization.Country']));
                expectFieldsAreComplexTypeFieldDescriptions(items);
            });
            it('should show multipicklist fields if showMultiPicklistGlobalVariables is set to true', async () => {
                const items = await getChildrenItemsPromise(parentGlobalItem, true);
                expect(Object.keys(items)).toEqual(
                    expect.arrayContaining(['$Organization.Country', '$Organization.MP__c'])
                );
                expectFieldsAreComplexTypeFieldDescriptions(items);
            });
        });
        it('should fetch ouput parameters for LC screen field with automatic handling', async () => {
            const items = await getChildrenItemsPromise(parentLightningComponentScreenFieldItem);
            expect(Object.keys(items)).toEqual(expect.arrayContaining(['label', 'value']));
            expectFieldsAreComplexTypeFieldDescriptions(items);
        });
        it('should fetch ouput parameters for LC screen field in Sections with automatic handling', async () => {
            const items = await getChildrenItemsPromise(parentLightningComponentScreenFieldItemInSection);
            expect(Object.keys(items)).toEqual(expect.arrayContaining(['label', 'value']));
            expectFieldsAreComplexTypeFieldDescriptions(items);
        });
        it('should fetch ouput parameters for action with automatic handling', async () => {
            const items = await getChildrenItemsPromise(parentActionItem);
            expect(Object.keys(items)).toEqual(expect.arrayContaining(['feedItemId']));
            expectFieldsAreComplexTypeFieldDescriptions(items);
        });
        it('should fetch output variables for subflow with automatic handling', async () => {
            const items = await getChildrenItemsPromise(parentSubflowItem);
            expect(Object.keys(items)).toEqual([
                'accountOutput',
                'accountOutputCollection',
                'carOutput',
                'carOutputCollection',
                'inputOutput1',
                'inputOutput2',
                'output1',
                'output2',
                'output3'
            ]);
            expectFieldsAreComplexTypeFieldDescriptions(items);
        });
    });

    describe('getChildrenItems', () => {
        describe('global variables', () => {
            beforeEach(() => {
                setGlobalVariables(mockGlobalVariablesWithMultiPicklistField);
            });
            it('should fetch properties for global variables and hide multipicklist fields by default', async () => {
                const items = await getChildrenItems(parentGlobalItem);
                expect(Object.keys(items)).toEqual(['$Organization.Country']);
                expectFieldsAreComplexTypeFieldDescriptions(items);
            });
            it('should show multipicklist fields if showMultiPicklistGlobalVariables is set to true', async () => {
                const items = await getChildrenItems(parentGlobalItem, true);
                expect(Object.keys(items)).toEqual(['$Organization.Country', '$Organization.MP__c']);
                expectFieldsAreComplexTypeFieldDescriptions(items);
            });
            it('should retrieve items from parent.getChildrenItems() if available', () => {
                const parent = {
                    getChildrenItems: () => {
                        return { a: 1 };
                    }
                };
                const items = getChildrenItems(parent);
                expect(items).toEqual(parent.getChildrenItems());
            });
            it('should retrieve children items from element.getChildrenItems()', () => {
                const parent = {
                    dataType: 'STAGE_STEP',
                    value: '40c11213-36c0-451e-a5aa-8790aee06666'
                };
                const items = getChildrenItems(parent);
                const mockCall = elementTypeToConfigMap.STAGE_STEP.getChildrenItems;
                expect(mockCall).toHaveBeenCalledWith(getElementByGuid(parent.value));
                expect(items).toEqual(mockCall());
            });
        });
    });

    describe('getResourceTypesMenuData', () => {
        it('Get list of menu data based on the allowed resource types, including description', () => {
            const resourceTypesMenuData = getResourceTypesMenuData();
            const expectedResourceTypes = [
                {
                    description: 'FlowBuilderNewResource.variableDesc',
                    value: 'variable',
                    label: 'FlowBuilderNewResource.variableLabel'
                },
                {
                    description: 'FlowBuilderNewResource.constantDesc',
                    value: 'constant',
                    label: 'FlowBuilderNewResource.constantLabel'
                },
                {
                    description: 'FlowBuilderNewResource.formulaDesc',
                    value: 'formula',
                    label: 'FlowBuilderNewResource.formulaLabel'
                }
            ];
            expect(resourceTypesMenuData).toHaveLength(3);
            expect(resourceTypesMenuData).toEqual(expectedResourceTypes);
        });
    });

    describe('filterFieldsForChosenElement', () => {
        beforeEach(() => {
            setSystemVariables(systemVariables);
        });
        it('returns menuItems for only writeable system variables when shouldBeWritable is true', () => {
            const chosenElement = {
                value: '$Flow',
                subtype: '$Flow',
                text: '$Flow',
                displayText: '{!$Flow}'
            };
            const fields = getSystemVariables();
            const menuItems = filterFieldsForChosenElement(chosenElement, fields, { shouldBeWritable: true });
            expect(menuItems).toHaveLength(3);
            expect(menuItems[0]).toMatchObject({
                displayText: '{!$Flow.ActiveStages}'
            });
            expect(menuItems[1]).toMatchObject({
                displayText: '{!$Flow.CurrentRecord}'
            });
            expect(menuItems[2]).toMatchObject({
                displayText: '{!$Flow.CurrentStage}'
            });
        });
        it('returns menuItems for both number fields and spannable fields when allowed param types are numbers', () => {
            const parentMenuItem = {
                dataType: FLOW_DATA_TYPE.SOBJECT.value,
                subtype: 'FeedItem',
                displayText: '{!recordVar}'
            };
            const menuItems = filterFieldsForChosenElement(parentMenuItem, feedItemFields, {
                allowedParamTypes: sampleNumberParamTypes
            });
            expect(menuItems).toContainEqual(
                expect.objectContaining({
                    displayText: '{!recordVar.LikeCount}',
                    dataType: 'Number'
                })
            );
            expect(menuItems).toContainEqual(
                expect.objectContaining({
                    text: 'BestComment',
                    dataType: 'SObject'
                })
            );
            expect(menuItems).not.toContainEqual(
                expect.objectContaining({
                    displayText: '{!recordVar.BestCommentId}'
                })
            );
        });
        it('returns only sobject or can contain sobject elements when selectorConfig is set', () => {
            const parentMenuItem = store.lightningCompAutomaticOutputContainsAccountExtension;
            const lightningCompWithAccountOutputFlowExtensionDescription = createExtensionDescription(
                'c:HelloWorld',
                mockFlowExtensionDetails['c:HelloWorld']
            );
            const fields = {
                ...lightningCompWithAccountOutputFlowExtensionDescription.outputParameters
            };

            const menuItems = filterFieldsForChosenElement(parentMenuItem, fields, {
                selectorConfig: {
                    dataType: 'SObject',
                    sObjectCollectionCriterion: 'SOBJECT'
                }
            });

            expect(menuItems).toHaveLength(1);
            expect(menuItems).toContainEqual(
                expect.objectContaining({
                    displayText: 'account',
                    dataType: 'sobject'
                })
            );
        });
        it('does not set hasNext when selectorConfig is set', () => {
            const parentMenuItem = store.lightningCompAutomaticOutputContainsAccountExtension;
            const lightningCompWithAccountOutputFlowExtensionDescription = createExtensionDescription(
                'c:HelloWorld',
                mockFlowExtensionDetails['c:HelloWorld']
            );
            const fields = {
                ...lightningCompWithAccountOutputFlowExtensionDescription.outputParameters
            };

            const menuItems = filterFieldsForChosenElement(parentMenuItem, fields, {
                selectorConfig: {
                    dataType: 'SObject',
                    sObjectCollectionCriterion: 'SOBJECT'
                }
            });

            expect(menuItems).toHaveLength(1);
            expect(menuItems[0].hasNext).toBeUndefined();
        });
    });

    // TODO: write tests for gettings category once we switch to using labels
});
