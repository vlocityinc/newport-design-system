import { NodeModel, FlowModel, ParentNodeModel, BranchHeadNodeModel, NodeRef } from './model';

/**
 * Adds an element to the guid -> elements map and optionally to the canvasElements array
 * @param {NodeModel} element - the element to add
 * @param {FlowModel} elements - the guid -> elements map
 */
export function addElementToState(element: NodeModel, elements: FlowModel): void {
    elements[element.guid] = element;
}

/**
 * Updates the pointers of the elements pointed to by the element passed in
 * @param {FlowModel} elements - the guid -> element map
 * @param {NodeModel} element - the element to link and add
 */
export function linkElement(elements: FlowModel, element: NodeModel): void {
    const { prev, next, guid } = element;

    if (prev) {
        elements[prev].next = guid;
    }

    if (next) {
        elements[next].prev = guid;
    }
    addElementToState(element, elements);
}

/**
 * Deletes all branch head properties
 * @param {BranchHeadNodeModel} headElement - a branch head element
 */
export function deleteBranchHeadProperties(headElement: BranchHeadNodeModel) {
    delete headElement.parent;
    delete headElement.childIndex;
    delete headElement.isTerminal;
}

/**
 * Inserts an element as child of a parent element and updates pointers
 * @param {FlowModel} state
 * @param {NodeModel} parentElement
 * @param {number} index
 * @param {NodeModel} element
 */
export function linkBranch(state: FlowModel, parentElement: ParentNodeModel, childIndex: number, element: NodeModel) {
    // existing child
    const child = parentElement.children[childIndex];

    if (element) {
        parentElement.children[childIndex] = element.guid;
        element.prev = null;
        Object.assign(element, { parent: parentElement.guid, childIndex, isTerminal: false });
    } else {
        parentElement.children[childIndex] = null;
    }

    // make the existing child the follow the insert element
    if (child) {
        const childElement = state[child] as BranchHeadNodeModel;

        Object.assign(element, { next: child, isTerminal: childElement.isTerminal });
        linkElement(state, element);

        // remove branch head properties
        deleteBranchHeadProperties(childElement);
    }
}

type FlcListCallback = (element: NodeModel, index?: number) => boolean;
type FlcListPredicate = (guid: string) => boolean;

/**
 * Linked list interface to navigate a flow
 */
export class FlcList {
    private down: boolean;
    private tailPredicate: FlcListPredicate;

    /**
     *
     * @param {FlowModel} elements - a map of all elements by guid
     * @param {string} head - the guid of the head
     * @param {Object} config - tail: the guid of the tail or a tail predicate fct, down: whether to navigate up or down
     */
    constructor(
        private elements: FlowModel,
        private head: string,
        { tail, down = true }: { tail?: FlcListPredicate; down?: boolean } = {}
    ) {
        this.down = down;

        if (tail) {
            this.tailPredicate =
                typeof tail === 'function' ? tail : (guid: string) => this.elements[guid].prev !== tail;
        } else {
            this.tailPredicate = (guid: string) => guid != null;
        }
    }

    last() {
        return this._map(null, false).last;
    }

    map(callback: FlcListCallback) {
        return this._map(callback).results;
    }

    forEach(callback: FlcListCallback) {
        this._map(callback, false);
    }

    _map(callback: FlcListCallback | null, accumulate = true) {
        const results: any[] = [];

        let curr: NodeRef = this.head;
        let currElement;

        let index = 0;
        while (curr != null && this.tailPredicate(curr)) {
            currElement = this.elements[curr];

            if (callback) {
                const result = callback(this.elements[curr], index++);
                if (accumulate) {
                    results.push(result);
                }
            }

            curr = this.down ? currElement.next : currElement.prev;
        }

        return { results, last: currElement };
    }
}

// find the last element along the pointer chain
export function findLastElement(element: NodeModel, state: FlowModel) {
    return new FlcList(state, element.guid).last();
}

// find the first element along the pointer chain
export function findFirstElement(element: NodeModel, state: FlowModel) {
    return new FlcList(state, element.guid, { down: false }).last();
}
