import {
    createFlow,
    flowModelFromElements,
    getFlowWithNonTerminalImmediateBranch,
    getFlowWithTerminalImmediateBranch,
    getFlowWithBranchNodeInImmediateBranch,
    BRANCH_ELEMENT,
    SCREEN_ELEMENT,
    BRANCH_ELEMENT_GUID,
    START_ELEMENT_GUID,
    END_ELEMENT_GUID,
    END_ELEMENT
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
    getTargetGuidsForBranchReconnect,
    getTargetGuidsForReconnection,
    connectToElement,
    addElement,
    updateChildren,
    addFault,
    hasGoToConnectionOnNext,
    hasGoToConnectionOnBranchHead,
    createGoToConnection,
    deleteGoToConnection,
    decorateElements,
    clearCanvasDecoration,
    updateChildrenOnAddingOrUpdatingTimeTriggers,
    areAllBranchesTerminals
} from '../modelUtils';

import { FAULT_INDEX, START_IMMEDIATE_INDEX } from '../model';
import NodeType from '../NodeType';

const elementService = (elements) => {
    return {
        elements,

        createEndElement({ guid } = { guid: 'end-hook-guid' }) {
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

function createEndElement(elements, guid) {
    const config = elementService(elements);
    config.createEndElement({ guid });
}

describe('modelUtils', () => {
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
                parent: 'branch-guid',
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
                parent: 'branch-guid',
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
                prev: 'branch-guid:0-head-guid'
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
                parent: 'branch-guid',
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
                parent: 'branch-guid:0-branch-guid',
                childIndex: 1
            });
            expect(elements).toMatchSnapshot();
        });
    });

    describe('getTargetGuidsForBranchReconnect', () => {
        it('returns elements on a different branch', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [
                ['head-guid', END_ELEMENT_GUID],
                ['head-guid', 'random-guid', END_ELEMENT_GUID]
            ];

            const elements = createFlow([START_ELEMENT_GUID, branchingElement], false);
            expect(getTargetGuidsForBranchReconnect(elements, 'branch-guid:0-end-guid')).toEqual([
                'branch-guid:1-head-guid',
                'branch-guid:1-random-guid',
                'branch-guid:1-end-guid'
            ]);
        });

        it('returns the merge element when parent has next', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [['head-guid', END_ELEMENT_GUID], ['head-guid', 'random-guid'], ['head-guid']];
            const elements = createFlow([branchingElement]);
            expect(getTargetGuidsForBranchReconnect(elements, 'branch-guid:0-end-guid')).toEqual(['end-guid']);
        });
    });

    describe('getTargetGuidsForReconnection', () => {
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
                    true
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
                getTargetGuidsForReconnection(elements, undefined, 'branch-guid', 'branch-guid:0-end-guid', true)
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
            expect(getTargetGuidsForReconnection(elements, 'branch-guid', undefined, 'end-guid', false)).toEqual({
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
            expect(getTargetGuidsForReconnection(elements, 'branch-guid', undefined, 'end-guid', false)).toEqual({
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
                    label: 'head1-end1-guid',
                    nodeType: 'end',
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
                    label: 'head1-end2-guid',
                    nodeType: 'end',
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
                getTargetGuidsForReconnection(elements, undefined, 'branch-guid:0-head1-guid', 'head1-end1-guid', true)
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
            expect(getTargetGuidsForReconnection(elements, 'start-guid', undefined, 'end-guid', false)).toEqual({
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
            expect(getTargetGuidsForReconnection(elements, 'random-guid', undefined, 'end-guid', false)).toEqual({
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
            expect(getTargetGuidsForReconnection(elements, 'branch-guid', undefined, 'end-guid', false)).toEqual({
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

            expect(getTargetGuidsForReconnection(flowModel, undefined, 'decision2', 'end1', true)).toEqual({
                firstMergeableNonNullNext: 'end',
                goToableGuids: ['screen1', 'decision1', 'screen2'],
                mergeableGuids: ['screen3']
            });
        });
    });

    describe('connectToElement', () => {
        it('can only connect to a valid target element (no gotos)', () => {
            const branchingElement = { ...BRANCH_ELEMENT };

            branchingElement.children = [null, ['head-guid'], ['head-guid', 'random-guid', END_ELEMENT_GUID]];
            const elements = createFlow([branchingElement]);

            const insertAt = {
                parent: 'branch-guid',
                childIndex: 0
            };

            expect(() => {
                connectToElement(elementService(elements), elements, insertAt, BRANCH_ELEMENT.guid);
            }).toThrowError();
        });

        it('can only connect to an element from an insertAt followed by end element', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [null, ['head-guid'], ['head-guid', 'random-guid', END_ELEMENT_GUID]];
            const elements = createFlow([branchingElement]);

            let insertAt = {
                parent: 'branch-guid',
                childIndex: 0
            };

            expect(() => {
                connectToElement(elementService(elements), elements, insertAt, 'end-guid');
            }).toThrowError();

            insertAt = {
                prev: 'branch-guid:1-head-guid'
            };

            expect(() => {
                connectToElement(elementService(elements), elements, insertAt, 'end-guid');
            }).toThrowError();
        });

        it('reconnects to an element on another branch', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            const endElement1 = { ...END_ELEMENT, guid: 'end1-guid', prev: null };
            const endElement2 = { ...END_ELEMENT, guid: 'end2-guid', prev: null };

            branchingElement.children = [[endElement1], ['head-guid', 'random-guid', endElement2]];
            const elements = createFlow([branchingElement]);

            const insertAt = {
                parent: 'branch-guid',
                childIndex: 0
            };

            expect(
                connectToElement(elementService(elements), elements, insertAt, 'branch-guid:1-random-guid')
            ).toMatchSnapshot();
        });

        it('reconnects to the merge element', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [['head-guid', END_ELEMENT_GUID], ['head-guid', 'random-guid'], ['head-guid']];
            const elements = createFlow([branchingElement]);

            const insertAt = {
                prev: 'branch-guid:0-head-guid'
            };

            expect(connectToElement(elementService(elements), elements, insertAt, 'end-guid')).toMatchSnapshot();
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

            const insertAt = {
                parent: 'branch-guid',
                childIndex: 0
            };

            // reconnect with end of the right branch

            expect(
                connectToElement(elementService(newFlowModel), newFlowModel, insertAt, 'branch-guid:1-end-guid')
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
                deleteElement(elementService(elements), elements, inlineElement.guid, defaultDeleteOptions)
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

            const nextElements = deleteElement(elementService(elements), elements, elementToDelete);
            expect(nextElements).toEqual(expectedElements);
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
            flow = createFlow([branchingElement]);
        });

        it('when all branches terminals after the update, delete the parent next and descendants', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [
                ['head1-guid', { ...END_ELEMENT, guid: 'end1' }],
                ['head2-guid', 'random-guid'],
                ['head3-guid', { ...END_ELEMENT, guid: 'end2' }]
            ];
            flow = createFlow([branchingElement, { ...SCREEN_ELEMENT }, { ...SCREEN_ELEMENT, guid: 'screen2-guid' }]);
            const originalBranchingElement = { ...flow[BRANCH_ELEMENT_GUID] };
            originalBranchingElement.childReferences = [
                {
                    childReference: 'o1'
                },
                {
                    childReference: 'o2'
                }
            ];
            const nextFlow = updateChildren(elementService(flow), flow, originalBranchingElement, [
                'branch-guid:0-head1-guid',
                'branch-guid:2-head3-guid'
            ]);

            expect(nextFlow).toMatchSnapshot();
        });

        it('when parent has all terminals, creates end nodes for new branches', () => {
            const branchingElement = { ...BRANCH_ELEMENT, next: null };
            branchingElement.children = [[{ ...END_ELEMENT, guid: 'end1' }], [{ ...END_ELEMENT, guid: 'end2' }]];
            flow = createFlow([branchingElement], false);

            const nextFlow = updateChildren(elementService(flow), flow, flow[BRANCH_ELEMENT_GUID], [
                'branch-guid:0-end1',
                'branch-guid:1-end2',
                null
            ]);

            expect(nextFlow).toMatchSnapshot();
        });

        it('cant update children with a guid that was not previously in children', () => {
            const elements = { ...flow };

            expect(() =>
                updateChildren(elementService(elements), elements, elements[BRANCH_ELEMENT_GUID], [
                    'branch-guid:0-head1-guid',
                    'random-guid',
                    'branch-guid:2-head3-guid',
                    null
                ])
            ).toThrowError();
        });

        it('handles new empty branch in right-most position', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, elements[BRANCH_ELEMENT_GUID], [
                'branch-guid:0-head1-guid',
                'branch-guid:1-head2-guid',
                'branch-guid:2-head3-guid',
                null
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('handles new empty branch in left-most position', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, elements[BRANCH_ELEMENT_GUID], [
                null,
                'branch-guid:0-head1-guid',
                'branch-guid:1-head2-guid',
                'branch-guid:2-head3-guid'
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('deletes branch elements when removing a child', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, elements[BRANCH_ELEMENT_GUID], [
                'branch-guid:0-head1-guid',
                'branch-guid:2-head3-guid'
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('reorders the children', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, elements[BRANCH_ELEMENT_GUID], [
                'branch-guid:1-head2-guid',
                'branch-guid:2-head3-guid',
                'branch-guid:0-head1-guid'
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('reorders, removes and adds child', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, elements[BRANCH_ELEMENT_GUID], [
                null,
                'branch-guid:2-head3-guid',
                'branch-guid:0-head1-guid'
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('reorders the children of parent with null children', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [['head1-guid', END_ELEMENT_GUID], null, ['head3-guid']];
            const elements = createFlow([branchingElement]);
            const nextFlow = updateChildren(elementService(elements), elements, elements[BRANCH_ELEMENT_GUID], [
                'branch-guid:2-head3-guid',
                'branch-guid:0-head1-guid',
                null
            ]);
            expect(nextFlow).toMatchSnapshot();
        });
    });

    describe('updateChildrenOnAddingOrUpdatingTimeTriggers', () => {
        let flow;

        it('adding a new timeTrigger to start element', () => {
            flow = createFlow([
                { ...SCREEN_ELEMENT, guid: 'screen1-guid' },
                { ...SCREEN_ELEMENT, guid: 'screen2-guid' }
            ]);

            flow[START_ELEMENT_GUID].childReferences = [{ childReference: 'child-reference-guid-1' }];
            flow['child-reference-guid-1'] = {
                elementType: 'TimeTrigger',
                label: 't1',
                guid: 'child-reference-guid-1',
                name: 't1',
                offSetNumber: '1',
                offSetUnit: 'DaysAfter',
                timeSource: 'RecordTriggerEvent'
            };
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flow),
                flow,
                flow[START_ELEMENT_GUID],
                [null, null]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting a timeTrigger', () => {
            flow = createFlow([
                { ...SCREEN_ELEMENT, guid: 'screen1-guid' },
                { ...SCREEN_ELEMENT, guid: 'screen2-guid' }
            ]);
            const flowWithChildren = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flow),
                flow,
                flow[START_ELEMENT_GUID],
                [null, null]
            );
            flowWithChildren[START_ELEMENT_GUID].childReferences = [];
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flowWithChildren),
                flowWithChildren,
                flowWithChildren[START_ELEMENT_GUID],
                [null]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting all pre-existing timeTriggers: default branch is non-terminal', () => {
            flow = getFlowWithNonTerminalImmediateBranch();
            flow[START_ELEMENT_GUID].childReferences = [];
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flow),
                flow,
                flow[START_ELEMENT_GUID],
                ['screen1-guid']
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting all pre-existing timeTriggers: default branch is terminal', () => {
            flow = getFlowWithTerminalImmediateBranch();
            flow[START_ELEMENT_GUID].childReferences = [];
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flow),
                flow,
                flow[START_ELEMENT_GUID],
                ['screen1-guid']
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting all pre-existing timeTriggers: default branch has branching node', () => {
            flow = getFlowWithBranchNodeInImmediateBranch();
            flow[START_ELEMENT_GUID].childReferences = [];
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flow),
                flow,
                flow[START_ELEMENT_GUID],
                ['screen1-guid']
            );
            expect(nextFlow).toMatchSnapshot();
        });
    });

    describe('inlineFromParent', () => {
        describe('inline decision with next end', () => {
            const originalStoreState = {
                newDecision: {
                    guid: 'newDecision',
                    name: 'newDecision',
                    children: ['end1', null],
                    next: 'screen1'
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

    describe('hasGoToConnectionOnNext function', () => {
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

        it('hasGoToConnectionOnNext should return true for screen1 as the source', () => {
            expect(hasGoToConnectionOnNext(flowModel, flowModel['screen1'])).toBeTruthy();
        });

        it('hasGoToConnectionOnNext should return false with screen2 as the source', () => {
            expect(hasGoToConnectionOnNext(flowModel, flowModel['screen2'])).toBeFalsy();
        });

        it('hasGoToConnectionOnNext should return false with screen3 as the source', () => {
            expect(hasGoToConnectionOnNext(flowModel, flowModel['screen3'])).toBeFalsy();
        });
    });

    describe('hasGoToConnectionOnBranchHead function', () => {
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

        it('hasGoToConnectionOnBranchHead should return true for start element as the source and 0th index (immediate branch)', () => {
            expect(hasGoToConnectionOnBranchHead(flowModel, flowModel['start'], START_IMMEDIATE_INDEX)).toBeTruthy();
        });

        it('hasGoToConnectionOnBranchHead should return true for branchElement as the source and 0th index', () => {
            expect(hasGoToConnectionOnBranchHead(flowModel, flowModel['branchElement'], 0)).toBeTruthy();
        });

        it('hasGoToConnectionOnBranchHead should return false with screen2 as the source', () => {
            expect(hasGoToConnectionOnBranchHead(flowModel, flowModel['branchElement'], 1)).toBeFalsy();
        });

        it('hasGoToConnectionOnBranchHead should return true with screen3 as the source', () => {
            expect(hasGoToConnectionOnBranchHead(flowModel, flowModel['branchElement'], 2)).toBeTruthy();
        });

        it('hasGoToConnectionOnBranchHead should return true for branchElement as the source and fault index', () => {
            expect(hasGoToConnectionOnBranchHead(flowModel, flowModel['branchElement'], FAULT_INDEX)).toBeTruthy();
        });
    });

    describe('createGoToConnection function', () => {
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

            expect(createGoToConnection(flowModel, 'start', START_IMMEDIATE_INDEX, 'branchElement')).toMatchObject(
                updatedFlowModel
            );
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

            expect(createGoToConnection(flowModel, 'start', 1, 'branchElement')).toMatchObject(updatedFlowModel);
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

            expect(createGoToConnection(flowModel, 'screen2', undefined, 'branchElement')).toMatchObject(
                updatedFlowModel
            );
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

            expect(createGoToConnection(flowModel, 'branchElement', 0, 'screen1')).toMatchObject(updatedFlowModel);
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

            expect(createGoToConnection(flowModel, 'branchElement', 2, 'screen1')).toMatchObject(updatedFlowModel);
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

            expect(createGoToConnection(flowModel, 'branchElement', FAULT_INDEX, 'screen1')).toMatchObject(
                updatedFlowModel
            );
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
            const flowModelAfterDeletion = deleteGoToConnection(
                elementService(flowModel),
                flowModel,
                'start',
                START_IMMEDIATE_INDEX,
                'branchElement'
            );
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
            const flowModelAfterDeletion = deleteGoToConnection(
                elementService(flowModel),
                flowModel,
                'screen2',
                undefined,
                'branchElement'
            );
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
            const flowModelAfterDeletion = deleteGoToConnection(
                elementService(flowModel),
                flowModel,
                'branchElement',
                0,
                'screen1'
            );
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
            const flowModelAfterDeletion = deleteGoToConnection(
                elementService(flowModel),
                flowModel,
                'branchElement',
                2,
                'screen1'
            );
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
            const flowModelAfterDeletion = deleteGoToConnection(
                elementService(flowModel),
                flowModel,
                'branchElement',
                FAULT_INDEX,
                'screen1'
            );
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
            expect(areAllBranchesTerminals(flowModel['decision1'], flowModel)).toBeTruthy();
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
});
