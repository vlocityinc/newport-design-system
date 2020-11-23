import {
    areAllBranchesTerminals,
    addElementToState,
    FAULT_INDEX,
    findLastElement,
    assertInDev,
    assertAutoLayoutState,
    ParentNodeModel,
    FlowModel,
    NodeModel,
    BranchHeadNodeModel,
    resolveBranchHead,
    resolveParent
} from 'builder_platform_interaction/autoLayoutCanvas';

import { getChildReferencesKeys, getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { supportsChildren } from 'builder_platform_interaction/flcBuilderUtils';
import {
    Guid,
    ElementUi,
    CanvasElement,
    AutoLayoutCanvasElement,
    StoreState,
    ElementUis,
    ConnectorType
} from 'builder_platform_interaction/uiModel';

import { findStartElement, createRootElement } from 'builder_platform_interaction/flcBuilderUtils';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { createNewConnector } from 'builder_platform_interaction/connectorUtils';

import { dfs, ConversionInfo, ConversionInfos } from './freeFormToAutoLayout/dfs';
import { validateConversionInfos } from './freeFormToAutoLayout/validate';

export type ConvertToAutoLayoutCanvasOptions = Readonly<{
    // whether to consolidate end elements when possible
    shouldConsolidateEndConnectors: boolean;

    // whether to remove empty fault branches
    noEmptyFaults: boolean;
}>;

const DEFAULT_CONVERT_TO_AUTO_LAYOUT_CANVAS_OPTIONS: ConvertToAutoLayoutCanvasOptions = {
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
function findConnectionIndex(parentElement: NodeModel, childSource: Guid, type: ConnectorType): number {
    const { maxConnections } = parentElement;

    if (type === CONNECTOR_TYPE.FAULT) {
        return parentElement.maxConnections - 1;
    } else if (type === CONNECTOR_TYPE.DEFAULT) {
        const elementConfig = getConfigForElementType(parentElement.elementType) as any;
        const { canHaveFaultConnector } = elementConfig;
        return canHaveFaultConnector ? maxConnections - 2 : maxConnections - 1;
    }

    const { singular, plural } = getChildReferencesKeys();
    return parentElement[plural].findIndex((entry) => entry[singular] === childSource);
}

function isBranchingElement(element: ElementUi) {
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
export function computeAndValidateConversionInfos(storeState: StoreState): ConversionInfos {
    const { elements, connectors } = storeState;
    const startElement = findStartElement(elements) as any;

    // creates a ConversionInfo for each element
    const conversionInfos = Object.values(elements).reduce(
        (infos: Record<string, ConversionInfo>, element: ElementUi) => {
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

    // populate the ins, outs and fault for each ConnectorInfo
    connectors.forEach((connector) => {
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
 * @params options - The ConvertToAutoLayoutCanvasOptions
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
        const targetElement = elements[loopNextConnector.target];
        if (targetElement && targetElement.guid !== loopElement.guid) {
            const branchHead = resolveBranchHead(elements, loopNextConnector.target);
            convertBranchToAutoLayout(elements, conversionInfos, loopElement, branchHead, 0, options);
        }
    }
}

/**
 * Converts a branching element to Auto Layout Canvas
 *
 * @param elements - The flow elements
 * @param conversionInfos - The conversion infos
 * @param branchingElement - The branching element
 */
function convertBranchingElement(
    elements: FlowModel,
    conversionInfos: ConversionInfos,
    branchingElement: ParentNodeModel,
    options
) {
    const conversionInfo = conversionInfos[branchingElement.guid];
    const { outs } = conversionInfo;

    const elementConfig = getConfigForElementType(branchingElement.elementType) as any;
    const { canHaveFaultConnector } = elementConfig;

    const childCount = canHaveFaultConnector ? branchingElement.maxConnections - 1 : branchingElement.maxConnections;
    branchingElement.children = new Array(childCount).fill(null);

    if (outs.length > 0) {
        outs.forEach(({ childSource, target, type }) => {
            const childIndex = findConnectionIndex(branchingElement, childSource!, type);
            const targetElement = resolveBranchHead(elements, target);

            if (!isLinked(targetElement)) {
                convertBranchToAutoLayout(
                    elements,
                    conversionInfos,
                    branchingElement,
                    targetElement,
                    childIndex,
                    options
                );
            }
        });
    }
}

function isLinked(element: NodeModel) {
    return (<BranchHeadNodeModel>element).parent != null || element.prev != null;
}

/**
 * Returns the "next" element in a branch
 *
 * @param elements - The flow model
 * @param conversionInfos - The conversion infos
 * @param currentElement - The current element for which we want to find its next element
 * @return the next element in the branch or null there is none
 */
function getNextElement(elements: FlowModel, conversionInfos: ConversionInfos, currentElement: NodeModel) {
    const { isLoop, isBranching, mergeGuid, outs } = conversionInfos[currentElement.guid];
    let next;

    if (isLoop) {
        // for a loop, the end connector is the "next" element
        const loopEndConnector = outs.find((connector) => connector.type === CONNECTOR_TYPE.LOOP_END);
        next = loopEndConnector != null ? loopEndConnector.target : null;
    } else if (isBranching) {
        // if branching the mergeGuid is the "next" element
        next = mergeGuid;
    } else {
        // otherwise the out connector's target is the "next" element (if there is an out)
        next = outs.length === 1 ? outs[0].target : null;
    }

    const nextElement = elements[next];

    // if the next element hasn't been linked, it belongs to this branch, so return it
    if (nextElement && !isLinked(nextElement)) {
        return nextElement;
    }

    // otherwise it belongs to some ancestor branch, so return null
    return null;
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
    if (childIndex === FAULT_INDEX) {
        parentElement.fault = branchHead.guid;
    } else {
        parentElement.children[childIndex] = branchHead.guid;
    }

    // set the branch head pointers
    Object.assign(branchHead, {
        isTerminal: false,
        parent: parentElement.guid,
        childIndex,
        prev: null
    });

    let currentElement: NodeModel | null = branchHead;

    while (currentElement != null) {
        if (currentElement.elementType === ELEMENT_TYPE.END_ELEMENT) {
            branchHead.isTerminal = true;
            break;
        }

        const { fault, isLoop, isBranching } = conversionInfos[currentElement.guid];

        const nextElement = getNextElement(elements, conversionInfos, currentElement);

        if (nextElement) {
            // if we have an next element, we need to link it immediately, so recursive calls below to
            // convert a loop or a branch, will stop when when they encounter a linked element
            nextElement.prev = currentElement.guid;
            currentElement.next = nextElement.guid;
        } else {
            currentElement.next = null;
        }

        // process any fault
        if (fault != null) {
            const faultBranchHead = resolveBranchHead(elements, fault.target);
            if (faultBranchHead.elementType === ELEMENT_TYPE.END_ELEMENT && options.noEmptyFaults) {
                currentElement.fault = null;
            } else {
                convertBranchToAutoLayout(
                    elements,
                    conversionInfos,
                    currentElement as ParentNodeModel,
                    faultBranchHead,
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

        currentElement = nextElement;
    }
}

/**
 * Creates the Auto Layout Canvas elements from the Free Form Canvas elements
 *
 * @param elements - The free form elements
 * @return the Auto Layout elements
 */
function createAutoLayoutElements(elements: ElementUis): FlowModel {
    const autoLayoutElements = Object.values(elements).reduce((elementsMap, element) => {
        const canvasElement = { ...element } as CanvasElement;
        elementsMap[element.guid] = canvasElement;

        if (canvasElement.isCanvasElement) {
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
    elements: FlowModel,
    branchHead: BranchHeadNodeModel,
    hasNext = false
): ElementUis {
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
                        const newEnd = createEndElement({ prev: element.guid });
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
                const prevElement = elements[prev] as AutoLayoutCanvasElement;
                prevElement.next = null;
            } else {
                const parentElement = elements[parent!] as AutoLayoutCanvasElement;
                parentElement.children![childIndex!] = null;
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
 * @return The consolidated Auto Layout Canvas elements
 */
export function consolidateEndConnectors(elements: ElementUis): ElementUis {
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
 *
 * @return an Auto Layout Canvas UI model
 */
export function convertToAutoLayoutCanvas(
    storeState: StoreState,
    options: Partial<ConvertToAutoLayoutCanvasOptions> = {}
): StoreState {
    const convertOptions: ConvertToAutoLayoutCanvasOptions = {
        ...DEFAULT_CONVERT_TO_AUTO_LAYOUT_CANVAS_OPTIONS,
        ...options
    };
    // get the conversion infos
    const conversionInfos = computeAndValidateConversionInfos(storeState);

    // create the auto layout elements from the free form elements
    const autoLayoutElements = createAutoLayoutElements(storeState.elements);

    const startElement = findStartElement(autoLayoutElements) as BranchHeadNodeModel;
    const rootElement = resolveParent(autoLayoutElements, ELEMENT_TYPE.ROOT_ELEMENT);

    // set the auto layout element pointers
    convertBranchToAutoLayout(autoLayoutElements, conversionInfos, rootElement, startElement, 0, convertOptions);

    const elements = options.shouldConsolidateEndConnectors
        ? consolidateEndConnectors(autoLayoutElements)
        : autoLayoutElements;

    assertInDev(() => assertAutoLayoutState(elements as FlowModel));

    return {
        ...storeState,
        elements,
        canvasElements: [],
        connectors: []
    };
}
