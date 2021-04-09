import {
    Guid,
    FAULT_INDEX,
    NodeRef,
    NodeModel,
    FlowModel,
    ParentNodeModel,
    BranchHeadNodeModel,
    HighlightInfo,
    StartNodeModel,
    GOTO_CONNECTION_SUFFIX,
    START_IMMEDIATE_INDEX
} from './model';

import NodeType from './NodeType';

/**
 * Type that represents a location where a node can be created: Either before an
 * existing node (prev), or as the child of a parent node (parent + childIndex)
 */
export type InsertAt = { prev: Guid } & { parent: Guid; childIndex: number };

/**
 * Utils for the flow model
 */

export interface DeleteElementOptions {
    // whether to inline, if possible, after deletion
    inline: boolean;
    // the index of the child branch to keep, if any
    childIndexToKeep?: number;
}

/* DeleteElementOptions defaults */
const deleteElementOptionsDefaults = {
    inline: true, // inline if possible
    childIndexToKeep: undefined // delete all branches
};

/**
 *  Interface for the Element Service.
 *
 *  The ALC delegates element operations to this service as it doesn't
 *  manage the elements itself, only the nodes.
 */
export interface ElementService {
    deleteElement: (guid: Guid) => void;
    createEndElement: () => Guid;
}

/**
 * Returns true if there's a GoTo between the source element and it's 'next' element
 * @param flowModel - The flow model
 * @param sourceElement - The source of the potential goTo connection
 */
function hasGoToConnectionOnNext(flowModel: FlowModel, sourceElement: NodeModel): boolean {
    if (flowModel[sourceElement.next!].incomingGoTo) {
        return flowModel[sourceElement.next!].incomingGoTo!.includes(sourceElement.guid);
    }
    return false;
}

/**
 * Returns the suffix for the GoTo connection being pushed into the Target element's incomingGoTo []
 * @param sourceElement - The Parent Element
 * @param sourceBranchIndex - The branch index on which the GoTo connection is being added
 */
function getSuffixForGoToConnection(sourceElement: ParentNodeModel, sourceBranchIndex: number) {
    // Should be START_IMMEDIATE_INDEX for Start Node and length of childReferences for other branching elements
    const defaultIndex =
        sourceElement.nodeType === NodeType.BRANCH && sourceElement.childReferences
            ? sourceElement.childReferences.length
            : sourceElement.nodeType === NodeType.START
            ? START_IMMEDIATE_INDEX
            : null;
    if (sourceBranchIndex === defaultIndex) {
        return sourceElement.nodeType === NodeType.START
            ? GOTO_CONNECTION_SUFFIX.IMMEDIATE
            : GOTO_CONNECTION_SUFFIX.DEFAULT;
    } else if (sourceBranchIndex === FAULT_INDEX) {
        return GOTO_CONNECTION_SUFFIX.FAULT;
    } else if (sourceElement.childReferences) {
        // Accounting for Immediate Branch being on the 0th index in case of Start Element
        return sourceElement.nodeType === NodeType.START
            ? sourceElement.childReferences![sourceBranchIndex - 1].childReference
            : sourceElement.childReferences![sourceBranchIndex].childReference;
    }
    return null;
}

/**
 * Returns true if there's a GoTo connection from the parent on a given branch index
 * @param flowModel - The flow model
 * @param sourceElement - The Parent Element
 * @param sourceBranchIndex - The branch index on which we need to check the existence of a GoTo connection
 */
function hasGoToConnectionOnBranchHead(
    flowModel: FlowModel,
    sourceElement: ParentNodeModel,
    sourceBranchIndex: number
): boolean {
    if (sourceElement.nodeType === NodeType.ROOT) {
        return false;
    }

    // Getting the target guid for the branch connection. Will be null in case the branch is empty
    const targetGuid =
        sourceBranchIndex === FAULT_INDEX ? sourceElement.fault : sourceElement.children[sourceBranchIndex];
    const suffix = getSuffixForGoToConnection(sourceElement, sourceBranchIndex);
    if (targetGuid && flowModel[targetGuid!].incomingGoTo) {
        // Returning true if the sourceGuid:suffix combination exists in target element's incomingGoTo array
        return flowModel[targetGuid!].incomingGoTo!.includes(`${sourceElement.guid}:${suffix}`);
    }
    return false;
}

/**
 * Returns the node at an InsertAt location
 *
 * @param flowModel - The flow model
 * @param insertAt - The InsertAt location
 * @return The node following the InsertAt, or null if no node follows it
 */
function getNodeAtInsertAt(flowModel: FlowModel, insertAt: InsertAt): NodeModel | null {
    const { parent, childIndex, prev } = insertAt;

    let guid: Guid | null;

    if (parent) {
        const parentElement = resolveParent(flowModel, parent);
        guid = childIndex === FAULT_INDEX ? parentElement.fault : parentElement.children[childIndex];
    } else {
        const element = resolveNode(flowModel, prev);
        guid = element.next;
    }

    return guid ? resolveNode(flowModel, guid) : null;
}

/**
 * Verifies that an element exists, throws an error otherwise.
 *
 * @param flowModel - The flowModel
 * @param elementGuid - The element guid to check
 * @throws An Error if the element doesn't exist
 */
function validElementGuidOrThrow(flowModel: FlowModel, elementGuid: Guid) {
    if (!flowModel[elementGuid]) {
        throw new Error(`Invalid element guid: ${elementGuid}`);
    }
}

/**
 * Verifies that a child index is valid, throws an error otherwise
 *
 * @param parentElement - The parent element
 * @param childIndex - The child index to check
 * @throws An Error if the child index is not valid
 */
function validChildIndexOrThrow(parentElement: ParentNodeModel, childIndex: number) {
    const valid = childIndex === FAULT_INDEX || (childIndex >= 0 && childIndex < parentElement.children.length);

    if (!valid) {
        throw new Error(`Invalid childIndex: ${childIndex} for element: ${parentElement.guid}`);
    }
}

/**
 * Verifies that an InsertAt location exists, throws an error otherwise
 *
 * @param flowModel - The flowModel
 * @param insertAt - The insert location
 * @throws An Error the InsertAt location doesn't exist
 */
function validInsertAtOrThrow(flowModel: FlowModel, insertAt: InsertAt) {
    const { prev, parent, childIndex } = insertAt;

    if (parent != null) {
        const parentElement = resolveParent(flowModel, parent);
        validChildIndexOrThrow(parentElement, childIndex);
    } else {
        resolveNode(flowModel, prev);
    }
}

/**
 * Creates a connection from an InsertAt location to a target element.
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param fromInsertAt - The insert point. For now the InsertAt location must have an end element
 * @param toElementGuid - The guid of the element to connect to
 * @returns The updated flow model
 */
function connectToElement(
    elementService: ElementService,
    flowModel: FlowModel,
    fromInsertAt: InsertAt,
    toElementGuid: Guid
): FlowModel {
    const endElement = getNodeAtInsertAt(flowModel, fromInsertAt);
    if (!endElement || endElement.nodeType !== NodeType.END) {
        throw new Error('When connecting, a end node must be at insertAt');
    }

    validElementGuidOrThrow(flowModel, toElementGuid);

    const validTargets = getTargetGuidsForBranchReconnect(flowModel, endElement.guid);
    if (validTargets.indexOf(toElementGuid) === -1) {
        throw new Error('Invalid target element for reconnect');
    }

    const branchHeadElement = findFirstElement(endElement, flowModel);

    // non-terminal since we are reconnecting the branch
    branchHeadElement.isTerminal = false;

    const parentElement = resolveParent(flowModel, branchHeadElement.parent);

    // delete the end element
    deleteElement(elementService, flowModel, endElement.guid, { inline: false });

    // nothing else to do if we are reconnecting to the merge element
    if (parentElement.next === toElementGuid) {
        return flowModel;
    }

    // otherwise the targetElement becomes the merge element
    const targetElement = flowModel[toElementGuid];
    connectElements(flowModel, parentElement, targetElement);

    // update the parent branch's head
    const parentBranchHead = findFirstElement(parentElement, flowModel);
    const parentBranchTail = findLastElement(parentElement, flowModel);
    parentBranchHead.isTerminal = isEndOrAllTerminalBranchingElement(flowModel, parentBranchTail);

    return flowModel;
}

/**
 * Function to create a GoTo connector between a given source and target
 *
 * @param flowModel - The flow model
 * @param sourceGuid - Guid of the source element
 * @param sourceBranchIndex - Index of branch on which GoTo is being added
 * @param targetGuid - Guid of the target element
 * @param isReroute - Whether this is a reroute of an existing goto connection
 */
function createGoToConnection(
    flowModel: FlowModel,
    sourceGuid: Guid,
    sourceBranchIndex: number | null,
    targetGuid: Guid,
    isReroute?: boolean
): FlowModel {
    const sourceElement = flowModel[sourceGuid] as ParentNodeModel;
    const targetElement = flowModel[targetGuid];

    // If this is a reroute of an existing goto connection, first cleanup the incomingGoTo of the existing target
    if (isReroute) {
        flowModel = removeSourceFromIncomingGoTo(flowModel, sourceElement, sourceBranchIndex);
    }

    if (sourceBranchIndex == null) {
        // Deleting the connected End Element if this is not a reroute
        if (!isReroute) {
            delete flowModel[sourceElement.next!];
        }
        // Updating source element's next and pushing source guid into target element's incomingGoTo array
        sourceElement.next = targetGuid;
        targetElement.incomingGoTo!.push(sourceGuid);
    } else {
        // Deleting the connected End Element and updating the source element's
        // children/fault property as needed
        if (sourceBranchIndex === FAULT_INDEX) {
            if (!isReroute) {
                delete flowModel[sourceElement.fault!];
            }
            sourceElement.fault = targetGuid;
        } else {
            if (!isReroute) {
                delete flowModel[sourceElement.children[sourceBranchIndex]!];
            }
            sourceElement.children[sourceBranchIndex] = targetGuid;
        }
        const suffix = getSuffixForGoToConnection(sourceElement, sourceBranchIndex);
        // Pushing the sourceGud:suffix combination into target element's incomingGoTo array
        targetElement.incomingGoTo!.push(`${sourceGuid}:${suffix}`);
    }

    return flowModel;
}

/**
 * Function to remove a GoTo connection from incomingGoTo and update related elements' properties
 * @param flowModel - The flow model
 * @param sourceElement - The source element
 * @param sourceBranchIndex - Index of branch on which GoTo is being deleted
 */
function removeSourceFromIncomingGoTo(
    flowModel: FlowModel,
    sourceElement: NodeModel,
    sourceBranchIndex: number | null
) {
    if (sourceBranchIndex == null) {
        // When goto has a previous element, remove sourceGuid from incomingGoTo
        const targetElement = flowModel[sourceElement.next!];
        targetElement.incomingGoTo = targetElement.incomingGoTo!.filter((goto) => goto !== sourceElement.guid);
    } else {
        // When goto is present at the branch head, get the targetElement from the children property
        // at the right index or the Fault property
        let targetElement;
        if (sourceBranchIndex === FAULT_INDEX) {
            targetElement = flowModel[sourceElement.fault!];
        } else {
            targetElement = flowModel[(sourceElement as ParentNodeModel).children![sourceBranchIndex]!];
        }
        // Remove sourceGuid:suffix from incomingGoTo
        const suffix = getSuffixForGoToConnection(sourceElement as ParentNodeModel, sourceBranchIndex);
        targetElement.incomingGoTo = targetElement.incomingGoTo!.filter(
            (goto) => goto !== `${sourceElement.guid}:${suffix}`
        );
    }
    return flowModel;
}

/**
 * Function to remove the original source reference from target element's incomingGoTo
 * and updating the incomingGoTo with the new source reference
 * @param flowModel - The flow model
 * @param sourceElement - The source element
 * @param sourceBranchIndex - Index of branch on which GoTo is being deleted
 * @param targetGuid - Guid of the GoTo target element
 * @param newSourceGuid - Guid of the newly added element (GoTo connection's new source)
 */
function removeAndUpdateSourceReferenceInIncomingGoTo(
    flowModel: FlowModel,
    sourceElement: NodeModel,
    sourceBranchIndex: number | null,
    targetGuid: Guid,
    newSourceGuid: Guid
): FlowModel {
    // remove original source reference from target element's incomingGoTo
    // and push the new source guid into it
    flowModel = removeSourceFromIncomingGoTo(flowModel, sourceElement, sourceBranchIndex);
    flowModel[targetGuid].incomingGoTo!.push(newSourceGuid);
    return flowModel;
}

/**
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param sourceElement - Source of the GoTo connector
 * @param sourceBranchIndex - Index of branch on which GoTo is being deleted
 */
function createAndConnectEndElementOnGoToDeletion(
    elementService: ElementService,
    flowModel: FlowModel,
    sourceElement: NodeModel,
    sourceBranchIndex: number | null
): FlowModel {
    // Add and connect the end element
    const endElement = createEndElement(elementService, flowModel);
    flowModel[endElement.guid] = endElement;
    if (sourceBranchIndex == null) {
        // When goto has a previous element, connect the source element to a newly created
        // End element by updating the next property
        sourceElement.next = endElement.guid;
        endElement.prev = sourceElement.guid;
    } else {
        // When goto is present at the branch head, connect the source element to a newly created
        // End element by updating the children property at the right index or the Fault property
        if (sourceBranchIndex === FAULT_INDEX) {
            sourceElement.fault = endElement.guid;
        } else {
            (sourceElement as ParentNodeModel).children[sourceBranchIndex] = endElement.guid;
        }
        (endElement as BranchHeadNodeModel).parent = sourceElement.guid;
        (endElement as BranchHeadNodeModel).childIndex = sourceBranchIndex;
        (endElement as BranchHeadNodeModel).isTerminal = true;
    }
    return flowModel;
}

/**
 * Function to delete a GoTo connector between a given source and target
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param sourceGuid - Guid of the source element
 * @param sourceBranchIndex - Index of branch on which GoTo is being deleted
 */
function deleteGoToConnection(
    elementService: ElementService,
    flowModel: FlowModel,
    sourceGuid: Guid,
    sourceBranchIndex: number | null
): FlowModel {
    const sourceElement = flowModel[sourceGuid] as ParentNodeModel;
    removeSourceFromIncomingGoTo(flowModel, sourceElement, sourceBranchIndex);
    return createAndConnectEndElementOnGoToDeletion(elementService, flowModel, sourceElement, sourceBranchIndex);
}

/**
 * Checks if the tail element of a branch is an end element or has a GoTo connection
 * or is a branching element with all terminal branches
 *
 * @param elements - The flow elements
 * @param branchTail - A branch tail node
 * @return true if the branch tail is an end or a branching element with all terminal branches
 */
function isEndOrAllTerminalBranchingElement(elements: FlowModel, branchTail: NodeModel) {
    return (
        branchTail.nodeType === NodeType.END ||
        (branchTail.next && hasGoToConnectionOnNext(elements, branchTail)) ||
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
    const { prev } = targetElement;

    if (prev != null) {
        // if the target element has a prev element, disconnect it
        elements[prev].next = null;
        targetElement.prev = null;

        // go up the branch from prev, and mark its head as non-terminal, as the branch is now reconnected
        findFirstElement(elements[prev], elements).isTerminal = false;
    } else {
        //  otherwise the target element must be a branch head: clear its value in the parent's children array
        const targetElementAsBranchHead = resolveBranchHead(elements, targetElement.guid);
        const { parent, childIndex } = targetElementAsBranchHead;
        const parentElement = resolveParent(elements, parent);
        setChild(parentElement, childIndex, null);
        deleteBranchHeadProperties(targetElementAsBranchHead);
    }

    //  update pointers
    sourceElement.next = targetElement.guid;
    targetElement.prev = sourceElement.guid;
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

    // Prevents from setting GoTo Target's prev to the GoTo's Source
    if (next && !hasGoToConnectionOnNext(elements, element)) {
        elements[next].prev = guid;
    }

    elements[element.guid] = element;
}

/**
 * Deletes all branch head properties
 * @param headElement - a branch head element
 */
function deleteBranchHeadProperties(headElement: BranchHeadNodeModel) {
    // @ts-ignore
    delete headElement.parent;
    // @ts-ignore
    delete headElement.childIndex;
    // @ts-ignore
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

    if (childIndex === FAULT_INDEX) {
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
 * @param branchingOrFaulting - The branching or faulting element
 * @param childIndex - The child index
 * @param element - The new element
 * @returns the new branch head guid
 */
function updateBranchHead(
    state: FlowModel,
    branchingOrFaulting: NodeModel,
    childIndex: number,
    element: NodeModel | null
): NodeRef {
    // existing branch head
    const existingBranchHead = getChild(branchingOrFaulting, childIndex);

    if (element != null) {
        element.prev = null;
        const isTerminal =
            existingBranchHead != null
                ? resolveBranchHead(state, existingBranchHead).isTerminal
                : element.nodeType === NodeType.END;
        Object.assign(element, { parent: branchingOrFaulting.guid, childIndex, isTerminal });
    }

    setChild(branchingOrFaulting, childIndex, element);

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
    branchingOrFaulting: NodeModel,
    childIndex: number,
    element: NodeModel | null
) {
    const child = updateBranchHead(state, branchingOrFaulting, childIndex, element);

    if (element != null) {
        if (child != null) {
            // make the existing child follow the insert element
            const childElement = resolveBranchHead(state, child);
            Object.assign(element, { next: child, isTerminal: childElement.isTerminal });
            // @ts-ignore
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

            curr = this.down
                ? currElement.next && hasGoToConnectionOnNext(this.elements, currElement)
                    ? null
                    : currElement.next
                : currElement.prev;
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
// TODO NEED TO REMOVE BEFORE MERGE WITH MAIN
function getTargetGuidsForBranchReconnect(elements: FlowModel, sourceGuid: Guid): Guid[] {
    const { parent, childIndex } = findFirstElement(elements[sourceGuid], elements);
    const branchingElement = resolveParent(elements, parent);

    // if the branching element has a next element, then that is the only valid target guid
    if (branchingElement.next != null) {
        return [branchingElement.next];
    }

    // otherwise all the other branches must terminals
    if (!areAllBranchesTerminals(branchingElement, elements)) {
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
 * Returns an array of valid mergeable target guids to reconnect an element
 *
 * @param elements - The flow model
 * @param prev - The guid of a previous element
 * @param branchParent - The guid of the parent element
 * @param next - the guid of a next element
 * @returns An array of valid mergeable target guids
 */
function getMergeableGuids(elements: FlowModel, prev: Guid, branchParent: Guid, next: Guid): Guid[] {
    const { parent, childIndex } = findFirstElement(elements[next], elements);
    const branchingElement = elements[parent] as ParentNodeModel;

    // Making sure we do not include the branchParent if there is a goTo from the merge point to it
    if (branchingElement.next && branchingElement.next !== branchParent && branchingElement.next !== prev) {
        return [branchingElement.next];
    }

    if (areAllBranchesTerminals(branchingElement, elements)) {
        return branchingElement.children.reduce((acc: Guid[], child: NodeRef, index: number) => {
            // Getting the mergeable elements from the sibling branches.
            // Also ignoring any sibling branch that has a GoTo connection at it's branchHead
            if (
                child != null &&
                index !== childIndex &&
                !hasGoToConnectionOnBranchHead(elements, branchingElement, index)
            ) {
                const branchElements = new FlcList(elements, child).map((element) => element.guid) as Guid[];
                return acc.concat(branchElements);
            }

            return acc;
        }, []);
    }

    return [];
}

/**
 * @param prevElement The branching element
 * @returns A boolean that determines if the previous element can be selectable
 */
function isPrevSelectable(prevElement: ParentNodeModel): boolean {
    if (isBranchingElement(prevElement)) {
        // Return false if we find a null branch
        return prevElement.children.every((child) => child !== null);
    }
    return false;
}

/**
 * Recursively checks if a tail element in branch is selectable
 * @param elements The flow model
 * @param branchElementToCheck branching element
 * @returns An array of guids that are not selectable
 */
function getNonSelectableTailElementsGuids(elements: FlowModel, branchElementToCheck: ParentNodeModel): Guid[] {
    let nonSelectableTailElementsGuids = [] as Guid[];
    branchElementToCheck.children.forEach((child, i) => {
        if (!child) {
            // Branch element has an empty branch so it should not be selectable
            if (!nonSelectableTailElementsGuids.includes(branchElementToCheck.guid)) {
                nonSelectableTailElementsGuids.push(branchElementToCheck.guid);
            }
        } else if (
            !hasGoToConnectionOnBranchHead(elements, branchElementToCheck, i) &&
            !(elements[child] as BranchHeadNodeModel).isTerminal
        ) {
            // If the branch doesn't have a GoTo on the branch head and the branch head element
            // is not terminal, proceed down the branch
            const tailElement = findLastElement(resolveBranchHead(elements, child), elements);
            // If the tail is a branching element, then recurse down its children, otherwise add the tail to the list
            if (isBranchingElement(tailElement)) {
                nonSelectableTailElementsGuids = nonSelectableTailElementsGuids.concat(
                    getNonSelectableTailElementsGuids(elements, tailElement as ParentNodeModel)
                );
            } else {
                nonSelectableTailElementsGuids.push(tailElement.guid);
            }
        }
    });
    return nonSelectableTailElementsGuids;
}

function getGoToableGuids(
    elements: FlowModel,
    prev: Guid,
    parent: Guid,
    mergeableGuids: Guid[],
    firstMergeableNonNullNext: Guid | null,
    nonSelectableTailElementsGuids: Guid[]
): Guid[] {
    const goToableGuids = [];

    // Checking if the previous element can have a GoTo connection to it
    if (
        prev &&
        elements[prev].nodeType !== NodeType.START &&
        firstMergeableNonNullNext !== prev &&
        isPrevSelectable(resolveParent(elements, prev))
    ) {
        goToableGuids.push(prev);
    }

    // Iterate over every element in the flow model
    for (const elementGuid in elements) {
        if (
            !mergeableGuids.includes(elementGuid) && // Do not iterate over mergeable guids
            firstMergeableNonNullNext !== elementGuid &&
            !nonSelectableTailElementsGuids.includes(elementGuid) && // Do not iterate over tail element guids
            elements[elementGuid].isCanvasElement &&
            elementGuid !== prev &&
            elementGuid !== parent &&
            elementGuid !== NodeType.ROOT &&
            elements[elementGuid].nodeType !== NodeType.START &&
            elements[elementGuid].nodeType !== NodeType.END
        ) {
            goToableGuids.push(elementGuid);
        }
    }

    return goToableGuids;
}

/**
 * Returns an array of valid target guids of a goTo action
 *
 * @param elements - The flow model
 * @param prev - The guid of a previous element
 * @param parent - The guid of the parent element
 * @param next - the guid of a next element
 * @param canMergeEndedBranch - is merge possible
 * @returns An object containing mergeableGuids, goToableGuids and possibly firstMergeableNonNullNext
 */
function getTargetGuidsForReconnection(
    elements: FlowModel,
    prev: Guid,
    parent: Guid,
    next: Guid,
    canMergeEndedBranch: boolean
): { mergeableGuids: Guid[]; goToableGuids: Guid[]; firstMergeableNonNullNext: Guid | null } {
    // Gets all the mergeable guids
    const mergeableGuids = canMergeEndedBranch ? getMergeableGuids(elements, prev, parent, next) : [];
    // Variable to keep track of the first non-null next element of a branching element (going up the branch)
    // that the user can merge into
    let firstMergeableNonNullNext = null;

    let isSteppingOutOfFault = false;
    let branchHead = prev ? findFirstElement(elements[prev], elements) : resolveBranchHead(elements, next);
    let branchParent = elements[branchHead.parent];

    if (branchHead.childIndex === FAULT_INDEX) {
        isSteppingOutOfFault = true;
    }

    // Traversing up to find the branching element with a non-null next. We skip the Fault branch since
    // Fault branch can not be merged into anything outside itself
    while (!isSteppingOutOfFault && !isRoot(branchParent.guid) && branchParent.next == null) {
        branchHead = findFirstElement(branchParent, elements);
        branchParent = elements[branchHead.parent];
        if (branchHead.childIndex === FAULT_INDEX) {
            isSteppingOutOfFault = true;
        }
    }

    // Checking if the found next element is mergeable or not
    if (!isSteppingOutOfFault && !isRoot(branchParent.guid) && branchParent.next !== parent) {
        if (branchParent.next !== prev || isPrevSelectable(resolveParent(elements, prev))) {
            firstMergeableNonNullNext = branchParent.next;
        }
    }

    // For a Branching source element, retrieving the elements within that will create a self loop
    // aka elements that merge into the GoTo creation point
    let nonSelectableTailElementsGuids = [] as Guid[];
    if (prev && isBranchingElement(elements[prev])) {
        nonSelectableTailElementsGuids = getNonSelectableTailElementsGuids(elements, resolveParent(elements, prev));
    }

    const goToableGuids = getGoToableGuids(
        elements,
        prev,
        parent,
        mergeableGuids,
        firstMergeableNonNullNext,
        nonSelectableTailElementsGuids
    );

    return { mergeableGuids, goToableGuids, firstMergeableNonNullNext };
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
 * For an element on a branch, find its loop or branching element
 *
 * @param element - An element
 * @param flowModel- The FlowModel
 * @returns a ParentNodeModel for the element's parent
 */
function findParentElement(element: NodeModel, flowModel: FlowModel): ParentNodeModel {
    const { parent } = findFirstElement(element, flowModel);
    return flowModel[parent] as ParentNodeModel;
}

/**
 * Returns whether and element has children
 *
 * @param element - The element
 * @returns true if it has children, false otherwise
 */
export function hasChildren(element: NodeModel): element is ParentNodeModel {
    return (element as ParentNodeModel).children != null;
}

/**
 * Returns whether and element is a branching element
 *
 * @param element - The element
 * @returns true if it is a branching element, false otherwise
 */
export function isBranchingElement(node: NodeModel): node is ParentNodeModel {
    return hasChildren(node) && node.nodeType !== NodeType.LOOP;
}

/**
 * Resolves an element from its reference
 *
 * @param flowModel - The flow model
 * @param guid - The element guid or null
 * @returns The element or null if not found
 */
function resolveNode(flowModel: FlowModel, guid: Guid): NodeModel {
    const node = flowModel[guid];

    if (node == null) {
        throw new Error(`Failed to resolve node for guid: ${guid}`);
    }
    return node;
}

/**
 * Resolve a parent's child
 *
 * @param flowModel - The flow model
 * @param parentNode - The parent element
 * @param childIndex - The index of the child
 *
 * @returns The child element, or null if none exists
 */
function resolveChild(
    flowModel: FlowModel,
    parentNode: ParentNodeModel,
    childIndex: number
): BranchHeadNodeModel | null {
    let branchHeadGuid;

    if (childIndex === FAULT_INDEX) {
        branchHeadGuid = parentNode.fault;
    } else if (childIndex >= 0 && childIndex < parentNode.children.length) {
        branchHeadGuid = parentNode.children[childIndex];
    } else {
        throw new Error(`Invalid childIndex for parent: ${parentNode.guid}`);
    }

    return branchHeadGuid ? resolveBranchHead(flowModel, branchHeadGuid) : null;
}

/**
 * Resolves an element as BranchHeadNodeModel
 *
 * @param flowModel - The flow model
 * @param guid - The guid of a 'branch head' element
 * @returns The element as BranchHeadNodeModel
 */
function resolveBranchHead(flowModel: FlowModel, guid: Guid): BranchHeadNodeModel {
    const node = resolveNode(flowModel, guid);

    if (isBranchHead(node)) {
        return node;
    } else {
        throw new Error(`Invalid branch head for guid: ${guid}`);
    }
}

/**
 * Resolves an element as ParentNodeModel
 *
 * @param flowModel - The flow model
 * @param guid - The guid of a 'parent' element
 * @returns The element as ParentNodeModel
 */
function resolveParent(flowModel: FlowModel, guid: Guid): ParentNodeModel {
    return resolveNode(flowModel, guid) as ParentNodeModel;
}

/**
 * Branch head type guard
 *
 * @param node - The node to check for a branch head
 * @return true if node is a branch head, false otherwise
 */
export function isBranchHead(node: NodeModel): node is BranchHeadNodeModel {
    return (node as BranchHeadNodeModel).parent !== undefined;
}

/**
 * Deletes an element's fault
 *
 * @param elementService - The element service
 * @param state - The flow model
 * @param elementWithFaultGuid - The guid of the element with the fault
 * @return the updated flow model
 */
function deleteFault(elementService: ElementService, state: FlowModel, elementWithFaultGuid: Guid): FlowModel {
    const elementWithFault = state[elementWithFaultGuid];
    const { fault } = elementWithFault;

    if (fault) {
        // @ts-ignore
        delete elementWithFault.fault;

        deleteBranch(elementService, state, fault);
    }

    return state;
}

/**
 * Deletes an element's fault
 *
 * @param elementService - The element service
 * @param state - The flow model
 * @param elementGuid - The element guid
 * @return the updated flow model
 */
function deleteElementAndDescendents(
    elementService: ElementService,
    state: FlowModel,
    elementGuid: Guid,
    childIndexToKeep?: number
) {
    const elementToDelete = state[elementGuid];

    elementService.deleteElement(elementToDelete.guid);
    delete state[elementGuid];

    deleteElementDescendents(elementService, state, elementToDelete, childIndexToKeep);
    return state;
}

/**
 * Deletes all the elements of a branch as well as their descendants
 *
 * @param elementService - The element service
 * @param state - The flow model
 * @param branchHeadGuid - The branch head guid
 * @returns The updated flow model
 */
function deleteBranch(elementService: ElementService, state: FlowModel, branchHeadGuid: Guid) {
    new FlcList(state, branchHeadGuid).forEach((listElement) => {
        deleteElementAndDescendents(elementService, state, listElement.guid);
    });

    return state;
}

function createEndElement(elementService: ElementService, flowModel: FlowModel) {
    const elementGuid = elementService.createEndElement();
    return resolveNode(flowModel, elementGuid);
}

/**
 * Replace an element with an end element
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param element  - The element to replace
 */
function replaceWithEndElement(elementService: ElementService, flowModel: FlowModel, element: NodeModel) {
    const endElement = createEndElement(elementService, flowModel);

    if (!isBranchHead(element)) {
        const { prev } = element;
        // Adding an end element connected to the previous element
        const prevElement = flowModel[element.prev!];
        Object.assign(endElement, {
            prev,
            next: null
        });

        prevElement.next = endElement.guid;
    } else {
        const { parent, childIndex } = element;
        // Adding an end element connected to the parent element at the right childIndex
        const parentElement = resolveParent(flowModel, parent);

        Object.assign(endElement, {
            parent,
            childIndex,
            next: null,
            isTerminal: true
        });

        if (childIndex === FAULT_INDEX) {
            parentElement.fault = endElement.guid;
        } else {
            parentElement.children[childIndex] = endElement.guid;
        }
    }

    flowModel[endElement.guid] = endElement;
    const branchHead = findFirstElement(endElement, flowModel);
    branchHead.isTerminal = true;
}

/**
 * Deletes an element from a flow
 *
 * @param elementService - The element service
 * @param state - the flowModel to mutate
 * @param guid - the guid of the element to delete
 * @param options - The deletion options. Defaults to inlining and deleting all branches.
 * @returns The mutated flow model
 */
// eslint-disable-next-line complexity
function deleteElement(
    elementService: ElementService,
    state: FlowModel,
    guid: Guid,
    options: Partial<DeleteElementOptions> = {}
): FlowModel {
    const { childIndexToKeep, inline } = { ...deleteElementOptionsDefaults, ...options };
    const element = resolveNode(state, guid);
    const { prev, next, parent, childIndex } = element as BranchHeadNodeModel;

    let nextElement;
    let addEndElement = false;
    let shouldDeleteBeyondMergingPoint = false;

    const parentElement = findParentElement(element, state);

    // take care of linking tail of the branch to keep to the next element
    if (hasChildren(element)) {
        if (childIndexToKeep != null) {
            const headElement = resolveChild(state, element, childIndexToKeep);

            if (headElement) {
                if (next != null) {
                    const tailElement = findLastElement(headElement, state);

                    // If the branch to persist is terminated, elements beyond the
                    // merging point need to be deleted, otherwise tail element needs
                    // to be linked properly
                    if (headElement.isTerminal) {
                        shouldDeleteBeyondMergingPoint = true;
                    } else {
                        tailElement.next = next;
                        linkElement(state, tailElement);
                    }
                }
                deleteBranchHeadProperties(headElement);
            }

            // Need to check in the store for the case when End element is the only element in the branch
            nextElement = headElement && state[headElement.guid];
        } else {
            addEndElement = areAllBranchesTerminals(element as ParentNodeModel, state) && element.next == null;
        }
    }

    // Adding the hasGoToConnectionOnNext check here to avoid setting the GoTo target element as the next element
    nextElement = nextElement || (next && !hasGoToConnectionOnNext(state, element) ? resolveNode(state, next) : null);

    if (next && hasGoToConnectionOnNext(state, element)) {
        // When deleting an element that has an outgoing GoTo connection,
        // we need to remove the source reference from the target element's incomingGoTo array
        // and instead connect the previous or parent element to a newly created end element
        const targetElement = state[next];
        targetElement.incomingGoTo = targetElement.incomingGoTo!.filter((goto) => goto !== element.guid);
        const prevOrParentElement = prev ? state[prev] : state[parent];
        state = createAndConnectEndElementOnGoToDeletion(elementService, state, prevOrParentElement, childIndex);
    } else {
        if (parent) {
            if (childIndex === FAULT_INDEX) {
                parentElement!.fault = null;
            } else {
                (parentElement as ParentNodeModel).children[childIndex] = null;
            }
            linkBranchOrFault(state, parentElement as ParentNodeModel, childIndex, nextElement);
        } else if (nextElement) {
            nextElement.prev = prev;
            linkElement(state, nextElement);
        } else {
            // we're deleting the last element in a branch
            const prevElement = prev ? resolveNode(state, prev) : null;
            if (prevElement) {
                prevElement.next = null;
            }
        }
    }

    deleteElementAndDescendents(elementService, state, element.guid, childIndexToKeep);
    if (shouldDeleteBeyondMergingPoint && next != null) {
        deleteElementAndDescendents(elementService, state, next);
    }

    const branchHead = (parent != null
        ? nextElement
        : findFirstElement(resolveNode(state, prev!), state)) as BranchHeadNodeModel;

    // update the branch's isTerminal and attempt to inline
    if (branchHead != null) {
        const branchTail = findLastElement(branchHead, state);
        branchHead.isTerminal = isEndOrAllTerminalBranchingElement(state, branchTail);
    }

    // inline when needed
    if (
        parentElement != null &&
        childIndex !== FAULT_INDEX &&
        !addEndElement &&
        inline &&
        (!branchHead || branchHead.childIndex !== FAULT_INDEX)
    ) {
        const inlineParent =
            nextElement != null &&
            isBranchingElement(nextElement) &&
            (nextElement.next == null || state[nextElement.next]!.nodeType === NodeType.END)
                ? nextElement
                : parentElement;
        inlineFromParent(state, inlineParent as ParentNodeModel);
    }

    if (addEndElement) {
        replaceWithEndElement(elementService, state, element);
    }

    return state;
}

/**
 * Deletes an element's descendants recursively
 *
 * @param elementService - The element service
 * @param state - The flow model
 * @param element - The element to delete
 * @param childIndexToKeep - The child index to keep
 */
function deleteElementDescendents(
    elementService: ElementService,
    state: FlowModel,
    element: NodeModel,
    childIndexToKeep?: number
): void {
    let branchHeadGuids: Guid[] = [];

    // add the children guids to delete
    if (hasChildren(element)) {
        branchHeadGuids = element.children.filter((child, i): child is Guid => child != null && i !== childIndexToKeep);
    }

    // Action, CRUD and Wait (branching) elements can have a Fault path
    if (element.fault != null) {
        branchHeadGuids.push(element.fault);
    }

    // delete the branch for each branch head
    branchHeadGuids.forEach((guid) => deleteBranch(elementService, state, guid));
}

/**
 * Adds an element to the flow
 *
 * @param flowModel - The flowModel to update
 * @param elementGuid - The guid of the new element
 * @param nodeType - The node type of the new element
 * @param insertAt - The insert location for the new element
 * @returns - The flow model
 */
function addElement(flowModel: FlowModel, elementGuid: Guid, nodeType: NodeType, insertAt: InsertAt): FlowModel {
    const element = resolveNode(flowModel, elementGuid);

    validInsertAtOrThrow(flowModel, insertAt);

    if (nodeType === NodeType.END && getNodeAtInsertAt(flowModel, insertAt) != null) {
        throw new Error(`Can only add an end element when no element follows the insertAt: ${insertAt}`);
    }

    element.nodeType = nodeType;
    if (nodeType !== NodeType.END) {
        element.incomingGoTo = [];
    }
    const { prev, parent, childIndex } = insertAt;
    const sourceElement = prev ? flowModel[prev] : resolveParent(flowModel, parent);

    if (prev) {
        const next = sourceElement.next;
        element.prev = prev;
        if (next) {
            element.next = next;
            if (hasGoToConnectionOnNext(flowModel, sourceElement)) {
                // Cleaning up and updating the target element's incomingGoTo
                // with the newly added source element
                flowModel = removeAndUpdateSourceReferenceInIncomingGoTo(
                    flowModel,
                    sourceElement,
                    childIndex,
                    next,
                    elementGuid
                );
            }
        }
        linkElement(flowModel, element);
    } else {
        Object.assign(element, { parent, childIndex });
        if (hasGoToConnectionOnBranchHead(flowModel, sourceElement as ParentNodeModel, childIndex)) {
            const targetGuid =
                childIndex === FAULT_INDEX
                    ? sourceElement.fault
                    : (sourceElement as ParentNodeModel).children[childIndex];

            // Cleaning up and updating the target element's incomingGoTo
            // with the newly added source element
            flowModel = removeAndUpdateSourceReferenceInIncomingGoTo(
                flowModel,
                sourceElement,
                childIndex,
                targetGuid!,
                elementGuid
            );

            // Updating the next and isTerminal property of the newly added element
            Object.assign(element, { next: targetGuid, isTerminal: true });

            // Updating the fault/children property to incorporate the newly added element
            if (childIndex === FAULT_INDEX) {
                flowModel[sourceElement.guid].fault = elementGuid;
            } else {
                (flowModel[sourceElement.guid] as ParentNodeModel).children[childIndex] = elementGuid;
            }
        } else {
            linkBranchOrFault(flowModel, sourceElement, childIndex, element);
        }
    }

    if (element.nodeType === NodeType.END) {
        const branchHead = findFirstElement(element, flowModel);

        // mark the branch as a terminal branch
        flowModel[branchHead.guid] = { ...branchHead, isTerminal: true };
        const branchParent = resolveParent(flowModel, branchHead.parent)!;
        inlineFromParent(flowModel, branchParent);
    }

    return flowModel;
}

/**
 * Attempts to 'inline' a subtree starting at a parent element
 *
 * @param flowModel - The flow model
 * @param branchParent - The parent element
 * @returns The mutated flow model
 */
export function inlineFromParent(flowModel: FlowModel, branchParent: ParentNodeModel) {
    let branchHead;
    // when adding an end element, we might need to restructure things:
    // find the first branching ancestor with a non-null `next` and
    // attempt to inline branches from there
    while (!isRoot(branchParent.guid) && branchParent.nodeType !== NodeType.LOOP) {
        if (branchParent.next != null) {
            // once we find the first ancestor with a non-null 'next', we can inline from there,
            // the other parts of the tree are not affected by add end operation
            inlineBranches(branchParent, flowModel);

            break;
        } else {
            branchHead = findFirstElement(branchParent, flowModel);
            // can't inline across a fault boundary
            if (branchHead.childIndex === FAULT_INDEX) {
                break;
            }
            // as we go up the ancestor chain, update isTerminal as it might have been invalidated
            // by the new sub tree structure
            branchHead.isTerminal = areAllBranchesTerminals(branchParent, flowModel);
            branchParent = resolveParent(flowModel, branchHead.parent)!;
        }
    }

    return flowModel;
}

/**
 * Checks if a guid is the guid for the root element
 *
 * @param guid - A guid
 * @returns true if guid is the root guid
 */
export function isRoot(guid: Guid) {
    return guid === NodeType.ROOT;
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
    if (parentElement.nodeType === NodeType.LOOP) {
        return false;
    }

    return getNonTerminalBranchIndexes(parentElement, state).length === 0;
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

    const nonTerminalBranchIndexes = getNonTerminalBranchIndexes(parentElement, state);

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

/**
 * Returns an array of indexes of the non-terminal branches of a branching element
 * @param parentElement - The parent element
 * @param state - The flow model
 */
function getNonTerminalBranchIndexes(parentElement: ParentNodeModel, state: FlowModel) {
    return parentElement.children
        .map((child: NodeRef, index: number) => {
            // A branch is not terminal if the child guid is null or
            // if there's a regular connection between the parent and child and the child element's isTerminal is false
            if (
                child == null ||
                (!hasGoToConnectionOnBranchHead(state, parentElement, index) &&
                    !resolveBranchHead(state, child).isTerminal)
            ) {
                return index;
            } else {
                return -1;
            }
        })
        .filter((index: number | null) => index !== -1);
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
    if (!!children !== hasChildren(element)) {
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

            if (hasChildren(element)) {
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
    const rootElement = resolveParent(elements, NodeType.ROOT);
    if (rootElement != null) {
        assertAutoLayoutStateForBranch(elements, rootElement.children[0]);
    }
}

/**
 * Creates the root node for of an auto layout canvas instance
 * @returns An ALC root node
 */
export function createRootElement(): any {
    const rootType = NodeType.ROOT;

    return {
        elementType: rootType,
        nodeType: rootType,
        guid: rootType,
        name: rootType,
        label: rootType,
        text: rootType,
        value: rootType,
        prev: null,
        next: null,
        children: []
    };
}

/**
 * Initializes a flow for auto layout.
 *
 * @param flowModel - The flow model
 * @param startElementGuid - The start element's guid
 * @param endElementGuid - The end element's guid
 * @returns The updated flow
 */
export function initFlowModel(flowModel: FlowModel, startElementGuid: Guid, endElementGuid: Guid) {
    // create the root node
    const rootElement = createRootElement();
    flowModel[rootElement.guid] = rootElement;

    // link the start to the root
    const startElement = resolveNode(flowModel, startElementGuid) as BranchHeadNodeModel;
    startElement.nodeType = NodeType.START;
    linkBranchOrFault(flowModel, rootElement, 0, startElement);
    startElement.isTerminal = true;

    // link the end to the start
    const endElement = resolveNode(flowModel, endElementGuid);
    endElement.nodeType = NodeType.END;
    endElement.prev = startElementGuid;
    linkElement(flowModel, endElement);

    return flowModel;
}

/**
 * Adds a fault to an element
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param elementWithFaultGuid - The guid of the element to add a fault to
 * @returns The updated flow model
 */
export function addFault(elementService: ElementService, flowModel: FlowModel, elementWithFaultGuid: Guid) {
    const elementWithFault = resolveNode(flowModel, elementWithFaultGuid)!;
    const endElement = createEndElement(elementService, flowModel);

    Object.assign(endElement, {
        prev: null,
        next: null
    });

    linkBranchOrFault(flowModel, elementWithFault, FAULT_INDEX, endElement);

    return flowModel;
}

/**
 * Returns the items of SetA that are not in SetB, excluding null and undefined values
 *
 * @param setA
 * @param setB
 */
function minus<T>(setA: Set<T>, setB: Set<T>): Set<NonNullable<T>> {
    const minusSet = new Set<NonNullable<T>>();
    for (const value of setA.values()) {
        if (!setB.has(value) && value != null) {
            minusSet.add(value!);
        }
    }

    return minusSet;
}

/**
 * Updates an element's children
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param originalParentElement - The original parent element before the update
 * @param updatedChildrenGuids - The updated children guids
 * @returns The updated flow model
 */
export function updateChildren(
    elementService: ElementService,
    flowModel: FlowModel,
    originalParentElement: ParentNodeModel,
    updatedChildrenGuids: (Guid | null)[]
) {
    const parentElement = resolveParent(flowModel, originalParentElement.guid);
    const allTerminals = areAllBranchesTerminals(originalParentElement, flowModel);

    const currentChildren = new Set(parentElement.children);
    const newChildren = new Set(updatedChildrenGuids);

    const childrenAdded = minus(newChildren, currentChildren);
    if (childrenAdded.size > 0) {
        throw new Error("can't update the children array with guids that weren't previously in it");
    }

    const childrenRemoved = minus(currentChildren, newChildren);

    // for children that have been removed, delete their branch
    for (const child of childrenRemoved) {
        if (child != null) {
            deleteBranch(elementService, flowModel, child);
        }
    }

    // recompute childIndex for the remaining branches
    updatedChildrenGuids.forEach((child, i) => {
        if (child) {
            const branchHead = resolveBranchHead(flowModel, child);
            branchHead.childIndex = i;
        }
    });

    // if all the branches were terminating before the update, then make any new branch terminate
    // as well by adding an end element
    if (allTerminals) {
        for (let i = 0; i < updatedChildrenGuids.length; i++) {
            const child = updatedChildrenGuids[i];
            if (child == null) {
                const endElement = createEndElement(elementService, flowModel) as BranchHeadNodeModel;
                endElement.childIndex = i;
                endElement.parent = parentElement.guid;
                endElement.isTerminal = true;
                updatedChildrenGuids[i] = endElement.guid;
            }
        }
    }

    parentElement.children = updatedChildrenGuids;

    // if all branches are terminals after the update, then delete the parent's next if it has one
    const allTerminalsAfterUpdate = areAllBranchesTerminals(parentElement, flowModel);
    const { next } = parentElement;

    if (allTerminalsAfterUpdate) {
        if (next) {
            deleteBranch(elementService, flowModel, next);
        }
        parentElement.next = null;

        findFirstElement(parentElement, flowModel).isTerminal = true;
    } else if (next) {
        // possibly inline if we have a next, and a single non-terminal branch exists
        inlineFromParent(flowModel, parentElement);
    }

    return flowModel;
}

/**
 * Updates start element's children when time triggers are added or updated
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param originalParentElement - The original parent element before the update
 * @param updatedChildrenGuids - The updated children guids
 * @returns The updated flow model
 */
export function updateChildrenOnAddingOrUpdatingTimeTriggers(
    elementService: ElementService,
    flowModel: FlowModel,
    originalParentElement: ParentNodeModel,
    updatedChildrenGuids: (Guid | null)[]
) {
    const parentElementGuid = originalParentElement.guid;
    const parentElement = resolveParent(flowModel, parentElementGuid);
    const { children, childReferences } = parentElement;

    if (childReferences!.length > 0) {
        if (children) {
            updateChildren(elementService, flowModel, originalParentElement, updatedChildrenGuids);
        } else {
            // To handle the case when children have not yet been added
            parentElement.children = updatedChildrenGuids;
            // If the parent had a next element it should become the first child (with childIndex = 0)
            const nextElementGuid = parentElement.next!;
            const nextElement = resolveNode(flowModel, nextElementGuid) as BranchHeadNodeModel;
            parentElement.children[0] = nextElementGuid;
            nextElement.parent = parentElement.guid;
            nextElement.isTerminal = true;
            nextElement.childIndex = START_IMMEDIATE_INDEX;
            nextElement.prev = null;
            parentElement.next = null;

            for (let i = 1; i < updatedChildrenGuids.length; i++) {
                const endElement = createEndElement(elementService, flowModel) as BranchHeadNodeModel;
                endElement.childIndex = i;
                endElement.parent = parentElement.guid;
                endElement.isTerminal = true;
                updatedChildrenGuids[i] = endElement.guid;
            }
        }
    } else if (children) {
        // Case when deleting all time triggers
        // Delete all the branches from index 1 -> n
        for (let i = 1; i < children.length; i++) {
            if (children[i]) {
                deleteBranch(elementService, flowModel, children[i]!);
            }
        }
        // If 0th branch has an element, connect the last element on the 0th branch to start's next. Set start's next to
        // 0th branch's branch head. Also update the previous pointers correctly
        const immediateBranchHeadElementGuid = parentElement.children[START_IMMEDIATE_INDEX];
        const immediateBranchHeadElement = immediateBranchHeadElementGuid
            ? resolveBranchHead(flowModel, immediateBranchHeadElementGuid)
            : null;
        if (immediateBranchHeadElement) {
            const lastElementInBranch = findLastElement(immediateBranchHeadElement, flowModel);
            if (!immediateBranchHeadElement.isTerminal) {
                // If the branch head is NOT terminal: connect last element in branch to next element
                lastElementInBranch.next = parentElement.next;
                flowModel[parentElement.next!].prev = lastElementInBranch.guid;
            } else {
                // If branch head is terminal: delete any elements beyond merge point
                if (parentElement.next) {
                    deleteBranch(elementService, flowModel, parentElement.next);
                }
            }
            // Connect parent to the branch head and remove branch head properties of the branch head as it is not
            // branch head anymore
            parentElement.next = immediateBranchHeadElementGuid;
            immediateBranchHeadElement.prev = parentElementGuid;
            deleteBranchHeadProperties(immediateBranchHeadElement);
            if (lastElementInBranch.nodeType === NodeType.BRANCH) {
                // To handle branch nodes' branches that are terminal
                inlineFromParent(flowModel, lastElementInBranch as ParentNodeModel);
            }
        }
        delete (parentElement as StartNodeModel).children;
    }

    return flowModel;
}

/**
 * Decorates elements in the flow model with connector highlight info
 *
 * @param flowModel flow model
 * @param decoratedElements map of element guids to highlight info
 */
export function decorateElements(flowModel: FlowModel, decoratedElements: Map<Guid, HighlightInfo>): FlowModel {
    decoratedElements.forEach((highlightInfo, guid) => {
        const node = resolveNode(flowModel, guid);
        node.config.highlightInfo = highlightInfo;
    });

    return flowModel;
}

/**
 * Clears canvas decoration info on all elements in the flow model
 *
 * @param flowModel flow model
 */
export function clearCanvasDecoration(flowModel: FlowModel): FlowModel {
    Object.values(flowModel).forEach((element) => {
        if (element.config) {
            element.config.highlightInfo = null;
        }
    });

    return flowModel;
}

/**
 * Returns boolean to indicate if the passed start node can support time triggers
 *
 * @param node - The start node
 * @returns boolean indicating if the start node supports time triggers
 */
export function shouldSupportTimeTriggers(node: StartNodeModel) {
    // TODO: W-8882792 Duplicated the method in rendering layer form ui layer. Find a better way to do this.
    const {
        nodeType,
        triggerType,
        object,
        recordTriggerType,
        doesRequireRecordChangedToMeetCriteria,
        filterLogic
    } = node;
    return (
        nodeType === NodeType.START &&
        triggerType === 'RecordAfterSave' &&
        object &&
        (recordTriggerType === 'Create' || (doesRequireRecordChangedToMeetCriteria && filterLogic !== 'no_conditions'))
    );
}

export function fulfillsBranchingCriteria(node: NodeModel, type: NodeType) {
    return type === NodeType.BRANCH || ((node as ParentNodeModel).children && type === NodeType.START);
}

export {
    assertAutoLayoutState,
    getTargetGuidsForBranchReconnect,
    connectToElement,
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
    resolveChild,
    resolveNode,
    resolveBranchHead,
    resolveParent,
    inlineBranches,
    getTargetGuidsForReconnection,
    createGoToConnection,
    deleteGoToConnection,
    removeSourceFromIncomingGoTo,
    hasGoToConnectionOnNext,
    hasGoToConnectionOnBranchHead
};
