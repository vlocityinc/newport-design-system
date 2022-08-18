import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    COLLECTION_PROCESSOR_SUB_TYPE,
    ELEMENT_TYPE,
    FLOW_PROCESS_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { getLHSTypes, getRHSTypes } from 'builder_platform_interaction/ruleLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getStartElement, getStartElementFromState } from 'builder_platform_interaction/storeUtils';
import {
    resetGlobalVariables,
    setGlobalVariables,
    setProcessTypeFeatures
} from 'builder_platform_interaction/systemLib';
import * as mockSubtypeConfig from 'mock/flows/elementSubtypeConfigMock.json';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as orchestration from 'mock/flows/orchestratorFlow.json';
import * as recommendationFlow from 'mock/flows/recommendationFlow.json';
import { flowWithAllElementsUIModel, stringVariable } from 'mock/storeData';
import { orchestratorFlowUIModel } from 'mock/storeDataOrchestrator';
import { recommendationFlowUIModel } from 'mock/storeDataRecommendation';
import { recordTriggeredFlowUIModel, startElement as startElementRecordTriggered } from 'mock/storeDataRecordTriggered';
import { globalVariablesForFlow } from 'serverData/GetAllGlobalVariables/globalVariablesForFlow.json';
import { rules } from 'serverData/RetrieveAllRules/rules.json';
import { filterAndMapToMenuItems } from '../fieldInputMenuDataRetrieval';

const mockedProcessType = FLOW_PROCESS_TYPE.FLOW;
jest.mock('builder_platform_interaction/storeLib', () =>
    jest.requireActual('builder_platform_interaction_mocks/storeLib')
);
jest.mock('builder_platform_interaction/storeUtils', () => ({
    getProcessType: jest.fn().mockImplementation(() => mockedProcessType),
    getStartElementFromState: jest.fn().mockImplementation(() => undefined),
    getStartElement: jest.fn().mockImplementation(() => undefined)
}));
jest.mock(
    '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordLabel',
    () => ({ default: 'Triggering {0}' }),
    {
        virtual: true
    }
);
jest.mock(
    '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordDescription',
    () => ({ default: 'The {0} record that triggered the flow.' }),
    {
        virtual: true
    }
);
jest.mock(
    '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordPriorValueLabel',
    () => ({ default: 'Prior Values of Triggering {0}' }),
    {
        virtual: true
    }
);
jest.mock(
    '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordPriorValueDescription',
    () => ({ default: 'The values of the triggering {0} record before the triggering change.' }),
    {
        virtual: true
    }
);

jest.mock('builder_platform_interaction/elementConfig', () => {
    const actual = jest.requireActual('builder_platform_interaction/elementConfig');

    const elementTypeToConfigMap = actual.elementTypeToConfigMap;
    elementTypeToConfigMap.SortCollectionProcessor = mockSubtypeConfig.SortCollectionProcessor;
    elementTypeToConfigMap.FilterCollectionProcessor = mockSubtypeConfig.FilterCollectionProcessor;
    elementTypeToConfigMap.RecommendationMapCollectionProcessor =
        mockSubtypeConfig.RecommendationMapCollectionProcessor;
    elementTypeToConfigMap.DurationWait = mockSubtypeConfig.DurationWait;
    elementTypeToConfigMap.InteractiveStep = mockSubtypeConfig.InteractiveStep;
    elementTypeToConfigMap.BackgroundStep = mockSubtypeConfig.BackgroundStep;

    return Object.assign({}, actual, {
        elementTypeToConfigMap
    });
});

function setStoreMockState(mockState) {
    // @ts-ignore
    Store.setMockState(mockState);
}

const flowWithAllElementsMetadata = flowWithAllElements.metadata;
const orchestrationMetadata = orchestration.metadata;
const recommendationMetadata = recommendationFlow.metadata;
const recordVariables = (metadata, isCollection = false) =>
    metadata.variables.filter(
        (variable) => variable.dataType === FLOW_DATA_TYPE.SOBJECT.value && variable.isCollection === isCollection
    );
const apexVariables = (metadata, isCollection = false) =>
    metadata.variables.filter(
        (variable) => variable.dataType === FLOW_DATA_TYPE.APEX.value && variable.isCollection === isCollection
    );
const simpleVariables = (metadata, isCollection = false) =>
    metadata.variables.filter(
        (variable) =>
            variable.dataType !== FLOW_DATA_TYPE.APEX.value &&
            variable.dataType !== FLOW_DATA_TYPE.SOBJECT.value &&
            variable.isCollection === isCollection
    );
const sortAlphabetically = (strings) => strings.sort((string1, string2) => string1.localeCompare(string2));
const mapToLabel = (elements) => elements.map((element) => element.label);
const mapToSortedLabels = (elements) => sortAlphabetically(mapToLabel(elements));
const mapToName = (elements) => elements.map((element) => element.name);
const mapToSortedNames = (elements) => sortAlphabetically(mapToName(elements));

describe('filterAndMapToMenuItems', () => {
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
        resetGlobalVariables();

        // @ts-ignore
        getStartElementFromState.mockImplementation(() => undefined);
    });

    let menuDataSortedByLabel, menuDataSortedByApiNames, section, expectedNumberOfSections;
    const checkLabels = (items, expectedLabels) => expect(mapToLabel(items)).toEqual(expectedLabels);
    const checkNames = (items, expectedNames) => expect(mapToName(items)).toEqual(expectedNames);
    describe('E2E with Screen flow', () => {
        beforeAll(() => {
            setStoreMockState(flowWithAllElementsUIModel);
            setGlobalVariables(globalVariablesForFlow);
            setProcessTypeFeatures('Flow', ['GlobalVariables']);
        });

        describe('In decision element LHS', () => {
            beforeAll(() => {
                expectedNumberOfSections = 22;
                menuDataSortedByLabel = filterAndMapToMenuItems(
                    Object.values(Store.getStore().getCurrentState().elements),
                    getLHSTypes(ELEMENT_TYPE.DECISION, rules),
                    {
                        sortField: 'label',
                        activePicklistValues: [],
                        traversalConfig: { isEnabled: true },
                        filter: {
                            includeNewResource: true,
                            allowGlobalConstants: false,
                            showSystemVariables: true,
                            showGlobalVariables: true,
                            shouldBeWritable: false
                        }
                    }
                );
                menuDataSortedByApiNames = filterAndMapToMenuItems(
                    Object.values(Store.getStore().getCurrentState().elements),
                    getLHSTypes(ELEMENT_TYPE.DECISION, rules),
                    {
                        activePicklistValues: [],
                        traversalConfig: { isEnabled: true },
                        filter: {
                            includeNewResource: true,
                            allowGlobalConstants: false,
                            showSystemVariables: true,
                            showGlobalVariables: true,
                            shouldBeWritable: false
                        },
                        sortField: 'name'
                    }
                );
            });
            test('should have the expected number of sections', () => {
                expect(menuDataSortedByLabel.length).toEqual(expectedNumberOfSections);
            });
            describe('First section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[0];
                });
                it('should be action elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.actions');
                });

                it('should contain all actions + apex actions + email alerts in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.actionCalls));
                });

                it('should contain all actions + apex actions + email alerts in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[0].items,
                        mapToSortedNames(flowWithAllElementsMetadata.actionCalls)
                    );
                });
            });
            describe('Second section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[1];
                });
                it('should be assignment elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.assignments');
                });
                it('should contain assignments in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.assignments));
                });
                it('should contain assignments in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[1].items,
                        mapToSortedNames(flowWithAllElementsMetadata.assignments)
                    );
                });
            });
            describe('Third section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[2];
                });
                it('should be decision elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.decisions');
                });
                it('should contain decisions in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.decisions));
                });
                it('should contain decisions in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[2].items,
                        mapToSortedNames(flowWithAllElementsMetadata.decisions)
                    );
                });
            });
            describe('Fourth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[3];
                });
                it('should be loop elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.loops');
                });
                it('should contain loops in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.loops));
                });
                it('should contain loops in alphabetical order based on api name', () => {
                    checkNames(menuDataSortedByApiNames[3].items, mapToSortedNames(flowWithAllElementsMetadata.loops));
                });
            });
            describe('Fifth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[4];
                });
                it('should be create record elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.recordCreate');
                });
                it('should contain record creates in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.recordCreates));
                });
                it('should contain record creates in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[4].items,
                        mapToSortedNames(flowWithAllElementsMetadata.recordCreates)
                    );
                });
            });
            describe('Sixth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[5];
                });
                it('should be delete record elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.recordDelete');
                });
                it('should contain reocrd deletes in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.recordDeletes));
                });
                it('should contain record deletes in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[5].items,
                        mapToSortedNames(flowWithAllElementsMetadata.recordDeletes)
                    );
                });
            });
            describe('Seventh section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[6];
                });
                it('should be get record elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.recordLookup');
                });
                it('should contain record lookups in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.recordLookups));
                });
                it('should contain record lookups in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[6].items,
                        mapToSortedNames(flowWithAllElementsMetadata.recordLookups)
                    );
                });
            });
            describe('Eighth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[7];
                });
                it('should be update record elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.recordUpdate');
                });
                it('should contain record updates in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.recordUpdates));
                });
                it('should contain record updates in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[7].items,
                        mapToSortedNames(flowWithAllElementsMetadata.recordUpdates)
                    );
                });
            });
            describe('Ninth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[8];
                });
                it('should be screens elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.screens');
                });
                it('should contain screens in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.screens));
                });
                it('should contain screenss in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[8].items,
                        mapToSortedNames(flowWithAllElementsMetadata.screens)
                    );
                });
            });
            describe('Tenth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[9];
                });
                it('should be subflows elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.subflows');
                });
                it('should contain subflows in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.subflows));
                });
                it('should contain subflows in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[9].items,
                        mapToSortedNames(flowWithAllElementsMetadata.subflows)
                    );
                });
            });
            describe('Eleventh section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[10];
                });
                it('should be record variables elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.recordVariables');
                });
                it('should contain record variables in alphabetical order based on name whatever the sort config is', () => {
                    const variables = recordVariables(flowWithAllElementsMetadata);
                    checkNames(section.items, mapToSortedNames(variables));
                    checkNames(menuDataSortedByApiNames[10].items, mapToSortedNames(variables));
                });
            });
            describe('Twelveth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[11];
                });
                it('should be record collections', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.recordCollections');
                });
                it('should contain record collection variable in alphabetical order based on name whatever the sort config is', () => {
                    const recordCollections = recordVariables(flowWithAllElementsMetadata, true);
                    checkNames(section.items, mapToSortedNames(recordCollections));
                    checkNames(menuDataSortedByApiNames[11].items, mapToSortedNames(recordCollections));
                });
            });
            describe('Thirteenth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[12];
                });
                it('should be simple variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.simpleVariables');
                });
                it('should contain simple variables in alphabetical order based on name whatever the sort config is', () => {
                    const variables = simpleVariables(flowWithAllElementsMetadata);
                    checkNames(section.items, mapToSortedNames(variables));
                    checkNames(menuDataSortedByApiNames[12].items, mapToSortedNames(variables));
                });
            });
            describe('Fourteenth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[13];
                });
                it('should be simple collection', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.simpleCollections');
                });
                it('should contain simple collection variables in alphabetical order based on name whatever the sort config is', () => {
                    const simpleCollections = simpleVariables(flowWithAllElementsMetadata, true);
                    checkNames(section.items, mapToSortedNames(simpleCollections));
                    checkNames(menuDataSortedByApiNames[13].items, mapToSortedNames(simpleCollections));
                });
            });
            describe('Fifteenth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[14];
                });
                it('should be apex variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.apexVariables');
                });
                it('should contain apex variables in alphabetical order based on name whatever the sort config is', () => {
                    const variables = apexVariables(flowWithAllElementsMetadata);
                    checkNames(section.items, mapToSortedNames(variables));
                    checkNames(menuDataSortedByApiNames[14].items, mapToSortedNames(variables));
                });
            });
            describe('Sixteenth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[15];
                });
                it('should be apex variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.apexCollections');
                });
                it('should contain apex collection variables in alphabetical order based on name whatever the sort config is', () => {
                    const apexCollections = apexVariables(flowWithAllElementsMetadata, true);
                    checkNames(section.items, mapToSortedNames(apexCollections));
                    checkNames(menuDataSortedByApiNames[15].items, mapToSortedNames(apexCollections));
                });
            });
            describe('Seventeenth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[16];
                });
                it('should be constants', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.constants');
                });
                it('should contain constants in alphabetical order based on name whatever the sort config is', () => {
                    checkNames(section.items, mapToSortedNames(flowWithAllElementsMetadata.constants));
                    checkNames(
                        menuDataSortedByApiNames[16].items,
                        mapToSortedNames(flowWithAllElementsMetadata.constants)
                    );
                });
            });
            describe('Eighteenth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[17];
                });
                it('should be constants', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.formulas');
                });
                it('should contain formulas in alphabetical order based on name whatever the sort config is', () => {
                    checkNames(section.items, mapToSortedNames(flowWithAllElementsMetadata.formulas));
                    checkNames(
                        menuDataSortedByApiNames[17].items,
                        mapToSortedNames(flowWithAllElementsMetadata.formulas)
                    );
                });
            });
            describe('Nineteenth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[18];
                });
                it('should be constants', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.choices');
                });
                it('should contain choices, collection record choice set, record choice set in alphabetical order based on name whatever the sort config is', () => {
                    const allChoices = [
                        ...flowWithAllElementsMetadata.choices,
                        ...flowWithAllElementsMetadata.dynamicChoiceSets
                    ];
                    checkNames(section.items, mapToSortedNames(allChoices));
                    checkNames(menuDataSortedByApiNames[18].items, mapToSortedNames(allChoices));
                });
            });
            describe('Twentieth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[19];
                });
                it('should be stages', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.stages');
                });
                it('should contain stages in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(flowWithAllElementsMetadata.stages));
                });
                it('should contain stages in alphabetical order based on api name', () => {
                    checkNames(
                        menuDataSortedByApiNames[19].items,
                        mapToSortedNames(flowWithAllElementsMetadata.stages)
                    );
                });
            });
            describe('Twenty-first section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[20];
                });
                it('should be text templates', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.textTemplates');
                });
                it('should contain text templates in alphabetical order based on name whatever the sort config is', () => {
                    checkNames(section.items, mapToSortedNames(flowWithAllElementsMetadata.textTemplates));
                    checkNames(
                        menuDataSortedByApiNames[20].items,
                        mapToSortedNames(flowWithAllElementsMetadata.textTemplates)
                    );
                });
            });
            describe('Twenty-second section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[21];
                });
                it('should be Global Variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.globalResources');
                });
                it('should contain global and system variables in the expected order', () => {
                    // TODO icon
                    expect(section.items).toMatchObject(
                        expect.arrayContaining([
                            expect.objectContaining({
                                name: '$Flow',
                                label: 'FlowBuilderFieldInputGlobalResources.globalFlowLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalFlowDescription'
                            }),
                            expect.objectContaining({
                                name: '$Organization',
                                label: 'FlowBuilderFieldInputGlobalResources.globalOrgLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalOrgDescription'
                            }),
                            expect.objectContaining({
                                name: '$Setup'
                                // TODO label and desc tbd
                            }),
                            expect.objectContaining({
                                name: '$User',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserDescription'
                            }),
                            expect.objectContaining({
                                name: '$UserRole',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserRoleLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserRoleDescription'
                            }),
                            expect.objectContaining({
                                name: '$Profile',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserProfileLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserProfileDescription'
                            }),
                            expect.objectContaining({
                                name: '$Api',
                                label: 'FlowBuilderFieldInputGlobalResources.globalApiLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalApiDescription'
                            }),
                            expect.objectContaining({
                                name: '$System',
                                label: 'FlowBuilderFieldInputGlobalResources.globalSystemLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalSystemDescription'
                            })
                        ])
                    );
                });
            });
        });
        describe('In decision element RHS', () => {
            let expectedIndexOfGlobalValues;
            beforeAll(() => {
                menuDataSortedByLabel = filterAndMapToMenuItems(
                    Object.values(Store.getStore().getCurrentState().elements),
                    getRHSTypes(ELEMENT_TYPE.DECISION, stringVariable, undefined, rules),
                    {
                        sortField: 'label',
                        // @ts-ignore
                        activePicklistValues: [{ value: 'pick1' }, { value: 'pick2' }],
                        traversalConfig: { isEnabled: true },
                        filter: {
                            includeNewResource: true,
                            allowGlobalConstants: true,
                            showSystemVariables: true,
                            showGlobalVariables: true,
                            shouldBeWritable: false
                        }
                    }
                );
                expectedNumberOfSections = 17;
                expectedIndexOfGlobalValues = expectedNumberOfSections - 1;
            });
            it('show picklist values first', () => {
                expect(menuDataSortedByLabel[0].label).toBe('FlowBuilderExpressionUtils.picklistValuesLabel');
                expect(menuDataSortedByLabel[0].items).toMatchObject(
                    expect.arrayContaining([
                        expect.objectContaining({
                            name: 'pick1'
                        }),
                        expect.objectContaining({
                            name: 'pick2'
                        })
                    ])
                );
            });
            it('shows global constants section at the penultimate place', () => {
                expect(menuDataSortedByLabel[expectedIndexOfGlobalValues].label).toBe(
                    'FlowBuilderFieldInputMenuCategories.globalValues'
                );
            });
            it('should contain global constants in the expected order', () => {
                // TODO icon
                expect(menuDataSortedByLabel[expectedIndexOfGlobalValues].items).toMatchObject(
                    expect.arrayContaining([
                        expect.objectContaining({
                            name: '$GlobalConstant.True',
                            label: 'FlowBuilderFieldInputGlobalValues.globalValueTrue',
                            description: 'FlowBuilderFieldInputGlobalValues.globalValueTrueDescription'
                        }),
                        expect.objectContaining({
                            name: '$GlobalConstant.False',
                            label: 'FlowBuilderFieldInputGlobalValues.globalValueFalse',
                            description: 'FlowBuilderFieldInputGlobalValues.globalValueFalseDescription'
                        }),
                        expect.objectContaining({
                            name: '$GlobalConstant.EmptyString',
                            label: 'FlowBuilderFieldInputGlobalValues.globalValueEmptyString',
                            description: 'FlowBuilderFieldInputGlobalValues.globalValueEmptyStringDescription'
                        })
                    ])
                );
            });
        });
    });
    describe('E2E with Orchestration', () => {
        beforeAll(() => {
            setStoreMockState(orchestratorFlowUIModel);
        });

        describe('In decision element LHS', () => {
            beforeAll(() => {
                expectedNumberOfSections = 4;
                menuDataSortedByLabel = filterAndMapToMenuItems(
                    Object.values(Store.getStore().getCurrentState().elements),
                    getLHSTypes(ELEMENT_TYPE.DECISION, rules),
                    {
                        sortField: 'label',
                        activePicklistValues: [],
                        traversalConfig: { isEnabled: true },
                        filter: {
                            includeNewResource: true,
                            allowGlobalConstants: false,
                            showSystemVariables: true,
                            showGlobalVariables: true,
                            shouldBeWritable: false
                        }
                    }
                );
            });
            it('should have the expected number of sections', () => {
                expect(menuDataSortedByLabel.length).toEqual(expectedNumberOfSections);
            });
            describe('First section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[0];
                });
                it('should be decision elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.decisions');
                });
                it('should contain decisions in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(orchestrationMetadata.decisions));
                });
            });
            describe('Second section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[1];
                });
                it('should be stages elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.orchestratedStages');
                });
                it('should contain stages in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(orchestrationMetadata.orchestratedStages));
                });
            });
            describe('Third section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[2];
                });
                it('should be simple variables elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.simpleVariables');
                });
                it('should contain variables in alphabetical order based on name', () => {
                    checkNames(section.items, mapToSortedNames(orchestrationMetadata.variables));
                });
            });
            describe('Fourth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[3];
                });
                it('should be Global Variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.globalResources');
                });
                it('should contain global and system variables in the expected order', () => {
                    // TODO icon
                    expect(section.items).toMatchObject(
                        expect.arrayContaining([
                            expect.objectContaining({
                                name: '$Flow',
                                label: 'FlowBuilderFieldInputGlobalResources.globalFlowLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalFlowDescription'
                            }),
                            expect.objectContaining({
                                name: '$Organization',
                                label: 'FlowBuilderFieldInputGlobalResources.globalOrgLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalOrgDescription'
                            }),
                            expect.objectContaining({
                                name: '$Setup'
                                // TODO label and desc tbd
                            }),
                            expect.objectContaining({
                                name: '$User',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserDescription'
                            }),
                            expect.objectContaining({
                                name: '$UserRole',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserRoleLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserRoleDescription'
                            }),
                            expect.objectContaining({
                                name: '$Profile',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserProfileLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserProfileDescription'
                            }),
                            expect.objectContaining({
                                name: '$Api',
                                label: 'FlowBuilderFieldInputGlobalResources.globalApiLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalApiDescription'
                            }),
                            expect.objectContaining({
                                name: '$System',
                                label: 'FlowBuilderFieldInputGlobalResources.globalSystemLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalSystemDescription'
                            })
                        ])
                    );
                });
            });
        });
    });
    describe('E2E with Recommendation', () => {
        const collectionProcessorsOfType = (type: COLLECTION_PROCESSOR_SUB_TYPE) =>
            recommendationMetadata.collectionProcessors.filter((processor) => processor.elementSubtype === type);
        beforeAll(() => {
            setStoreMockState(recommendationFlowUIModel);
        });

        // FIXME tests will need to be updated WRT variables when W-10899339 is handled.
        describe('In decision element LHS', () => {
            beforeAll(() => {
                expectedNumberOfSections = 13;
                menuDataSortedByLabel = filterAndMapToMenuItems(
                    Object.values(Store.getStore().getCurrentState().elements),
                    getLHSTypes(ELEMENT_TYPE.DECISION, rules),
                    {
                        sortField: 'label',
                        activePicklistValues: [],
                        traversalConfig: { isEnabled: true },
                        filter: {
                            includeNewResource: true,
                            allowGlobalConstants: false,
                            showSystemVariables: true,
                            showGlobalVariables: true,
                            shouldBeWritable: false
                        }
                    }
                );
            });
            it('should have the expected number of sections', () => {
                expect(menuDataSortedByLabel.length).toEqual(expectedNumberOfSections);
            });
            describe('First section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[0];
                });
                it('should be assignment elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.assignments');
                });
                it('should contain assignments in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(recommendationMetadata.assignments));
                });
            });
            describe('Second section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[1];
                });
                it('should be filter elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.filter');
                });
                it('should contain filter in alphabetical order based on label', () => {
                    checkLabels(
                        section.items,
                        mapToSortedLabels(collectionProcessorsOfType(COLLECTION_PROCESSOR_SUB_TYPE.FILTER))
                    );
                });
            });
            describe('Third section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[2];
                });
                it('should be loop elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.loops');
                });
                it('should contain loops in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(recommendationMetadata.loops));
                });
            });
            describe('Fourth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[3];
                });
                it('should be map elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.map');
                });
                it('should contain maps in alphabetical order based on label', () => {
                    checkLabels(
                        section.items,
                        mapToSortedLabels(collectionProcessorsOfType(COLLECTION_PROCESSOR_SUB_TYPE.MAP))
                    );
                });
            });
            describe('Fifth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[4];
                });
                it('should be get record elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.recordLookup');
                });
                it('should contain record lookups in alphabetical order based on label', () => {
                    checkLabels(section.items, mapToSortedLabels(recommendationMetadata.recordLookups));
                });
            });
            describe('Sixth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[5];
                });
                it('should be sort elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.sort');
                });
                it('should contain sorts in alphabetical order based on label', () => {
                    checkLabels(
                        section.items,
                        mapToSortedLabels(collectionProcessorsOfType(COLLECTION_PROCESSOR_SUB_TYPE.SORT))
                    );
                });
            });
            describe('Seventh section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[6];
                });
                it('should be record variables elements', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.recordVariables');
                });
                it('should contain record variables in alphabetical order based on name', () => {
                    const variables = recordVariables(recommendationMetadata);
                    checkNames(section.items, mapToSortedNames(variables));
                });
            });
            describe('Eighth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[7];
                });
                it('should be record collections', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.recordCollections');
                });
                it('should contain record collection variable in alphabetical order based on name', () => {
                    const recordCollections = recordVariables(recommendationMetadata, true);
                    checkNames(section.items, mapToSortedNames(recordCollections));
                });
            });
            describe('Ninth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[8];
                });
                it('should be simple variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.simpleVariables');
                });
                it('should contain simple variables in alphabetical order based on name', () => {
                    const variables = simpleVariables(recommendationMetadata);
                    checkNames(section.items, mapToSortedNames(variables));
                });
            });
            describe('Tenth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[9];
                });
                it('should be simple collection', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.simpleCollections');
                });
                it('should contain simple collection variables in alphabetical order based on name', () => {
                    const simpleCollections = simpleVariables(recommendationMetadata, true);
                    checkNames(section.items, mapToSortedNames(simpleCollections));
                });
            });
            describe('Eleventh section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[10];
                });
                it('should be apex variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.apexVariables');
                });
                it('should contain apex variables in alphabetical order based on name', () => {
                    const variables = apexVariables(recommendationMetadata);
                    checkNames(section.items, mapToSortedNames(variables));
                });
            });
            describe('Twelveth section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[11];
                });
                it('should be apex variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.apexCollections');
                });
                it('should contain apex collection variables in alphabetical order based on name', () => {
                    const apexCollections = apexVariables(recommendationMetadata, true);
                    checkNames(section.items, mapToSortedNames(apexCollections));
                });
            });
            describe('Thirteens section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[12];
                });
                it('should be Global Variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.globalResources');
                });
                it('should contain global and system variables in the expected order', () => {
                    // TODO icon
                    expect(section.items).toMatchObject(
                        expect.arrayContaining([
                            expect.objectContaining({
                                name: '$Flow',
                                label: 'FlowBuilderFieldInputGlobalResources.globalFlowLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalFlowDescription'
                            }),
                            expect.objectContaining({
                                name: '$Organization',
                                label: 'FlowBuilderFieldInputGlobalResources.globalOrgLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalOrgDescription'
                            }),
                            expect.objectContaining({
                                name: '$Setup'
                                // TODO label and desc tbd
                            }),
                            expect.objectContaining({
                                name: '$User',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserDescription'
                            }),
                            expect.objectContaining({
                                name: '$UserRole',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserRoleLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserRoleDescription'
                            }),
                            expect.objectContaining({
                                name: '$Profile',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserProfileLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserProfileDescription'
                            }),
                            expect.objectContaining({
                                name: '$Api',
                                label: 'FlowBuilderFieldInputGlobalResources.globalApiLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalApiDescription'
                            }),
                            expect.objectContaining({
                                name: '$System',
                                label: 'FlowBuilderFieldInputGlobalResources.globalSystemLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalSystemDescription'
                            })
                        ])
                    );
                });
            });
        });
    });
    describe('E2E with recordTriggeredFlow', () => {
        beforeAll(() => {
            setStoreMockState(recordTriggeredFlowUIModel);
            // @ts-ignore
            getStartElement.mockImplementation(() => startElementRecordTriggered);
        });

        describe('In decision element LHS', () => {
            beforeAll(() => {
                expectedNumberOfSections = 8;
                menuDataSortedByLabel = filterAndMapToMenuItems(
                    Object.values(Store.getStore().getCurrentState().elements),
                    getLHSTypes(ELEMENT_TYPE.DECISION, rules),
                    {
                        sortField: 'label',
                        activePicklistValues: [],
                        traversalConfig: { isEnabled: true },
                        filter: {
                            includeNewResource: true,
                            allowGlobalConstants: false,
                            showSystemVariables: true,
                            showGlobalVariables: true,
                            shouldBeWritable: false
                        }
                    }
                );
            });
            it('should have the expected number of sections', () => {
                expect(menuDataSortedByLabel.length).toEqual(expectedNumberOfSections);
            });
            describe('Last section', () => {
                beforeAll(() => {
                    section = menuDataSortedByLabel[7];
                });
                it('should be Global Variables', () => {
                    expect(section.label).toEqual('FlowBuilderFieldInputMenuCategories.globalResources');
                });
                it('should contain global and system variables in the expected order', () => {
                    // TODO icon
                    expect(section.items).toMatchObject(
                        expect.arrayContaining([
                            expect.objectContaining({
                                name: '$Record',
                                label: 'Triggering Account',
                                description: 'The Account record that triggered the flow.'
                            }),
                            expect.objectContaining({
                                name: '$Record__Prior',
                                label: 'Prior Values of Triggering Account',
                                description: 'The values of the triggering Account record before the triggering change.'
                            }),
                            expect.objectContaining({
                                name: '$Flow',
                                label: 'FlowBuilderFieldInputGlobalResources.globalFlowLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalFlowDescription'
                            }),
                            expect.objectContaining({
                                name: '$Organization',
                                label: 'FlowBuilderFieldInputGlobalResources.globalOrgLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalOrgDescription'
                            }),
                            expect.objectContaining({
                                name: '$Setup'
                                // TODO label and desc tbd
                            }),
                            expect.objectContaining({
                                name: '$User',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserDescription'
                            }),
                            expect.objectContaining({
                                name: '$UserRole',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserRoleLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserRoleDescription'
                            }),
                            expect.objectContaining({
                                name: '$Profile',
                                label: 'FlowBuilderFieldInputGlobalResources.globalUserProfileLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalUserProfileDescription'
                            }),
                            expect.objectContaining({
                                name: '$Api',
                                label: 'FlowBuilderFieldInputGlobalResources.globalApiLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalApiDescription'
                            }),
                            expect.objectContaining({
                                name: '$System',
                                label: 'FlowBuilderFieldInputGlobalResources.globalSystemLabel',
                                description: 'FlowBuilderFieldInputGlobalResources.globalSystemDescription'
                            })
                        ])
                    );
                });
            });
        });
    });
});
