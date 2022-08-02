// @ts-nocheck
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import {
    getAlcConnectorData,
    getAlcNodeData,
    getCanvasElementDeselectionData,
    getCanvasElementSelectionData
} from '../alcComponentsUtils';
import {
    flowModelData,
    flowModelWithGoToInLoop,
    flowModelWithGoToOnFault,
    flowModelWithOneDecision,
    orchestrationFlowModel,
    recordTriggeredFlowModelData,
    recordTriggeredFlowModelWithScheduledPathsData,
    recordTriggerFlowModel2,
    scheduleTriggerFlowModel
} from './mockData';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const ELEMENT_TYPE_ASSIGNMENT = 'Assignment';
const ELEMENT_TYPE_DECISION = 'Decision';
const ELEMENT_TYPE_SCREEN = 'Screen';
const ELEMENT_TYPE_START_ELEMENT = 'START_ELEMENT';
const ELEMENT_TYPE_WAIT = 'wait';
const ELEMENT_TYPE_END_ELEMENT = 'END_ELEMENT';
const ELEMENT_TYPE_LOOP = 'Loop';

const checkSelectionDeselectionResultEquality = (
    result,
    expectedCanvasElementGuidsToSelect,
    expectedCanvasElementGuidsToDeselect,
    expectedSelectableCanvasElementGuids,
    expectedTopSelectedGuid
) => {
    expect(result.canvasElementGuidsToSelect).toEqual(expectedCanvasElementGuidsToSelect);
    expect(result.canvasElementGuidsToDeselect).toEqual(expectedCanvasElementGuidsToDeselect);
    expect(result.selectableCanvasElementGuids).toEqual(expectedSelectableCanvasElementGuids);
    if (expectedTopSelectedGuid === '') {
        expect(result.topSelectedGuid).toBeNull();
    } else {
        expect(result.topSelectedGuid).toEqual(expectedTopSelectedGuid);
    }
};

describe('ALC Canvas Utils test', () => {
    describe('getCanvasElementSelectionData function', () => {
        it('When no element has been previously selected', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3'
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null
                }
            };

            const result = getCanvasElementSelectionData(flowModel, 'guid2', null);
            checkSelectionDeselectionResultEquality(result, ['guid2'], [], ['guid2', 'guid1', 'guid3'], 'guid2');
        });

        it('When no element has been previously selected and selecting a branch element', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_DECISION,
                    nodeType: NodeType.BRANCH,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3',
                    children: ['guid4', 'guid5']
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: null,
                    childIndex: 0
                },
                guid5: {
                    guid: 'guid5',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: null,
                    childIndex: 1
                }
            };

            const result = getCanvasElementSelectionData(flowModel, 'guid4', null);
            checkSelectionDeselectionResultEquality(result, ['guid4'], [], ['guid4', 'guid2', 'guid1'], 'guid4');
        });

        it('When selecting elements downwards', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: true
                    },
                    prev: null,
                    next: 'guid2',
                    incomingGoTo: ['guid2:default']
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_WAIT,
                    nodeType: NodeType.BRANCH,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3',
                    children: ['guid4', 'guid1'],
                    fault: 'guid5',
                    incomingGoTo: ['guid4'],
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ]
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: 'end1'
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE_WAIT,
                    nodeType: NodeType.BRANCH,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: 'guid2',
                    childIndex: 0,
                    children: [null, null],
                    fault: 'guid6',
                    isTerminal: true
                },
                guid5: {
                    guid: 'guid5',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: 'end2',
                    childIndex: -1
                },
                guid6: {
                    guid: 'guid6',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid4',
                    prev: null,
                    next: 'end3',
                    childIndex: -1
                },
                end1: {
                    guid: 'end1',
                    elementType: ELEMENT_TYPE_END_ELEMENT,
                    nodeType: NodeType.END,
                    prev: 'guid3',
                    next: null
                },
                end2: {
                    guid: 'end2',
                    elementType: ELEMENT_TYPE_END_ELEMENT,
                    nodeType: NodeType.END,
                    prev: 'guid5',
                    next: null
                },
                end3: {
                    guid: 'end3',
                    elementType: ELEMENT_TYPE_END_ELEMENT,
                    nodeType: NodeType.END,
                    prev: 'guid6',
                    next: null
                }
            };

            const result = getCanvasElementSelectionData(flowModel, 'guid3', 'guid1');
            checkSelectionDeselectionResultEquality(
                result,
                ['guid3', 'guid4', 'guid6', 'guid2'],
                [],
                ['guid1', 'guid2', 'guid4', 'guid6', 'guid5', 'guid3'],
                'guid1'
            );
        });

        it('When selecting elements upwards', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_START_ELEMENT,
                    nodeType: NodeType.START,
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_DECISION,
                    nodeType: NodeType.BRANCH,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3',
                    children: ['guid4', 'guid6', 'guid5'],
                    incomingGoTo: ['guid4'],
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_LOOP,
                    nodeType: NodeType.LOOP,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null,
                    children: ['guid6']
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: 'guid2',
                    childIndex: 0,
                    isTerminal: true
                },
                guid5: {
                    guid: 'guid5',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: null,
                    childIndex: 2
                },
                guid6: {
                    guid: 'guid6',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelected: true
                    },
                    parent: 'guid3',
                    prev: null,
                    next: null,
                    childIndex: 0,
                    incomingGoTo: ['guid2:o2']
                }
            };

            const result = getCanvasElementSelectionData(flowModel, 'guid2', 'guid6');
            checkSelectionDeselectionResultEquality(
                result,
                ['guid3', 'guid4', 'guid5', 'guid2'],
                [],
                ['guid2', 'guid4', 'guid5', 'guid3', 'guid6'],
                'guid2'
            );
        });
    });

    describe('getCanvasElementDeselectionData function', () => {
        describe('Deselecting the top selected element', () => {
            it('When top element is the only selected element', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE_ASSIGNMENT,
                        nodeType: NodeType.DEFAULT,
                        config: {
                            isSelected: false
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE_DECISION,
                        nodeType: NodeType.BRANCH,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', null]
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE_SCREEN,
                        nodeType: NodeType.DEFAULT,
                        config: {
                            isSelected: false
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE_SCREEN,
                        nodeType: NodeType.DEFAULT,
                        config: {
                            isSelected: false
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0
                    }
                };

                const result = getCanvasElementDeselectionData(flowModel, 'guid2', 'guid2');
                checkSelectionDeselectionResultEquality(result, [], ['guid2'], [], '');
            });

            it('When top element is not the only selected element', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE_ASSIGNMENT,
                        nodeType: NodeType.DEFAULT,
                        config: {
                            isSelected: false
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE_DECISION,
                        nodeType: NodeType.BRANCH,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', null]
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE_SCREEN,
                        nodeType: NodeType.DEFAULT,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE_SCREEN,
                        nodeType: NodeType.DEFAULT,
                        config: {
                            isSelected: false
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0
                    }
                };

                const result = getCanvasElementDeselectionData(flowModel, 'guid2', 'guid2');
                checkSelectionDeselectionResultEquality(result, [], ['guid2'], ['guid3', 'guid2', 'guid1'], 'guid3');
            });

            it('When top element has selected child elements', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE_ASSIGNMENT,
                        nodeType: NodeType.DEFAULT,
                        config: {
                            isSelected: false
                        },
                        prev: null,
                        next: 'guid2',
                        incomingGoTo: ['guid2:default']
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE_WAIT,
                        nodeType: NodeType.BRANCH,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', 'guid1'],
                        fault: 'guid5',
                        incomingGoTo: ['guid4', 'guid4:fault'],
                        childReferences: [
                            {
                                childReference: 'o1'
                            }
                        ]
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE_SCREEN,
                        nodeType: NodeType.DEFAULT,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: 'end1'
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE_WAIT,
                        nodeType: NodeType.BRANCH,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: 'guid2',
                        childIndex: 0,
                        children: [null, null],
                        fault: 'guid2',
                        isTerminal: true
                    },
                    guid5: {
                        guid: 'guid5',
                        elementType: ELEMENT_TYPE_SCREEN,
                        nodeType: NodeType.DEFAULT,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: 'end2',
                        childIndex: -1
                    },
                    end1: {
                        guid: 'end1',
                        elementType: ELEMENT_TYPE_END_ELEMENT,
                        nodeType: NodeType.END,
                        prev: 'guid3',
                        next: null
                    },
                    end2: {
                        guid: 'end2',
                        elementType: ELEMENT_TYPE_END_ELEMENT,
                        nodeType: NodeType.END,
                        prev: 'guid5',
                        next: null
                    }
                };

                const result = getCanvasElementDeselectionData(flowModel, 'guid2', 'guid2');
                checkSelectionDeselectionResultEquality(
                    result,
                    [],
                    ['guid2', 'guid4', 'guid5'],
                    ['guid3', 'guid2', 'guid1'],
                    'guid3'
                );
            });
        });
    });

    describe('getAlcNodeData', () => {
        it('does not set the dynamic node component if not present', () => {
            const nodeRenderInfo = {
                metadata: {}
            };

            const { dynamicNodeComponent } = getAlcNodeData(flowModelData, nodeRenderInfo);
            expect(dynamicNodeComponent).not.toBeDefined();
        });

        it('sets the dynamic node component if present', () => {
            const nodeRenderInfo = {
                metadata: {
                    dynamicNodeComponent: 'foo'
                }
            };

            const { dynamicNodeComponent } = getAlcNodeData(flowModelData, nodeRenderInfo);
            expect(dynamicNodeComponent).toEqual(nodeRenderInfo.metadata.dynamicNodeComponent);
        });

        describe('nodeDescription', () => {
            it('sets nodeDescription properly for the start node', () => {
                const nodeRenderInfo = {
                    guid: 'c2238db9-67bc-466b-9a5e-d66d48dcc1a6',
                    metadata: {}
                };
                const expectedAriaDescribedBy = 'AlcNode.ariaRegularFollowedByLabel(d4)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a decision element (d4) has two outcomes and its next is null and has goto on its branching connector', () => {
                const nodeRenderInfo = {
                    guid: 'fda8f30e-7772-4665-a9ff-a7cb12d5646a',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaDecisionPathInfo(o1,loop1), AlcNode.ariaDecisionPathGoToInfo(Default Outcome,s1)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a loop element (loop1) on branch head', () => {
                const nodeRenderInfo = {
                    guid: '60b466f1-6589-4352-8603-51e225b70b36',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOutcomeLabel(o1), AlcNode.ariaForEachPathLabel(s1), AlcNode.ariaAfterLastPathLabel(d1)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for an element (s1) on the branch head of loop', () => {
                const nodeRenderInfo = {
                    guid: 'd8323004-4915-4580-a056-08b7b1f32d18',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOnForEachPathLabel, AlcNode.ariaLoopFollowedByLabel(loop1), AlcNode.ariaMultiGoToConnectorLabel(3)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a decision element (d1) on After Last path and has more than three children', () => {
                const nodeRenderInfo = {
                    guid: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOnPathAfterLastLabel, AlcNode.ariaOutcomeCountLabel(4), AlcNode.ariaGoToPostMergeFollowedByLabel(s1)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a loop element (loop2) on the branch head of a branching connector of a decision', () => {
                const nodeRenderInfo = {
                    guid: '051e3653-5a6e-43b5-9438-33bb3ebae28b',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOutcomeLabel(o1), AlcNode.ariaForEachPathLabel(d3), AlcNode.ariaAfterLastPathLabel(End)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a decision element (d3) on the branch head of a loop and also is the last node on the for each path', () => {
                const nodeRenderInfo = {
                    guid: '1f94a9ce-8029-4a02-9633-05abd127c43f',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOnForEachPathLabel, AlcNode.ariaDecisionPathInfo(o1,AlcNode.ariaEmptyBranchLabel), AlcNode.ariaDecisionPathInfo(Default Outcome,AlcNode.ariaEmptyBranchLabel), AlcNode.ariaLoopPostMergeFollowedByLabel(loop2)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a decision element (d2) on the branch head and has three outcomes and two of them merge into one branch', () => {
                const nodeRenderInfo = {
                    guid: '272558a5-9d21-457d-8209-7bb42f6498e2',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOutcomeLabel(o2), AlcNode.ariaDecisionPathInfo(o1,loop3), AlcNode.ariaDecisionPathInfo(o2,s3), AlcNode.ariaDecisionPathInfo(Default Outcome,AlcNode.ariaEmptyBranchLabel), AlcNode.ariaRegularPostMergeFollowedByLabel(End)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a empty loop element (loop3) on the branch head', () => {
                const nodeRenderInfo = {
                    guid: '29bc4524-3140-4f41-8312-040733d7bb7d',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOutcomeLabel(o1), AlcNode.ariaForEachPathLabel(AlcNode.ariaEmptyBranchLabel), AlcNode.ariaAfterLastPathLabel(updateRecord)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a update records element (updateRecord) with a fault path', () => {
                const nodeRenderInfo = {
                    guid: 'c5c84fb8-e0f1-41bf-a7fd-385e4dea54a8',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOnPathAfterLastLabel, AlcNode.ariaRegularFollowedByLabel(End), AlcNode.ariaFaultPathLabel(s2)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a screen element (s2) on a fault path and has a outgoing goto', () => {
                const nodeRenderInfo = {
                    guid: 'dfde7274-19e2-4257-86cf-c7377f88ba7a',
                    metadata: {}
                };
                const expectedAriaDescribedBy = 'AlcNode.ariaOnFaultPathLabel, AlcNode.ariaGoToFollowedByLabel(s1)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a screen element (s3) on the branch head of a decision', () => {
                const nodeRenderInfo = {
                    guid: '82481b50-0114-43ca-bf17-c70a1bb19260',
                    metadata: {}
                };
                const expectedAriaDescribedBy = 'AlcNode.ariaOutcomeLabel(o2), AlcNode.ariaRegularFollowedByLabel(End)';
                const { nodeDescription } = getAlcNodeData(flowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for the start node that supports scheduled path and has no path with it', () => {
                const nodeRenderInfo = {
                    guid: '80e0340e-67ba-4bb7-bf11-f2696aa8043f',
                    metadata: {}
                };
                const expectedAriaDescribedBy = 'AlcNode.ariaFollowedByPathImmediateLabel(a1)';
                const { nodeDescription } = getAlcNodeData(recordTriggeredFlowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for an assignment element (a1) following the start node which supports scheduled path and has no path with it', () => {
                const nodeRenderInfo = {
                    guid: '1f32d18d8323004-4915-4580-a056-08b7b',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOnPathImmediateLabel, AlcNode.ariaRegularFollowedByLabel(End)';
                const { nodeDescription } = getAlcNodeData(recordTriggeredFlowModelData, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for the start element of a record triggered flow that supports scheduled path', () => {
                const nodeRenderInfo = {
                    guid: '08e1f541-0000-4ab3-83e1-3fb4faea9e02',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaScheduledPathInfo(Run Immediately,l1), AlcNode.ariaScheduledPathInfo(p1,l2), AlcNode.ariaScheduledPathInfo(p2,End), AlcNode.ariaRegularPostMergeFollowedByLabel(a3)';
                const { nodeDescription } = getAlcNodeData(recordTriggerFlowModel2, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a nested decision element (d2) on the For Each path of a loop', () => {
                const nodeRenderInfo = {
                    guid: 'b2267797-7475-4922-a325-c2879c6ba7c3',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOutcomeLabel(o1), AlcNode.ariaDecisionPathInfo(o2,AlcNode.ariaEmptyBranchLabel), AlcNode.ariaDecisionPathInfo(Default Outcome,AlcNode.ariaEmptyBranchLabel), AlcNode.ariaLoopPostMergeFollowedByLabel(l1)';
                const { nodeDescription } = getAlcNodeData(recordTriggerFlowModel2, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a loop element (l2) with a nested loop on its For Each path and has one incoming goto', () => {
                const nodeRenderInfo = {
                    guid: '735111d7-add2-4e2b-9303-3eeb344ac8ab',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOnScheduledPathLabel(p1), AlcNode.ariaForEachPathLabel(l3), AlcNode.ariaAfterLastPathLabel(a3), AlcNode.ariaOneGoToConnectorLabel';
                const { nodeDescription } = getAlcNodeData(recordTriggerFlowModel2, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a nested loop element (l3)', () => {
                const nodeRenderInfo = {
                    guid: '20233c57-8b4e-40cb-801a-3209e2ccfb15',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaOnForEachPathLabel, AlcNode.ariaForEachPathLabel(a1), AlcNode.ariaAfterLastPathLoopLabel(l2)';
                const { nodeDescription } = getAlcNodeData(recordTriggerFlowModel2, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for the last element (a4) on the For Each path of a loop', () => {
                const nodeRenderInfo = {
                    guid: 'd715a7a8-1ff9-4b54-bc33-96d6cb95aeaf',
                    metadata: {}
                };
                const expectedAriaDescribedBy = 'AlcNode.ariaLoopFollowedByLabel(l3)';
                const { nodeDescription } = getAlcNodeData(recordTriggerFlowModel2, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for element (a3) at the merging point and with outgoing goto', () => {
                const nodeRenderInfo = {
                    guid: '0e00c865-9dc5-4b0e-ad67-2b90c3634f23',
                    metadata: {}
                };
                const expectedAriaDescribedBy = 'AlcNode.ariaGoToFollowedByLabel(l2)';
                const { nodeDescription } = getAlcNodeData(recordTriggerFlowModel2, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a pause element (pause1) with three wait events', () => {
                const nodeRenderInfo = {
                    guid: 'e03f0a0a-f5cc-4db3-be81-f922967fae89',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaPausePathInfo(p1,a1), AlcNode.ariaPausePathInfo(p5,AlcNode.ariaEmptyBranchLabel), AlcNode.ariaPausePathInfo(Default Path,pause2), AlcNode.ariaRegularPostMergeFollowedByLabel(End)';
                const { nodeDescription } = getAlcNodeData(scheduleTriggerFlowModel, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a pause element (pause2) with four wait events', () => {
                const nodeRenderInfo = {
                    guid: '038bbd41-06b8-4c21-a728-0491f1d4040d',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaPauseConfigurationLabel(Default Path), AlcNode.ariaPauseConfigurationCountLabel(4), AlcNode.ariaRegularPostMergeFollowedByLabel(End)';
                const { nodeDescription } = getAlcNodeData(scheduleTriggerFlowModel, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a element (a1) on the branch head of a pause', () => {
                const nodeRenderInfo = {
                    guid: '2db7f1ac-47c2-481e-9995-9212baabb475',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaPauseConfigurationLabel(p1), AlcNode.ariaRegularFollowedByLabel(End)';
                const { nodeDescription } = getAlcNodeData(scheduleTriggerFlowModel, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a decision element (d1) with all terminating branches', () => {
                const nodeRenderInfo = {
                    guid: 'fe1ac336-dfab-4978-a60e-ca9f9e5ffa5c',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaDecisionPathInfo(o1,End), AlcNode.ariaDecisionPathInfo(Default Outcome,End)';
                const { nodeDescription } = getAlcNodeData(flowModelWithOneDecision, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a loop element (loop) with goto in it', () => {
                const nodeRenderInfo = {
                    guid: 'd2b55833-ce47-4fb5-bf33-17816885c486',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaForEachPathGoToLabel(s1), AlcNode.ariaAfterLastPathGoToLabel(s1)';
                const { nodeDescription } = getAlcNodeData(flowModelWithGoToInLoop, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });

            it('sets nodeDescription properly for a element (loop) that has goto on its fault path', () => {
                const nodeRenderInfo = {
                    guid: 'b58b6184-7f6e-4f7d-89bc-2e0e6e03912d',
                    metadata: {}
                };
                const expectedAriaDescribedBy =
                    'AlcNode.ariaRegularFollowedByLabel(End), AlcNode.ariaFaultPathGoToLabel(s1)';
                const { nodeDescription } = getAlcNodeData(flowModelWithGoToOnFault, nodeRenderInfo);
                expect(nodeDescription).toEqual(expectedAriaDescribedBy);
            });
        });
    });

    describe('getAlcConnectorData', () => {
        it('ariaDescribedBy for connector between start and d4', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'c2238db9-67bc-466b-9a5e-d66d48dcc1a6'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.straightConnectorDescribedBy(START_ELEMENT,d4)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d4 and loop1 (o1)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'fda8f30e-7772-4665-a9ff-a7cb12d5646a',
                    childIndex: 0
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadConnectorDescribedBy(d4,loop1,o1)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector going from d4 to s1 (Default Outcome)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'fda8f30e-7772-4665-a9ff-a7cb12d5646a',
                    childIndex: 1
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadGoToConnectorDescribedBy(d4,s1,Default Outcome)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between loop1 and d1 (after last)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '60b466f1-6589-4352-8603-51e225b70b36'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadConnectorDescribedBy(loop1,d1,AlcConnector.ariaAfterLastLabel)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between loop1 and s1 (for each)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '60b466f1-6589-4352-8603-51e225b70b36',
                    childIndex: 0
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadConnectorDescribedBy(loop1,s1,AlcConnector.ariaForEachLabel)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between s1 and loop1 at loop close', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'd8323004-4915-4580-a056-08b7b1f32d18'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.loopCloseConnectorDescribedBy(s1,loop1)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d1 and loop2 (o1)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f',
                    childIndex: 0
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadConnectorDescribedBy(d1,loop2,o1)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d1 and d2 (o2)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f',
                    childIndex: 1
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadConnectorDescribedBy(d1,d2,o2)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d1 and s1 (o3)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f',
                    childIndex: 2
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadConnectorDescribedBy(d1,s1,o3)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d1 and s1 (Default Outcome)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f',
                    childIndex: 3
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadConnectorDescribedBy(d1,s1,Default Outcome)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector going from d1 (2 branches) to s1', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.postMergeGoToConnectorDescribedBy(d1,2,s1)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between loop and End (after last)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '051e3653-5a6e-43b5-9438-33bb3ebae28b'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadConnectorDescribedBy(loop2,End,AlcConnector.ariaAfterLastLabel)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between loop2 and d3 (for each)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '051e3653-5a6e-43b5-9438-33bb3ebae28b',
                    childIndex: 0
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadConnectorDescribedBy(loop2,d3,AlcConnector.ariaForEachLabel)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d3 and loop2 (o1) at loop close', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '1f94a9ce-8029-4a02-9633-05abd127c43f',
                    childIndex: 0
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadLoopCloseConnectorDescribedBy(d3,loop2,o1)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d3 and loop2 (Default Outcome) at loop close', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '1f94a9ce-8029-4a02-9633-05abd127c43f',
                    childIndex: 1
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadLoopCloseConnectorDescribedBy(d3,loop2,Default Outcome)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d3 (2 branches) and loop2 at loop close', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '1f94a9ce-8029-4a02-9633-05abd127c43f'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.postMergeLoopCloseConnectorDescribedBy(d3,2,loop2)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d2 and loop3 (o1)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '272558a5-9d21-457d-8209-7bb42f6498e2',
                    childIndex: 0
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadConnectorDescribedBy(d2,loop3,o1)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d2 and s3 (o2)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '272558a5-9d21-457d-8209-7bb42f6498e2',
                    childIndex: 1
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadConnectorDescribedBy(d2,s3,o2)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d2 and End (Default Outcome)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '272558a5-9d21-457d-8209-7bb42f6498e2',
                    childIndex: 2
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadConnectorDescribedBy(d2,End,Default Outcome)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between d2 (2 branches) and End', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '272558a5-9d21-457d-8209-7bb42f6498e2'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.postMergeConnectorDescribedBy(d2,2,End)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between loop3 and updateRecord (after last)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '29bc4524-3140-4f41-8312-040733d7bb7d'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadConnectorDescribedBy(loop3,updateRecord,AlcConnector.ariaAfterLastLabel)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector inside empty loop3 (for each)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '29bc4524-3140-4f41-8312-040733d7bb7d',
                    childIndex: 0
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.emptyForEachDescribedBy(loop3)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between updateRecord and s2 (fault)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'c5c84fb8-e0f1-41bf-a7fd-385e4dea54a8',
                    childIndex: -1
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadConnectorDescribedBy(updateRecord,s2,AlcConnector.ariaFaultLabel)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between updateRecord and End', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'c5c84fb8-e0f1-41bf-a7fd-385e4dea54a8'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.straightConnectorDescribedBy(updateRecord,End)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector going from s2 to s1', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'dfde7274-19e2-4257-86cf-c7377f88ba7a'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.goToConnectorDescribedBy(s2,s1)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between s3 and End', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '82481b50-0114-43ca-bf17-c70a1bb19260'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.straightConnectorDescribedBy(s3,End)';

            const { connectorDescription } = getAlcConnectorData(flowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector going from loop to s1 (for each)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: 'd2b55833-ce47-4fb5-bf33-17816885c486',
                    childIndex: 0
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadGoToConnectorDescribedBy(loop,s1,AlcConnector.ariaForEachLabel)';

            const { connectorDescription } = getAlcConnectorData(flowModelWithGoToInLoop, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for connector between l3 and l2 (after last) at loop close', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '20233c57-8b4e-40cb-801a-3209e2ccfb15'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadLoopCloseConnectorDescribedBy(l3,l2,AlcConnector.ariaAfterLastLabel)';

            const { connectorDescription } = getAlcConnectorData(recordTriggerFlowModel2, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for record-triggered flow connector between START_ELEMENT and End (run immediately)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '80e0340e-67ba-4bb7-bf11-f2696aa8043f'
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadConnectorDescribedBy(START_ELEMENT,a1,AlcConnector.ariaRunImmediatelyLabel)';

            const { connectorDescription } = getAlcConnectorData(recordTriggeredFlowModelData, connectorRenderInfo);
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for record-triggered flow with scheduled paths connector between START_ELEMENT and End (run immediately)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '3e0c5f77-1e47-4926-8ae2-da954908eaa5',
                    childIndex: 0
                },
                geometry: {}
            };
            const expectedAriaDescribedBy =
                'AlcConnector.branchHeadConnectorDescribedBy(START_ELEMENT,End,AlcConnector.ariaRunImmediatelyLabel)';

            const { connectorDescription } = getAlcConnectorData(
                recordTriggeredFlowModelWithScheduledPathsData,
                connectorRenderInfo
            );
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });

        it('ariaDescribedBy for record-triggered flow with scheduled paths connector between START_ELEMENT and End (p1)', () => {
            const connectorRenderInfo = {
                source: {
                    guid: '3e0c5f77-1e47-4926-8ae2-da954908eaa5',
                    childIndex: 1
                },
                geometry: {}
            };
            const expectedAriaDescribedBy = 'AlcConnector.branchHeadConnectorDescribedBy(START_ELEMENT,End,p1)';

            const { connectorDescription } = getAlcConnectorData(
                recordTriggeredFlowModelWithScheduledPathsData,
                connectorRenderInfo
            );
            expect(connectorDescription).toEqual(expectedAriaDescribedBy);
        });
    });

    describe('orchestrator nodeDescription', () => {
        it('sets nodeDescription properly for an orchestratedStage element in error state', () => {
            const nodeRenderInfo = {
                guid: '0cc72cc6-93b1-4e01-807d-35ef745c13b5',
                metadata: {}
            };
            const expectedAriaDescribedBy = 'AlcNode.ariaRegularFollowedByLabel(End), AlcNode.ariaErrorStateLabel';
            const { nodeDescription } = getAlcNodeData(orchestrationFlowModel, nodeRenderInfo);
            expect(nodeDescription).toEqual(expectedAriaDescribedBy);
        });

        it('sets nodeDescription properly for an Stage_Step element in error state', () => {
            const nodeRenderInfo = {
                guid: 'ff638661-52ec-4d23-8aef-c9170d55f171',
                metadata: {}
            };
            const expectedAriaDescribedBy = 'AlcNode.ariaRegularFollowedByLabel(End), AlcNode.ariaErrorStateLabel';
            const { nodeDescription } = getAlcNodeData(orchestrationFlowModel, nodeRenderInfo);
            expect(nodeDescription).toEqual(expectedAriaDescribedBy);
        });
    });
});
