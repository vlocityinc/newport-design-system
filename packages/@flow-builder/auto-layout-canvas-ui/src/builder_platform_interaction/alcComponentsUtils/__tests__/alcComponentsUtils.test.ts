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

            const { dynamicNodeComponent } = getAlcNodeData(nodeRenderInfo);
            expect(dynamicNodeComponent).not.toBeDefined();
        });

        it('sets the dynamic node component if present', () => {
            const nodeRenderInfo = {
                metadata: {
                    dynamicNodeComponent: 'foo'
                }
            };

            const { dynamicNodeComponent } = getAlcNodeData(nodeRenderInfo);
            expect(dynamicNodeComponent).toEqual(nodeRenderInfo.metadata.dynamicNodeComponent);
        });
    });
});
