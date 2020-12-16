import {
    createFlow,
    flowModelFromElements,
    BRANCH_ELEMENT,
    BRANCH_ELEMENT_GUID,
    START_ELEMENT_GUID,
    END_ELEMENT_GUID,
    END_ELEMENT
} from './testUtils';

import {
    linkElement,
    linkBranchOrFault,
    findFirstElement,
    findLastElement,
    deleteElement,
    deleteFault,
    deleteBranch,
    getTargetGuidsForBranchReconnect,
    reconnectBranchElement,
    addElement
} from '../modelUtils';
import { FAULT_INDEX } from '../model';

function getSubElementGuids() {
    return [];
}

const END = 'END_ELEMENT';

describe('modelUtils', () => {
    describe('addElement', () => {
        it('add end node to left branch of decision with empty branches', () => {
            const elements = createFlow([BRANCH_ELEMENT_GUID]);
            addElement(
                elements,
                { guid: 'new-end-element-guid', parent: 'branch-guid', childIndex: 0, elementType: END },
                true
            );
            expect(elements).toMatchSnapshot();
        });

        it('add end node to left branch of decision with with non-empty right branch', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [null, ['head-guid']];
            const elements = createFlow([branchingElement]);
            addElement(
                elements,
                { guid: 'new-end-element-guid', parent: 'branch-guid', childIndex: 0, elementType: END },
                true
            );
            expect(elements).toMatchSnapshot();
        });

        it('add end node to left branch of decision with with non-empty left branch', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [['head-guid'], null];
            const elements = createFlow([branchingElement]);

            addElement(
                elements,
                { guid: 'new-end-element-guid', prev: 'branch-guid:0-head-guid', elementType: END },
                true
            );
            expect(elements).toMatchSnapshot();
        });

        it('add end complex 1', () => {
            const nestedBranchingElement = { ...BRANCH_ELEMENT };
            nestedBranchingElement.children = [[END_ELEMENT_GUID], null];

            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[nestedBranchingElement], null];

            const elements = createFlow([branchingElement]);

            addElement(
                elements,
                { guid: 'new-end-element-guid', parent: 'branch-guid', childIndex: 1, elementType: END },
                true
            );
            expect(elements).toMatchSnapshot();
        });

        it('add end complex 2', () => {
            const nestedBranchingElement = { ...BRANCH_ELEMENT };
            nestedBranchingElement.children = [[END_ELEMENT_GUID], null];

            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[nestedBranchingElement], null];

            const elements = createFlow([branchingElement]);

            addElement(
                elements,
                { guid: 'new-end-element-guid', parent: 'branch-guid:0-branch-guid', childIndex: 1, elementType: END },
                true
            );
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

    describe('reconnectBranchElement', () => {
        it('reconnects to an element on another branch', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [
                ['head-guid', END_ELEMENT_GUID],
                ['head-guid', 'random-guid', END_ELEMENT_GUID]
            ];
            const elements = createFlow([branchingElement]);

            expect(
                reconnectBranchElement(elements, 'branch-guid:0-end-guid', 'branch-guid:1-random-guid')
            ).toMatchSnapshot();
        });

        it('reconnects to the merge element', () => {
            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [['head-guid', END_ELEMENT_GUID], ['head-guid', 'random-guid'], ['head-guid']];
            const elements = createFlow([branchingElement]);
            expect(reconnectBranchElement(elements, 'branch-guid:0-end-guid', 'end-guid')).toMatchSnapshot();
        });
    });

    describe('linkElement', () => {
        it('updates pointers and adds to state', () => {
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

    describe('delete element', () => {
        it('in nested branch with ended left branch inlines', () => {
            const nestedBranchingElement = { ...BRANCH_ELEMENT };
            nestedBranchingElement.children = [[END_ELEMENT_GUID], null];

            const branchingElement = { ...BRANCH_ELEMENT };
            branchingElement.children = [[nestedBranchingElement], null];

            const elements = createFlow([branchingElement]);

            expect(
                deleteElement(elements, elements['branch-guid:0-branch-guid'], 0, getSubElementGuids)
            ).toMatchSnapshot();
        });

        it('delete nested decision with end elements and reconnect', () => {
            const nestedBranchElement = { ...BRANCH_ELEMENT, children: [[END_ELEMENT], [END_ELEMENT_GUID]] };
            const branchElement = { ...BRANCH_ELEMENT, children: [[nestedBranchElement], [END_ELEMENT_GUID]] };
            const flowModel = createFlow([branchElement]);

            // delete nested branch
            const newFlowModel = deleteElement(
                flowModel,
                flowModel['branch-guid:0-branch-guid'],
                0,
                getSubElementGuids
            );

            expect(newFlowModel).toMatchSnapshot();

            // reconnect with end of the right branch
            expect(
                reconnectBranchElement(
                    flowModel,
                    'branch-guid:0-branch-guid:0-branch-guid:0-end-guid',
                    'branch-guid:1-end-guid'
                )
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

            const expectedState = {
                state: {
                    'first-element': {
                        guid: 'first-element',
                        prev: null,
                        next: 'branch-head-one',
                        isTerminal: false
                    },
                    'branch-head-one': {
                        guid: 'branch-head-one',
                        prev: 'first-element',
                        next: 'last-element'
                    },
                    'last-element': {
                        guid: 'last-element',
                        prev: 'branch-head-one',
                        next: null
                    }
                },
                addEndElement: false
            };

            expect(deleteElement(elements, branchElement, 0, getSubElementGuids)).toEqual(expectedState);
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
                elementType: 'END_ELEMENT'
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'branch-element',
                next: null
            };

            const elements = flowModelFromElements([firstElement, branchElement, branchHeadElement, lastElement]);

            const expectedState = {
                state: {
                    'first-element': {
                        guid: 'first-element',
                        prev: null,
                        next: 'last-element',
                        isTerminal: false
                    },
                    'last-element': {
                        guid: 'last-element',
                        prev: 'first-element',
                        next: null
                    }
                },
                addEndElement: false
            };

            expect(deleteElement(elements, branchElement, 0, getSubElementGuids)).toEqual(expectedState);
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

            const expectedState = {
                state: {
                    'first-element': {
                        guid: 'first-element',
                        prev: null,
                        next: 'last-element',
                        isTerminal: false
                    },

                    'last-element': {
                        guid: 'last-element',
                        prev: 'first-element',
                        next: null
                    }
                },
                addEndElement: false
            };

            expect(deleteElement(elements, inlineElement, 0, getSubElementGuids)).toEqual(expectedState);
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
                elementType: 'END_ELEMENT'
            };

            const faultBranchHeadElement = {
                guid: 'fault-branch-head-element',
                childIndex: -1,
                parent: 'branching-element',
                isTerminal: true,
                prev: null,
                next: 'fault-branch-end-element'
            };

            const faultBranchEndElement = {
                guid: 'fault-branch-end-element',
                prev: 'fault-branch-head-element',
                next: null,
                elementType: END
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

            const expectedState = {
                state: {
                    'screen-element': {
                        guid: 'screen-element',
                        prev: null,
                        next: 'branch-head-one',
                        isTerminal: true
                    },
                    'branch-head-one': {
                        guid: 'branch-head-one',
                        prev: 'screen-element',
                        next: 'merge-element'
                    },

                    'merge-element': {
                        guid: 'merge-element',
                        prev: 'branch-head-one',
                        next: null,
                        elementType: 'END_ELEMENT'
                    }
                },
                addEndElement: false
            };

            expect(deleteElement(elements, branchingElement, 0, getSubElementGuids)).toEqual(expectedState);
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

            const expectedState = {
                state: {
                    'branching-element': {
                        guid: 'branching-element',
                        children: [null, null],
                        prev: null,
                        next: 'merge-element'
                    },

                    'merge-element': {
                        guid: 'merge-element',
                        prev: 'branching-element',
                        next: null
                    }
                },
                addEndElement: false
            };

            expect(deleteElement(elements, branchHeadElement, 0, getSubElementGuids)).toEqual(expectedState);
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
                elementType: END,
                isTerminal: true
            };

            const branchElementTwo = {
                guid: 'branch-element-two',
                parent: 'inline-element',
                childIndex: 1,
                next: null,
                elementType: END,
                isTerminal: true
            };

            const elements = flowModelFromElements([firstElement, inlineElement, branchElementOne, branchElementTwo]);

            const expectedState = {
                state: {
                    'first-element': {
                        isTerminal: false,
                        guid: 'first-element',
                        prev: null,
                        next: null
                    }
                },
                addEndElement: true
            };

            expect(deleteElement(elements, inlineElement, -2, getSubElementGuids)).toEqual(expectedState);
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

            const expectedState = {
                state: {
                    'first-element': {
                        guid: 'first-element',
                        prev: null,
                        next: 'inline-element'
                    },
                    'inline-element': {
                        guid: 'inline-element',
                        prev: 'first-element',
                        next: 'last-element',
                        children: [null, null]
                    },
                    'last-element': {
                        guid: 'last-element',
                        prev: 'inline-element',
                        next: null
                    }
                },
                addEndElement: true
            };

            expect(deleteElement(elements, branchHeadElement, -2, getSubElementGuids)).toEqual(expectedState);
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

            const expectedState = {
                state: {
                    'first-element': {
                        guid: 'first-element',
                        prev: null,
                        next: 'decision-element'
                    },
                    'decision-element': {
                        guid: 'decision-element',
                        prev: 'first-element',
                        next: 'last-element',
                        children: [null, 'screen-element']
                    },
                    'screen-element': {
                        guid: 'screen-element',
                        prev: null,
                        next: null,
                        parent: 'decision-element',
                        childIndex: 1,
                        isTerminal: false
                    },
                    'last-element': {
                        guid: 'last-element',
                        prev: 'decision-element',
                        next: null
                    }
                },
                addEndElement: false
            };

            expect(deleteElement(elements, loopElement, 0, getSubElementGuids)).toEqual(expectedState);
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
                childIndex: -1,
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
                elementType: END
            };

            const lastElement = {
                guid: 'last-element',
                prev: 'action-element',
                next: null,
                elementType: END
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
                state: {
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
                        childIndex: -1,
                        isTerminal: true
                    },
                    'fault-end-element': {
                        guid: 'fault-end-element',
                        prev: 'fault-branch-head-element',
                        next: null,
                        elementType: END
                    },
                    'last-element': {
                        guid: 'last-element',
                        prev: 'action-element',
                        next: null,
                        elementType: END
                    }
                },
                addEndElement: false
            };

            expect(deleteElement(elements, faultInlineElement, undefined, getSubElementGuids)).toEqual(expectedState);
        });
    });

    describe('add fault to element', () => {
        it('adds a fault to an element', () => {
            const element = {
                guid: 'element-guid'
            };

            const faultElement = {
                guid: 'fault-element-guid'
            };

            const elements = {
                [element.guid]: element
            };

            linkBranchOrFault(elements, element, FAULT_INDEX, faultElement);

            expect(element).toEqual({
                guid: 'element-guid',
                fault: 'fault-element-guid'
            });

            expect(faultElement).toEqual({
                guid: 'fault-element-guid',
                parent: 'element-guid',
                childIndex: FAULT_INDEX,
                isTerminal: true,
                prev: null
            });
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

            deleteFault(elements, element.guid, getSubElementGuids);

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

            deleteBranch(elements, 'decision1', getSubElementGuids);
            expect(elements.decision1).toBeUndefined();
            expect(elements.screen1).toBeUndefined();
            expect(elements.screen2).toBeUndefined();
        });
    });
});
