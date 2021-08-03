import {
    createFlow,
    flowModelFromElements,
    getFlowWithNonTerminalImmediateBranch,
    getFlowWithTerminalImmediateBranch,
    getFlowWithBranchNodeInImmediateBranch,
    BRANCH_ELEMENT,
    SCREEN_ELEMENT,
    BRANCH_ELEMENT_GUID,
    SCREEN_ELEMENT_GUID,
    LOOP_ELEMENT_GUID,
    START_ELEMENT_GUID,
    END_ELEMENT_GUID,
    END_ELEMENT,
    getFlowWhenGoingToPreviousElement,
    getFlowWhenGoingFromParentFirstBranchToPreviousElement,
    getFlowWhenGoingFromParentFaultBranchToPreviousElement,
    getFlowWhenGoingFromParentDefaultBranchToPreviousElement,
    getFlowWithGoToOnTheMergePoint,
    getFlowWhenGoingFromMergePointToParent,
    getFlowWhenGoingFromSiblingBranch,
    getFlowWhenGoingFromImmediateToScheduledPathBranch,
    getFlowWhenGoingFromScheduledPathToImmediateBranch,
    getFlowWithGoToOnImmediateBranchHead,
    getFlowWithGoToFromAncestorToNestedElement,
    getFlowWhenGoingToLoopBranchHead,
    getFlowWithGoToOnFirstMergeableNonNullNext,
    getFlowWhenGoingFromForEachBranch
} from './testUtils';

import {
    inlineFromParent,
    initFlowModel,
    linkElement,
    linkBranchOrFault,
    findFirstElement,
    findLastElement,
    deleteElement,
    deleteFault,
    deleteBranch,
    getTargetGuidsForReconnection,
    connectToElement,
    addElement,
    updateChildren,
    addFault,
    hasGoToOnNext,
    hasGoToOnBranchHead,
    createGoToConnection,
    deleteGoToConnection,
    decorateElements,
    clearCanvasDecoration,
    updateChildrenOnAddingOrUpdatingScheduledPaths,
    areAllBranchesTerminals,
    getBranchIndexForGoToConnection,
    cleanUpIncomingGoTos,
    removeGoTosFromElement,
    shouldDeleteGoToOnNext,
    getSuffixForGoToConnection,
    prepareFlowModel
} from '../modelUtils';

import { GOTO_CONNECTION_SUFFIX, FAULT_INDEX, START_IMMEDIATE_INDEX, FOR_EACH_INDEX } from '../model';
import NodeType from '../NodeType';

/**
 * @param elements
 */
function generateEndElementGuid(elements) {
    let guid = 'end-hook-guid';
    while (elements[guid]) {
        guid = `${guid}_0`;
    }
    return guid;
}

const elementService = (elements) => {
    return {
        elements,

        createEndElement({ guid } = { guid: generateEndElementGuid(elements) }) {
            const element = {
                guid,
                nodeType: NodeType.END
            };
            this.elements[guid] = element;
            return guid;
        },

        deleteElement(guid) {
            delete this.elements[guid];
        }
    };
};

const defaultDeleteOptions = {
    childIndexToKeep: 0,
    inline: true
};

/**
 * @param elements
 * @param guid
 */
function createEndElement(elements, guid) {
    const config = elementService(elements);
    config.createEndElement({ guid });
}

describe('modelUtils', () => {
    describe('getSuffixForGoToConnection', () => {
        const elements = createFlow([BRANCH_ELEMENT_GUID]);

        const branchElement = elements[BRANCH_ELEMENT_GUID];
        branchElement.childReferences = [
            {
                childReference: 'o1'
            }
        ];
        it('is null when no childIndex is in the connection source', () => {
            expect(getSuffixForGoToConnection(elements, { guid: BRANCH_ELEMENT_GUID })).toBeNull();
        });

        it('is fault when childIndex is a fault', () => {
            expect(getSuffixForGoToConnection(elements, { guid: BRANCH_ELEMENT_GUID, childIndex: FAULT_INDEX })).toBe(
                GOTO_CONNECTION_SUFFIX.FAULT
            );
        });

        it('is default when childIndex is the last branch', () => {
            expect(getSuffixForGoToConnection(elements, { guid: BRANCH_ELEMENT_GUID, childIndex: 1 })).toBe(
                GOTO_CONNECTION_SUFFIX.DEFAULT
            );
        });

        it('is immediate when childIndex is START_IMMEDIATE_INDEX and nodeType is Start', () => {
            const flowWithBranchingStart = getFlowWithTerminalImmediateBranch();
            expect(
                getSuffixForGoToConnection(flowWithBranchingStart, {
                    guid: 'start-guid',
                    childIndex: START_IMMEDIATE_INDEX
                })
            ).toBe(GOTO_CONNECTION_SUFFIX.IMMEDIATE);
        });

        it('is forEach when childIndex is FOR_EACH_INDEX and nodeType is Loop', () => {
            const flowRenderContext = getFlowWhenGoingToLoopBranchHead();
            expect(
                getSuffixForGoToConnection(flowRenderContext.flowModel, {
                    guid: LOOP_ELEMENT_GUID,
                    childIndex: FOR_EACH_INDEX
                })
            ).toBe(GOTO_CONNECTION_SUFFIX.FOR_EACH);
        });

        it('is the childReference when childIndex is not the last branch', () => {
            expect(getSuffixForGoToConnection(elements, { guid: BRANCH_ELEMENT_GUID, childIndex: 0 })).toBe('o1');
        });
    });

    describe('initFlowModel', () => {
        it('creates a root and links start and end', () => {
            const elements = {
                'start-guid': {
                    guid: 'start-guid'
                },
                'end-guid': {
                    guid: 'end-guid'
                }
            };
            initFlowModel(elements, 'start-guid', 'end-guid');
            expect(elements).toMatchSnapshot();
        });
    });

    describe('addElement', () => {
        it('add end node to left branch of decision with empty branches', () => {
            const elements = createFlow([BRANCH_ELEMENT_GUID]);

            const endGuid = 'new-end-element-guid';
            createEndElement(elements, endGuid);

            addElement(elements, endGuid, NodeType.END, {
                guid: 'branch-guid',
                childIndex: 0
            });
            expect(elements).toMatchSnapshot();
        });

        it('add end node to left branch of decision with with non-empty right branch', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [null, ['head-guid']];
            const elements = createFlow([branchingElement]);

            const endGuid = 'new-end-element-guid';
            createEndElement(elements, endGuid);

            addElement(elements, endGuid, NodeType.END, {
                guid: 'branch-guid',
                childIndex: 0
            });
            expect(elements).toMatchSnapshot();
        });

        it('add end node to left branch of decision with with non-empty left branch', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [['head-guid'], null];
            const elements = createFlow([branchingElement]);

            const endGuid = 'new-end-element-guid';
            createEndElement(elements, endGuid);

            addElement(elements, 'new-end-element-guid', NodeType.END, {
                guid: 'branch-guid:0-head-guid'
            });
            expect(elements).toMatchSnapshot();
        });

        it('add end complex 1', () => {
            const nestedBranchingElement = { ...BRANCH_ELEMENT };
            nestedBranchingElement.children = [[END_ELEMENT_GUID], null];

            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[nestedBranchingElement], null];

            const elements = createFlow([branchingElement]);

            const endGuid = 'new-end-element-guid';
            createEndElement(elements, endGuid);

            addElement(elements, 'new-end-element-guid', NodeType.END, {
                guid: 'branch-guid',
                childIndex: 1
            });
            expect(elements).toMatchSnapshot();
        });

        it('add end complex 2', () => {
            const nestedBranchingElement = { ...BRANCH_ELEMENT };
            nestedBranchingElement.children = [[END_ELEMENT_GUID], null];

            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[nestedBranchingElement], null];

            const elements = createFlow([branchingElement]);

            const endGuid = 'new-end-element-guid';
            createEndElement(elements, endGuid);

            addElement(elements, 'new-end-element-guid', NodeType.END, {
                guid: 'branch-guid:0-branch-guid',
                childIndex: 1
            });
            expect(elements).toMatchSnapshot();
        });

        it('add an element between the source element and the outgoing goTo connection', () => {
            const flowRenderContext = getFlowWhenGoingToPreviousElement();
            const newScreen = {
                guid: 'new-screen-guid',
                elementType: 'SCREEN_ELEMENT',
                label: 'default',
                nodeType: NodeType.DEFAULT,
                config: {}
            };
            const { flowModel } = flowRenderContext;
            flowModel['new-screen-guid'] = newScreen;
            addElement(flowModel, 'new-screen-guid', NodeType.DEFAULT, {
                guid: 'goto-source-guid'
            });
            expect(flowModel).toMatchSnapshot();
        });

        it('add an element between the parent element and the branchHead goTo connector', () => {
            const flowRenderContext = getFlowWhenGoingFromParentFirstBranchToPreviousElement();
            const newScreen = {
                guid: 'new-screen-guid',
                elementType: 'SCREEN_ELEMENT',
                label: 'default',
                nodeType: NodeType.DEFAULT,
                config: {}
            };
            const { flowModel } = flowRenderContext;
            flowModel['new-screen-guid'] = newScreen;
            addElement(flowModel, 'new-screen-guid', NodeType.DEFAULT, {
                guid: 'branch-guid',
                childIndex: 0
            });
            expect(flowModel).toMatchSnapshot();
        });

        it('add an element between the parent element and the branchHead goTo connector on the Fault branch', () => {
            const flowRenderContext = getFlowWhenGoingFromParentFaultBranchToPreviousElement();
            const newScreen = {
                guid: 'new-screen-guid',
                elementType: 'SCREEN_ELEMENT',
                label: 'default',
                nodeType: NodeType.DEFAULT,
                config: {}
            };
            const { flowModel } = flowRenderContext;
            flowModel['new-screen-guid'] = newScreen;
            addElement(flowModel, 'new-screen-guid', NodeType.DEFAULT, {
                guid: 'branch-guid',
                childIndex: FAULT_INDEX
            });
            expect(flowModel).toMatchSnapshot();
        });
    });

    describe('getTargetGuidsForReconnection', () => {
        describe('branch ended or goto', () => {
            it('No branches are merged and undefined parent parameter', () => {
                const branchingElement = { ...BRANCH_ELEMENT };
                branchingElement.children = [
                    ['head-guid', 'random-guid', 'random-guid2', END_ELEMENT_GUID],
                    ['head-guid', 'random-guid', END_ELEMENT_GUID]
                ];

                const elements = createFlow([START_ELEMENT_GUID, branchingElement], false);
                expect(
                    getTargetGuidsForReconnection(
                        elements,
                        'branch-guid:0-random-guid2',
                        undefined,
                        'branch-guid:0-end-guid',
                        true,
                        undefined
                    )
                ).toEqual({
                    firstMergeableNonNullNext: null,
                    goToableGuids: ['branch-guid:0-head-guid', 'branch-guid:0-random-guid', 'branch-guid'],
                    mergeableGuids: ['branch-guid:1-head-guid', 'branch-guid:1-random-guid', 'branch-guid:1-end-guid']
                });
            });

            it('Immediately ended branch with parent.next == null', () => {
                const branchingElement = { ...BRANCH_ELEMENT };
                branchingElement.children = [[END_ELEMENT_GUID], ['head-guid', 'random-guid', END_ELEMENT_GUID]];

                const elements = createFlow([START_ELEMENT_GUID, branchingElement], false);
                expect(
                    getTargetGuidsForReconnection(elements, undefined, 'branch-guid', 'branch-guid:0-end-guid', true, 0)
                ).toEqual({
                    firstMergeableNonNullNext: null,
                    goToableGuids: [],
                    mergeableGuids: ['branch-guid:1-head-guid', 'branch-guid:1-random-guid', 'branch-guid:1-end-guid']
                });
            });

            it('Selected from a decisions merge point with one branch empty', () => {
                const elements = {
                    'branch-guid': {
                        guid: 'branch-guid',
                        prev: 'start-guid',
                        label: 'branch-guid',
                        elementType: 'branch',
                        next: 'end-guid',
                        nodeType: 'branch',
                        children: ['branch-guid:0-head1-guid', null]
                    },
                    'branch-guid:0-head1-guid': {
                        guid: 'branch-guid:0-head1-guid',
                        isCanvasElement: true,
                        parent: 'branch-guid',
                        childIndex: 0
                    },
                    'end-guid': {
                        guid: 'end-guid',
                        label: 'end-guid',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        prev: 'branch-guid'
                    },
                    root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                    'start-guid': {
                        childIndex: 0,
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'branch-guid',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(
                    getTargetGuidsForReconnection(elements, 'branch-guid', undefined, 'end-guid', false, undefined)
                ).toEqual({
                    firstMergeableNonNullNext: null,
                    goToableGuids: [],
                    mergeableGuids: []
                });
            });

            it('Selected from a decisions merge point with both branches only having 1 element', () => {
                const elements = {
                    'branch-guid': {
                        guid: 'branch-guid',
                        prev: 'start-guid',
                        label: 'branch-guid',
                        elementType: 'branch',
                        next: 'end-guid',
                        nodeType: 'branch',
                        children: ['branch-guid:0-head1-guid', 'branch-guid:1-head1-guid']
                    },
                    'branch-guid:0-head1-guid': {
                        guid: 'branch-guid:0-head1-guid',
                        isCanvasElement: true,
                        parent: 'branch-guid',
                        childIndex: 0
                    },
                    'branch-guid:1-head1-guid': {
                        guid: 'branch-guid:1-head1-guid',
                        isCanvasElement: true,
                        parent: 'branch-guid',
                        childIndex: 1
                    },
                    'end-guid': {
                        guid: 'end-guid',
                        label: 'end-guid',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        prev: 'branch-guid'
                    },
                    root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                    'start-guid': {
                        childIndex: 0,
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'branch-guid',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(
                    getTargetGuidsForReconnection(elements, 'branch-guid', undefined, 'end-guid', false, undefined)
                ).toEqual({
                    firstMergeableNonNullNext: null,
                    goToableGuids: ['branch-guid'],
                    mergeableGuids: []
                });
            });

            it('Selected from a nested decision to the first firstMergeableNonNullNext that is a goto further up in the flow', () => {
                const elements = {
                    screen1: {
                        guid: 'screen1',
                        isCanvasElement: true,
                        prev: 'start-guid',
                        next: 'branch-guid',
                        incomingGoTo: ['branch-guid']
                    },
                    'branch-guid': {
                        guid: 'branch-guid',
                        isCanvasElement: true,
                        prev: 'screen1',
                        label: 'branch-guid',
                        elementType: 'branch',
                        next: 'screen1',
                        nodeType: 'branch',
                        children: ['branch-guid:0-head1-guid', null, null]
                    },
                    'branch-guid:0-head1-guid': {
                        guid: 'branch-guid:0-head1-guid',
                        isCanvasElement: true,
                        parent: 'branch-guid',
                        elementType: 'branch',
                        nodeType: 'branch',
                        childIndex: 0,
                        children: ['head1-end1-guid', 'head1-end2-guid'],
                        isTerminal: true
                    },
                    'head1-end1-guid': {
                        childIndex: 0,
                        guid: 'head1-end1-guid',
                        label: 'head1-end1-guid',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        parent: 'branch-guid:0-head1-guid',
                        isTerminal: true
                    },
                    'head1-end2-guid': {
                        childIndex: 1,
                        guid: 'head1-end2-guid',
                        label: 'head1-end2-guid',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        parent: 'branch-guid:0-head1-guid',
                        isTerminal: true
                    },
                    root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                    'start-guid': {
                        childIndex: 0,
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen1',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(
                    getTargetGuidsForReconnection(
                        elements,
                        undefined,
                        'branch-guid:0-head1-guid',
                        'head1-end1-guid',
                        true,
                        0
                    )
                ).toEqual({
                    firstMergeableNonNullNext: 'screen1',
                    goToableGuids: ['branch-guid'],
                    mergeableGuids: ['head1-end2-guid']
                });
            });

            it('Only the start element is present', () => {
                const elements = {
                    root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                    'start-guid': {
                        childIndex: 0,
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        nodeType: 'start',
                        parent: 'root',
                        next: 'end-guid'
                    },
                    'end-guid': {
                        guid: 'end-guid',
                        label: 'end-guid',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        prev: 'start-guid'
                    }
                };
                expect(
                    getTargetGuidsForReconnection(elements, 'start-guid', undefined, 'end-guid', false, undefined)
                ).toEqual({
                    firstMergeableNonNullNext: null,
                    goToableGuids: [],
                    mergeableGuids: []
                });
            });

            it('Only one element is connected to the start element', () => {
                const elements = {
                    root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                    'start-guid': {
                        childIndex: 0,
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        nodeType: 'start',
                        parent: 'root',
                        next: 'random-guid'
                    },
                    'end-guid': {
                        guid: 'end-guid',
                        label: 'end-guid',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        prev: 'random-guid'
                    },
                    'random-guid': { guid: 'random-guid', isCanvasElement: true, prev: 'start-guid', next: 'end-guid' }
                };
                expect(
                    getTargetGuidsForReconnection(elements, 'random-guid', undefined, 'end-guid', false, undefined)
                ).toEqual({
                    firstMergeableNonNullNext: null,
                    goToableGuids: [],
                    mergeableGuids: []
                });
            });

            it('Selected from a decisions merge point with nested decisions', () => {
                const elements = {
                    'branch-guid': {
                        guid: 'branch-guid',
                        prev: 'start-guid',
                        label: 'branch-guid',
                        elementType: 'branch',
                        next: 'end-guid',
                        nodeType: 'branch',
                        children: ['branch-guid:0-head1-guid', 'branch-guid2']
                    },
                    'branch-guid:0-head1-guid': {
                        guid: 'branch-guid:0-head1-guid',
                        isCanvasElement: true,
                        parent: 'branch-guid',
                        childIndex: 0,
                        isTerminal: false
                    },
                    'branch-guid2': {
                        guid: 'branch-guid2',
                        isTerminal: false,
                        label: 'branch-guid2',
                        elementType: 'branch',
                        nodeType: 'branch',
                        isCanvasElement: true,
                        parent: 'branch-guid',
                        childIndex: 1,
                        children: ['branch-guid:0-nested1-guid', 'branch-guid3']
                    },
                    'branch-guid:0-nested1-guid': {
                        guid: 'branch-guid:0-nested1-guid',
                        isTerminal: false,
                        isCanvasElement: true,
                        parent: 'branch-guid2',
                        childIndex: 0
                    },
                    'branch-guid3': {
                        guid: 'branch-guid3',
                        isTerminal: false,
                        label: 'branch-gui3',
                        elementType: 'branch',
                        nodeType: 'branch',
                        isCanvasElement: true,
                        parent: 'branch-guid2',
                        childIndex: 1,
                        children: [null, null]
                    },
                    'end-guid': {
                        guid: 'end-guid',
                        label: 'end-guid',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        prev: 'branch-guid'
                    },
                    root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                    'start-guid': {
                        childIndex: 0,
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'branch-guid',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(
                    getTargetGuidsForReconnection(elements, 'branch-guid', undefined, 'end-guid', false, undefined)
                ).toEqual({
                    firstMergeableNonNullNext: null,
                    goToableGuids: ['branch-guid', 'branch-guid2'],
                    mergeableGuids: []
                });
            });

            it('Selected from a nested decision when GoTos are present', () => {
                const flowModel = {
                    root: {
                        guid: 'root',
                        nodeType: NodeType.ROOT,
                        children: ['startGuid']
                    },
                    startGuid: {
                        guid: 'startGuid',
                        nodeType: NodeType.START,
                        parent: 'root',
                        childIndex: 0,
                        isTerminal: true,
                        next: 'screen1',
                        isCanvasElement: true
                    },
                    screen1: {
                        guid: 'screen1',
                        nodeType: NodeType.DEFAULT,
                        prev: 'startGuid',
                        next: 'decision1',
                        incomingGoTo: ['decision1:o3'],
                        isCanvasElement: true
                    },
                    decision1: {
                        guid: 'decision1',
                        nodeType: NodeType.BRANCH,
                        prev: 'screen1',
                        next: 'end',
                        children: ['decision2', null, 'screen1', 'screen2'],
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
                        isCanvasElement: true
                    },
                    decision2: {
                        guid: 'decision2',
                        nodeType: NodeType.BRANCH,
                        parent: 'decision1',
                        childIndex: 0,
                        children: ['end1', 'screen3'],
                        isTerminal: true,
                        incomingGoTo: ['screen3'],
                        isCanvasElement: true
                    },
                    end1: {
                        guid: 'end1',
                        nodeType: NodeType.END,
                        parent: 'decision2',
                        childIndex: 0,
                        isTerminal: true,
                        isCanvasElement: true
                    },
                    screen3: {
                        guid: 'screen3',
                        nodeType: NodeType.DEFAULT,
                        parent: 'decision2',
                        childIndex: 1,
                        isTerminal: true,
                        next: 'decision2',
                        isCanvasElement: true
                    },
                    screen2: {
                        guid: 'screen2',
                        nodeType: NodeType.DEFAULT,
                        parent: 'decision1',
                        childIndex: 3,
                        isCanvasElement: true
                    },
                    end: {
                        guid: 'end',
                        nodeType: NodeType.END,
                        prev: 'decision1',
                        isCanvasElement: true
                    }
                };

                expect(getTargetGuidsForReconnection(flowModel, undefined, 'decision2', 'end1', true, 0)).toEqual({
                    firstMergeableNonNullNext: 'end',
                    goToableGuids: ['screen1', 'decision1', 'screen2'],
                    mergeableGuids: ['screen3']
                });
            });

            it('nested merge with single merge branch', () => {
                const elements = {
                    'branch-guid': {
                        guid: 'branch-guid',
                        prev: 'start-guid',
                        label: 'branch-guid',
                        elementType: 'branch',
                        next: 'end-guid',
                        nodeType: 'branch',
                        children: ['branch-guid2', null],
                        isCanvasElement: true
                    },
                    'branch-guid2': {
                        guid: 'branch-guid2',
                        isTerminal: false,
                        label: 'branch-guid2',
                        elementType: 'branch',
                        nodeType: 'branch',
                        isCanvasElement: true,
                        parent: 'branch-guid',
                        childIndex: 0,
                        children: ['end-guid2', 'random-guid']
                    },
                    'random-guid': {
                        guid: 'random-guid',
                        isTerminal: false,
                        isCanvasElement: true,
                        parent: 'branch-guid2',
                        childIndex: 1
                    },
                    'end-guid2': {
                        guid: 'end-guid2',
                        label: 'end-guid2',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        parent: 'branch-guid2',
                        isTerminal: true,
                        childIndex: 0
                    },
                    'end-guid': {
                        guid: 'end-guid',
                        label: 'end-guid',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        prev: 'branch-guid'
                    },
                    root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                    'start-guid': {
                        childIndex: 0,
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'branch-guid',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(
                    getTargetGuidsForReconnection(elements, undefined, 'branch-guid2', 'end-guid2', true, 0)
                ).toEqual({
                    firstMergeableNonNullNext: 'end-guid',
                    goToableGuids: ['branch-guid'],
                    mergeableGuids: ['random-guid']
                });
            });

            describe('GoTos from within a Loop', () => {
                it('Adding GoTo on a Loop Branch Head', () => {
                    const elements = {
                        root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                        'start-guid': {
                            childIndex: 0,
                            elementType: 'start',
                            guid: 'start-guid',
                            isCanvasElement: true,
                            isTerminal: true,
                            label: 'start-guid',
                            next: 'branch-guid',
                            nodeType: 'start',
                            parent: 'root'
                        },
                        'loop-guid': {
                            guid: 'loop-guid',
                            prev: 'start-guid',
                            label: 'loop-guid',
                            elementType: 'Loop',
                            next: 'screen-guid',
                            nodeType: 'loop',
                            children: ['end-guid'],
                            isCanvasElement: true
                        },
                        'end-guid': {
                            guid: 'end-guid',
                            label: 'end-guid',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            parent: 'loop-guid',
                            childIndex: FOR_EACH_INDEX,
                            prev: null,
                            next: null,
                            isTerminal: true
                        },
                        'screen-guid': {
                            guid: 'screen-guid',
                            label: 'screen-guid',
                            elementType: 'Screen',
                            nodeType: 'default',
                            isCanvasElement: true,
                            prev: 'loop-guid',
                            next: 'end-guid2'
                        },
                        'end-guid2': {
                            guid: 'end-guid2',
                            label: 'end-guid2',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: 'screen-guid',
                            next: null
                        }
                    };
                    expect(
                        getTargetGuidsForReconnection(
                            elements,
                            undefined,
                            'loop-guid',
                            'end-guid',
                            true,
                            FOR_EACH_INDEX
                        )
                    ).toEqual({
                        firstMergeableNonNullNext: 'loop-guid',
                        goToableGuids: ['screen-guid'],
                        mergeableGuids: []
                    });
                });

                it('Adding GoTo from within a branch of a fully terminated branching element inside a Loop', () => {
                    const elements = {
                        root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                        'start-guid': {
                            childIndex: 0,
                            elementType: 'start',
                            guid: 'start-guid',
                            isCanvasElement: true,
                            isTerminal: true,
                            label: 'start-guid',
                            next: 'branch-guid',
                            nodeType: 'start',
                            parent: 'root'
                        },
                        'loop-guid': {
                            guid: 'loop-guid',
                            prev: 'start-guid',
                            label: 'loop-guid',
                            elementType: 'Loop',
                            next: 'screen-guid',
                            nodeType: 'loop',
                            children: ['decision-guid'],
                            isCanvasElement: true
                        },
                        'decision-guid': {
                            guid: 'decision-guid',
                            label: 'decision-guid',
                            elementType: 'Decision',
                            nodeType: 'branch',
                            isCanvasElement: true,
                            parent: 'loop-guid',
                            childIndex: FOR_EACH_INDEX,
                            prev: null,
                            next: null,
                            isTerminal: true,
                            childReferences: [
                                {
                                    childReference: 'o1'
                                },
                                {
                                    childReference: 'o2'
                                }
                            ],
                            children: ['left-end-guid', 'middle-end-guid', 'right-end-guid']
                        },
                        'left-end-guid': {
                            guid: 'left-end-guid',
                            label: 'left-end-guid',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: null,
                            next: null,
                            parent: 'decision-guid',
                            childIndex: 0,
                            isTerminal: true
                        },
                        'middle-end-guid': {
                            guid: 'middle-end-guid',
                            label: 'middle-end-guid',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: null,
                            next: null,
                            parent: 'decision-guid',
                            childIndex: 1,
                            isTerminal: true
                        },
                        'right-end-guid': {
                            guid: 'right-end-guid',
                            label: 'right-end-guid',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: null,
                            next: null,
                            parent: 'decision-guid',
                            childIndex: 2,
                            isTerminal: true
                        },
                        'screen-guid': {
                            guid: 'screen-guid',
                            label: 'screen-guid',
                            elementType: 'Screen',
                            nodeType: 'default',
                            isCanvasElement: true,
                            prev: 'loop-guid',
                            next: 'end-guid2'
                        },
                        'end-guid2': {
                            guid: 'end-guid2',
                            label: 'end-guid2',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: 'screen-guid',
                            next: null
                        }
                    };

                    expect(
                        getTargetGuidsForReconnection(elements, undefined, 'decision-guid', 'left-end-guid', true, 0)
                    ).toEqual({
                        firstMergeableNonNullNext: 'loop-guid',
                        goToableGuids: ['screen-guid'],
                        mergeableGuids: ['middle-end-guid', 'right-end-guid']
                    });
                });

                it('Adding GoTo from within a branch of a partially terminated branching element inside a Loop', () => {
                    const elements = {
                        root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                        'start-guid': {
                            childIndex: 0,
                            elementType: 'start',
                            guid: 'start-guid',
                            isCanvasElement: true,
                            isTerminal: true,
                            label: 'start-guid',
                            next: 'branch-guid',
                            nodeType: 'start',
                            parent: 'root'
                        },
                        'loop-guid': {
                            guid: 'loop-guid',
                            prev: 'start-guid',
                            label: 'loop-guid',
                            elementType: 'Loop',
                            next: 'screen-guid',
                            nodeType: 'loop',
                            children: ['decision-guid'],
                            isCanvasElement: true
                        },
                        'decision-guid': {
                            guid: 'decision-guid',
                            label: 'decision-guid',
                            elementType: 'Decision',
                            nodeType: 'branch',
                            isCanvasElement: true,
                            parent: 'loop-guid',
                            childIndex: FOR_EACH_INDEX,
                            prev: null,
                            next: 'end-guid',
                            isTerminal: true,
                            childReferences: [
                                {
                                    childReference: 'o1'
                                },
                                {
                                    childReference: 'o2'
                                }
                            ],
                            children: ['left-end-guid', null, null]
                        },
                        'left-end-guid': {
                            guid: 'left-end-guid',
                            label: 'left-end-guid',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: null,
                            next: null,
                            parent: 'decision-guid',
                            childIndex: 0,
                            isTerminal: true
                        },
                        'end-guid': {
                            guid: 'end-guid',
                            label: 'end-guid',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: 'decision-guid',
                            next: null
                        },
                        'screen-guid': {
                            guid: 'screen-guid',
                            label: 'screen-guid',
                            elementType: 'Screen',
                            nodeType: 'default',
                            isCanvasElement: true,
                            prev: 'loop-guid',
                            next: 'end-guid2'
                        },
                        'end-guid2': {
                            guid: 'end-guid2',
                            label: 'end-guid2',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: 'screen-guid',
                            next: null
                        }
                    };

                    expect(
                        getTargetGuidsForReconnection(elements, undefined, 'decision-guid', 'left-end-guid', true, 0)
                    ).toEqual({
                        firstMergeableNonNullNext: 'end-guid',
                        goToableGuids: ['loop-guid', 'screen-guid'],
                        mergeableGuids: ['end-guid']
                    });
                });
            });
        });
        describe('branch not ended', () => {
            it('No branches are merged and undefined parent parameter', () => {
                const branchingElement = { ...BRANCH_ELEMENT };
                branchingElement.children = [
                    ['head-guid', 'random-guid', 'random-guid2'],
                    ['head-guid', 'random-guid']
                ];

                const elements = createFlow([branchingElement], true);
                expect(
                    getTargetGuidsForReconnection(
                        elements,
                        'branch-guid:0-random-guid2',
                        undefined,
                        undefined,
                        false,
                        undefined
                    )
                ).toEqual({
                    firstMergeableNonNullNext: null,
                    goToableGuids: ['branch-guid:0-head-guid', 'branch-guid:0-random-guid', 'branch-guid'],
                    mergeableGuids: ['branch-guid:1-head-guid', 'branch-guid:1-random-guid', 'end-guid']
                });
            });

            it('Immediately ended branch with parent.next == null', () => {
                const branchingElement = { ...BRANCH_ELEMENT };
                branchingElement.children = [['head-guid', 'random-guid']];

                const elements = createFlow([branchingElement], true);
                elements['branch-guid'].children[1] = null;

                expect(getTargetGuidsForReconnection(elements, undefined, 'branch-guid', undefined, false, 1)).toEqual({
                    firstMergeableNonNullNext: null,
                    goToableGuids: [],
                    mergeableGuids: ['branch-guid:0-head-guid', 'branch-guid:0-random-guid', 'end-guid']
                });
            });

            it('Selected from a nested decision to the first firstMergeableNonNullNext that is a goto further up in the flow', () => {
                const elements = {
                    screen1: {
                        guid: 'screen1',
                        isCanvasElement: true,
                        prev: 'start-guid',
                        next: 'branch-guid',
                        incomingGoTo: ['branch-guid']
                    },
                    'branch-guid': {
                        guid: 'branch-guid',
                        isCanvasElement: true,
                        prev: 'screen1',
                        label: 'branch-guid',
                        elementType: 'branch',
                        next: 'screen1',
                        nodeType: 'branch',
                        children: ['branch-guid:0-head1-guid', null, null]
                    },
                    'branch-guid:0-head1-guid': {
                        guid: 'branch-guid:0-head1-guid',
                        isCanvasElement: true,
                        parent: 'branch-guid',
                        elementType: 'branch',
                        nodeType: 'branch',
                        childIndex: 0,
                        children: [null, null],
                        isTerminal: true,
                        next: 'end1-guid'
                    },
                    'end1-guid': {
                        guid: 'end1-guid',
                        label: 'end1-guid',
                        elementType: 'END_ELEMENT',
                        nodeType: 'end',
                        isCanvasElement: true,
                        prev: 'branch-guid:0-head1-guid'
                    },
                    root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                    'start-guid': {
                        childIndex: 0,
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen1',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(
                    getTargetGuidsForReconnection(elements, undefined, 'branch-guid:0-head1-guid', undefined, false, 0)
                ).toEqual({
                    firstMergeableNonNullNext: 'screen1',
                    goToableGuids: ['branch-guid'],
                    mergeableGuids: ['end1-guid']
                });
            });

            describe('GoTos from within a Loop', () => {
                it('Adding GoTo on a Loop Branch Head', () => {
                    const elements = {
                        root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                        'start-guid': {
                            childIndex: 0,
                            elementType: 'start',
                            guid: 'start-guid',
                            isCanvasElement: true,
                            isTerminal: true,
                            label: 'start-guid',
                            next: 'branch-guid',
                            nodeType: 'start',
                            parent: 'root'
                        },
                        'loop-guid': {
                            guid: 'loop-guid',
                            prev: 'start-guid',
                            label: 'loop-guid',
                            elementType: 'Loop',
                            next: 'screen-guid',
                            nodeType: 'loop',
                            children: [null],
                            isCanvasElement: true
                        },
                        'screen-guid': {
                            guid: 'screen-guid',
                            label: 'screen-guid',
                            elementType: 'Screen',
                            nodeType: 'default',
                            isCanvasElement: true,
                            prev: 'loop-guid',
                            next: 'end-guid2'
                        },
                        'end-guid2': {
                            guid: 'end-guid2',
                            label: 'end-guid2',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: 'screen-guid',
                            next: null
                        }
                    };
                    expect(
                        getTargetGuidsForReconnection(elements, undefined, 'loop-guid', null, true, FOR_EACH_INDEX)
                    ).toEqual({
                        firstMergeableNonNullNext: 'loop-guid',
                        goToableGuids: ['screen-guid'],
                        mergeableGuids: []
                    });
                });

                it('Adding GoTo from within a branch of a partially terminated branching element inside a Loop', () => {
                    const elements = {
                        root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                        'start-guid': {
                            childIndex: 0,
                            elementType: 'start',
                            guid: 'start-guid',
                            isCanvasElement: true,
                            isTerminal: true,
                            label: 'start-guid',
                            next: 'branch-guid',
                            nodeType: 'start',
                            parent: 'root'
                        },
                        'loop-guid': {
                            guid: 'loop-guid',
                            prev: 'start-guid',
                            label: 'loop-guid',
                            elementType: 'Loop',
                            next: 'screen-guid',
                            nodeType: 'loop',
                            children: ['decision-guid'],
                            isCanvasElement: true
                        },
                        'decision-guid': {
                            guid: 'decision-guid',
                            label: 'decision-guid',
                            elementType: 'Decision',
                            nodeType: 'branch',
                            isCanvasElement: true,
                            parent: 'loop-guid',
                            childIndex: FOR_EACH_INDEX,
                            prev: null,
                            next: 'end-guid',
                            isTerminal: true,
                            childReferences: [
                                {
                                    childReference: 'o1'
                                },
                                {
                                    childReference: 'o2'
                                }
                            ],
                            children: ['left-end-guid', null, null]
                        },
                        'left-end-guid': {
                            guid: 'left-end-guid',
                            label: 'left-end-guid',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: null,
                            next: null,
                            parent: 'decision-guid',
                            childIndex: 0,
                            isTerminal: true
                        },
                        'end-guid': {
                            guid: 'end-guid',
                            label: 'end-guid',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: 'decision-guid',
                            next: null
                        },
                        'screen-guid': {
                            guid: 'screen-guid',
                            label: 'screen-guid',
                            elementType: 'Screen',
                            nodeType: 'default',
                            isCanvasElement: true,
                            prev: 'loop-guid',
                            next: 'end-guid2'
                        },
                        'end-guid2': {
                            guid: 'end-guid2',
                            label: 'end-guid2',
                            elementType: 'END_ELEMENT',
                            nodeType: 'end',
                            isCanvasElement: true,
                            prev: 'screen-guid',
                            next: null
                        }
                    };

                    expect(getTargetGuidsForReconnection(elements, undefined, 'decision-guid', null, true, 2)).toEqual({
                        firstMergeableNonNullNext: 'loop-guid',
                        goToableGuids: ['screen-guid'],
                        mergeableGuids: ['left-end-guid', 'end-guid']
                    });
                });
            });
        });
    });

    describe('connectToElement', () => {
        it('reconnects to an element on another branch', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            const endElement1 = { ...END_ELEMENT, guid: 'end1-guid', prev: null };
            const endElement2 = { ...END_ELEMENT, guid: 'end2-guid', prev: null };

            branchingElement.children = [[endElement1], ['head-guid', 'random-guid', endElement2]];
            const elements = createFlow([branchingElement]);

            const source = {
                guid: 'branch-guid',
                childIndex: 0
            };

            expect(
                connectToElement(elementService(elements), elements, source, 'branch-guid:1-random-guid', true)
            ).toMatchSnapshot();
        });

        it('reconnects to the merge element', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [['head-guid', END_ELEMENT_GUID], ['head-guid', 'random-guid'], ['head-guid']];
            const elements = createFlow([branchingElement]);

            const source = {
                guid: 'branch-guid:0-head-guid'
            };

            expect(connectToElement(elementService(elements), elements, source, 'end-guid', true)).toMatchSnapshot();
        });

        it('When reconnecting to the first mergeable non null next', () => {
            const flowRenderContext = getFlowWithGoToOnFirstMergeableNonNullNext();
            expect(
                connectToElement(
                    elementService(flowRenderContext.flowModel),
                    flowRenderContext.flowModel,
                    { guid: 'decision3-guid', childIndex: 0 },
                    'screen-guid',
                    false
                )
            ).toMatchSnapshot();
        });
    });

    describe('linkElement', () => {
        it('updates pointers with no GoTos', () => {
            const prevElement = {
                guid: 'prev-element',
                prev: null,
                next: null
            };

            const nextElement = {
                guid: 'next-element',
                prev: null,
                next: null
            };

            const element = {
                guid: 'element',
                prev: prevElement.guid,
                next: nextElement.guid
            };

            const elements = {
                [prevElement.guid]: prevElement,
                [nextElement.guid]: nextElement
            };

            linkElement(elements, element);

            expect(prevElement).toEqual({
                guid: 'prev-element',
                prev: null,
                next: 'element'
            });

            expect(nextElement).toEqual({
                guid: 'next-element',
                prev: 'element',
                next: null
            });

            expect(Object.values(elements)).toHaveLength(3);
            expect(elements.element).toEqual({
                guid: 'element',
                prev: prevElement.guid,
                next: nextElement.guid
            });

            expect(elements.element).toBe(element);
        });

        it('updates pointers with a GoTo', () => {
            const prevElement = {
                guid: 'prev-element',
                prev: null,
                next: null,
                incomingGoTo: ['next-element']
            };

            const nextElement = {
                guid: 'next-element',
                prev: 'prev-element',
                next: 'prev-element'
            };

            const elements = {
                [prevElement.guid]: prevElement,
                [nextElement.guid]: nextElement
            };

            linkElement(elements, nextElement);

            expect(prevElement).toEqual({
                guid: 'prev-element',
                prev: null,
                next: 'next-element',
                incomingGoTo: ['next-element']
            });

            expect(nextElement).toEqual({
                guid: 'next-element',
                prev: 'prev-element',
                next: 'prev-element'
            });
        });
    });

    describe('linkBranchOrFault', () => {
        it('adds branch head to parent and updates its pointers', () => {
            const parentElement = {
                guid: 'parent-element',
                prev: null,
                next: null,
                children: [null, null]
            };

            const element = {
                guid: 'branch-head-element',
                prev: null,
                next: null
            };

            const elements = {
                [parentElement.guid]: parentElement
            };

            linkBranchOrFault(elements, parentElement, 1, element);

            expect(parentElement).toEqual({
                guid: 'parent-element',
                prev: null,
                next: null,
                children: [null, 'branch-head-element']
            });

            expect(element).toEqual({
                guid: 'branch-head-element',
                prev: null,
                next: null,
                parent: 'parent-element',
                childIndex: 1,
                isTerminal: false
            });
        });

        it('adds null branch to parent', () => {
            const parentElement = {
                guid: 'parent-element',
                prev: null,
                next: null,
                children: [null, null]
            };

            const element = null;

            const elements = {
                [parentElement.guid]: parentElement
            };

            linkBranchOrFault(elements, parentElement, 1, element);

            expect(parentElement).toEqual({
                guid: 'parent-element',
                prev: null,
                next: null,
                children: [null, null]
            });
        });

        it('adds branch head to parent and updates its pointers, and updates the existing child', () => {
            const parentElement = {
                guid: 'parent-element',
                prev: null,
                next: null,
                children: [null, 'existing-child-element']
            };

            const existingChildElement = {
                guid: 'existing-child-element',
                prev: null,
                next: null,
                parent: 'parent-element',
                childIndex: 1,
                isTerminal: true
            };

            const element = {
                guid: 'branch-head-element',
                prev: null,
                next: null
            };

            const elements = {
                [parentElement.guid]: parentElement,
                [existingChildElement.guid]: existingChildElement
            };

            linkBranchOrFault(elements, parentElement, 1, element);

            expect(parentElement).toEqual({
                guid: 'parent-element',
                prev: null,
                next: null,
                children: [null, 'branch-head-element']
            });

            expect(element).toEqual({
                guid: 'branch-head-element',
                prev: null,
                next: 'existing-child-element',
                parent: 'parent-element',
                childIndex: 1,
                isTerminal: true
            });

            expect(existingChildElement).toEqual({
                guid: 'existing-child-element',
                prev: 'branch-head-element',
                next: null
            });
        });
    });

    describe('find elements', () => {
        it('finds first and last element', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'last-element',
                incomingGoTo: ['last-element']
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'first-element',
                next: 'first-element'
            };

            const elements = flowModelFromElements([firstElement, lastElement]);

            expect(findFirstElement(lastElement, elements)).toBe(firstElement);
            expect(findLastElement(firstElement, elements)).toBe(lastElement);
        });
    });

    describe('deleteElement', () => {
        it('in nested branch with ended left branch inlines', () => {
            const nestedBranchingElement = { ...BRANCH_ELEMENT };
            nestedBranchingElement.children = [[END_ELEMENT_GUID], null];

            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[nestedBranchingElement], null];

            const elements = createFlow([branchingElement]);

            expect(
                deleteElement(elementService(elements), elements, 'branch-guid:0-branch-guid', defaultDeleteOptions)
            ).toMatchSnapshot();
        });

        it('top branch with goto on next and with nested branch with ended left branch inlines', () => {
            const nestedBranchingElement = { ...BRANCH_ELEMENT };
            nestedBranchingElement.children = [[END_ELEMENT_GUID], null];
            nestedBranchingElement.childReferences = [
                {
                    childReference: 'child-reference-guid-1'
                }
            ];

            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[nestedBranchingElement], null];

            // create goto from branchingElement.next to screen
            const screen = { ...SCREEN_ELEMENT, incomingGoTo: [branchingElement.guid] };
            branchingElement.next = screen.guid;

            const elements = createFlow([screen, branchingElement]);

            expect(
                deleteElement(elementService(elements), elements, 'branch-guid', defaultDeleteOptions)
            ).toMatchSnapshot();
        });

        it('end element in nested branch with ended left branch inlines', () => {
            const nestedBranchingElement = { ...BRANCH_ELEMENT };
            nestedBranchingElement.children = [[END_ELEMENT_GUID], null];

            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[nestedBranchingElement], null];

            const elements = createFlow([branchingElement]);

            expect(
                deleteElement(
                    elementService(elements),
                    elements,
                    'branch-guid:0-branch-guid:0-branch-guid:0-end-guid',
                    defaultDeleteOptions
                )
            ).toMatchSnapshot();
        });

        it('in triple nested branch with ended left branch inlines firstMergeableNonNullNext', () => {
            const finalNestedBranchingElement = { ...BRANCH_ELEMENT };
            finalNestedBranchingElement.children = [[END_ELEMENT_GUID], null];

            const nestedBranchingElement = { ...BRANCH_ELEMENT };
            nestedBranchingElement.children = [[finalNestedBranchingElement], null];

            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[nestedBranchingElement], null];

            const elements = createFlow([branchingElement]);

            expect(
                deleteElement(
                    elementService(elements),
                    elements,
                    'branch-guid:0-branch-guid:0-branch-guid:0-branch-guid:0-branch-guid:0-branch-guid:0-branch-guid:0-end-guid',
                    defaultDeleteOptions
                )
            ).toMatchSnapshot();
        });

        it('delete nested decision with end elements and reconnect', () => {
            const nestedBranchElement = { ...BRANCH_ELEMENT, children: [[END_ELEMENT_GUID], [END_ELEMENT_GUID]] };
            const branchElement = { ...BRANCH_ELEMENT, children: [[nestedBranchElement], [END_ELEMENT_GUID]] };

            const flowModel = createFlow([branchElement]);

            // delete nested branch

            const newFlowModel = deleteElement(
                elementService(flowModel),
                flowModel,
                'branch-guid:0-branch-guid',
                defaultDeleteOptions
            );

            expect(newFlowModel).toMatchSnapshot();

            const source = {
                guid: 'branch-guid',
                childIndex: 0
            };

            // reconnect with end of the right branch

            expect(
                connectToElement(elementService(newFlowModel), newFlowModel, source, 'branch-guid:1-end-guid', true)
            ).toMatchSnapshot();
        });

        it('persisting a terminated branch that has a regular element and an end element', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'branch-element'
            };

            const branchElement = {
                guid: 'branch-element',
                prev: 'first-element',
                next: 'last-element',
                children: ['branch-head-one', null, null]
            };

            const branchHeadElement = {
                guid: 'branch-head-one',
                prev: null,
                next: 'branch-one-end',
                childIndex: 0,
                parent: 'branch-element',
                isTerminal: true
            };

            const branchOneEnd = {
                guid: 'branch-one-end',
                prev: 'branch-head-one',
                next: null,
                nodeType: NodeType.END,
                elementType: 'END_ELEMENT'
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'branch-element',
                next: null
            };

            const elements = flowModelFromElements([
                firstElement,
                branchElement,
                branchHeadElement,
                branchOneEnd,
                lastElement
            ]);

            expect(
                deleteElement(elementService(elements), elements, branchElement.guid, defaultDeleteOptions)
            ).toMatchSnapshot();
        });

        it('persisting a terminated branch that has end element as branch head', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'branch-element'
            };

            const branchElement = {
                guid: 'branch-element',
                prev: 'first-element',
                next: 'last-element',
                children: ['branch-head-one', null, null]
            };

            const branchHeadElement = {
                guid: 'branch-head-one',
                prev: null,
                next: null,
                childIndex: 0,
                parent: 'branch-element',
                isTerminal: true,
                nodeType: NodeType.END,
                elementType: 'END_ELEMENT'
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'branch-element',
                next: null
            };

            const elements = flowModelFromElements([firstElement, branchElement, branchHeadElement, lastElement]);

            expect(
                deleteElement(elementService(elements), elements, branchElement.guid, defaultDeleteOptions)
            ).toMatchSnapshot();
        });

        it('deletes inline element', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'inline-element',
                isTerminal: false
            };

            const inlineElement = {
                guid: 'inline-element',
                prev: 'first-element',
                next: 'last-element'
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'inline-element',
                next: null
            };

            const elements = flowModelFromElements([firstElement, inlineElement, lastElement]);

            expect(
                deleteElement(elementService(elements), elements, inlineElement.guid, {
                    ...defaultDeleteOptions,
                    childIndexToKeep: null
                })
            ).toMatchSnapshot();
        });
        it('deletes branching element that supports a fault branch as well', () => {
            const screenElement = {
                guid: 'screen-element',
                prev: null,
                next: 'branching-element'
            };
            const branchingElement = {
                guid: 'branching-element',
                children: ['branch-head-one', 'branch-head-two'],
                prev: 'screen-element',
                next: 'merge-element',
                fault: 'fault-branch-head-element'
            };

            const branchHeadOne = {
                guid: 'branch-head-one',
                childIndex: 0,
                parent: 'branching-element',
                isTerminal: false,
                prev: null,
                next: null
            };

            const branchHeadTwo = {
                guid: 'branch-head-two',
                childIndex: 1,
                parent: 'branching-element',
                isTerminal: false,
                prev: null,
                next: null
            };

            const mergeElement = {
                guid: 'merge-element',
                prev: 'branching-element',
                next: null,
                nodeType: NodeType.END,
                elementType: 'END_ELEMENT'
            };

            const faultBranchHeadElement = {
                guid: 'fault-branch-head-element',
                childIndex: FAULT_INDEX,
                parent: 'branching-element',
                isTerminal: true,
                prev: null,
                next: 'fault-branch-end-element'
            };

            const faultBranchEndElement = {
                guid: 'fault-branch-end-element',
                prev: 'fault-branch-head-element',
                next: null,
                nodeType: NodeType.END
            };

            const elements = flowModelFromElements([
                screenElement,
                branchingElement,
                branchHeadOne,
                branchHeadTwo,
                mergeElement,
                branchHeadOne,
                branchHeadTwo,
                faultBranchHeadElement,
                faultBranchEndElement
            ]);

            expect(
                deleteElement(elementService(elements), elements, branchingElement.guid, defaultDeleteOptions)
            ).toMatchSnapshot();
        });
        it('deletes branch head element', () => {
            const branchingElement = {
                guid: 'branching-element',
                children: ['branch-head-element', null],
                prev: null,
                next: 'merge-element'
            };

            const branchHeadElement = {
                guid: 'branch-head-element',
                childIndex: 0,
                parent: 'branching-element',
                isTerminal: false,
                prev: null,
                next: null
            };

            const mergeElement = {
                guid: 'merge-element',
                prev: 'branching-element',
                next: null
            };

            const elements = flowModelFromElements([branchingElement, mergeElement, branchHeadElement]);

            expect(
                deleteElement(elementService(elements), elements, branchHeadElement.guid, defaultDeleteOptions)
            ).toMatchSnapshot();
        });
        it('deletes fully terminated branch element in main flow', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'inline-element'
            };

            const inlineElement = {
                guid: 'inline-element',
                prev: 'first-element',
                next: null,
                elementType: 'Decision',
                children: ['branch-element-one', 'branch-element-two']
            };

            const branchElementOne = {
                guid: 'branch-element-one',
                parent: 'inline-element',
                childIndex: 0,
                next: null,
                nodeType: NodeType.END,
                isTerminal: true
            };

            const branchElementTwo = {
                guid: 'branch-element-two',
                parent: 'inline-element',
                childIndex: 1,
                next: null,
                nodeType: NodeType.END,
                isTerminal: true
            };

            const elements = flowModelFromElements([firstElement, inlineElement, branchElementOne, branchElementTwo]);

            expect(deleteElement(elementService(elements), elements, inlineElement.guid)).toMatchSnapshot();
        });
        it('deletes fully terminated branchHead element in another branch', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'inline-element'
            };

            const inlineElement = {
                guid: 'inline-element',
                prev: 'first-element',
                next: 'last-element',
                children: ['branch-head-element', null]
            };

            const branchHeadElement = {
                guid: 'branch-head-element',
                parent: 'inline-element',
                childIndex: 0,
                next: null,
                children: ['end-element-one', 'end-element-two'],
                isTerminal: true
            };

            const endElementOne = {
                guid: 'end-element-one',
                parent: 'branch-head-element',
                childIndex: 0,
                next: null,
                isTerminal: true
            };

            const endElementTwo = {
                guid: 'end-element-two',
                parent: 'branch-head-element',
                childIndex: 1,
                next: null,
                isTerminal: true
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'inline-element',
                next: null
            };

            const elements = flowModelFromElements([
                firstElement,
                inlineElement,
                branchHeadElement,
                endElementOne,
                endElementTwo,
                lastElement
            ]);

            expect(deleteElement(elementService(elements), elements, branchHeadElement.guid)).toMatchSnapshot();
        });
        it('deletes loop element nested in a decision', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'decision-element'
            };

            const decisionElement = {
                guid: 'decision-element',
                prev: 'first-element',
                next: 'last-element',
                children: [null, 'loop-element']
            };

            const loopElement = {
                guid: 'loop-element',
                prev: null,
                next: null,
                children: ['screen-element'],
                parent: 'decision-element',
                childIndex: 1,
                isTerminal: false
            };

            const screenElement = {
                guid: 'screen-element',
                prev: null,
                next: null,
                parent: 'loop-element',
                childIndex: 0
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'decision-element',
                next: null
            };

            const elements = flowModelFromElements([
                firstElement,
                decisionElement,
                loopElement,
                screenElement,
                lastElement
            ]);

            expect(
                deleteElement(elementService(elements), elements, loopElement.guid, defaultDeleteOptions)
            ).toMatchSnapshot();
        });
        it('deletes a non branch head element in a Fault branch', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'action-element'
            };

            const actionElement = {
                guid: 'action-element',
                prev: 'first-element',
                next: 'last-element',
                fault: 'fault-branch-head'
            };

            const faultBranchHeadElement = {
                guid: 'fault-branch-head-element',
                prev: null,
                next: 'fault-inline-element',
                parent: 'action-element',
                childIndex: FAULT_INDEX,
                isTerminal: true
            };

            const faultInlineElement = {
                guid: 'fault-inline-element',
                prev: 'fault-branch-head-element',
                next: 'fault-end-element'
            };

            const faultEndElement = {
                guid: 'fault-end-element',
                prev: 'fault-inline-element',
                next: null,
                nodeType: NodeType.END
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'action-element',
                next: null,
                nodeType: NodeType.END
            };

            const elements = flowModelFromElements([
                firstElement,
                actionElement,
                faultBranchHeadElement,
                faultInlineElement,
                faultEndElement,
                lastElement
            ]);

            const expectedState = {
                'first-element': {
                    guid: 'first-element',
                    prev: null,
                    next: 'action-element'
                },
                'action-element': {
                    guid: 'action-element',
                    prev: 'first-element',
                    next: 'last-element',
                    fault: 'fault-branch-head'
                },
                'fault-branch-head-element': {
                    guid: 'fault-branch-head-element',
                    prev: null,
                    next: 'fault-end-element',
                    parent: 'action-element',
                    childIndex: FAULT_INDEX,
                    isTerminal: true
                },
                'fault-end-element': {
                    guid: 'fault-end-element',
                    prev: 'fault-branch-head-element',
                    next: null,
                    nodeType: NodeType.END
                },
                'last-element': {
                    guid: 'last-element',
                    prev: 'action-element',
                    next: null,
                    nodeType: NodeType.END
                }
            };

            expect(deleteElement(elementService(elements), elements, faultInlineElement.guid)).toEqual(expectedState);
        });

        it('branching with no next', () => {
            const elementToDelete = 'element-guid';
            const elements = {
                root: {
                    guid: 'root',
                    nodeType: NodeType.ROOT,
                    children: ['dummy-prev']
                },
                'element-guid': {
                    guid: 'element-guid',
                    prev: 'dummy-prev',
                    next: null,
                    nodeType: NodeType.BRANCH_ELEMENT,
                    children: ['end-left-guid', 'end-right-guid']
                },
                'dummy-prev': {
                    parent: 'root',
                    childIndex: 0,
                    isTerminal: true,
                    guid: 'dummy-prev',
                    next: 'element-guid'
                },
                'end-left-guid': {
                    guid: 'end-left-guid',
                    nodeType: NodeType.END,
                    isTerminal: true,
                    parent: 'element-guid',
                    childIndex: 0
                },
                'end-right-guid': {
                    guid: 'end-right-guid',
                    nodeType: NodeType.END,
                    isTerminal: true,
                    parent: 'element-guid',
                    childIndex: 1
                }
            };

            const expectedElements = {
                'dummy-prev': {
                    childIndex: 0,
                    guid: 'dummy-prev',
                    isTerminal: true,
                    next: 'end-hook-guid',
                    parent: 'root'
                },
                'end-hook-guid': {
                    guid: 'end-hook-guid',
                    next: null,
                    nodeType: 'end',
                    prev: 'dummy-prev'
                },
                root: {
                    children: ['dummy-prev'],
                    guid: 'root',
                    nodeType: 'root'
                }
            };

            const nextElements = deleteElement(elementService(elements), elements, elementToDelete, {
                childIndexToKeep: undefined
            });
            expect(nextElements).toEqual(expectedElements);
        });

        it('Deleting a branch element along with all the branches', () => {
            const elements = {
                root: {
                    guid: 'root',
                    nodeType: 'root',
                    elementType: 'root',
                    children: ['start-guid']
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [
                        {
                            childReference: 'child-reference-guid-1'
                        },
                        {
                            childReference: 'child-reference-guid-2'
                        }
                    ],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'decision-guid',
                    nodeType: 'start',
                    parent: 'root'
                },
                'decision-guid': {
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision-guid',
                    next: 'end-guid',
                    nodeType: 'branch',
                    prev: 'start-guid',
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: ['screen-one-guid', 'screen-two-guid']
                },
                'screen-one-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen-one-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-one-guid',
                    next: null,
                    nodeType: 'default',
                    prev: null,
                    parent: 'decision-guid',
                    childIndex: 0,
                    isTerminal: true
                },
                'screen-two-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen-two-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-two-guid',
                    next: null,
                    nodeType: 'default',
                    prev: null,
                    parent: 'decision-guid',
                    childIndex: 1,
                    isTerminal: true
                },
                'end-guid': {
                    config: {},
                    elementType: 'end',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    next: null,
                    nodeType: 'end',
                    prev: 'decision-guid'
                }
            };

            const expectedElements = {
                root: {
                    guid: 'root',
                    nodeType: 'root',
                    elementType: 'root',
                    children: ['start-guid']
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [
                        {
                            childReference: 'child-reference-guid-1'
                        },
                        {
                            childReference: 'child-reference-guid-2'
                        }
                    ],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'end-guid',
                    nodeType: 'start',
                    parent: 'root'
                },
                'end-guid': {
                    config: {},
                    elementType: 'end',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    next: null,
                    nodeType: 'end',
                    prev: 'start-guid'
                }
            };

            const nextElements = deleteElement(elementService(elements), elements, 'decision-guid');
            expect(nextElements).toEqual(expectedElements);
        });

        it('Deleting a simple element which is a GoTo source', () => {
            const flowRenderContext = getFlowWhenGoingToPreviousElement();
            const updatedFlowModel = deleteElement(
                elementService(flowRenderContext.flowModel),
                flowRenderContext.flowModel,
                'goto-source-guid'
            );
            const expectedFlowModel = {
                root: {
                    guid: 'root',
                    nodeType: 'root',
                    elementType: 'root',
                    children: ['start-guid']
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'goto-target-guid',
                    nodeType: 'start',
                    parent: 'root'
                },
                'goto-target-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'goto-target-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'end-hook-guid',
                    nodeType: 'default',
                    prev: 'start-guid'
                },
                'end-hook-guid': {
                    guid: 'end-hook-guid',
                    nodeType: 'end',
                    prev: 'goto-target-guid'
                }
            };
            expect(updatedFlowModel).toEqual(expectedFlowModel);
        });

        it('Deleting simple GoTo source element from branch head location (0th index)', () => {
            const originalFlowModel = {
                root: {
                    guid: 'root',
                    nodeType: 'root',
                    elementType: 'root',
                    children: ['start-guid']
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [
                        {
                            childReference: 'child-reference-guid-1'
                        },
                        {
                            childReference: 'child-reference-guid-2'
                        }
                    ],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'decision-guid',
                    nodeType: 'start',
                    parent: 'root'
                },
                'decision-guid': {
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision-guid',
                    incomingGoTo: ['screen-guid'],
                    isCanvasElement: true,
                    label: 'decision-guid',
                    next: null,
                    nodeType: 'branch',
                    prev: 'start-guid',
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: ['screen-guid', 'right-end-guid']
                },
                'screen-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'decision-guid',
                    nodeType: 'default',
                    prev: null,
                    parent: 'decision-guid',
                    childIndex: 0,
                    isTerminal: true
                },
                'right-end-guid': {
                    config: {},
                    elementType: 'end',
                    guid: 'right-end-guid',
                    isCanvasElement: true,
                    label: 'right-end-guid',
                    next: null,
                    nodeType: 'end',
                    prev: null,
                    parent: 'decision-guid',
                    childIndex: 1,
                    isTerminal: true
                }
            };
            const updatedFlowModel = deleteElement(elementService(originalFlowModel), originalFlowModel, 'screen-guid');
            const expectedFlowModel = {
                root: {
                    children: ['start-guid'],
                    elementType: 'root',
                    guid: 'root',
                    nodeType: 'root'
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [
                        {
                            childReference: 'child-reference-guid-1'
                        },
                        {
                            childReference: 'child-reference-guid-2'
                        }
                    ],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'decision-guid',
                    nodeType: 'start',
                    parent: 'root'
                },
                'decision-guid': {
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: ['end-hook-guid', 'right-end-guid'],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision-guid',
                    next: null,
                    nodeType: 'branch',
                    prev: 'start-guid'
                },
                'end-hook-guid': {
                    childIndex: 0,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: 'end',
                    parent: 'decision-guid',
                    prev: null
                },
                'right-end-guid': {
                    childIndex: 1,
                    config: {},
                    elementType: 'end',
                    guid: 'right-end-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'right-end-guid',
                    next: null,
                    nodeType: 'end',
                    parent: 'decision-guid',
                    prev: null
                }
            };
            expect(updatedFlowModel).toEqual(expectedFlowModel);
        });

        it('Deleting simple GoTo source element from branch head location (Fault index)', () => {
            const originalFlowModel = {
                root: {
                    guid: 'root',
                    nodeType: 'root',
                    elementType: 'root',
                    children: ['start-guid']
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [
                        {
                            childReference: 'child-reference-guid-1'
                        },
                        {
                            childReference: 'child-reference-guid-2'
                        }
                    ],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'action-guid',
                    nodeType: 'start',
                    parent: 'root'
                },
                'action-guid': {
                    config: {},
                    elementType: 'Action',
                    guid: 'action-guid',
                    incomingGoTo: ['screen-guid'],
                    isCanvasElement: true,
                    label: 'action-guid',
                    next: 'end-guid',
                    nodeType: 'default',
                    prev: 'start-guid',
                    fault: 'screen-guid'
                },
                'screen-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'action-guid',
                    nodeType: 'default',
                    prev: null,
                    parent: 'action-guid',
                    childIndex: -1,
                    isTerminal: true
                },
                'end-guid': {
                    config: {},
                    elementType: 'end',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    next: null,
                    nodeType: 'end',
                    prev: 'action-guid'
                }
            };
            const updatedFlowModel = deleteElement(elementService(originalFlowModel), originalFlowModel, 'screen-guid');
            const expectedFlowModel = {
                root: {
                    children: ['start-guid'],
                    elementType: 'root',
                    guid: 'root',
                    nodeType: 'root'
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [
                        {
                            childReference: 'child-reference-guid-1'
                        },
                        {
                            childReference: 'child-reference-guid-2'
                        }
                    ],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'action-guid',
                    nodeType: 'start',
                    parent: 'root'
                },
                'action-guid': {
                    config: {},
                    elementType: 'Action',
                    guid: 'action-guid',
                    incomingGoTo: [],
                    label: 'action-guid',
                    isCanvasElement: true,
                    next: 'end-guid',
                    nodeType: 'default',
                    prev: 'start-guid',
                    fault: 'end-hook-guid'
                },
                'end-hook-guid': {
                    childIndex: -1,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: 'end',
                    parent: 'action-guid',
                    prev: null
                },
                'end-guid': {
                    config: {},
                    elementType: 'end',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    next: null,
                    nodeType: 'end',
                    prev: 'action-guid'
                }
            };
            expect(updatedFlowModel).toEqual(expectedFlowModel);
        });

        describe('Deleting elements that cause a self-loop', () => {
            it('Self-loop with GoTo on parentElements next with a deletion that causes a null branch nested', () => {
                const originalFlowModel = {
                    root: {
                        guid: 'root',
                        nodeType: 'root',
                        elementType: 'root',
                        children: ['start-guid']
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'decision-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'decision-one': {
                        childReferences: [
                            {
                                childReference: 'o1'
                            }
                        ],
                        children: ['screen-one', 'decision-two'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'decision-one',
                        next: 'decision-two',
                        nodeType: 'branch',
                        prev: 'start-guid'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 0,
                        isTerminal: false
                    },
                    'decision-two': {
                        childReferences: [
                            {
                                childReference: 'o11'
                            }
                        ],
                        children: ['screen-two', 'screen-three'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-two',
                        incomingGoTo: ['decision-one'],
                        isCanvasElement: true,
                        label: 'decision-two',
                        next: null,
                        nodeType: 'branch',
                        parent: 'decision-one',
                        childIndex: 1,
                        isTerminal: false
                    },
                    'screen-two': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-two',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-two',
                        childIndex: 0,
                        isTerminal: false
                    },
                    'screen-three': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-three',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-three',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-two',
                        childIndex: 1,
                        isTerminal: false
                    }
                };
                const expectedFlowModel = {
                    root: {
                        guid: 'root',
                        nodeType: 'root',
                        elementType: 'root',
                        children: ['start-guid']
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'decision-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'decision-one': {
                        childReferences: [
                            {
                                childReference: 'o1'
                            }
                        ],
                        children: ['screen-one', 'decision-two'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'decision-one',
                        next: 'decision-two',
                        nodeType: 'branch',
                        prev: 'start-guid'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 0,
                        isTerminal: false
                    },
                    'decision-two': {
                        childReferences: [
                            {
                                childReference: 'o11'
                            }
                        ],
                        children: ['end-hook-guid', 'screen-three'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-two',
                        incomingGoTo: ['decision-one'],
                        isCanvasElement: true,
                        label: 'decision-two',
                        next: null,
                        nodeType: 'branch',
                        parent: 'decision-one',
                        childIndex: 1,
                        isTerminal: false
                    },
                    'screen-three': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-three',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-three',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-two',
                        childIndex: 1,
                        isTerminal: false
                    },
                    'end-hook-guid': {
                        guid: 'end-hook-guid',
                        next: null,
                        parent: 'decision-two',
                        nodeType: 'end',
                        childIndex: 0,
                        isTerminal: true
                    }
                };
                const updatedFlowModel = deleteElement(
                    elementService(originalFlowModel),
                    originalFlowModel,
                    'screen-two'
                );
                expect(updatedFlowModel).toEqual(expectedFlowModel);
            });
            it('Self-loop with GoTo on parentElements next with a deletion that causes a null branch', () => {
                const originalFlowModel = {
                    root: {
                        guid: 'root',
                        nodeType: 'root',
                        elementType: 'root',
                        children: ['start-guid']
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'decision-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'decision-one': {
                        childReferences: [
                            {
                                childReference: 'o1'
                            }
                        ],
                        children: ['screen-one', 'screen-two'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-one',
                        incomingGoTo: ['decision-one'],
                        isCanvasElement: true,
                        label: 'decision-one',
                        next: 'decision-one',
                        nodeType: 'branch',
                        prev: 'start-guid'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 0,
                        isTerminal: false
                    },
                    'screen-two': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-two',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 1,
                        isTerminal: false
                    }
                };
                const expectedFlowModel = {
                    root: {
                        guid: 'root',
                        nodeType: 'root',
                        elementType: 'root',
                        children: ['start-guid']
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'decision-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'decision-one': {
                        childReferences: [
                            {
                                childReference: 'o1'
                            }
                        ],
                        children: ['end-hook-guid', 'screen-two'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-one',
                        incomingGoTo: ['screen-two'],
                        isCanvasElement: true,
                        label: 'decision-one',
                        next: null,
                        nodeType: 'branch',
                        prev: 'start-guid'
                    },
                    'screen-two': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-two',
                        next: 'decision-one',
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 1,
                        isTerminal: true
                    },
                    'end-hook-guid': {
                        guid: 'end-hook-guid',
                        childIndex: 0,
                        isTerminal: true,
                        next: null,
                        parent: 'decision-one',
                        nodeType: 'end'
                    }
                };
                const updatedFlowModel = deleteElement(
                    elementService(originalFlowModel),
                    originalFlowModel,
                    'screen-one'
                );
                expect(updatedFlowModel).toEqual(expectedFlowModel);
            });
            it('Self-loop when a parentElements next is a GoTo to an element right before the last element in a branch', () => {
                const originalFlowModel = {
                    root: {
                        guid: 'root',
                        nodeType: 'root',
                        elementType: 'root',
                        children: ['start-guid']
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'decision-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'decision-one': {
                        childReferences: [
                            {
                                childReference: 'o1'
                            }
                        ],
                        children: ['screen-one', 'screen-two'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'decision-one',
                        next: 'screen-two',
                        nodeType: 'branch',
                        prev: 'start-guid'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 0,
                        isTerminal: false
                    },
                    'screen-two': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: ['decision-one'],
                        isCanvasElement: true,
                        label: 'screen-two',
                        next: 'screen-three',
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 1,
                        isTerminal: false
                    },
                    'screen-three': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-three',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-three',
                        next: null,
                        nodeType: 'default',
                        prev: 'screen-two'
                    }
                };
                const expectedFlowModel = {
                    root: {
                        guid: 'root',
                        nodeType: 'root',
                        elementType: 'root',
                        children: ['start-guid']
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'decision-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'decision-one': {
                        childReferences: [
                            {
                                childReference: 'o1'
                            }
                        ],
                        children: ['screen-one', 'screen-two'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'decision-one',
                        next: null,
                        nodeType: 'branch',
                        prev: 'start-guid'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'screen-two',
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 0,
                        isTerminal: true
                    },
                    'screen-two': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: ['screen-one'],
                        isCanvasElement: true,
                        label: 'screen-two',
                        next: 'end-hook-guid',
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 1,
                        isTerminal: true
                    },
                    'end-hook-guid': {
                        guid: 'end-hook-guid',
                        next: null,
                        prev: 'screen-two',
                        nodeType: 'end'
                    }
                };
                const updatedFlowModel = deleteElement(
                    elementService(originalFlowModel),
                    originalFlowModel,
                    'screen-three'
                );
                expect(updatedFlowModel).toEqual(expectedFlowModel);
            });
        });

        describe('Deleting Elements in a flow with multiple GoTos', () => {
            let originalFlowModel;
            beforeEach(() => {
                originalFlowModel = {
                    root: {
                        guid: 'root',
                        nodeType: 'root',
                        elementType: 'root',
                        children: ['start-guid']
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'decision-one',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    'decision-one': {
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
                        children: ['action', 'screen-two', 'action', 'screen-three'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-one',
                        incomingGoTo: ['decision-one'],
                        isCanvasElement: true,
                        label: 'decision-one',
                        next: 'decision-one',
                        nodeType: 'branch',
                        prev: 'screen-one'
                    },
                    'screen-two': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-two',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 1,
                        isTerminal: false
                    },
                    action: {
                        config: {},
                        elementType: 'Action',
                        guid: 'action',
                        incomingGoTo: ['decision-one:o1'],
                        label: 'action',
                        isCanvasElement: true,
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 2,
                        fault: 'screen-three',
                        isTerminal: false
                    },
                    'screen-three': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-three',
                        incomingGoTo: ['action:fault'],
                        isCanvasElement: true,
                        label: 'screen-three',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision-one',
                        childIndex: 3,
                        isTerminal: false
                    }
                };
            });

            it('Deleting branch element while persisting the first branch (with a GoTo on the branch head)', () => {
                const updatedFlowModel = deleteElement(
                    elementService(originalFlowModel),
                    originalFlowModel,
                    'decision-one',
                    { childIndexToKeep: 0 }
                );
                const expectedFlowModel = {
                    'end-hook-guid_0': {
                        guid: 'end-hook-guid_0',
                        nodeType: 'end',
                        prev: 'screen-one'
                    },
                    root: {
                        children: ['start-guid'],
                        elementType: 'root',
                        guid: 'root',
                        nodeType: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'end-hook-guid_0',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(updatedFlowModel).toEqual(expectedFlowModel);
            });

            it('Deleting branch element while persisting a branch with no goTos while other branches have goTos on them', () => {
                const updatedFlowModel = deleteElement(
                    elementService(originalFlowModel),
                    originalFlowModel,
                    'decision-one',
                    { childIndexToKeep: 1 }
                );
                const expectedFlowModel = {
                    'end-hook-guid': {
                        guid: 'end-hook-guid',
                        nodeType: 'end',
                        prev: 'screen-two'
                    },
                    root: {
                        children: ['start-guid'],
                        elementType: 'root',
                        guid: 'root',
                        nodeType: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'screen-two',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    'screen-two': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-two',
                        next: 'end-hook-guid',
                        nodeType: 'default',
                        prev: 'screen-one'
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(updatedFlowModel).toEqual(expectedFlowModel);
            });

            it('Deleting branch element while persisting a branch with a GoTo on the fault branch head of a nested element', () => {
                const updatedFlowModel = deleteElement(
                    elementService(originalFlowModel),
                    originalFlowModel,
                    'decision-one',
                    { childIndexToKeep: 2 }
                );
                const expectedFlowModel = {
                    action: {
                        config: {},
                        elementType: 'Action',
                        fault: 'end-hook-guid_0_0',
                        guid: 'action',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'action',
                        next: 'end-hook-guid',
                        nodeType: 'default',
                        prev: 'screen-one'
                    },
                    'end-hook-guid': {
                        guid: 'end-hook-guid',
                        nodeType: 'end',
                        prev: 'action'
                    },
                    'end-hook-guid_0_0': {
                        childIndex: -1,
                        guid: 'end-hook-guid_0_0',
                        isTerminal: true,
                        nodeType: 'end',
                        parent: 'action'
                    },
                    root: {
                        children: ['start-guid'],
                        elementType: 'root',
                        guid: 'root',
                        nodeType: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'action',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(updatedFlowModel).toEqual(expectedFlowModel);
            });

            it('Deleting branch element while persisting a branch with a GoTo on the tail', () => {
                const updatedFlowModel = deleteElement(
                    elementService(originalFlowModel),
                    originalFlowModel,
                    'decision-one',
                    { childIndexToKeep: 3 }
                );
                const expectedFlowModel = {
                    'end-hook-guid': {
                        guid: 'end-hook-guid',
                        nodeType: 'end',
                        prev: 'screen-three'
                    },
                    root: {
                        children: ['start-guid'],
                        elementType: 'root',
                        guid: 'root',
                        nodeType: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'screen-three',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    'screen-three': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-three',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-three',
                        next: 'end-hook-guid',
                        nodeType: 'default',
                        prev: 'screen-one'
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(updatedFlowModel).toEqual(expectedFlowModel);
            });

            it('Deleting branch element along with all the branches', () => {
                const updatedFlowModel = deleteElement(
                    elementService(originalFlowModel),
                    originalFlowModel,
                    'decision-one'
                );
                const expectedFlowModel = {
                    'end-hook-guid': {
                        guid: 'end-hook-guid',
                        nodeType: 'end',
                        prev: 'screen-one'
                    },
                    root: {
                        children: ['start-guid'],
                        elementType: 'root',
                        guid: 'root',
                        nodeType: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'end-hook-guid',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(updatedFlowModel).toEqual(expectedFlowModel);
            });

            it('Deleting an element with a GoTo on the associated Fault branch head', () => {
                const updatedFlowModel = deleteElement(elementService(originalFlowModel), originalFlowModel, 'action');
                const expectedFlowModel = {
                    'decision-one': {
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
                        children: ['end-hook-guid', 'screen-two', 'end-hook-guid_0', 'screen-three'],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision-one',
                        incomingGoTo: ['decision-one'],
                        isCanvasElement: true,
                        label: 'decision-one',
                        next: 'decision-one',
                        nodeType: 'branch',
                        prev: 'screen-one'
                    },
                    'end-hook-guid': {
                        childIndex: 0,
                        guid: 'end-hook-guid',
                        isTerminal: true,
                        nodeType: 'end',
                        parent: 'decision-one'
                    },
                    'end-hook-guid_0': {
                        childIndex: 2,
                        guid: 'end-hook-guid_0',
                        isTerminal: true,
                        nodeType: 'end',
                        parent: 'decision-one',
                        next: null
                    },
                    root: {
                        children: ['start-guid'],
                        elementType: 'root',
                        guid: 'root',
                        nodeType: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'decision-one',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    'screen-three': {
                        childIndex: 3,
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-three',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        isTerminal: false,
                        label: 'screen-three',
                        next: null,
                        nodeType: 'default',
                        parent: 'decision-one',
                        prev: null
                    },
                    'screen-two': {
                        childIndex: 1,
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        isTerminal: false,
                        label: 'screen-two',
                        next: null,
                        nodeType: 'default',
                        parent: 'decision-one',
                        prev: null
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    }
                };
                expect(updatedFlowModel).toEqual(expectedFlowModel);
            });
        });

        describe('Deleting branch element that has GoTos beyond the merge point', () => {
            it('When persisted branch is not terminated, GoTo present at the merge point should be linked correctly', () => {
                const goToFlowModel = {
                    root: {
                        children: ['start-guid'],
                        elementType: 'root',
                        guid: 'root',
                        nodeType: 'root'
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: ['decision'],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'decision',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    decision: {
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ],
                        children: ['screen-two', null, null],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'decision',
                        next: 'screen-one',
                        nodeType: 'branch',
                        prev: 'screen-one'
                    },
                    'screen-two': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-two',
                        next: null,
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision',
                        childIndex: 0,
                        isTerminal: false
                    }
                };
                const updatedFlowModel = deleteElement(elementService(goToFlowModel), goToFlowModel, 'decision', {
                    childIndexToKeep: 0
                });
                expect(updatedFlowModel).toMatchSnapshot();
            });

            it('When persisted branch is terminated, GoTo present at the merge point should be cleaned up correctly', () => {
                const goToFlowModel = {
                    root: {
                        children: ['start-guid'],
                        elementType: 'root',
                        guid: 'root',
                        nodeType: 'root'
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: ['decision'],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'decision',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    decision: {
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ],
                        children: ['end', null, null],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'decision',
                        next: 'screen-one',
                        nodeType: 'branch',
                        prev: 'screen-one'
                    },
                    end: {
                        childIndex: 0,
                        guid: 'end',
                        isTerminal: true,
                        nodeType: 'end',
                        parent: 'decision'
                    }
                };

                const updatedFlowModel = deleteElement(elementService(goToFlowModel), goToFlowModel, 'decision', {
                    childIndexToKeep: 0
                });
                expect(updatedFlowModel).toMatchSnapshot();
            });

            it('When persisted branch is terminated, any incoming/outgoing GoTos present beyond the merge point should be cleaned up correctly', () => {
                const goToFlowModel = {
                    root: {
                        children: ['start-guid'],
                        elementType: 'root',
                        guid: 'root',
                        nodeType: 'root'
                    },
                    'start-guid': {
                        childIndex: 0,
                        config: {},
                        elementType: 'start',
                        guid: 'start-guid',
                        isCanvasElement: true,
                        isTerminal: true,
                        label: 'start-guid',
                        next: 'screen-one',
                        nodeType: 'start',
                        parent: 'root'
                    },
                    'screen-one': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-one',
                        incomingGoTo: ['screen-three'],
                        isCanvasElement: true,
                        label: 'screen-one',
                        next: 'decision',
                        nodeType: 'default',
                        prev: 'start-guid'
                    },
                    decision: {
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ],
                        children: ['screen-two', null, null],
                        config: {},
                        elementType: 'Decision',
                        guid: 'decision',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'decision',
                        next: 'screen-three',
                        nodeType: 'branch',
                        prev: 'screen-one'
                    },
                    'screen-two': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-two',
                        incomingGoTo: [],
                        isCanvasElement: true,
                        label: 'screen-two',
                        next: 'screen-three',
                        nodeType: 'default',
                        prev: null,
                        parent: 'decision',
                        childIndex: 0,
                        isTerminal: true
                    },
                    'screen-three': {
                        config: {},
                        elementType: 'Screen',
                        guid: 'screen-three',
                        incomingGoTo: ['screen-two'],
                        isCanvasElement: true,
                        label: 'screen-three',
                        next: 'screen-one',
                        nodeType: 'default',
                        prev: 'decision'
                    }
                };

                const updatedFlowModel = deleteElement(elementService(goToFlowModel), goToFlowModel, 'decision', {
                    childIndexToKeep: 0
                });
                expect(updatedFlowModel).toMatchSnapshot();
            });
        });
    });

    describe('shouldDeleteGoToOnNext', () => {
        it('Returns false if no GoTo is present on next', () => {
            const flowModel = {
                decision: {
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: [null, null],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision',
                    next: 'end',
                    nodeType: 'branch'
                },
                end: {
                    guid: 'end',
                    nodeType: 'end',
                    prev: 'decision'
                }
            };

            expect(shouldDeleteGoToOnNext(flowModel, flowModel.decision, 0)).toBeFalsy();
        });

        it('Returns true if GoTo is present on next and childIndexToKeep is null, i.e. no branch is being persisted', () => {
            const flowModel = {
                screen: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen',
                    incomingGoTo: ['decision'],
                    isCanvasElement: true,
                    label: 'screen',
                    next: 'decision',
                    nodeType: 'default'
                },
                decision: {
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: [null, null],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision',
                    next: 'screen',
                    nodeType: 'branch'
                }
            };

            expect(shouldDeleteGoToOnNext(flowModel, flowModel.decision, null)).toBeTruthy();
        });

        it('Returns true if GoTo is present on next and the persisted branch is empty', () => {
            const flowModel = {
                screen: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen',
                    incomingGoTo: ['decision'],
                    isCanvasElement: true,
                    label: 'screen',
                    next: 'decision',
                    nodeType: 'default'
                },
                decision: {
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: [null, null],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision',
                    next: 'screen',
                    nodeType: 'branch'
                }
            };

            expect(shouldDeleteGoToOnNext(flowModel, flowModel.decision, 0)).toBeTruthy();
        });

        it('Returns true if GoTo is present on next and the persisted branch is terminated', () => {
            const flowModel = {
                screen: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen',
                    incomingGoTo: ['decision'],
                    isCanvasElement: true,
                    label: 'screen',
                    next: 'decision',
                    nodeType: 'default'
                },
                decision: {
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ],
                    children: ['end', null, null],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision',
                    next: 'screen',
                    nodeType: 'branch'
                },
                end: {
                    guid: 'end',
                    nodeType: 'end',
                    parent: 'decision',
                    childIndex: 0,
                    isTerminal: true
                }
            };

            expect(shouldDeleteGoToOnNext(flowModel, flowModel.decision, 0)).toBeTruthy();
        });

        it('Returns false if GoTo is present on next and the persisted branch is not terminated', () => {
            const flowModel = {
                screen: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen',
                    incomingGoTo: ['decision'],
                    isCanvasElement: true,
                    label: 'screen',
                    next: 'decision',
                    nodeType: 'default'
                },
                decision: {
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ],
                    children: ['branchHeadScreen', null, null],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision',
                    next: 'screen',
                    nodeType: 'branch'
                },
                branchHeadScreen: {
                    guid: 'branchHeadScreen',
                    elementType: 'Screen',
                    nodeType: 'default',
                    parent: 'decision',
                    childIndex: 0,
                    isTerminal: false,
                    config: {},
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'branchHeadScreen',
                    next: null
                }
            };

            expect(shouldDeleteGoToOnNext(flowModel, flowModel.decision, 0)).toBeFalsy();
        });

        it('Returns true if GoTo is present on next and GoTo target is on the branch being deleted', () => {
            const flowModel = {
                screen1: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen1',
                    incomingGoTo: ['decision'],
                    isCanvasElement: true,
                    label: 'screen1',
                    next: 'screen2',
                    nodeType: 'default',
                    isTerminal: false
                },
                screen2: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen2',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen2',
                    prev: 'screen1',
                    nodeType: 'default',
                    next: 'decision'
                },
                decision: {
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: ['screen1', null],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision',
                    next: 'screen1',
                    nodeType: 'branch'
                }
            };

            expect(shouldDeleteGoToOnNext(flowModel, flowModel.decision, 1)).toBeTruthy();
        });

        it('Returns true if GoTo is present on next and GoTo target is the element being deleted', () => {
            const flowModel = {
                screen1: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen1',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen1',
                    nodeType: 'default',
                    parent: 'decision',
                    childIndex: 0,
                    next: null,
                    isTerminal: false
                },
                screen2: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen2',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen2',
                    nodeType: 'default',
                    parent: 'decision',
                    childIndex: 1,
                    next: null,
                    isTerminal: false
                },
                decision: {
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: ['screen1', 'screen2'],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision',
                    incomingGoTo: ['decision'],
                    isCanvasElement: true,
                    label: 'decision',
                    next: 'decision',
                    nodeType: 'branch'
                }
            };

            expect(shouldDeleteGoToOnNext(flowModel, flowModel.decision, 1)).toBeTruthy();
        });

        it('Returns true if GoTo present on next and GoTo target is on a nested branch of the branch being deleted', () => {
            const flowModel = {
                screen1: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen1',
                    incomingGoTo: ['decision1'],
                    isCanvasElement: true,
                    label: 'screen1',
                    nodeType: 'default',
                    parent: 'decision2',
                    childIndex: 1,
                    isTerminal: false
                },
                screen2: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen2',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen2',
                    nodeType: 'default',
                    prev: 'screen1'
                },
                decision1: {
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: [null, 'decision2'],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision1',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision1',
                    next: 'screen1',
                    nodeType: 'branch'
                },
                decision2: {
                    childReferences: [
                        {
                            childReference: 'o2'
                        }
                    ],
                    children: [null, 'screen1'],
                    childIndex: 1,
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision2',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision2',
                    parent: 'decision1',
                    nodeType: 'branch',
                    isTerminal: false
                }
            };

            expect(shouldDeleteGoToOnNext(flowModel, flowModel.decision1, 0)).toBeTruthy();
        });

        it('Returns true if GoTo present on next and GoTo target is on a fault branch of the branch being deleted', () => {
            const flowModel = {
                screen: {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen',
                    incomingGoTo: ['decision'],
                    isCanvasElement: true,
                    label: 'screen',
                    nodeType: 'default',
                    parent: 'getRecord',
                    childIndex: -1,
                    isTerminal: true
                },
                getRecord: {
                    config: {},
                    elementType: 'RecordQuery',
                    guid: 'getRecord',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'getRecord',
                    nodeType: 'default',
                    parent: 'decision',
                    childIndex: 1,
                    fault: 'screen',
                    next: null,
                    prev: null
                },
                decision: {
                    childReferences: [
                        {
                            childReference: 'o1'
                        }
                    ],
                    children: [null, 'getRecord'],
                    config: {},
                    elementType: 'Decision',
                    guid: 'decision',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision',
                    nodeType: 'branch',
                    next: 'screen'
                }
            };

            expect(shouldDeleteGoToOnNext(flowModel, flowModel.decision, 0)).toBeTruthy();
        });
    });

    describe('addFault', () => {
        it('adds a fault to an element', () => {
            const faultingElement = {
                guid: 'faulting-element-guid'
            };

            const elements = {
                [faultingElement.guid]: faultingElement
            };

            const flowModel = addFault(elementService(elements), elements, faultingElement.guid);
            expect(flowModel).toMatchSnapshot();
        });
    });

    describe('deleteFault', () => {
        it('deletes the fault of an element', () => {
            const faultElement = {
                guid: 'fault-element-guid'
            };

            const element = {
                guid: 'element-guid',
                fault: faultElement.guid
            };

            const elements = {
                [element.guid]: element,
                [faultElement.guid]: faultElement
            };

            deleteFault(elementService(elements), elements, element.guid);

            const elementWithoutFault = {
                guid: element.guid
            };

            expect(element).toEqual(elementWithoutFault);
            expect(elements).toEqual({ [elementWithoutFault.guid]: elementWithoutFault });
        });

        it('deletes the fault of an element and removes the outgoing GoTo connector on the branch head', () => {
            const screen = {
                guid: 'screen1',
                incomingGoTo: ['element-with-fault-guid:fault'],
                next: 'element-with-fault-guid:fault'
            };

            const elementWithFault = {
                guid: 'element-with-fault-guid',
                fault: 'screen1',
                prev: 'screen1'
            };

            let elements = {
                [screen.guid]: screen,
                [elementWithFault.guid]: elementWithFault
            };

            elements = deleteFault(elementService(elements), elements, elementWithFault.guid);
            const expectedElements = {
                screen1: {
                    guid: 'screen1',
                    incomingGoTo: [],
                    next: 'element-with-fault-guid:fault'
                },
                'element-with-fault-guid': {
                    guid: 'element-with-fault-guid',
                    prev: 'screen1'
                }
            };
            expect(elements).toEqual(expectedElements);
        });

        it('deletes the fault of an element and removes any incoming/outgoing GoTo connections within the Fault branch', () => {
            const screenOne = {
                guid: 'screen1',
                incomingGoTo: ['screen3'],
                next: 'element-with-fault-guid:fault'
            };

            const elementWithFault = {
                guid: 'element-with-fault-guid',
                fault: 'screen3',
                prev: 'screen1',
                next: 'screen2',
                incomingGoTo: []
            };

            const screenTwo = {
                guid: 'screen2',
                incomingGoTo: [],
                next: 'screen3'
            };

            const screenThree = {
                guid: 'screen3',
                incomingGoTo: ['screen2'],
                next: 'screen1'
            };

            let elements = {
                [screenOne.guid]: screenOne,
                [elementWithFault.guid]: elementWithFault,
                [screenTwo.guid]: screenTwo,
                [screenThree.guid]: screenThree
            };

            elements = deleteFault(elementService(elements), elements, elementWithFault.guid);
            const expectedElements = {
                screen1: {
                    guid: 'screen1',
                    incomingGoTo: [],
                    next: 'element-with-fault-guid:fault'
                },
                'element-with-fault-guid': {
                    guid: 'element-with-fault-guid',
                    prev: 'screen1',
                    incomingGoTo: [],
                    next: 'screen2'
                },
                screen2: {
                    guid: 'screen2',
                    incomingGoTo: [],
                    next: 'end-hook-guid'
                },
                'end-hook-guid': {
                    guid: 'end-hook-guid',
                    nodeType: 'end',
                    prev: 'screen2'
                }
            };
            expect(elements).toEqual(expectedElements);
        });
    });

    describe('deleteBranch', () => {
        it('deletes all the elements in the branch', () => {
            const elements = {
                decision1: {
                    guid: 'decision1',
                    next: 'screen2',
                    children: ['screen1', null]
                },
                screen1: {
                    guid: 'screen1',
                    parent: 'decision1',
                    childIndex: 0
                },
                screen2: {
                    guid: 'screen2',
                    prev: 'decision1'
                }
            };

            deleteBranch(elementService(elements), elements, 'decision1');
            expect(elements.decision1).toBeUndefined();
            expect(elements.screen1).toBeUndefined();
            expect(elements.screen2).toBeUndefined();
        });
    });

    describe('updateChildren', () => {
        let flow;

        beforeEach(() => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [
                ['head1-guid', END_ELEMENT_GUID],
                ['head2-guid', 'random-guid'],
                ['head3-guid']
            ];
            branchingElement.childReferences = [
                {
                    childReference: 'o1'
                },
                {
                    childReference: 'o2'
                }
            ];
            flow = createFlow([branchingElement]);
        });

        it('inlines from to branch, when removing a branch from a nested branch results in a terminal branch', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [
                [{ ...END_ELEMENT, guid: 'end1', isTerminal: true }],
                ['random-guid'],
                [{ ...END_ELEMENT, guid: 'end2', isTerminal: true }]
            ];
            branchingElement.childReferences = [{ childReference: 'o1' }, { childReference: 'o2' }];

            const topBranchingElement = { ...BRANCH_ELEMENT, guid: 'top-branching' };
            topBranchingElement.children = [[branchingElement], null];
            const topBranchingNext = { ...END_ELEMENT, guid: 'end3' };

            flow = createFlow([topBranchingElement, topBranchingNext]);

            const nextFlow = updateChildren(elementService(flow), flow, 'top-branching:0-branch-guid', [
                { childReference: 'o1' }
            ]);

            expect(nextFlow).toMatchSnapshot();
        });

        it('when all branches terminals after the update, delete the parent next and descendants', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [
                ['head1-guid', { ...END_ELEMENT, guid: 'end1' }],
                ['head2-guid', 'random-guid'],
                ['head3-guid', { ...END_ELEMENT, guid: 'end2' }]
            ];
            branchingElement.childReferences = [{ childReference: 'o1' }, { childReference: 'o2' }];
            flow = createFlow([branchingElement, { ...SCREEN_ELEMENT }, { ...SCREEN_ELEMENT, guid: 'screen2-guid' }]);
            const nextFlow = updateChildren(elementService(flow), flow, branchingElement.guid, [
                { childReference: 'o1' }
            ]);

            expect(nextFlow).toMatchSnapshot();
        });

        it('when parent has all terminals, creates end nodes for new branches', () => {
            const branchingElement = { ...BRANCH_ELEMENT, next: null };
            branchingElement.children = [[{ ...END_ELEMENT, guid: 'end1' }], [{ ...END_ELEMENT, guid: 'end2' }]];
            branchingElement.childReferences = [{ childReference: 'o1' }];
            flow = createFlow([branchingElement], false);
            const nextFlow = updateChildren(elementService(flow), flow, branchingElement.guid, [
                { childReference: 'o1' },
                { childReference: 'o2' }
            ]);

            expect(nextFlow).toMatchSnapshot();
        });

        it('handles new empty branch in left-most position', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                {
                    childReference: 'o3'
                },
                {
                    childReference: 'o1'
                },
                {
                    childReference: 'o2'
                }
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('deletes branch elements when removing a child', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                { childReference: 'o1' }
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('reorders the children', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                {
                    childReference: 'o2'
                },
                {
                    childReference: 'o1'
                }
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('reorders, removes and adds child', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                { childReference: 'o3' },
                { childReference: 'o1' }
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('reorders the children of parent with null children', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [['head1-guid', END_ELEMENT_GUID], null, ['head3-guid']];
            branchingElement.childReferences = [
                {
                    childReference: 'o1'
                },
                {
                    childReference: 'o2'
                }
            ];
            const elements = createFlow([branchingElement]);
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                {
                    childReference: 'o2'
                },
                {
                    childReference: 'o1'
                }
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('Reorders and deletes a branch with a GoTo on the branch head', () => {
            const flowWithGoTo = getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, false, false);
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                BRANCH_ELEMENT_GUID,
                [{ childReference: 'o2' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deletes a branch with an outgoing/incoming GoTo connector', () => {
            const flowWithGoTo = getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, false, false);
            flowWithGoTo.flowModel['screen-two'] = {
                guid: 'screen-two',
                label: 'screen-two',
                elementType: 'Screen',
                nodeType: NodeType.DEFAULT,
                isCanvasElement: true,
                config: {},
                incomingGoTo: [BRANCH_ELEMENT_GUID],
                parent: BRANCH_ELEMENT_GUID,
                childIndex: 0,
                isTerminal: true,
                next: SCREEN_ELEMENT_GUID
            };
            flowWithGoTo.flowModel[BRANCH_ELEMENT_GUID].children = ['screen-two', null, null];
            flowWithGoTo.flowModel[SCREEN_ELEMENT_GUID].incomingGoTo = ['screen-two'];
            flowWithGoTo.flowModel[BRANCH_ELEMENT_GUID].next = 'screen-two';
            delete flowWithGoTo.flowModel['end-guid'];
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                BRANCH_ELEMENT_GUID,
                [{ childReference: 'o2' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Adding and reordering branches when GoTo is present on a branch head', () => {
            const flowWithGoTo = getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, false, false);
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                BRANCH_ELEMENT_GUID,
                [{ childReference: 'o3' }, { childReference: 'o2' }, { childReference: 'o1' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deleting all outcomes that merge into a merge point with a GoTo connection', () => {
            const flowWithGoTo = getFlowWithGoToOnTheMergePoint();
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                BRANCH_ELEMENT_GUID,
                [{ childReference: 'o1' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deleting all outcomes that merge into a merge point with a GoTo further down', () => {
            const flowWithGoTo = getFlowWithGoToOnTheMergePoint();
            flowWithGoTo.flowModel['screen-two'] = {
                guid: 'screen-two',
                label: 'screen-two',
                elementType: 'Screen',
                nodeType: NodeType.DEFAULT,
                isCanvasElement: true,
                config: {},
                incomingGoTo: [],
                prev: BRANCH_ELEMENT_GUID,
                next: SCREEN_ELEMENT_GUID
            };
            flowWithGoTo.flowModel[BRANCH_ELEMENT_GUID].next = 'screen-two';
            flowWithGoTo.flowModel[SCREEN_ELEMENT_GUID].incomingGoTo = [`${BRANCH_ELEMENT_GUID}:o1`, 'screen-two'];
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                BRANCH_ELEMENT_GUID,
                [{ childReference: 'o1' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Adding a branch and avoiding a self-loop', () => {
            const flowWithGoTo = getFlowWhenGoingFromMergePointToParent();
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                'decision1-guid',
                [{ childReference: 'o1' }, { childReference: 'o2' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Adding a branch on a nested branching element and avoiding a self-loop', () => {
            const flowWithGoTo = getFlowWithGoToFromAncestorToNestedElement();
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                'decision2-guid',
                [{ childReference: 'o2' }, { childReference: 'o3' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deleting a branch that has an incomingGoTo from a sibling branch and there is no merge point', () => {
            const flowWithGoTo = getFlowWhenGoingFromSiblingBranch();
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                'decision1-guid',
                [{ childReference: 'o2' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deleting a branch that has an incomingGoTo from a sibling branch and there is also a GoTo from the merge point', () => {
            const flowWithGoTo = getFlowWhenGoingFromSiblingBranch();
            flowWithGoTo.flowModel['decision1-guid'] = {
                ...flowWithGoTo.flowModel['decision1-guid'],
                next: 'screen1-guid',
                children: ['screen1-guid', null, 'screen1-guid'],
                isTerminal: false
            };
            flowWithGoTo.flowModel['screen1-guid'] = {
                ...flowWithGoTo.flowModel['screen1-guid'],
                next: 'screen2-guid',
                incomingGoTo: ['decision1-guid:default', 'decision1-guid']
            };
            flowWithGoTo.flowModel['screen2-guid'] = {
                guid: 'screen2-guid',
                label: 'screen2-guid',
                elementType: 'Screen',
                nodeType: NodeType.DEFAULT,
                isCanvasElement: true,
                config: {},
                incomingGoTo: [],
                next: null
            };
            delete flowWithGoTo.flowModel['end1-guid'];
            delete flowWithGoTo.flowModel['end2-guid'];
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                'decision1-guid',
                [{ childReference: 'o2' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deleting multiple branches that are going to the same element from the branch head', () => {
            const flowWithGoTo = getFlowWhenGoingFromParentFirstBranchToPreviousElement(false, false, false);
            flowWithGoTo.flowModel[SCREEN_ELEMENT_GUID] = {
                ...flowWithGoTo.flowModel[SCREEN_ELEMENT_GUID],
                incomingGoTo: ['branch-guid:o1', 'branch-guid:o2', 'branch-guid:default']
            };
            flowWithGoTo.flowModel[BRANCH_ELEMENT_GUID] = {
                ...flowWithGoTo.flowModel[BRANCH_ELEMENT_GUID],
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
                children: [SCREEN_ELEMENT_GUID, SCREEN_ELEMENT_GUID, END_ELEMENT_GUID, SCREEN_ELEMENT_GUID],
                next: null
            };
            flowWithGoTo.flowModel[END_ELEMENT_GUID] = {
                ...flowWithGoTo.flowModel[END_ELEMENT_GUID],
                prev: null,
                parent: BRANCH_ELEMENT_GUID,
                childIndex: 2,
                isTerminal: true,
                next: null
            };
            const nextFlow = updateChildren(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                BRANCH_ELEMENT_GUID,
                [{ childReference: 'o3' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });
    });

    describe('updateChildrenOnAddingOrUpdatingScheduledPaths', () => {
        let flow;

        it('adding a new scheduledPath to start element', () => {
            flow = createFlow([
                { ...SCREEN_ELEMENT, guid: 'screen1-guid' },
                { ...SCREEN_ELEMENT, guid: 'screen2-guid' }
            ]);

            flow['child-reference-guid-1'] = {
                elementType: 'ScheduledPath',
                label: 't1',
                guid: 'child-reference-guid-1',
                name: 't1',
                offSetNumber: '1',
                offSetUnit: 'DaysAfter',
                timeSource: 'RecordTriggerEvent'
            };
            const nextFlow = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flow),
                flow,
                START_ELEMENT_GUID,
                [{ childReference: 'child-reference-guid-1' }]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting a scheduledPath', () => {
            flow = createFlow([
                { ...SCREEN_ELEMENT, guid: 'screen1-guid' },
                { ...SCREEN_ELEMENT, guid: 'screen2-guid' }
            ]);
            const flowWithChildren = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flow),
                flow,
                START_ELEMENT_GUID,
                [{ childReference: 'child-reference-guid-1' }, { childReference: 'child-reference-guid-2' }]
            );
            const nextFlow = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flowWithChildren),
                flowWithChildren,
                START_ELEMENT_GUID,
                []
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting all pre-existing scheduledPaths: default branch is non-terminal', () => {
            flow = getFlowWithNonTerminalImmediateBranch();
            const nextFlow = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flow),
                flow,
                START_ELEMENT_GUID,
                []
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting all pre-existing scheduledPaths: default branch is terminal', () => {
            flow = getFlowWithTerminalImmediateBranch();
            const nextFlow = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flow),
                flow,
                START_ELEMENT_GUID,
                []
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting all pre-existing scheduledPaths: default branch has branching node', () => {
            flow = getFlowWithBranchNodeInImmediateBranch();
            const nextFlow = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flow),
                flow,
                START_ELEMENT_GUID,
                []
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deleting all scheduled paths when there is a GoTo from Immediate branch to a scheduled path branch with no merge point', () => {
            const flowWithGoTo = getFlowWhenGoingFromImmediateToScheduledPathBranch();
            const nextFlow = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                START_ELEMENT_GUID,
                []
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deleting all scheduled paths when there is a GoTo from Scheduled Path branch to Immediate branch with a merge point', () => {
            const flowWithGoTo = getFlowWhenGoingFromScheduledPathToImmediateBranch();
            const nextFlow = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                START_ELEMENT_GUID,
                []
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deleting all scheduled paths when there is a GoTo from merge point to Immediate branch', () => {
            const flowWithGoTo = getFlowWhenGoingFromScheduledPathToImmediateBranch();
            flowWithGoTo.flowModel[START_ELEMENT_GUID] = {
                ...flowWithGoTo.flowModel[START_ELEMENT_GUID],
                next: 'screen1-guid'
            };
            flowWithGoTo.flowModel['screen1-guid'] = {
                ...flowWithGoTo.flowModel['screen1-guid'],
                incomingGoTo: ['start-guid:t2', 'start-guid']
            };
            delete flowWithGoTo.flowModel['end1-guid'];
            const nextFlow = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                START_ELEMENT_GUID,
                []
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('Deleting all scheduled paths with a GoTo on Immediate branch Head and further down the merge point', () => {
            const flowWithGoTo = getFlowWithGoToOnImmediateBranchHead();
            const nextFlow = updateChildrenOnAddingOrUpdatingScheduledPaths(
                elementService(flowWithGoTo.flowModel),
                flowWithGoTo.flowModel,
                START_ELEMENT_GUID,
                []
            );
            expect(nextFlow).toMatchSnapshot();
        });
    });
    describe('inlineFromParent', () => {
        describe('inline decision when next is goto', () => {
            describe('with nested branch (W-9361495)', () => {
                const originalStoreState = {
                    screen1: {
                        guid: 'screen1',
                        name: 'screen1',
                        next: 'decision'
                    },
                    decision: {
                        guid: 'decision',
                        name: 'decision',
                        children: ['nestedDecision', null],
                        next: 'end1',
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 't1'
                            }
                        ]
                    },
                    nestedDecision: {
                        guid: 'nestedDecision',
                        name: 'nestedDecision',
                        children: [null, 'end2'],
                        childIndex: 0,
                        parent: 'decision',
                        next: 'screen2',
                        isTerminal: false,
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 't1'
                            }
                        ]
                    },
                    screen2: {
                        guid: 'screen2',
                        name: 'screen2',
                        prev: 'nestedDecision'
                    },
                    end2: {
                        guid: 'end2',
                        name: 'end2',
                        parent: 'nestedDecision',
                        childIndex: 1,
                        isTerminal: true
                    },
                    end1: {
                        guid: 'end1',
                        name: 'end1',
                        prev: 'decision'
                    }
                };

                const updatedState = inlineFromParent(originalStoreState, originalStoreState.nestedDecision);

                it('inlines the nested branch correctly', () => {
                    expect(updatedState).toMatchSnapshot();
                });
            });
            describe('when the non-terminal branch is empty', () => {
                const originalStoreState = {
                    screen1: {
                        guid: 'screen1',
                        name: 'screen1',
                        next: 'newDecision',
                        incomingGoTo: ['newDecision']
                    },
                    newDecision: {
                        guid: 'newDecision',
                        name: 'newDecision',
                        children: ['end1', null],
                        next: 'screen1',
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 't1'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        name: 'end1',
                        childIndex: 0,
                        parent: 'newDecision',
                        isTerminal: true
                    }
                };

                const updatedState = inlineFromParent(originalStoreState, originalStoreState.newDecision);

                it('moves the goto to the second child of the decision ', () => {
                    expect(updatedState.newDecision.children).toEqual(['end1', 'screen1']);
                    expect(updatedState.screen1.incomingGoTo).toEqual(['newDecision:default']);
                });
            });
            describe('when the non-terminal branch is not-empty', () => {
                const originalStoreState = {
                    screen1: {
                        guid: 'screen1',
                        name: 'screen1',
                        next: 'newDecision',
                        incomingGoTo: ['newDecision']
                    },
                    newDecision: {
                        guid: 'newDecision',
                        name: 'newDecision',
                        children: ['end1', 'screen2'],
                        next: 'screen1',
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 't1'
                            }
                        ]
                    },
                    screen2: {
                        guid: 'screen2',
                        name: 'screen2',
                        parent: 'newDecision',
                        childIndex: 1
                    },
                    end1: {
                        guid: 'end1',
                        name: 'end1',
                        childIndex: 0,
                        parent: 'newDecision',
                        isTerminal: true
                    }
                };

                const updatedState = inlineFromParent(originalStoreState, originalStoreState.newDecision);

                it('moves the goto to the second child of the decision ', () => {
                    expect(updatedState.screen2.next).toEqual('screen1');
                    expect(updatedState.screen1.incomingGoTo).toEqual(['screen2']);
                });
            });
        });

        describe('inline decision with next end', () => {
            const originalStoreState = {
                newDecision: {
                    guid: 'newDecision',
                    name: 'newDecision',
                    children: ['end1', null],
                    next: 'screen1',
                    isTerminal: true
                },
                end1: {
                    guid: 'end1',
                    name: 'end1',
                    childIndex: 0,
                    parent: 'newDecision',
                    isTerminal: true
                },
                screen1: {
                    guid: 'screen1',
                    name: 'screen1',
                    prev: 'newDecision',
                    next: 'end2'
                },
                end2: {
                    guid: 'end2',
                    name: 'end2',
                    nodeType: NodeType.END,
                    prev: 'screen1'
                }
            };

            const updatedState = inlineFromParent(originalStoreState, originalStoreState.newDecision);

            it('end2 should be moved to the second branch', () => {
                expect(updatedState.newDecision.children).toMatchObject(['end1', 'screen1']);
            });
            it('newDecision should not have a next', () => {
                expect(updatedState.newDecision.next).toBeNull();
            });
            it('screen1 should have updated childIndex', () => {
                expect(updatedState.screen1.childIndex).toBe(1);
            });
            it('screen1 should have no prev', () => {
                expect(updatedState.screen1.prev).toBeNull();
            });
            it('screen1 should have isTerminal set to true', () => {
                expect(updatedState.screen1.isTerminal).toBeTruthy();
            });
        });

        describe('inline decision with next null in fault branch', () => {
            const originalStoreState = {
                newDecision: {
                    guid: 'newDecision',
                    name: 'newDecision',
                    children: ['end', null],
                    next: null,
                    parent: 'action1',
                    childIndex: -1
                },
                end: {
                    guid: 'end',
                    name: 'end',
                    childIndex: 0,
                    parent: 'newDecision',
                    isTerminal: true
                },
                action1: {
                    guid: 'action1',
                    name: 'action1',
                    next: 'end2',
                    fault: 'newDecision'
                },
                end2: {
                    guid: 'end2',
                    name: 'end2',
                    nodeType: NodeType.END,
                    prev: 'action1'
                }
            };
            const updatedState = inlineFromParent(originalStoreState, originalStoreState.newDecision);

            it('does not inline', () => {
                expect(updatedState).toEqual(originalStoreState);
            });
        });
    });
    describe('hasGoToOnNext function', () => {
        const flowModel = {
            branchElement: {
                guid: 'branchElement',
                children: ['screen1', 'screen2'],
                incomingGoTo: ['screen1']
            },
            screen1: {
                guid: 'screen1',
                next: 'branchElement',
                parent: 'branchElement',
                childIndex: 0,
                isTerminal: true,
                incomingGoTo: []
            },
            screen2: {
                guid: 'screen2',
                next: 'screen3',
                parent: 'branchElement',
                childIndex: 1,
                isTerminal: true,
                incomingGoTo: []
            },
            screen3: {
                guid: 'screen3',
                next: 'end',
                prev: 'screen2',
                incomingGoTo: []
            },
            end: {
                guid: 'end',
                prev: 'screen3'
            }
        };

        it('hasGoToOnNext should return true for screen1 as the source', () => {
            expect(hasGoToOnNext(flowModel, flowModel.screen1.guid)).toBeTruthy();
        });

        it('hasGoToOnNext should return false with screen2 as the source', () => {
            expect(hasGoToOnNext(flowModel, flowModel.screen2.guid)).toBeFalsy();
        });

        it('hasGoToOnNext should return false with screen3 as the source', () => {
            expect(hasGoToOnNext(flowModel, flowModel.screen3.guid)).toBeFalsy();
        });
    });

    describe('hasGoToOnBranchHead function', () => {
        const flowModel = {
            start: {
                guid: 'start',
                next: 'screen1',
                children: ['branchElement', null, null],
                nodeType: NodeType.START,
                childReferences: [
                    {
                        childReference: 't1'
                    },
                    {
                        childReference: 't2'
                    }
                ]
            },
            screen1: {
                guid: 'screen1',
                next: 'branchElement',
                incomingGoTo: ['branchElement:o1', 'branchElement:default', 'branchElement:fault']
            },
            branchElement: {
                guid: 'branchElement',
                prev: 'screen1',
                children: ['screen1', 'screen2', 'screen1'],
                fault: 'screen1',
                incomingGoTo: ['start:immediate'],
                nodeType: NodeType.BRANCH,
                childReferences: [
                    {
                        childReference: 'o1'
                    },
                    {
                        childReference: 'o2'
                    }
                ]
            },
            screen2: {
                guid: 'screen2',
                next: 'end2',
                parent: 'branchElement',
                childIndex: 1,
                isTerminal: true,
                incomingGoTo: []
            },
            end2: {
                guid: 'end2',
                prev: 'screen2'
            }
        };

        it('hasGoToOnBranchHead should return true for start element as the source and 0th index (immediate branch)', () => {
            expect(hasGoToOnBranchHead(flowModel, flowModel.start.guid, START_IMMEDIATE_INDEX)).toBeTruthy();
        });

        it('hasGoToOnBranchHead should return true for branchElement as the source and 0th index', () => {
            expect(hasGoToOnBranchHead(flowModel, flowModel.branchElement.guid, 0)).toBeTruthy();
        });

        it('hasGoToOnBranchHead should return false with screen2 as the source', () => {
            expect(hasGoToOnBranchHead(flowModel, flowModel.branchElement.guid, 1)).toBeFalsy();
        });

        it('hasGoToOnBranchHead should return true with screen3 as the source', () => {
            expect(hasGoToOnBranchHead(flowModel, flowModel.branchElement.guid, 2)).toBeTruthy();
        });

        it('hasGoToOnBranchHead should return true for branchElement as the source and fault index', () => {
            expect(hasGoToOnBranchHead(flowModel, flowModel.branchElement.guid, FAULT_INDEX)).toBeTruthy();
        });
    });

    describe('createGoToConnection function', () => {
        describe('branch ended or goto', () => {
            let flowModel = {};
            beforeEach(() => {
                flowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: ['startEnd', 't1End', null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    startEnd: {
                        guid: 'startEnd',
                        parent: 'start',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    t1End: {
                        guid: 't1End',
                        parent: 'start',
                        childIndex: 1,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: []
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', 'end3'],
                        fault: 'end4',
                        incomingGoTo: [],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        next: 'end2',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: true,
                        incomingGoTo: []
                    },
                    end2: {
                        guid: 'end2',
                        prev: 'screen2'
                    },
                    end3: {
                        guid: 'end3',
                        parent: 'branchElement',
                        childIndex: 2,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };
            });

            it('createGoToConnection with start (0th aka immediate branch) as the source and branchElement as the target should update the state correctly', () => {
                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: ['branchElement', 't1End', null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    t1End: {
                        guid: 't1End',
                        parent: 'start',
                        childIndex: 1,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: []
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', 'end3'],
                        fault: 'end4',
                        incomingGoTo: ['start:immediate'],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        next: 'end2',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: true,
                        incomingGoTo: []
                    },
                    end2: {
                        guid: 'end2',
                        prev: 'screen2'
                    },
                    end3: {
                        guid: 'end3',
                        parent: 'branchElement',
                        childIndex: 2,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };

                const source = { guid: 'start', childIndex: START_IMMEDIATE_INDEX };
                expect(
                    createGoToConnection(elementService(flowModel), flowModel, source, 'branchElement')
                ).toMatchObject(updatedFlowModel);
            });

            it('createGoToConnection with start (1st branch) as the source and branchElement as the target should update the state correctly', () => {
                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: ['startEnd', 'branchElement', null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    startEnd: {
                        guid: 'startEnd',
                        parent: 'start',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: []
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', 'end3'],
                        fault: 'end4',
                        incomingGoTo: ['start:t1'],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        next: 'end2',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: true,
                        incomingGoTo: []
                    },
                    end2: {
                        guid: 'end2',
                        prev: 'screen2'
                    },
                    end3: {
                        guid: 'end3',
                        parent: 'branchElement',
                        childIndex: 2,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };

                const source = { guid: 'start', childIndex: 1 };
                expect(
                    createGoToConnection(elementService(flowModel), flowModel, source, 'branchElement')
                ).toMatchObject(updatedFlowModel);
            });

            it('createGoToConnection with screen2 as the source and branchElement as the target should update the state correctly', () => {
                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: ['startEnd', 't1End', null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    startEnd: {
                        guid: 'startEnd',
                        parent: 'start',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    t1End: {
                        guid: 't1End',
                        parent: 'start',
                        childIndex: 1,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: []
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', 'end3'],
                        fault: 'end4',
                        incomingGoTo: ['screen2'],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        next: 'branchElement',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: true,
                        incomingGoTo: []
                    },
                    end3: {
                        guid: 'end3',
                        parent: 'branchElement',
                        childIndex: 2,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };

                const source = { guid: 'screen2' };
                expect(
                    createGoToConnection(elementService(flowModel), flowModel, source, 'branchElement')
                ).toMatchObject(updatedFlowModel);
            });

            it('createGoToConnection with branchElement (0th branch) as the source and screen1 as the target should update the state correctly', () => {
                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: ['startEnd', 't1End', null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    startEnd: {
                        guid: 'startEnd',
                        parent: 'start',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    t1End: {
                        guid: 't1End',
                        parent: 'start',
                        childIndex: 1,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: ['branchElement:o1']
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['screen1', 'screen2', 'end3'],
                        fault: 'end4',
                        incomingGoTo: [],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    screen2: {
                        guid: 'screen2',
                        next: 'end2',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: true,
                        incomingGoTo: []
                    },
                    end2: {
                        guid: 'end2',
                        prev: 'screen2'
                    },
                    end3: {
                        guid: 'end3',
                        parent: 'branchElement',
                        childIndex: 2,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };

                const source = { guid: 'branchElement', childIndex: 0 };
                expect(createGoToConnection(elementService(flowModel), flowModel, source, 'screen1')).toMatchObject(
                    updatedFlowModel
                );
            });

            it('createGoToConnection with branchElement (default branch) as the source and screen1 as the target should update the state correctly', () => {
                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: ['startEnd', 't1End', null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    startEnd: {
                        guid: 'startEnd',
                        parent: 'start',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    t1End: {
                        guid: 't1End',
                        parent: 'start',
                        childIndex: 1,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: ['branchElement:default']
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', 'screen1'],
                        fault: 'end4',
                        incomingGoTo: [],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        next: 'end2',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: true,
                        incomingGoTo: []
                    },
                    end2: {
                        guid: 'end2',
                        prev: 'screen2'
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };

                const source = { guid: 'branchElement', childIndex: 2 };
                expect(createGoToConnection(elementService(flowModel), flowModel, source, 'screen1')).toMatchObject(
                    updatedFlowModel
                );
            });

            it('createGoToConnection with branchElement (fault branch) as the source and screen1 as the target should update the state correctly', () => {
                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: ['startEnd', 't1End', null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    startEnd: {
                        guid: 'startEnd',
                        parent: 'start',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    t1End: {
                        guid: 't1End',
                        parent: 'start',
                        childIndex: 1,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: ['branchElement:fault']
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', 'end3'],
                        fault: 'screen1',
                        incomingGoTo: [],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        next: 'end2',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: true,
                        incomingGoTo: []
                    },
                    end2: {
                        guid: 'end2',
                        prev: 'screen2'
                    },
                    end3: {
                        guid: 'end3',
                        parent: 'branchElement',
                        childIndex: 2,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };

                const source = { guid: 'branchElement', childIndex: FAULT_INDEX };
                expect(createGoToConnection(elementService(flowModel), flowModel, source, 'screen1')).toMatchObject(
                    updatedFlowModel
                );
            });

            it('createGoToConnection with reroute where screen2 is the source and rerouting target from branchElement to screen1', () => {
                flowModel.screen2.next = 'branchElement';
                flowModel.branchElement.incomingGoTo = ['screen2'];

                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: ['startEnd', 't1End', null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    startEnd: {
                        guid: 'startEnd',
                        parent: 'start',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    t1End: {
                        guid: 't1End',
                        parent: 'start',
                        childIndex: 1,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: ['screen2']
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', 'end3'],
                        fault: 'end4',
                        incomingGoTo: [],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        next: 'screen1',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: true,
                        incomingGoTo: []
                    },
                    end3: {
                        guid: 'end3',
                        parent: 'branchElement',
                        childIndex: 2,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };

                const source = { guid: 'screen2' };
                expect(
                    createGoToConnection(elementService(flowModel), flowModel, source, 'screen1', true)
                ).toMatchObject(updatedFlowModel);
            });
        });
        describe('branch not ended', () => {
            let flowModel = {};
            beforeEach(() => {
                flowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: [null, null, null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: []
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', null],
                        fault: 'end4',
                        incomingGoTo: [],
                        next: 'end2',
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: false,
                        incomingGoTo: []
                    },
                    end2: {
                        guid: 'end2',
                        prev: 'branchElement'
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };
            });
            it('createGoToConnection with start (0th aka immediate branch) as the source and branchElement as the target should update the state correctly', () => {
                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: ['branchElement', null, null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: []
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', null],
                        fault: 'end4',
                        incomingGoTo: ['start:immediate'],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: false,
                        incomingGoTo: []
                    },
                    end2: {
                        guid: 'end2',
                        prev: 'branchElement'
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };

                const source = { guid: 'start', childIndex: START_IMMEDIATE_INDEX };
                expect(
                    createGoToConnection(elementService(flowModel), flowModel, source, 'branchElement', undefined)
                ).toMatchObject(updatedFlowModel);
            });

            it('createGoToConnection with start (1st branch) as the source and branchElement as the target should update the state correctly', () => {
                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: [null, 'branchElement', null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: []
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', null],
                        fault: 'end4',
                        incomingGoTo: ['start:t1'],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: false,
                        incomingGoTo: []
                    },
                    end2: {
                        guid: 'end2',
                        prev: 'branchElement'
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    }
                };

                const source = { guid: 'start', childIndex: 1 };
                expect(
                    createGoToConnection(elementService(flowModel), flowModel, source, 'branchElement', undefined)
                ).toMatchObject(updatedFlowModel);
            });

            it('createGoToConnection with screen2 as the source and branchElement as the target should update the state correctly', () => {
                const updatedFlowModel = {
                    start: {
                        guid: 'start',
                        next: 'screen1',
                        children: [null, null, null, null],
                        nodeType: NodeType.START,
                        childReferences: [
                            {
                                childReference: 't1'
                            },
                            {
                                childReference: 't2'
                            },
                            {
                                childReference: 't3'
                            }
                        ]
                    },
                    screen1: {
                        guid: 'screen1',
                        next: 'branchElement',
                        incomingGoTo: []
                    },
                    branchElement: {
                        guid: 'branchElement',
                        prev: 'screen1',
                        children: ['end1', 'screen2', 'end2'],
                        fault: 'end4',
                        incomingGoTo: ['screen2'],
                        nodeType: NodeType.BRANCH,
                        childReferences: [
                            {
                                childReference: 'o1'
                            },
                            {
                                childReference: 'o2'
                            }
                        ]
                    },
                    end1: {
                        guid: 'end1',
                        parent: 'branchElement',
                        childIndex: 0,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    screen2: {
                        guid: 'screen2',
                        next: 'branchElement',
                        parent: 'branchElement',
                        childIndex: 1,
                        isTerminal: true,
                        incomingGoTo: []
                    },
                    end4: {
                        guid: 'end4',
                        parent: 'branchElement',
                        childIndex: FAULT_INDEX,
                        isTerminal: true,
                        prev: null,
                        next: null
                    },
                    end2: {
                        guid: 'end2',
                        childIndex: 2,
                        parent: 'branchElement'
                    }
                };

                const source = { guid: 'screen2' };
                expect(
                    createGoToConnection(elementService(flowModel), flowModel, source, 'branchElement', undefined)
                ).toMatchObject(updatedFlowModel);
            });
        });
    });

    describe('deleteGoToConnection function', () => {
        let flowModel = {};
        beforeEach(() => {
            flowModel = {
                start: {
                    guid: 'start',
                    next: 'screen1',
                    children: ['branchElement', 'startEnd', null, null],
                    nodeType: NodeType.START,
                    childReferences: [
                        {
                            childReference: 't1'
                        },
                        {
                            childReference: 't2'
                        },
                        {
                            childReference: 't3'
                        }
                    ]
                },
                startEnd: {
                    guid: 'startEnd',
                    parent: 'start',
                    childIndex: 1,
                    isTerminal: true,
                    prev: null,
                    next: null,
                    incomingGoTo: ['start:t1']
                },
                screen1: {
                    guid: 'screen1',
                    next: 'branchElement',
                    prev: 'start',
                    incomingGoTo: ['branchElement:o1', 'branchElement:default', 'branchElement:fault']
                },
                branchElement: {
                    guid: 'branchElement',
                    prev: 'screen1',
                    children: ['screen1', 'screen2', 'screen1'],
                    fault: 'screen1',
                    incomingGoTo: ['start:immediate', 'screen2'],
                    nodeType: NodeType.BRANCH,
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                screen2: {
                    guid: 'screen2',
                    next: 'branchElement',
                    parent: 'branchElement',
                    childIndex: 1,
                    isTerminal: true,
                    incomingGoTo: []
                }
            };
        });

        it('deleteGoToConncetion with start (0th aka immediate branch) as the source and branchElement as the target should update the state correctly', () => {
            const flowModelAfterDeletion = deleteGoToConnection(elementService(flowModel), flowModel, {
                guid: 'start',
                childIndex: START_IMMEDIATE_INDEX
            });
            const expectedFlowModel = {
                start: {
                    guid: 'start',
                    next: 'screen1',
                    children: ['end-hook-guid', 'startEnd', null, null],
                    nodeType: NodeType.START,
                    childReferences: [
                        {
                            childReference: 't1'
                        },
                        {
                            childReference: 't2'
                        },
                        {
                            childReference: 't3'
                        }
                    ]
                },
                startEnd: {
                    guid: 'startEnd',
                    parent: 'start',
                    childIndex: 1,
                    isTerminal: true,
                    prev: null,
                    next: null,
                    incomingGoTo: ['start:t1']
                },
                screen1: {
                    guid: 'screen1',
                    next: 'branchElement',
                    prev: 'start',
                    incomingGoTo: ['branchElement:o1', 'branchElement:default', 'branchElement:fault']
                },
                branchElement: {
                    guid: 'branchElement',
                    prev: 'screen1',
                    children: ['screen1', 'screen2', 'screen1'],
                    fault: 'screen1',
                    incomingGoTo: ['screen2'],
                    nodeType: NodeType.BRANCH,
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                screen2: {
                    guid: 'screen2',
                    next: 'branchElement',
                    parent: 'branchElement',
                    childIndex: 1,
                    isTerminal: true,
                    incomingGoTo: []
                },
                'end-hook-guid': {
                    childIndex: 0,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: NodeType.END,
                    parent: 'start'
                }
            };
            expect(flowModelAfterDeletion).toMatchObject(expectedFlowModel);
        });

        it('deleteGoToConncetion with screen2 as the source and branchElement as the target should update the state correctly', () => {
            const flowModelAfterDeletion = deleteGoToConnection(elementService(flowModel), flowModel, {
                guid: 'screen2'
            });
            const expectedFlowModel = {
                start: {
                    guid: 'start',
                    next: 'screen1',
                    children: ['branchElement', 'startEnd', null, null],
                    nodeType: NodeType.START,
                    childReferences: [
                        {
                            childReference: 't1'
                        },
                        {
                            childReference: 't2'
                        },
                        {
                            childReference: 't3'
                        }
                    ]
                },
                startEnd: {
                    guid: 'startEnd',
                    parent: 'start',
                    childIndex: 1,
                    isTerminal: true,
                    prev: null,
                    next: null,
                    incomingGoTo: ['start:t1']
                },
                screen1: {
                    guid: 'screen1',
                    next: 'branchElement',
                    prev: 'start',
                    incomingGoTo: ['branchElement:o1', 'branchElement:default', 'branchElement:fault']
                },
                branchElement: {
                    guid: 'branchElement',
                    prev: 'screen1',
                    children: ['screen1', 'screen2', 'screen1'],
                    fault: 'screen1',
                    incomingGoTo: ['start:immediate'],
                    nodeType: NodeType.BRANCH,
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                screen2: {
                    guid: 'screen2',
                    next: 'end-hook-guid',
                    parent: 'branchElement',
                    childIndex: 1,
                    isTerminal: true,
                    incomingGoTo: []
                },
                'end-hook-guid': {
                    guid: 'end-hook-guid',
                    nodeType: NodeType.END,
                    prev: 'screen2'
                }
            };
            expect(flowModelAfterDeletion).toEqual(expectedFlowModel);
        });

        it('deleteGoToConncetion with branchElement (0th branch) as the source and screen1 as the target should update the state correctly', () => {
            const flowModelAfterDeletion = deleteGoToConnection(elementService(flowModel), flowModel, {
                guid: 'branchElement',
                childIndex: 0
            });
            const expectedFlowModel = {
                start: {
                    guid: 'start',
                    next: 'screen1',
                    children: ['branchElement', 'startEnd', null, null],
                    nodeType: NodeType.START,
                    childReferences: [
                        {
                            childReference: 't1'
                        },
                        {
                            childReference: 't2'
                        },
                        {
                            childReference: 't3'
                        }
                    ]
                },
                startEnd: {
                    guid: 'startEnd',
                    parent: 'start',
                    childIndex: 1,
                    isTerminal: true,
                    prev: null,
                    next: null,
                    incomingGoTo: ['start:t1']
                },
                screen1: {
                    guid: 'screen1',
                    next: 'branchElement',
                    prev: 'start',
                    incomingGoTo: ['branchElement:default', 'branchElement:fault']
                },
                branchElement: {
                    guid: 'branchElement',
                    prev: 'screen1',
                    children: ['end-hook-guid', 'screen2', 'screen1'],
                    fault: 'screen1',
                    incomingGoTo: ['start:immediate', 'screen2'],
                    nodeType: NodeType.BRANCH,
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                screen2: {
                    guid: 'screen2',
                    next: 'branchElement',
                    parent: 'branchElement',
                    childIndex: 1,
                    isTerminal: true,
                    incomingGoTo: []
                },
                'end-hook-guid': {
                    childIndex: 0,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: NodeType.END,
                    parent: 'branchElement'
                }
            };
            expect(flowModelAfterDeletion).toEqual(expectedFlowModel);
        });

        it('deleteGoToConncetion with branchElement (default branch) as the source and screen1 as the target should update the state correctly', () => {
            const flowModelAfterDeletion = deleteGoToConnection(elementService(flowModel), flowModel, {
                guid: 'branchElement',
                childIndex: 2
            });
            const expectedFlowModel = {
                start: {
                    guid: 'start',
                    next: 'screen1',
                    children: ['branchElement', 'startEnd', null, null],
                    nodeType: NodeType.START,
                    childReferences: [
                        {
                            childReference: 't1'
                        },
                        {
                            childReference: 't2'
                        },
                        {
                            childReference: 't3'
                        }
                    ]
                },
                startEnd: {
                    guid: 'startEnd',
                    parent: 'start',
                    childIndex: 1,
                    isTerminal: true,
                    prev: null,
                    next: null,
                    incomingGoTo: ['start:t1']
                },
                screen1: {
                    guid: 'screen1',
                    next: 'branchElement',
                    prev: 'start',
                    incomingGoTo: ['branchElement:o1', 'branchElement:fault']
                },
                branchElement: {
                    guid: 'branchElement',
                    prev: 'screen1',
                    children: ['screen1', 'screen2', 'end-hook-guid'],
                    fault: 'screen1',
                    incomingGoTo: ['start:immediate', 'screen2'],
                    nodeType: NodeType.BRANCH,
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                screen2: {
                    guid: 'screen2',
                    next: 'branchElement',
                    parent: 'branchElement',
                    childIndex: 1,
                    isTerminal: true,
                    incomingGoTo: []
                },
                'end-hook-guid': {
                    childIndex: 2,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: NodeType.END,
                    parent: 'branchElement'
                }
            };
            expect(flowModelAfterDeletion).toEqual(expectedFlowModel);
        });

        it('deleteGoToConncetion with branchElement (fault branch) as the source and screen1 as the target should update the state correctly', () => {
            const flowModelAfterDeletion = deleteGoToConnection(elementService(flowModel), flowModel, {
                guid: 'branchElement',
                childIndex: FAULT_INDEX
            });
            const expectedFlowModel = {
                start: {
                    guid: 'start',
                    next: 'screen1',
                    children: ['branchElement', 'startEnd', null, null],
                    nodeType: NodeType.START,
                    childReferences: [
                        {
                            childReference: 't1'
                        },
                        {
                            childReference: 't2'
                        },
                        {
                            childReference: 't3'
                        }
                    ]
                },
                startEnd: {
                    guid: 'startEnd',
                    parent: 'start',
                    childIndex: 1,
                    isTerminal: true,
                    prev: null,
                    next: null,
                    incomingGoTo: ['start:t1']
                },
                screen1: {
                    guid: 'screen1',
                    next: 'branchElement',
                    prev: 'start',
                    incomingGoTo: ['branchElement:o1', 'branchElement:default']
                },
                branchElement: {
                    guid: 'branchElement',
                    prev: 'screen1',
                    children: ['screen1', 'screen2', 'screen1'],
                    fault: 'end-hook-guid',
                    incomingGoTo: ['start:immediate', 'screen2'],
                    nodeType: NodeType.BRANCH,
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                screen2: {
                    guid: 'screen2',
                    next: 'branchElement',
                    parent: 'branchElement',
                    childIndex: 1,
                    isTerminal: true,
                    incomingGoTo: []
                },
                'end-hook-guid': {
                    childIndex: -1,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: NodeType.END,
                    parent: 'branchElement'
                }
            };
            expect(flowModelAfterDeletion).toEqual(expectedFlowModel);
        });
    });

    describe('removeGoTosFromElement function', () => {
        let cutOrCopiedCanvasElements;
        beforeEach(() => {
            cutOrCopiedCanvasElements = {
                screen1: {
                    guid: 'screen1',
                    name: 'screen1',
                    childReferences: [],
                    next: 'branchElement',
                    prev: null,
                    incomingGoTo: ['screen2', 'branchElement:o1', 'branchElement:fault']
                },
                branchElement: {
                    guid: 'branchElement',
                    prev: 'screen1',
                    children: ['screen1', 'screen2', 'screen3'],
                    fault: 'screen1',
                    nodeType: NodeType.BRANCH,
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                screen2: {
                    guid: 'screen2',
                    name: 'screen2',
                    childReferences: [],
                    next: 'screen1',
                    prev: null,
                    childIndex: 1,
                    isTerminal: true,
                    parent: 'branchElement'
                }
            };
        });

        it('removing GoTos from from a copied elements next to another copied element', () => {
            const expectedPastedElement = {
                guid: 'screen2',
                name: 'screen2',
                childReferences: [],
                next: null,
                prev: null,
                childIndex: 1,
                isTerminal: true,
                parent: 'branchElement'
            };
            const pastedElement = removeGoTosFromElement(
                cutOrCopiedCanvasElements,
                JSON.parse(JSON.stringify(cutOrCopiedCanvasElements.screen2))
            );
            expect(pastedElement).toMatchObject(expectedPastedElement);
        });

        it('removing GoTos on branching elements (fault)branchhead to another copied element', () => {
            const expectedPastedElement = {
                guid: 'branchElement',
                prev: 'screen1',
                children: [null, 'screen2', 'screen3'],
                fault: null,
                nodeType: NodeType.BRANCH,
                childReferences: [
                    {
                        childReference: 'o1'
                    },
                    {
                        childReference: 'o2'
                    }
                ]
            };
            const pastedElement = removeGoTosFromElement(
                cutOrCopiedCanvasElements,
                JSON.parse(JSON.stringify(cutOrCopiedCanvasElements.branchElement))
            );
            expect(pastedElement).toMatchObject(expectedPastedElement);
        });
    });

    describe('areAllBranchesTerminals function', () => {
        const flowModel = {
            screen1: {
                guid: 'screen1',
                next: 'decision1',
                incomingGoTo: ['decision1:default', 'screen2']
            },
            decision1: {
                guid: 'decision1',
                prev: 'screen1',
                children: ['decision2', 'screen2', 'end3', 'screen1'],
                incomingGoTo: [],
                nodeType: NodeType.BRANCH,
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
                ]
            },
            decision2: {
                guid: 'decision2',
                prev: null,
                parent: 'decision1',
                childIndex: 0,
                children: ['end1', 'end2'],
                isTerminal: true,
                next: null,
                incomingGoTo: []
            },
            end1: {
                guid: 'end1',
                parent: 'decision2',
                childIndex: 0,
                isTerminal: true
            },
            end2: {
                guid: 'end2',
                parent: 'decision2',
                childIndex: 1,
                isTerminal: true
            },
            screen2: {
                guid: 'screen2',
                parent: 'decision1',
                childIndex: 1,
                isTerminal: true,
                next: 'screen1',
                incomingGoTo: []
            },
            end3: {
                guid: 'end3',
                parent: 'decision1',
                childIndex: 2,
                isTerminal: true
            }
        };

        it('areAllBranchesTerminals should return true for decision1', () => {
            expect(areAllBranchesTerminals(flowModel.decision1, flowModel)).toBeTruthy();
        });
    });

    describe('decorateElements', () => {
        it('updates the highlightInfo correctly on element configs', () => {
            const flowModel = {
                guid1: { config: {} },
                guid2: { config: {} },
                guid3: { config: {} }
            };
            const decoratedElements = new Map();
            decoratedElements.set('guid1', { highlightNext: true });
            decoratedElements.set('guid2', { branchIndexesToHighlight: [1] });

            const expectedNewFlowModel = {
                guid1: { config: { highlightInfo: { highlightNext: true } } },
                guid2: { config: { highlightInfo: { branchIndexesToHighlight: [1] } } },
                guid3: { config: {} }
            };

            const newFlowModel = decorateElements(flowModel, decoratedElements);
            expect(newFlowModel).toEqual(expectedNewFlowModel);
        });
    });

    describe('clearCanvasDecoration', () => {
        it('clears the highlightInfo correctly on element configs', () => {
            const flowModel = {
                guid1: { config: { highlightInfo: { highlightNext: true } } },
                guid2: { config: { highlightInfo: { branchIndexesToHighlight: [1] } } },
                guid3: { config: {} }
            };

            const expectedNewFlowModel = {
                guid1: { config: { highlightInfo: null } },
                guid2: { config: { highlightInfo: null } },
                guid3: { config: { highlightInfo: null } }
            };

            const newFlowModel = clearCanvasDecoration(flowModel);
            expect(newFlowModel).toEqual(expectedNewFlowModel);
        });
    });

    describe('getBranchIndexForGoToConnection', () => {
        it('Getting the branchIndex when having an incomingGoTo from the 0th index of a decision', () => {
            const flowRenderContext = getFlowWhenGoingFromParentFirstBranchToPreviousElement();
            const branchIndex = getBranchIndexForGoToConnection(flowRenderContext.flowModel, 'branch-guid', 'o1');
            expect(branchIndex).toEqual(0);
        });

        it('Getting the branchIndex when having an incomingGoTo from the 1st index of a decision', () => {
            const flowModel = {
                root: {
                    children: ['start-guid'],
                    elementType: 'root',
                    guid: 'root',
                    nodeType: 'root'
                },
                'start-guid': {
                    guid: 'start-guid',
                    next: 'screen1',
                    nodeType: NodeType.START,
                    config: {},
                    elementType: 'start',
                    isCanvasElement: true,
                    label: 'start-guid',
                    parent: 'root'
                },
                'screen-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen-guid',
                    incomingGoTo: ['branch-guid:o2'],
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'branch-guid',
                    nodeType: 'default',
                    prev: 'start-guid'
                },
                'branch-guid': {
                    childReferences: [{ childReference: 'o1' }, { childReference: 'o2' }],
                    children: [null, 'screen-guid', null],
                    config: {},
                    defaultConnectorLabel: 'Default Connector Label',
                    elementType: 'branch',
                    guid: 'branch-guid',
                    isCanvasElement: true,
                    label: 'branch-guid',
                    next: 'end-guid',
                    nodeType: 'branch',
                    prev: 'screen-guid'
                },
                'end-guid': {
                    elementType: 'END_ELEMENT',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    nodeType: 'end',
                    prev: 'branch-guid'
                }
            };
            const branchIndex = getBranchIndexForGoToConnection(flowModel, 'branch-guid', 'o2');
            expect(branchIndex).toEqual(1);
        });

        it('Getting the branchIndex when having an incomingGoTo from the default index of a decision', () => {
            const flowRenderContext = getFlowWhenGoingFromParentDefaultBranchToPreviousElement();
            const branchIndex = getBranchIndexForGoToConnection(flowRenderContext.flowModel, 'branch-guid', 'default');
            expect(branchIndex).toEqual(2);
        });

        it('Getting the branchIndex when having an incomingGoTo from the head of a fault', () => {
            const flowRenderContext = getFlowWhenGoingFromParentFaultBranchToPreviousElement();
            const branchIndex = getBranchIndexForGoToConnection(flowRenderContext.flowModel, 'branch-guid', 'fault');
            expect(branchIndex).toEqual(FAULT_INDEX);
        });

        it('Getting the branchIndex when having an incomingGoTo from the immediate branch of Start element', () => {
            const flowModel = {
                root: {
                    children: ['start-guid'],
                    elementType: 'root',
                    guid: 'root',
                    nodeType: 'root'
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [
                        {
                            childReference: 't1'
                        },
                        {
                            childReference: 't2'
                        }
                    ],
                    guid: 'start-guid',
                    next: 'end-guid',
                    nodeType: NodeType.START,
                    config: {},
                    elementType: 'start',
                    isCanvasElement: true,
                    label: 'start-guid',
                    parent: 'root',
                    children: ['assignment-guid', 'assignment-guid', null]
                },
                'assignment-guid': {
                    config: {},
                    elementType: 'Assignment',
                    guid: 'assignment-guid',
                    incomingGoTo: ['start-guid:immediate'],
                    isCanvasElement: true,
                    label: 'assignment-guid',
                    next: null,
                    nodeType: 'default',
                    prev: null,
                    parent: 'start-guid',
                    childIndex: 1,
                    isTerminal: false
                },
                'end-guid': {
                    elementType: 'END_ELEMENT',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    nodeType: 'end',
                    prev: 'start-guid'
                }
            };
            const branchIndex = getBranchIndexForGoToConnection(flowModel, 'start-guid', 'immediate');
            expect(branchIndex).toEqual(0);
        });

        it('Getting the branchIndex when having an incomingGoTo from the right most branch of Start element', () => {
            const flowModel = {
                root: {
                    children: ['start-guid'],
                    elementType: 'root',
                    guid: 'root',
                    nodeType: 'root'
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [
                        {
                            childReference: 't1'
                        },
                        {
                            childReference: 't2'
                        }
                    ],
                    guid: 'start-guid',
                    next: 'end-guid',
                    nodeType: NodeType.START,
                    config: {},
                    elementType: 'start',
                    isCanvasElement: true,
                    label: 'start-guid',
                    parent: 'root',
                    children: [null, 'assignment-guid', 'assignment-guid']
                },
                'assignment-guid': {
                    config: {},
                    elementType: 'Assignment',
                    guid: 'assignment-guid',
                    incomingGoTo: ['start-guid:t2'],
                    isCanvasElement: true,
                    label: 'assignment-guid',
                    next: null,
                    nodeType: 'default',
                    prev: null,
                    parent: 'start-guid',
                    childIndex: 1,
                    isTerminal: false
                },
                'end-guid': {
                    elementType: 'END_ELEMENT',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    nodeType: 'end',
                    prev: 'start-guid'
                }
            };
            const branchIndex = getBranchIndexForGoToConnection(flowModel, 'start-guid', 't2');
            expect(branchIndex).toEqual(2);
        });

        it('Getting the branchIndex when having an incomingGoTo from the For_Each branch head of a Loop Element', () => {
            const flowRenderContext = getFlowWhenGoingFromForEachBranch();
            const branchIndex = getBranchIndexForGoToConnection(flowRenderContext.flowModel, 'loop-guid', 'forEach');
            expect(branchIndex).toEqual(FOR_EACH_INDEX);
        });
    });

    describe('cleanUpIncomingGoTos', () => {
        it('Removing incomingGoTo from first branch in previous element', () => {
            const flowRenderContext = getFlowWhenGoingFromParentFirstBranchToPreviousElement();
            const expectedFlowModel = {
                'branch-guid': {
                    childReferences: [{ childReference: 'o1' }, { childReference: 'o2' }],
                    children: ['end-hook-guid', null, null],
                    config: {},
                    defaultConnectorLabel: 'Default Connector Label',
                    elementType: 'branch',
                    guid: 'branch-guid',
                    isCanvasElement: true,
                    label: 'branch-guid',
                    next: 'end-guid',
                    nodeType: 'branch',
                    prev: 'screen-guid'
                },
                'end-guid': {
                    elementType: 'END_ELEMENT',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    nodeType: 'end',
                    prev: 'branch-guid'
                },
                'end-hook-guid': {
                    childIndex: 0,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: 'end',
                    parent: 'branch-guid'
                },
                root: {
                    children: ['start-guid'],
                    elementType: 'root',
                    guid: 'root',
                    nodeType: 'root'
                },
                'screen-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'branch-guid',
                    nodeType: 'default',
                    prev: 'start-guid'
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'screen-guid',
                    nodeType: 'start',
                    parent: 'root'
                }
            };
            const newFlowModel = cleanUpIncomingGoTos(
                elementService(flowRenderContext.flowModel),
                flowRenderContext.flowModel,
                flowRenderContext.flowModel['screen-guid']
            );
            expect(newFlowModel).toEqual(expectedFlowModel);
        });

        it('Removing incomingGoTo from default branch in previous element', () => {
            const flowRenderContext = getFlowWhenGoingFromParentDefaultBranchToPreviousElement();
            const expectedFlowModel = {
                'branch-guid': {
                    childReferences: [{ childReference: 'o1' }, { childReference: 'o2' }],
                    children: [null, null, 'end-hook-guid'],
                    config: {},
                    defaultConnectorLabel: 'Default Connector Label',
                    elementType: 'branch',
                    guid: 'branch-guid',
                    isCanvasElement: true,
                    label: 'branch-guid',
                    next: 'end-guid',
                    nodeType: 'branch',
                    prev: 'screen-guid'
                },
                'end-guid': {
                    elementType: 'END_ELEMENT',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    nodeType: 'end',
                    prev: 'branch-guid'
                },
                'end-hook-guid': {
                    childIndex: 2,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: 'end',
                    parent: 'branch-guid'
                },
                root: {
                    children: ['start-guid'],
                    elementType: 'root',
                    guid: 'root',
                    nodeType: 'root'
                },
                'screen-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'branch-guid',
                    nodeType: 'default',
                    prev: 'start-guid'
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'screen-guid',
                    nodeType: 'start',
                    parent: 'root'
                }
            };
            const newFlowModel = cleanUpIncomingGoTos(
                elementService(flowRenderContext.flowModel),
                flowRenderContext.flowModel,
                flowRenderContext.flowModel['screen-guid']
            );
            expect(newFlowModel).toEqual(expectedFlowModel);
        });

        it('Removing incomingGoTo from default and first branch in previous element', () => {
            const flowRenderContext = getFlowWhenGoingFromParentDefaultBranchToPreviousElement();
            flowRenderContext.flowModel['branch-guid'].childReferences = [
                {
                    childReference: 'o1'
                },
                {
                    childReference: 'o2'
                },
                {
                    childReference: 'o3'
                }
            ];
            flowRenderContext.flowModel['branch-guid'].children = ['screen-guid', null, null, 'screen-guid'];
            flowRenderContext.flowModel['screen-guid'].incomingGoTo.push('branch-guid:o1');
            const expectedFlowModel = {
                'branch-guid': {
                    childReferences: [{ childReference: 'o1' }, { childReference: 'o2' }, { childReference: 'o3' }],
                    children: ['end-hook-guid_0', null, null, 'end-hook-guid'],
                    config: {},
                    defaultConnectorLabel: 'Default Connector Label',
                    elementType: 'branch',
                    guid: 'branch-guid',
                    isCanvasElement: true,
                    label: 'branch-guid',
                    next: 'end-guid',
                    nodeType: 'branch',
                    prev: 'screen-guid'
                },
                'end-guid': {
                    elementType: 'END_ELEMENT',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    nodeType: 'end',
                    prev: 'branch-guid'
                },
                'end-hook-guid': {
                    childIndex: 3,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: 'end',
                    parent: 'branch-guid'
                },
                'end-hook-guid_0': {
                    childIndex: 0,
                    guid: 'end-hook-guid_0',
                    isTerminal: true,
                    nodeType: 'end',
                    parent: 'branch-guid'
                },
                root: {
                    children: ['start-guid'],
                    elementType: 'root',
                    guid: 'root',
                    nodeType: 'root'
                },
                'screen-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'branch-guid',
                    nodeType: 'default',
                    prev: 'start-guid'
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'screen-guid',
                    nodeType: 'start',
                    parent: 'root'
                }
            };
            const newFlowModel = cleanUpIncomingGoTos(
                elementService(flowRenderContext.flowModel),
                flowRenderContext.flowModel,
                flowRenderContext.flowModel['screen-guid']
            );
            expect(newFlowModel).toEqual(expectedFlowModel);
        });

        it('Removing incomingGoTo coming from its next element', () => {
            const flowRenderContext = getFlowWhenGoingToPreviousElement();
            const expectedFlowModel = {
                root: {
                    guid: 'root',
                    nodeType: 'root',
                    elementType: 'root',
                    children: ['start-guid']
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'goto-target-guid',
                    nodeType: 'start',
                    parent: 'root'
                },
                'goto-target-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'goto-target-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'goto-source-guid',
                    nodeType: 'default',
                    prev: 'start-guid'
                },
                'goto-source-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'goto-source-guid',
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'end-hook-guid',
                    nodeType: 'default',
                    prev: 'goto-target-guid'
                },
                'end-hook-guid': {
                    guid: 'end-hook-guid',
                    nodeType: 'end',
                    prev: 'goto-source-guid'
                }
            };
            const newFlowModel = cleanUpIncomingGoTos(
                elementService(flowRenderContext.flowModel),
                flowRenderContext.flowModel,
                flowRenderContext.flowModel['goto-target-guid']
            );
            expect(newFlowModel).toEqual(expectedFlowModel);
        });

        it('Removing incomingGoTo coming from fault branch head', () => {
            const flowRenderContext = getFlowWhenGoingFromParentFaultBranchToPreviousElement();
            const expectedFlowModel = {
                'branch-guid': {
                    childReferences: [
                        {
                            childReference: 'pauseConfig1'
                        },
                        {
                            childReference: 'pauseConfig2'
                        }
                    ],
                    children: [null, null, null],
                    config: {},
                    defaultConnectorLabel: 'Default Connector Label',
                    elementType: 'branch',
                    fault: 'end-hook-guid',
                    guid: 'branch-guid',
                    isCanvasElement: true,
                    label: 'branch-guid',
                    next: 'end-guid',
                    nodeType: 'branch',
                    prev: 'screen-guid'
                },
                'end-guid': {
                    elementType: 'END_ELEMENT',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'end-guid',
                    nodeType: 'end',
                    prev: 'branch-guid'
                },
                'end-hook-guid': {
                    childIndex: -1,
                    guid: 'end-hook-guid',
                    isTerminal: true,
                    nodeType: 'end',
                    parent: 'branch-guid'
                },
                root: {
                    children: ['start-guid'],
                    elementType: 'root',
                    guid: 'root',
                    nodeType: 'root'
                },
                'screen-guid': {
                    config: {},
                    elementType: 'Screen',
                    guid: 'screen-guid',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen-guid',
                    next: 'branch-guid',
                    nodeType: 'default',
                    prev: 'start-guid'
                },
                'start-guid': {
                    childIndex: 0,
                    childReferences: [],
                    config: {},
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'screen-guid',
                    nodeType: 'start',
                    parent: 'root'
                }
            };
            const newFlowModel = cleanUpIncomingGoTos(
                elementService(flowRenderContext.flowModel),
                flowRenderContext.flowModel,
                flowRenderContext.flowModel['screen-guid']
            );
            expect(newFlowModel).toEqual(expectedFlowModel);
        });
    });
    describe('prepareFlowModel', () => {
        const elements = {
            'branch-guid': {
                guid: 'branch-guid',
                prev: 'start-guid',
                label: 'branch-guid',
                elementType: 'branch',
                next: 'end-guid',
                nodeType: 'branch',
                children: ['branch-guid:0-head1-guid', null]
            },
            'branch-guid:0-head1-guid': {
                guid: 'branch-guid:0-head1-guid',
                isCanvasElement: true,
                parent: 'branch-guid',
                childIndex: 0
            },
            'end-guid': {
                guid: 'end-guid',
                label: 'end-guid',
                elementType: 'END_ELEMENT',
                nodeType: 'end',
                isCanvasElement: true,
                prev: 'branch-guid'
            },
            root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
            'start-guid': {
                childIndex: 0,
                elementType: 'start',
                guid: 'start-guid',
                isCanvasElement: true,
                isTerminal: true,
                label: 'start-guid',
                next: 'branch-guid',
                nodeType: 'start',
                parent: 'root'
            }
        };
        it('ended branch', () => {
            expect(
                prepareFlowModel(
                    elements,
                    { guid: elements['branch-guid'].guid, childIndex: undefined },
                    elements['end-guid'].guid
                )
            ).toBe(elements);
        });
        it('GoTo option without ending branch', () => {
            const expectedElements = {
                'branch-guid': {
                    guid: 'branch-guid',
                    prev: 'start-guid',
                    label: 'branch-guid',
                    elementType: 'branch',
                    next: null,
                    nodeType: 'branch',
                    children: ['branch-guid:0-head1-guid', 'end-guid']
                },
                'branch-guid:0-head1-guid': {
                    guid: 'branch-guid:0-head1-guid',
                    isCanvasElement: true,
                    parent: 'branch-guid',
                    childIndex: 0,
                    isTerminal: true,
                    next: 'temporaryEndElement'
                },
                'end-guid': {
                    guid: 'end-guid',
                    label: 'end-guid',
                    elementType: 'END_ELEMENT',
                    nodeType: 'end',
                    isCanvasElement: true,
                    parent: 'branch-guid',
                    prev: null,
                    childIndex: 1,
                    isTerminal: true
                },
                temporaryEndElement: {
                    guid: 'temporaryEndElement',
                    nodeType: 'end',
                    prev: 'branch-guid:0-head1-guid'
                },
                root: { guid: 'root', elementType: 'root', nodeType: 'root', children: ['start-guid'] },
                'start-guid': {
                    childIndex: 0,
                    elementType: 'start',
                    guid: 'start-guid',
                    isCanvasElement: true,
                    isTerminal: true,
                    label: 'start-guid',
                    next: 'branch-guid',
                    nodeType: 'start',
                    parent: 'root'
                }
            };
            expect(
                prepareFlowModel(
                    elements,
                    { guid: elements['branch-guid:0-head1-guid'].guid, childIndex: undefined },
                    undefined
                )
            ).toEqual(expectedElements);
        });
    });
});
