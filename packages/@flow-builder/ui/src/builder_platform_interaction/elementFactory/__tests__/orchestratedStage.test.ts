// @ts-nocheck
import { getElementByGuid, getElementsForElementType } from 'builder_platform_interaction/storeUtils';
import {
    createOrchestratedStageWithItems,
    createStageStep,
    createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor,
    createOrchestratedStageWithItemReferences,
    createOrchestratedStageMetadataObject,
    getSteps,
    getOtherItemsInOrchestratedStage,
    createDuplicateOrchestratedStage,
    createPastedOrchestratedStage,
    getOrchestratedStageChildren,
    getStageStepChildren,
    RELATED_RECORD_INPUT_PARAMETER_NAME
} from '../orchestratedStage';
import { ACTION_TYPE, CONNECTOR_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseChildElement,
    baseCanvasElementsArrayToMap,
    createPastedCanvasElement,
    duplicateCanvasElementWithChildElements
} from '../base/baseElement';
import { ParameterListRowItem } from '../base/baseList';
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject } from '../base/baseMetadata';
import { sanitizeDevName } from 'builder_platform_interaction/commonUtils';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { createActionCall } from '../actionCall';
import { createInputParameter, createInputParameterMetadataObject } from '../inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from '../outputParameter';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn(),
        isExecuteOnlyWhenChangeMatchesConditionsPossible: jest.fn().mockReturnValue(true),
        getElementsForElementType: jest.fn(() => {
            return [];
        })
    };
});

const mockActionWithOutputParametersName = 'actionWithOutput';
const mockOutputParameters = [
    {
        name: 'record',
        dataType: 'sobject',
        sobjectType: 'U__record',
        isOutput: true,
        maxOccurs: 2000
    },
    {
        name: 'aNumber',
        dataType: 'double',
        isOutput: true,
        maxOccurs: 1
    }
];

const mockActionWithInputParametersName = 'actionWithInput';
const mockInputParameters = [
    {
        name: 'record',
        dataType: 'sobject',
        sobjectType: 'U__record',
        isOutput: false
    }
];

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/invocableActionLib');

    return Object.assign({}, actual, {
        getParametersForInvocableAction: (actionInfo) => {
            if (actionInfo.actionName === mockActionWithOutputParametersName) {
                return mockOutputParameters;
            } else if (actionInfo.actionName === mockActionWithInputParametersName) {
                return mockInputParameters;
            }

            return [];
        }
    });
});

const newOrchestratedStageGuid = 'newOrchestratedStage';
const existingOrchestratedStageGuid = 'existingOrchestratedStage';
const orchestratedStageWithChildrenGuid = 'newOrchestratedStageWithChildren';
const existingOrchestratedStageWithOneChildGuid = 'existingOrchestratedStageWithOneChild';
const existingOrchestratedStageWithChildrenGuid = 'existingOrchestratedStageWithChildren';

const existingOrchestratedStage: OrchestratedStage = {
    guid: existingOrchestratedStageGuid,
    childReferences: [{ childReference: 'existingItem1' }, { childReference: 'existingItem2' }],
    stageSteps: []
};
const existingOrchestratedStageWithOneChild = {
    guid: existingOrchestratedStageWithOneChildGuid,
    childReferences: [{ childReference: 'existingItem1' }]
};

const existingOrchestratedStageWithChildren = {
    guid: existingOrchestratedStageWithChildrenGuid,
    childReferences: [{ childReference: 'existingItem1' }, { childReference: 'existingItem2' }]
};

getElementByGuid.mockImplementation((guid) => {
    if (guid === newOrchestratedStageGuid || guid === orchestratedStageWithChildrenGuid) {
        return null;
    } else if (guid === existingOrchestratedStageGuid) {
        return existingOrchestratedStage;
    } else if (guid === existingOrchestratedStageWithChildren.guid) {
        return existingOrchestratedStageWithChildren;
    } else if (guid === 'step1' || guid === 'step2' || guid === 'step3') {
        return {
            guid,
            label: `${guid}-label`,
            name: `${guid}-name`,
            description: `${guid}-description`,
            relatedRecordItem: <ParameterListRowItem>{
                name: `relatedRecord-${guid}`,
                rowIndex: guid,
                valueDataType: 'string'
            },
            entryAction: {
                actionName: {
                    value: null
                },
                actionType: {
                    value: null
                }
            },
            action: {
                actionName: {
                    value: 'autolaunchedFlow'
                },
                actionType: {
                    value: 'orchestratorAutolaunchedFlow'
                }
            },
            exitAction: {
                actionName: {
                    value: null
                },
                actionType: {
                    value: null
                }
            },
            inputParameters: [
                <ParameterListRowItem>{ name: 'ip' },
                <ParameterListRowItem>{ name: RELATED_RECORD_INPUT_PARAMETER_NAME }
            ],
            outputParameters: [<ParameterListRowItem>{ name: 'op1' }, <ParameterListRowItem>{ name: 'op2' }],
            entryActionInputParameters: [<ParameterListRowItem>jest.fn()],
            exitActionInputParameters: [<ParameterListRowItem>jest.fn()],
            assignees: []
        };
    } else if (guid === 'stepWithNoRelatedRecord') {
        return {
            guid,
            label: `${guid}-label`,
            name: `${guid}-name`,
            description: `${guid}-description`,
            entryAction: {
                actionName: {
                    value: null
                },
                actionType: {
                    value: null
                }
            },
            action: {
                actionName: {
                    value: 'autolaunchedFlow'
                },
                actionType: {
                    value: 'orchestratorAutolaunchedFlow'
                }
            },
            exitAction: {
                actionName: {
                    value: null
                },
                actionType: {
                    value: null
                }
            },
            inputParameters: [<ParameterListRowItem>{ name: 'ip' }],
            outputParameters: [<ParameterListRowItem>{ name: 'op1' }, <ParameterListRowItem>{ name: 'op2' }],
            entryActionInputParameters: [<ParameterListRowItem>jest.fn()],
            exitActionInputParameters: [<ParameterListRowItem>jest.fn()],
            assignees: []
        };
    }

    return {
        guid
    };
});

jest.mock('../base/baseElement');
baseCanvasElement
    .mockImplementation((element) => {
        return Object.assign({}, element);
    })
    .mockName('baseCanvasElementMock');
baseChildElement
    .mockImplementation((outcome) => {
        return Object.assign({}, outcome);
    })
    .mockName('baseChildElementMock');

createPastedCanvasElement
    .mockImplementation((duplicatedElement) => {
        return duplicatedElement;
    })
    .mockName('createPastedCanvasElementMock');
duplicateCanvasElementWithChildElements
    .mockImplementation(() => {
        const duplicatedElement = {};
        const duplicatedChildElements = {
            duplicatedStageStepGuid: {
                guid: 'duplicatedStageStepGuid',
                name: 'duplicatedStageStepName',
                assignees: []
            }
        };
        const updatedChildReferences = [
            {
                childReference: 'duplicatedStageStepGuid'
            }
        ];
        const availableConnections = [
            {
                type: CONNECTOR_TYPE.DEFAULT
            }
        ];

        return {
            duplicatedElement,
            duplicatedChildElements,
            updatedChildReferences,
            availableConnections
        };
    })
    .mockName('duplicateCanvasElementWithChildElementsMock');
baseChildElement
    .mockImplementation((step) => {
        return Object.assign({}, step);
    })
    .mockName('baseChildElementMock');

baseCanvasElementsArrayToMap.mockImplementation(jest.requireActual('../base/baseElement').baseCanvasElementsArrayToMap);

jest.mock('../base/baseMetadata');
baseCanvasElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});
baseChildElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});

jest.mock('../actionCall');
createActionCall.mockImplementation((action) => {
    return Object.assign({}, action);
});

jest.mock('../inputParameter');
createInputParameter.mockImplementation((p) => {
    return Object.assign({}, p);
});
createInputParameterMetadataObject.mockImplementation((p) => {
    return Object.assign({}, p);
});

jest.mock('../outputParameter');
createOutputParameter.mockImplementation((p) => {
    return Object.assign({}, p);
});
createOutputParameterMetadataObject.mockImplementation((p) => {
    return Object.assign({}, p);
});

describe('OrchestratedStage', () => {
    describe('createOrchestratedStageWithItems', () => {
        it('includes the return value of a call to baseCanvasElement', () => {
            createOrchestratedStageWithItems(existingOrchestratedStage);

            expect(baseCanvasElement).toHaveBeenCalledWith(existingOrchestratedStage);
        });

        it('element type is ORCHESTRATED_STAGE', () => {
            const orchestratedStage = createOrchestratedStageWithItems(existingOrchestratedStage);

            expect(orchestratedStage.elementType).toEqual(ELEMENT_TYPE.ORCHESTRATED_STAGE);
        });

        it('dataType is ORCHESTRATED_STAGE', () => {
            const orchestratedStage = createOrchestratedStageWithItems(existingOrchestratedStage);

            expect(orchestratedStage.dataType).toEqual(FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value);
        });

        it('default name/label', () => {
            const orchestratedStage = createOrchestratedStageWithItems({});

            expect(getElementsForElementType).toHaveBeenCalledWith(ELEMENT_TYPE.ORCHESTRATED_STAGE);

            const defaultLabel = 'FlowBuilderElementConfig.defaultOrchestratedStageName(1)';
            expect(orchestratedStage.label).toEqual(defaultLabel);
            expect(orchestratedStage.name).toEqual(sanitizeDevName(defaultLabel));
        });

        describe('items', () => {
            it('includes items for all item references present', () => {
                const childReferences = [{ childReference: 'a' }, { childReference: 'b' }, { childReference: 'c' }];

                const stage = createOrchestratedStageWithItems({ childReferences });

                expect(stage.stageSteps).toHaveLength(3);
                expect(stage.stageSteps[0].guid).toEqual(childReferences[0].childReference);
                expect(stage.stageSteps[1].guid).toEqual(childReferences[1].childReference);
                expect(stage.stageSteps[2].guid).toEqual(childReferences[2].childReference);
            });
        });
    });

    describe('createStageStep', () => {
        beforeEach(() => {
            baseChildElement.mockClear();
        });
        it('calls baseChildElement with elementType = STAGE_STEP', () => {
            createStageStep({
                assignees: []
            });
            expect(baseChildElement.mock.calls[0][1]).toEqual(ELEMENT_TYPE.STAGE_STEP);
        });

        it('calls baseChildElement with a step type of "work step"', () => {
            const workStepLabel = 'FlowBuilderElementConfig.workStepLabel';
            createStageStep({
                assignees: []
            });
            expect(baseChildElement.mock.calls[0][0]).toEqual({
                stepTypeLabel: workStepLabel,
                assignees: []
            });
        });

        it('uses existing values when passed in an item object', () => {
            const mockItem = {
                label: 'foo',
                assignees: []
            };

            createStageStep(mockItem);

            expect(baseChildElement.mock.calls[0][0]).toMatchObject(mockItem);
        });

        it('uses the default name and label if none provided', () => {
            const mockItem = {
                parent: existingOrchestratedStageWithChildren.guid,
                assignees: []
            };

            const item = createStageStep(mockItem);

            expect(getElementByGuid).toHaveBeenCalledWith(existingOrchestratedStageWithChildren.guid);
            expect(commonUtils.format).toHaveBeenCalledWith(
                'FlowBuilderElementConfig.defaultStageStepName',
                existingOrchestratedStageWithChildren.childReferences.length + 1,
                undefined
            );
            expect(item.label).toEqual('FlowBuilderElementConfig.defaultStageStepName(3,)');
        });

        it('uses existing action if provided', () => {
            const mockItem = {
                action: {
                    actionName: {
                        value: 'autolaunchedFlow'
                    },
                    actionType: {
                        value: 'orchestratorAutolaunchedFlow'
                    }
                },
                assignees: []
            };

            const item = createStageStep(mockItem);

            expect(item.action).toEqual(createActionCall(mockItem.action));
        });

        it('uses existing input parameters if provided', () => {
            const mockItem = {
                inputParameters: [<InvocableAction>jest.fn()],
                assignees: []
            };

            const item = createStageStep(mockItem);

            expect(item.inputParameters).toHaveLength(1);
            expect(item.inputParameters[0]).toEqual(createInputParameter(mockItem.inputParameters[0]));
        });

        it('uses existing output parameters if provided', () => {
            const mockItem = {
                outputParameters: [<InvocableAction>jest.fn()],
                assignees: []
            };

            const item = createStageStep(mockItem);

            expect(item.outputParameters).toHaveLength(1);
            expect(item.outputParameters[0]).toEqual(createOutputParameter(mockItem.outputParameters[0]));
        });
        it('sets assignees', () => {
            const mockItem = {
                assignees: [
                    {
                        assignee: {
                            assignee: 'foo'
                        },
                        assigneeType: 'User'
                    }
                ]
            };

            const item = createStageStep(mockItem);

            expect(item.assignees).toHaveLength(1);
            expect(item.assignees[0]).toEqual(mockItem.assignees[0]);
        });
        describe('relatedRecordItem', () => {
            it('is set from existing relatedRecordItem if present', () => {
                const mockItem = {
                    relatedRecordItem: { value: 'foo' }
                };
                const item = createStageStep(mockItem);

                expect(item.relatedRecordItem).toEqual(mockItem.relatedRecordItem);
            });
            it('is set from input param if present and not falsy', () => {
                const mockItem = {
                    inputParameters: [
                        { name: 'someInputParam1', value: { value: '1' } },
                        { name: RELATED_RECORD_INPUT_PARAMETER_NAME, value: { value: 'someValue' } },
                        { name: 'someInputParam2', value: { value: '2' } }
                    ]
                };
                const item = createStageStep(mockItem);

                expect(item.relatedRecordItem).toEqual(mockItem.inputParameters[1]);
            });
            describe('is empty', () => {
                it('if no existing relatedRecordItem', () => {
                    const mockItem = {};
                    const item = createStageStep(mockItem);

                    expect(item.relatedRecordItem).toEqual({});
                });
                it('if input parameter is falsy', () => {
                    const mockItem = {
                        inputParameters: [
                            { name: 'someInputParam1', value: { value: '1' } },
                            { name: RELATED_RECORD_INPUT_PARAMETER_NAME, value: '' },
                            { name: 'someInputParam2', value: { value: '2' } }
                        ]
                    };

                    const item = createStageStep(mockItem);

                    expect(item.relatedRecordItem).toEqual({});
                });
            });
        });
    });

    describe('createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor', () => {
        let orchestratedStageFromPropertyEditor;

        beforeEach(() => {
            orchestratedStageFromPropertyEditor = {
                guid: newOrchestratedStageGuid,
                exitActionInputParameters: [],
                stageSteps: [
                    {
                        guid: 'item1',
                        entryConditions: [],
                        assignees: []
                    }
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElement', () => {
            createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor(
                orchestratedStageFromPropertyEditor
            );

            expect(baseCanvasElement).toHaveBeenCalledWith(orchestratedStageFromPropertyEditor);
        });

        it('element type is ORCHESTRATED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS', () => {
            const result = createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor(
                orchestratedStageFromPropertyEditor
            );

            expect(result.elementType).toEqual(ELEMENT_TYPE.ORCHESTRATED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS);
        });

        it('canvas element type is ORCHESTRATED_STAGE', () => {
            const result = createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor(
                orchestratedStageFromPropertyEditor
            );

            expect(result.canvasElement.elementType).toEqual(ELEMENT_TYPE.ORCHESTRATED_STAGE);
        });

        it('canvas element dataType is ORCHESTRATED_STAGE', () => {
            const result = createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor(
                orchestratedStageFromPropertyEditor
            );

            expect(result.canvasElement.dataType).toEqual(FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value);
        });
    });

    describe('createOrchestratedStageWithItemReferences', () => {
        let orchestratedStageFromFlow;

        beforeEach(() => {
            orchestratedStageFromFlow = {
                guid: existingOrchestratedStageGuid,
                stageSteps: [
                    {
                        name: 'step1',
                        guid: 'step1',
                        assignees: []
                    },
                    {
                        name: 'step2',
                        guid: 'step2',
                        assignees: []
                    },
                    {
                        name: 'step3',
                        guid: 'step3',
                        assignees: []
                    }
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElement', () => {
            createOrchestratedStageWithItemReferences(orchestratedStageFromFlow);

            expect(baseCanvasElement).toHaveBeenCalledWith(orchestratedStageFromFlow);
        });

        it('element type is ORCHESTRATED_STAGE', () => {
            const result = createOrchestratedStageWithItemReferences(orchestratedStageFromFlow);

            const orchestratedStage = result.elements[existingOrchestratedStageGuid];
            expect(orchestratedStage.elementType).toEqual(ELEMENT_TYPE.ORCHESTRATED_STAGE);
        });

        it('maxConnections = 1', () => {
            const result = createOrchestratedStageWithItemReferences(orchestratedStageFromFlow);

            const orchestratedStage = result.elements[existingOrchestratedStageGuid];
            expect(orchestratedStage.maxConnections).toEqual(1);
        });

        describe('StageSteps', () => {
            it('includes childReferences for all items present', () => {
                const result = createOrchestratedStageWithItemReferences(orchestratedStageFromFlow);
                const orchestratedStage = result.elements[existingOrchestratedStageGuid];

                expect(orchestratedStage.childReferences).toHaveLength(3);
                expect(orchestratedStage.childReferences[0].childReference).toEqual(
                    orchestratedStageFromFlow.stageSteps[0].guid
                );
                expect(orchestratedStage.childReferences[1].childReference).toEqual(
                    orchestratedStageFromFlow.stageSteps[1].guid
                );
                expect(orchestratedStage.childReferences[2].childReference).toEqual(
                    orchestratedStageFromFlow.stageSteps[2].guid
                );
            });

            it('are included in element map for all stageSteps present', () => {
                const result = createOrchestratedStageWithItemReferences(orchestratedStageFromFlow);

                expect(result.elements[orchestratedStageFromFlow.stageSteps[0].guid]).toMatchObject(
                    orchestratedStageFromFlow.stageSteps[0]
                );
                expect(result.elements[orchestratedStageFromFlow.stageSteps[1].guid]).toMatchObject(
                    orchestratedStageFromFlow.stageSteps[1]
                );
                expect(result.elements[orchestratedStageFromFlow.stageSteps[2].guid]).toMatchObject(
                    orchestratedStageFromFlow.stageSteps[2]
                );
            });
        });
    });
    describe('createOrchestratedStageMetadataObject', () => {
        let orchestratedStageFromStore;

        beforeEach(() => {
            orchestratedStageFromStore = {
                guid: existingOrchestratedStageGuid,
                childReferences: [
                    {
                        childReference: 'step1'
                    },
                    {
                        childReference: 'step2'
                    },
                    {
                        childReference: 'step3'
                    }
                ],
                exitAction: {
                    actionName: null,
                    actionType: null
                },
                exitActionInputParameters: [<ParameterListRowItem>jest.fn()]
            };
        });

        it('includes the return value of a call to baseCanvasElementMetadataObject', () => {
            createOrchestratedStageMetadataObject(orchestratedStageFromStore);

            expect(baseCanvasElementMetadataObject).toHaveBeenCalledWith(orchestratedStageFromStore, {});
        });

        describe('exit criteria', () => {
            it('default to when all stageSteps are completed', () => {
                const orchestratedStage = createOrchestratedStageMetadataObject(orchestratedStageFromStore);
                expect(orchestratedStage.exitConditions).toEqual(undefined);
            });
        });

        describe('stageSteps', () => {
            it('are included for all child references present', () => {
                const orchestratedStage = createOrchestratedStageMetadataObject(orchestratedStageFromStore);

                expect(orchestratedStage.stageSteps).toHaveLength(3);
                expect(orchestratedStage.stageSteps[0].guid).toEqual(
                    orchestratedStageFromStore.childReferences[0].childReference
                );
                expect(orchestratedStage.stageSteps[0].label).toEqual(`${orchestratedStage.stageSteps[0].guid}-label`);
                expect(orchestratedStage.stageSteps[0].name).toEqual(`${orchestratedStage.stageSteps[0].guid}-name`);
                expect(orchestratedStage.stageSteps[0].description).toEqual(
                    `${orchestratedStage.stageSteps[0].guid}-description`
                );
                expect(orchestratedStage.stageSteps[0].inputParameters).toHaveLength(2);
                expect(orchestratedStage.stageSteps[0].inputParameters[0]).toEqual(
                    createInputParameterMetadataObject(orchestratedStage.stageSteps[0].inputParameters[0])
                );

                expect(orchestratedStage.stageSteps[1].guid).toEqual(
                    orchestratedStageFromStore.childReferences[1].childReference
                );
                expect(orchestratedStage.stageSteps[1].label).toEqual(`${orchestratedStage.stageSteps[1].guid}-label`);
                expect(orchestratedStage.stageSteps[1].name).toEqual(`${orchestratedStage.stageSteps[1].guid}-name`);
                expect(orchestratedStage.stageSteps[1].description).toEqual(
                    `${orchestratedStage.stageSteps[1].guid}-description`
                );
                expect(orchestratedStage.stageSteps[1].inputParameters).toHaveLength(2);
                expect(orchestratedStage.stageSteps[1].inputParameters[0]).toEqual(
                    createInputParameterMetadataObject(orchestratedStage.stageSteps[1].inputParameters[0])
                );

                expect(orchestratedStage.stageSteps[2].guid).toEqual(
                    orchestratedStageFromStore.childReferences[2].childReference
                );
                expect(orchestratedStage.stageSteps[2].label).toEqual(`${orchestratedStage.stageSteps[2].guid}-label`);
                expect(orchestratedStage.stageSteps[2].name).toEqual(`${orchestratedStage.stageSteps[2].guid}-name`);
                expect(orchestratedStage.stageSteps[2].description).toEqual(
                    `${orchestratedStage.stageSteps[2].guid}-description`
                );
                expect(orchestratedStage.stageSteps[2].inputParameters).toHaveLength(2);
                expect(orchestratedStage.stageSteps[2].inputParameters[0]).toEqual(
                    createInputParameterMetadataObject(orchestratedStage.stageSteps[2].inputParameters[0])
                );
            });

            describe('related record', () => {
                it('is injected in to the action inputs if present', () => {
                    const orchestratedStage = createOrchestratedStageMetadataObject(orchestratedStageFromStore);

                    expect(orchestratedStage.stageSteps[0].inputParameters).toHaveLength(2);
                    expect(orchestratedStage.stageSteps[0].inputParameters[1]).toEqual(
                        orchestratedStage.stageSteps[0].relatedRecordItem
                    );

                    expect(orchestratedStage.stageSteps[1].inputParameters).toHaveLength(2);
                    expect(orchestratedStage.stageSteps[1].inputParameters[1]).toEqual(
                        orchestratedStage.stageSteps[1].relatedRecordItem
                    );

                    expect(orchestratedStage.stageSteps[2].inputParameters).toHaveLength(2);
                    expect(orchestratedStage.stageSteps[2].inputParameters[1]).toEqual(
                        orchestratedStage.stageSteps[2].relatedRecordItem
                    );
                });

                it('is not inject in to the action inputs if not present', () => {
                    orchestratedStageFromStore.childReferences = [
                        {
                            childReference: 'stepWithNoRelatedRecord'
                        }
                    ];

                    const orchestratedStage = createOrchestratedStageMetadataObject(orchestratedStageFromStore);

                    expect(orchestratedStage.stageSteps[0].inputParameters).toHaveLength(1);
                    expect(orchestratedStage.stageSteps[0].inputParameters[0]).toEqual({
                        name: 'ip'
                    });
                });
            });
        });
    });

    describe('getSteps', () => {
        it('returns all items for the OrchestratedStage', () => {
            const data = getSteps(existingOrchestratedStageWithChildren.guid);
            expect(data).toHaveLength(2);

            expect(getElementByGuid).toHaveBeenCalledTimes(3);
            expect(getElementByGuid.mock.calls[1][0]).toEqual(
                existingOrchestratedStageWithChildren.childReferences[0].childReference
            );
            expect(getElementByGuid.mock.calls[2][0]).toEqual(
                existingOrchestratedStageWithChildren.childReferences[1].childReference
            );
        });
        it('sets the label to WorkStep for all stageSteps', () => {
            const workStepLabel = 'FlowBuilderElementConfig.workStepLabel';
            const data = getSteps(existingOrchestratedStageWithChildren.guid);
            expect(data[0].stepTypeLabel).toEqual(workStepLabel);
            expect(data[1].stepTypeLabel).toEqual(workStepLabel);
        });
    });

    describe('getOtherItemsInOrchestratedStage', () => {
        it('throws an error if no parent found', () => {
            const nonexistantGuid: UI.Guid = 'foo';

            expect(() => {
                getOtherItemsInOrchestratedStage(nonexistantGuid);
            }).toThrow(`No parent OrchestratedStage found for StageStep ${nonexistantGuid}`);
        });

        it('returns an empty array if the only step is the selected one', () => {
            getElementsForElementType.mockImplementation(() => {
                return [existingOrchestratedStageWithOneChild];
            });

            const data = getOtherItemsInOrchestratedStage('existingItem1');

            expect(data).toHaveLength(0);
        });

        it('returns all other children', () => {
            getElementsForElementType.mockImplementation(() => {
                return [existingOrchestratedStageWithChildren];
            });

            const data = getOtherItemsInOrchestratedStage('existingItem1');

            expect(data).toHaveLength(1);
            expect(data[0]).toMatchObject({ guid: 'existingItem2' });
        });
    });

    describe('createPastedOrchestratedStage function', () => {
        const dataForPasting = {
            canvasElementToPaste: {},
            newGuid: 'updatedSSGuid',
            newName: 'updatedSSName',
            childElementGuidMap: {},
            childElementNameMap: {},
            cutOrCopiedChildElements: {}
        };

        const { pastedCanvasElement, pastedChildElements } = createPastedOrchestratedStage(dataForPasting);

        it('pastedCanvasElement in the result should have the updated childReferences', () => {
            expect(pastedCanvasElement.childReferences).toEqual([
                {
                    childReference: 'duplicatedStageStepGuid'
                }
            ]);
        });
        it('pastedCanvasElement has updated availableConnections', () => {
            expect(pastedCanvasElement.availableConnections).toEqual([
                {
                    type: CONNECTOR_TYPE.DEFAULT
                }
            ]);
        });
        it('returns correct pastedChildElements', () => {
            expect(pastedChildElements).toEqual({
                duplicatedStageStepGuid: {
                    guid: 'duplicatedStageStepGuid',
                    name: 'duplicatedStageStepName',
                    assignees: []
                }
            });
        });
    });

    describe('createDuplicateOrchestratedStage function', () => {
        const { duplicatedElement, duplicatedChildElements } = createDuplicateOrchestratedStage(
            {},
            'duplicatedGuid',
            'duplicatedName',
            {},
            {}
        );

        it('duplicatedElement has updated childReferences', () => {
            expect(duplicatedElement.childReferences).toEqual([
                {
                    childReference: 'duplicatedStageStepGuid'
                }
            ]);
        });
        it('duplicatedElement has updated availableConnections', () => {
            expect(duplicatedElement.availableConnections).toEqual([
                {
                    type: CONNECTOR_TYPE.DEFAULT
                }
            ]);
        });
        it('returns correct duplicatedChildElements', () => {
            expect(duplicatedChildElements).toEqual({
                duplicatedStageStepGuid: {
                    guid: 'duplicatedStageStepGuid',
                    name: 'duplicatedStageStepName',
                    assignees: []
                }
            });
        });
    });

    describe('getStageStepChildren', () => {
        let step;
        beforeEach(() => {
            step = {
                entryAction: {
                    actionName: {
                        value: null
                    },
                    actionType: {
                        value: null
                    }
                },
                action: {
                    actionName: {
                        value: 'autolaunchedFlow'
                    },
                    actionType: {
                        value: 'orchestratorAutolaunchedFlow'
                    }
                },
                exitAction: {
                    actionName: {
                        value: null
                    },
                    actionType: {
                        value: null
                    }
                },
                outputParameters: []
            };
        });

        it('includes status', () => {
            const data = getStageStepChildren(step);

            expect(data.Status).toMatchObject({
                name: 'Status',
                apiName: 'Status',
                dataType: 'String'
            });
        });
        describe('Outputs', () => {
            it('returns existing outputs if already present', () => {
                step.outputParameters = [
                    {
                        name: 'foo',
                        apiName: 'foo',
                        dataType: 'string',
                        subtype: 'Account',
                        valueDataType: 'string',
                        label: 'foo',
                        isCollection: true
                    }
                ];
                const data = getStageStepChildren(step);
                expect(step.outputParameters[0]).toMatchObject(
                    data.Outputs.getChildrenItems()[step.outputParameters[0].apiName]
                );
                expect(data.Outputs.subtype).toEqual(step.action.actionName);
            });
            it('not present if no parameters', () => {
                const data = getStageStepChildren(step);
                expect(Object.keys(data)).toHaveLength(1);
                expect(data.Status).toBeTruthy();
            });
            it('not present if no actionName', () => {
                step.action.actionName = undefined;
                const data = getStageStepChildren(step);
                expect(Object.keys(data)).toHaveLength(1);
                expect(data.Status).toBeTruthy();
            });
            it('not present if no output parameters', () => {
                step.action.actionName = mockActionWithInputParametersName;
                const data = getStageStepChildren(step);
                expect(Object.keys(data)).toHaveLength(1);
                expect(data.Status).toBeTruthy();
            });

            it('is present if there are output parameters', () => {
                step.action = {
                    actionName: mockActionWithOutputParametersName,
                    actionType: ACTION_TYPE.CREATE_WORK_ITEM
                };

                const data = getStageStepChildren(step);
                expect(Object.keys(data)).toHaveLength(2);
                expect(data.Outputs).toMatchObject({
                    name: 'Outputs',
                    apiName: 'Outputs',
                    dataType: FLOW_DATA_TYPE.ACTION_OUTPUT.value,
                    isSpanningAllowed: true
                });
            });
            it('getChildrenItems returns output parameters', () => {
                step.action = {
                    actionName: mockActionWithOutputParametersName,
                    actionType: ACTION_TYPE.CREATE_WORK_ITEM
                };

                const data = getStageStepChildren(step);
                const outputChildren = data.Outputs.getChildrenItems();
                expect(Object.keys(outputChildren)).toHaveLength(2);
                expect(outputChildren.record).toMatchObject({
                    name: 'record',
                    apiName: 'record',
                    dataType: 'SObject',
                    isCollection: true
                });
                expect(outputChildren.aNumber).toMatchObject({
                    name: 'aNumber',
                    apiName: 'aNumber',
                    dataType: 'Number'
                });
            });
        });
    });

    it('getOrchestratedStageChildren returns only status', () => {
        const stage = {};

        const data = getOrchestratedStageChildren(stage);

        expect(data.Status).toMatchObject({
            name: 'Status',
            apiName: 'Status',
            dataType: 'String'
        });
    });
});
