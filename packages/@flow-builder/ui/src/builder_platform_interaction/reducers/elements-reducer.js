import {
    UPDATE_FLOW,
    ADD_CANVAS_ELEMENT,
    UPDATE_CANVAS_ELEMENT,
    DELETE_CANVAS_ELEMENT,
    ADD_CONNECTOR,
    ADD_VARIABLE,
    UPDATE_VARIABLE,
    DELETE_VARIABLE,
    SELECT_ON_CANVAS,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    ADD_DECISION_WITH_OUTCOMES,
    MODIFY_DECISION_WITH_OUTCOMES
} from 'builder_platform_interaction-actions';
import {deepCopy} from 'builder_platform_interaction-store-lib';
import {updateProperties, omit} from 'builder_platform_interaction-data-mutation-lib';

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
        case ADD_VARIABLE:
        case UPDATE_CANVAS_ELEMENT:
        case UPDATE_VARIABLE:
            return _addOrUpdateElement(state, action.payload.guid, action.payload);
        case DELETE_CANVAS_ELEMENT:
            return _deleteElementAndDecrementCount(state, action.payload.selectedCanvasElementGUIDs, action.payload.canvasElementsToUpdate);
        case ADD_CONNECTOR:
            return _incrementConnectorCount(state, action.payload.source);
        case DELETE_VARIABLE:
            return omit(state, [action.payload.guid]);
        case SELECT_ON_CANVAS:
            return _selectCanvasElement(state, action.payload.guid);
        case TOGGLE_ON_CANVAS:
            return _toggleCanvasElement(state, action.payload.guid);
        case DESELECT_ON_CANVAS:
            return _deselectCanvasElements(state);
        case ADD_DECISION_WITH_OUTCOMES:
        case MODIFY_DECISION_WITH_OUTCOMES:
            return _addOrUpdateDecisionWithOutcomes(state, action.payload.decision, action.payload.deletedOutcomes, action.payload.outcomes);
        default:
            return state;
    }
}

/**
 * Helper function to add or update a decision
 *
 * @param {Object} state - current state of elements in the store
 * @param {Object} decision - the decision being added/modified
 * @param {Array} deletedOutcomes - All outcomes being deleted
 * @param {Array} outcomes - All outcomes being added/modified
 * @return {Object} new state after reduction
 * @private
 */
function _addOrUpdateDecisionWithOutcomes(state, decision, deletedOutcomes, outcomes) {
    let newState = updateProperties(state);
    newState[decision.guid] = updateProperties(newState[decision.guid], decision);

    outcomes.forEach((outcome) => {
        newState[outcome.guid] = updateProperties(newState[outcome.guid], outcome);
    });

    // TODO handle connectors when deleting outcomes.  Also handling decision max connectors
    // when adding outcomes
    // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000004uM1nIAE/view
    const deletedOutcomeGUIDs = deletedOutcomes.map((outcome) => {
        return outcome.guid.value;
    });

    newState = omit(newState, deletedOutcomeGUIDs);

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
 * Helper function to delete all selected canvas elements and to update the affected canvas elements with the new connector count
 *
 * @param {Object} elements - current state of elements in the store
 * @param {Array} deleteGUIDs - GUIDs of canvas elements that need to be deleted
 * @param {Array} decrementGUIDs - GUIDs of all the canvas elements for which the connector count needs to decrement
 * @returns {Object} new state after reduction
 * @private
 */
function _deleteElementAndDecrementCount(elements, deleteGUIDs, decrementGUIDs) {
    const newState = omit(elements, deleteGUIDs);
    decrementGUIDs.forEach((guid) => {
        if (newState[guid] && newState[guid].connectorCount) {
            const connectorCount = newState[guid].connectorCount - 1;
            newState[guid] = updateProperties(newState[guid], {connectorCount});
        }
    });
    return newState;
}

/**
 * Helper function to increment the connector count of a given canvas element when a new connection has been added
 *
 * @param {Object} elements - current state of elements in the store
 * @param {String} sourceGUID - GUID of the canvas element for which the connector count needs to increment
 * @returns {Object} new state after reduction
 * @private
 */
function _incrementConnectorCount(elements, sourceGUID) {
    const newState = updateProperties(elements);
    const connectorCount = newState[sourceGUID].connectorCount + 1;
    newState[sourceGUID] = updateProperties(newState[sourceGUID], {connectorCount});
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
                            isSelected: true
                        }
                    });
                }
            } else if (element.config.isSelected) {
                newState[guid] = updateProperties(element, {
                    config: {
                        isSelected: false
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
                isSelected: !element.config.isSelected
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
                        isSelected: false
                    }
                });
            }
        }
        return guid;
    });
    return newState;
}