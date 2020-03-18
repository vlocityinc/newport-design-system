import { linkElement, linkBranch, findFirstElement, findLastElement, deleteElement } from '../modelUtils';

function toElementsMap(...elements) {
    return elements.reduce((state, element) => {
        state[element.guid] = element;
        return state;
    }, {});
}

describe('modelUtils', () => {
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

    describe('linkBranch', () => {
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

            linkBranch(elements, parentElement, 1, element);

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

            linkBranch(elements, parentElement, 1, element);

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

            linkBranch(elements, parentElement, 1, element);

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

            expect(deleteElement(elements, inlineElement, 0)).toEqual(expectedState);
        });
        it('deletes branching element', () => {
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

            expect(deleteElement(elements, branchingElement, 0)).toEqual(expectedState);
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

            expect(deleteElement(elements, branchHeadElement, 0)).toEqual(expectedState);
        });
    });
});
