import { PrivateItemRegisterEvent } from 'builder_platform_interaction/alcEvents';
import {
    BranchHeadNodeModel,
    ConnectionSource,
    ConnectorLabelType,
    ConnectorRenderInfo,
    ElementMetadata,
    FAULT_INDEX,
    findParentElement,
    FlowModel,
    FlowRenderInfo,
    FOR_EACH_INDEX,
    Geometry,
    getChild,
    getFirstNonNullNext,
    getNonTerminalBranchIndexes,
    Guid,
    hasChildren,
    hasGoTo,
    hasGoToOnBranchHead,
    hasGoToOnNext,
    isGoingBackToAncestorLoop,
    MenuType,
    NodeModel,
    NodeRef,
    NodeRenderInfo,
    NodeType,
    ParentNodeModel,
    StartNodeModel,
    START_IMMEDIATE_INDEX
} from 'builder_platform_interaction/autoLayoutCanvas';
import { ClickToZoomEvent, ZOOM_ACTION } from 'builder_platform_interaction/events';
import { commands, commonUtils, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { classSet } from 'lightning/utils';
import { LABELS } from './alcComponentsUtilsLabels';

const {
    EnterCommand,
    EscapeCommand,
    SpaceCommand,
    ZoomInCommand,
    ZoomOutCommand,
    ZoomToFitCommand,
    ZoomToViewCommand,
    TabCommand,
    ShiftFocusForwardCommand,
    ShiftFocusBackwardCommand
} = commands;

const { BaseKeyboardInteraction, ShiftFocusKeyboardInteraction, createShortcut, Keys } = keyboardInteractionUtils;

const { format } = commonUtils;

export interface MenuInfo {
    source: ConnectionSource;
    type: MenuType;
    autoFocus: boolean;
}
export interface CanvasContext {
    elementsMetadata: ElementMetadata[];
    isPasteAvailable: boolean;
    mode: AutoLayoutCanvasMode;
    invocableApexActions: invocableApexActionResources[];

    // Clicked incoming goTo stub guid
    incomingStubGuid: Guid | null;
    connectorMenuMetadata: ConnectorMenuMetadata | null;
    menu: MenuInfo | null;
}

interface invocableApexActionResources {
    actionName: string;
    iconResource: string;
}

interface CanvasElementSelectionData {
    canvasElementGuidsToSelect: Guid[];
    canvasElementGuidsToDeselect: Guid[];
    selectableCanvasElementGuids: Guid[];
    topSelectedGuid: Guid | null;
}

enum AutoLayoutCanvasMode {
    DEFAULT = 'default',
    SELECTION = 'selection',
    RECONNECTION = 'reconnection'
}

enum ICON_SHAPE {
    DIAMOND = 'diamond', // Example, Decision
    CIRCLE = 'circle', // Example, Start Element
    SQUARE = 'square'
}

/**
 * @param nodeType - The current node type
 * @returns - True if the element is a system element
 */
function isSystemElement(nodeType: NodeType) {
    switch (nodeType) {
        case NodeType.ROOT:
        case NodeType.START:
        case NodeType.END:
            return true;
        default:
            return false;
    }
}

const ELEMENT_SELECTED_ACTION = 'element_selected_action';
const ELEMENT_DESELECTED_ACTION = 'element_deselected_action';

const DELIMITER = ', ';

/**
 * Checks whether to traverse down the chain or not depending on the action the user performed
 *
 * @param action - Selection or Deselection action
 * @param currentBranchElement - Branch Element we are going to traverse
 * @returns - True if we should traverse down
 */
function _shouldTraverseDown(action: string, currentBranchElement: NodeModel): boolean {
    // In case of deselection, we should traverse down only if canvas element is selected
    const shouldTraverseDown =
        action === ELEMENT_SELECTED_ACTION
            ? !!currentBranchElement
            : currentBranchElement && currentBranchElement.config && currentBranchElement.config.isSelected;
    return shouldTraverseDown;
}

/**
 * Gets the branch elements present child branches of a Decision or Pause
 *
 * @param action - Selection or Deselection action
 * @param parentElement - Parent Element of a given tree in the flow
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @returns - Child element Guids
 */
function _getChildBranchElements(action: string, parentElement: ParentNodeModel, flowModel: FlowModel): Guid[] {
    let branchElementGuidsToSelectOrDeselect: Guid[] = [];
    if (parentElement && parentElement.children && parentElement.children.length > 0) {
        const branchRootsToVisitStack = parentElement.children;

        // Iterating over different branches of a given parent element
        for (let i = 0; i < branchRootsToVisitStack.length; i++) {
            const branchRootGuid = branchRootsToVisitStack[i];
            let currentBranchElement =
                branchRootGuid && !hasGoToOnBranchHead(flowModel, parentElement.guid, i)
                    ? flowModel[branchRootGuid]
                    : null;

            // Traversing down a given branch
            while (
                currentBranchElement != null &&
                _shouldTraverseDown(action, currentBranchElement) &&
                !isSystemElement(currentBranchElement.nodeType)
            ) {
                branchElementGuidsToSelectOrDeselect.push(currentBranchElement.guid);
                // Grabs all the elements in the child and fault branches as needed
                branchElementGuidsToSelectOrDeselect = branchElementGuidsToSelectOrDeselect.concat(
                    _getSubtreeElements(action, currentBranchElement as ParentNodeModel, flowModel)
                );
                currentBranchElement =
                    currentBranchElement.next && !hasGoToOnNext(flowModel, currentBranchElement.guid)
                        ? flowModel[currentBranchElement.next]
                        : null;
            }
        }
    }

    return branchElementGuidsToSelectOrDeselect;
}

/**
 * Gets all the elements present in the Fault branch of a given element
 *
 * @param action - Selection or Deselection action
 * @param element - Parent Element of a given tree in the flow
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @returns - Fault branch element Guids
 */
function _getFaultBranchElements(action: string, element: NodeModel, flowModel: FlowModel): Guid[] {
    let branchElementGuidsToSelectOrDeselect: Guid[] = [];
    let currentBranchElement =
        element.fault && !hasGoToOnBranchHead(flowModel, element.guid, FAULT_INDEX) ? flowModel[element.fault] : null;

    // Iterate only up till the End Element of the Fault Branch
    while (currentBranchElement != null && !isSystemElement(currentBranchElement.nodeType)) {
        branchElementGuidsToSelectOrDeselect.push(currentBranchElement.guid);
        // Grabs all the elements in the child and fault branches as needed
        branchElementGuidsToSelectOrDeselect = branchElementGuidsToSelectOrDeselect.concat(
            _getSubtreeElements(action, currentBranchElement as ParentNodeModel, flowModel)
        );
        currentBranchElement =
            currentBranchElement.next && !hasGoToOnNext(flowModel, currentBranchElement.guid)
                ? flowModel[currentBranchElement.next]
                : null;
    }

    return branchElementGuidsToSelectOrDeselect;
}

/**
 * Gets all the elements present in the child and/or fault branches of a given parent element
 *
 * @param action - Selection or Deselection action
 * @param parentElement - Parent Element of a given tree in the flow
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @returns - The subtree elements guids
 */
function _getSubtreeElements(action: string, parentElement: NodeModel, flowModel: FlowModel): Guid[] {
    let canvasElementGuidsArray: Guid[] = [];
    // Getting all the elements present in the child branches based on the selection/deselection action
    if (hasChildren(parentElement)) {
        canvasElementGuidsArray = canvasElementGuidsArray.concat(
            _getChildBranchElements(action, parentElement, flowModel)
        );
    }
    // Getting all the elements present in the fault branch based on the selection/deselection action
    if (parentElement.fault) {
        canvasElementGuidsArray = canvasElementGuidsArray.concat(
            _getFaultBranchElements(action, parentElement, flowModel)
        );
    }

    return canvasElementGuidsArray;
}

/**
 * Helper function to get all the possible elements that can be selected/deselected next
 *
 * @param topSelectedGuid - Guid of the top-most selected element
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @returns selectableCanvasElementGuids - An array containing all the selectable Canvas Element Guids
 */
function _getSelectableCanvasElementGuids(topSelectedGuid: Guid, flowModel: FlowModel): Guid[] {
    let selectableCanvasElementGuids: Guid[] = [];
    if (topSelectedGuid) {
        const topSelectedElement = flowModel[topSelectedGuid];
        let currentCanvasElement = topSelectedElement as NodeModel | null;

        // All the elements in the chain above (excluding the Start Element) should be selectable
        while (currentCanvasElement && !isSystemElement(currentCanvasElement.nodeType)) {
            selectableCanvasElementGuids.push(currentCanvasElement.guid);
            currentCanvasElement =
                flowModel[currentCanvasElement.prev || (currentCanvasElement as BranchHeadNodeModel).parent];
        }

        // Resetting the currentElement to the topSelectedElement to start going down the chain
        currentCanvasElement = topSelectedElement;

        // All the elements in the vertical chain below (such as element.next is not null) should be selectable
        while (currentCanvasElement && !isSystemElement(currentCanvasElement.nodeType)) {
            if (currentCanvasElement.guid !== topSelectedElement.guid) {
                selectableCanvasElementGuids.push(currentCanvasElement.guid);
            }
            // Getting all the selectable elements present in the child and fault branches
            selectableCanvasElementGuids = selectableCanvasElementGuids.concat(
                _getSubtreeElements(ELEMENT_SELECTED_ACTION, currentCanvasElement as ParentNodeModel, flowModel)
            );

            currentCanvasElement =
                currentCanvasElement.next && !hasGoToOnNext(flowModel, currentCanvasElement.guid)
                    ? flowModel[currentCanvasElement.next]
                    : null;
        }
    }

    return selectableCanvasElementGuids;
}

// cache for lwc component constructors
const constructorCache: { [key: string]: LightningElement } = {};

// map of components that are loading
const componentPromises: { [key: string]: Promise<LightningElement> | undefined } = {};

/**
 * Dynamically loads and caches an lwc component by name
 *
 * @param componentName - The component name, eg: "builder_platform_interaction-alc-start-menu"
 * @returns The component constructor
 */
export async function importComponent<T extends LightningElement>(componentName: string): Promise<T> {
    const component = getComponent<T>(componentName);

    if (component == null) {
        let component;
        if (componentPromises[componentName]) {
            component = await componentPromises[componentName];
        } else {
            // eslint-disable-next-line lwc-core/no-dynamic-import, lwc-core/no-dynamic-import-identifier
            const componentPromise = import(componentName);
            componentPromises[componentName] = componentPromise;
            component = await componentPromise;
        }
        const ctor = component.default;
        constructorCache[componentName] = ctor;
        return ctor;
    }
    return component;
}

/**
 * Deletes a component from the cache
 *
 * @param componentName - The name of the component to delete
 */
export function deleteComponent(componentName: string): void {
    delete constructorCache[componentName];
}

/**
 * Retrieves a component from the cache
 *
 * @param componentName - The name of the component to retrieve
 * @returns the component constructor, or undefined if not in the cached
 */
export function getComponent<T extends LightningElement>(componentName: string): T | undefined {
    return constructorCache[componentName];
}

/**
 * Function to get all the selection data which includes canvasElementGuidsToSelect, canvasElementGuidsToDeselect,
 * selectableCanvasElementGuids and the updated topSelectedGuid
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param selectedCanvasElementGuid - Guid of the Canvas Element that just got selected
 * @param  topSelectedGuid - Guid of the top-most selected element
 * @returns Selection Data as needed by the store
 */
const getCanvasElementSelectionData = (
    flowModel: FlowModel,
    selectedCanvasElementGuid: Guid,
    topSelectedGuid: Guid | null
): CanvasElementSelectionData => {
    let canvasElementGuidsToSelect: Guid[] = [];

    const selectedCanvasElement = flowModel[selectedCanvasElementGuid];
    if (!topSelectedGuid) {
        // If there's no topSelectedGuid, it means that this is the first element being selected
        topSelectedGuid = selectedCanvasElement.guid;
        canvasElementGuidsToSelect.push(selectedCanvasElement.guid);
    } else {
        let currentCanvasElement = selectedCanvasElement;

        // Going up the chain to find the first selected element and pushing all the elements in between into
        // canvasElementGuidsToSelect
        while (currentCanvasElement && currentCanvasElement.config && !currentCanvasElement.config.isSelected) {
            canvasElementGuidsToSelect.push(currentCanvasElement.guid);
            if (currentCanvasElement.prev) {
                currentCanvasElement = flowModel[currentCanvasElement.prev];
                // In case the element supports children, all it's branches need to be marked as selected as well
                if (hasChildren(currentCanvasElement)) {
                    canvasElementGuidsToSelect = canvasElementGuidsToSelect.concat(
                        _getChildBranchElements(
                            ELEMENT_SELECTED_ACTION,
                            currentCanvasElement as ParentNodeModel,
                            flowModel
                        )
                    );
                }
            } else if ((currentCanvasElement as BranchHeadNodeModel).parent) {
                currentCanvasElement = flowModel[(currentCanvasElement as BranchHeadNodeModel).parent];
            }

            // In case we reach the start element without having found any selected element, then that means that our
            // topSelectedGuid is somewhere in the chain below. Hence emptying the canvasElementGuidsToSelect array
            // and breaking out of the loop
            if (currentCanvasElement.nodeType === NodeType.START) {
                canvasElementGuidsToSelect = [];
                break;
            }
        }

        // If canvasElementGuidsToSelect's length is 0 then that means that no selected element was found in the
        // chain above
        if (canvasElementGuidsToSelect.length === 0) {
            currentCanvasElement = flowModel[topSelectedGuid];

            // Going up the chain from topSelectedElement's previous/parent canvas element to find the selected
            // canvas element and pushing all the elements in between into canvasElementGuidsToSelect
            while (currentCanvasElement && currentCanvasElement.guid !== selectedCanvasElementGuid) {
                if (currentCanvasElement.guid !== topSelectedGuid) {
                    canvasElementGuidsToSelect.push(currentCanvasElement.guid);
                }

                if (currentCanvasElement.prev) {
                    currentCanvasElement = flowModel[currentCanvasElement.prev];
                    // In case the element supports children, all it's branches need to be marked as selected as well
                    if (hasChildren(currentCanvasElement)) {
                        canvasElementGuidsToSelect = canvasElementGuidsToSelect.concat(
                            _getChildBranchElements(
                                ELEMENT_SELECTED_ACTION,
                                currentCanvasElement as ParentNodeModel,
                                flowModel
                            )
                        );
                    }
                } else if ((currentCanvasElement as BranchHeadNodeModel).parent) {
                    currentCanvasElement = flowModel[(currentCanvasElement as BranchHeadNodeModel).parent];
                }
            }

            // Pushing the newly selected Canvas Element into the canvasElementGuidsToSelect array
            canvasElementGuidsToSelect.push(selectedCanvasElementGuid);

            // Resetting topSelectedGuid to selectedCanvasElementGuid
            topSelectedGuid = selectedCanvasElementGuid;
        }
    }

    return {
        canvasElementGuidsToSelect,
        canvasElementGuidsToDeselect: [],
        selectableCanvasElementGuids: _getSelectableCanvasElementGuids(topSelectedGuid, flowModel),
        topSelectedGuid
    };
};

/**
 * Function to get all the deselection data which includes canvasElementGuidsToSelect, canvasElementGuidsToDeselect,
 * selectableCanvasElementGuids and the updated topSelectedGuid
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param deselectedCanvasElementGuid - Guid of the Canvas Element that just got deselected
 * @param topSelectedGuid - Guid of the top-most selected element
 * @returns Deselection Data as needed by the store
 */
const getCanvasElementDeselectionData = (
    flowModel: FlowModel,
    deselectedCanvasElementGuid: Guid,
    topSelectedGuid: Guid | null
): CanvasElementSelectionData => {
    const deselectedCanvasElement = flowModel[deselectedCanvasElementGuid];
    let canvasElementGuidsToDeselect: Guid[] = [];

    if (deselectedCanvasElementGuid === topSelectedGuid) {
        // Top-most element is being deselected, we don't need to deselect anything else. Just have to reset the
        // topSelectedGuid to the next selected element (if any). In case the next element is not selected, reset
        // topSelectedGuid to null
        const nextCanvasElement =
            deselectedCanvasElement.next && !hasGoToOnNext(flowModel, deselectedCanvasElement.guid)
                ? flowModel[deselectedCanvasElement.next]
                : null;
        if (nextCanvasElement && nextCanvasElement.config && nextCanvasElement.config.isSelected) {
            topSelectedGuid = nextCanvasElement.guid;
        } else {
            topSelectedGuid = null;
        }

        // Pushing the deselected element to the canvasElementGuidsToDeselect array
        canvasElementGuidsToDeselect.push(deselectedCanvasElementGuid);

        // Getting all the child and fault branch elements to deselect
        canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
            _getSubtreeElements(ELEMENT_DESELECTED_ACTION, deselectedCanvasElement as ParentNodeModel, flowModel)
        );
    } else {
        let currentCanvasElement = deselectedCanvasElement as NodeModel | null;
        // Deselecting one of the middle elements, should deselect everything else in the vertical chain
        // (i.e. till the the point element.next is not null) below as well
        while (currentCanvasElement && currentCanvasElement.config && currentCanvasElement.config.isSelected) {
            canvasElementGuidsToDeselect.push(currentCanvasElement.guid);

            // Getting all the child and fault branch elements to deselect
            canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
                _getSubtreeElements(ELEMENT_DESELECTED_ACTION, currentCanvasElement as ParentNodeModel, flowModel)
            );

            currentCanvasElement =
                currentCanvasElement.next && !hasGoToOnNext(flowModel, currentCanvasElement.guid)
                    ? flowModel[currentCanvasElement.next]
                    : null;
        }
    }

    // In the case where topSelectedGuid doesn't exist, everything is selectable. Just passing an empty array
    // in that scenario
    return {
        canvasElementGuidsToSelect: [],
        canvasElementGuidsToDeselect,
        selectableCanvasElementGuids: topSelectedGuid
            ? _getSelectableCanvasElementGuids(topSelectedGuid, flowModel)
            : [],
        topSelectedGuid
    };
};

/**
 * Function to get the guid of the first selectable element on the canvas
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param elementGuid - Guid of the element being checked
 * @returns Guid of the first selectable element or undefined if no element is selectable
 */
const getFirstSelectableElementGuid = (flowModel: FlowModel, elementGuid: Guid): Guid | undefined => {
    const currentCanvasElement = flowModel[elementGuid] as ParentNodeModel;
    if (
        !isSystemElement(currentCanvasElement.nodeType) &&
        currentCanvasElement.config &&
        currentCanvasElement.config.isSelectable
    ) {
        return currentCanvasElement.guid;
    }

    if (hasChildren(currentCanvasElement)) {
        // Traversing down the branches to find the first selectable element
        for (let i = 0; i < currentCanvasElement.children.length; i++) {
            const childGuid = currentCanvasElement.children[i];
            if (childGuid && !hasGoToOnBranchHead(flowModel, currentCanvasElement.guid, i)) {
                const selectableElementGuid = getFirstSelectableElementGuid(flowModel, childGuid);
                if (selectableElementGuid) {
                    return selectableElementGuid;
                }
            }
        }
    }

    if (currentCanvasElement.fault && !hasGoToOnBranchHead(flowModel, currentCanvasElement.guid, FAULT_INDEX)) {
        // Traversing down the fault branch to find the first selectable element
        const selectableElementGuid = getFirstSelectableElementGuid(flowModel, currentCanvasElement.fault);
        if (selectableElementGuid) {
            return selectableElementGuid;
        }
    }

    if (currentCanvasElement.next && !hasGoToOnNext(flowModel, currentCanvasElement.guid)) {
        // Traversing down to the next element to find the first selectable element
        const selectableElementGuid = getFirstSelectableElementGuid(flowModel, currentCanvasElement.next);
        if (selectableElementGuid) {
            return selectableElementGuid;
        }
    }

    return undefined;
};

/**
 * Util functions for alc components
 */

const CLASS_MENU_OPENED = 'menu-opened';

const CLASS_IS_NEW = 'is-new';
const DYNAMIC_NODE_COMPONENT = 'dynamic-node-component';

/**
 * @param cssEntries - css
 * @returns The Css
 */
function getCssStyle(cssEntries): string {
    return Object.entries(cssEntries)
        .filter((entry) => entry != null && entry[1] != null)
        .map((entry) => `${entry[0]}: ${entry[1]}px`)
        .join(';');
}

/**
 * Returns a css style string for a Geometry object
 *
 * @param obj geometry object
 * @param obj.x - The x position of the top left corner of the rectangle.
 * @param obj.y - The y position of the top left corner of the rectangle.
 * @param obj.w - The width of the rectangle
 * @param obj.h - The height of the rectangle
 * @returns A css style string for the geometry
 */
function getStyleFromGeometry({ x, y, w, h }: { x?: number; y?: number; w?: number; h?: number }): string {
    return getCssStyle({
        left: x,
        top: y,
        width: w,
        height: h
    });
}

/**
 * Get the data needed to render a alcConnector component
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param connectorInfo - Info about a connector
 * @returns The alcConnector component data
 */
function getAlcConnectorData(flowModel: FlowModel, connectorInfo: ConnectorRenderInfo) {
    const connectorDescription = getConnectorAriaInfo(flowModel, connectorInfo.source);
    return {
        key: connectorKey(connectorInfo),
        connectorInfo,
        style: getStyleFromGeometry(connectorInfo.geometry),
        className: `logic-connector ${connectorInfo.type}`,
        connectorDescription
    };
}

/**
 * Get the data needed to render a alcFlow component
 *
 * @param flowInfo - Info about a flow
 * @param source - The connection source
 * @returns The alcFlow component data
 */
function getAlcFlowData(flowInfo: FlowRenderInfo, source: ConnectionSource) {
    const { guid, childIndex } = source;

    const { x, y } = flowInfo.geometry;
    return {
        key: `flow-${guid}-${childIndex}`,
        flowInfo,
        style: getStyleFromGeometry({ x, y }),
        className: ''
    };
}

/**
 * Get the data needed to render a alcCompoundNode component
 *
 * @param nodeInfo - Info about a node
 * @returns The alcCompoundNode component data
 */
function getAlcCompoundNodeData(nodeInfo: NodeRenderInfo) {
    const { geometry, guid } = nodeInfo;
    const className = classSet({ [CLASS_IS_NEW]: nodeInfo.isNew, [CLASS_MENU_OPENED]: nodeInfo.menuOpened });

    const faultFlow = nodeInfo.faultFlow
        ? getAlcFlowData(nodeInfo.faultFlow, { guid: nodeInfo.guid, childIndex: FAULT_INDEX })
        : null;

    // let the browser manage the width
    const geo = { ...geometry, w: undefined };

    return {
        key: guid,
        nodeInfo,
        style: getStyleFromGeometry(geo),
        className,
        faultFlow
    };
}

/**
 * Get the data needed to render a alcNode component
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param nodeInfo - Info about a node
 * @returns The alcNode component data
 */
function getAlcNodeData(flowModel: FlowModel, nodeInfo: NodeRenderInfo) {
    const { guid, menuOpened } = nodeInfo;
    const { dynamicNodeComponent, dynamicNodeComponentSelector } = nodeInfo.metadata;

    const className = classSet({
        [CLASS_MENU_OPENED]: menuOpened,
        [DYNAMIC_NODE_COMPONENT]: !!dynamicNodeComponent
    }).toString();

    const nodeDescription = getNodeAriaInfo(flowModel, nodeInfo);

    return {
        key: guid,
        nodeInfo,
        className,
        style: '',
        dynamicNodeComponent,
        dynamicNodeComponentSelector,
        nodeDescription
    };
}

/**
 * Dispatches a privateitemregister event to register a child component with its parent
 *
 * @param component The component to register
 * @event privateitemregister always dispatched
 */
export function dispatchPrivateItemRegister(component) {
    component.dispatchEvent(new PrivateItemRegisterEvent(component));
}

/**
 * @param flowModel - The Flow Model
 * @param connectorLabelType - The connector label type
 * @param sourceElement - The connector's source element
 * @param sourceLabel - The connector's source label
 * @param targetGuid - The connector's target guid
 * @param targetLabel - The connector's target label
 * @param sourceHasGoTo - True if the connector's source has a GoTo, False if not
 * @returns connector aria label string
 */
function getDescriptionForLoopConnectors(
    flowModel: FlowModel,
    connectorLabelType: ConnectorLabelType,
    sourceElement: ParentNodeModel,
    sourceLabel: string,
    targetGuid: string | null,
    targetLabel: string,
    sourceHasGoTo?: boolean
) {
    if (connectorLabelType === ConnectorLabelType.LOOP_FOR_EACH) {
        if ((sourceElement as ParentNodeModel).children[FOR_EACH_INDEX] == null) {
            // When a connector loops back to itself in the For Each path
            return format(LABELS.emptyForEachDescribedBy, sourceLabel);
        }
        // A connector of a loop in the For Each path
        return sourceHasGoTo
            ? format(LABELS.branchHeadGoToConnectorDescribedBy, sourceLabel, targetLabel, LABELS.ariaForEachLabel)
            : format(LABELS.branchHeadConnectorDescribedBy, sourceLabel, targetLabel, LABELS.ariaForEachLabel);
    } else if (!sourceHasGoTo && isGoingBackToAncestorLoop(flowModel, targetGuid!, sourceElement)) {
        // When a branch head connector within the After Last branch is going back to the ancestral loop element
        return format(
            LABELS.branchHeadLoopCloseConnectorDescribedBy,
            sourceLabel,
            targetLabel,
            LABELS.ariaAfterLastLabel
        );
    }
    // A connector of a loop in the After Last path
    return sourceHasGoTo
        ? format(LABELS.branchHeadGoToConnectorDescribedBy, sourceLabel, targetLabel, LABELS.ariaAfterLastLabel)
        : format(LABELS.branchHeadConnectorDescribedBy, sourceLabel, targetLabel, LABELS.ariaAfterLastLabel);
}

/**
 * @param flowModel - The Flow Model
 * @param sourceElement - The connector's source element
 * @param sourceLabel - The connector's source label
 * @param targetLabel - The connector's target label
 * @param childIndex - The connector's source child index value
 * @param label - The connector's describedBy type
 * @returns connector aria label string
 */
function getDescriptionForDecisionOrPauseBranchHeadConnector(
    flowModel: FlowModel,
    sourceElement: ParentNodeModel,
    sourceLabel: string,
    targetLabel: string,
    childIndex: number,
    label: string
) {
    const pathName =
        childIndex === (sourceElement as ParentNodeModel).children.length - 1
            ? sourceElement.defaultConnectorLabel
            : flowModel[(sourceElement as ParentNodeModel).childReferences[childIndex].childReference].label;
    return format(label, sourceLabel, targetLabel, pathName);
}

/**
 * @param flowModel - The Flow Model
 * @param sourceElement - The connector's source element
 * @param sourceLabel - The connector's source label
 * @param targetGuid - The connector's target guid
 * @param targetLabel - The connector's target label
 * @param childIndex - The connector's source child index value
 * @param sourceHasGoTo - True if the connector's source has a GoTo, False if not
 * @returns connector aria label string
 */
function getDescriptionForBranchHeadConnectors(
    flowModel: FlowModel,
    sourceElement: ParentNodeModel,
    sourceLabel: string,
    targetGuid: string | null,
    targetLabel: string,
    childIndex: number,
    sourceHasGoTo?: boolean
) {
    if (sourceElement.nodeType === NodeType.LOOP) {
        // Evaluating For Each connector
        return getDescriptionForLoopConnectors(
            flowModel,
            ConnectorLabelType.LOOP_FOR_EACH,
            sourceElement,
            sourceLabel,
            targetGuid,
            targetLabel,
            sourceHasGoTo
        );
    } else if (!sourceHasGoTo && isGoingBackToAncestorLoop(flowModel, targetGuid!, sourceElement)) {
        // When a branch head connector within the For Each branch is going back to the ancestral loop element
        return getDescriptionForDecisionOrPauseBranchHeadConnector(
            flowModel,
            sourceElement,
            sourceLabel,
            targetLabel,
            childIndex,
            LABELS.branchHeadLoopCloseConnectorDescribedBy
        );
    }
    const describedByLabel = sourceHasGoTo
        ? LABELS.branchHeadGoToConnectorDescribedBy
        : LABELS.branchHeadConnectorDescribedBy;
    if (childIndex === FAULT_INDEX) {
        // Fault path scenario
        return format(describedByLabel, sourceLabel, targetLabel, LABELS.ariaFaultLabel);
    } else if (sourceElement.nodeType === NodeType.START) {
        // A regular connector scenario with START element as the source
        if (childIndex === START_IMMEDIATE_INDEX) {
            return format(describedByLabel, sourceLabel, targetLabel, LABELS.ariaRunImmediatelyLabel);
        }
        const pathName = flowModel[sourceElement.childReferences[childIndex - 1].childReference].label;
        return format(describedByLabel, sourceLabel, targetLabel, pathName);
    }
    // Branch head connector scenario with Decision or Pause as the source
    return getDescriptionForDecisionOrPauseBranchHeadConnector(
        flowModel,
        sourceElement,
        sourceLabel,
        targetLabel,
        childIndex,
        describedByLabel
    );
}

/**
 * @param flowModel - The Flow Model
 * @param sourceElement - The connector's source element
 * @param sourceLabel - The connector's source label
 * @param targetGuid - The connector's target guid
 * @param targetLabel - The connector's target label
 * @param sourceHasGoTo - True if the connector's source has a GoTo, False if not
 * @returns connector aria label string
 */
function getDescriptionForPostMergeConnector(
    flowModel: FlowModel,
    sourceElement: ParentNodeModel,
    sourceLabel: string,
    targetGuid: string | null,
    targetLabel: string,
    sourceHasGoTo?: boolean
) {
    const mergingBranchCount = getNonTerminalBranchIndexes(sourceElement, flowModel).length;
    if (!sourceHasGoTo && isGoingBackToAncestorLoop(flowModel, targetGuid!, sourceElement)) {
        // When going back from a branching element's merge point to the ancestral loop element
        return format(LABELS.postMergeLoopCloseConnectorDescribedBy, sourceLabel, mergingBranchCount, targetLabel);
    }
    // A regular merge point connector with a number of incoming branches
    return sourceHasGoTo
        ? format(LABELS.postMergeGoToConnectorDescribedBy, sourceLabel, mergingBranchCount, targetLabel)
        : format(LABELS.postMergeConnectorDescribedBy, sourceLabel, mergingBranchCount, targetLabel);
}

/**
 * @param flowModel - The Flow Model
 * @param sourceElement - The connector's source element
 * @param sourceLabel - The connector's source label
 * @param targetGuid - The connector's target guid
 * @param targetLabel - The connector's target label
 * @param sourceHasGoTo - True if the connector's source has a GoTo, False if not
 * @returns connector aria label string
 */
function getDescriptionForImmediateAndScheduledPathConnectors(
    flowModel: FlowModel,
    sourceElement: ParentNodeModel,
    sourceLabel: string,
    targetGuid: string | null,
    targetLabel: string,
    sourceHasGoTo?: boolean
) {
    if (!(sourceElement as ParentNodeModel).children) {
        // A connector from the START element with no scheduled paths in the Run Immediately path
        return format(LABELS.branchHeadConnectorDescribedBy, sourceLabel, targetLabel, LABELS.ariaRunImmediatelyLabel);
    }
    // A merge point connector with a number of incoming branches from the START element
    return getDescriptionForPostMergeConnector(
        flowModel,
        sourceElement,
        sourceLabel,
        targetGuid,
        targetLabel,
        sourceHasGoTo
    );
}

/**
 * @param flowModel - The Flow Model
 * @param sourceElement - The connector's source element
 * @param childIndex - The connector's source child index value
 * @returns connector aria label string
 */
function getTargetGuid(
    flowModel: FlowModel,
    sourceElement: ParentNodeModel,
    childIndex: number | null | undefined
): Guid | null {
    return childIndex != null
        ? getChild(sourceElement, childIndex) || getFirstNonNullNext(flowModel, sourceElement, false)
        : sourceElement.next || getFirstNonNullNext(flowModel, findParentElement(sourceElement, flowModel), false);
}

/**
 * @param flowModel Flow Model
 * @param source The connection source
 * @returns connector aria label string
 */
function getConnectorAriaInfo(flowModel: FlowModel, source: ConnectionSource) {
    const { guid, childIndex } = source;
    const sourceElement = flowModel[guid];
    let ariaDescribedBy = '';

    if (sourceElement.nodeType === NodeType.ROOT) {
        return ariaDescribedBy;
    }

    const sourceLabel = sourceElement.nodeType === NodeType.START ? sourceElement.elementType : sourceElement.label;
    const targetGuid = getTargetGuid(flowModel, sourceElement as ParentNodeModel, childIndex);
    const targetLabel = flowModel[targetGuid!].label;
    const sourceHasGoTo = hasGoTo(flowModel, source);

    if (childIndex != null) {
        ariaDescribedBy = getDescriptionForBranchHeadConnectors(
            flowModel,
            sourceElement as ParentNodeModel,
            sourceLabel,
            targetGuid,
            targetLabel,
            childIndex,
            sourceHasGoTo
        );
    } else if (sourceElement.nodeType === NodeType.LOOP) {
        // Evaluating After Last connector
        ariaDescribedBy = getDescriptionForLoopConnectors(
            flowModel,
            ConnectorLabelType.LOOP_AFTER_LAST,
            sourceElement as ParentNodeModel,
            sourceLabel,
            targetGuid,
            targetLabel,
            sourceHasGoTo
        );
    } else if (sourceElement.nodeType === NodeType.BRANCH) {
        // Merge Point scenario
        ariaDescribedBy = getDescriptionForPostMergeConnector(
            flowModel,
            sourceElement as ParentNodeModel,
            sourceLabel,
            targetGuid,
            targetLabel,
            sourceHasGoTo
        );
    } else if (
        sourceElement.nodeType === NodeType.START &&
        (sourceElement as StartNodeModel).shouldSupportScheduledPaths
    ) {
        ariaDescribedBy = getDescriptionForImmediateAndScheduledPathConnectors(
            flowModel,
            sourceElement as ParentNodeModel,
            sourceLabel,
            targetGuid,
            targetLabel,
            sourceHasGoTo
        );
    } else if (!sourceHasGoTo && isGoingBackToAncestorLoop(flowModel, targetGuid!, sourceElement)) {
        // When a regular connector in the For Each branch is going back to the ancestral loop element
        ariaDescribedBy = format(LABELS.loopCloseConnectorDescribedBy, sourceLabel, targetLabel);
    } else {
        // A regular connector scenario between two nodes
        const label = sourceHasGoTo ? LABELS.goToConnectorDescribedBy : LABELS.straightConnectorDescribedBy;
        ariaDescribedBy = format(label, sourceLabel, targetLabel);
    }

    return ariaDescribedBy;
}

/**
 * Creates a unique key for a connector
 *
 * @param connectorInfo - The connector render info
 * @returns a string key
 */
function connectorKey(connectorInfo: ConnectorRenderInfo): string {
    const { source, type } = connectorInfo;
    const { guid, childIndex } = source;
    const suffix = childIndex == null ? `${guid}` : `${guid}:${childIndex}`;
    return `connector-${type}-${suffix}`;
}

const ELEMENT_TYPE_DECISION = 'Decision';

/**
 * Get the following element of a node
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param node - nodeModel of a node
 * @returns NodeModel of the following element
 */
function getFollowingElement(flowModel: FlowModel, node: NodeModel): NodeModel | null {
    let followingElement;
    if (node.next) {
        followingElement = flowModel[node.next];
    } else {
        const parentNode = findParentElement(node, flowModel);
        if (parentNode.nodeType === NodeType.ROOT) {
            return followingElement;
        }
        const targetGuid = getFirstNonNullNext(flowModel, parentNode, false);
        followingElement = targetGuid ? flowModel[targetGuid] : followingElement;
    }
    return followingElement;
}

/**
 * Get aria info for the following element
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param node - nodeModel of a node
 * @param followingElement - nodeModel of the following element
 * @param needDelimiter - whether a delimiter needs to be appended
 * @param needAfterMergingLabel - whether after merging label is needed
 * @returns a string of aria info
 */
function getAriaInfoForFollowingElement(
    flowModel: FlowModel,
    node: NodeModel,
    followingElement: NodeModel,
    needDelimiter: boolean,
    needAfterMergingLabel: boolean
) {
    let label = '';
    if (hasGoToOnNext(flowModel, node.guid)) {
        label = needAfterMergingLabel ? LABELS.ariaGoToPostMergeFollowedByLabel : LABELS.ariaGoToFollowedByLabel;
    } else if (isGoingBackToAncestorLoop(flowModel, followingElement.guid, node)) {
        label = needAfterMergingLabel ? LABELS.ariaLoopPostMergeFollowedByLabel : LABELS.ariaLoopFollowedByLabel;
    } else if (
        node.nodeType === NodeType.START &&
        (node as StartNodeModel).shouldSupportScheduledPaths &&
        !(node as ParentNodeModel).children
    ) {
        // should announce run immediately path for start element that supports scheduled path and has no paths on it
        label = LABELS.ariaFollowedByPathImmediateLabel;
    } else {
        label = needAfterMergingLabel ? LABELS.ariaRegularPostMergeFollowedByLabel : LABELS.ariaRegularFollowedByLabel;
    }
    return format(needDelimiter ? DELIMITER + label : label, followingElement.label);
}

/**
 * Get aria info for a branching element
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param node - nodeModel of a node
 * @param children - children of the node
 * @param followingElement - nodeModel of the element following current node
 * @returns a string of aria info
 */
function getAriaInfoForBranchingElement(
    flowModel: FlowModel,
    node: ParentNodeModel,
    children: NodeRef[],
    followingElement: NodeModel | null
): string {
    let ariaDescribedBy = '';

    if (children.length > 3) {
        // Node has 3+ child elements
        const label =
            node.nodeType === NodeType.START
                ? LABELS.ariaScheduledPathCountLabel
                : node.elementType === ELEMENT_TYPE_DECISION
                ? LABELS.ariaOutcomeCountLabel
                : LABELS.ariaPauseConfigurationCountLabel;
        ariaDescribedBy = format(label, children.length);
    } else if (node.nodeType === NodeType.LOOP) {
        // Node is a loop element, generate the aria info for the for each path
        const useGoToLabelForEach = hasGoToOnBranchHead(flowModel, node.guid, FOR_EACH_INDEX);
        ariaDescribedBy = format(
            useGoToLabelForEach ? LABELS.ariaForEachPathGoToLabel : LABELS.ariaForEachPathLabel,
            children[0] ? flowModel[children[0]].label : LABELS.ariaEmptyBranchLabel
        );
    } else {
        // Node is a regular branching element
        const regularLabel =
            node.nodeType === NodeType.START
                ? LABELS.ariaScheduledPathInfo
                : node.elementType === ELEMENT_TYPE_DECISION
                ? LABELS.ariaDecisionPathInfo
                : LABELS.ariaPausePathInfo;
        // calculate default index: start element's default index is 0, non-start element's default is length - 1
        const defaultIndex = node.nodeType === NodeType.START ? START_IMMEDIATE_INDEX : children.length - 1;

        // generate aria info for each branches and apprend them to ariaDescribedBy
        for (let i = 0; i < children.length; i++) {
            // get path label: default index should use default label,
            // start element's labels are stored in reverse order
            const pathLabel =
                i === defaultIndex
                    ? node.defaultConnectorLabel
                    : node.nodeType === NodeType.START
                    ? flowModel[node.childReferences[i - 1].childReference].label
                    : flowModel[node.childReferences[i].childReference].label;

            // get goTo label for different element types
            const goToLabel =
                node.nodeType === NodeType.START
                    ? LABELS.ariaScheduledPathGoToInfo
                    : node.elementType === ELEMENT_TYPE_DECISION
                    ? LABELS.ariaDecisionPathGoToInfo
                    : LABELS.ariaPausePathGoToInfo;

            const childElement = children[i] ? flowModel[children[i]!] : null;
            const info = format(
                hasGoToOnBranchHead(flowModel, node.guid, i) ? goToLabel : regularLabel,
                pathLabel,
                childElement ? childElement.label : LABELS.ariaEmptyBranchLabel
            );

            ariaDescribedBy += ariaDescribedBy === '' ? info : DELIMITER + info;
        }
    }

    if (followingElement) {
        if (node.nodeType === NodeType.LOOP) {
            // generate the aria info for the after last path of loop
            const useGoToLabelAfterLast = hasGoToOnNext(flowModel, node.guid);
            // nested loop should use loop label for the after last path
            const useLoopLabel = isGoingBackToAncestorLoop(flowModel, followingElement.guid, node);
            ariaDescribedBy +=
                DELIMITER +
                format(
                    useGoToLabelAfterLast
                        ? LABELS.ariaAfterLastPathGoToLabel
                        : useLoopLabel
                        ? LABELS.ariaAfterLastPathLoopLabel
                        : LABELS.ariaAfterLastPathLabel,
                    followingElement!.label
                );
        } else {
            // generate aria info for the following element of regular branching element
            ariaDescribedBy += getAriaInfoForFollowingElement(flowModel, node, followingElement, true, true);
        }
    }
    return ariaDescribedBy;
}

/**
 * Get aria info for a branch head element
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param node - nodeModel of a node
 * @param followingElement - nodeModel of the element following current node
 * @param childIndex - childIndex of the node
 * @param children - children of the node
 * @returns a string of aria info
 */
function getAriaInfoForBranchHeadElement(
    flowModel: FlowModel,
    node: NodeModel,
    followingElement: NodeModel | null,
    childIndex: number,
    children: NodeRef[]
) {
    const { parent } = node as BranchHeadNodeModel;
    let ariaDescribedBy = '';

    if (childIndex === FOR_EACH_INDEX && flowModel[parent].nodeType === NodeType.LOOP) {
        // branch head is on the for each path of a loop
        ariaDescribedBy = LABELS.ariaOnForEachPathLabel;
    } else if (childIndex === FAULT_INDEX) {
        // branch head is on the fault path
        ariaDescribedBy = LABELS.ariaOnFaultPathLabel;
    } else if (flowModel[parent].nodeType === NodeType.START) {
        // branch head of start node
        const pathLabel =
            childIndex === START_IMMEDIATE_INDEX
                ? flowModel[parent].defaultConnectorLabel
                : flowModel[(flowModel[parent] as ParentNodeModel).childReferences[childIndex - 1].childReference]
                      .label;
        ariaDescribedBy = format(LABELS.ariaOnScheduledPathLabel, pathLabel);
    } else {
        // regular branch head: decision and pause
        const label =
            flowModel[parent].elementType === ELEMENT_TYPE_DECISION
                ? LABELS.ariaOutcomeLabel
                : LABELS.ariaPauseConfigurationLabel;

        if (childIndex === (flowModel[parent] as ParentNodeModel).children.length - 1) {
            // use defaultConnectorLabel for the label of the default path
            ariaDescribedBy = format(label, node.defaultConnectorLabel);
        } else {
            const childReference = (flowModel[parent] as ParentNodeModel).childReferences[childIndex].childReference;
            ariaDescribedBy = format(label, flowModel[childReference].label);
        }
    }

    if (children) {
        // branch head node is a branching element
        ariaDescribedBy +=
            DELIMITER + getAriaInfoForBranchingElement(flowModel, node as ParentNodeModel, children, followingElement);
    } else {
        // branch head is a regular element
        ariaDescribedBy += getAriaInfoForFollowingElement(flowModel, node, followingElement!, true, false);
    }

    return ariaDescribedBy;
}

/**
 * Get the aria info needed for an alcNode component
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param nodeInfo - NodeRenderInfo of the node
 * @returns a string of aria info
 */
function getNodeAriaInfo(flowModel: FlowModel, nodeInfo: NodeRenderInfo): string {
    let ariaDescribedBy = '';

    const { guid } = nodeInfo;
    const node = flowModel[guid];

    if (node && node.nodeType !== NodeType.END && node.nodeType !== NodeType.ROOT) {
        const { children } = node as ParentNodeModel;
        const { childIndex } = node as BranchHeadNodeModel;

        const followingElement = getFollowingElement(flowModel, node);

        if (childIndex != null && node.nodeType !== NodeType.START) {
            // Branch head node
            ariaDescribedBy = getAriaInfoForBranchHeadElement(flowModel, node, followingElement, childIndex, children);
        } else {
            // Non branch head but need to be handled separately
            const prevElement = node.prev ? flowModel[node.prev] : null;
            if (prevElement?.nodeType === NodeType.LOOP) {
                // 1. first node on the after last path of a loop
                ariaDescribedBy = LABELS.ariaOnPathAfterLastLabel;
            } else if (
                prevElement?.nodeType === NodeType.START &&
                (prevElement as StartNodeModel).shouldSupportScheduledPaths &&
                !(prevElement as ParentNodeModel).children
            ) {
                // 2. previous element is start node that supports scheduled path and have no path on it
                ariaDescribedBy =
                    ariaDescribedBy === ''
                        ? LABELS.ariaOnPathImmediateLabel
                        : ariaDescribedBy + DELIMITER + LABELS.ariaOnPathImmediateLabel;
            }

            if (children) {
                // Branching node: start, decision, wait, loop
                const branchingElementInfo = getAriaInfoForBranchingElement(
                    flowModel,
                    node as ParentNodeModel,
                    children,
                    followingElement
                );
                ariaDescribedBy =
                    ariaDescribedBy === '' ? branchingElementInfo : ariaDescribedBy + DELIMITER + branchingElementInfo;
            } else {
                // Regular node
                ariaDescribedBy += getAriaInfoForFollowingElement(
                    flowModel,
                    node,
                    followingElement!,
                    ariaDescribedBy !== '',
                    false
                );
            }
        }

        // Fault
        if (node.fault) {
            ariaDescribedBy +=
                DELIMITER +
                format(
                    hasGoToOnBranchHead(flowModel, node.guid, FAULT_INDEX)
                        ? LABELS.ariaFaultPathGoToLabel
                        : LABELS.ariaFaultPathLabel,
                    flowModel[node.fault].label
                );
        }

        // Element with incomingGoTo
        if (node.incomingGoTo && node.incomingGoTo.length > 0) {
            const incomingGoToLabel =
                node.incomingGoTo.length > 1
                    ? format(LABELS.ariaMultiGoToConnectorLabel, node.incomingGoTo.length)
                    : LABELS.ariaOneGoToConnectorLabel;
            ariaDescribedBy += DELIMITER + incomingGoToLabel;
        }
    }

    return ariaDescribedBy;
}

/**
 * Creates an interaction for handling the F6 shortcut
 *
 * @param shortcuts - The shortcut map
 * @param handleShiftFocusForward - The handler for the tab key interaction
 * @returns an interaction for handling the tab key
 */
export function getShiftFocusForwardInteraction(shortcuts, handleShiftFocusForward: () => void) {
    return new BaseKeyboardInteraction([
        createShortcut(shortcuts.shiftFocusForward, new ShiftFocusForwardCommand(() => handleShiftFocusForward()))
    ]);
}

/**
 * Creates an interaction for handling the shift+F6 shortcut
 *
 * @param shortcuts - The shortcut map
 * @param handleShiftFocusBackward - The handler for the tab key interaction
 * @returns an interaction for handling the tab key
 */
export function getShiftFocusBackwardInteraction(shortcuts, handleShiftFocusBackward: () => void) {
    return new BaseKeyboardInteraction([
        createShortcut(shortcuts.shiftFocusBackward, new ShiftFocusBackwardCommand(() => handleShiftFocusBackward()))
    ]);
}

/**
 * Creates an interaction for handling the tab key
 *
 * @param handleTab - The handler for the tab key interaction
 * @returns an interaction for handling the tab key
 */
export function getTabKeyInteraction(handleTab: () => void) {
    return new BaseKeyboardInteraction([createShortcut(Keys.Tab, new TabCommand(() => handleTab(), false))]);
}

/**
 * Creates an interaction for handling the enter key
 *
 * @param handleEnter - The handler for the enter key interaction
 * @param allowSpaceKey - Whether to also allow the usage of the space key to trigger the interaction
 * @returns an interaction for handling of the enter (and optionally space) key
 */
export function getEnterKeyInteraction(handleEnter: () => void, allowSpaceKey = true) {
    const shortcuts = [createShortcut(Keys.Enter, new EnterCommand(() => handleEnter()))];

    if (allowSpaceKey) {
        shortcuts.push(createShortcut(Keys.Space, new SpaceCommand(() => handleEnter())));
    }
    return new BaseKeyboardInteraction(shortcuts);
}

/**
 * Creates an interaction for handling the escape key
 *
 * @param handleEscape - The handler for the escape key interaction
 * @returns an interaction for handling of the escape key
 */
export function getEscapeKeyInteraction(handleEscape: () => void) {
    const shortcuts = [createShortcut(Keys.Escape, new EscapeCommand(() => handleEscape()))];

    return new BaseKeyboardInteraction(shortcuts);
}

/**
 * Creates an interaction for handling the the shift focus interaction (ie: F6 / Shift+F6)
 *
 * @param sections - The sections elements to shift focus to
 * @returns an interaction for handling the shift focus
 */
export function getShiftFocusKeyboardInteraction(sections: HTMLElement[]) {
    return new ShiftFocusKeyboardInteraction(sections);
}

/**
 * Provides the keyboard interaction for the zoom panel
 *
 * @param shortcuts - The zoom shortcut keys
 * @param handleZoomAction - A zoom action handler
 * @returns The zoom keyboard interaction
 */
export function getZoomKeyboardInteraction(shortcuts, handleZoomAction: Function) {
    const zoomInShortcut = createShortcut(
        shortcuts.zoomIn,
        new ZoomInCommand(() => handleZoomAction(new ClickToZoomEvent(ZOOM_ACTION.ZOOM_IN)))
    );

    const zoomOutShortcut = createShortcut(
        shortcuts.zoomOut,
        new ZoomOutCommand(() => handleZoomAction(new ClickToZoomEvent(ZOOM_ACTION.ZOOM_OUT)))
    );

    const zoomToFitShortcut = createShortcut(
        shortcuts.zoomToFit,
        new ZoomToFitCommand(() => handleZoomAction(new ClickToZoomEvent(ZOOM_ACTION.ZOOM_TO_FIT)))
    );

    const zoomToViewShortcut = createShortcut(
        shortcuts.zoomToView,
        new ZoomToViewCommand(() => handleZoomAction(new ClickToZoomEvent(ZOOM_ACTION.ZOOM_TO_VIEW)))
    );

    return new BaseKeyboardInteraction([zoomInShortcut, zoomOutShortcut, zoomToFitShortcut, zoomToViewShortcut]);
}

/**
 * Get the geometry for an element
 *
 * @param element - An html element
 * @returns the element's geometry
 */
export function getDomElementGeometry(element: Element | LightningElement): Geometry {
    const { left, right, top, bottom } = element.getBoundingClientRect();
    return { x: left, y: top, w: right - left, h: bottom - top };
}

/**
 * Schedules a task to run in the next tick
 *
 * @param task - the task to run
 */
export function scheduleTask(task: () => void) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => task(), 0);
}

/**
 * Check if two connections sources are equal
 *
 * @param source1 - The first source
 * @param source2 - The second source
 * @returns true iff they are equal
 */
export function areSourcesEqual(source1: ConnectionSource, source2: ConnectionSource) {
    // disabling '===' here so that undefined and null are equivalent for equalness
    // eslint-disable-next-line eqeqeq
    return source1.guid === source2.guid && source1.childIndex == source2.childIndex;
}

/**
 * Checks if a menu is opened
 *
 * @param canvasContext - The canvas context
 * @param menuType - The menu type
 * @param source - The menu location
 * @returns true iff the specified menu is opened
 */
export function isMenuOpened(canvasContext: CanvasContext, menuType: MenuType, source: ConnectionSource) {
    const { menu } = canvasContext;

    return menu?.type === menuType && areSourcesEqual(menu.source, source);
}

export {
    ICON_SHAPE,
    AutoLayoutCanvasMode,
    connectorKey,
    getCssStyle,
    getStyleFromGeometry,
    getAlcNodeData,
    getAlcCompoundNodeData,
    getAlcFlowData,
    getAlcConnectorData,
    getCanvasElementSelectionData,
    getCanvasElementDeselectionData,
    getFirstSelectableElementGuid
};
