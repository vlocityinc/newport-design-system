// @ts-nocheck
import {
    ADD_CANVAS_ELEMENT,
    ADD_CHILD,
    ADD_CONNECTOR,
    ADD_DECISION_WITH_OUTCOMES,
    ADD_PARENT_WITH_CHILDREN,
    ADD_RESOURCE,
    ADD_SCREEN_WITH_FIELDS,
    ADD_START_ELEMENT,
    ADD_WAIT_WITH_WAIT_EVENTS,
    CLEAR_CANVAS_DECORATION,
    DECORATE_CANVAS,
    DELETE_CHILDREN,
    DELETE_ELEMENT,
    DELETE_RESOURCE,
    DESELECT_ON_CANVAS,
    DO_DUPLICATE,
    HIGHLIGHT_ON_CANVAS,
    MARQUEE_SELECT_ON_CANVAS,
    MODIFY_DECISION_WITH_OUTCOMES,
    MODIFY_PARENT_WITH_CHILDREN,
    MODIFY_SCREEN_WITH_FIELDS,
    MODIFY_START_WITH_SCHEDULED_PATHS,
    MODIFY_WAIT_WITH_WAIT_EVENTS,
    SELECT_ON_CANVAS,
    TOGGLE_ON_CANVAS,
    UPDATE_CANVAS_ELEMENT,
    UPDATE_CANVAS_ELEMENT_ERROR_STATE,
    UPDATE_CANVAS_ELEMENT_LOCATION,
    UPDATE_FLOW,
    UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE,
    UPDATE_RECORD_LOOKUP,
    UPDATE_RESOURCE,
    UPDATE_RESOURCE_ERROR_STATE,
    UPDATE_VARIABLE_CONSTANT
} from 'builder_platform_interaction/actions';
import { addItem, omit, updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { DECORATION_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getUniqueDuplicateElementName } from 'builder_platform_interaction/storeUtils';
import { getSubElementGuids } from './reducersUtils';

/**
 * Reducer for elements.
 *
 * @param {Object} state - elements in the store
 * @param {Object} action - with type and payload
 * @returns {Object} new state after reduction
 */
/* eslint-disable-next-line complexity */
/**
 * @param state
 * @param action
 */
// eslint-disable-next-line complexity
export default function elementsReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_FLOW:
        case UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE:
            return { ...action.payload.elements };
        case DO_DUPLICATE:
            return _duplicateElement(
                state,
                action.payload.canvasElementGuidMap,
                action.payload.childElementGuidMap,
                action.payload.connectorsToDuplicate,
                action.payload.unduplicatedCanvasElementsGuids
            );
        case ADD_CANVAS_ELEMENT:
        case ADD_START_ELEMENT:
        case ADD_RESOURCE:
        case UPDATE_CANVAS_ELEMENT:
        case UPDATE_RESOURCE:
        case UPDATE_RESOURCE_ERROR_STATE:
            return _addOrUpdateElement(state, action.payload.guid, action.payload);
        case UPDATE_CANVAS_ELEMENT_LOCATION:
            return _updateCanvasElementsLocation(state, action.payload);
        case UPDATE_VARIABLE_CONSTANT:
            return _updateVariableOrConstant(state, action.payload.guid, action.payload);
        case UPDATE_RECORD_LOOKUP:
            return _updateRecordLookup(state, action.payload.guid, action.payload);
        case DELETE_ELEMENT:
            return _deleteAndUpdateElements(state, action.payload.selectedElements, action.payload.connectorsToDelete);
        case ADD_CONNECTOR:
            return _updateElementOnAddConnection(state, action.payload);
        case DELETE_CHILDREN:
            return _deleteChildElements(state, action.payload.parentGUID, action.payload.selectedElements);
        case DELETE_RESOURCE:
            if (
                action.payload.selectedElements &&
                action.payload.selectedElements.length > 0 &&
                action.payload.selectedElements[0]
            ) {
                state = omit(state, action.payload.selectedElements[0].guid);
            }
            return state;
        case SELECT_ON_CANVAS:
            return _selectCanvasElement(state, action.payload.guid);
        case TOGGLE_ON_CANVAS:
            return _toggleCanvasElement(state, action.payload.guid);
        case DESELECT_ON_CANVAS:
            return _deselectCanvasElements(state);
        case MARQUEE_SELECT_ON_CANVAS:
            return _marqueeSelect(
                state,
                action.payload.canvasElementGuidsToSelect,
                action.payload.canvasElementGuidsToDeselect
            );
        case HIGHLIGHT_ON_CANVAS:
            return _highlightCanvasElement(state, action.payload.guid);
        case ADD_DECISION_WITH_OUTCOMES:
        case MODIFY_DECISION_WITH_OUTCOMES:
        case ADD_WAIT_WITH_WAIT_EVENTS:
        case MODIFY_WAIT_WITH_WAIT_EVENTS:
        case MODIFY_START_WITH_SCHEDULED_PATHS:
        case ADD_PARENT_WITH_CHILDREN:
        case MODIFY_PARENT_WITH_CHILDREN:
        case UPDATE_CANVAS_ELEMENT_ERROR_STATE:
            return _addOrUpdateCanvasElementWithChildElements(
                state,
                action.payload.canvasElement,
                action.payload.deletedChildElementGuids,
                action.payload.childElements
            );
        case ADD_CHILD:
            return _addChildElement(state, action.payload.parentGuid, action.payload.element);
        case ADD_SCREEN_WITH_FIELDS:
        case MODIFY_SCREEN_WITH_FIELDS:
            return _addOrUpdateScreenWithScreenFields(
                state,
                action.payload.screen,
                action.payload.deletedFields,
                action.payload.fields
            );
        case DECORATE_CANVAS:
            return _decorateCanvasElements(state, action.payload.elementsToDecorate);
        case CLEAR_CANVAS_DECORATION:
            return _clearCanvasDecoration(state);

        default:
            return state;
    }
}

/**
 * Helper function to duplicate the selected canvas elements and any associated child elements.
 *
 * @param {Object} state - current state of elements in the store
 * @param {Object} canvasElementGuidMap - Map of selected canvas elements guids to a newly generated guid that will be used as
 * the guid for the duplicate element
 * @param {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 * @param {Object[]} connectorsToDuplicate - Array containing connectors that need to be duplicated
 * @param unduplicatedCanvasElementsGuids
 * @returns {Object} new state after reduction
 * @private
 */
function _duplicateElement(
    state,
    canvasElementGuidMap = {},
    childElementGuidMap = {},
    connectorsToDuplicate = [],
    unduplicatedCanvasElementsGuids = []
) {
    let newState = Object.assign({}, state);

    const elementGuidsToDuplicate = Object.keys(canvasElementGuidMap);
    const childElementGuidsToDuplicate = Object.keys(childElementGuidMap);
    const blacklistNames = [];
    const childElementNameMap = _getDuplicateChildElementNameMap(
        newState,
        childElementGuidsToDuplicate,
        blacklistNames
    );

    // Deselect all the unduplicated elements
    unduplicatedCanvasElementsGuids.forEach((guid) => _deselectElement(newState[guid], newState));

    for (let i = 0; i < elementGuidsToDuplicate.length; i++) {
        const selectedElement = newState[elementGuidsToDuplicate[i]];
        // Deselect each element to be duplicated (since the duplicated elements will now be selected)
        _deselectElement(selectedElement, newState);

        // Figure out a unique name for the element to be duplicated
        const duplicateElementGuid = canvasElementGuidMap[selectedElement.guid];
        const duplicateElementName = getUniqueDuplicateElementName(selectedElement.name, blacklistNames);
        blacklistNames.push(duplicateElementName);

        const elementConfig = getConfigForElementType(selectedElement.elementType);
        const { duplicatedElement, duplicatedChildElements = {} } =
            elementConfig &&
            elementConfig.factory &&
            elementConfig.factory.duplicateElement &&
            elementConfig.factory.duplicateElement(
                selectedElement,
                duplicateElementGuid,
                duplicateElementName,
                childElementGuidMap,
                childElementNameMap
            );

        newState[duplicatedElement.guid] = duplicatedElement;
        newState = { ...newState, ...duplicatedChildElements };
    }

    // Update the available connections and connector count on each duplicated element based on what connectors were also duplicated
    _updateAvailableConnectionsAndConnectorCount(
        newState,
        connectorsToDuplicate,
        canvasElementGuidMap,
        childElementGuidMap
    );

    return newState;
}

/**
 * Helper function to deselect an element
 *
 * @param {Object} selectedElement - a canvas element that's selected
 * @param {Object} state to update - the state
 * @private
 */
function _deselectElement(selectedElement, state) {
    if (selectedElement && selectedElement.config && selectedElement.config.isSelected) {
        state[selectedElement.guid] = Object.assign({}, selectedElement, {
            config: {
                isSelected: false,
                isHighlighted: selectedElement.config.isHighlighted,
                hasError: selectedElement.config.hasError
            }
        });
    }
}

/**
 * Helper function to add or update a decision/wait element
 *
 * @param {Object} state - current state of elements in the store
 * @param {Object} canvasElement - the canvas element being added/modified
 * @param {Object[]} deletedChildElementGuids - Guids of all child elements being deleted. If deleted child elements have associated connectors, then
 * the connectorCount will be decremented appropriately
 * @param {Object[]} childElements - All child elements in the updated canvas element state (does not include deleted child elements)
 * @returns {Object} new state after reduction
 * @private
 */
function _addOrUpdateCanvasElementWithChildElements(
    state,
    canvasElement,
    deletedChildElementGuids,
    childElements = []
) {
    let newState = updateProperties(state);
    newState[canvasElement.guid] = updateProperties(newState[canvasElement.guid], canvasElement);

    for (const childElement of childElements) {
        newState[childElement.guid] = updateProperties(newState[childElement.guid], childElement);
    }

    newState = omit(newState, deletedChildElementGuids);

    return newState;
}

/**
 * Helper function to add a child element.  Will create and add the element
 * to its parent as needed
 *
 * @param state
 * @param parentGuid
 * @param childElement
 * @private
 */
function _addChildElement(state: UI.StoreState, parentGuid: UI.Guid, childElement: UI.ChildElement): object {
    const newState = updateProperties(state);

    newState[childElement.guid] = updateProperties(newState[childElement.guid], childElement);

    let parentElement: UI.CanvasElement = newState[parentGuid];
    parentElement = updateProperties(parentElement, {
        childReferences: [
            ...parentElement.childReferences,
            {
                childReference: childElement.guid
            }
        ]
    });

    newState[parentGuid] = updateProperties(newState[parentGuid], parentElement);

    return newState;
}

/**
 * Helper function to delete child elements. Removes the children from the parent
 *
 * @param state
 * @param parentGuid
 * @param childElements
 * @private
 */
function _deleteChildElements(
    state: UI.StoreState,
    parentGuid: UI.Guid,
    childElements: UI.ChildElement[]
): UI.StoreState {
    let newState = updateProperties(state);

    const childGuids: UI.Guid[] = childElements.map((child) => child.guid);

    newState = <UI.StoreState>omit(newState, childGuids);

    let parentElement: UI.CanvasElement = newState[parentGuid];
    parentElement = updateProperties(parentElement, {
        childReferences: parentElement.childReferences.filter((ref) => !childGuids.includes(ref.childReference))
    });

    newState[parentGuid] = updateProperties(newState[parentGuid], parentElement);

    return newState;
}

/**
 * Helper function to add or update an element.
 *
 * @param {Object} state - current state of elements in the store
 * @param {string} guid - GUID of element to be added or updated
 * @param {Object} element - information about the element to be added or updated
 * @returns {Object} new state after reduction
 * @private
 */
function _addOrUpdateElement(state, guid, element) {
    const newState = updateProperties(state);
    newState[guid] = updateProperties({}, element);
    return newState;
}

/**
 * Helper function to update the locations off all the dragged canvas elements
 *
 * @param {Object} state - current state of elements in the store
 * @param {Object[]} updatedCanvasElementLocations - Array of objects containing updated canvas elements locations
 * @returns {Object} new state after reduction
 * @private
 */
function _updateCanvasElementsLocation(state, updatedCanvasElementLocations) {
    const newState = updateProperties(state);
    updatedCanvasElementLocations.map((info) => {
        newState[info.canvasElementGuid] = updateProperties(newState[info.canvasElementGuid], {
            locationX: info.locationX,
            locationY: info.locationY
        });
        return info;
    });

    return newState;
}

/**
 * Helper function to replace an element.  This will completely replace the element in the store with the provided.
 * Currently used only by variable and constant
 *
 * @param {Object} state - current state of elements in the store
 * @param {string} guid - GUID of element to be replaced
 * @param {Object} element - The element to inject
 * @returns {Object} new state after reduction
 * @private
 */
function _updateVariableOrConstant(state, guid, element) {
    return updateProperties(state, { [guid]: element });
}

/**
 * Helper function update an element a record lookup.
 * It should be deleted when W-5147341 is fixed
 *
 * @param {Object} state - current state of elements in the store
 * @param {string} guid - GUID of element to be added or updated
 * @param {Object} element - information about the element to be added or updated
 * @returns {Object} new state after reduction
 * @private
 */
function _updateRecordLookup(state, guid, element) {
    const newState = _addOrUpdateElement(state, guid, element);
    // remove shortOrder and sortField if they are not in element
    if (element.hasOwnProperty('object')) {
        if (!element.hasOwnProperty('sortOrder')) {
            delete newState[guid].sortOrder;
        }
        if (!element.hasOwnProperty('sortField')) {
            delete newState[guid].sortField;
        }
    }
    return newState;
}

/**
 * Helper function to delete all selected canvas elements and to update the affected canvas elements with the new connector count
 *
 * @param {Object} elements - current state of elements in the store
 * @param {Object[]} originalElements - canvas elements that need to be deleted
 * @param {Object[]} connectorsToDelete - All connector objects that need to be deleted
 * @returns {Object} new state after reduction
 * @private
 */
function _deleteAndUpdateElements(elements, originalElements, connectorsToDelete) {
    const guidsToDelete = [];

    originalElements.forEach((element) => {
        guidsToDelete.push(...getSubElementGuids(element, elements));
        guidsToDelete.push(element.guid);
    });

    const newState = omit(elements, guidsToDelete);

    const connectorsToDeleteLength = connectorsToDelete.length;
    for (let i = 0; i < connectorsToDeleteLength; i++) {
        const connector = connectorsToDelete[i];
        const connectorSourceElement = updateProperties(newState[connector.source]);
        if (connectorSourceElement && connectorSourceElement.connectorCount) {
            // Decrements the connector count
            connectorSourceElement.connectorCount--;

            if (connectorSourceElement.availableConnections) {
                // Adds the deleted connector to availableConnections
                connectorSourceElement.availableConnections = addItem(connectorSourceElement.availableConnections, {
                    type: connector.type,
                    childReference: connector.childSource
                });
            }

            newState[connector.source] = connectorSourceElement;
        }
    }

    return newState;
}

/**
 * Helper function to increment the connector count of a given canvas element when a new connection has been added
 *
 * @param {Object} elements - current state of elements in the store
 * @param {string} connector - connector object
 * @returns {Object} new state after reduction
 * @private
 */
function _updateElementOnAddConnection(elements, connector) {
    const newState = updateProperties(elements);
    const sourceGuid = connector.source;
    const sourceElement = updateProperties(newState[sourceGuid]);

    // Filters out the available connections on the source element for the given connector
    const childSourceGUID = connector.childSource;
    const connectorType = connector.type;
    _filterAvailableConnections(sourceElement, childSourceGUID, connectorType);

    // Increments the connector count
    sourceElement.connectorCount++;
    newState[connector.source] = sourceElement;

    return newState;
}

/**
 * Helper function to select a canvas element. Iterates over all the canvas elements and sets the isSelected property for
 * the selected canvas element to true (Doesn't affect it's isHighlighted state). Also sets the isSelected and
 * isHighlighted property for all other selected/highlighted canvas elements to false.
 *
 * @param {Object} elements - current state of elements in the store
 * @param {string} selectedGUID - GUID of the canvas element to be selected
 * @returns {Object} new state of elements after reduction
 * @private
 */
function _selectCanvasElement(elements, selectedGUID) {
    const newState = updateProperties(elements);
    let hasStateChanged = false;
    Object.keys(elements).map((guid) => {
        const element = newState[guid];
        if (element && element.isCanvasElement && element.config) {
            if (guid === selectedGUID) {
                if (!element.config.isSelected) {
                    newState[guid] = updateProperties(element, {
                        config: {
                            isSelected: true,
                            isHighlighted: element.config.isHighlighted,
                            hasError: element.config.hasError
                        }
                    });
                    hasStateChanged = true;
                }
            } else if (element.config.isSelected || element.config.isHighlighted) {
                newState[guid] = updateProperties(element, {
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        hasError: element.config.hasError
                    }
                });
                hasStateChanged = true;
            }
        }
        return guid;
    });
    return hasStateChanged ? newState : elements;
}

/**
 * Helper function to marquee select canvas elements. Iterates over the guidsToSelect/guidsToDeselect array
 * and sets the isSelected property of the canvas element to true/false repectively, and set isHighlighted state to false in both case.
 *
 * @param {Object} elements - current state of elements in the store
 * @param {string[]} guidsToSelect - Array of canvas elements to be selected
 * @param {string[]} guidsToDeselect - Array of canvas elements to be deselected
 */
function _marqueeSelect(elements, guidsToSelect, guidsToDeselect) {
    const newState = updateProperties(elements);
    let hasStateChanged = false;
    guidsToSelect.map((guid) => {
        newState[guid] = updateProperties(newState[guid], {
            config: {
                isSelected: true,
                isHighlighted: newState[guid].config.isHighlighted,
                hasError: newState[guid].config.hasError
            }
        });
        hasStateChanged = true;
        return guid;
    });

    guidsToDeselect.map((guid) => {
        newState[guid] = updateProperties(newState[guid], {
            config: {
                isSelected: false,
                isHighlighted: newState[guid].config.isHighlighted,
                hasError: newState[guid].config.hasError
            }
        });
        hasStateChanged = true;
        return guid;
    });

    return hasStateChanged ? newState : elements;
}

/**
 * Helper function to toggle the isSelected state of a canvas element. This doesn't affect the isHighlighted state.
 *
 * @param {Object} elements - current state of elements in the store
 * @param {string} selectedGUID - GUID of the canvas element to be toggled
 * @returns {Object} new state of elements after reduction
 * @private
 */
function _toggleCanvasElement(elements, selectedGUID) {
    const newState = updateProperties(elements);
    const element = elements[selectedGUID];
    if (element) {
        newState[selectedGUID] = updateProperties(newState[selectedGUID], {
            config: {
                isSelected: !element.config.isSelected,
                isHighlighted: element.config.isHighlighted,
                hasError: element.config.hasError
            }
        });
    }
    return newState;
}

/**
 * Iterates over all the canvas elements and sets the isSelected and isHighlighted property of all the currently
 * selected/highlighted canvas elements to false.
 *
 * @param {Object} elements - current state of elements in the store
 * @returns {Object} new state of elements after reduction
 * @private
 */
function _deselectCanvasElements(elements) {
    const newState = updateProperties(elements);
    let hasStateChanged = false;
    Object.keys(elements).map((guid) => {
        const element = newState[guid];
        if (
            element &&
            element.isCanvasElement &&
            element.config &&
            (element.config.isSelected || element.config.isHighlighted)
        ) {
            newState[guid] = updateProperties(element, {
                config: {
                    isSelected: false,
                    isHighlighted: false,
                    hasError: element.config.hasError
                }
            });
            hasStateChanged = true;
        }
        return guid;
    });
    return hasStateChanged ? newState : elements;
}

/**
 * Sets the isHighlighted property of the searched element to true (if it already wasn't). Also sets the isHighlighted
 * property of any other highlighted canvas element to false. This doesn't affect the isSelected property of any element.
 *
 * @param {Object} elements - current state of elements in the store
 * @param {string} elementGuid - GUID of the canvas element to be highlighted
 * @returns {Object} new state of elements after reduction
 * @private
 */
function _highlightCanvasElement(elements, elementGuid) {
    const newState = updateProperties(elements);
    Object.keys(elements).map((guid) => {
        const element = newState[guid];
        if (element && element.isCanvasElement && element.config) {
            if (guid === elementGuid) {
                if (!element.config.isHighlighted) {
                    newState[guid] = updateProperties(element, {
                        config: {
                            isSelected: element.config.isSelected,
                            isHighlighted: true,
                            hasError: element.config.hasError
                        }
                    });
                }
            } else if (element.config.isHighlighted) {
                newState[guid] = updateProperties(element, {
                    config: {
                        isSelected: element.config.isSelected,
                        isHighlighted: false,
                        hasError: element.config.hasError
                    }
                });
            }
        }
        return guid;
    });
    return newState;
}

/**
 * Helper function to add or update a screenFields
 *
 * @param {Object} state - current state of elements in the store
 * @param {Object} screen - the screen being added/modified
 * @param {Object[]} deletedFields - All screenFields being deleted.
 * @param {Object[]} fields - All screenFields in the updated screen state (does not include deleted screenFields)
 * @returns {Object} new state after reduction
 * @private
 */
function _addOrUpdateScreenWithScreenFields(state, screen, deletedFields, fields = []) {
    let newState = updateProperties(state);
    newState[screen.guid] = updateProperties(newState[screen.guid], screen);

    for (const field of fields) {
        newState[field.guid] = updateProperties(newState[field.guid], field);
    }

    const deletedFieldGuids = [];
    for (const field of deletedFields) {
        deletedFieldGuids.push(field.guid);
    }

    newState[screen.guid] = updateProperties(newState[screen.guid]);
    newState = omit(newState, deletedFieldGuids);
    return newState;
}

/**
 * Helper function to get unique dev names for child elements
 *
 * @param {Object} state - store state
 * @param {Object} childElementGuidsToDuplicate - list of guids of the child elements to duplicate
 * @param {string[]} blacklistNames - blacklisted list of names to check against in addition to store
 * @returns {Object} Map of child element dev names to duplicated child element dev names
 */
function _getDuplicateChildElementNameMap(state, childElementGuidsToDuplicate, blacklistNames = []) {
    const childElementNameMap = {};
    for (let i = 0; i < childElementGuidsToDuplicate.length; i++) {
        const childElement = state[childElementGuidsToDuplicate[i]];
        const duplicateChildElementName = getUniqueDuplicateElementName(childElement.name, blacklistNames);
        childElementNameMap[childElement.name] = { name: duplicateChildElementName };
        blacklistNames.push(duplicateChildElementName);
    }

    return childElementNameMap;
}

/**
 * Helper function to update available connections and connector count for duplicated elements
 *
 * @param {Object} state - store state
 * @param {Object[]} connectorsToDuplicate - list of connector objects to duplicate
 * @param {Object} canvasElementGuidMap - Map of canvas element guids to duplicated canvas element guids
 * @param {Object} childElementGuidMap - Map of child element guids to duplicated child element guids
 */
function _updateAvailableConnectionsAndConnectorCount(
    state,
    connectorsToDuplicate,
    canvasElementGuidMap,
    childElementGuidMap
) {
    for (let i = 0; i < connectorsToDuplicate.length; i++) {
        const originalConnector = connectorsToDuplicate[i];

        const duplicateSourceGuid = canvasElementGuidMap[originalConnector.source];
        const duplicateSourceElement = state[duplicateSourceGuid];

        const childSourceGUID = originalConnector.childSource && childElementGuidMap[originalConnector.childSource];
        const duplicateConnectorType = originalConnector.type;
        _filterAvailableConnections(duplicateSourceElement, childSourceGUID, duplicateConnectorType);

        state[duplicateSourceGuid] = Object.assign({}, duplicateSourceElement, {
            connectorCount: duplicateSourceElement.connectorCount + 1
        });
    }
}

/**
 * Helper function to filter available connections on an element based on connector type or child source guid
 *
 * @param {Object} element - canvas element for which available connections are to be filtered
 * @param {string} childSourceGUID - child source guid (eg. outcome guid) to filter available connections on
 * @param {string} connectorType - connector type to filter available connections on
 */
function _filterAvailableConnections(element, childSourceGUID, connectorType) {
    if (element.availableConnections) {
        if (childSourceGUID) {
            // Filtering out an available connection if the child reference matches the child source element guid passed in
            element.availableConnections = element.availableConnections.filter(
                (availableConnector) => availableConnector.childReference !== childSourceGUID
            );
        } else {
            // Filtering out an available connection if it's type matches the connectorType passed in and if it doesn't have any childReference
            element.availableConnections = element.availableConnections.filter(
                (availableConnector) => availableConnector.type !== connectorType || availableConnector.childReference
            );
        }
    }
}

/**
 * Helper function to calculate if hasError property on the element needs to be updated or not
 *
 * @param element - element to be updated
 * @param elementsToDecorate - array of elements that need to be decorated
 */
function _shouldUpdateHasError(element: object, elementsToDecorate: object[]) {
    for (let i = 0; i < elementsToDecorate.length; i++) {
        const { elementName, decorationType } = elementsToDecorate[i];
        if (elementName === element.name && decorationType === DECORATION_TYPE.ERROR) {
            return true;
        }
    }

    return false;
}

/**
 * Function to update the hasError property. Setting the property to true for elements included in
 * elementsToDecorate. And setting it to false for anything else if needed.
 *
 * @param elements - store state
 * @param elementsToDecorate - array of elements that need to be decorated
 */
function _decorateCanvasElements(elements: object, elementsToDecorate: object[]) {
    const newState = updateProperties(elements);
    let hasStateChanged = false;

    Object.keys(elements).forEach((guid) => {
        const element = newState[guid];
        if (_shouldUpdateHasError(element, elementsToDecorate)) {
            if (!element.config.hasError) {
                newState[guid] = updateProperties(element, {
                    config: {
                        isSelected: element.config.isSelected,
                        isHighlighted: element.config.isHighlighted,
                        hasError: true
                    }
                });
                hasStateChanged = true;
            }
        } else if (element.config && element.config.hasError) {
            // Resetting any other element's hasError if needed. This would be the case
            // when user tries to debug again and an error is found in a different element
            newState[guid] = updateProperties(element, {
                config: {
                    isSelected: element.config.isSelected,
                    isHighlighted: element.config.isHighlighted,
                    hasError: false
                }
            });
            hasStateChanged = true;
        }
    });

    return hasStateChanged ? newState : elements;
}

/**
 * Function to clear the canvas decoration state
 *
 * @param elements - store state
 */
function _clearCanvasDecoration(elements: object) {
    const newState = updateProperties(elements);
    let hasStateChanged = false;
    Object.keys(elements).map((guid) => {
        const element = newState[guid];
        if (element && element.config && element.config.hasError) {
            newState[guid] = updateProperties(element, {
                config: {
                    isSelected: element.config.isSelected,
                    isHighlighted: element.config.isHighlighted,
                    hasError: false
                }
            });
            hasStateChanged = true;
        }
        return guid;
    });
    return hasStateChanged ? newState : elements;
}
