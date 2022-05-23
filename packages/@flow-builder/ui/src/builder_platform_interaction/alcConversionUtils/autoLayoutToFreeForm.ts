import { alcExtraProps, findStartElement } from 'builder_platform_interaction/alcCanvasUtils';
import {
    assertInDev,
    BranchHeadNodeModel,
    calculateFlowLayout,
    FAULT_INDEX,
    FlowModel,
    FlowRenderContext,
    FOR_EACH_INDEX,
    getBranchLayoutKey,
    getDefaultLayoutConfig,
    getSuffixForGoToConnection,
    GOTO_CONNECTION_SUFFIX,
    hasChildren,
    hasGoToOnBranchHead,
    hasGoToOnNext,
    isBranchingElement,
    NodeModel,
    NodeType,
    ParentNodeModel,
    resolveBranchHead,
    resolveChild,
    resolveNode
} from 'builder_platform_interaction/autoLayoutCanvas';
import { createNewConnector } from 'builder_platform_interaction/connectorUtils';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { findStartYOffset, shouldSupportScheduledPaths } from 'builder_platform_interaction/elementFactory';
import { CONNECTOR_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

// TODO: get rid of ELEMENT_TYPE
// TODO: get rid of this magic
const MAGIC_OFFSET_X_FIX = 126;
const MAGIC_OFFSET_Y_FIX = 168;

interface Position {
    x: number;
    y: number;
}

interface TargetInfo {
    guid: UI.Guid;
    isGoTo: boolean;
}

type ElementsPositionMap = UI.StringKeyedMap<Position>;

/**
 * @param flowModel
 */
function createInitialFlowRenderContext(flowModel: FlowModel): FlowRenderContext {
    return {
        flowModel,
        nodeLayoutMap: {},
        interactionState: {},
        elementsMetadata: {},
        layoutConfig: { ...getDefaultLayoutConfig() },
        isDeletingBranch: false
    } as FlowRenderContext;
}

/**
 * @param flowModel
 */
function getNodeLayoutMap(flowModel: FlowModel) {
    const flowRenderContext = createInitialFlowRenderContext(flowModel);
    calculateFlowLayout(flowRenderContext);
    return flowRenderContext.nodeLayoutMap;
}

/**
 * Calculates the absolute position of each Auto Layout Canvas element
 *
 * @param flowModel - The flow elements
 * @param startOffsetX - x offset of the start element
 * @param startOffsetY - y offset of the start element
 * @returns the a map of the positions for the elements
 */
function calculateElementPositions(
    flowModel: FlowModel,
    startOffsetX: number,
    startOffsetY: number
): UI.StringKeyedMap<Position> {
    const elementsPosition = {};
    const startElement = findStartElement(flowModel);
    const nodeLayoutMap = getNodeLayoutMap(flowModel);

    // The Start Position here maps to the top-left corner of the start menu container.
    // MAGIC_OFFSET_X_FIX is the gap between the start icon's left most point and top-left corner of the start menu container = 126;
    const startPosition = {
        x: startOffsetX - MAGIC_OFFSET_X_FIX,
        y: startOffsetY
    };

    elementsPosition[startElement.guid] = startPosition;

    // Getting offsetY for the following elements. startOffsetY is at the top of the Start Contextual Menu.
    // findStartYOffset returns Start Contextual Menu heigh.
    // Subtracting MAGIC_OFFSET_Y_FIX to incorporate for the "y" amount being added in the calculations further down.
    const offsetY = startOffsetY + findStartYOffset(asStart(startElement)) - MAGIC_OFFSET_Y_FIX;

    // TODO: need to fix the position calculations and remove the hard coded values above
    calculateElementPositionsForBranch(nodeLayoutMap, elementsPosition, flowModel, startElement, startOffsetX, offsetY);

    return elementsPosition;
}

/**
 * @param nodeLayoutMap
 * @param elementsPosition
 * @param flowModel
 * @param ele
 * @param offsetX
 * @param offsetY
 */
function calculateElementPositionsForBranch(
    nodeLayoutMap,
    elementsPosition: ElementsPositionMap,
    flowModel: FlowModel,
    ele: BranchHeadNodeModel,
    offsetX: number,
    offsetY: number
): void {
    let element: NodeModel | null = ele;
    while (element != null) {
        const { y } = nodeLayoutMap[element.guid].layout;

        let position = {
            x: offsetX,
            y: offsetY + y
        };

        if (element.nodeType === NodeType.START) {
            position = elementsPosition[element.guid];
        } else {
            elementsPosition[element.guid] = position;
        }

        const elementAsParent = element as ParentNodeModel;
        const children = elementAsParent.children;
        if (children) {
            // eslint-disable-next-line no-loop-func
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child != null && !hasGoToOnBranchHead(flowModel, element.guid, i)) {
                    let branchOffsetX = nodeLayoutMap[getBranchLayoutKey(element.guid, i)].layout.x;
                    let branchOffsetY = 0;
                    if (element.nodeType === NodeType.START) {
                        // Adding back the offsets created in calculateElementPositions function.
                        // MAGIC_OFFSET_X_FIX is the gap between the start icon's left most point and top-left corner of the start menu container
                        // MAGIC_OFFSET_Y_FIX is he same, but on the vertical axis.
                        branchOffsetX += MAGIC_OFFSET_X_FIX;
                        branchOffsetY += MAGIC_OFFSET_Y_FIX;
                    }
                    calculateElementPositionsForBranch(
                        nodeLayoutMap,
                        elementsPosition,
                        flowModel,
                        resolveBranchHead(flowModel, child),
                        position.x + branchOffsetX,
                        position.y + branchOffsetY
                    );
                }
            }
        }

        if (element.fault && !hasGoToOnBranchHead(flowModel, element.guid, FAULT_INDEX)) {
            const faultOffsetX = nodeLayoutMap[getBranchLayoutKey(element.guid, FAULT_INDEX)].layout.x;
            calculateElementPositionsForBranch(
                nodeLayoutMap,
                elementsPosition,
                flowModel,
                resolveBranchHead(flowModel, element.fault),
                position.x + faultOffsetX,
                position.y
            );
        }

        // if a loop has a branch head that loops back to itself, we need to adjust the offsetY as in free form this will be a loop with
        // no LOOP_NEXT connector
        if (element.nodeType === NodeType.LOOP) {
            const loopBranchHead = hasGoToOnBranchHead(flowModel, elementAsParent.guid, FOR_EACH_INDEX)
                ? resolveNode(flowModel, elementAsParent.children[FOR_EACH_INDEX])
                : resolveChild(flowModel as FlowModel, elementAsParent, FOR_EACH_INDEX);
            if (loopBranchHead != null && loopBranchHead.guid === element.guid) {
                offsetY -= y;
            }
        }

        element = hasGoToOnNext(flowModel, element.guid) ? null : flowModel[element.next!];
    }
}

/**
 * For a branch head connector, return the connector type, and the childSource if any.
 *
 * @param elements - The elements
 * @param parentElement - The parent element
 * @param childIndex - The child index
 * @returns the connectorType and childSource for the branch
 */
function getBranchHeadConnectorInfo(elements: UI.Elements, parentElement: ParentNodeModel, childIndex: number) {
    let connectionType;
    let childSource;

    if (parentElement.nodeType === NodeType.LOOP) {
        connectionType = CONNECTOR_TYPE.LOOP_NEXT;
    } else {
        const suffix = getSuffixForGoToConnection(elements as FlowModel, { guid: parentElement.guid, childIndex });

        switch (suffix) {
            case GOTO_CONNECTION_SUFFIX.FAULT:
                connectionType = CONNECTOR_TYPE.FAULT;
                break;
            case GOTO_CONNECTION_SUFFIX.IMMEDIATE:
                connectionType = CONNECTOR_TYPE.IMMEDIATE;
                break;
            case GOTO_CONNECTION_SUFFIX.DEFAULT:
                connectionType = CONNECTOR_TYPE.DEFAULT;
                break;
            default:
                connectionType = CONNECTOR_TYPE.REGULAR;
                childSource = suffix;
        }
    }

    return { connectionType, childSource };
}

/**
 * Creates the connector for a branch head element
 *
 * @param flowModel - The flow model
 * @param parentElement - The parent element
 * @param childIndex - The index of the child in its parent
 * @param targetInfo - Where to go when the branch head is null
 * @returns a connector for the branch head
 */
function createConnectorForBranchHead(
    flowModel: FlowModel,
    parentElement: ParentNodeModel,
    childIndex: number,
    targetInfo: TargetInfo
): UI.Connector {
    const source = parentElement.guid;
    const { childSource, connectionType } = getBranchHeadConnectorInfo(flowModel, parentElement, childIndex);

    const connector = createNewConnector(flowModel, source, targetInfo.guid, connectionType, targetInfo.isGoTo);
    if (childSource != null) {
        Object.assign(connector, {
            childSource,
            label: flowModel[childSource].label || null
        });
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
function toCanvasElement(elements: UI.Elements, alcCanvasElement: NodeModel): UI.CanvasElement {
    const canvasElement: Partial<UI.CanvasElement> = { ...alcCanvasElement, connectorCount: 0 };

    let availableConnections: UI.AvailableConnection[] = [];
    const supportsMultipleConnectors = hasChildren(alcCanvasElement) || alcCanvasElement.canHaveFaultConnector;
    let maxConnections = 1;
    const { nodeType } = alcCanvasElement;

    if (nodeType === NodeType.START && shouldSupportScheduledPaths(asStart(alcCanvasElement))) {
        availableConnections.push({ type: CONNECTOR_TYPE.IMMEDIATE });
    }

    if (nodeType === NodeType.LOOP) {
        if (isEndElementOrNull(elements, (alcCanvasElement as ParentNodeModel).children[FOR_EACH_INDEX])) {
            availableConnections.push({ type: CONNECTOR_TYPE.LOOP_NEXT });
        }

        if (isEndElementOrNull(elements, alcCanvasElement.next)) {
            availableConnections.push({ type: CONNECTOR_TYPE.LOOP_END });
        }

        maxConnections = 2;
    } else if (hasChildren(alcCanvasElement)) {
        const { childReferences } = alcCanvasElement;
        const regularConnections = childReferences.map((cr) => ({
            childReference: cr.childReference,
            type: CONNECTOR_TYPE.REGULAR
        }));

        if (nodeType === NodeType.START) {
            availableConnections = [...regularConnections, ...availableConnections];
        } else {
            availableConnections = [...regularConnections, { type: CONNECTOR_TYPE.DEFAULT }];
        }
        maxConnections = childReferences.length + 1;
    }

    if (alcCanvasElement.canHaveFaultConnector) {
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
    alcExtraProps.forEach((prop) => delete canvasElement[prop]);

    // hard cast since the above delete statement messes with typescript
    return (<unknown>canvasElement) as UI.CanvasElement;
}

/**
 * Checks for an end element
 *
 * @param element - A canvas element
 * @returns true if the element is an end element
 */
function isEndElement(element: NodeModel) {
    return element.nodeType === NodeType.END;
}

/**
 * @param elements
 * @param elementGuid
 */
function isEndElementOrNull(elements, elementGuid: UI.Guid | null | undefined) {
    return elementGuid == null || isEndElement(elements[elementGuid]);
}

/**
 * @param flowModel
 * @param parentElement
 * @param currentTargetInfo
 */
function getTargetInfo(
    flowModel: FlowModel,
    parentElement: NodeModel,
    currentTargetInfo: TargetInfo | null
): TargetInfo | null {
    const { next } = parentElement;
    if (next != null) {
        return {
            guid: next,
            isGoTo: hasGoToOnNext(flowModel, parentElement.guid)
        };
    }

    return currentTargetInfo;
}

/**
 * Creates connectors for a parent's children and their descendents
 *
 * @param storeState - The free form state
 * @param flowModel - The alc elements map
 * @param branchingElement  - The branching element
 * @param ancestorNext - The branch's ancestor next
 * @returns true if all child branches are terminals
 */
function convertBranchingElement(
    storeState: UI.StoreState,
    flowModel: FlowModel,
    branchingElement: ParentNodeModel,
    ancestorNext: TargetInfo | null
) {
    ancestorNext = getTargetInfo(flowModel, branchingElement, ancestorNext);

    const { connectors } = storeState;

    branchingElement.children.forEach((child, i) => {
        if (child != null) {
            const targetInfo = { guid: child, isGoTo: hasGoToOnBranchHead(flowModel, branchingElement.guid, i) };
            const connector = createConnectorForBranchHead(flowModel, branchingElement, i, targetInfo);
            connectors.push(connector);

            if (!targetInfo.isGoTo) {
                const childElement = resolveChild(flowModel, branchingElement, i)!;
                convertBranchToFreeForm(storeState, flowModel, childElement, ancestorNext);
            }
        } else if (ancestorNext != null && branchingElement.nodeType !== NodeType.LOOP) {
            const connector = createConnectorForBranchHead(flowModel, branchingElement, i, ancestorNext);
            connectors.push(connector);
        }
    });
}

// hard casts an element to UI.Start
/**
 * @param element
 */
function asStart(element: NodeModel): UI.Start {
    return (<unknown>element) as UI.Start;
}

/**
 * Creates connectors for a parent's children and their descendents
 *
 * @param storeState - The free form state
 * @param flowModel
 * @param loopElement  - The loop element
 * @param ancestorNext - The loop's ancestor next
 * @returns true if all child branches are terminals
 */
function convertLoopElement(
    storeState: UI.StoreState,
    flowModel: FlowModel,
    loopElement: ParentNodeModel,
    ancestorNext: TargetInfo | null
) {
    const hasGoToOnLoopNext = hasGoToOnBranchHead(flowModel, loopElement.guid, FOR_EACH_INDEX);

    const loopNext = hasGoToOnLoopNext
        ? (resolveNode(flowModel, loopElement.children[FOR_EACH_INDEX]) as BranchHeadNodeModel)
        : resolveChild(flowModel, loopElement, FOR_EACH_INDEX);
    ancestorNext = getTargetInfo(flowModel, loopElement, ancestorNext);

    if (loopNext != null) {
        addConnector(
            flowModel,
            loopElement.guid,
            loopNext.guid,
            storeState,
            CONNECTOR_TYPE.LOOP_NEXT,
            hasGoToOnLoopNext
        );

        if (!hasGoToOnLoopNext) {
            // the loop element is where non-ended branches will reconnect to
            const loopBackTarget = {
                guid: loopElement.guid,
                isGoTo: false
            };

            convertBranchToFreeForm(storeState, flowModel, loopNext, loopBackTarget);
        }
    }

    if (ancestorNext != null) {
        addConnector(
            flowModel,
            loopElement.guid,
            ancestorNext.guid,
            storeState,
            CONNECTOR_TYPE.LOOP_END,
            ancestorNext.isGoTo
        );
    }
}

/**
 * Adds a connector to either the store or to the endConnectors
 *
 * @param alcElementsMap - The alc elements
 * @param source - The source guid
 * @param target - The target guid
 * @param storeState - The ffc store
 * @param type - The connector type
 * @param isGoTo - whether the connector is a goto
 */
function addConnector(
    alcElementsMap: UI.Elements,
    source: UI.Guid,
    target: UI.Guid,
    storeState: UI.StoreState,
    type: string = CONNECTOR_TYPE.REGULAR,
    isGoTo: boolean
): void {
    const connector = createNewConnector(alcElementsMap, source, target, type, isGoTo);
    storeState.connectors.push(connector);
}

/**
 * Creates connectors for a branch, recursively
 *
 * @param ffcStoreState - The free form state
 * @param flowModel - The alc elements map
 * @param alcBranchHeadElement - The branch head element
 * @param ancestorNext - The TargetInfo of the element to which the control flow continues to when the branch is done
 */
function convertBranchToFreeForm(
    ffcStoreState: UI.StoreState,
    flowModel: FlowModel,
    alcBranchHeadElement: BranchHeadNodeModel,
    ancestorNext: TargetInfo | null
): void {
    let alcElement: NodeModel | null = alcBranchHeadElement;

    while (alcElement != null) {
        const { fault, guid, next, nodeType } = alcElement;

        // create an ffc element from the alc element and add it to the storeState
        const canvasElement = toCanvasElement(flowModel, alcElement);
        ffcStoreState.elements[guid] = canvasElement;
        ffcStoreState.canvasElements.push(guid);

        // stop if we hit an end element
        if (isEndElement(alcElement)) {
            break;
        }

        // process any fault branch
        if (fault != null) {
            const hasGoToOnFault = hasGoToOnBranchHead(flowModel, alcElement.guid, FAULT_INDEX);
            addConnector(flowModel, guid, fault, ffcStoreState, CONNECTOR_TYPE.FAULT, hasGoToOnFault);

            if (!hasGoToOnFault) {
                // a fault branch can't merge back, so it has not ancestor next
                const ancestorNext = null;
                convertBranchToFreeForm(ffcStoreState, flowModel, resolveBranchHead(flowModel, fault), ancestorNext);
            }
        }

        // process any children
        if (hasChildren(alcElement)) {
            if (nodeType === NodeType.LOOP) {
                convertLoopElement(ffcStoreState, flowModel, alcElement, ancestorNext);
            } else {
                convertBranchingElement(ffcStoreState, flowModel, alcElement, ancestorNext);
            }
        } else {
            // if next null, then the last element of the branch will connect to ancestorNext
            const targetInfo = getTargetInfo(flowModel, alcElement as ParentNodeModel, ancestorNext);

            if (targetInfo != null) {
                const supportScheduledPaths =
                    nodeType === NodeType.START && shouldSupportScheduledPaths(asStart(alcElement));
                const connectorType = supportScheduledPaths ? CONNECTOR_TYPE.IMMEDIATE : CONNECTOR_TYPE.REGULAR;

                addConnector(flowModel, guid, targetInfo.guid, ffcStoreState, connectorType, targetInfo.isGoTo);
            }
        }

        const nextElement = next && !hasGoToOnNext(flowModel, alcElement.guid) ? flowModel[next] : null;
        alcElement = nextElement;
    }
}

/**
 * @param storeState
 */
function assertStoreState(storeState: UI.StoreState) {
    const { elements, connectors } = storeState;

    Object.values(elements)
        .filter((element) => element.isCanvasElement)
        .forEach((element) => {
            const { guid, elementType, connectorCount, availableConnections, childReferences, canHaveFaultConnector } =
                element as UI.CanvasElement;
            let { maxConnections } = getConfigForElementType(elementType) as any;
            const elementConnectors = connectors.filter((connector) => connector.source === guid);

            const childReferencesMap = elementConnectors.reduce((acc, childRef: any) => {
                acc[childRef.childReference] = true;
                return acc;
            }, {});

            if (maxConnections > 1) {
                let expectedAvailableConnections = [...(childReferences || [])] as UI.AvailableConnection[];

                if (elementType === ELEMENT_TYPE.LOOP) {
                    expectedAvailableConnections.push({ type: CONNECTOR_TYPE.LOOP_END });
                    expectedAvailableConnections.push({ type: CONNECTOR_TYPE.LOOP_NEXT });
                } else if (isBranchingElement(element as NodeModel)) {
                    expectedAvailableConnections.push({ type: CONNECTOR_TYPE.DEFAULT });
                }
                if (canHaveFaultConnector) {
                    expectedAvailableConnections.push({ type: CONNECTOR_TYPE.FAULT });
                }

                expectedAvailableConnections = expectedAvailableConnections.filter(
                    (connection: UI.AvailableConnection) => !childReferencesMap[connection.childReference!]
                );

                if (JSON.stringify(expectedAvailableConnections) !== JSON.stringify(availableConnections)) {
                    throw new Error('available connections');
                }
                const expectedConnectorCount = maxConnections - availableConnections!.length;
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
            if ((element as UI.CanvasElement).maxConnections !== maxConnections) {
                throw new Error('max connections');
            }
        });
}

/**
 * Converts an Auto Layout Canvas UI model to a Free Form Canvas UI model
 *
 * @param storeState - The store state
 * @param startElementCoords - The coordinates of the start element
 * @returns The Free Form Canvas UI model
 */
export function convertToFreeFormCanvas(storeState: UI.StoreState, startElementCoords: number[]): UI.StoreState {
    const elements = storeState.elements as FlowModel;

    const ffcStoreState: UI.StoreState = {
        ...storeState,
        elements: {},
        canvasElements: [],
        connectors: []
    };

    const startElement = findStartElement(elements);

    convertBranchToFreeForm(ffcStoreState, elements, startElement, null);

    const [offsetX, offsetY] = startElementCoords;
    const elementsPosition = calculateElementPositions(elements, offsetX, offsetY);

    // add non-canvas elements to to the ffc state and reset config for all Canvas Elements
    Object.values(elements).forEach((element: UI.Element) => {
        if (element.isCanvasElement) {
            (ffcStoreState.elements[element.guid] as UI.CanvasElement).config = {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            };
        }

        if (ffcStoreState.elements[element.guid] == null && element.elementType !== ELEMENT_TYPE.ROOT_ELEMENT) {
            ffcStoreState.elements[element.guid] = element;
        }
    });

    // update the connector counts
    Object.values(ffcStoreState.connectors).forEach((connector: UI.Connector) => {
        const { source, childSource, type } = connector;
        const sourceElement = ffcStoreState.elements[source] as UI.CanvasElement;
        if (sourceElement.availableConnections != null) {
            sourceElement.availableConnections = sourceElement.availableConnections.filter((connection) => {
                // eslint-disable-next-line eqeqeq
                return connection.type !== type || connection.childReference != childSource;
            });
        }

        sourceElement.connectorCount++;
    });

    // add the element position information
    Object.values(ffcStoreState.elements).forEach((element: UI.Element) => {
        const canvasElement = element as UI.CanvasElement;
        const position = elementsPosition[element.guid];
        if (position != null) {
            canvasElement.locationX = position.x;
            canvasElement.locationY = position.y;
        }
    });

    assertInDev(() => assertStoreState(ffcStoreState));

    return ffcStoreState;
}
