import { NodeModel, FlowModel, ParentNodeModel, BranchHeadNodeModel, NodeRef, Guid, FAULT_INDEX } from './model';

/**
 * Utils for the flow model
 */

const DELETE_ALL = -2;

/**
 * Adds an element to the guid -> elements map and optionally to the canvasElements array
 * @param element - the element to add
 * @param elements - the guid -> elements map
 */
function addElementToState(element: NodeModel, elements: FlowModel): void {
    elements[element.guid] = element;
}

/**
 * Updates the pointers of the elements pointed to by the element passed in
 * @param elements - the guid -> element map
 * @param element - the element to link and add
 */
function linkElement(elements: FlowModel, element: NodeModel): void {
    const { prev, next, guid } = element;

    if (prev) {
        const prevElement = elements[prev];
        prevElement.next = guid;
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
function deleteBranchHeadProperties(headElement: BranchHeadNodeModel) {
    delete headElement.parent;
    delete headElement.childIndex;
    delete headElement.isTerminal;
}

/**
 * Returns the child Guid or fault Guid of an element
 *
 * @param element - The element
 * @param childIndex - The child index  (FAULT_INDEX for a fault)
 * @return The guid for the child or fault
 */
function getChild(element: NodeModel, childIndex: number) {
    return childIndex === FAULT_INDEX ? element.fault : (element as ParentNodeModel).children[childIndex];
}

/**
 * Returns sets the child Guid or fault Guid of an element
 *
 * @param element - The element
 * @param childIndex - The child index (-1 for a fault)
 * @param childElement - A child element or null
 */
function setChild(element: NodeModel, childIndex: number, childElement: NodeModel | null): void {
    const childElementGuid = childElement != null ? childElement.guid : null;

    if (childIndex === -1) {
        element.fault = childElementGuid;
    } else {
        (element as ParentNodeModel).children[childIndex] = childElementGuid;
    }

    if (childElement != null) {
        Object.assign(childElement, { parent: element.guid, childIndex });
    }
}

/**
 * Updates a branch head with a new element
 *
 * @param parentElement - The branching parent
 * @param childIndex - The child index
 * @param element - The new element
 * @returns the new branch head guid
 */
function updateBranchHead(parentElement: ParentNodeModel, childIndex: number, element: NodeModel | null): NodeRef {
    // existing branch head
    const branchHead = getChild(parentElement, childIndex);

    if (element != null) {
        element.prev = null;
        Object.assign(element, { parent: parentElement.guid, childIndex, isTerminal: false });
    }

    setChild(parentElement, childIndex, element);

    return branchHead;
}

/**
 * Inserts an element as child of a parent element and updates pointers
 * @param state
 * @param parentElement
 * @param index
 * @param element
 */
function linkBranchOrFault(
    state: FlowModel,
    parentElement: ParentNodeModel,
    childIndex: number,
    element: NodeModel | null
) {
    const child = updateBranchHead(parentElement, childIndex, element);

    if (element != null) {
        if (child != null) {
            // make the existing child follow the insert element
            const childElement = state[child] as BranchHeadNodeModel;
            Object.assign(element, { next: child, isTerminal: childElement.isTerminal });
            delete childElement.isTerminal;
            linkElement(state, element);

            // remove branch head properties
            deleteBranchHeadProperties(childElement);
        } else if (childIndex === FAULT_INDEX && element) {
            // fault branches are terminals initially
            (element as BranchHeadNodeModel).isTerminal = true;
        }
    }
}

type FlcListCallback = (element: NodeModel, index?: number) => NodeModel;
type FlcListPredicate = (guid: string) => boolean;

/**
 * Linked list interface to navigate a flow
 */
class FlcList {
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

    map(callback: FlcListCallback): NodeModel[] {
        return this._map(callback).results;
    }

    forEach(callback: FlcListCallback) {
        this._map(callback, false);
    }

    _map(callback: FlcListCallback | null, accumulate = true) {
        const results: NodeModel[] = [];

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

/**
 * Finds the last element by following the 'next' pointers
 *
 * @param element - The element
 * @param state - The flow model
 * @returns The last element
 */
function findLastElement(element: NodeModel, state: FlowModel): NodeModel {
    return new FlcList(state, element.guid).last();
}

/**
 * Find the first element by following the 'prev' pointers
 *
 * @param element - The element
 * @param state - The flow model
 * @returns The first element
 */
function findFirstElement(element: NodeModel, state: FlowModel): BranchHeadNodeModel {
    return new FlcList(state, element.guid, { down: false }).last() as BranchHeadNodeModel;
}

/**
 * Find an element's parent
 *
 * @param element - An element
 * @param flowModel- The FlowModel
 * @returns a ParentNodeModel for the element's parent
 */
function findParentElement(element: NodeModel, flowModel: FlowModel): ParentNodeModel {
    const { parent } = findFirstElement(element, flowModel);
    return flowModel[parent!] as ParentNodeModel;
}

/**
 * Returns whether and element is a branching element
 *
 * @param element - The element
 * @returns true if it is a branching element, false otherwise
 */
function isBranchingElement(element: NodeModel): boolean {
    return element.hasOwnProperty('children');
}

/**
 * Resolves an element from its reference
 *
 * @param flowModel - The flow model
 * @param guid - The element guid or null
 * @returns The element or null if not found
 */
function resolveNode(flowModel: FlowModel, guid: NodeRef): NodeModel | null {
    return guid != null ? flowModel[guid] : null;
}

type GetSubElementGuids = (node: NodeModel, state: FlowModel) => Guid[];

/**
 * Deletes an element's fault
 *
 * @param state - The flow model
 * @param elementWithFaultGuid - The guid of the element with the fault
 * @param getSubElementGuids - Function to get sub element guids
 */
function deleteFault(state: FlowModel, elementWithFaultGuid: Guid, getSubElementGuids: GetSubElementGuids) {
    const elementWithFault = state[elementWithFaultGuid];
    const faultGuid = elementWithFault.fault;
    delete elementWithFault.fault;

    new FlcList(state, faultGuid!).forEach(listElement => {
        const elementToDelete = state[listElement.guid];
        delete state[listElement.guid];
        deleteElementDescendents(state, elementToDelete, DELETE_ALL, getSubElementGuids);
        return elementToDelete;
    });

    return state;
}
/**
 * Deletes an element from the flowModel
 *
 * @param state - the flowModel to mutate
 * @param element - the element to delete
 * @param childIndexToKeep - the index of the branch to keep if applicable, or FAULT_INDEX to delete a fault
 * @param getSubElementGuids - Function to get sub element guids
 */
function deleteElement(
    state: FlowModel,
    element: NodeModel,
    childIndexToKeep: number | null,
    getSubElementGuids: GetSubElementGuids
): FlowModel {
    const { prev, next, parent, childIndex } = element as BranchHeadNodeModel;

    let nextElement;

    // take care of linking tail of the branch to keep to the next element
    if (isBranchingElement(element) && childIndexToKeep != null) {
        const headElement = resolveNode(state, (element as ParentNodeModel).children[childIndexToKeep]);
        if (headElement && next) {
            const tailElement = findLastElement(headElement, state);
            tailElement.next = next;
            linkElement(state, tailElement);
            deleteBranchHeadProperties(headElement as BranchHeadNodeModel);
        }
        nextElement = headElement;
    }

    nextElement = nextElement || resolveNode(state, next);
    const parentElement = resolveNode(state, parent);

    if (parentElement) {
        if (childIndex === FAULT_INDEX) {
            parentElement.fault = null;
        } else {
            (parentElement as ParentNodeModel).children[childIndex] = null;
        }
        linkBranchOrFault(state, parentElement as ParentNodeModel, childIndex, nextElement);
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

    // delete the element
    delete state[element.guid];

    // now delete its decendents that need to be deleted
    deleteElementDescendents(state, element, childIndexToKeep, getSubElementGuids);

    return state;
}

/**
 * Deletes an element and all its decendents recursively
 *
 * @param state - The flow model
 * @param element - The element to delete
 * @param childIndex - The child index
 * @param getSubElementGuids - Function to get sub element guids
 */
function deleteElementDescendents(
    state: FlowModel,
    element: NodeModel,
    childIndexToKeep: number | null,
    getSubElementGuids: GetSubElementGuids
): void {
    let elementsToDelete: NodeRef[] = [];

    getSubElementGuids(element, state).map(guid => {
        delete state[guid];
    });

    if (isBranchingElement(element)) {
        elementsToDelete = (element as ParentNodeModel).children.filter(
            (child, i) => child != null && i !== childIndexToKeep
        );
    }

    // Action, CRUD and Wait (branching) elements can have a Fault path
    if (element.fault != null) {
        elementsToDelete = [element.fault];
    }

    elementsToDelete.forEach((guid: NodeRef) => {
        new FlcList(state, guid!).forEach(listElement => {
            const elementToDelete = state[listElement.guid];
            delete state[listElement.guid];
            deleteElementDescendents(state, elementToDelete, DELETE_ALL, getSubElementGuids);
            return elementToDelete;
        });
    });
}

/**
 * Adds an element to the flowModel
 * @param flowModel - the flowModel to mutate
 * @param element - the element to add
 * @param isEndElement - if it's an end element
 */
function addElement(flowModel: FlowModel, element: NodeModel, isEndElement: boolean): void {
    addElementToState(element, flowModel);

    const { parent, childIndex } = element as BranchHeadNodeModel;

    if (parent) {
        // if the element has a parent, make it the new branch head
        const parentElement = flowModel[parent] as ParentNodeModel;
        linkBranchOrFault(flowModel, parentElement, childIndex, element);
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
        .filter((index: number) => index !== FAULT_INDEX);

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
            linkBranchOrFault(state, parentElement, branchIndex, parentNext);
        }
        parentElement.next = null;
    }
}

export {
    addElementToState,
    linkElement,
    deleteBranchHeadProperties,
    linkBranchOrFault,
    FlcList,
    findLastElement,
    findFirstElement,
    findParentElement,
    deleteElement,
    addElement,
    deleteFault
};
