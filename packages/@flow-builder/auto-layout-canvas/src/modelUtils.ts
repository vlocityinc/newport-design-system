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
    START_IMMEDIATE_INDEX,
    FOR_EACH_INDEX,
    GoToSourceRef,
    ConnectionSource
} from './model';

import NodeType from './NodeType';

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
 * Function for making deep copy of a FlowModel
 *
 * @param element The FlowModel to be copied
 * @returns The New copied FlowModel
 * @private
 */
function deepCopy(element: FlowModel) {
    return JSON.parse(JSON.stringify(element));
}

const gotoUtils = {
    /**
     * Returns the suffix for the GoTo connection being pushed into the Target element's incomingGoTo []
     *
     * @param flowModel - The flow model
     * @param source - The connection source
     * @returns the goto source ref suffix if any
     */
    getSuffixForGoToConnection(flowModel: FlowModel, source: ConnectionSource) {
        const { guid, childIndex } = source;

        if (childIndex == null) {
            return null;
        }

        const { nodeType, childReferences } = resolveParent(flowModel, guid);

        // Should be START_IMMEDIATE_INDEX for Start Node and length of childReferences for other branching elements
        const defaultIndex =
            nodeType === NodeType.BRANCH && childReferences
                ? childReferences.length
                : nodeType === NodeType.START
                ? START_IMMEDIATE_INDEX
                : nodeType === NodeType.LOOP
                ? FOR_EACH_INDEX
                : null;
        if (childIndex === defaultIndex) {
            return nodeType === NodeType.START
                ? GOTO_CONNECTION_SUFFIX.IMMEDIATE
                : nodeType === NodeType.LOOP
                ? GOTO_CONNECTION_SUFFIX.FOR_EACH
                : GOTO_CONNECTION_SUFFIX.DEFAULT;
        } else if (childIndex === FAULT_INDEX) {
            return GOTO_CONNECTION_SUFFIX.FAULT;
        } else if (childReferences != null) {
            // Accounting for Immediate Branch being on the 0th index in case of Start Element
            const referenceIndex = nodeType === NodeType.START ? childIndex - 1 : childIndex;
            return childReferences[referenceIndex].childReference;
        }
        return null;
    },

    /**
     * Creates a goto source reference
     *
     * @param flowModel - The flow model
     * @param source - The connection source
     * @returns The goto source reference
     */
    createGoToSourceRef(flowModel: FlowModel, source: ConnectionSource): GoToSourceRef {
        const suffix = getSuffixForGoToConnection(flowModel, source);
        return suffix != null ? `${source.guid}:${suffix}` : source.guid;
    },

    /**
     * Parses a goto source reference into its guid and suffix
     *
     * @param gotoSourceRef - A goto source reference
     * @returns The parsed reference
     */
    parseGoToSourceRef(gotoSourceRef: GoToSourceRef) {
        const [sourceGuid, suffix] = gotoSourceRef.split(':');
        return { sourceGuid, suffix };
    },

    /**
     * Checks for the presence of a goto on a connection source
     *
     * @param flowModel - The flow model
     * @param source - The connection source
     * @returns true if there is a goto, false otherwise
     */
    hasGoTo(flowModel: FlowModel, source: ConnectionSource) {
        const goToSourceRef = createGoToSourceRef(flowModel, source);
        const target = getConnectionTarget(flowModel, source);
        return target != null ? (resolveNode(flowModel, target).incomingGoTo || []).includes(goToSourceRef) : false;
    },

    /**
     * Checks for the presence of a goto on a branch head
     *
     * @param flowModel - The flow model
     * @param parentGuid - The parent guid
     * @param childIndex - The child index
     * @returns true if there is a goto, false otherwise
     */
    hasGoToOnBranchHead(flowModel: FlowModel, parentGuid: Guid, childIndex: number) {
        return hasGoTo(flowModel, { guid: parentGuid, childIndex });
    },

    /**
     * Checks for the presence of a goto on an element's next
     *
     * @param flowModel - The flow model
     * @param guid - The element's guid
     * @returns true if there is a goto, false otherwise
     */
    hasGoToOnNext(flowModel: FlowModel, guid: Guid) {
        return hasGoTo(flowModel, { guid });
    },

    /**
     * Determines the branch index associated with a given source guid and the goTo suffix
     *
     * @param flowModel - The flow model
     * @param sourceGuid - The guid of the source element
     * @param goToSuffix - Suffix associated with the incomingGoTo if any
     * @returns The branch index associated with the GoTo connection
     */
    getBranchIndexForGoToConnection(
        flowModel: FlowModel,
        sourceGuid: Guid,
        goToSuffix: GOTO_CONNECTION_SUFFIX | string
    ): number {
        const sourceElement = resolveParent(flowModel, sourceGuid);

        if (
            goToSuffix === GOTO_CONNECTION_SUFFIX.IMMEDIATE ||
            goToSuffix === GOTO_CONNECTION_SUFFIX.FOR_EACH ||
            goToSuffix === GOTO_CONNECTION_SUFFIX.DEFAULT
        ) {
            // Should be START_IMMEDIATE_INDEX for Start Element, FOR_EACH_INDEX for Loop Element
            // and length of childReferences for other branching elements
            return sourceElement.nodeType === NodeType.BRANCH && sourceElement.childReferences
                ? sourceElement.childReferences.length
                : sourceElement.nodeType === NodeType.START
                ? START_IMMEDIATE_INDEX
                : FOR_EACH_INDEX;
        } else if (
            goToSuffix !== GOTO_CONNECTION_SUFFIX.FAULT &&
            sourceElement.childReferences &&
            sourceElement.childReferences.length > 0
        ) {
            const index = sourceElement.childReferences.findIndex((child) => goToSuffix === child.childReference);
            if (index >= 0) {
                // Accounting for Immediate Branch being on the 0th index in case of Start Element
                return sourceElement.nodeType === NodeType.START ? index + 1 : index;
            }
        }

        // The only remaining possibility is that the GoTo is present on the Fault branch head
        return FAULT_INDEX;
    },

    /**
     * Function to create a GoTo connector between a given source and target
     *
     * @param elementService - The element service
     * @param flowModel - The flow model
     * @param source - The connection source
     * @param targetGuid - Guid of the target element
     * @param isReroute - Whether this is a reroute of an existing goto connection
     * @returns The flow model
     */
    createGoToConnection(
        elementService: ElementService,
        flowModel: FlowModel,
        source: ConnectionSource,
        targetGuid: Guid,
        isReroute?: boolean
    ): FlowModel {
        const { guid: sourceGuid, childIndex: sourceBranchIndex } = source;

        if (isReroute) {
            // In case there's a GoTo, deleting it to connect the source to a newly create End element
            flowModel = removeSourceFromIncomingGoTo(flowModel, source);
        } else if (getConnectionSourceTarget(flowModel, source) == null) {
            // creating GoTo without ending branch
            flowModel = addElement(flowModel, createEndElement(elementService, flowModel).guid, NodeType.END, source);
        }

        const sourceElement = resolveParent(flowModel, sourceGuid);
        const targetElement = flowModel[targetGuid];

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

            // Pushing the into goto source reference into the target element's incomingGoTo array
            const goToSourceRef = createGoToSourceRef(flowModel, source);
            targetElement.incomingGoTo!.push(goToSourceRef);
        }

        return flowModel;
    },

    /**
     * Function to remove a GoTo connection from incomingGoTo and update related elements' properties
     *
     * @param flowModel - The flow model
     * @param source  - The connection source
     * @returns The flow model
     */
    removeSourceFromIncomingGoTo(flowModel: FlowModel, source: ConnectionSource): FlowModel {
        const target = getConnectionTarget(flowModel, source);
        const targetElement = resolveNode(flowModel, target!);
        const goToSourceRef = createGoToSourceRef(flowModel, source);
        targetElement.incomingGoTo = targetElement.incomingGoTo!.filter((goto) => goto !== goToSourceRef);

        return flowModel;
    },

    /**
     * Removes goTos from an element and its descendants
     *
     * @param flowModel - The flow model
     * @param element - An element
     * @returns The element without goTos
     */
    removeGoTosFromElement(flowModel: FlowModel, element: NodeModel) {
        const partialFlowModel = {} as any;
        partialFlowModel[element.guid] = element;
        const nextElement = flowModel[element.next!];

        if (nextElement && nextElement.incomingGoTo) {
            partialFlowModel[nextElement.guid] = nextElement;
            element.next = hasGoToOnNext(partialFlowModel, element.guid) ? null : element.next;
        }

        if (hasChildren(element)) {
            element.children = element.children.map((childGuid, index) => {
                const branchHeadElement = flowModel[childGuid!];
                let hasGoToOnHead = false;
                if (branchHeadElement) {
                    partialFlowModel[childGuid!] = branchHeadElement;
                    hasGoToOnHead = hasGoToOnBranchHead(partialFlowModel, element.guid, index);
                }
                return !hasGoToOnHead ? childGuid : null;
            });
        }

        if (element.fault) {
            const faultBranchHead = flowModel[element.fault];
            if (faultBranchHead) {
                partialFlowModel[element.fault] = faultBranchHead;
                if (hasGoToOnBranchHead(partialFlowModel, element.guid, FAULT_INDEX)) {
                    element.fault = null;
                }
            }
        }
        return element;
    },

    /**
     * Function to remove the original source reference from target element's incomingGoTo
     * and updating the incomingGoTo with the new source reference
     *
     * @param flowModel - The flow model
     * @param source - The connection source
     * @param targetGuid - Guid of the GoTo target element
     * @param newSource - The new connection source
     * @returns The flow model
     */
    removeAndUpdateSourceReferenceInIncomingGoTo(
        flowModel: FlowModel,
        source: ConnectionSource,
        targetGuid: Guid,
        newSource: ConnectionSource
    ): FlowModel {
        // remove original source reference from target element's incomingGoTo
        // and push the new source guid into it
        flowModel = removeSourceFromIncomingGoTo(flowModel, source);

        const goToSourceRef = createGoToSourceRef(flowModel, newSource);
        flowModel[targetGuid].incomingGoTo!.push(goToSourceRef);
        return flowModel;
    }
};

export const {
    getSuffixForGoToConnection,
    createGoToSourceRef,
    parseGoToSourceRef,
    hasGoTo,
    hasGoToOnBranchHead,
    hasGoToOnNext,
    getBranchIndexForGoToConnection,
    createGoToConnection,
    removeSourceFromIncomingGoTo,
    removeGoTosFromElement,
    removeAndUpdateSourceReferenceInIncomingGoTo
} = gotoUtils;

/**
 * Get the target for a connection source
 *
 * @param flowModel - The flow model
 * @param source - The connection source
 * @returns The target guid or null
 */
function getConnectionTarget(flowModel: FlowModel, source: ConnectionSource): Guid | null {
    const { guid, childIndex } = source;
    const sourceElement = resolveNode(flowModel, guid);
    return childIndex != null ? getChild(sourceElement, childIndex) : sourceElement.next;
}

/**
 * Checks if target element is on a self loop.
 *
 * @param flowModel - The flow model
 * @param targetGuid - The target element guid
 * @param sourceElement - The connection source
 * @returns true if target element is on a self loop, false if not
 */
function isGoingBackToAncestorLoop(flowModel: FlowModel, targetGuid: Guid, sourceElement: NodeModel): boolean {
    if (flowModel[targetGuid].nodeType !== NodeType.LOOP) {
        return false;
    } else {
        let currentParent = sourceElement;

        while (!isRoot(currentParent.guid) && currentParent.guid !== targetGuid) {
            currentParent = findParentElement(currentParent, flowModel);
        }

        return currentParent.guid === targetGuid;
    }
}

/**
 * Find the first branching ancestor with a non-null next for a given source and return its next.
 *
 * @param flowModel - The flow model
 * @param sourceElement - The connection source
 * @returns the next guid of the first branching ancestor with non-null next
 */
function getFirstNonNullNext(flowModel: FlowModel, sourceElement: NodeModel): Guid {
    let currentParent = sourceElement;

    while (currentParent.next == null && !isRoot(currentParent.guid) && currentParent.nodeType !== NodeType.LOOP) {
        currentParent = findParentElement(currentParent, flowModel);
    }

    // This exception should never be thrown since it should never reach root.
    if (isRoot(currentParent.guid)) {
        throw new Error(`Bug found: ${currentParent} is a root node when it should not be.`);
    }

    return currentParent.nodeType === NodeType.LOOP ? (currentParent.guid as Guid) : (currentParent.next as Guid);
}

/**
 * Checks if a branch at a given childIndex is terminal or not.
 * A branch is terminal if it has a GoTo connection at the branch head
 * or if the branchHead element's isTerminal property is set to true
 *
 * @param flowModel - The flow model
 * @param element - The element whose branch is being evaluated
 * @param childIndex - Child index of the branch being evaluated
 * @returns true if the branch is terminal
 */
function isBranchTerminal(flowModel: FlowModel, element: NodeModel, childIndex: number) {
    const branchHeadGuid = getChild(element, childIndex);
    if (branchHeadGuid == null) {
        return false;
    }

    return (
        hasGoToOnBranchHead(flowModel, element.guid, childIndex) ||
        resolveBranchHead(flowModel, branchHeadGuid).isTerminal
    );
}

/**
 * Returns the target of a ConnectionSource
 *
 * @param flowModel - The flow model
 * @param source - The connection source
 * @returns The target
 */
function getConnectionSourceTarget(flowModel: FlowModel, source: ConnectionSource): NodeModel | null {
    const { childIndex } = source;
    let guid: string | null = source.guid;

    if (childIndex != null) {
        const parentElement = resolveParent(flowModel, guid);
        guid = getChild(parentElement, childIndex);
    } else {
        const element = resolveNode(flowModel, guid);
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
 * Verifies that a ConnectionSource location exists, throws an error otherwise
 *
 * @param flowModel - The flowModel
 * @param source - The connection source
 * @throws An error if the ConnectionSource location doesn't exist
 */
function validConnectionSourceOrThrow(flowModel: FlowModel, source: ConnectionSource) {
    const { guid, childIndex } = source;

    if (childIndex != null) {
        const parentElement = resolveParent(flowModel, guid);
        validChildIndexOrThrow(parentElement, childIndex);
    } else {
        resolveNode(flowModel, guid);
    }
}

/**
 * Used to get the flow model in the desired state for goto selection logic
 *
 * @param elements - The flow model
 * @param source - The connection source
 * @param targetGuid - Either the next element guid or null (branch not ended)
 * @returns - FlowModel
 */
function prepareFlowModel(elements: FlowModel, source: ConnectionSource, targetGuid: Guid | null): FlowModel {
    // If there is an end element or goto then return the current FlowModel
    if (targetGuid) {
        return elements;
    }
    // If the branch is not ended, we need to "fake" end the branch to get the flowModel in the correct state
    const fakeFlowModel = deepCopy(elements);
    fakeFlowModel.temporaryEndElement = { guid: 'temporaryEndElement' };
    return addElement(fakeFlowModel, 'temporaryEndElement', NodeType.END, source);
}

/**
 * Returns the non-merging branching ancestors for a given source.
 * The non-merging branching ancestors are all branching ancestors of source that don't have
 * merging branches.
 *
 * @param elements - The flow elements
 * @param source - The connection source
 * @returns an array of non-merging branching ancestors
 */
function getBranchingAncestors(elements: FlowModel, source: ConnectionSource): Set<Guid> {
    const branchingAncestors = new Set<Guid>();
    let currAncestor = elements[source.guid];

    // go up to tree, adding to the elements branchingAncestors, until we reach the root
    while (currAncestor != null && currAncestor.nodeType !== NodeType.ROOT) {
        branchingAncestors.add(currAncestor.guid);
        currAncestor = findParentElement(currAncestor, elements);
    }

    return branchingAncestors;
}

/**
 * Find the branching ancestor of a source and target, if any.
 *
 * The branching ancestor is the first branching element that is common to both
 * the source and target that can be reached without crossing any fault or loop boundaries.
 *
 * @param elements - The flow elements
 * @param source - The connection source
 * @param target - The target
 * @returns The branching ancestor for source and target, or null if none
 */
function findBranchingAncestor(elements: FlowModel, source: ConnectionSource, target: Guid): Guid | null {
    const sourceAncestors = getBranchingAncestors(elements, source);
    const targetAncestors = getBranchingAncestors(elements, { guid: target });

    for (const ancestor of sourceAncestors) {
        if (targetAncestors.has(ancestor)) {
            return ancestor;
        }
    }

    return null;
}

/**
 * Updates the isTerminal between a merging element and its branching ancestor
 *
 * @param flowModel The flow model
 * @param descendent - The descendent element guid
 * @param ancestor - The ancestor element guid
 */
function updateIsTerminalBetweenElements(flowModel: FlowModel, descendent: Guid, ancestor: Guid) {
    let branchHead = findFirstElement(flowModel[descendent], flowModel);

    while (branchHead.parent !== ancestor) {
        branchHead.isTerminal = false;
        branchHead = findFirstElement(flowModel[branchHead.parent], flowModel);
    }

    branchHead.isTerminal = false;
}

/**
 * Creates a merge connection between the source and a mergeable target
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param source The connection source.
 * @param targetGuid - The guid of the element to connect to
 * @param branchingAncestorGuid - The branching ancestor guid
 * @returns The updated flow model
 */
function createConnectionHelper(
    elementService: ElementService,
    flowModel: FlowModel,
    source: ConnectionSource,
    targetGuid: Guid,
    branchingAncestorGuid: Guid
): FlowModel {
    const endElement = getConnectionSourceTarget(flowModel, source);
    if (!endElement || endElement.nodeType !== NodeType.END) {
        throw new Error('When connecting, an end node must the target of a ConnectionSource');
    }

    validElementGuidOrThrow(flowModel, targetGuid);

    const targetElement = flowModel[targetGuid];
    const branchingAncestor = flowModel[branchingAncestorGuid];

    // mark all branches from the source up the branching ancestor as non-terminals
    if (source.guid !== branchingAncestorGuid) {
        updateIsTerminalBetweenElements(flowModel, source.guid, branchingAncestorGuid);
    }
    // mark all branches from the target up the branching ancestor as non-terminals
    updateIsTerminalBetweenElements(flowModel, targetGuid, branchingAncestorGuid);
    delete flowModel[endElement.guid];

    if (source.childIndex == null) {
        flowModel[source.guid].next = null;
    } else {
        resolveParent(flowModel, source.guid).children[source.childIndex] = null;
    }

    // now make the targetElement becomes the merge element
    connectElements(flowModel, branchingAncestor, targetElement);

    return flowModel;
}

/**
 * Creates a connection from a ConnectionSource to a target element.
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param source - The connection source.
 * @param targetGuid - The guid of the element to connect to
 * @param isMergeableGuid - True if the target is part of mergeableGuids
 * @returns The updated flow model
 */
function connectToElement(
    elementService: ElementService,
    flowModel: FlowModel,
    source: ConnectionSource,
    targetGuid: Guid,
    isMergeableGuid: boolean
): FlowModel {
    if (hasGoTo(flowModel, source)) {
        // In case there's a GoTo, deleting it to connect the source to a newly create End element
        flowModel = deleteGoToConnection(elementService, flowModel, source);
    } else if (getConnectionSourceTarget(flowModel, source) == null) {
        // creating GoTo without ending branch
        flowModel = addElement(flowModel, createEndElement(elementService, flowModel).guid, NodeType.END, source);
    }

    if (isMergeableGuid) {
        const branchingAncestorGuid = findBranchingAncestor(flowModel, source, targetGuid);
        if (branchingAncestorGuid) {
            // Connects the source and the target and updates the prev, next etc properties correctly
            flowModel = createConnectionHelper(elementService, flowModel, source, targetGuid, branchingAncestorGuid);
        }
    } else {
        // Deleting the end element automatically connects the source to the firstMergeableNonNullNext
        const endElement = getConnectionSourceTarget(flowModel, source);
        flowModel = deleteElement(elementService, flowModel, endElement!.guid);
    }

    return flowModel;
}

/**
 * Creates an end element and adds it to the flow
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param source - The source for the end element
 * @returns The flow model
 */
function createAndConnectEndElement(
    elementService: ElementService,
    flowModel: FlowModel,
    source: ConnectionSource
): FlowModel {
    const { childIndex: sourceBranchIndex } = source;
    const sourceElement = resolveParent(flowModel, source.guid);

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
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param source - The source of the goto
 * @returns Updated FlowModel
 */
function deleteGoToConnection(
    elementService: ElementService,
    flowModel: FlowModel,
    source: ConnectionSource
): FlowModel {
    flowModel = removeSourceFromIncomingGoTo(flowModel, source);
    return createAndConnectEndElement(elementService, flowModel, source);
}

/**
 * Checks if the tail element of a branch is an end element or has a GoTo connection
 * or is a branching element with all terminal branches
 *
 * @param elements - The flow elements
 * @param branchTail - A branch tail node
 * @returns true if the branch tail is an end or a branching element with all terminal branches
 */
function isEndOrAllTerminalBranchingElement(elements: FlowModel, branchTail: NodeModel) {
    return (
        branchTail.nodeType === NodeType.END ||
        (branchTail.next && hasGoToOnNext(elements, branchTail.guid)) ||
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
 *
 * @param elements - the guid -> element map
 * @param element - the element to link and add
 */
function linkElement(elements: FlowModel, element: NodeModel): void {
    const { prev, next, guid } = element;

    elements[guid] = element;

    if (prev) {
        const prevElement = elements[prev];
        prevElement.next = guid;
    }

    // Prevents from setting GoTo Target's prev to the GoTo's Source
    if (next && !hasGoToOnNext(elements, element.guid)) {
        elements[next].prev = guid;
    }

    elements[element.guid] = element;
}

/**
 * Deletes all branch head properties
 *
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
 * @returns The guid for the child or fault
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
 * @param isGoto - true if the child is a goto, false otherwise
 */
function setChild(element: NodeModel, childIndex: number, childElement: NodeModel | null, isGoto = false): void {
    const childElementGuid = childElement != null ? childElement.guid : null;

    if (childIndex === FAULT_INDEX) {
        element.fault = childElementGuid;
    } else {
        (element as ParentNodeModel).children[childIndex] = childElementGuid;
    }

    if (childElement != null && !isGoto) {
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
 *
 * @param state - The flow model
 * @param branchingOrFaulting - The branching or faulting element
 * @param childIndex - The child index of the branch/fault
 * @param element - The element for the branch head if any
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

type AlcListCallback = (element: NodeModel, index?: number) => any;
type AlcListPredicate = (guid: string) => boolean;

/**
 * Linked list interface to navigate a flow
 */
class AlcList {
    private down: boolean;
    private tailPredicate: AlcListPredicate;

    /**
     *
     * @param elements - a map of all elements by guid
     * @param head - the guid of the head
     * @param config - A config object
     * @param config.tail - tail: the guid of the tail or a tail predicate fct, down: whether to navigate up or down
     * @param config.down - down
     */
    constructor(
        private elements: FlowModel,
        private head: string,
        { tail, down = true }: { tail?: AlcListPredicate; down?: boolean } = {}
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

    map(callback: AlcListCallback): any[] {
        return this._map(callback).results;
    }

    forEach(callback: AlcListCallback) {
        this._map(callback, false);
    }

    _map(callback: AlcListCallback | null, accumulate = true) {
        const results: NodeModel[] = [];

        let curr: NodeRef = this.head;
        let currElement: NodeModel | null = null;

        let index = 0;
        while (curr != null && this.tailPredicate(curr)) {
            currElement = this.elements[curr];

            const isGoToOnNext = hasGoToOnNext(this.elements, currElement.guid);
            if (callback) {
                const result = callback(this.elements[curr], index++);
                if (accumulate) {
                    results.push(result);
                }
            }

            curr = this.down ? (isGoToOnNext ? null : currElement.next) : currElement.prev;
        }

        return { results, last: currElement || this.elements[this.head] };
    }
}

/**
 * Returns the branchHead element (if any) of a given branch
 *
 * @param elements - The flow model
 * @param source - The connection source
 * @param next - the guid of a next element
 * @returns The branchHead element or null if there isn't any
 */
function getBranchHead(
    elements: FlowModel,
    source: ConnectionSource,
    next: Guid /* TODO: remove this argument, it shouldn't be here */
): BranchHeadNodeModel | null {
    const { guid, childIndex } = source;

    return childIndex == null
        ? findFirstElement(elements[guid], elements)
        : hasGoToOnBranchHead(elements, guid, childIndex) || !next // If GoTo on branchHead then return null since there is element for branchHead
        ? null
        : resolveBranchHead(elements, next);
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
 *
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
        } else if (!isBranchTerminal(elements, branchElementToCheck, i)) {
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

/**
 * Returns the valid goto targets
 *
 * @param elements - Flow elements
 * @param prev - The guid of the previous element
 * @param parent - The parent element guid
 * @param mergeableGuids - Array of mergeable guids
 * @param firstMergeableNonNullNext - first mergable next element
 * @param nonSelectableTailElementsGuids - Array of not selectable guids
 * @returns An array of valid goto targets
 */
function getValidGoToTargets(
    elements: FlowModel,
    prev: Guid,
    parent: Guid,
    mergeableGuids: Guid[],
    firstMergeableNonNullNext: Guid | null,
    nonSelectableTailElementsGuids: Guid[]
): Guid[] {
    const goToableGuids: Guid[] = [];

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
 * Returns an array of valid mergeable target guids to reconnect an element
 *
 * @param elements - The flow model
 * @param branchParent - The source's branching parent
 * @param childIndexes - The indexes to avoid including to the mergeables guids
 * @returns An array of valid mergeable target guids
 */
function getMergeableGuids(elements: FlowModel, branchParent: ParentNodeModel, childIndexes: number[]): Guid[] {
    let branchElements = [] as Guid[];
    const amountOfNonTerminalBranches = getNonTerminalBranchIndexes(branchParent, elements).length;
    if ((branchParent.next == null && amountOfNonTerminalBranches <= 1) || childIndexes.length > 1) {
        branchParent.children.forEach((child, i) => {
            // Getting the mergeable elements from the sibling branches.
            // Also ignoring any sibling branch that has a GoTo connection at it's branchHead
            if (
                child != null &&
                !childIndexes.includes(i) &&
                !hasGoToOnBranchHead(elements, branchParent.guid, i) &&
                !(resolveBranchHead(elements, child).isTerminal && amountOfNonTerminalBranches === 1)
            ) {
                branchElements = branchElements.concat(
                    new AlcList(elements, child).map((element) => element.guid) as Guid[]
                );
                const tailElement = findLastElement(resolveBranchHead(elements, child), elements);
                if (isBranchingElement(tailElement)) {
                    branchElements = branchElements.concat(
                        getMergeableGuids(elements, tailElement as ParentNodeModel, [])
                    );
                }
            }
        });
    }
    return branchElements;
}

/**
 * Returns an array of valid target guids of a goTo action
 *
 * @param elements - The flow model
 * @param source - The connection source
 * @param next - the guid of a next element
 * @returns An object containing mergeableGuids, goToableGuids and possibly firstMergeableNonNullNext
 */
function getTargetGuidsForReconnection(
    elements: FlowModel,
    source: ConnectionSource,
    next: Guid
): { mergeableGuids: Guid[]; goToableGuids: Guid[]; firstMergeableNonNullNext: Guid | null } {
    const { guid } = source;
    let { childIndex } = source;
    const { prev, parent } = childIndex != null ? { parent: guid, prev: null } : { parent: null, prev: guid };

    elements = prepareFlowModel(elements, source, next);

    // Variable to keep track of the first non-null next element of a branching element (going up the branch)
    // that the user can merge into
    let firstMergeableNonNullNext: string | null = null;

    let isSteppingOutOfFault = false;
    let isSteppingOutOfLoop = false;

    let branchHead = getBranchHead(elements, source, next);
    let branchParent = branchHead ? elements[branchHead.parent] : elements[parent!];

    childIndex = childIndex != null ? childIndex : branchHead!.childIndex;

    if (childIndex === FAULT_INDEX) {
        isSteppingOutOfFault = true;
    }

    if (branchParent.nodeType === NodeType.LOOP) {
        isSteppingOutOfLoop = true;
    }

    let mergeableGuids: Guid[] = [];
    // Getting the mergeable guids present within the terminated branches of the source element (prev)
    if (prev && isBranchingElement(elements[prev])) {
        const branchingPrev = resolveParent(elements, prev);
        mergeableGuids = mergeableGuids.concat(
            getMergeableGuids(elements, branchingPrev, getNonTerminalBranchIndexes(branchingPrev, elements))
        );
    }

    // Traversing up to find the branching element with a non-null next. We skip the Fault/Loop branch since
    // those can not be merged into anything outside itself
    while (!isSteppingOutOfFault && !isSteppingOutOfLoop && !isRoot(branchParent.guid) && branchParent.next == null) {
        mergeableGuids = mergeableGuids.concat(
            getMergeableGuids(elements, branchParent as ParentNodeModel, [childIndex])
        );
        branchHead = findFirstElement(branchParent, elements);
        childIndex = branchHead.childIndex;
        branchParent = elements[branchHead.parent];
        if (branchHead.childIndex === FAULT_INDEX) {
            isSteppingOutOfFault = true;
        }

        if (branchParent.nodeType === NodeType.LOOP) {
            isSteppingOutOfLoop = true;
        }
    }

    // For a Branching source element, retrieving the elements within that will create a self loop
    // aka elements that merge into the GoTo creation point
    let nonSelectableTailElementsGuids = [] as Guid[];
    if (prev && isBranchingElement(elements[prev])) {
        nonSelectableTailElementsGuids = getNonSelectableTailElementsGuids(elements, resolveParent(elements, prev));
    }

    // Checking if the found next element is mergeable or not
    if (!isSteppingOutOfFault && !isRoot(branchParent.guid) && branchParent.next !== parent) {
        if (isSteppingOutOfLoop) {
            // In case we are stepping out of the Loop branch, then the loop element itself becomes
            // the firstMergeable element
            firstMergeableNonNullNext = branchParent.guid;
        } else if (branchParent.next !== prev || isPrevSelectable(resolveParent(elements, prev!))) {
            // In case branchParent has a GoTo to a guid present in the nonSelectableTailElementsGuids,
            // ensuring that it is not marked as the firstMergeableNonNullNext
            firstMergeableNonNullNext =
                branchParent.next && !nonSelectableTailElementsGuids.includes(branchParent.next)
                    ? branchParent.next
                    : null;
        }
    }

    const goToableGuids = getValidGoToTargets(
        elements,
        prev!,
        parent!,
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
    return new AlcList(state, element.guid).last();
}

/**
 * Find the first element by following the 'prev' pointers
 *
 * @param element - The element
 * @param state - The flow model
 * @returns The first element
 */
function findFirstElement(element: NodeModel, state: FlowModel): BranchHeadNodeModel {
    return new AlcList(state, element.guid, { down: false }).last() as BranchHeadNodeModel;
}

/**
 * For an element on a branch, find its loop or branching element
 *
 * @param element - An element
 * @param flowModel - The FlowModel
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
 * Returns whether an element is a branching element
 *
 * @param node - The element
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
 * @returns true if node is a branch head, false otherwise
 */
export function isBranchHead(node: NodeModel): node is BranchHeadNodeModel {
    return (node as BranchHeadNodeModel).parent !== undefined;
}

/**
 * Deletes an element's fault
 *
 * @param elementService - The element service
 * @param state - The flow model
 * @param elementGuid - The element guid
 * @param childIndexToKeep - The index of the child to keep if any
 * @returns the updated flow model
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
    new AlcList(state, branchHeadGuid).forEach((listElement) => {
        deleteElementAndDescendents(elementService, state, listElement.guid);
    });

    return state;
}

/**
 * Creates an end element
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @returns An unconnected end element
 */
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

        setChild(parentElement, childIndex, endElement);
    }

    flowModel[endElement.guid] = endElement;
    const branchHead = findFirstElement(endElement, flowModel);
    branchHead.isTerminal = true;
}

/**
 * Deleting the GoTo connection associated with a given source reference present in the incomingGoTo array
 *
 * @param elementService - The element service
 * @param flowModel - The state of elements in the store
 * @param goToSourceRef - The goto source reference
 * @returns The updated flow model
 */
function cleanupIncomingGoto(
    elementService: ElementService,
    flowModel: FlowModel,
    goToSourceRef: GoToSourceRef
): FlowModel {
    const { sourceGuid, suffix } = parseGoToSourceRef(goToSourceRef);
    const childIndex = suffix ? getBranchIndexForGoToConnection(flowModel, sourceGuid, suffix) : null;

    const source = { guid: sourceGuid, childIndex };
    return deleteGoToConnection(elementService, flowModel, source);
}

/**
 * Cleaning up all the incoming GoTos present on a given element
 *
 * @param elementService - The element service
 * @param flowModel - The state of elements in the store
 * @param elementToDelete - The element getting deleted
 * @returns The updated flow model
 */
export function cleanUpIncomingGoTos(
    elementService: ElementService,
    flowModel: FlowModel,
    elementToDelete: NodeModel
): FlowModel {
    elementToDelete.incomingGoTo?.forEach((incomingGotoReference) => {
        flowModel = cleanupIncomingGoto(elementService, flowModel, incomingGotoReference);
    });
    return flowModel;
}

/**
 * Removes all incoming and outgoing GoTos present in a given branch
 *
 * @param flowModel - The state of elements in the store
 * @param elementService - The element service
 * @param branchHeadGuid - The guid of the first element in a given branch
 * @returns The updated flow model
 */
function cleanUpBranchGoTos(flowModel: FlowModel, elementService: ElementService, branchHeadGuid: Guid): FlowModel {
    let currentElement = flowModel[branchHeadGuid] as NodeModel | null;
    while (currentElement) {
        flowModel = cleanUpGoTos(flowModel, elementService, currentElement, undefined);
        currentElement = currentElement.next ? flowModel[currentElement.next] : null;
    }
    return flowModel;
}

/**
 * Checks if a the target of a goto is being deleted when deleting a branching element
 *
 * @param flowModel - The state of elements in the store
 * @param elementToDelete - The element to delete
 * @param childIndexToKeep - The child index to keep
 * @param targetElement - The goto target
 * @returns True if the goto target is being deleted, false otherwise
 */
function isGoToTargetBeingDeleted(
    flowModel: FlowModel,
    elementToDelete: NodeModel,
    childIndexToKeep: number,
    targetElement: NodeModel
): boolean {
    if (targetElement.guid === elementToDelete.guid) {
        return true;
    }

    let branchHead = findFirstElement(targetElement, flowModel);
    while (
        branchHead.parent !== elementToDelete.guid &&
        branchHead.parent != null &&
        branchHead.parent !== NodeType.ROOT
    ) {
        branchHead = findFirstElement(flowModel[branchHead.parent!], flowModel);
    }

    return branchHead.parent === elementToDelete.guid && branchHead.childIndex !== childIndexToKeep;
}

/**
 * Checks if there is a GoTo present on merge point a branching element that needs to be deleted
 *
 * @param flowModel - The state of elements in the store
 * @param elementToDelete - Branch Element being deleted
 * @param childIndexToKeep - Index of the branch being persisted (if any)
 * @returns boolean determining if the GoTo needs to be deleted or not
 */
function shouldDeleteGoToOnNext(
    flowModel: FlowModel,
    elementToDelete: NodeModel,
    childIndexToKeep: number | null | undefined
): boolean {
    // We need to persist the GoTo in case the branch being persisted has an element in it
    // that connects to the merging point
    if (elementToDelete.next && hasGoToOnNext(flowModel, elementToDelete.guid)) {
        return (
            childIndexToKeep == null ||
            !getChild(elementToDelete, childIndexToKeep) ||
            isBranchTerminal(flowModel, elementToDelete, childIndexToKeep) ||
            isGoToTargetBeingDeleted(flowModel, elementToDelete, childIndexToKeep, flowModel[elementToDelete.next!])
        );
    }
    return false;
}

/**
 * Removes all incoming and outgoing GoTos present within the scope of the element being deleted
 *
 * @param flowModel - The state of elements in the store
 * @param elementService - The element service
 * @param elementToDelete - The element getting deleted
 * @param childIndexToKeep - The index of the branch being persisted upon deletion
 * @returns The updated flow model
 */
function cleanUpGoTos(
    flowModel: FlowModel,
    elementService: ElementService,
    elementToDelete: NodeModel,
    childIndexToKeep: number | null | undefined
): FlowModel {
    // Cleaning up all the incomingGoTos present on the element being deleted
    flowModel = cleanUpIncomingGoTos(elementService, flowModel, elementToDelete);

    // Deleting any GoTo connection present on 'next' if needed
    if (shouldDeleteGoToOnNext(flowModel, elementToDelete, childIndexToKeep)) {
        flowModel = deleteGoToConnection(elementService, flowModel, { guid: elementToDelete.guid });
    }

    if (hasChildren(elementToDelete)) {
        for (let i = 0; i < elementToDelete.children.length; i++) {
            const source = { guid: elementToDelete.guid, childIndex: i };
            if (hasGoTo(flowModel, source)) {
                // Cleaning up the GoTo present at the branch head
                flowModel = deleteGoToConnection(elementService, flowModel, source);
            } else if (i !== childIndexToKeep) {
                // For any branch that's not being persisted, cleaning up the GoTos present within that branch
                flowModel = elementToDelete.children[i]
                    ? cleanUpBranchGoTos(flowModel, elementService, elementToDelete.children[i]!)
                    : flowModel;
            }
        }
    }

    if (elementToDelete.fault) {
        const source = { guid: elementToDelete.guid, childIndex: FAULT_INDEX };
        if (hasGoTo(flowModel, source)) {
            // Cleaning up the GoTo present at the branch head of the Fault branch
            flowModel = deleteGoToConnection(elementService, flowModel, source);
        } else {
            // Cleaning up GoTos present on any element within the Fault branch
            flowModel = cleanUpBranchGoTos(flowModel, elementService, elementToDelete.fault);
        }
    }

    return flowModel;
}

/**
 * Cleans up any goTos present in the child branches getting deleted and then deletes the branches
 *
 * @param elementService - The element service
 * @param flowModel - The state of elements in the store
 * @param parentElement - Current state of the parent element (with updated childReferences)
 * @param updatedChildReferences - The updated child references
 * @returns The updated flow model
 */
function cleanUpAndDeleteChildBranchesWithGoTos(
    elementService: ElementService,
    flowModel: FlowModel,
    parentElement: ParentNodeModel,
    updatedChildReferences: { childReference: string }[]
): FlowModel {
    const originalChildReferenceGuids = parentElement.childReferences?.map(
        (childReferenceObject) => childReferenceObject.childReference
    );
    const updatedChildReferenceGuids = updatedChildReferences.map(
        (childReferenceObject) => childReferenceObject.childReference
    );

    // Comparing originalChildReferences against newChildReferences to compute the
    // branch indexes from the originalParentElement that need to be deleted
    const branchIndexesToDelete = [] as number[];
    originalChildReferenceGuids?.forEach((childReference, i) => {
        if (updatedChildReferenceGuids && !updatedChildReferenceGuids.includes(childReference)) {
            // Accounting for the immediate branch to get the right branch index
            const branchIndexToDelete = parentElement.nodeType === NodeType.START ? i + 1 : i;
            if (parentElement.children[branchIndexToDelete]) {
                if (hasGoToOnBranchHead(flowModel, parentElement.guid, branchIndexToDelete)) {
                    // We don't need to store this branch index since there's no element
                    // within the branch that needs to be deleted
                    const source = { guid: parentElement.guid, childIndex: branchIndexToDelete };
                    flowModel = removeSourceFromIncomingGoTo(flowModel, source);
                } else {
                    branchIndexesToDelete.push(branchIndexToDelete);
                }
            }
        }
    });

    // Cleaning up all incoming and outgoing GoTos present within these branches
    branchIndexesToDelete.forEach((branchIndex) => {
        const branchHeadGuid = parentElement.children[branchIndex];
        flowModel = cleanUpBranchGoTos(flowModel, elementService, branchHeadGuid!);
    });

    branchIndexesToDelete.forEach((branchIndex) => {
        const branchHeadGuid = parentElement.children[branchIndex];
        flowModel = deleteBranch(elementService, flowModel, branchHeadGuid!);
    });

    return flowModel;
}

/**
 * Cleans up any GoTos present on a given fault or next (beyond the merge point) branch and deletes all the elements in that branch
 *
 * @param elementService - The element service
 * @param flowModel - The state of elements in the store
 * @param parentElement - Element whose branches are being deleted
 * @param branchIndexToDelete - Index of the branch getting deleted. This is null when deleting all elements beyond the merge point
 * @param branchHeadGuid - Guid of the deleted branch's branch head element
 * @returns The updated flow model
 */
function cleanUpAndDeleteFaultOrNextBranchWithGoTos(
    elementService: ElementService,
    flowModel: FlowModel,
    parentElement: NodeModel | ParentNodeModel,
    branchIndexToDelete: number | null,
    branchHeadGuid: Guid
): FlowModel {
    const source = { guid: parentElement.guid, childIndex: branchIndexToDelete };

    if (hasGoTo(flowModel, source)) {
        // Clean up the target element's incomingGoTo
        flowModel = removeSourceFromIncomingGoTo(flowModel, source);
    } else {
        // Clean up any incoming/outgoing GoTos present in the branch and then delete the branch
        flowModel = cleanUpBranchGoTos(flowModel, elementService, branchHeadGuid);
        deleteBranch(elementService, flowModel, branchHeadGuid);
    }

    return flowModel;
}

/**
 * Deletes an element's fault
 *
 * @param elementService - The element service
 * @param state - The flow model
 * @param elementWithFaultGuid - The guid of the element with the fault
 * @returns the updated flow model
 */
function deleteFault(elementService: ElementService, state: FlowModel, elementWithFaultGuid: Guid): FlowModel {
    const elementWithFault = state[elementWithFaultGuid];
    const { fault } = elementWithFault;

    if (fault) {
        state = cleanUpAndDeleteFaultOrNextBranchWithGoTos(elementService, state, elementWithFault, FAULT_INDEX, fault);
        // @ts-ignore
        delete elementWithFault.fault;
    }

    return state;
}

/**
 * Returns the first parent element that has a nonNullNext
 *
 * @param state - The flow model after element deletion
 * @param branchParent - parent element of deleted element
 * @returns - Parent element that has a nonNullNext
 */
function getFirstParentWithNonNullNext(state: FlowModel, branchParent: ParentNodeModel) {
    // Traversing up to find the branching element with a non-null next.
    let firstParentWithNonNullNext = branchParent;
    while (
        firstParentWithNonNullNext &&
        !isRoot(firstParentWithNonNullNext.guid) &&
        firstParentWithNonNullNext.next == null
    ) {
        firstParentWithNonNullNext = findParentElement(firstParentWithNonNullNext, state);
    }
    return firstParentWithNonNullNext;
}

/**
 * Checks if deleting an element results in a self-loop. Recalculates selectable GoTo guids and compares to the goToGuidOnParentNext
 *
 * @param state - The flow model after element deletion
 * @param parentElement - parent element of deleted element
 * @returns - Boolean if a self-loop was found
 */
function checkSelfLoop(state: FlowModel, parentElement: ParentNodeModel): boolean {
    let isSelfLoop = false;
    const firstParentWithNonNullNext = getFirstParentWithNonNullNext(state, parentElement);
    const goToGuidOnParentNext =
        firstParentWithNonNullNext && hasGoToOnNext(state, firstParentWithNonNullNext.guid)
            ? firstParentWithNonNullNext.next
            : null;

    // If there is a GoTo on a branching elements next, we must check for self-loops
    if (goToGuidOnParentNext) {
        const source = { guid: firstParentWithNonNullNext.guid };
        // Recalculate what elements are selectable from the merge point
        const { goToableGuids } = getTargetGuidsForReconnection(state, source, goToGuidOnParentNext);
        isSelfLoop = !goToableGuids.includes(goToGuidOnParentNext);
    }

    return isSelfLoop;
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

    // Cleaning up all GoTos getting affected by the deletion
    state = cleanUpGoTos(state, elementService, state[guid], childIndexToKeep);

    // Cleaning up any GoTos present beyond the merge point if those elements
    // need to be deleted as well
    let shouldDeleteBeyondMergingPoint = false;
    if (
        state[guid].next &&
        !hasGoToOnNext(state, guid) &&
        childIndexToKeep != null &&
        isBranchTerminal(state, resolveNode(state, guid), childIndexToKeep)
    ) {
        state = cleanUpBranchGoTos(state, elementService, state[guid].next!);
        shouldDeleteBeyondMergingPoint = true;
    }

    const element = resolveNode(state, guid);
    const { prev, next, parent, childIndex } = element as BranchHeadNodeModel;

    let nextElement;
    let addEndElement = false;

    const parentElement = findParentElement(element, state);

    // take care of linking tail of the branch to keep to the next element
    if (hasChildren(element)) {
        if (childIndexToKeep != null) {
            const headElement = resolveChild(state, element, childIndexToKeep);

            if (headElement) {
                if (next != null) {
                    const tailElement = findLastElement(headElement, state);

                    // If the branch to persist is not terminated,
                    // then tail element needs to be linked properly
                    if (!headElement.isTerminal) {
                        tailElement.next = next;
                        if (hasGoToOnNext(state, element.guid)) {
                            // Resetting the source of the GoTo to the tail element in the persisted branch
                            const source = { guid: element.guid };
                            const newSource = { guid: tailElement.guid };
                            state = removeAndUpdateSourceReferenceInIncomingGoTo(state, source, next, newSource);
                        } else {
                            linkElement(state, tailElement);
                        }
                    }
                }
                deleteBranchHeadProperties(headElement);
            }

            // Need to check in the store for the case when End element is the only element in the branch
            nextElement = headElement && state[headElement.guid];
        } else {
            addEndElement = areAllBranchesTerminals(element, state) && element.next == null;
        }
    }

    nextElement = nextElement || (next ? resolveNode(state, next) : null);

    if (parent) {
        setChild(parentElement, childIndex, null);

        linkBranchOrFault(state, parentElement, childIndex, nextElement);
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

    deleteElementAndDescendents(elementService, state, element.guid, childIndexToKeep);
    if (shouldDeleteBeyondMergingPoint && next != null) {
        deleteBranch(elementService, state, next);
    }

    const branchHead = (
        parent != null ? nextElement : findFirstElement(resolveNode(state, prev!), state)
    ) as BranchHeadNodeModel;

    // update the branch's isTerminal and attempt to inline
    if (branchHead != null) {
        const branchTail = findLastElement(branchHead, state);
        branchHead.isTerminal = isEndOrAllTerminalBranchingElement(state, branchTail);
    }

    if (addEndElement || checkSelfLoop(state, parentElement)) {
        replaceWithEndElement(elementService, state, element);
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
            (nextElement.next == null ||
                state[nextElement.next]!.nodeType === NodeType.END ||
                hasGoToOnNext(state, nextElement.guid))
                ? nextElement
                : parentElement;
        inlineFromParent(state, inlineParent);
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
 * @param source - The connection source
 * @returns - The flow model
 */
function addElement(flowModel: FlowModel, elementGuid: Guid, nodeType: NodeType, source: ConnectionSource): FlowModel {
    const element = resolveNode(flowModel, elementGuid);

    validConnectionSourceOrThrow(flowModel, source);

    if (nodeType === NodeType.END && getConnectionSourceTarget(flowModel, source) != null) {
        throw new Error(`Can only add an end element when no element follows the ConnectionSource: ${source}`);
    }

    element.nodeType = nodeType;
    if (nodeType !== NodeType.END) {
        element.incomingGoTo = [];
    }
    const { guid, childIndex } = source;
    const sourceElement = childIndex == null ? flowModel[guid] : resolveParent(flowModel, guid);

    const newSource = { guid: elementGuid };

    if (childIndex == null) {
        const next = sourceElement.next;
        element.prev = guid;
        if (next) {
            element.next = next;
            if (hasGoToOnNext(flowModel, sourceElement.guid)) {
                // Cleaning up and updating the target element's incomingGoTo
                // with the newly added source element
                flowModel = removeAndUpdateSourceReferenceInIncomingGoTo(flowModel, source, next, newSource);
            }
        }
        linkElement(flowModel, element);
    } else {
        Object.assign(element, { parent: guid, childIndex });
        if (hasGoToOnBranchHead(flowModel, sourceElement.guid, childIndex)) {
            const targetGuid = getChild(sourceElement, childIndex);

            // Cleaning up and updating the target element's incomingGoTo
            // with the newly added source element
            flowModel = removeAndUpdateSourceReferenceInIncomingGoTo(flowModel, source, targetGuid!, newSource);

            // Updating the next and isTerminal property of the newly added element
            Object.assign(element, { next: targetGuid, isTerminal: true });

            // Updating the fault/children property to incorporate the newly added element
            setChild(sourceElement, childIndex, element, true);
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
            inlineBranches(flowModel, branchParent);

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
 * @returns true if all branches are terminal
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
 * @param state - The flow state
 * @param parentElement - The parent element
 */
function inlineBranches(state: FlowModel, parentElement: ParentNodeModel) {
    const nonTerminalBranchIndexes = getNonTerminalBranchIndexes(parentElement, state);

    if (nonTerminalBranchIndexes.length === 1) {
        // We have exactly one non-terminal branch, so we can inline.

        const isGoToOnNext = hasGoToOnNext(state, parentElement.guid);
        const [branchIndex] = nonTerminalBranchIndexes;
        const branchHead = resolveChild(state, parentElement, branchIndex);

        let branchTailBeforeInline: NodeModel | null = null;

        const source = { guid: parentElement.guid };
        const target = parentElement.next!;

        if (branchHead != null) {
            // we have a non-empty branch, so reconnect the elements that follow the parent element to the tail of the branch
            branchTailBeforeInline = findLastElement(branchHead, state);

            if (isGoToOnNext) {
                const newSource = { guid: branchTailBeforeInline.guid };
                removeAndUpdateSourceReferenceInIncomingGoTo(state, source, target, newSource);
            }
            branchTailBeforeInline.next = parentElement.next;
            linkElement(state, branchTailBeforeInline);
        } else {
            // we have an empty branch, so make the elements that follow the parent element be the branch itself
            const parentNext = resolveNode(state, parentElement.next!);
            if (isGoToOnNext) {
                const newSource = { guid: parentElement.guid, childIndex: branchIndex };
                setChild(parentElement, branchIndex, parentNext, true);
                removeAndUpdateSourceReferenceInIncomingGoTo(state, source, target, newSource);
            } else {
                parentNext.prev = null;
                linkBranchOrFault(state, parentElement, branchIndex, parentNext);
            }
        }

        // clear the parent's next, since it has now been inlined
        parentElement.next = null;

        // if the branch head is not a goto, set its isTerminal property
        if (!hasGoToOnBranchHead(state, parentElement.guid, branchIndex)) {
            const branchHead = resolveChild(state, parentElement, branchIndex);
            if (branchHead != null) {
                const isTerminal = isEndOrAllTerminalBranchingElement(state, findLastElement(branchHead, state));
                branchHead.isTerminal = isTerminal;
            }
        }

        // if we had a branchTailBeforeInline, and it's branching, recursively inline from there
        if (branchTailBeforeInline != null && isBranchingElement(branchTailBeforeInline)) {
            inlineBranches(state, branchTailBeforeInline);
        }
    }
}

/**
 * Returns an array of indexes of the non-terminal branches of a branching element
 *
 * @param parentElement - The parent element
 * @param state - The flow model
 * @returns An array indices for the terminated branches
 */
function getNonTerminalBranchIndexes(parentElement: ParentNodeModel, state: FlowModel): number[] {
    return parentElement.children
        .map((child: NodeRef, index: number) => {
            // A branch is not terminal if the child guid is null or
            // if there's a regular connection between the parent and child and the child element's isTerminal is false
            if (!isBranchTerminal(state, parentElement, index)) {
                return index;
            } else {
                return -1;
            }
        })
        .filter((index: number | null) => index !== -1);
}

/**
 * Creates the root node for of an auto layout canvas instance
 *
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
 * Computes and returns the new children for an element
 *
 * @param element - The previous state of the element
 * @param nextElement - The next state of the element
 * @returns The new children array for the element
 */
/**
 * Computes and returns the new children for an element
 *
 * @param parentElement - Current state of the element
 * @param updatedChildReferences - Updated childReferences array
 * @returns The updated children array
 */
function getUpdatedChildren(
    parentElement: ParentNodeModel,
    updatedChildReferences: { childReference: string }[]
): (Guid | null)[] {
    const childCount = updatedChildReferences.length + 1;
    const updatedChildren = Array(childCount).fill(null);
    if (parentElement.nodeType === NodeType.START) {
        updatedChildren[START_IMMEDIATE_INDEX] = parentElement.children[START_IMMEDIATE_INDEX];
    } else {
        updatedChildren[updatedChildren.length - 1] = parentElement.children[parentElement.children.length - 1];
    }

    updatedChildReferences.forEach((childReferenceObject, i) => {
        const currentIndex = parentElement.childReferences!.findIndex((ref) => {
            return ref.childReference === childReferenceObject.childReference;
        });

        if (currentIndex !== -1) {
            if (parentElement.nodeType === NodeType.START) {
                updatedChildren[i + 1] = parentElement.children[currentIndex + 1];
            } else {
                updatedChildren[i] = parentElement.children[currentIndex];
            }
        }
    });

    return updatedChildren;
}

/**
 * Updates an element's children
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param parentElementGuid - The guid of the parent element
 * @param updatedChildReferences - Updated childReferences array
 * @returns The updated flow model
 */
export function updateChildren(
    elementService: ElementService,
    flowModel: FlowModel,
    parentElementGuid: Guid,
    updatedChildReferences: { childReference: string }[]
) {
    const parentElement = resolveParent(flowModel, parentElementGuid);
    const allTerminalsBeforeUpdate = areAllBranchesTerminals(parentElement, flowModel);

    // Cleaning up the GoTos on the branches getting deleted
    // and then deleting the elements present in those branches
    flowModel = cleanUpAndDeleteChildBranchesWithGoTos(
        elementService,
        flowModel,
        parentElement,
        updatedChildReferences
    );

    // Calculating the new children [] based on the updated childReferences
    // and after GoTos have been cleaned up
    parentElement.children = getUpdatedChildren(parentElement, updatedChildReferences);
    parentElement.childReferences = updatedChildReferences;

    // Recompute childIndex for the remaining branches
    parentElement.children.forEach((child, i) => {
        if (child && !hasGoToOnBranchHead(flowModel, parentElement.guid, i)) {
            const branchHead = resolveBranchHead(flowModel, child);
            branchHead.childIndex = i;
        }
    });

    // If all the branches were terminating before the update, or if there's a GoTo
    // from parent element's next to the parentElement itself (self-loop) then make any
    // new branch terminate as well by adding an end element
    if (
        allTerminalsBeforeUpdate ||
        getFirstParentWithNonNullNext(flowModel, parentElement).next === parentElement.guid
    ) {
        for (let i = 0; i < parentElement.children.length; i++) {
            const child = parentElement.children[i];
            if (child == null) {
                flowModel = createAndConnectEndElement(elementService, flowModel, {
                    guid: parentElementGuid,
                    childIndex: i
                });
            }
        }
    }

    // if all branches are terminals after the update, then delete the parent's next element and beyond if there are any
    const allTerminalsAfterUpdate = areAllBranchesTerminals(parentElement, flowModel);
    const { next } = parentElement;

    if (allTerminalsAfterUpdate) {
        if (next) {
            flowModel = cleanUpAndDeleteFaultOrNextBranchWithGoTos(
                elementService,
                flowModel,
                parentElement,
                null,
                next
            );
        }
        parentElement.next = null;

        findFirstElement(parentElement, flowModel).isTerminal = true;
    }

    inlineFromParent(flowModel, parentElement);

    return flowModel;
}

/**
 * Updates start element's children when scheduled paths are added or updated
 *
 * @param elementService - The element service
 * @param flowModel - The flow model
 * @param parentElementGuid - The guid of the parent element
 * @param updatedChildReferences - Updated childReferences array
 * @returns The updated flow model
 */
export function updateChildrenOnAddingOrUpdatingScheduledPaths(
    elementService: ElementService,
    flowModel: FlowModel,
    parentElementGuid: Guid,
    updatedChildReferences: { childReference: string }[]
) {
    const parentElement = resolveParent(flowModel, parentElementGuid);

    if (updatedChildReferences!.length > 0) {
        if (parentElement.children) {
            flowModel = updateChildren(elementService, flowModel, parentElementGuid, updatedChildReferences);
        } else {
            // To handle the case when children have not yet been added
            parentElement.children = Array(updatedChildReferences.length + 1).fill(null);
            parentElement.childReferences = updatedChildReferences;

            // If the parent had a next element it should become the first child (with childIndex = 0)
            const nextElementGuid = parentElement.next!;
            const nextElement = resolveNode(flowModel, nextElementGuid) as BranchHeadNodeModel;
            parentElement.children[0] = nextElementGuid;
            nextElement.parent = parentElement.guid;
            nextElement.isTerminal = true;
            nextElement.childIndex = START_IMMEDIATE_INDEX;
            nextElement.prev = null;
            parentElement.next = null;

            for (let i = 1; i < parentElement.children.length; i++) {
                flowModel = createAndConnectEndElement(elementService, flowModel, {
                    guid: parentElementGuid,
                    childIndex: i
                });
            }
        }
    } else if (parentElement.children) {
        // Case when deleting all scheduled paths
        // Delete all the branches from index 1 -> n
        flowModel = cleanUpAndDeleteChildBranchesWithGoTos(
            elementService,
            flowModel,
            parentElement,
            updatedChildReferences
        );

        const hasGoToOnImmediateBranchHead = hasGoToOnBranchHead(flowModel, parentElement.guid, START_IMMEDIATE_INDEX);
        let immediateBranchHeadElementGuid = hasGoToOnImmediateBranchHead
            ? null
            : parentElement.children[START_IMMEDIATE_INDEX];
        let immediateBranchHeadElement = immediateBranchHeadElementGuid
            ? resolveBranchHead(flowModel, immediateBranchHeadElementGuid)
            : null;

        // If the immediate branch has GoTo on the branch head or is terminated, then cleaning up the GoTos
        // present on the elements beyond the merge point and deleting all these elements as well (if any)
        if (hasGoToOnImmediateBranchHead || (immediateBranchHeadElement && immediateBranchHeadElement.isTerminal)) {
            if (parentElement.next) {
                flowModel = cleanUpAndDeleteFaultOrNextBranchWithGoTos(
                    elementService,
                    flowModel,
                    parentElement,
                    null,
                    parentElement.next
                );

                // If there was a GoTo on the immediate branch head, then it would have been deleted
                // and replaced by an End element by now, hence updating the immediateBranchHeadElementGuid
                // and immediateBranchHeadElement
                if (hasGoToOnImmediateBranchHead) {
                    immediateBranchHeadElementGuid = parentElement.children[START_IMMEDIATE_INDEX];
                    immediateBranchHeadElement = resolveBranchHead(flowModel, immediateBranchHeadElementGuid!);
                }
            }
        }

        if (immediateBranchHeadElement) {
            if (!immediateBranchHeadElement.isTerminal) {
                // If the branch head is NOT terminal: connect last element in branch to next element
                const lastElementInBranch = findLastElement(immediateBranchHeadElement, flowModel);
                lastElementInBranch.next = parentElement.next;
                if (hasGoToOnNext(flowModel, parentElement.guid)) {
                    // If there's a GoTo present at the merge point, then ensuring that
                    // the target element has the correct source reference (i.e. lastElementInBranch) in it's incomingGoTo
                    flowModel = removeAndUpdateSourceReferenceInIncomingGoTo(
                        flowModel,
                        { guid: parentElement.guid },
                        parentElement.next!,
                        { guid: lastElementInBranch.guid }
                    );
                } else {
                    flowModel[parentElement.next!].prev = lastElementInBranch.guid;
                }

                if (lastElementInBranch.nodeType === NodeType.BRANCH) {
                    // To handle branch nodes' branches that are terminal
                    inlineFromParent(flowModel, lastElementInBranch as ParentNodeModel);
                }
            }
            // Connect Start Element to immediateBranchHeadElement and remove branch head properties as it is not a
            // branch head anymore
            parentElement.next = immediateBranchHeadElementGuid;
            immediateBranchHeadElement.prev = parentElementGuid;
            deleteBranchHeadProperties(immediateBranchHeadElement);
        }
        delete (parentElement as StartNodeModel).children;
        parentElement.childReferences = updatedChildReferences;
    }

    return flowModel;
}

/**
 * Decorates elements in the flow model with connector highlight info
 *
 * @param flowModel flow model
 * @param decoratedElements map of element guids to highlight info
 * @returns - The updated flow model
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
 * @returns - The updated flow model
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
 * Returns whether a node is branching
 *
 * @param node - The node
 * @param type - The node type
 * @returns true if branching, false otherwise
 */
export function fulfillsBranchingCriteria(node: NodeModel, type: NodeType) {
    return type === NodeType.BRANCH || ((node as ParentNodeModel).children && type === NodeType.START);
}

/**
 * Creates a connection between the source and target.
 * When possible a merge connection is created, otherwise we fallback to a goto.
 *
 * @param config - The element service
 * @param flowModel - The flow model
 * @param source - The connection source
 * @param targetGuid - The target guid
 * @param isReroute - If is reroute
 * @returns The update flow model
 */
export function createConnection(
    config: ElementService,
    flowModel: FlowModel,
    source: ConnectionSource,
    targetGuid: Guid,
    isReroute?: boolean
): FlowModel {
    const target = getConnectionTarget(flowModel, source)!;
    const { goToableGuids, firstMergeableNonNullNext } = getTargetGuidsForReconnection(flowModel, source, target);

    if (goToableGuids.includes(targetGuid)) {
        return createGoToConnection(config, flowModel, source, targetGuid, isReroute);
    } else {
        const isMergeableGuid = firstMergeableNonNullNext !== targetGuid;
        return connectToElement(config, flowModel, source, targetGuid, isMergeableGuid);
    }
}

/**
 * Returns a connection source for a node
 *
 * @param node - The node
 * @returns - The connection source for the node
 */
export function getConnectionSource(node: NodeModel | BranchHeadNodeModel): ConnectionSource {
    return isBranchHead(node) ? { guid: node.parent, childIndex: node.childIndex } : { guid: node.prev! };
}

/**
 * Returns the prev, parent and childIndex values from a connection source
 *
 * @param source - a connection source
 * @returns the prev, parent and childIndex values for the connection source
 */
export function getValuesFromConnectionSource(source: ConnectionSource) {
    const { childIndex } = source;
    let prev, parent;

    if (childIndex != null) {
        parent = source.guid;
    } else {
        prev = source.guid;
    }

    return { prev, parent, childIndex };
}

export {
    connectToElement,
    linkElement,
    deleteBranchHeadProperties,
    linkBranchOrFault,
    AlcList,
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
    deleteGoToConnection,
    isBranchTerminal,
    shouldDeleteGoToOnNext,
    isEndOrAllTerminalBranchingElement,
    getConnectionTarget,
    setChild,
    prepareFlowModel,
    getFirstNonNullNext,
    isGoingBackToAncestorLoop
};
