import {
    UPDATE_FLOW,
    ADD_CANVAS_ELEMENT,
    UPDATE_CANVAS_ELEMENT,
    DELETE_ELEMENT,
    ADD_CONNECTOR,
    ADD_RESOURCE,
    UPDATE_RESOURCE,
    DELETE_RESOURCE,
    UPDATE_VARIABLE_CONSTANT,
    SELECT_ON_CANVAS,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    HIGHLIGHT_ON_CANVAS,
    UNHIGHLIGHT_ON_CANVAS,
    ADD_DECISION_WITH_OUTCOMES,
    MODIFY_DECISION_WITH_OUTCOMES,
    ADD_WAIT_WITH_WAIT_EVENTS,
    MODIFY_WAIT_WITH_WAIT_EVENTS,
    UPDATE_RECORD_LOOKUP,
    ADD_SCREEN_WITH_FIELDS,
    MODIFY_SCREEN_WITH_FIELDS,
    ADD_START_ELEMENT
} from "builder_platform_interaction/actions";
import { deepCopy } from "builder_platform_interaction/storeLib";
import { updateProperties, omit, addItem } from "builder_platform_interaction/dataMutationLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

/**
 * Reducer for elements.
 *
 * @param {Object} state - elements in the store
 * @param {Object} action - with type and payload
 * @return {Object} new state after reduction
 */
export default function elementsReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_FLOW:
            return deepCopy(action.payload.elements);
        case ADD_CANVAS_ELEMENT:
        case ADD_START_ELEMENT:
        case ADD_RESOURCE:
        case UPDATE_CANVAS_ELEMENT:
        case UPDATE_RESOURCE:
            return _addOrUpdateElement(state, action.payload.guid, action.payload);
        case UPDATE_VARIABLE_CONSTANT:
            return _updateVariableOrConstant(state, action.payload.guid, action.payload);
        case UPDATE_RECORD_LOOKUP:
            return _updateRecordLookup(state, action.payload.guid, action.payload);
        case DELETE_ELEMENT:
            return _deleteAndUpdateElements(state, action.payload.selectedElementGUIDs, action.payload.connectorsToDelete);
        case ADD_CONNECTOR:
            return _updateElementOnAddConnection(state, action.payload);
        case DELETE_RESOURCE:
            return omit(state, action.payload.selectedElementGUIDs);
        case SELECT_ON_CANVAS:
            return _selectCanvasElement(state, action.payload.guid);
        case TOGGLE_ON_CANVAS:
            return _toggleCanvasElement(state, action.payload.guid);
        case DESELECT_ON_CANVAS:
            return _deselectCanvasElements(state);
        case HIGHLIGHT_ON_CANVAS:
            return _highlightCanvasElement(state, action.payload.guid);
        case UNHIGHLIGHT_ON_CANVAS:
            return _unhighlightCanvasElement(state, action.payload.guid);
        case ADD_DECISION_WITH_OUTCOMES:
        case MODIFY_DECISION_WITH_OUTCOMES:
        case ADD_WAIT_WITH_WAIT_EVENTS:
        case MODIFY_WAIT_WITH_WAIT_EVENTS:
            return _addOrUpdateCanvasElementWithChildElements(state, action.payload.canvasElement, action.payload.deletedChildElementGuids, action.payload.childElements);
        case ADD_SCREEN_WITH_FIELDS:
        case MODIFY_SCREEN_WITH_FIELDS:
            return _addOrUpdateScreenWithScreenFields(state, action.payload.screen, action.payload.deletedFields, action.payload.fields);
        default:
            return state;
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
 *
 * @return {Object} new state after reduction
 * @private
 */
function _addOrUpdateCanvasElementWithChildElements(state, canvasElement, deletedChildElementGuids, childElements = []) {
    let newState = updateProperties(state);
    newState[canvasElement.guid] = updateProperties(newState[canvasElement.guid], canvasElement);

    for (const childElement of childElements) {
        newState[childElement.guid] = updateProperties(newState[childElement.guid], childElement);
    }

    newState = omit(newState, deletedChildElementGuids);

    return newState;
}

/**
 * Helper function to add or update an element.
 *
 * @param {Object} state - current state of elements in the store
 * @param {String} guid - GUID of element to be added or updated
 * @param {Object} element - information about the element to be added or updated
 * @return {Object} new state after reduction
 * @private
 */
function _addOrUpdateElement(state, guid, element) {
    const newState = updateProperties(state);
    newState[guid] = updateProperties(newState[guid], element);
    return newState;
}

/**
 * Helper function to replace an element.  This will completely replace the element in the store with the provided.
 * Currently used only by variable and constant
 *
 * @param {Object} state - current state of elements in the store
 * @param {String} guid - GUID of element to be replaced
 * @param {Object} element - The element to inject
 * @return {Object} new state after reduction
 * @private
 */
function _updateVariableOrConstant(state, guid, element) {
    return updateProperties(state, { [guid] : element});
}

/**
 * Helper function update an element a record lookup.
 * It should be deleted when W-5147341 is fixed
 * @param {Object} state - current state of elements in the store
 * @param {String} guid - GUID of element to be added or updated
 * @param {Object} element - information about the element to be added or updated
 * @return {Object} new state after reduction
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
 * Returns an array of subelements for a given element.  For example, for a decision, return an array of all
 * outcome guids
 *
 * @param {Object} node element to check for subelements
 * @return {Object[]} Array of subelement giuds for the given element.  Can be an empty array
 */
function _getSubElementGuids(node) {
    const subElementsGuids = [];

    if (node.elementType === ELEMENT_TYPE.DECISION) {
        for (let i = 0; i < node.outcomeReferences.length; i++) {
            subElementsGuids.push(node.outcomeReferences[i].outcomeReference);
        }
    } else if (node.elementType === ELEMENT_TYPE.SCREEN) {
        for (let i = 0; i < node.fieldReferences.length; i++) {
            subElementsGuids.push(node.fieldReferences[i].fieldReference);
        }
    } else if (node.elementType === ELEMENT_TYPE.WAIT) {
        for (let i = 0; i < node.waitEventReferences.length; i++) {
            subElementsGuids.push(node.waitEventReferences[i].waitEventReference);
        }
    }

    return subElementsGuids;
}

/**
 * Helper function to delete all selected canvas elements and to update the affected canvas elements with the new connector count
 *
 * @param {Object} elements - current state of elements in the store
 * @param {String[]} originalGUIDs - GUIDs of canvas elements that need to be deleted
 * @param {Object[]} connectorsToDelete - All connector objects that need to be deleted
 * @returns {Object} new state after reduction
 * @private
 */
function _deleteAndUpdateElements(elements, originalGUIDs, connectorsToDelete) {
    const guidsToDelete = [];
    for (let i = 0; i < originalGUIDs.length; i++) {
        const guid = originalGUIDs[i];
        guidsToDelete.push(..._getSubElementGuids(elements[guid]));
    }

    guidsToDelete.push(...originalGUIDs);

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
 * @param {String} connector - connector object
 * @returns {Object} new state after reduction
 * @private
 */
function _updateElementOnAddConnection(elements, connector) {
    const newState = updateProperties(elements);
    const sourceGuid = connector.source;
    const sourceElement = updateProperties(newState[sourceGuid]);
    const connectorType = connector.type;
    const childSourceGUID = connector.childSource;

    if (sourceElement.availableConnections) {
        // Removes the newly added connection from availableConnections
        if (childSourceGUID) {
            sourceElement.availableConnections =
                sourceElement.availableConnections.filter(availableConnector => (availableConnector.childReference !==  childSourceGUID));
        } else {
            sourceElement.availableConnections =
                sourceElement.availableConnections.filter(availableConnector => (availableConnector.type !==  connectorType));
        }
    }

    // Increments the connector count
    sourceElement.connectorCount++;
    newState[connector.source] = sourceElement;
    return newState;
}

/**
 * Helper function to select a canvas element. Iterates over all the canvas elements and sets the isSelected property for
 * the selected canvas element to true. Also sets the isSelected property for all other canvas elements to false.
 *
 * @param {Object} elements - current state of elements in the store
 * @param {String} selectedGUID - GUID of the canvas element to be selected
 * @return {Object} new state of elements after reduction
 * @private
 */
function _selectCanvasElement(elements, selectedGUID) {
    const newState = updateProperties(elements);
    Object.keys(elements).map(guid => {
        const element = newState[guid];
        if (element.isCanvasElement) {
            if (guid === selectedGUID) {
                if (!element.config.isSelected) {
                    newState[guid] = updateProperties(element, {
                        config: {
                            isSelected: true,
                            isHighlighted: false
                        }
                    });
                }
            } else if (element.config.isSelected) {
                newState[guid] = updateProperties(element, {
                    config: {
                        isSelected: false,
                        isHighlighted: false
                    }
                });
            }
        }
        return guid;
    });
    return newState;
}

/**
 * Helper function to toggle the isSelected state of a canvas element.
 *
 * @param {Object} elements - current state of elements in the store
 * @param {String} selectedGUID - GUID of the canvas element to be toggled
 * @return {Object} new state of elements after reduction
 * @private
 */
function _toggleCanvasElement(elements, selectedGUID) {
    let newState = elements;
    const element = elements[selectedGUID];
    if (element) {
        newState = updateProperties(elements);
        newState[selectedGUID] = updateProperties(newState[selectedGUID], {
            config: {
                isSelected: !element.config.isSelected,
                isHighlighted: false
            }
        });
    }
    return newState;
}

/**
 * Helper function to deselect all the selected canvas elements. Iterates over all the canvas elements and sets the
 * isSelected property of all the currently selected canvas elements to false.
 *
 * @param {Object} elements - current state of elements in the store
 * @return {Object} new state of elements after reduction
 * @private
 */
function _deselectCanvasElements(elements) {
    const newState = updateProperties(elements);
    Object.keys(elements).map(guid => {
        const element = newState[guid];
        if (element.isCanvasElement) {
            if (element.config.isSelected) {
                newState[guid] = updateProperties(element, {
                    config: {
                        isSelected: false,
                        isHighlighted: false
                    }
                });
            }
        }
        return guid;
    });
    return newState;
}

/**
 * Sets the isHighlighted property of the searched element to true (if it already wasn't).
 *
 * @param {Object} elements - current state of elements in the store
 * @param {String} elementGuid - GUID of the canvas element to be highlighted
 * @returns {Object} new state of elements after reduction
 * @private
 */
function _highlightCanvasElement(elements, elementGuid) {
    const newState = updateProperties(elements);
    const element = newState[elementGuid];
    if (element && element.isCanvasElement && element.config && !element.config.isHighlighted) {
        newState[elementGuid] = updateProperties(element, {
            config: {
                isSelected: element.config.isSelected,
                isHighlighted: true
            }
        });
    }
    return newState;
}

/**
 * Sets the isHighlighted property of the searched element to false (if it already wasn't).
 *
 * @param {Object} elements - current state of elements in the store
 * @param {String} elementGuid - GUID of the canvas element to be unhighlighted
 * @returns {Object} new state of elements after reduction
 * @private
 */
function _unhighlightCanvasElement(elements, elementGuid) {
    const newState = updateProperties(elements);
    const element = newState[elementGuid];
    if (element && element.isCanvasElement && element.config && element.config.isHighlighted) {
        newState[elementGuid] = updateProperties(element, {
            config: {
                isSelected: element.config.isSelected,
                isHighlighted: false
            }
        });
    }
    return newState;
}

/**
 * Helper function to add or update a screenFields
 *
 * @param {Object} state - current state of elements in the store
 * @param {Object} screen - the screen being added/modified
 * @param {Object[]} deletedFields - All screenFields being deleted.
 * @param {Object[]} fields - All screenFields in the updated screen state (does not include deleted screenFields)
 *
 * @return {Object} new state after reduction
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