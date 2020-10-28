// @ts-nocheck
import {
    getElementsForMenuData,
    getEntitiesMenuData,
    filterAndMutateMenuData,
    getEventTypesMenuDataRunTime,
    getChildrenItemsPromise,
    getChildrenItems,
    getResourceTypesMenuData,
    filterFieldsForChosenElement
} from '../menuDataRetrieval';
import { numberParamCanBeAnything, stringParam, booleanParam, stageParam } from 'mock/ruleService';
import * as store from 'mock/storeData';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as selectorsMock from 'builder_platform_interaction/selectors';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ENTITY_TYPE, getAllEntities } from 'builder_platform_interaction/sobjectLib';
import {
    GLOBAL_CONSTANTS as gcLabels,
    GLOBAL_CONSTANT_OBJECTS as gcObjects,
    SYSTEM_VARIABLE_PREFIX
} from 'builder_platform_interaction/systemLib';
import { LABELS } from '../expressionUtilsLabels';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import variablePluralLabel from '@salesforce/label/FlowBuilderElementConfig.variablePluralLabel';
import { platformEvent1ApiName, platformEvent1Label } from 'mock/eventTypesData';
import { getEventTypes, fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import {
    setSystemVariables,
    setGlobalVariables,
    setProcessTypeFeature
} from 'builder_platform_interaction_mocks/systemLib';
import { getSystemVariables } from 'builder_platform_interaction/systemLib';
import { getPropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import { systemVariablesForFlow as systemVariables } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import { globalVariablesForFlow } from 'serverData/GetAllGlobalVariables/globalVariablesForFlow.json';
import {
    mockFlowRuntimeEmailFlowExtensionDescription,
    mockLightningCompWithAccountOutputFlowExtensionDescription
} from 'mock/flowExtensionsData';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { mockScreenElement } from 'mock/calloutData';
import { expectFieldsAreComplexTypeFieldDescriptions } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { flowWithActiveAndLatest as mockFlowWithActiveAndLatest } from 'serverData/GetFlowInputOutputVariables/flowWithActiveAndLatest.json';
import { mockGlobalVariablesWithMultiPicklistField } from 'mock/globalVariableData';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const collectionVariable = LABELS.collectionVariablePluralLabel.toUpperCase();
const sobjectVariable = LABELS.sObjectPluralLabel.toUpperCase();
const sobjectCollectionVariable = LABELS.sObjectCollectionPluralLabel.toUpperCase();
const screenFieldVariable = LABELS.screenFieldPluralLabel.toUpperCase();

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

jest.mock('builder_platform_interaction/apexTypeLib', () => {
    return {
        getPropertiesForClass: jest.fn()
    };
});

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    return {
        getCachedExtension: jest.fn().mockImplementation(() => mockFlowRuntimeEmailFlowExtensionDescription)
    };
});

jest.mock('builder_platform_interaction/screenEditorUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/screenEditorUtils');
    return {
        getFlowDataTypeByName: actual.getFlowDataTypeByName,
        getIconNameFromDataType: jest.fn().mockImplementation(() => {
            return 'standard:email';
        })
    };
});

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
        writableElementsSelector: jest.fn(),
        isOrCanContainSelector: jest.fn(),
        readableElementsSelector: jest.fn(),
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
        getScreenElement: jest.fn().mockImplementation(() => mockScreenElement)
    };
});

describe('Menu data retrieval', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    afterEach(() => {
        selectorsMock.writableElementsSelector.mockReset();
        selectorsMock.isOrCanContainSelector.mockReset();
        selectorsMock.readableElementsSelector.mockReset();
    });
    it('should sort alphabetically by category', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.numberVariable,
            store.accountSObjectVariable,
            store.stringCollectionVariable1,
            store.stringCollectionVariable2,
            store.dateVariable
        ]);
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        });
        expect(menuData[0].label).toBe(collectionVariable);
        expect(menuData[1].label).toBe(screenFieldVariable);
        expect(menuData[2].label).toBe(sobjectVariable);
        expect(menuData[3].label).toBe(variablePluralLabel.toUpperCase());
    });
    it('should sort alphabetically within category', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.stringCollectionVariable1,
            store.stringCollectionVariable2
        ]);
        const collectionVariables = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[0];
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
        selectorsMock.writableElementsSelector.mockReturnValue([store.numberVariable, store.stringCollectionVariable1]);
        const allowedVariables = getElementsForMenuData(
            {
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                shouldBeWritable: true
            },
            sampleNumberParamTypes
        );
        expect(allowedVariables).toHaveLength(1);
        expect(allowedVariables[0].items).toHaveLength(1);
        expect(allowedVariables[0].items[0].displayText).toBe(addCurlyBraces(store.numberVariable.name));
    });
    it('should preserve devName in text & value field', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.numberVariable]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[1].items[0];
        expect(copiedElement.text).toBe(store.numberVariable.name);
        expect(copiedElement.displayText).toBe(addCurlyBraces(store.numberVariable.name));
    });
    it('should set subText to subtype for sObject var', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.accountSObjectVariable]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[1].items[0];
        expect(copiedElement.subText).toBe('Account');
    });
    it('should set subText to label if there is a label', () => {
        selectorsMock.readableElementsSelector.mockReturnValue([store.decision1Outcome1]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.DECISION,
            shouldBeWritable: true
        })[0].items[0];
        expect(copiedElement.subText).toBe(store.decision1Outcome1.name);
    });
    it('should set subText to dataType label if no subtype or label', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.numberVariable]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[1].items[0];
        expect(copiedElement.subText).toBe(FLOW_DATA_TYPE.NUMBER.label);
    });

    it('should have New Resource as first element', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.numberVariable]);
        const allowedVariables = getElementsForMenuData(
            {
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                shouldBeWritable: true
            },
            sampleNumberParamTypes,
            true
        );
        expect(allowedVariables).toHaveLength(2);
        expect(allowedVariables[0].text).toBe('FlowBuilderExpressionUtils.newResourceLabel');
        expect(allowedVariables[0].value).toBe('%%NewResource%%');
    });
    it('should include complex objects (non-collection) when fields are allowed', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([
            store.accountSObjectVariable,
            store.accountSObjectCollectionVariable,
            store.apexSampleVariable,
            store.apexSampleCollectionVariable,
            store.emailScreenFieldAutomaticOutput,
            store.lookupRecordAutomaticOutput,
            store.lookupRecordCollectionAutomaticOutput,
            store.actionCallAutomaticOutput,
            store.caseLogACallAutomatic // no outputs : should not be included
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
        selectorsMock.isOrCanContainSelector.mockReturnValue(jest.fn().mockReturnValue([store.accountSObjectVariable]));
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_LOOKUP,
            selectorConfig: {
                queryable: true
            }
        });
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[1].items).toHaveLength(1);
        expect(menuData[1].items[0].value).toEqual(store.accountSObjectVariable.guid);
    });
    it('should have only sobject collection variables', () => {
        selectorsMock.isOrCanContainSelector.mockReturnValue(
            jest.fn().mockReturnValue([store.accountSObjectCollectionVariable])
        );
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_LOOKUP,
            selectorConfig: {
                queryable: true
            }
        });
        expect(menuData[1].label).toBe(sobjectCollectionVariable);
        expect(menuData[1].items).toHaveLength(1);
        expect(menuData[1].items[0].value).toEqual(store.accountSObjectCollectionVariable.guid);
    });
    it('should have one sobject variable and one sobject collection variable', () => {
        selectorsMock.isOrCanContainSelector.mockReturnValue(
            jest.fn().mockReturnValue([store.accountSObjectVariable, store.accountSObjectCollectionVariable])
        );
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_LOOKUP,
            selectorConfig: {
                queryable: true
            }
        });
        // TODO: W-5624868 when getElementsForMenuData is removed, this test should pass showSystemVariables = false so that menuData only expects length 2
        expect(menuData).toHaveLength(4);
        expect(menuData[1].label).toBe(sobjectCollectionVariable);
        expect(menuData[2].label).toBe(sobjectVariable);
        expect(menuData[1].items).toHaveLength(1);
        expect(menuData[1].items[0].value).toEqual(store.accountSObjectCollectionVariable.guid);
        expect(menuData[2].items).toHaveLength(1);
        expect(menuData[2].items[0].value).toEqual(store.accountSObjectVariable.guid);
    });
    it('should have only sobject variables (record Update)', () => {
        selectorsMock.isOrCanContainSelector.mockReturnValue(jest.fn().mockReturnValue([store.accountSObjectVariable]));
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_UPDATE,
            selectorConfig: {
                queryable: true
            }
        });
        expect(menuData[1].label).toBe(sobjectVariable);
        expect(menuData[1].items).toHaveLength(1);
        expect(menuData[1].items[0].value).toEqual(store.accountSObjectVariable.guid);
    });
    it('should have only sobject collection variables  (record Update)', () => {
        selectorsMock.isOrCanContainSelector.mockReturnValue(
            jest.fn().mockReturnValue([store.accountSObjectCollectionVariable])
        );
        const menuData = getElementsForMenuData({
            elementType: ELEMENT_TYPE.RECORD_UPDATE,
            selectorConfig: {
                queryable: true
            }
        });
        expect(menuData[1].label).toBe(sobjectCollectionVariable);
        expect(menuData[1].items).toHaveLength(1);
        expect(menuData[1].items[0].value).toEqual(store.accountSObjectCollectionVariable.guid);
    });
    it('should have dataType populated for number variable', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.numberVariable]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[1].items[0];
        expect(copiedElement.dataType).toBe('Number');
        expect(copiedElement.subtype).toBeNull();
    });
    it('should have dataType and subtype populated for sObject var', () => {
        selectorsMock.writableElementsSelector.mockReturnValue([store.accountSObjectVariable]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[1].items[0];
        expect(copiedElement.dataType).toBe(FLOW_DATA_TYPE.SOBJECT.value);
        expect(copiedElement.subtype).toBe('Account');
    });
    it('should have the iconName and iconSize populated', () => {
        selectorsMock.writableElementsSelector.mockReturnValueOnce([store.numberVariable]);
        const copiedElement = getElementsForMenuData({
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: true
        })[1].items[0];
        expect(copiedElement.iconName).toBe(FLOW_DATA_TYPE.NUMBER.utilityIconName);
        expect(copiedElement.iconSize).toBe('xx-small');
    });

    describe('disableHasNext', () => {
        it('should set hasNext to false for all menu items when true', () => {
            selectorsMock.isOrCanContainSelector.mockReturnValue(
                jest.fn().mockReturnValue([store.accountSObjectVariable, store.accountSObjectCollectionVariable])
            );
            const menuData = getElementsForMenuData(
                {
                    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
                    selectorConfig: {
                        queryable: true
                    }
                },
                null,
                false,
                false,
                true
            );

            expect(menuData[1].items[0].hasNext).toBeFalsy();
            expect(menuData[2].items[0].hasNext).toBeFalsy();
        });

        it('should not manipulate hasNext for all menu items when false', () => {
            selectorsMock.isOrCanContainSelector.mockReturnValue(
                jest.fn().mockReturnValue([store.accountSObjectVariable, store.accountSObjectCollectionVariable])
            );
            const menuData = getElementsForMenuData(
                {
                    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
                    selectorConfig: {
                        queryable: true
                    }
                },
                null,
                false,
                false
            );

            expect(menuData[1].items[0].hasNext).toBeFalsy();
            expect(menuData[2].items[0].hasNext).toBeTruthy();
        });
        selectorsMock.isOrCanContainSelector.mockClear();
    });
    describe('RHS menuData', () => {
        it('should have active picklist values in menu data when LHS is picklist field', () => {
            selectorsMock.writableElementsSelector.mockReturnValue([store.accountSObjectVariable]);
            // configuration for menu data retrieval
            const allowedParamTypes = null;
            const includeNewResource = false;
            const allowGlobalConstants = false;
            const disableHasNext = false;
            const activePicklistValues = ['pick1', 'pick2'];

            const menuData = getElementsForMenuData(
                {
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
                    shouldBeWritable: true
                },
                allowedParamTypes,
                includeNewResource,
                allowGlobalConstants,
                disableHasNext,
                activePicklistValues
            );
            const picklistLabel = 'FlowBuilderExpressionUtils.picklistValuesLabel';
            expect(menuData).toContainEqual(expect.objectContaining({ label: picklistLabel }));
            expect(menuData).toContainEqual(expect.objectContaining({ items: expect.any(Array) }));
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
            const menuData = getElementsForMenuData({ elementType: ELEMENT_TYPE.ASSIGNMENT }, sampleStringParamTypes);

            // only the empty string global constant is added to the menu data
            expect(menuData).toContainEqual(
                expect.objectContaining({
                    label: LABELS.globalConstantCategory
                })
            );
            expect(menuData).toContainEqual(expect.objectContaining({ items: expect.any(Array) }));
            expect(menuData[1].items).toHaveLength(1);
        });
        it('true and false should show in menuData when allowed', () => {
            // all global constants returned from selector
            selectorsMock.readableElementsSelector.mockReturnValue([
                gcObjects[gcLabels.BOOLEAN_FALSE],
                gcObjects[gcLabels.BOOLEAN_TRUE],
                gcObjects[gcLabels.EMPTY_STRING]
            ]);

            // only pass a boolean param for allowedParamTypes
            const menuData = getElementsForMenuData({ elementType: ELEMENT_TYPE.ASSIGNMENT }, sampleBooleanParamTypes);

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
        it('does not include time triggers in the result', () => {
            const dummyTimeTrigger = {
                elementType: 'TimeTrigger'
            };
            const menuData = filterAndMutateMenuData([dummyTimeTrigger], undefined, {
                showSystemVariables: false
            });
            expect(menuData).toHaveLength(0);
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
            const fields = {
                ...mockLightningCompWithAccountOutputFlowExtensionDescription.outputParameters
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
            const fields = {
                ...mockLightningCompWithAccountOutputFlowExtensionDescription.outputParameters
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
