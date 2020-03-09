import { NodeModel, FlowModel, ParentNodeModel, BranchHeadNodeModel, NodeRef } from './model';

/**
 * Adds an element to the guid -> elements map and optionally to the canvasElements array
 * @param element - the element to add
 * @param elements - the guid -> elements map
 */
export function addElementToState(element: NodeModel, elements: FlowModel): void {
    elements[element.guid] = element;
}

/**
 * Updates the pointers of the elements pointed to by the element passed in
 * @param elements - the guid -> element map
 * @param element - the element to link and add
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
 * @param headElement - a branch head element
 */
export function deleteBranchHeadProperties(headElement: BranchHeadNodeModel) {
    delete headElement.parent;
    delete headElement.childIndex;
    delete headElement.isTerminal;
}

/**
 * Inserts an element as child of a parent element and updates pointers
 * @param state
 * @param parentElement
 * @param index
 * @param element
 */
export function linkBranch(
    state: FlowModel,
    parentElement: ParentNodeModel,
    childIndex: number,
    element: NodeModel | null
) {
    // existing child
    const child = parentElement.children[childIndex];

    if (element) {
        parentElement.children[childIndex] = element.guid;
        element.prev = null;
        Object.assign(element, { parent: parentElement.guid, childIndex, isTerminal: false });
    } else {
        parentElement.children[childIndex] = null;
    }

    // make the existing child follow the insert element
    if (child && element) {
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
     * @param elements - a map of all elements by guid
     * @param head - the guid of the head
     * @param config - tail: the guid of the tail or a tail predicate fct, down: whether to navigate up or down
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

    last(): NodeModel {
        return this._map(null, false).last;
    }

    map(callback: FlcListCallback): any[] {
        return this._map(callback).results;
    }

    forEach(callback: FlcListCallback) {
        this._map(callback, false);
    }

    _map(callback: FlcListCallback | null, accumulate = true) {
        const results: any[] = [];

        let curr: NodeRef = this.head;
        let currElement: NodeModel | null = null;

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

        return { results, last: currElement || this.elements[this.head] };
    }
}

// find the last element along the pointer chain
export function findLastElement(element: NodeModel, state: FlowModel): NodeModel {
    return new FlcList(state, element.guid).last();
}

// find the first element along the pointer chain
export function findFirstElement(element: NodeModel, state: FlowModel): NodeModel {
    return new FlcList(state, element.guid, { down: false }).last();
}

function isBranchingElement(element: NodeModel): boolean {
    return Object.hasOwnProperty('children');
}

function resolveNode(flowModel: FlowModel, guid: NodeRef): NodeModel | null {
    return guid != null ? flowModel[guid] : null;
}

/**
 * Deletes an element from the flowModel
 * @param state - the flowModel to mutate
 * @param element - the element to delete
 * @param childIndexToKeep - the index of the branch to keep if applicable
 */
export function deleteElement(state: FlowModel, element: NodeModel, childIndexToKeep: number = 0): FlowModel {
    const { prev, next, parent, childIndex } = element as BranchHeadNodeModel;

    let nextElement;

    // take care of linking tail of the branch to keep to the next element
    if (isBranchingElement(element) && childIndexToKeep != null) {
        const headElement = resolveNode(state, (element as ParentNodeModel).children[childIndexToKeep]);
        if (headElement && next) {
            const tailElement = findLastElement(headElement, state);
            tailElement.next = next;
            linkElement(state, tailElement);
        }
        nextElement = headElement;
    }

    nextElement = nextElement || resolveNode(state, next);
    const parentElement = resolveNode(state, parent);

    if (parentElement) {
        (parentElement as ParentNodeModel).children[childIndex] = null;
        linkBranch(state, parentElement as ParentNodeModel, childIndex, nextElement);
    } else if (nextElement) {
        nextElement.prev = prev;
        linkElement(state, nextElement);
    } else {
        // we're deleting the last element in a branch
        const prevElement = resolveNode(state, prev);
        if (prevElement != null) {
            prevElement.next = null;
        }
    }

    // now delete the elements that need to be deleted
    delete state[element.guid];
    if (isBranchingElement(element)) {
        (element as ParentNodeModel).children.forEach((child, i) => {
            if (child != null && i !== childIndexToKeep) {
                new FlcList(state, child).forEach(listElement => delete state[listElement.guid]);
            }
        });
    }

    return state;
}

/**
 * Adds an element to the flowModel
 * @param flowModel - the flowModel to mutate
 * @param element - the element to add
 * @param isEndElement - if it's an end element
 */
export function addElement(flowModel: FlowModel, element: NodeModel, isEndElement: boolean): void {
    addElementToState(element, flowModel);

    const { parent, childIndex } = element as BranchHeadNodeModel;

    if (parent) {
        // if the element has a parent, make it the new branch head
        const parentElement = flowModel[parent] as ParentNodeModel;
        linkBranch(flowModel, parentElement, childIndex, element);
    } else {
        linkElement(flowModel, element);
    }

    // when adding an end element, we might need to restructure things
    if (isEndElement) {
        restructureFlow(element, flowModel);
    }
}

/**
 * When adding an end element we might need to restructure the flow
 * @param element - end element
 * @param state - current state of elements in the store
 */
function restructureFlow(element: NodeModel, state: FlowModel): void {
    const branchFirstElement = findFirstElement(element, state) as BranchHeadNodeModel;

    // mark the branch as a terminal branch
    branchFirstElement.isTerminal = true;

    const parentElement = resolveNode(state, branchFirstElement.parent) as ParentNodeModel;
    if (parentElement == null) {
        return;
    }

    const children = parentElement.children;

    // find the indexes of the non-terminal branches
    // (there will always be at least one when adding an end element)
    const nonTerminalBranchIndexes = children
        .map((child: NodeRef, index: number) => {
            if (child == null || !(state[child] as BranchHeadNodeModel).isTerminal) {
                return index;
            } else {
                return -1;
            }
        })
        .filter((index: number) => index !== -1);

    if (nonTerminalBranchIndexes.length === 1) {
        // we have one non-terminal branch, so we need to restructure
        const [branchIndex] = nonTerminalBranchIndexes;
        const branchHead = children[branchIndex];
        const parentNext = resolveNode(state, parentElement.next);

        const branchTail = branchHead ? findLastElement(state[branchHead], state) : null;

        if (branchTail != null) {
            //  reconnect the elements that follow the parent element to the tail of the branch
            branchTail.next = parentElement.next;
            linkElement(state, branchTail);
        } else if (parentNext != null) {
            // its an empty branch, so make the elements that follow the parent element be the branch itself
            parentNext.prev = null;
            linkBranch(state, parentElement, branchIndex, parentNext);
        }
        parentElement.next = null;
    }
}
