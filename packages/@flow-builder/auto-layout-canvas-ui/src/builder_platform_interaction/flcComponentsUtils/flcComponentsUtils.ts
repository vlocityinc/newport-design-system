import { classSet } from 'lightning/utils';
import { ElementType, getElementMetadata } from 'builder_platform_interaction/autoLayoutCanvas';

enum ICON_SHAPE {
    DIAMOND = 'diamond', // Example, Decision
    CIRCLE = 'circle', // Example, Start Element
    SQUARE = 'square'
}

function isSystemElement(elementsMetadata, elementType) {
    const type = getElementMetadata(elementsMetadata, elementType).type;
    switch (type) {
        case ElementType.ROOT:
        case ElementType.START:
        case ElementType.END:
            return true;
        default:
            return false;
    }
}

const ELEMENT_SELECTED_ACTION = 'element_selected_action';
const ELEMENT_DESELECTED_ACTION = 'element_deselected_action';

/**
 * Return true iff an element can have children
 *
 * @param {Object} elementsMetadata - Contains elementType -> data map
 * @param {Object} element - Element being checked for supporting children
 * @return true iff an element can have children
 */
function supportsChildren(elementsMetadata, { elementType }) {
    const type = getElementMetadata(elementsMetadata, elementType).type;
    return supportsChildrenForType(type);
}

/**
 * Function to check if a given element type supports children
 *
 * @param {String} type - Type of a given element
 * @returns true if the element is of type Branch
 */
function supportsChildrenForType(type) {
    return type === ElementType.BRANCH;
}

/**
 * Checks whether to traverse down the chain or not depending on the action the user performed
 *
 * @param {String} action - Selection or Deselection action
 * @param {Object} currentBranchElement - Branch Element we are going to traverse
 */
function _shouldTraverseDown(action, currentBranchElement) {
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
 * @param {Object} elementsMetadata - Contains elementType -> data map
 * @param {String} action - Selection or Deselection action
 * @param {Object} parentElement - Parent Element of a given tree in the flow
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 */
function _getChildBranchElements(elementsMetadata, action, parentElement, flowModel) {
    let branchElementGuidsToSelectOrDeselect: string[] = [];
    if (parentElement && parentElement.children && parentElement.children.length > 0) {
        const branchRootsToVisitStack = parentElement.children;

        // Iterating over different branches of a given parent element
        for (let i = 0; i < branchRootsToVisitStack.length; i++) {
            let currentBranchElement = flowModel[branchRootsToVisitStack[i]];

            // Traversing down a given branch
            while (_shouldTraverseDown(action, currentBranchElement)) {
                branchElementGuidsToSelectOrDeselect.push(currentBranchElement.guid);
                // Grabs all the elements in the child and fault branches as needed
                branchElementGuidsToSelectOrDeselect = branchElementGuidsToSelectOrDeselect.concat(
                    _getSubtreeElements(elementsMetadata, action, currentBranchElement, flowModel)
                );
                currentBranchElement = flowModel[currentBranchElement.next];
            }
        }
    }

    return branchElementGuidsToSelectOrDeselect;
}

/**
 * Gets all the elements present in the Fault branch of a given element
 *
 * @param {Object} elementsMetadata - Contains elementType -> data map
 * @param {String} action - Selection or Deselection action
 * @param {Object} parentElement - Parent Element of a given tree in the flow
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 */
function _getFaultBranchElements(elementsMetadata, action, parentElement, flowModel) {
    let branchElementGuidsToSelectOrDeselect: string[] = [];
    let currentBranchElement = flowModel[parentElement.fault];

    // Iterate only up till the End Element of the Fault Branch
    while (!isSystemElement(elementsMetadata, currentBranchElement.elementType)) {
        branchElementGuidsToSelectOrDeselect.push(currentBranchElement.guid);
        // Grabs all the elements in the child and fault branches as needed
        branchElementGuidsToSelectOrDeselect = branchElementGuidsToSelectOrDeselect.concat(
            _getSubtreeElements(elementsMetadata, action, currentBranchElement, flowModel)
        );
        currentBranchElement = flowModel[currentBranchElement.next];
    }

    return branchElementGuidsToSelectOrDeselect;
}

/**
 * Gets all the elements present in the child and/or fault branches of a given parent element
 *
 * @param {Object} elementsMetadata - Contains elementType -> data map
 * @param {String} action - Selection or Deselection action
 * @param {Object} parentElement - Parent Element of a given tree in the flow
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 */
function _getSubtreeElements(elementsMetadata, action, parentElement, flowModel) {
    let canvasElementGuidsArray: string[] = [];
    // Getting all the elements present in the child branches based on the selection/deselection action
    if (supportsChildren(elementsMetadata, parentElement)) {
        canvasElementGuidsArray = canvasElementGuidsArray.concat(
            _getChildBranchElements(elementsMetadata, action, parentElement, flowModel)
        );
    }
    // Getting all the elements present in the fault branch based on the selection/deselection action
    if (parentElement.fault) {
        canvasElementGuidsArray = canvasElementGuidsArray.concat(
            _getFaultBranchElements(elementsMetadata, action, parentElement, flowModel)
        );
    }

    return canvasElementGuidsArray;
}

/**
 * Helper function to get all the possible elements that can be selected/deselected next
 *
 * @param {Object} elementsMetadata - Contains elementType -> data map
 * @param {String} topSelectedGuid - Guid of the top-most selected element
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 * @returns {String[]} selectableCanvasElementGuids - An array containing all the selectable Canvas Element Guids
 */
function _getSelectableCanvasElementGuids(elementsMetadata, topSelectedGuid, flowModel) {
    let selectableCanvasElementGuids: string[] = [];
    if (topSelectedGuid) {
        const topSelectedElement = flowModel[topSelectedGuid];
        let currentCanvasElement = topSelectedElement;

        // All the elements in the chain above (excluding the Start Element) should be selectable
        while (currentCanvasElement && !isSystemElement(elementsMetadata, currentCanvasElement.elementType)) {
            selectableCanvasElementGuids.push(currentCanvasElement.guid);
            currentCanvasElement = flowModel[currentCanvasElement.prev || currentCanvasElement.parent];
        }

        // Resetting the currentElement to the topSelectedElement to start going down the chain
        currentCanvasElement = topSelectedElement;

        // All the elements in the vertical chain below (such as element.next is not null) should be selectable
        while (currentCanvasElement && !isSystemElement(elementsMetadata, currentCanvasElement.elementType)) {
            if (currentCanvasElement.guid !== topSelectedElement.guid) {
                selectableCanvasElementGuids.push(currentCanvasElement.guid);
            }
            // Getting all the selectable elements present in the child and fault branches
            selectableCanvasElementGuids = selectableCanvasElementGuids.concat(
                _getSubtreeElements(elementsMetadata, ELEMENT_SELECTED_ACTION, currentCanvasElement, flowModel)
            );

            currentCanvasElement = flowModel[currentCanvasElement.next];
        }
    }

    return selectableCanvasElementGuids;
}

/**
 * Function to get all the selection data which includes canvasElementGuidsToSelect, canvasElementGuidsToDeselect,
 * selectableCanvasElementGuids and the updated topSelectedGuid
 *
 * @param {Object} elementsMetadata - Contains elementType -> data map
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 * @param {String} selectedCanvasElementGuid - Guid of the Canvas Element that just got selected
 * @param {String} topSelectedGuid - Guid of the top-most selected element
 * @returns {canvasElementGuidsToSelect: String[], canvasElementGuidsToDeselect: String[], selectableCanvasElementGuids: String[], topSelectedGuid: String} - Selection Data as needed by the store
 */
const getCanvasElementSelectionData = (elementsMetadata, flowModel, selectedCanvasElementGuid, topSelectedGuid) => {
    let canvasElementGuidsToSelect: string[] = [];

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
                if (supportsChildren(elementsMetadata, currentCanvasElement)) {
                    canvasElementGuidsToSelect = canvasElementGuidsToSelect.concat(
                        _getChildBranchElements(
                            elementsMetadata,
                            ELEMENT_SELECTED_ACTION,
                            currentCanvasElement,
                            flowModel
                        )
                    );
                }
            } else if (currentCanvasElement.parent) {
                currentCanvasElement = flowModel[currentCanvasElement.parent];
            }

            // In case we reach the start element without having found any selected element, then that means that our
            // topSelectedGuid is somewhere in the chain below. Hence emptying the canvasElementGuidsToSelect array
            // and breaking out of the loop
            if (getElementMetadata(elementsMetadata, currentCanvasElement.elementType).type === ElementType.START) {
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
                    if (supportsChildren(elementsMetadata, currentCanvasElement)) {
                        canvasElementGuidsToSelect = canvasElementGuidsToSelect.concat(
                            _getChildBranchElements(
                                elementsMetadata,
                                ELEMENT_SELECTED_ACTION,
                                currentCanvasElement,
                                flowModel
                            )
                        );
                    }
                } else if (currentCanvasElement.parent) {
                    currentCanvasElement = flowModel[currentCanvasElement.parent];
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
        selectableCanvasElementGuids: _getSelectableCanvasElementGuids(elementsMetadata, topSelectedGuid, flowModel),
        topSelectedGuid
    };
};

/**
 * Function to get all the deselection data which includes canvasElementGuidsToSelect, canvasElementGuidsToDeselect,
 * selectableCanvasElementGuids and the updated topSelectedGuid
 *
 * @param {Object} elementsMetadata - Contains elementType -> data map
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 * @param {String} deselectedCanvasElementGuid - Guid of the Canvas Element that just got deselected
 * @param {String} topSelectedGuid - Guid of the top-most selected element
 * @returns {canvasElementGuidsToSelect: String[], canvasElementGuidsToDeselect: String[], selectableCanvasElementGuids: String[], topSelectedGuid: String} - Deselection Data as needed by the store
 */
const getCanvasElementDeselectionData = (elementsMetadata, flowModel, deselectedCanvasElementGuid, topSelectedGuid) => {
    const deselectedCanvasElement = flowModel[deselectedCanvasElementGuid];
    let canvasElementGuidsToDeselect: string[] = [];

    if (deselectedCanvasElementGuid === topSelectedGuid) {
        // Top-most element is being deselected, we don't need to deselect anything else. Just have to reset the
        // topSelectedGuid to the next selected element (if any). In case the next element is not selected, reset
        // topSelectedGuid to null
        const nextCanvasElement = flowModel[deselectedCanvasElement.next];
        if (nextCanvasElement && nextCanvasElement.config && nextCanvasElement.config.isSelected) {
            topSelectedGuid = nextCanvasElement.guid;
        } else {
            topSelectedGuid = null;
        }

        // Pushing the deselected element to the canvasElementGuidsToDeselect array
        canvasElementGuidsToDeselect.push(deselectedCanvasElementGuid);

        // Getting all the child and fault branch elements to deselect
        canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
            _getSubtreeElements(elementsMetadata, ELEMENT_DESELECTED_ACTION, deselectedCanvasElement, flowModel)
        );
    } else {
        let currentCanvasElement = deselectedCanvasElement;
        // Deselecting one of the middle elements, should deselect everything else in the vertical chain
        // (i.e. till the the point element.next is not null) below as well
        while (currentCanvasElement && currentCanvasElement.config && currentCanvasElement.config.isSelected) {
            canvasElementGuidsToDeselect.push(currentCanvasElement.guid);

            // Getting all the child and fault branch elements to deselect
            canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
                _getSubtreeElements(elementsMetadata, ELEMENT_DESELECTED_ACTION, currentCanvasElement, flowModel)
            );

            currentCanvasElement = flowModel[currentCanvasElement.next];
        }
    }

    // In the case where topSelectedGuid doesn't exist, everything is selectable. Just passing an empty array
    // in that scenario
    return {
        canvasElementGuidsToSelect: [],
        canvasElementGuidsToDeselect,
        selectableCanvasElementGuids: topSelectedGuid
            ? _getSelectableCanvasElementGuids(elementsMetadata, topSelectedGuid, flowModel)
            : [],
        topSelectedGuid
    };
};

/**
 * Function to get the guids of all the canvas elements that need to be deselected when toggling off the selection mode.
 * Also setting the topSelectedGuid to null.
 *
 * @param {Object} elementsMetadata - Contains elementType -> data map
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 * @param {String} topSelectedGuid - Guid of the top-most selected element
 */
const getCanvasElementDeselectionDataOnToggleOff = (elementsMetadata, flowModel, topSelectedGuid) => {
    const topSelectedElement = flowModel[topSelectedGuid];
    let canvasElementGuidsToDeselect: string[] = [];

    let currentCanvasElement = topSelectedElement;
    // When toggling out of the selection mode, everything needs to be deselected
    while (currentCanvasElement && currentCanvasElement.config && currentCanvasElement.config.isSelected) {
        canvasElementGuidsToDeselect.push(currentCanvasElement.guid);

        // Getting all the child and fault branch elements to deselect
        canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
            _getSubtreeElements(elementsMetadata, ELEMENT_DESELECTED_ACTION, currentCanvasElement, flowModel)
        );
        currentCanvasElement = flowModel[currentCanvasElement.next];
    }

    return {
        canvasElementGuidsToSelect: [],
        canvasElementGuidsToDeselect,
        selectableCanvasElementGuids: [],
        topSelectedGuid: null // TopSelectedGuid needs to be set back to null
    };
};

/**
 * Util functions for flc components
 */

const CLASS_MENU_OPENED = 'menu-opened';
const CLASS_IS_NEW = 'is-new';

function getCssStyle(cssEntries) {
    return Object.entries(cssEntries)
        .map(entry => `${entry[0]}: ${entry[1]}px`)
        .join(';');
}

/**
 * Returns a css style string for a Geometry object
 *
 * @param {Object} - A geometry object
 * @returns A css style string for the geometry
 */
function getStyleFromGeometry({ x, y, w, h }) {
    return getCssStyle({
        left: x,
        top: y,
        width: w,
        height: h
    });
}

/**
 * Get the data needed to render a flcConnector component
 *
 * @param {ConnectorRenderInfo} connectorInfo - Info about a connector
 * @returns {Object} The flcConnector component data
 */
function getFlcConnectorData(connectorInfo) {
    return {
        key: connectorKey(connectorInfo),
        connectorInfo,
        style: getStyleFromGeometry(connectorInfo.geometry),
        className: ''
    };
}

/**
 * Get the data needed to render a flcFlow component
 *
 * @param {FlowRenderInfo} flowInfo - Info about a flow
 * @param {NodeRenderInfo} parentNodeInfo - The flow's parent node info
 * @param {number} childIndex - The flow's childIndex
 * @returns {Object} The flcFlow component data
 */
function getFlcFlowData(flowInfo, parentNodeInfo, childIndex) {
    return {
        key: `flow-${parentNodeInfo.guid}-${childIndex}`,
        flowInfo,
        style: getStyleFromGeometry(flowInfo.geometry),
        className: ''
    };
}

/**
 * Get the data needed to render a flcCompoundNode component
 *
 * @param {NodeRenderInfo} nodeInfo - Info about a node
 * @returns {Object} The flcCompoundNode component data
 */
function getFlcCompoundNodeData(nodeInfo) {
    const { geometry, guid } = nodeInfo;
    const className = classSet({ [CLASS_IS_NEW]: nodeInfo.isNew });

    const faultFlow = nodeInfo.faultFlow ? getFlcFlowData(nodeInfo.faultFlow, nodeInfo, -1) : null;

    return {
        key: guid,
        nodeInfo,
        style: getStyleFromGeometry(geometry),
        className,
        faultFlow
    };
}

/**
 * Get the data needed to render a flcNode component
 *
 * @param {NodeRenderInfo} nodeInfo - Info about a node
 * @returns {Object} The flcNode component data
 */
function getFlcNodeData(nodeInfo) {
    const { guid, menuOpened } = nodeInfo;

    const className = classSet({
        [CLASS_MENU_OPENED]: menuOpened
    }).toString();

    return {
        key: guid,
        nodeInfo,
        className,
        style: ''
    };
}

/**
 * Creates a unique key for a connector
 *
 * @param {String} prefix - a key prefix
 * @param {ConnectorRenderInfo} connectorInfo- The connector render info
 * @returns a string key
 */
function connectorKey(connectorInfo) {
    const { connectionInfo, type } = connectorInfo;
    const { prev, next, parent, childIndex } = connectionInfo;
    const suffix = prev ? `${prev}:${next}` : `${parent}:${childIndex}`;
    return `connector-${type}-${suffix}`;
}

export {
    ICON_SHAPE,
    supportsChildrenForType,
    connectorKey,
    getStyleFromGeometry,
    getFlcNodeData,
    getFlcCompoundNodeData,
    getFlcFlowData,
    getFlcConnectorData,
    getCanvasElementSelectionData,
    getCanvasElementDeselectionData,
    getCanvasElementDeselectionDataOnToggleOff
};
