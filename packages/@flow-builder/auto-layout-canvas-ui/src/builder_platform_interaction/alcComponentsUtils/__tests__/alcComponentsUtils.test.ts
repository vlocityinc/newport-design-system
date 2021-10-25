// @ts-nocheck
import { NodeType, MenuType } from 'builder_platform_interaction/autoLayoutCanvas';
import {
    getCanvasElementSelectionData,
    getCanvasElementDeselectionData,
    getFirstSelectableElementGuid,
    getAlcMenuData,
    getMenuStyle,
    getAlcNodeData
} from '../alcComponentsUtils';
import {
    flowModelData,
    recordTriggeredFlowModelData,
    recordTriggerFlowModel2,
    scheduleTriggerFlowModel,
    flowModelWithOneDecision,
    flowModelWithGoToInLoop,
    flowModelWithGoToOnFault
} from './mockData';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const ELEMENT_TYPE_ASSIGNMENT = 'Assignment';
const ELEMENT_TYPE_DECISION = 'Decision';
const ELEMENT_TYPE_SCREEN = 'Screen';
const ELEMENT_TYPE_START_ELEMENT = 'START_ELEMENT';
const ELEMENT_TYPE_WAIT = 'wait';
const ELEMENT_TYPE_END_ELEMENT = 'end';
const ELEMENT_TYPE_LOOP = 'Loop';
const ELEMENT_TYPE_ROOT = 'root';

const elementsMetadata = {
    [ELEMENT_TYPE_ASSIGNMENT]: { type: NodeType.DEFAULT },
    [ELEMENT_TYPE_DECISION]: { type: NodeType.BRANCH },
    [ELEMENT_TYPE_WAIT]: { type: NodeType.BRANCH },
    [ELEMENT_TYPE_SCREEN]: { type: NodeType.DEFAULT },
    [ELEMENT_TYPE_START_ELEMENT]: { type: NodeType.START },
    [ELEMENT_TYPE_END_ELEMENT]: { type: NodeType.END },
    [ELEMENT_TYPE_LOOP]: { type: NodeType.LOOP },
    [ELEMENT_TYPE_ROOT]: { type: NodeType.ROOT }
};
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

function testGetAlcMenuData(toggleMenuDetail, expectedHasEndElement, expectedIsGoToConnector, expectedCanAddGoto) {
    const flowModel = {
        root: {
            guid: 'root',
            elementType: 'root',
            children: ['guid1']
        },
        guid1: {
            parent: 'root',
            childIndex: 0,
            guid: 'guid1',
            elementType: ELEMENT_TYPE_SCREEN,
            config: {
                isSelected: false
            },
            prev: null,
            next: 'branch-guid',
            incomingGoTo: ['branch-guid:o2', 'guid5']
        },
        'branch-guid': {
            guid: 'branch-guid',
            elementType: ELEMENT_TYPE_DECISION,
            config: {
                isSelected: false
            },
            childReferences: [
                {
                    childReference: 'o1'
                },
                {
                    childReference: 'o2'
                },
                {
                    childReference: 'o3'
                }
            ],
            prev: 'guid1',
            next: 'guid3',
            children: ['guid4', 'guid1', 'guid5', null],
            nodeType: 'branch'
        },
        guid3: {
            guid: 'guid3',
            elementType: ELEMENT_TYPE_SCREEN,
            config: {
                isSelected: false
            },
            prev: 'branch-guid',
            next: null
        },
        guid4: {
            guid: 'guid4',
            elementType: ELEMENT_TYPE_END_ELEMENT,
            config: {
                isSelected: false
            },
            parent: 'branch-guid',
            prev: null,
            next: null,
            childIndex: 0,
            isTerminal: true
        },
        guid5: {
            guid: 'guid5',
            elementType: ELEMENT_TYPE_SCREEN,
            config: {
                isSelected: false
            },
            parent: 'branch-guid',
            prev: null,
            next: 'guid1',
            childIndex: 2,
            isTerminal: true
        }
    };

    const menuButtonHalfWidth = 12;
    const containerElementGeometry = {
        x: 0,
        y: 0,
        w: 500,
        h: 500
    };

    const menuData = getAlcMenuData({ detail: toggleMenuDetail }, menuButtonHalfWidth, containerElementGeometry, 1, {
        flowModel,
        elementsMetadata
    });

    expect(menuData.hasEndElement).toEqual(expectedHasEndElement);
    expect(menuData.isGoToConnector).toEqual(expectedIsGoToConnector);
    expect(menuData.canAddGoto).toEqual(expectedCanAddGoto);
}

describe('ALC Canvas Utils test', () => {
    describe('getMenuStyle', () => {
        const detail = {
            left: 0,
            top: 120,
            height: 48,
            offsetX: 0
        };
        const containerElementGeometry = {
            x: 0,
            y: 0
        };

        const menuButtonHalfWidth = 48;
        const scale = 1;
        const needToPosition = false;

        expect(getMenuStyle(detail, containerElementGeometry, menuButtonHalfWidth, scale, needToPosition)).toEqual(
            'left: 48px;top: 144px;width: undefinedpx;height: undefinedpx'
        );
    });

    describe('getAlcMenuData', () => {
        it('hasEndElement is true and isGoToConnector is false on branch when next element is not end node', () => {
            testGetAlcMenuData(
                {
                    top: 0,
                    left: 0,
                    elementMetadata: { type: NodeType.DEFAULT },
                    source: { guid: 'branch-guid', childIndex: 3 }
                },
                true,
                false,
                true
            );
        });

        it('hasEndElement is false and isGoToConnector is false on branch when next element is end node', () => {
            testGetAlcMenuData(
                {
                    top: 0,
                    left: 0,
                    elementMetadata: { type: NodeType.DEFAULT },
                    source: { guid: 'branch-guid', childIndex: 0 }
                },
                false,
                false,
                true
            );
        });

        it('hasEndElement is false and isGoToConnector is true on branch that has a GoTo connection at branch head', () => {
            testGetAlcMenuData(
                {
                    top: 0,
                    left: 0,
                    source: { guid: 'branch-guid', childIndex: 1 },
                    type: MenuType.CONNECTOR
                },
                false,
                true,
                false
            );
        });

        it('hasEndElement is false and isGoToConnector is true when there is a GoTo connection to the next element', () => {
            testGetAlcMenuData(
                {
                    guid: 'guid5',
                    top: 0,
                    left: 0,
                    source: { guid: 'guid5' },
                    type: MenuType.CONNECTOR
                },
                false,
                true,
                false
            );
        });
    });

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

    describe('getFirstSelectableElementGuid', () => {
        let flowModel = {};

        beforeEach(() => {
            flowModel = {
                start: {
                    guid: 'start',
                    elementType: ELEMENT_TYPE_START_ELEMENT,
                    nodeType: NodeType.START,
                    config: {
                        isSelectable: true
                    },
                    next: 'd1'
                },
                d1: {
                    guid: 'd1',
                    elementType: ELEMENT_TYPE_DECISION,
                    nodeType: NodeType.BRANCH,
                    config: {
                        isSelectable: false
                    },
                    prev: 'start',
                    next: 's4',
                    children: ['d2', 's3', 'ac1'],
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                d2: {
                    guid: 'd2',
                    elementType: ELEMENT_TYPE_DECISION,
                    nodeType: NodeType.BRANCH,
                    config: {
                        isSelectable: false
                    },
                    parent: 'd1',
                    prev: null,
                    next: null,
                    childIndex: 0,
                    isTerminal: false,
                    children: [null, 's1'],
                    childReferences: [
                        {
                            childReference: 'o3'
                        }
                    ]
                },
                s1: {
                    guid: 's1',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelectable: false
                    },
                    parent: 'd1',
                    prev: null,
                    next: 's2',
                    childIndex: 1,
                    isTerminal: false
                },
                s2: {
                    guid: 's2',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelectable: false
                    },
                    prev: 's1',
                    next: null
                },
                ac1: {
                    guid: 'ac1',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelectable: false
                    },
                    parent: 'd1',
                    prev: null,
                    next: null,
                    childIndex: 2,
                    isTerminal: false,
                    fault: 's3'
                },
                s3: {
                    guid: 's3',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelectable: false
                    },
                    parent: 'ac1',
                    prev: null,
                    next: 's5',
                    childIndex: -1,
                    isTerminal: true,
                    incomingGoTo: ['d1:o2']
                },
                s4: {
                    guid: 's4',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelectable: false
                    },
                    prev: 'd1',
                    next: 's5'
                },
                s5: {
                    guid: 's5',
                    elementType: ELEMENT_TYPE_SCREEN,
                    nodeType: NodeType.DEFAULT,
                    config: {
                        isSelectable: false
                    },
                    prev: 's4',
                    next: 'end',
                    incomingGoTo: ['s3']
                },
                end: {
                    guid: 'end',
                    elementType: ELEMENT_TYPE_END_ELEMENT,
                    nodeType: NodeType.END,
                    config: {
                        isSelectable: false
                    },
                    prev: 'd1',
                    next: null
                }
            };
        });

        const setIsSelectableToTrue = (elementGuidToUpdate) => {
            flowModel[elementGuidToUpdate].config.isSelectable = true;
        };

        it('When no element is selectable', () => {
            const selectableGuid = getFirstSelectableElementGuid(flowModel, 'd1');
            expect(selectableGuid).toBeUndefined();
        });

        it('When a nested element is the first selectable element', () => {
            setIsSelectableToTrue('s2');
            const selectableGuid = getFirstSelectableElementGuid(flowModel, 'd1');
            expect(selectableGuid).toEqual('s2');
        });

        it('When first selectable element is in the fault branch', () => {
            setIsSelectableToTrue('s3');
            const selectableGuid = getFirstSelectableElementGuid(flowModel, 'd1');
            expect(selectableGuid).toEqual('s3');
        });

        it('When first selectable element is after before another selectable element which is a GoTo target', () => {
            setIsSelectableToTrue('s4');
            setIsSelectableToTrue('s5');
            const selectableGuid = getFirstSelectableElementGuid(flowModel, 'd1');
            expect(selectableGuid).toEqual('s4');
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

            it('sets nodeDescription properly for an assinment element (a1) following the start node which supports scheduled path and has no path with it', () => {
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
                    'AlcNode.ariaOnScheduledPathLabel(p1), AlcNode.ariaForEachPathLabel(l3), AlcNode.ariaAfterLastPathLabel(a3), AlcNode.airaOneGoToConnectorLabel';
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
});
