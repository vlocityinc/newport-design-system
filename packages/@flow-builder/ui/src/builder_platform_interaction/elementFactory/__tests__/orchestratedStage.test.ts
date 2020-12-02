// @ts-nocheck

import {
    getElementByGuid,
    getElementsForElementType,
    shouldUseAutoLayoutCanvas
} from 'builder_platform_interaction/storeUtils';
import {
    createOrchestratedStageWithItems,
    createStageStep,
    createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor,
    createOrchestratedStageWithItemReferences,
    createOrchestratedStageMetadataObject,
    getSteps,
    getOtherItemsInOrchestratedStage,
    createDuplicateOrchestratedStage,
    createPastedOrchestratedStage
} from '../orchestratedStage';
import { CONNECTOR_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
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
import { Guid } from 'builder_platform_interaction/uiModel';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { createActionCall } from '../actionCall';
import { createInputParameter, createInputParameterMetadataObject } from '../inputParameter';
import { createOutputParameter, createOutputParameterMetadataObject } from '../outputParameter';
import { RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn(),
        isExecuteOnlyWhenChangeMatchesConditionsPossible: jest.fn().mockReturnValue(true),
        shouldUseAutoLayoutCanvas: jest.fn(),
        getElementsForElementType: jest.fn(() => {
            return [];
        })
    };
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
            entryConditions: [],
            inputParameters: [<ParameterListRowItem>jest.fn()],
            outputParameters: [<ParameterListRowItem>jest.fn(), <ParameterListRowItem>jest.fn()]
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
                name: 'duplicatedStageStepName'
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
            createStageStep({});
            expect(baseChildElement.mock.calls[0][1]).toEqual(ELEMENT_TYPE.STAGE_STEP);
        });

        it('calls baseChildElement with a step type of "work step"', () => {
            const workStepLabel = 'FlowBuilderElementConfig.workStepLabel';
            createStageStep({});
            expect(baseChildElement.mock.calls[0][0]).toEqual({
                stepTypeLabel: workStepLabel
            });
        });

        it('uses existing values when passed in an item object', () => {
            const mockItem = {
                label: 'foo'
            };

            createStageStep(mockItem);

            expect(baseChildElement.mock.calls[0][0]).toMatchObject(mockItem);
        });

        it('uses the default name and label if none provided', () => {
            const mockItem = {
                parent: existingOrchestratedStageWithChildren.guid
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
                action: <InvocableAction>jest.fn()
            };

            const item = createStageStep(mockItem);

            expect(item.action).toEqual(createActionCall(mockItem.action));
        });

        it('uses existing input parameters if provided', () => {
            const mockItem = {
                inputParameters: [<InvocableAction>jest.fn()]
            };

            const item = createStageStep(mockItem);

            expect(item.inputParameters).toHaveLength(1);
            expect(item.inputParameters[0]).toEqual(createInputParameter(mockItem.inputParameters[0]));
        });

        it('uses existing output parameters if provided', () => {
            const mockItem = {
                outputParameters: [<InvocableAction>jest.fn()]
            };

            const item = createStageStep(mockItem);

            expect(item.outputParameters).toHaveLength(1);
            expect(item.outputParameters[0]).toEqual(createOutputParameter(mockItem.outputParameters[0]));
        });
    });

    describe('createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor', () => {
        const shouldUseFlc = (useFlc) => {
            shouldUseAutoLayoutCanvas.mockImplementation(() => {
                return useFlc;
            });
        };

        let orchestratedStageFromPropertyEditor;

        beforeEach(() => {
            shouldUseFlc(false);

            orchestratedStageFromPropertyEditor = {
                guid: newOrchestratedStageGuid,
                stageSteps: [
                    {
                        guid: 'item1',
                        entryConditions: []
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

        it('element type is ORCHESTRATED_STAGE', () => {
            const result = createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor(
                orchestratedStageFromPropertyEditor
            );

            expect(result.canvasElement.elementType).toEqual(ELEMENT_TYPE.ORCHESTRATED_STAGE);
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
                        guid: 'step1'
                    },
                    {
                        name: 'step2',
                        guid: 'step2'
                    },
                    {
                        name: 'step3',
                        guid: 'step3'
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
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElementMetadataObject', () => {
            createOrchestratedStageMetadataObject(orchestratedStageFromStore);

            expect(baseCanvasElementMetadataObject).toHaveBeenCalledWith(orchestratedStageFromStore, {});
        });

        describe('exit criteria', () => {
            it('default to when all stageSteps are completed', () => {
                const orchestratedStage = createOrchestratedStageMetadataObject(orchestratedStageFromStore);

                expect(orchestratedStage.exitConditions[0]).toEqual({
                    leftValueReference: orchestratedStageFromStore.childReferences[0].childReference,
                    operator: RULE_OPERATOR.EQUAL_TO,
                    rightValue: {
                        stringValue: 'Completed'
                    }
                });

                expect(orchestratedStage.exitConditions[1]).toEqual({
                    leftValueReference: orchestratedStageFromStore.childReferences[1].childReference,
                    operator: RULE_OPERATOR.EQUAL_TO,
                    rightValue: {
                        stringValue: 'Completed'
                    }
                });

                expect(orchestratedStage.exitConditions[2]).toEqual({
                    leftValueReference: orchestratedStageFromStore.childReferences[2].childReference,
                    operator: RULE_OPERATOR.EQUAL_TO,
                    rightValue: {
                        stringValue: 'Completed'
                    }
                });
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
                expect(orchestratedStage.stageSteps[0].inputParameters).toHaveLength(1);
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
                expect(orchestratedStage.stageSteps[1].inputParameters).toHaveLength(1);
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
                expect(orchestratedStage.stageSteps[2].inputParameters).toHaveLength(1);
                expect(orchestratedStage.stageSteps[2].inputParameters[0]).toEqual(
                    createInputParameterMetadataObject(orchestratedStage.stageSteps[2].inputParameters[0])
                );
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
            const nonexistantGuid: Guid = 'foo';

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
                    name: 'duplicatedStageStepName'
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
                    name: 'duplicatedStageStepName'
                }
            });
        });
    });
});
