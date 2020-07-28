// @ts-nocheck
import {
    calculateFlowLayout,
    getDefaultLayoutConfig,
    FlowRenderContext,
    getBranchLayoutKey,
    FAULT_INDEX,
    assertInDev
} from 'builder_platform_interaction/autoLayoutCanvas';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getChildReferencesKeys, getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { findStartYOffset } from 'builder_platform_interaction/elementFactory';
import { supportsChildren, flcExtraProps } from 'builder_platform_interaction/flcBuilderUtils';
import { findStartElement } from 'builder_platform_interaction/flcBuilderUtils';
import { createNewConnector } from 'builder_platform_interaction/connectorUtils';

import {
    Guid,
    CanvasElement,
    FlowElement,
    FlowElements,
    AutoLayoutCanvasElement,
    FlowConnector,
    StringKeyedMap,
    AvailableConnection,
    StoreState
} from 'builder_platform_interaction/flowModel';

interface Position {
    x: number;
    y: number;
}
type ElementsPositionMap = StringKeyedMap<Position>;

function createInitialFlowRenderContext(flowModel): FlowRenderContext {
    return {
        flowModel,
        nodeLayoutMap: {},
        interactionState: {},
        elementsMetadata: {},
        layoutConfig: { ...getDefaultLayoutConfig() },
        isDeletingBranch: false
    } as FlowRenderContext;
}

function getNodeLayoutMap(flowModel) {
    const flowRenderContext = createInitialFlowRenderContext(flowModel);
    calculateFlowLayout(flowRenderContext);
    return flowRenderContext.nodeLayoutMap;
}

/**
 * Calculates the absolute position of each Auto Layout Canvas element
 *
 * @param elements - The flow elements
 * @param startOffsetX - x offset of the start element
 * @param startOffsetY - y offset of the start element
 * @return the a map of the positions for the elements
 */
function calculateElementPositions(
    elements: FlowElements,
    startOffsetX: number,
    startOffsetY: number
): StringKeyedMap<Position> {
    const elementsPosition = {};
    const startElement = findStartElement(elements) as AutoLayoutCanvasElement;
    const nodeLayoutMap = getNodeLayoutMap(elements);

    // The Start Position here maps to the top-left corner of the start menu container.
    // 126 is the gap between the start icon's left most point and top-left corner of the start menu container.
    const startPosition = {
        x: startOffsetX - 126,
        y: startOffsetY
    };

    elementsPosition[startElement.guid] = startPosition;

    const firstElement = elements[startElement.next!] as AutoLayoutCanvasElement;

    // Getting offsetY for the following elements. startOffsetY is at the top of the Start Contextual Menu.
    // findStartYOffset returns Start Contextual Menu heigh.
    // Subtracting 168 to incorporate for the "y" amount being added in the calculations further down.
    const offsetY = startOffsetY + findStartYOffset(startElement) - 168;

    // TODO: need to fix the position calculations and remove the hard coded values above
    calculateElementPositionsForBranch(nodeLayoutMap, elementsPosition, elements, firstElement, startOffsetX, offsetY);

    return elementsPosition;
}

function calculateElementPositionsForBranch(
    nodeLayoutMap,
    elementsPosition: ElementsPositionMap,
    elementsMap: FlowElements,
    element: AutoLayoutCanvasElement,
    offsetX: number,
    offsetY: number
): void {
    while (element != null) {
        const { y } = nodeLayoutMap[element.guid].layout;

        const position = {
            x: offsetX,
            y: offsetY + y
        };

        elementsPosition[element.guid] = position;

        if (element.children) {
            // eslint-disable-next-line no-loop-func
            element.children.forEach((child, i) => {
                if (child != null) {
                    const branchOffsetX = nodeLayoutMap[getBranchLayoutKey(element.guid, i)].layout.x;

                    calculateElementPositionsForBranch(
                        nodeLayoutMap,
                        elementsPosition,
                        elementsMap,
                        elementsMap[child] as AutoLayoutCanvasElement,
                        position.x + branchOffsetX,
                        position.y
                    );
                }
            });
        }

        if (element.fault) {
            const faultOffsetX = nodeLayoutMap[getBranchLayoutKey(element.guid, FAULT_INDEX)].layout.x;
            calculateElementPositionsForBranch(
                nodeLayoutMap,
                elementsPosition,
                elementsMap,
                elementsMap[element.fault] as AutoLayoutCanvasElement,
                position.x + faultOffsetX,
                position.y
            );
        }

        // if a loop has a branch head that loops back to itself, we need to adjust the offsetY as in free form this will be a loop with
        // no LOOP_NEXT connector
        if (element.elementType === ELEMENT_TYPE.LOOP) {
            const loopBranchHead = element.children[0];
            if (loopBranchHead != null && loopBranchHead.guid === element.guid) {
                offsetY -= y;
            }
        }

        element = elementsMap[element.next!] as AutoLayoutCanvasElement;
    }
}

/**
 * Find the childSource at a given index for a parentElement
 *
 * @param parentElement - A parent element
 * @param index - The index
 * @return The child source guid
 */
function findChildSource(parentElement: FlowElement, index: number): Guid {
    const { singular, plural } = getChildReferencesKeys();
    return parentElement[plural][index][singular];
}

/**
 * Creates the connector for a branch head element
 *
 * @param elements - The flow elements
 * @param parentElement - The parent element
 * @param childIndex - The index of the child in its parent
 * @param ancestorNext - Where to go when the branch head is null
 *
 * @return a connector for the branch head
 */
function createConnectorForBranchHead(
    elements: FlowElements,
    parentElement: AutoLayoutCanvasElement,
    childIndex: number,
    ancestorNext: Guid | null
): FlowConnector {
    const child = parentElement.children![childIndex];

    const source = parentElement.guid;
    // when the branch head is null, the flow continues to ancestorNext (the parentElement's next or if
    // that is null, the first ancestor parent's next that is not null)
    const target = child != null ? elements[child].guid : ancestorNext;

    let childSource: Guid | null = null;
    let type;

    const numChildren = parentElement.children!.length;
    if (parentElement.elementType === ELEMENT_TYPE.LOOP) {
        type = CONNECTOR_TYPE.LOOP_NEXT;
    } else {
        const defaultIndex = numChildren - 1;

        if (childIndex === FAULT_INDEX) {
            type = CONNECTOR_TYPE.FAULT;
        } else if (childIndex === defaultIndex) {
            type = CONNECTOR_TYPE.DEFAULT;
        } else {
            type = CONNECTOR_TYPE.REGULAR;
            childSource = findChildSource(parentElement, childIndex);
        }
    }

    const connector = createNewConnector(elements, source, target, type);
    if (childSource != null) {
        connector.childSource = childSource;
        connector.label = elements[childSource].label || null;
    }
    return connector;
}

/**
 * Creates a Free Form Canvas element from an Auto Layout Canvas element
 *
 * @param elements - The flow elements
 * @param alcCanvasElement - A alc element
 * @returns A Free Form Canvas element
 */
function toCanvasElement(elements: FlowElements, alcCanvasElement: AutoLayoutCanvasElement): CanvasElement {
    const canvasElement = { ...alcCanvasElement, connectorCount: 0 };

    const elementConfig = getConfigForElementType(alcCanvasElement.elementType) as any;
    const { canHaveFaultConnector } = elementConfig;

    let availableConnections: AvailableConnection[] = [];
    const supportsMultipleConnectors = supportsChildren(alcCanvasElement) || elementConfig.canHaveFaultConnector;
    let maxConnections = 1;

    if (alcCanvasElement.elementType === ELEMENT_TYPE.LOOP) {
        if (isEndElementOrNull(elements, alcCanvasElement.children![0])) {
            availableConnections.push({ type: CONNECTOR_TYPE.LOOP_NEXT });
        }

        if (isEndElementOrNull(elements, alcCanvasElement.next)) {
            availableConnections.push({ type: CONNECTOR_TYPE.LOOP_END });
        }

        maxConnections = 2;
    } else if (supportsChildren(alcCanvasElement)) {
        // @ts-ignore
        availableConnections = [
            ...alcCanvasElement.childReferences!.map(cr => ({
                childReference: cr.childReference,
                type: CONNECTOR_TYPE.REGULAR
            })),

            { type: CONNECTOR_TYPE.DEFAULT }
        ];

        maxConnections = alcCanvasElement.childReferences!.length + 1;
    }

    if (canHaveFaultConnector) {
        if (isEndElementOrNull(elements, alcCanvasElement.fault)) {
            availableConnections.push({ type: CONNECTOR_TYPE.FAULT });
        }
        maxConnections += 1;
    }

    canvasElement.maxConnections = maxConnections;

    if (supportsMultipleConnectors) {
        canvasElement.availableConnections = availableConnections;
    }

    // remove all the Auto Layout specific props
    flcExtraProps.forEach(prop => delete canvasElement[prop]);

    return canvasElement;
}

/**
 * Checks for an end element
 *
 * @param element - A canvas element
 * @returns true if the element is an end element
 */
function isEndElement(element: CanvasElement) {
    return element.elementType === ELEMENT_TYPE.END_ELEMENT;
}

function isEndElementOrNull(alcElementsMap, elementGuid: Guid | null | undefined) {
    return elementGuid == null || isEndElement(alcElementsMap[elementGuid]);
}

/**
 * Creates connectors for a parent's children and their descendents
 *
 * @param storeState - The free form state
 * @param alcElementsMap - The alc elements map
 * @param branchingElement  - The branching element
 * @param ancestorNext - The branch's ancestor next
 * @returns true if all child branches are terminals
 */
function convertBranchingElement(
    storeState: StoreState,
    elements: FlowElements,
    branchingElement: AutoLayoutCanvasElement,
    ancestorNext: Guid | null
) {
    ancestorNext = branchingElement.next || ancestorNext;

    branchingElement.children!.forEach((child, i) => {
        if (child != null) {
            const childElement = elements[child] as AutoLayoutCanvasElement;

            const connector = createConnectorForBranchHead(elements, branchingElement, i, null);
            storeState.connectors.push(connector);

            convertBranchToFreeForm(storeState, elements, childElement, ancestorNext);
        } else if (ancestorNext != null && branchingElement.elementType !== ELEMENT_TYPE.LOOP) {
            const connector = createConnectorForBranchHead(elements, branchingElement, i, ancestorNext);
            storeState.connectors.push(connector);
        }
    });
}

/**
 * Creates connectors for a parent's children and their descendents
 *
 * @param storeState - The free form state
 * @param elements - The elements
 * @param loopElement  - The loop element
 * @param ancestorNext - The loop's ancestor next
 * @returns true if all child branches are terminals
 */
function convertLoopElement(
    storeState: StoreState,
    elements: FlowElements,
    loopElement: AutoLayoutCanvasElement,
    ancestorNext: Guid | null
) {
    const loopNext = loopElement.children![0];
    if (loopNext != null) {
        addConnector(elements, loopElement.guid, loopNext, storeState, CONNECTOR_TYPE.LOOP_NEXT);
        convertBranchToFreeForm(storeState, elements, elements[loopNext] as AutoLayoutCanvasElement, loopElement.guid);
    }

    ancestorNext = loopElement.next || ancestorNext;

    if (ancestorNext != null) {
        addConnector(elements, loopElement.guid, ancestorNext, storeState, CONNECTOR_TYPE.LOOP_END);
    }
}

/**
 * Adds a connector to either the store or to the endConnectors
 *
 * @param alcElementsMap - The alc elements
 * @param source - The source guid
 * @param target- The target guid
 * @param ffcStoreState - The ffc store
 * @param type - The connector type
 */
function addConnector(
    alcElementsMap: FlowElements,
    source: Guid,
    target: Guid,
    ffcStoreState: StoreState,
    type: string = CONNECTOR_TYPE.REGULAR
): void {
    const connector = createNewConnector(alcElementsMap, source, target, type);
    ffcStoreState.connectors.push(connector);
}

/**
 * Creates connectors for a branch, recursively
 *
 * @param ffcStoreState - The free form state
 * @param alcElementsMap - The alc elements map
 * @param alcBranchHeadElement - The branch head element
 * @param ancestorNext - The Guid of the element the control flow continues to when the branch is done
 */
function convertBranchToFreeForm(
    ffcStoreState: StoreState,
    alcElementsMap: FlowElements,
    alcBranchHeadElement: AutoLayoutCanvasElement,
    ancestorNext: Guid | null
): void {
    let alcElement = alcBranchHeadElement;

    while (alcElement != null) {
        const { fault, guid, next } = alcElement;

        // create an ffc element from the alc element and add it to the storeState
        const canvasElement = toCanvasElement(alcElementsMap, alcElement);
        ffcStoreState.elements[guid] = canvasElement;
        ffcStoreState.canvasElements.push(guid);

        // stop if we hit an end element
        if (isEndElement(alcElement)) {
            break;
        }

        // process any fault branch
        if (fault != null) {
            addConnector(alcElementsMap, guid, fault, ffcStoreState, CONNECTOR_TYPE.FAULT);
            convertBranchToFreeForm(
                ffcStoreState,
                alcElementsMap,
                alcElementsMap[fault] as AutoLayoutCanvasElement,
                null
            );
        }

        // process any children
        if (supportsChildren(alcElement)) {
            if (alcElement.elementType === ELEMENT_TYPE.LOOP) {
                convertLoopElement(ffcStoreState, alcElementsMap, alcElement, ancestorNext);
            } else {
                convertBranchingElement(ffcStoreState, alcElementsMap, alcElement, ancestorNext);
            }
        } else {
            // if next null, then the last element of the branch will connect to ancestorNext
            const targetNext = next != null ? next : ancestorNext;
            if (targetNext != null) {
                addConnector(alcElementsMap, guid, targetNext, ffcStoreState);
            }
        }

        const nextElement = next != null ? alcElementsMap[next] : null;
        alcElement = nextElement as AutoLayoutCanvasElement;
    }
}

function assertStoreState(storeState: StoreState) {
    const { elements, connectors } = storeState;

    Object.values(elements)
        .filter(element => element.isCanvasElement)
        .forEach(element => {
            const { guid, elementType, connectorCount, availableConnections, childReferences } = element;
            const { canHaveFaultConnector } = getConfigForElementType(elementType) as any;
            let { maxConnections } = getConfigForElementType(elementType) as any;
            const elementConnectors = connectors.filter(connector => connector.source === guid);

            const childReferencesMap = elementConnectors.reduce((acc, childRef) => {
                acc[childRef.childReference] = true;
                return acc;
            }, {});

            if (maxConnections > 1) {
                let expectedAvailableConnections = [...childReferences];

                if (elementType === ELEMENT_TYPE.LOOP) {
                    expectedAvailableConnections.push({ type: CONNECTOR_TYPE.LOOP_END });
                    expectedAvailableConnections.push({ type: CONNECTOR_TYPE.LOOP_NEXT });
                } else if (elementType === ELEMENT_TYPE.WAIT || elementType === ELEMENT_TYPE.DECISION) {
                    expectedAvailableConnections.push({ type: CONNECTOR_TYPE.DEFAULT });
                }
                if (canHaveFaultConnector) {
                    expectedAvailableConnections.push({ type: CONNECTOR_TYPE.FAULT });
                }

                expectedAvailableConnections = expectedAvailableConnections.filter(
                    connection => !childReferencesMap[connection.childReference]
                );

                if (JSON.stringify(expectedAvailableConnections) !== JSON.stringify(availableConnections)) {
                    throw new Error('available connections');
                }
                const expectedConnectorCount = maxConnections - availableConnections.length;
                if (connectorCount !== expectedConnectorCount) {
                    throw new Error('connector count');
                }
            } else if (connectorCount !== elementConnectors.length) {
                throw new Error('connector count');
            }

            if (maxConnections == null) {
                if (elementType === ELEMENT_TYPE.LOOP) {
                    maxConnections = 2;
                } else if (childReferences != null) {
                    maxConnections = childReferences.length + 1;
                } else {
                    maxConnections = 1;
                }

                if (canHaveFaultConnector) {
                    maxConnections++;
                }
            }
            if (element.maxConnections !== maxConnections) {
                throw new Error('max connections');
            }
        });
}

/**
 * Converts an Auto Layout Canvas UI model to a Free Form Canvas UI model
 *
 * @param storeState - The store state
 * @param startElementCoords - The coordinates of the start element
 *
 * @return The Free Form Canvas UI model
 */
export function convertToFreeFormCanvas(storeState: StoreState, startElementCoords: number[]): StoreState {
    const { elements } = storeState;

    const ffcStoreState: StoreState = {
        ...storeState,
        elements: {},
        canvasElements: [],
        connectors: []
    };

    const startElement = findStartElement(elements) as AutoLayoutCanvasElement;

    convertBranchToFreeForm(ffcStoreState, elements, startElement, null);

    const [offsetX, offsetY] = startElementCoords;
    const elementsPosition = calculateElementPositions(elements, offsetX, offsetY);

    // add non-canvas elements to to the ffc state
    Object.values(elements).forEach((element: FlowElement) => {
        if (ffcStoreState.elements[element.guid] == null && element.elementType !== ELEMENT_TYPE.ROOT_ELEMENT) {
            ffcStoreState.elements[element.guid] = element;
        }
    });

    // update the connector counts
    Object.values(ffcStoreState.connectors).forEach((connector: FlowConnector) => {
        const { source, childSource, type } = connector;
        const sourceElement = ffcStoreState.elements[source] as CanvasElement;
        if (sourceElement.availableConnections != null) {
            sourceElement.availableConnections = sourceElement.availableConnections.filter(connection => {
                // eslint-disable-next-line eqeqeq
                return connection.type !== type || connection.childReference != childSource;
            });
        }

        sourceElement.connectorCount++;
    });

    // add the element position information
    Object.values(ffcStoreState.elements).forEach((element: FlowElement) => {
        const canvasElement = element as CanvasElement;
        const position = elementsPosition[element.guid];
        if (position != null) {
            canvasElement.locationX = position.x;
            canvasElement.locationY = position.y;
        }
    });

    assertInDev(() => assertStoreState(ffcStoreState));

    return ffcStoreState;
}
