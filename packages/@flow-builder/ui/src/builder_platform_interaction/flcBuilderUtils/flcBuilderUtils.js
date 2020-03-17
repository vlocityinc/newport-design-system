import { ElementType } from 'builder_platform_interaction/flowUtils';
import { ELEMENT_TYPE, isSystemElement } from 'builder_platform_interaction/flowMetadata';
import { useFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';

const ELEMENT_SELECTED_ACTION = 'element_selected_action';
const ELEMENT_DESELECTED_ACTION = 'element_deselected_action';

/**
 * Checks whether to traverse down the chain or not depending on the action the user performed
 *
 * @param {String} action - Selection or Deselection action
 * @param {Object} currentBranchElement - Branch Element we are going to traverse
 */
const _shouldTraverseDown = (action, currentBranchElement) => {
    // In case of deselection, we should traverse down only if canvas element is selected
    const shouldTraverseDown =
        action === ELEMENT_SELECTED_ACTION
            ? !!currentBranchElement
            : currentBranchElement && currentBranchElement.config && currentBranchElement.config.isSelected;
    return shouldTraverseDown;
};

/**
 * Gets the subtree elements present branches of a Decision, Pause or Fault Paths
 *
 * @param {String} action - Selection or Deselection action
 * @param {Object} parentElement - Parent Element of a given tree in the flow
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 */
const _getSubtreeElements = (action, parentElement, flowModel) => {
    let branchElementGuidsToSelectOrDeselect = [];
    if (parentElement && parentElement.children && parentElement.children.length > 0) {
        const branchRootsToVisitStack = parentElement.children;

        // Iterating over different branches of a given parent element
        for (let i = 0; i < branchRootsToVisitStack.length; i++) {
            let currentBranchElement = flowModel[branchRootsToVisitStack[i]];

            // Traversing down a given branch
            while (_shouldTraverseDown(action, currentBranchElement)) {
                branchElementGuidsToSelectOrDeselect.push(currentBranchElement.guid);
                // In case the element supports children, grab the elements from it's branches as well
                if (supportsChildren(currentBranchElement)) {
                    branchElementGuidsToSelectOrDeselect = branchElementGuidsToSelectOrDeselect.concat(
                        _getSubtreeElements(action, currentBranchElement, flowModel)
                    );
                }

                currentBranchElement = flowModel[currentBranchElement.next];
            }
        }
    }

    return branchElementGuidsToSelectOrDeselect;
};

/**
 * Helper function to get all the possible elements that can be selected/deselected next
 *
 * @param {String} topSelectedGuid - Guid of the top-most selected element
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 * @returns {String[]} selectableCanvasElementGuids - An array containing all the selectable Canvas Element Guids
 */
const _getSelectableCanvasElementGuids = (topSelectedGuid, flowModel) => {
    let selectableCanvasElementGuids = [];
    if (topSelectedGuid) {
        const topSelectedElement = flowModel[topSelectedGuid];
        let currentCanvasElement = topSelectedElement;

        // All the elements in the chain above (excluding the Start Element) should be selectable
        while (currentCanvasElement && !isSystemElement(currentCanvasElement.elementType)) {
            selectableCanvasElementGuids.push(currentCanvasElement.guid);
            currentCanvasElement = flowModel[currentCanvasElement.prev || currentCanvasElement.parent];
        }

        // Resetting the currentElement to the topSelectedElement to start going down the chain
        currentCanvasElement = topSelectedElement;

        // All the elements in the vertical chain below (such as element.next is not null) should be selectable
        while (currentCanvasElement && !isSystemElement(currentCanvasElement.elementType)) {
            if (currentCanvasElement.guid !== topSelectedElement.guid) {
                selectableCanvasElementGuids.push(currentCanvasElement.guid);
            }

            // In case the element supports children, all it's branches should also be selectable
            if (supportsChildren(currentCanvasElement)) {
                selectableCanvasElementGuids = selectableCanvasElementGuids.concat(
                    _getSubtreeElements(ELEMENT_SELECTED_ACTION, currentCanvasElement, flowModel)
                );
            }
            currentCanvasElement = flowModel[currentCanvasElement.next];
        }
    }

    return selectableCanvasElementGuids;
};

/**
 * Function to get all the selection data which includes canvasElementGuidsToSelect, canvasElementGuidsToDeselect,
 * selectableCanvasElementGuids and the updated topSelectedGuid
 *
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 * @param {String} selectedCanvasElementGuid - Guid of the Canvas Element that just got selected
 * @param {String} topSelectedGuid - Guid of the top-most selected element
 * @returns {canvasElementGuidsToSelect: String[], canvasElementGuidsToDeselect: String[], selectableCanvasElementGuids: String[], topSelectedGuid: String} - Selection Data as needed by the store
 */
export const getCanvasElementSelectionData = (flowModel, selectedCanvasElementGuid, topSelectedGuid) => {
    let canvasElementGuidsToSelect = [];

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
                if (supportsChildren(currentCanvasElement)) {
                    canvasElementGuidsToSelect = canvasElementGuidsToSelect.concat(
                        _getSubtreeElements(ELEMENT_SELECTED_ACTION, currentCanvasElement, flowModel)
                    );
                }
            } else if (currentCanvasElement.parent) {
                currentCanvasElement = flowModel[currentCanvasElement.parent];
            }

            // In case we reach the start element without having found any selected element, then that means that our
            // topSelectedGuid is somewhere in the chain below. Hence emptying the canvasElementGuidsToSelect array
            // and breaking out of the loop
            if (currentCanvasElement.elementType === ELEMENT_TYPE.START_ELEMENT) {
                canvasElementGuidsToSelect = [];
                break;
            }
        }

        // If canvasElementGuidsToSelect's length is 0 then that means that no selected element was found in the
        // chain above
        if (canvasElementGuidsToSelect.length === 0) {
            currentCanvasElement = flowModel[topSelectedGuid];

            // Going up the chain from topSelctedElement's previous/parent canvas element to find the selected
            // canvas element and pushing all the elements in between into canvasElementGuidsToSelect
            while (currentCanvasElement && currentCanvasElement.guid !== selectedCanvasElementGuid) {
                if (currentCanvasElement.guid !== topSelectedGuid) {
                    canvasElementGuidsToSelect.push(currentCanvasElement.guid);
                }

                if (currentCanvasElement.prev) {
                    currentCanvasElement = flowModel[currentCanvasElement.prev];

                    // In case the element supports children, all it's branches need to be marked as selected as well
                    if (supportsChildren(currentCanvasElement)) {
                        canvasElementGuidsToSelect = canvasElementGuidsToSelect.concat(
                            _getSubtreeElements(ELEMENT_SELECTED_ACTION, currentCanvasElement, flowModel)
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
        selectableCanvasElementGuids: _getSelectableCanvasElementGuids(topSelectedGuid, flowModel),
        topSelectedGuid
    };
};

/**
 * Function to get all the deselection data which includes canvasElementGuidsToSelect, canvasElementGuidsToDeselect,
 * selectableCanvasElementGuids and the updated topSelectedGuid
 *
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 * @param {String} deselectedCanvasElementGuid - Guid of the Canvas Element that just got deselected
 * @param {String} topSelectedGuid - Guid of the top-most selected element
 * @returns {canvasElementGuidsToSelect: String[], canvasElementGuidsToDeselect: String[], selectableCanvasElementGuids: String[], topSelectedGuid: String} - Deselection Data as needed by the store
 */
export const getCanvasElementDeselectionData = (flowModel, deselectedCanvasElementGuid, topSelectedGuid) => {
    const deselectedCanvasElement = flowModel[deselectedCanvasElementGuid];
    let canvasElementGuidsToDeselect = [];

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

        // In case the element supports children, all it's branches need to be marked as deselected as well
        if (supportsChildren(deselectedCanvasElement)) {
            canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
                _getSubtreeElements(ELEMENT_DESELECTED_ACTION, deselectedCanvasElement, flowModel)
            );
        }
    } else {
        let currentCanvasElement = deselectedCanvasElement;
        // Deselecting one of the middle elements, should deselect everything else in the vertical chain
        // (i.e. till the the point element.next is not null) below as well
        while (currentCanvasElement && currentCanvasElement.config && currentCanvasElement.config.isSelected) {
            canvasElementGuidsToDeselect.push(currentCanvasElement.guid);

            // In case the element supports children, all it's branches need to be marked as deselected as well
            if (supportsChildren(currentCanvasElement)) {
                canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
                    _getSubtreeElements(ELEMENT_DESELECTED_ACTION, currentCanvasElement, flowModel)
                );
            }
            currentCanvasElement = flowModel[currentCanvasElement.next];
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
 * Function to get the guids of all the canvas elements that need to be deselected when toggling off the selection mode.
 * Also setting the topSelectedGuid to null.
 *
 * @param {Object} flowModel - Representation of the flow as presented in the Canvas
 * @param {String} topSelectedGuid - Guid of the top-most selected element
 */
export const getCanvasElementDeselectionDataOnToggleOff = (flowModel, topSelectedGuid) => {
    const topSelectedElement = flowModel[topSelectedGuid];
    let canvasElementGuidsToDeselect = [];

    let currentCanvasElement = topSelectedElement;
    // When toggling out of the selection mode, everything needs to be deselected
    while (currentCanvasElement && currentCanvasElement.config && currentCanvasElement.config.isSelected) {
        canvasElementGuidsToDeselect.push(currentCanvasElement.guid);

        // In case the element supports children, all it's branches need to be marked as deselected as well
        if (supportsChildren(currentCanvasElement)) {
            canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
                _getSubtreeElements(ELEMENT_DESELECTED_ACTION, currentCanvasElement, flowModel)
            );
        }
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
 * @return true iff an element can have children
 */
export function supportsChildren({ elementType }) {
    return elementType === ELEMENT_TYPE.DECISION || elementType === ELEMENT_TYPE.WAIT;
}

/**
 * Maps a flow ELEMENT_TYPE to an FLC ElementType
 */
export function getFlcElementType(elementType) {
    switch (elementType) {
        case ELEMENT_TYPE.DECISION:
        case ELEMENT_TYPE.WAIT:
            return ElementType.DECISION;
        case ELEMENT_TYPE.LOOP:
            return ElementType.LOOP;
        case ELEMENT_TYPE.START_ELEMENT:
            return ElementType.START;
        case ELEMENT_TYPE.END_ELEMENT:
            return ElementType.END;
        case ELEMENT_TYPE.ROOT_ELEMENT:
            return ElementType.ROOT;
        default:
            return ElementType.DEFAULT;
    }
}

/**
 * Extra properties used by the flc canvas for elements
 */
export const flcExtraProps = ['next', 'prev', 'children', 'parent', 'childIndex', 'isTerminal'];

/**
 * Adds flc props that are not undefined to an object
 * @param {*} object Object to add flc props to
 * @param {*} flcProperties Object containing flc props
 */
export function addFlcProperties(object, flcProperties) {
    if (useFixedLayoutCanvas()) {
        flcExtraProps.forEach(propName => {
            const propValue = flcProperties[propName];
            if (propValue !== undefined) {
                object[propName] = propValue;
            }
        });
    }

    return object;
}
