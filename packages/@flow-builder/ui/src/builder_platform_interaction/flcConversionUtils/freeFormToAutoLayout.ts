// @ts-nocheck
import {
    linkElement,
    areAllBranchesTerminals,
    addElementToState,
    FAULT_INDEX,
    findLastElement,
    assertInDev,
    assertAutoLayoutState
} from 'builder_platform_interaction/autoLayoutCanvas';
import { getChildReferencesKeys, getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { supportsChildren } from 'builder_platform_interaction/flcBuilderUtils';
import {
    Guid,
    FlowElement,
    CanvasElement,
    AutoLayoutCanvasElement,
    FlowConnector,
    StringKeyedMap,
    StoreState,
    FlowElements,
    ConnectorType
} from 'builder_platform_interaction/flowModel';

import { findStartElement, createRootElement } from 'builder_platform_interaction/flcBuilderUtils';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { createNewConnector } from 'builder_platform_interaction/connectorUtils';
export interface ConvertToAutoLayoutCanvasOptions {
    // whether to consolidate end elements when possible
    shouldConsolidateEndConnectors: boolean;

    // whether to remove empty fault branches
    noEmptyFaults: boolean;
}

/**
 * Data structure associated with each canvas element to help with the conversion
 */
interface ConversionInfo {
    // if the element is branching (ie decision, wait)
    isBranching: boolean;

    // if the element is the loop element
    isLoop: boolean;

    // if the element is an end element
    isEnd: boolean;

    // whether the loop path is closed
    loopClosed: boolean;

    // the DFS visit order for the element
    dfsOrder: number | null;

    // number of times an element has been reached by the DFS
    reachedCount: number;

    // incoming connectors
    ins: FlowConnector[];

    // outgoing connectors (except fault)
    outs: FlowConnector[];

    // fault connector
    fault?: FlowConnector;

    // the immediate dominator for an element
    dominator: Guid | null;

    // the merge guid for a "branching" element
    mergeGuid?: Guid | null;

    // the branching guid for a "merge" element
    branchingGuid?: Guid | null;
}

const unsupportedElementTupes = [ELEMENT_TYPE.STEP];

const DEFAULT_CONVERT_TO_AUTO_LAYOUT_CANVAS_OPTIONS = {
    shouldConsolidateEndConnectors: true,
    noEmptyFaults: true
};

/**
 * Find the index in parentElement for a childSource guid
 *
 * @param parentElement - the parent element
 * @param childSource - the child source guid
 * @return the connection index in the parent
 */
function findConnectionIndex(parentElement: AutoLayoutCanvasElement, childSource: Guid, type: ConnectorType): number {
    const { maxConnections } = parentElement;

    if (type === CONNECTOR_TYPE.FAULT) {
        return parentElement.maxConnections - 1;
    } else if (type === CONNECTOR_TYPE.DEFAULT) {
        const elementConfig = getConfigForElementType(parentElement.elementType) as any;
        const { canHaveFaultConnector } = elementConfig;
        return canHaveFaultConnector ? maxConnections - 2 : maxConnections - 1;
    }

    const { singular, plural } = getChildReferencesKeys();
    return parentElement[plural].findIndex(entry => entry[singular] === childSource);
}

function isBranchingElement(element: FlowElement) {
    return supportsChildren(element) && element.elementType !== ELEMENT_TYPE.LOOP;
}

/**
 *  Returns the conversion infos for a Free Form flow that can be converted to Auto Layout Canvas
 *
 * @param storeState - The flow state
 * @return The conversion infos
 *
 * @throws Error when the flow can't be converted
 */
export function computeAndValidateConversionInfos(storeState: StoreState): StringKeyedMap<ConversionInfo> {
    const { elements, connectors } = storeState;
    const startElement = findStartElement(elements);

    // creates a ConversionInfo for each element
    const conversionInfos = Object.values(elements).reduce(
        (infos: StringKeyedMap<ConversionInfo>, element: FlowElement) => {
            if (element.isCanvasElement) {
                infos[element.guid] = {
                    elementGuid: element.guid,
                    isBranching: isBranchingElement(element),
                    isLoop: element.elementType === ELEMENT_TYPE.LOOP,
                    loopClosed: false,
                    isEnd: element.elementType === ELEMENT_TYPE.END_ELEMENT,
                    outs: [],
                    ins: [],
                    dominator: null,
                    reachedCount: 0,
                    dfsOrder: null
                };
            }
            return infos;
        },
        {}
    );

    // populate the ins, outs and fault for each ConnectorInfo
    connectors.forEach(connector => {
        const { source, target, type } = connector;

        if (target != null) {
            const sourceInfo = conversionInfos[source];
            const targetInfo = conversionInfos[target];

            targetInfo.ins.push(connector);
            if (type === CONNECTOR_TYPE.FAULT) {
                sourceInfo.fault = connector;
            } else {
                sourceInfo.outs.push(connector);
            }
        }
    });

    // for free form flo loops with no next connector, we need to generate one
    Object.values(conversionInfos).forEach(conversionInfo => {
        const { isLoop, outs, ins, elementGuid } = conversionInfo;
        if (isLoop && outs.length !== 2) {
            // create a new next connector
            const nextConnector = createNewConnector(elements, elementGuid, elementGuid, CONNECTOR_TYPE.LOOP_NEXT);
            connectors.push(nextConnector);
            outs.push(nextConnector);
            ins.push(nextConnector);

            //  adjust element metadata
            // const element = elements[elementGuid];
            // element.availableConnections.filter(connector => connector.type !== CONNECTOR_TYPE.LOOP_NEXT);
            // element.connectorCount++;
        }
    });

    // dfs the Free Form flow, starting with the start element
    dfs(conversionInfos, ELEMENT_TYPE.ROOT_ELEMENT, startElement.guid, 0);

    if (!validateConversionInfos(elements, conversionInfos)) {
        throw new Error("Can't convert Free Form Flow to Auto Layout");
    }

    return conversionInfos;
}

/**
 * Validates the conversion infos
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @return true they are all valid
 */
function validateConversionInfos(elements: FlowElements, conversionInfos: StringKeyedMap<ConversionInfo>): boolean {
    const flowElements = Object.values(elements);

    for (let i = 0; i < flowElements.length; i++) {
        const element = flowElements[i];
        const { guid, elementType } = element;

        if (unsupportedElementTupes.includes(elementType)) {
            throw new Error('unsupported element type');
        }

        const elementInfo = conversionInfos[guid];

        if (elementInfo != null) {
            const { reachedCount, ins, dfsOrder, loopClosed } = elementInfo;

            const expectedReachedCount = ins.length;

            if (reachedCount !== expectedReachedCount) {
                // all non-loop elements must have been reached from all their incoming connectors
                throw new Error('reachedCount !== expectedReachedCount');
            } else if (ins.length > 1 && elementInfo.branchingGuid == null && elementType !== ELEMENT_TYPE.LOOP) {
                // all "merge" elements must have a branching guid
                throw new Error('branching guid');
            } else if (dfsOrder == null) {
                // found an orphan node
                throw new Error('orphan guid');
            } else if (elementType === ELEMENT_TYPE.LOOP && !loopClosed) {
                throw new Error('open loop');
            }
        }
    }

    return true;
}

/**
 * Checks if a parent guid dominates a child guid
 *
 * @param conversionInfos - The conversion infos
 * @param parentGuid - A parent guid
 * @param childGuid - A child guid
 *
 * @return true if parentGuid dominates childGuid
 */
function dominates(conversionInfos: StringKeyedMap<ConversionInfo>, parentGuid: Guid, childGuid: Guid | null) {
    let conversionInfo = conversionInfos[childGuid];

    while (conversionInfo != null) {
        // don't cross a loop boundary
        if (conversionInfo.isLoop) {
            return false;
        }

        conversionInfo = conversionInfos[conversionInfo.dominator];
        if (conversionInfo && conversionInfo.elementGuid === parentGuid) {
            return true;
        }
    }

    // if both are the root
    return parentGuid === ELEMENT_TYPE.ROOT_ELEMENT;
}

/**
 * Checks if an element guid has a loop ancestor
 *
 * @param conversionInfos - The conversion infoss
 * @param elementGuid - An element guid
 *
 * @return true if an element guid has a loop ancestor
 */
function hasLoopAncestor(conversionInfos: StringKeyedMap<ConversionInfo>, elementGuid: Guid) {
    let conversionInfo = conversionInfos[elementGuid];

    while (conversionInfo != null) {
        // don't cross a loop boundary
        if (conversionInfo.isLoop) {
            return true;
        }

        conversionInfo = conversionInfos[conversionInfo.dominator];
    }

    return false;
}

/**
 * Check if an element is a "merge" element.
 * A merge element is an element that is not a loop and which has multiple ins and is not dominated by
 * the current element.
 *
 * @param element - The element
 * @param currentElementGuid - The current element guid
 * @return true if the element is a merge element
 */
function isMerge(conversionInfos: StringKeyedMap<ConversionInfo>, elementGuid: Guid) {
    const { ins, isLoop } = conversionInfos[elementGuid];
    return ins.length > 1 && !isLoop;
}

/**
 * When a "merge" element is encountered we might need to update its dominator
 *
 * @param conversionInfos - the conversion infos
 * @param mergeGuid - the merge guid
 * @param dominatorCandidate - the a new candidate for the merge element's dominator
 */
function updateMergeElementDominator(
    conversionInfos: StringKeyedMap<ConversionInfo>,
    mergeGuid: Guid,
    dominatorCandidate: Guid
) {
    const mergeElementInfo = conversionInfos[mergeGuid];
    let { dominator } = mergeElementInfo;

    if (dominator != null && dominatorCandidate !== dominator) {
        // one of the current dominator and the dominator candidate, must dominate the other
        if (dominates(conversionInfos, dominatorCandidate, dominator)) {
            dominator = dominatorCandidate;
        } else if (!dominates(conversionInfos, dominator, dominatorCandidate)) {
            throw new Error();
        }
    } else {
        dominator = dominatorCandidate;
    }

    mergeElementInfo.dominator = dominator;
}

/**
 * When a branching element doesn't have its own merge guid, look up its dominating ancestors
 *
 * @param conversionInfos - the conversion infos
 * @param branchingGuid - the branching element's guid
 * @return the merge guid for the branching element
 */
function findMerge(conversionInfos, branchingGuid) {
    while (branchingGuid !== ELEMENT_TYPE.ROOT_ELEMENT) {
        const ancestorInfo = conversionInfos[branchingGuid];
        if (ancestorInfo == null) {
            return null;
        }
        const { mergeGuid } = ancestorInfo;

        if (mergeGuid != null) {
            return mergeGuid;
        }

        branchingGuid = ancestorInfo.dominator;
    }

    return null;
}

/**
 * Performs a "tweeked" dfs of the Free Form Flow.
 *
 * The algorithm traverses the graph depth first, but when it reaches a "merge" element,
 * it doesn't visit that element until that the element has been reached as many times
 * as it has in connectors.
 *
 * The algorithm computes the dominator for each element, as well as the mergeGuid for "branching" elements.
 *
 * @param conversionInfos - The conversion infos
 * @param parentGuid - The parent guid
 * @param elementGuid - The element guid
 * @param dfsOrder - The dfs traversal order
 */
function dfs(
    conversionInfos: StringKeyedMap<ConversionInfo>,
    dominator: Guid,
    elementGuid: Guid,
    dfsOrder: number
): void {
    const elementInfo = conversionInfos[elementGuid];
    const { outs, fault, isBranching, isEnd } = elementInfo;

    elementInfo.dfsOrder = dfsOrder++;
    elementInfo.dominator = dominator;

    if (isEnd && hasLoopAncestor(conversionInfos, elementGuid)) {
        throw new Error('Found end in loop');
    }

    if (fault != null) {
        // make the fault dominator a guid that doesn't exist, so that the fault branch can't be reconnected
        const faultDominator = `${elementGuid}-fault`;
        conversionInfos[fault.target].reachedCount++;
        dfs(conversionInfos, faultDominator, fault.target, dfsOrder);
    }

    for (let i = 0; i < outs.length; i++) {
        let nextDominator = isBranching ? elementGuid : dominator;
        if (outs[i].type === CONNECTOR_TYPE.LOOP_NEXT) {
            nextDominator = elementGuid;
        }

        const nextElementGuid = outs[i].target;
        const nextElementInfo = conversionInfos[nextElementGuid];

        nextElementInfo.reachedCount++;

        if (nextElementInfo.dfsOrder != null) {
            if (nextElementInfo.dfsOrder <= elementInfo.dfsOrder!) {
                // if we have back edge, then it must be a valid loop back:
                // check that "element" is dominated by the loop it points back to
                const isValidBackEdge =
                    nextElementInfo.isLoop &&
                    (elementInfo.dominator === nextElementGuid ||
                        dominates(conversionInfos, nextElementGuid, elementInfo.dominator) ||
                        elementGuid === nextElementGuid);

                if (!isValidBackEdge) {
                    throw new Error('backedge');
                } else {
                    nextElementInfo.loopClosed = true;

                    // eslint-disable-next-line no-continue
                    continue;
                }
            }
        }

        if (isMerge(conversionInfos, nextElementGuid)) {
            updateMergeElementDominator(conversionInfos, nextElementGuid, nextDominator);

            if (nextElementInfo.reachedCount === nextElementInfo.ins.length) {
                const branchingGuid = nextElementInfo.dominator!;
                nextElementInfo.branchingGuid = branchingGuid;

                if (conversionInfos[branchingGuid].mergeGuid != null) {
                    throw new Error('merge guid not null');
                } else {
                    conversionInfos[branchingGuid].mergeGuid = nextElementGuid;
                    nextDominator = conversionInfos[branchingGuid].dominator!;
                }
            } else {
                // eslint-disable-next-line no-continue
                continue;
            }
        }

        dfs(conversionInfos, nextDominator, nextElementGuid, dfsOrder);
    }
}

/**
 * Converts a loop element to Auto Layout Canvas
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @param loopElement - The loop element
 */
function convertLoop(
    elements: FlowElements,
    conversionInfos: StringKeyedMap<ConversionInfo>,
    loopElement: AutoLayoutCanvasElement,
    options
) {
    const { outs } = conversionInfos[loopElement.guid];
    loopElement.children = [null];

    const loopNextConnector = outs.find(connector => connector.type === CONNECTOR_TYPE.LOOP_NEXT);

    if (loopNextConnector != null) {
        if (loopNextConnector.target !== loopElement.guid) {
            const branchHead = elements[loopNextConnector.target] as AutoLayoutCanvasElement;
            convertBranchToAutoLayout(elements, conversionInfos, loopElement, branchHead, 0, options, loopElement.guid);
        }
    }

    // set the loopElement's next pointer
    const loopEndConnector = outs.find(connector => connector.type === CONNECTOR_TYPE.LOOP_END);
    loopElement.next = loopEndConnector != null ? loopEndConnector.target : null;
}

/**
 * Converts a branching element to Auto Layout Canvas
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @param branchingElement - The branching element
 */
function convertBranchingElement(
    elements: FlowElements,
    conversionInfos: StringKeyedMap<ConversionInfo>,
    branchingElement: AutoLayoutCanvasElement,
    options,
    loopElementGuid: Guid | null = null
): boolean {
    const conversionInfo = conversionInfos[branchingElement.guid];
    const { outs } = conversionInfo;

    const mergeGuid = conversionInfo.mergeGuid || findMerge(conversionInfos, branchingElement.guid);

    const elementConfig = getConfigForElementType(branchingElement.elementType) as any;
    const { canHaveFaultConnector } = elementConfig;

    const childCount = canHaveFaultConnector ? branchingElement.maxConnections - 1 : branchingElement.maxConnections;
    branchingElement.children = new Array(childCount).fill(null);
    branchingElement.next = mergeGuid;

    if (outs.length > 0) {
        outs.forEach(({ childSource, target, type }) => {
            const childIndex = findConnectionIndex(branchingElement, childSource!, type);
            if (target !== mergeGuid && target !== loopElementGuid) {
                const branchHead = elements[target] as AutoLayoutCanvasElement;
                convertBranchToAutoLayout(
                    elements,
                    conversionInfos,
                    branchingElement,
                    branchHead,
                    childIndex,
                    options,
                    loopElementGuid
                );
            }
        });
    } else {
        branchingElement.next = null;
    }

    // @ts-ignore
    return areAllBranchesTerminals(branchingElement, elements);
}

/**
 * Checks if the next element is a "merge" element, or loops back to its parent loop element
 *
 * @param conversionInfos - The conversion infos
 * @param parentElement - The parent element
 * @param nextElement - The next element
 * @return true if is a merge or loop back
 */
function isMergeOrLoopBack(
    conversionInfos: StringKeyedMap<ConversionInfo>,
    parentElement: AutoLayoutCanvasElement,
    nextElement: FlowElement
) {
    return (
        nextElement.guid === parentElement.next ||
        (conversionInfos[nextElement.guid].isLoop && nextElement.guid === parentElement.guid)
    );
}

/**
 * Converts a branch to Auto Canvas and any child branches recursively
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @param parentElement - The parent element
 * @param branchHead - The branch head element
 * @param childIndex - The child index
 */
function convertBranchToAutoLayout(
    elements: FlowElements,
    conversionInfos: StringKeyedMap<ConversionInfo>,
    parentElement: AutoLayoutCanvasElement,
    branchHead: AutoLayoutCanvasElement,
    childIndex: number,
    options,
    loopElementGuid: Guid | null = null
) {
    // set the parent pointers
    if (childIndex === FAULT_INDEX) {
        parentElement.fault = branchHead.guid;
    } else {
        parentElement.children![childIndex] = branchHead.guid;
    }

    // set the branch head pointers
    branchHead.isTerminal = false;
    branchHead.parent = parentElement.guid;
    branchHead.childIndex = childIndex;
    branchHead.prev = null;

    let currentElement = branchHead;

    while (currentElement != null) {
        if (currentElement.elementType === ELEMENT_TYPE.END_ELEMENT) {
            branchHead.isTerminal = true;
            break;
        }

        const { outs, fault, isLoop, isBranching } = conversionInfos[currentElement.guid];

        let next;

        // process any fault
        if (fault != null) {
            const faultBranchHead = elements[fault.target] as AutoLayoutCanvasElement;
            if (faultBranchHead.elementType === ELEMENT_TYPE.END_ELEMENT && options.noEmptyFaults) {
                currentElement.fault = null;
            } else {
                convertBranchToAutoLayout(
                    elements,
                    conversionInfos,
                    currentElement,
                    faultBranchHead,
                    FAULT_INDEX,
                    options
                );
            }
        }

        if (isLoop) {
            convertLoop(elements, conversionInfos, currentElement, options);
            next = currentElement.next;
        } else if (isBranching) {
            const allTerminals = convertBranchingElement(
                elements,
                conversionInfos,
                currentElement,
                options,
                loopElementGuid
            );

            if (allTerminals) {
                branchHead.isTerminal = true;
            }
            next = currentElement.next;
        } else {
            next = outs.length === 1 ? outs[0].target : null;
        }

        if (next != null && next === loopElementGuid) {
            currentElement.next = null;
            // @ts-ignore
            currentElement = null;
        } else if (next != null && !isMergeOrLoopBack(conversionInfos, parentElement, elements[next])) {
            const nextElement = elements[next] as AutoLayoutCanvasElement;

            currentElement.next = nextElement.guid;
            // @ts-ignore
            linkElement(elements, currentElement);
            currentElement = nextElement;
        } else {
            currentElement.next = null;
            // @ts-ignore
            currentElement = null;
        }
    }
}

/**
 * Checks if a flow can be converted to Auto Layout Canvas
 *
 * @param state - A Free Form Canvas UI flow state
 * @return true if can be convertd to Auto Layout Canvas
 */
export function canConvertToAutoLayoutCanvas(storeState: StoreState) {
    try {
        computeAndValidateConversionInfos(storeState);
    } catch (e) {
        return false;
    }

    return true;
}

/**
 * Creates the Auto Layout Canvas elements from the Free Form Canvas elements
 *
 * @param elements - The free form elements
 * @return the Auto Layout elements
 */
function createAutoLayoutElements(elements: FlowElements): FlowElements {
    const autoLayoutElements = Object.values(elements).reduce((elementsMap, element) => {
        const canvasElement = { ...element } as CanvasElement;
        elementsMap[element.guid] = canvasElement;

        if (canvasElement.isCanvasElement) {
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

    // @ts-ignore
    addElementToState(rootElement, autoLayoutElements);

    return autoLayoutElements;
}

/**
 * Consolidates end connectors when possible in a Auto Layout Canvas UI Model
 *
 * @param elements - The Auto Layout Canvas elements
 * @param branchHead - The branch head
 * @param hasNext - whether the parent has a next
 * @return The consolidated Auto Layout Canvas elements
 */
function consolidateEndConnectorsForBranch(
    elements: FlowElements,
    branchHead: AutoLayoutCanvasElement,
    hasNext = false
): FlowElements {
    let element = branchHead;

    while (element != null) {
        if (element.fault != null) {
            consolidateEndConnectorsForBranch(elements, elements[element.fault] as AutoLayoutCanvasElement);
        }

        if (isBranchingElement(element) && areAllBranchesTerminals(element, elements)) {
            // eslint-disable-next-line no-loop-func
            element.children!.forEach(child => {
                if (child != null) {
                    consolidateEndConnectorsForBranch(elements, elements[child] as AutoLayoutCanvasElement, true);
                }
            });

            if (element.next == null) {
                const next = element.next;
                if (next == null) {
                    const newEnd = createEndElement({ prev: element.guid });
                    element.next = newEnd.guid;
                    elements[newEnd.guid] = newEnd;
                }
            }
        }

        if (element.elementType === ELEMENT_TYPE.END_ELEMENT && hasNext) {
            const { prev, parent, childIndex } = element;

            if (prev != null) {
                const prevElement = elements[prev] as AutoLayoutCanvasElement;
                prevElement.next = null;
            } else {
                const parentElement = elements[parent!] as AutoLayoutCanvasElement;
                parentElement.children![childIndex!] = null;
            }
            delete elements[element.guid];
        }

        element = (element.next != null ? elements[element.next] : null) as AutoLayoutCanvasElement;
    }

    if (branchHead != null && elements[branchHead.guid] != null) {
        const branchTail = findLastElement(branchHead, elements);
        branchHead.isTerminal =
            branchTail.elementType === ELEMENT_TYPE.END_ELEMENT ||
            (isBranchingElement(branchTail) && areAllBranchesTerminals(branchTail, elements));
    }

    return elements;
}

/**
 * Consolidates end connectors when possible in a Auto Layout Canvas UI Model
 *
 * @param elements - The Auto Layout Canvas elements
 * @return The consolidated Auto Layout Canvas elements
 */
export function consolidateEndConnectors(elements: FlowElements): FlowElements {
    const rootElement = elements[ELEMENT_TYPE.ROOT_ELEMENT] as AutoLayoutCanvasElement;
    // @ts-ignore
    consolidateEndConnectorsForBranch(elements, elements[rootElement.children[0]]);

    return elements;
}

/**
 * Converts a Free Form Canvas UI model to an Auto Layout Canvas UI model
 *
 * @param storeState - A Free Form Canvas UI model
 * @param options - Conversion options
 *
 * @return an Auto Layout Canvas UI model
 */
export function convertToAutoLayoutCanvas(
    storeState: StoreState,
    options: ConvertToAutoLayoutCanvasOptions = DEFAULT_CONVERT_TO_AUTO_LAYOUT_CANVAS_OPTIONS
): StoreState {
    // get the conversion infos
    const conversionInfos = computeAndValidateConversionInfos(storeState);

    // create the auto layout elements from the free form elements
    const autoLayoutElements = createAutoLayoutElements(storeState.elements);

    const startElement = findStartElement(autoLayoutElements) as AutoLayoutCanvasElement;
    const rootElement = autoLayoutElements[ELEMENT_TYPE.ROOT_ELEMENT] as AutoLayoutCanvasElement;

    // set the auto layout element pointers
    convertBranchToAutoLayout(autoLayoutElements, conversionInfos, rootElement, startElement, 0, options);

    const elements = options.shouldConsolidateEndConnectors
        ? consolidateEndConnectors(autoLayoutElements)
        : autoLayoutElements;

    assertInDev(() => assertAutoLayoutState(elements));

    return {
        ...storeState,
        elements,
        canvasElements: [],
        connectors: []
    };
}
