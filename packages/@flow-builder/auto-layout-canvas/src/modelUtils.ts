import { NodeModel, FlowModel, ParentNodeModel, BranchHeadNodeModel, NodeRef, Guid, FAULT_INDEX } from './model';
import ElementType from './ElementType';

// TODO: use elementsMetadata
const LOOP = 'Loop';
const END = 'END_ELEMENT';

/**
 * Utils for the flow model
 */

const DELETE_ALL = -2;

/**
 * Reconnects a branch element to a valid target element
 *
 * @param elements - The flow model
 * @param endElementGuid - The guid of the end element
 * @param targetGuid - The guid of the target element
 * @returns The updated flow model
 */
function reconnectBranchElement(elements: FlowModel, endElementGuid: Guid, targetGuid: Guid): FlowModel {
    const endElement = elements[endElementGuid];
    const { prev } = endElement;

    const branchHeadElement =
        prev != null ? findFirstElement(endElement, elements) : (endElement as BranchHeadNodeModel);

    // non-terminal since we are reconnecting the branch
    branchHeadElement.isTerminal = false;

    const parentElement = elements[branchHeadElement.parent] as ParentNodeModel;

    // delete the end element
    deleteElement(elements, endElement, undefined, undefined, false);

    // nothing else to do if we are reconnecting to the merge element
    if (parentElement.next === targetGuid) {
        return elements;
    }

    // otherwise the targetElement becomes the merge element
    const targetElement = elements[targetGuid];
    connectElements(elements, parentElement, targetElement);

    // update the parent branch's head
    const parentBranchHead = findFirstElement(parentElement, elements);
    const parentBranchTail = findLastElement(parentElement, elements);
    parentBranchHead.isTerminal = isEndOrAllTerminalBranchingElement(elements, parentBranchTail);

    return elements;
}

/**
 * Checks if the tail element of a branch is an end element or a branching element with all terminal branches
 *
 * @param elements - The flow elements
 * @param branchTail - A branch tail node
 * @return true if the branch tail is an end or a branching element with all terminal branches
 */
function isEndOrAllTerminalBranchingElement(elements: FlowModel, branchTail: NodeModel) {
    return (
        branchTail.elementType === END ||
        (isBranchingElement(branchTail) && areAllBranchesTerminals(branchTail as ParentNodeModel, elements))
    );
}

/**
 * Connects a source element to a target element
 *
 * @param elements - The flow model
 * @param sourceElement - The source element
 * @param targetElement - The target element
 */
function connectElements(elements: FlowModel, sourceElement: NodeModel, targetElement: NodeModel) {
    const { prev } = targetElement as BranchHeadNodeModel;

    if (prev != null) {
        // if the target element has a prev element, unconnect it
        elements[prev].next = null;
        targetElement.prev = null;

        // go up the branch from prev, and mark its head as non-terminal, as the branch is now reconnected
        findFirstElement(elements[prev], elements).isTerminal = false;
    } else {
        //  otherwise the target element must be a branch head: clear its value in the parent's children array
        const targetElementAsBranchHead = targetElement as BranchHeadNodeModel;
        const { parent, childIndex } = targetElementAsBranchHead;
        (elements[parent] as ParentNodeModel).children[childIndex] = null;
        deleteBranchHeadProperties(targetElementAsBranchHead);
    }

    //  update pointers
    sourceElement.next = targetElement.guid;
    targetElement.prev = sourceElement.guid;
}

/**
 * Adds an element to the guid -> elements map and optionally to the canvasElements array
 *
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
function getChild(element: NodeModel, childIndex: number): NodeRef {
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
 * @param state - The flow model
 * @param parentElement - The branching parent
 * @param childIndex - The child index
 * @param element - The new element
 * @returns the new branch head guid
 */
function updateBranchHead(
    state: FlowModel,
    parentElement: ParentNodeModel,
    childIndex: number,
    element: NodeModel | null
): NodeRef {
    // existing branch head
    const existingBranchHead = getChild(parentElement, childIndex);

    if (element != null) {
        element.prev = null;
        const isTerminal =
            existingBranchHead != null
                ? (state[existingBranchHead] as BranchHeadNodeModel).isTerminal
                : element.elementType === END;
        Object.assign(element, { parent: parentElement.guid, childIndex, isTerminal });
    }

    setChild(parentElement, childIndex, element);

    return existingBranchHead;
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
    const child = updateBranchHead(state, parentElement, childIndex, element);

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

type FlcListCallback = (element: NodeModel, index?: number) => any;
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

    map(callback: FlcListCallback): any[] {
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
 * Returns an array of valid target guids to reconnect a branch element to
 *
 * @param elements - The flow model
 * @param sourceGuid - The guid of a branch element
 * @returns An array of valid target guids
 */
function getTargetGuidsForBranchReconnect(elements: FlowModel, sourceGuid: Guid): Guid[] {
    const { parent, childIndex } = findFirstElement(elements[sourceGuid], elements);
    const branchingElement = elements[parent!] as ParentNodeModel;

    // if the branching element has a next element, then that is the only valid target guid
    if (branchingElement.next != null) {
        return [branchingElement.next];
    }

    // otherwise all the other branches must terminals
    if (
        branchingElement.children.findIndex(
            (child) => child != null && !(elements[child] as BranchHeadNodeModel).isTerminal
        ) !== -1
    ) {
        return [];
    }

    // and any element on those branches is a valid target
    return branchingElement.children.reduce((acc: Guid[], child: NodeRef, index: number) => {
        // only elements on other branches can be targets
        if (child != null && index !== childIndex) {
            const branchElements = new FlcList(elements, child).map((element) => element.guid) as Guid[];
            return acc.concat(branchElements);
        }

        return acc;
    }, []);
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
 * Returns whether and element is a branching or loop element
 *
 * @param element - The element
 * @returns true if it is a branching or loop element, false otherwise
 */
function isBranchingOrLoopElement(element: NodeModel): boolean {
    return element.hasOwnProperty('children');
}

/**
 * Returns whether and element is a branching element
 *
 * @param element - The element
 * @returns true if it is a branching element, false otherwise
 */
function isBranchingElement(element: NodeModel): boolean {
    return isBranchingOrLoopElement(element) && element.elementType !== LOOP;
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

function resolveBranchHead(flowModel: FlowModel, guid: Guid): BranchHeadNodeModel {
    return resolveNode(flowModel, guid) as BranchHeadNodeModel;
}

function resolveParent(flowModel: FlowModel, guid: Guid): ParentNodeModel {
    return resolveNode(flowModel, guid) as ParentNodeModel;
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

    new FlcList(state, faultGuid!).forEach((listElement) => {
        const elementToDelete = state[listElement.guid];
        delete state[listElement.guid];
        deleteElementDescendents(state, elementToDelete, DELETE_ALL, getSubElementGuids);
        return elementToDelete;
    });

    return state;
}

/**
 * Deletes a given branch of an element
 *
 * @param state - The flow model
 * @param branchHeadGuid - Guid of the branch head element
 * @param getSubElementGuids - Function to get sub element guids
 */
function deleteBranch(state: FlowModel, branchHeadGuid: Guid, getSubElementGuids: GetSubElementGuids) {
    new FlcList(state, branchHeadGuid!).forEach((listElement) => {
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
 * @param inline - whether to attempt inlining after deletion
 */
// eslint-disable-next-line complexity
function deleteElement(
    state: FlowModel,
    element: NodeModel,
    childIndexToKeep?: number,
    getSubElementGuids?: GetSubElementGuids,
    inline = true
): { state: FlowModel; addEndElement: boolean } {
    const { prev, next, parent, childIndex } = element as BranchHeadNodeModel;

    let nextElement;
    let addEndElement = false;

    const parentElement =
        parent != null ? resolveParent(state, parent) : findParentElement(resolveNode(state, prev)!, state);

    // take care of linking tail of the branch to keep to the next element
    if (isBranchingOrLoopElement(element)) {
        if (childIndexToKeep != null && childIndexToKeep !== DELETE_ALL) {
            const headElement = resolveNode(
                state,
                (element as ParentNodeModel).children[childIndexToKeep]
            ) as BranchHeadNodeModel;

            if (headElement) {
                if (next != null) {
                    const tailElement = findLastElement(headElement, state);
                    tailElement.next = next;
                    linkElement(state, tailElement);
                }
                deleteBranchHeadProperties(headElement);
            }
            nextElement = headElement;
        } else if (childIndexToKeep === DELETE_ALL) {
            addEndElement = areAllBranchesTerminals(element as ParentNodeModel, state) && element.next == null;
        }
    }

    nextElement = nextElement || resolveNode(state, next);

    if (parent != null) {
        if (childIndex === FAULT_INDEX) {
            parentElement!.fault = null;
        } else {
            (parentElement as ParentNodeModel).children[childIndex] = null;
        }
        linkBranchOrFault(state, parentElement as ParentNodeModel, childIndex, nextElement);
    } else if (nextElement != null) {
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
    if (getSubElementGuids != null) {
        deleteElementDescendents(state, element, childIndexToKeep, getSubElementGuids!);
    }

    const branchHead = (parent != null
        ? nextElement
        : findFirstElement(resolveNode(state, prev)!, state)) as BranchHeadNodeModel;

    // update the branch's isTerminal and attempt to inlines
    if (branchHead != null) {
        const branchTail = findLastElement(branchHead, state);
        branchHead.isTerminal = isEndOrAllTerminalBranchingElement(state, branchTail);
    }

    // inline when needed
    if (parentElement != null && childIndex !== FAULT_INDEX && !addEndElement && inline) {
        const inlineParent =
            nextElement != null &&
            isBranchingElement(nextElement) &&
            (nextElement.next == null || state[nextElement.next]!.elementType === END)
                ? nextElement
                : parentElement;
        inlineFromParent(state, inlineParent as ParentNodeModel);
    }

    return { state, addEndElement };
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
    childIndexToKeep: number | undefined,
    getSubElementGuids: GetSubElementGuids
): void {
    let elementsToDelete: NodeRef[] = [];

    if (isBranchingOrLoopElement(element)) {
        elementsToDelete = (element as ParentNodeModel).children.filter(
            (child, i) => child != null && i !== childIndexToKeep
        );
    }

    // Action, CRUD and Wait (branching) elements can have a Fault path
    if (element.fault != null) {
        elementsToDelete.push(element.fault);
    }

    elementsToDelete.forEach((guid: NodeRef) => {
        new FlcList(state, guid!).forEach((listElement) => {
            const elementToDelete = state[listElement.guid];
            delete state[listElement.guid];
            getSubElementGuids(elementToDelete, state).map((subElementGuid) => {
                delete state[subElementGuid];
            });
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

    if (isEndElement) {
        const branchHead = findFirstElement(element, flowModel) as BranchHeadNodeModel;

        // mark the branch as a terminal branch
        branchHead.isTerminal = true;
        const branchParent = resolveParent(flowModel, branchHead.parent)!;
        inlineFromParent(flowModel, branchParent);
    }
}

function inlineFromParent(flowModel: FlowModel, branchParent: ParentNodeModel) {
    let branchHead;
    // when adding an end element, we might need to restructure things:
    // find the first branching ancestor with a non-null `next` and
    // attempt to inline branches from there
    while (!isRoot(branchParent.guid) && branchParent.elementType !== LOOP) {
        if (branchParent.next != null) {
            // once we find the first ancestor with a non-null 'next', we can inline from there,
            // the other parts of the tree are not affected by add end operation
            inlineBranches(branchParent, flowModel);

            break;
        } else {
            branchHead = findFirstElement(branchParent, flowModel);
            // as we go up the ancestor chain, update isTerminal as it might have been invalidated
            // by the new sub tree structure
            branchHead.isTerminal = areAllBranchesTerminals(branchParent, flowModel);
            branchParent = resolveParent(flowModel, branchHead.parent)!;
        }
    }
}

export function isRoot(guid: Guid) {
    return guid === ElementType.ROOT;
}
/**
 * Checks if all branches are terminal
 *
 * @param parentElement - the parent element
 * @param state - the flow state
 * @return true if all branches are terminal
 */
export function areAllBranchesTerminals(parentElement: ParentNodeModel, state: FlowModel) {
    // a loop always has an implicit "after last"
    if (parentElement.elementType === LOOP) {
        return false;
    }

    let allTerminalBranches = true;

    parentElement.children.forEach((child) => {
        if (child == null || !(state[child] as BranchHeadNodeModel).isTerminal) {
            allTerminalBranches = false;
        }
    });

    return allTerminalBranches;
}

/**
 * Inlines branches recursively when possible.
 * If a parentElement has only one non terminal branch, then the elements following
 * parentElement can be inlined under that branch.
 *
 * @param parentElement - The parent element
 * @param state - The flow state
 */
function inlineBranches(parentElement: ParentNodeModel, state: FlowModel) {
    const { children } = parentElement;

    const nonTerminalBranchIndexes = children
        .map((child: NodeRef, index: number) => {
            if (child == null || !resolveBranchHead(state, child).isTerminal) {
                return index;
            } else {
                return -1;
            }
        })
        .filter((index: number | null) => index !== -1);

    if (nonTerminalBranchIndexes.length === 1) {
        // we have one non-terminal branch, so we can inline
        const [branchIndex] = nonTerminalBranchIndexes;
        let branchHeadGuid = children[branchIndex!];

        const parentNext = resolveParent(state, parentElement.next!);

        let branchTail;
        if (branchHeadGuid != null) {
            branchTail = findLastElement(resolveBranchHead(state, branchHeadGuid), state);

            //  reconnect the elements that follow the parent element to the tail of the branch
            branchTail.next = parentElement.next;
            linkElement(state, branchTail);
        } else {
            // its an empty branch, so make the elements that follow the parent element be the branch itself
            parentNext.prev = null;
            linkBranchOrFault(state, parentElement, branchIndex, parentNext);
            branchHeadGuid = parentNext.guid;
            branchTail = parentNext;
        }

        resolveBranchHead(state, branchHeadGuid!).isTerminal = true;
        parentElement.next = null;

        // recursive inline from the branch tail
        if (isBranchingElement(branchTail!)) {
            inlineBranches(branchTail as ParentNodeModel, state);
        }

        branchTail = findLastElement(resolveBranchHead(state, branchHeadGuid), state);
        resolveBranchHead(state, branchHeadGuid).isTerminal = isEndOrAllTerminalBranchingElement(state, branchTail);
    }
}

function assertBranchHead(state: FlowModel, branchHead: BranchHeadNodeModel) {
    const { guid, prev, parent, childIndex } = branchHead;

    if (prev != null) {
        throw new Error(`invalid prev for branch head ${guid}: ${prev}`);
    }
    if (state[parent] == null) {
        throw new Error(`invalid parent for branch head ${guid}: ${parent}`);
    }

    if (childIndex == null) {
        throw new Error(`invalid childIndex for branch head ${guid}: ${childIndex}`);
    } else if (childIndex === FAULT_INDEX) {
        if (resolveParent(state, parent).fault == null) {
            throw new Error(`invalid branch head fault ${guid}:`);
        }
    } else {
        if (childIndex < 0 || childIndex > resolveParent(state, parent).children.length - 1) {
            throw new Error(`invalid branch head childIndex ${guid}: ${childIndex}`);
        }

        if ((state[parent!] as ParentNodeModel).children[childIndex!] !== guid) {
            throw new Error(`invalid parent:childIndex link for branch head ${guid}: ${parent}:${childIndex}`);
        }
    }

    if (branchHead.isTerminal == null) {
        throw new Error(`invalid branch head isTerminal ${branchHead.isTerminal}:`);
    } else {
        const isTerminal = isEndOrAllTerminalBranchingElement(state, findLastElement(branchHead, state));

        if (isTerminal !== branchHead.isTerminal) {
            throw new Error(`Invalid isTerminal value for ${guid}: ${isTerminal}`);
        }
    }
}

function assertNonBranchHead(elements: FlowModel, element: NodeModel) {
    const { guid, prev, next, parent, childIndex, isTerminal } = element as BranchHeadNodeModel;

    if (parent != null) {
        throw new Error(`invalid parent attribute for non branch head ${guid}: ${parent}`);
    }

    if (childIndex != null) {
        throw new Error(`invalid childIndex attribute for non branch head ${guid}: ${childIndex}`);
    }

    if (isTerminal != null) {
        throw new Error(`invalid isTerminal attribute for non branch head ${guid}: ${isTerminal}`);
    }

    if (prev != null && elements[prev].next !== guid) {
        throw new Error(`invalid prev link for non branch head ${guid}: ${prev}`);
    }

    if (next != null && elements[next].prev !== guid) {
        throw new Error(`invalid next link for non branch head ${guid}: ${next}`);
    }
}

function assertElement(element: NodeModel) {
    const { guid, children } = element as ParentNodeModel;
    if (!!children !== isBranchingOrLoopElement(element)) {
        throw new Error(`invalid children property for element ${guid}: ${children}`);
    }
}
function assertAutoLayoutStateForBranch(elements: FlowModel, branchHeadGuid: NodeRef) {
    if (branchHeadGuid != null) {
        const branchHead = elements[branchHeadGuid] as BranchHeadNodeModel;
        let element: NodeModel | null = branchHead;

        assertBranchHead(elements, branchHead);

        while (element != null) {
            assertElement(element);

            if (element !== branchHead) {
                assertNonBranchHead(elements, element);
            }

            if (element.fault != null) {
                assertAutoLayoutStateForBranch(elements, element.fault);
            }

            if (isBranchingOrLoopElement(element)) {
                (element as ParentNodeModel).children.forEach((child) =>
                    assertAutoLayoutStateForBranch(elements, child)
                );
            }

            element = element.next != null ? elements[element.next] : null;
        }
    }
}

/**
 * Asserts that all 'isTerminal' are set correctly for all the branches of a flow.
 * Used for tests and in dev.
 *
 * @param elements - The flow elements
 * @throws Error if an invalid isTerminal is found
 */
function assertAutoLayoutState(elements: FlowModel) {
    const rootElement = resolveParent(elements, ElementType.ROOT);
    if (rootElement != null) {
        assertAutoLayoutStateForBranch(elements, rootElement.children[0]);
    }
}

export {
    assertAutoLayoutState,
    getTargetGuidsForBranchReconnect,
    reconnectBranchElement,
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
    deleteFault,
    deleteBranch,
    getChild,
    DELETE_ALL,
    resolveBranchHead,
    resolveParent
};
