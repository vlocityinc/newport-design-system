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

function toElementsMap(...elements) {
    return elements.reduce((state, element) => {
        state[element.guid] = element;
        return state;
    }, {});
}

function getSubElementGuids() {
    return [];
}

/**
 * Util to create a branching element
 *
 * @param {Guid} parent - A parent guid
 * @param {Guid[][]} branches - An array of branches. A branch is an array of guids, where null denotes an end node
 * @param {Guid} parentNext - A parent next guid
 */
function createBranch(parent, branches, parentNext) {
    const elements = [];

    const branchingElement = {
        guid: parent,
        next: parentNext,
        children: branches.map((branch, childIndex) => {
            const headGuid = branch.length > 0 ? branch[0] : null;

            if (headGuid != null) {
                const branchHeadElement = {
                    guid: `${parent}:${childIndex}-${headGuid}`,
                    parent,
                    childIndex,
                    isTerminal: true
                };
                elements.push(branchHeadElement);

                let prevElement = branchHeadElement;
                let isTerminal = false;

                branch.forEach((elementGuid, i) => {
                    if (i === 0) {
                        // skip the head
                        return;
                    }
                    let guid = `${parent}:${childIndex}-${elementGuid}`;

                    if (elementGuid == null) {
                        isTerminal = true;
                        guid = `${parent}:${childIndex}-end-guid`;
                    }

                    const element = {
                        guid,
                        prev: prevElement.guid
                    };

                    elements.push(element);
                    prevElement.next = element.guid;
                    prevElement = element;
                });

                branchHeadElement.isTerminal = isTerminal;
                return branchHeadElement.guid;
            }

            return null;
        })
    };

    elements.push(branchingElement);

    if (parentNext != null) {
        elements.push({
            guid: parentNext,
            prev: branchingElement.guid
        });
    }

    return toElementsMap(...elements);
}

describe('modelUtils', () => {
    describe('addElement', () => {
        it('add end node to left branch of decision with empty branches', () => {
            const elements = createBranch('parent-guid', [[], []], 'parent-next-guid');
            addElement(elements, { guid: 'new-end-element-guid', parent: 'parent-guid', childIndex: 0 }, true);
            expect(elements).toMatchSnapshot();
        });

        it('add end node to left branch of decision with with non-empty right branch', () => {
            const elements = createBranch('parent-guid', [[], ['head-guid']], 'parent-next-guid');
            addElement(elements, { guid: 'new-end-element-guid', parent: 'parent-guid', childIndex: 0 }, true);
            expect(elements).toMatchSnapshot();
        });

        it('add end node to left branch of decision with with non-empty left branch', () => {
            const elements = createBranch('parent-guid', [['head-guid'], []], 'parent-next-guid');
            addElement(elements, { guid: 'new-end-element-guid', prev: 'parent-guid:0-head-guid' }, true);
            expect(elements).toMatchSnapshot();
        });
    });

    describe('getTargetGuidsForBranchReconnect', () => {
        it('returns elements on a different branch', () => {
            const elements = createBranch('parent-guid', [
                ['head-guid', null],
                ['head-guid', 'random-guid', null]
            ]);

            expect(getTargetGuidsForBranchReconnect(elements, 'parent-guid:0-end-guid')).toEqual([
                'parent-guid:1-head-guid',
                'parent-guid:1-random-guid',
                'parent-guid:1-end-guid'
            ]);
        });

        it('returns the merge element when parent has next', () => {
            const elements = createBranch(
                'parent-guid',
                [['head-guid', null], ['head-guid', 'random-guid'], ['head-guid']],
                'merge-guid'
            );

            expect(getTargetGuidsForBranchReconnect(elements, 'parent-guid:0-end-guid')).toEqual(['merge-guid']);
        });
    });

    describe('reconnectBranchElement', () => {
        it('reconnects to an element on another branch', () => {
            const elements = createBranch('parent-guid', [
                ['head-guid', null],
                ['head-guid', 'random-guid', null]
            ]);

            expect(
                reconnectBranchElement(elements, 'parent-guid:0-end-guid', 'parent-guid:1-random-guid')
            ).toMatchSnapshot();
        });

        it('reconnects to the merge element', () => {
            const elements = createBranch(
                'parent-guid',
                [['head-guid', null], ['head-guid', 'random-guid'], ['head-guid']],
                'merge-guid'
            );

            expect(reconnectBranchElement(elements, 'parent-guid:0-end-guid', 'merge-guid')).toMatchSnapshot();
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

            const elements = toElementsMap(firstElement, lastElement);

            expect(findFirstElement(lastElement, elements)).toBe(firstElement);
            expect(findLastElement(firstElement, elements)).toBe(lastElement);
        });
    });

    describe('delete element', () => {
        it('deletes inline element', () => {
            const firstElement = {
                guid: 'first-element',
                prev: null,
                next: 'inline-element'
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

            const elements = toElementsMap(firstElement, inlineElement, lastElement);

            const expectedState = {
                'first-element': {
                    guid: 'first-element',
                    prev: null,
                    next: 'last-element'
                },

                'last-element': {
                    guid: 'last-element',
                    prev: 'first-element',
                    next: null
                }
            };

            expect(deleteElement(elements, inlineElement, 0, getSubElementGuids)).toEqual(expectedState);
        });
        it('deletes branching element that supports a fault branch as well', () => {
            const branchingElement = {
                guid: 'branching-element',
                children: ['branch-head-element'],
                prev: null,
                next: 'merge-element',
                fault: 'fault-branch-head-element'
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
                next: null
            };

            const elements = toElementsMap(
                branchingElement,
                mergeElement,
                branchHeadElement,
                faultBranchHeadElement,
                faultBranchEndElement
            );

            const expectedState = {
                'branch-head-element': {
                    guid: 'branch-head-element',
                    prev: null,
                    next: 'merge-element'
                },

                'merge-element': {
                    guid: 'merge-element',
                    prev: 'branch-head-element',
                    next: null
                }
            };

            expect(deleteElement(elements, branchingElement, 0, getSubElementGuids)).toEqual(expectedState);
        });
        it('deletes branch head element', () => {
            const branchingElement = {
                guid: 'branching-element',
                children: ['branch-head-element'],
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

            const elements = toElementsMap(branchingElement, mergeElement, branchHeadElement);

            const expectedState = {
                'branching-element': {
                    guid: 'branching-element',
                    children: [null],
                    prev: null,
                    next: 'merge-element'
                },

                'merge-element': {
                    guid: 'merge-element',
                    prev: 'branching-element',
                    next: null
                }
            };

            expect(deleteElement(elements, branchHeadElement, 0, getSubElementGuids)).toEqual(expectedState);
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
            const faultElement = {
                guid: 'fault-element-guid'
            };

            const element = {
                guid: 'element-guid',
                fault: faultElement.guid
            };

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
            expect(elements['decision1']).toBeUndefined();
            expect(elements['screen1']).toBeUndefined();
            expect(elements['screen2']).toBeUndefined();
        });
    });
});
