import {
    areAllBranchesTerminals,
    FAULT_INDEX,
    findLastElement,
    assertInDev,
    assertAutoLayoutState,
    ParentNodeModel,
    FlowModel,
    NodeModel,
    BranchHeadNodeModel,
    resolveNode,
    resolveBranchHead,
    resolveParent,
    NodeType,
    createRootElement,
    createGoToSourceRef,
    setChild,
    inlineFromParent,
    FOR_EACH_INDEX
} from 'builder_platform_interaction/autoLayoutCanvas';

import { getChildReferencesKeys } from 'builder_platform_interaction/elementConfig';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { findStartElement, getAlcElementType, supportsChildren } from 'builder_platform_interaction/alcCanvasUtils';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { createNewConnector } from 'builder_platform_interaction/connectorUtils';
import { dfs, ConversionInfo, ConversionInfos } from './freeFormToAutoLayout/dfs';
import { validateConversionInfos } from './freeFormToAutoLayout/validate';

export type ConvertToAutoLayoutCanvasOptions = Readonly<{
    // whether to consolidate end elements when possible
    shouldConsolidateEndConnectors: boolean;

    // whether to remove empty fault branches
    noEmptyFaults: boolean;

    // whether to reset existing go to connections on all elements
    resetExistingGoTos: boolean;
}>;

const DEFAULT_CONVERT_TO_AUTO_LAYOUT_CANVAS_OPTIONS: ConvertToAutoLayoutCanvasOptions = {
    shouldConsolidateEndConnectors: true,
    noEmptyFaults: true,
    resetExistingGoTos: false
};

/**
 * Find the index in parentElement for a childSource guid
 *
 * @param parentElement - the parent element
 * @param childSource - the child source guid
 * @param type The connector Type
 * @returns the connection index in the parent
 */
function findConnectionIndex(parentElement: NodeModel, childSource: UI.Guid, type: UI.ConnectorType): number {
    const { maxConnections, elementType } = parentElement;

    if (type === CONNECTOR_TYPE.FAULT) {
        return maxConnections - 1;
    } else if (type === CONNECTOR_TYPE.DEFAULT) {
        return parentElement.canHaveFaultConnector ? maxConnections - 2 : maxConnections - 1;
    } else if (type === CONNECTOR_TYPE.IMMEDIATE) {
        return 0;
    }

    // Children on start element are handled by scheduledPaths and these only contain paths which are not CONNECTOR_TYPE.IMMEDIATE.
    // So, adding 1 to offset the immediate path.
    const { singular, plural } = getChildReferencesKeys();
    return elementType === ELEMENT_TYPE.START_ELEMENT
        ? parentElement[plural].findIndex((entry) => entry[singular] === childSource) + 1
        : parentElement[plural].findIndex((entry) => entry[singular] === childSource);
}

/**
 * @param element The element
 * @returns true if the element supports children
 */
function isBranchingElement(element: UI.Element) {
    return supportsChildren(element as UI.CanvasElement);
}

/**
 *  Returns the conversion infos for a Free Form flow that can be converted to Auto Layout Canvas
 *
 * @param storeState - The flow state
 * @param options - Conversion options
 * @returns The conversion infos
 * @throws Error when the flow can't be converted
 */
export function computeAndValidateConversionInfos(
    storeState: UI.StoreState,
    options: Partial<ConvertToAutoLayoutCanvasOptions> = {}
): ConversionInfos {
    const { elements, connectors } = storeState;
    const startElement = findStartElement(elements) as any;

    // creates a ConversionInfo for each element
    const conversionInfos = Object.values(elements).reduce(
        (infos: Record<string, ConversionInfo>, element: UI.Element) => {
            if (element.isCanvasElement) {
                infos[element.guid] = {
                    elementGuid: element.guid,
                    isBranching: isBranchingElement(element),
                    isLoop: element.elementType === ELEMENT_TYPE.LOOP,
                    isEnd: element.elementType === ELEMENT_TYPE.END_ELEMENT,
                    outs: [],
                    ins: [],
                    edgeTypes: [],
                    reachedCount: 0,
                    dfsStart: null,
                    dfsEnd: null,
                    mergeGuid: null,
                    branchingGuid: null,
                    executionContext: null
                };
            }
            return infos;
        },
        {}
    );

    // Sort the connectors in the flow by guid, so that our dfs traversal is deterministic during roundtrip conversions,
    // then loop over them and populate the ins, outs and fault for each ConnectorInfo
    connectors.forEach((connector) => {
        const { source, target, type } = connector;

        if (target != null) {
            const sourceInfo = conversionInfos[source];
            const targetInfo = conversionInfos[target];
            if (connector.isGoTo && options.resetExistingGoTos) {
                connector.isGoTo = false;
            }

            targetInfo.ins.push(connector);
            if (type === CONNECTOR_TYPE.FAULT) {
                sourceInfo.fault = connector;
            } else {
                sourceInfo.outs.push(connector);
            }
        }
    });

    // for free form flow loops with no next connector, we need to generate one
    Object.values(conversionInfos).forEach((conversionInfo) => {
        const { isLoop, outs, ins, elementGuid } = conversionInfo;
        if (isLoop && outs.length !== 2) {
            // create a new next connector
            const nextConnector = createNewConnector(elements, elementGuid, elementGuid, CONNECTOR_TYPE.LOOP_NEXT);
            connectors.push(nextConnector);
            outs.push(nextConnector);
            ins.push(nextConnector);
        }
    });

    // Do a dfs traversal of the free form flow, starting with its start element
    dfs(conversionInfos, startElement.guid);

    validateConversionInfos(elements, conversionInfos);

    return conversionInfos;
}

/**
 * Converts a loop element to Auto Layout Canvas
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @param loopElement - The loop element
 * @param options - The ConvertToAutoLayoutCanvasOptions
 */
function convertLoop(
    elements: FlowModel,
    conversionInfos: ConversionInfos,
    loopElement: ParentNodeModel,
    options: ConvertToAutoLayoutCanvasOptions
) {
    const { outs } = conversionInfos[loopElement.guid];
    loopElement.children = [null];

    const loopNextConnector = outs.find((connector) => connector.type === CONNECTOR_TYPE.LOOP_NEXT);

    if (loopNextConnector != null) {
        const targetElement = resolveNode(elements, loopNextConnector.target);
        if (loopNextConnector.isGoTo) {
            updateIncomingGoToArray(elements, targetElement, loopElement, FOR_EACH_INDEX);
            setChild(loopElement, FOR_EACH_INDEX, targetElement, true);
        } else if (targetElement && targetElement.guid !== loopElement.guid) {
            const branchHead = resolveNode(elements, loopNextConnector.target);
            convertBranchToAutoLayout(
                elements,
                conversionInfos,
                loopElement,
                branchHead as BranchHeadNodeModel,
                FOR_EACH_INDEX,
                options
            );
        }
    }
}

/**
 * Converts a branching element to Auto Layout Canvas
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @param branchingElement - The branching element
 * @param options - The conversion options
 */
function convertBranchingElement(
    elements: FlowModel,
    conversionInfos: ConversionInfos,
    branchingElement: ParentNodeModel,
    options
) {
    const conversionInfo = conversionInfos[branchingElement.guid];
    const { outs } = conversionInfo;

    const childCount = branchingElement.canHaveFaultConnector
        ? branchingElement.maxConnections - 1
        : branchingElement.maxConnections;

    branchingElement.children = new Array(childCount).fill(null);

    if (outs.length > 0) {
        outs.forEach(({ childSource, target, type, isGoTo }) => {
            const childIndex = findConnectionIndex(branchingElement, childSource!, type);
            const targetElement = resolveNode(elements, target);

            if (!isLinked(targetElement) && !isGoTo) {
                convertBranchToAutoLayout(
                    elements,
                    conversionInfos,
                    branchingElement,
                    targetElement as BranchHeadNodeModel,
                    childIndex,
                    options
                );
            } else if (isGoTo) {
                updateIncomingGoToArray(elements, targetElement, branchingElement, childIndex);
                setChild(branchingElement, childIndex, targetElement, true);
            }
        });
    }
}

/**
 * @param element The current element
 * @returns True if the element is linked
 */
function isLinked(element: NodeModel) {
    return (<BranchHeadNodeModel>element).parent != null || element.prev != null;
}

/**
 * Returns the "next" element in a branch
 *
 * @param elements - The flow model
 * @param conversionInfos - The conversion infos
 * @param currentElement - The current element for which we want to find its next element
 * @returns the next element in the branch (or null if there is none), and whether it's linked via a goto connector
 */
function getNextElement(elements: FlowModel, conversionInfos: ConversionInfos, currentElement: NodeModel) {
    const { isLoop, isBranching, mergeGuid, outs } = conversionInfos[currentElement.guid];
    let next, isGoTo;

    if (isLoop) {
        // for a loop, the end connector is the "next" element
        const loopEndConnector = outs.find((connector) => connector.type === CONNECTOR_TYPE.LOOP_END);
        next = loopEndConnector != null ? loopEndConnector.target : null;
        isGoTo = loopEndConnector?.isGoTo;
    } else if (isBranching) {
        // if branching the mergeGuid is the "next" element
        next = mergeGuid;
    } else {
        // otherwise the out connector's target is the "next" element (if there is an out)
        next = outs.length === 1 ? outs[0].target : null;
        isGoTo = outs.length === 1 ? outs[0].isGoTo : false;
    }

    const nextElement = elements[next];
    // if the next element hasn't been linked yet, it belongs to this branch or is connected via a goto, so return it.
    if (nextElement && (!isLinked(nextElement) || isGoTo)) {
        return { nextElement, isGoTo };
    }

    // otherwise, we're at the end of a loop pointing back to the parent loop element, so return null
    return { nextElement: null, isGoTo };
}

/**
 * Updates the incoming go to array of a target element with the correct source reference for a given source element
 *
 * @param elements - The elements in the flow model
 * @param targetElement - target element to update
 * @param sourceElement - source of the go to
 * @param sourceChildIndex - child index of the source, if any
 */
function updateIncomingGoToArray(
    elements: FlowModel,
    targetElement: NodeModel,
    sourceElement: NodeModel,
    sourceChildIndex?: number
) {
    const goToSourceRef = createGoToSourceRef(elements, { guid: sourceElement.guid, childIndex: sourceChildIndex });
    targetElement.incomingGoTo = targetElement.incomingGoTo || [];
    targetElement.incomingGoTo.push(goToSourceRef);
}

/**
 * Converts a branch to Auto Canvas and any child branches recursively
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @param parentElement - The parent element
 * @param branchHead - The branch head element
 * @param childIndex - The child index
 * @param options - The conversion options
 */
function convertBranchToAutoLayout(
    elements: FlowModel,
    conversionInfos: ConversionInfos,
    parentElement: ParentNodeModel,
    branchHead: BranchHeadNodeModel,
    childIndex: number,
    options: ConvertToAutoLayoutCanvasOptions
) {
    // set the parent pointers
    setChild(parentElement, childIndex, branchHead);

    // set the branch head pointers
    Object.assign(branchHead, {
        isTerminal: false,
        parent: parentElement.guid,
        childIndex,
        prev: null
    });

    let currentElement: NodeModel | null = branchHead;

    while (currentElement != null) {
        if (
            currentElement.elementType !== ELEMENT_TYPE.START_ELEMENT &&
            currentElement.elementType !== ELEMENT_TYPE.END_ELEMENT
        ) {
            currentElement.incomingGoTo = currentElement.incomingGoTo || [];
        }

        if (currentElement.elementType === ELEMENT_TYPE.END_ELEMENT) {
            branchHead.isTerminal = true;
            break;
        }

        const { fault, isLoop, isBranching } = conversionInfos[currentElement.guid];

        const { nextElement, isGoTo } = getNextElement(elements, conversionInfos, currentElement);

        if (nextElement) {
            currentElement.next = nextElement.guid;
            if (isGoTo) {
                // If we have a goto, add to the incomingGoTo array on the target element and set the branch head to be terminal
                updateIncomingGoToArray(elements, nextElement, currentElement);
                branchHead.isTerminal = true;
            } else {
                // Else, link to the prev of the next element immediately, so recursive calls below to
                // convert a loop or a branch will stop when when they encounter an already linked element
                nextElement.prev = currentElement.guid;
            }
        } else {
            currentElement.next = null;
        }

        // process any fault
        if (fault != null) {
            const faultBranchHead = resolveNode(elements, fault.target);
            if (faultBranchHead.elementType === ELEMENT_TYPE.END_ELEMENT && options.noEmptyFaults) {
                currentElement.fault = null;
            } else if (fault.isGoTo) {
                updateIncomingGoToArray(elements, faultBranchHead, currentElement, FAULT_INDEX);
                setChild(currentElement, FAULT_INDEX, faultBranchHead, true);
            } else {
                convertBranchToAutoLayout(
                    elements,
                    conversionInfos,
                    currentElement as ParentNodeModel,
                    faultBranchHead as BranchHeadNodeModel,
                    FAULT_INDEX,
                    options
                );
            }
        }

        if (isLoop) {
            convertLoop(elements, conversionInfos, currentElement as ParentNodeModel, options);
        } else if (isBranching) {
            const branchingElement = currentElement as ParentNodeModel;

            convertBranchingElement(elements, conversionInfos, branchingElement, options);
            branchHead.isTerminal = areAllBranchesTerminals(branchingElement, elements);
        }

        // Continue along the branch unless the next connector is a goto
        currentElement = isGoTo ? null : nextElement;
    }
}

/**
 * Creates the Auto Layout Canvas elements from the Free Form Canvas elements
 *
 * @param elements - The free form elements
 * @returns the Auto Layout elements
 */
function createAutoLayoutElements(elements: UI.Elements): FlowModel {
    const autoLayoutElements = Object.values(elements).reduce((elementsMap, element) => {
        const canvasElement = { ...element } as any;

        elementsMap[element.guid] = canvasElement;

        if (canvasElement.isCanvasElement) {
            canvasElement.nodeType = getAlcElementType(element.elementType);

            // Resetting the config for all Canvas Elements
            canvasElement.config = { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false };
            if (canvasElement.locationX != null) {
                canvasElement.locationX = 0;
            }

            if (canvasElement.locationY != null) {
                canvasElement.locationY = 0;
            }
        }
        return elementsMap;
    }, {});

    const rootElement = createRootElement() as any;
    autoLayoutElements[rootElement.guid] = rootElement;

    return autoLayoutElements;
}

/**
 * Consolidates end connectors when possible in a Auto Layout Canvas UI Model
 *
 * @param elements - The Auto Layout Canvas elements
 * @param branchHead - The branch head
 * @param hasNext - whether the parent has a next
 * @returns The consolidated Auto Layout Canvas elements
 */
function consolidateEndConnectorsForBranch(
    elements: FlowModel,
    branchHead: BranchHeadNodeModel,
    hasNext = false
): UI.Elements {
    let element: NodeModel | null = branchHead;

    while (element != null) {
        if (element.fault != null) {
            consolidateEndConnectorsForBranch(elements, resolveBranchHead(elements, element.fault));
        }

        if (isBranchingElement(element)) {
            const branchingElement = element as ParentNodeModel;

            if (areAllBranchesTerminals(branchingElement, elements)) {
                branchingElement.children.forEach((child) => {
                    if (child != null) {
                        consolidateEndConnectorsForBranch(elements, resolveBranchHead(elements, child), true);
                    }
                });

                if (element.next == null) {
                    const next = element.next;
                    if (next == null) {
                        const newEnd = createEndElement({ prev: element.guid }) as any;
                        newEnd.nodeType = NodeType.END;
                        element.next = newEnd.guid;
                        // @ts-ignore
                        elements[newEnd.guid] = newEnd;
                    }
                }
            }
        }

        if (element.elementType === ELEMENT_TYPE.END_ELEMENT && hasNext) {
            const { prev, parent, childIndex } = element as BranchHeadNodeModel;

            if (prev != null) {
                const prevElement = elements[prev];
                prevElement.next = null;
            } else {
                const parentElement = elements[parent!] as ParentNodeModel;
                parentElement.children[childIndex] = null;
            }
            delete elements[element.guid];
        }

        element = element.next != null ? elements[element.next] : null;
    }

    if (branchHead != null && elements[branchHead.guid] != null) {
        const branchTail = findLastElement(branchHead as any, elements as any);
        branchHead.isTerminal =
            branchTail.elementType === ELEMENT_TYPE.END_ELEMENT ||
            (isBranchingElement(branchTail) && areAllBranchesTerminals(branchTail as ParentNodeModel, elements as any));
    }

    return elements;
}

/**
 * Consolidates end connectors when possible in a Auto Layout Canvas UI Model
 *
 * @param elements - The Auto Layout Canvas elements
 * @returns The consolidated Auto Layout Canvas elements
 */
export function consolidateEndConnectors(elements: UI.Elements): UI.Elements {
    const flowModel = elements as FlowModel;

    const rootElement = elements[ELEMENT_TYPE.ROOT_ELEMENT] as ParentNodeModel;

    const branchHeadGuid = rootElement.children[0]!;
    consolidateEndConnectorsForBranch(flowModel, elements[branchHeadGuid] as BranchHeadNodeModel);

    return elements;
}

/**
 * Converts a Free Form Canvas UI model to an Auto Layout Canvas UI model
 *
 * See this document for a more detailed explanation of the algorithm:
 * https://salesforce.quip.com/vm20ApWXnE62
 *
 * @param storeState - A Free Form Canvas UI model
 * @param options - Conversion options
 * @returns an Auto Layout Canvas UI model
 */
export function convertToAutoLayoutCanvas(
    storeState: UI.StoreState,
    options: Partial<ConvertToAutoLayoutCanvasOptions> = {}
): UI.StoreState {
    const convertOptions: ConvertToAutoLayoutCanvasOptions = {
        ...DEFAULT_CONVERT_TO_AUTO_LAYOUT_CANVAS_OPTIONS,
        ...options
    };
    // get the conversion infos
    const conversionInfos = computeAndValidateConversionInfos(storeState, convertOptions);

    // create the auto layout elements from the free form elements
    const autoLayoutElements = createAutoLayoutElements(storeState.elements);

    const startElement = findStartElement(autoLayoutElements);
    const rootElement = resolveParent(autoLayoutElements, ELEMENT_TYPE.ROOT_ELEMENT);

    // set the auto layout element pointers
    convertBranchToAutoLayout(autoLayoutElements, conversionInfos, rootElement, startElement, 0, convertOptions);

    let elements = options.shouldConsolidateEndConnectors
        ? consolidateEndConnectors(autoLayoutElements)
        : autoLayoutElements;

    // Inline all the branching elements to cleanup any elements with incoming go tos at merge points
    Object.values(elements).forEach((element) => {
        if (isBranchingElement(element)) {
            elements = inlineFromParent(elements as FlowModel, resolveParent(autoLayoutElements, element.guid));
        }
    });

    assertInDev(() => assertAutoLayoutState(elements as FlowModel));

    return {
        ...storeState,
        elements,
        canvasElements: [],
        connectors: []
    };
}
