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
    decorateElements,
    clearCanvasDecoration,
    updateChildrenOnAddingOrUpdatingTimeTriggers
} from '../modelUtils';

import { FAULT_INDEX } from '../model';
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
        it('No braches are mergerd and undefined parent parameter', () => {
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
            ).toEqual([
                'branch-guid:1-head-guid',
                'branch-guid:1-random-guid',
                'branch-guid:1-end-guid',
                'branch-guid:0-head-guid',
                'branch-guid:0-random-guid',
                'branch-guid'
            ]);
        });

        it('Immediately ended branch with parent.next == null', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[END_ELEMENT_GUID], ['head-guid', 'random-guid', END_ELEMENT_GUID]];

            const elements = createFlow([START_ELEMENT_GUID, branchingElement], false);
            expect(
                getTargetGuidsForReconnection(elements, undefined, 'branch-guid', 'branch-guid:0-end-guid', true)
            ).toEqual(['branch-guid:1-head-guid', 'branch-guid:1-random-guid', 'branch-guid:1-end-guid']);
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
            expect(getTargetGuidsForReconnection(elements, 'branch-guid', undefined, 'end-guid', false)).toEqual([]);
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
            expect(getTargetGuidsForReconnection(elements, 'branch-guid', undefined, 'end-guid', false)).toEqual([
                'branch-guid'
            ]);
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
            expect(getTargetGuidsForReconnection(elements, 'start-guid', undefined, 'end-guid', false)).toEqual([]);
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
            expect(getTargetGuidsForReconnection(elements, 'random-guid', undefined, 'end-guid', false)).toEqual([]);
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
            expect(getTargetGuidsForReconnection(elements, 'branch-guid', undefined, 'end-guid', false)).toEqual([
                'branch-guid',
                'branch-guid2'
            ]);
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
        it('updates pointers', () => {
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
        it('finds first element', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'last-element'
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'first-element',
                next: null
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

        it('when all branches terminals after the update, delete the parent next and decendents', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [
                ['head1-guid', { ...END_ELEMENT, guid: 'end1' }],
                ['head2-guid', 'random-guid'],
                ['head3-guid', { ...END_ELEMENT, guid: 'end2' }]
            ];
            flow = createFlow([branchingElement, { ...SCREEN_ELEMENT }, { ...SCREEN_ELEMENT, guid: 'screen2-guid' }]);
            const nextFlow = updateChildren(elementService(flow), flow, BRANCH_ELEMENT_GUID, [
                'branch-guid:0-head1-guid',
                'branch-guid:2-head3-guid'
            ]);

            expect(nextFlow).toMatchSnapshot();
        });

        it('when parent has all terminals, creates end nodes for new branches', () => {
            const branchingElement = { ...BRANCH_ELEMENT, next: null };
            branchingElement.children = [[{ ...END_ELEMENT, guid: 'end1' }], [{ ...END_ELEMENT, guid: 'end2' }]];
            flow = createFlow([branchingElement], false);

            const nextFlow = updateChildren(elementService(flow), flow, BRANCH_ELEMENT_GUID, [
                'branch-guid:0-end1',
                'branch-guid:1-end2',
                null
            ]);

            expect(nextFlow).toMatchSnapshot();
        });

        it('cant update children with a guid that was not previously in children', () => {
            const elements = { ...flow };

            expect(() =>
                updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                    'branch-guid:0-head1-guid',
                    'random-guid',
                    'branch-guid:2-head3-guid',
                    null
                ])
            ).toThrowError();
        });

        it('handles new empty branch in right-most position', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                'branch-guid:0-head1-guid',
                'branch-guid:1-head2-guid',
                'branch-guid:2-head3-guid',
                null
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('handles new empty branch in left-most position', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                null,
                'branch-guid:0-head1-guid',
                'branch-guid:1-head2-guid',
                'branch-guid:2-head3-guid'
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('deletes branch elements when removing a child', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                'branch-guid:0-head1-guid',
                'branch-guid:2-head3-guid'
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('reorders the children', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
                'branch-guid:1-head2-guid',
                'branch-guid:2-head3-guid',
                'branch-guid:0-head1-guid'
            ]);
            expect(nextFlow).toMatchSnapshot();
        });

        it('reorders, removes and adds child', () => {
            const elements = { ...flow };
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
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
            const nextFlow = updateChildren(elementService(elements), elements, BRANCH_ELEMENT_GUID, [
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
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flow),
                flow,
                START_ELEMENT_GUID,
                ['start-guid:0-screen1-guid', 'start-guid:1-screen2-guid']
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
                START_ELEMENT_GUID,
                [null, null]
            );
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flowWithChildren),
                flowWithChildren,
                START_ELEMENT_GUID,
                [null]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting all pre-existing timeTriggers: default branch is non-terminal', () => {
            flow = getFlowWithNonTerminalImmediateBranch();
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flow),
                flow,
                START_ELEMENT_GUID,
                [null]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting all pre-existing timeTriggers: default branch is terminal', () => {
            flow = getFlowWithTerminalImmediateBranch();
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flow),
                flow,
                START_ELEMENT_GUID,
                [null]
            );
            expect(nextFlow).toMatchSnapshot();
        });

        it('deleting all pre-existing timeTriggers: default branch has branching node', () => {
            flow = getFlowWithBranchNodeInImmediateBranch();
            const nextFlow = updateChildrenOnAddingOrUpdatingTimeTriggers(
                elementService(flow),
                flow,
                START_ELEMENT_GUID,
                [null]
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
