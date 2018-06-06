import {
    UPDATE_FLOW,
    DELETE_CANVAS_ELEMENT,
    ADD_CONNECTOR,
    SELECT_ON_CANVAS,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    MODIFY_DECISION_WITH_OUTCOMES
} from 'builder_platform_interaction-actions';
import { addItem, updateProperties, replaceItem} from 'builder_platform_interaction-data-mutation-lib';

/**
 * Reducer for canvas element.
 *
 * @param {Array} state - canvas element array in the store
 * @param {Object} action - with type and payload
 * @return {Array} new state after reduction
 */
export default function connectorsReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW: return [...action.payload.connectors];
        case DELETE_CANVAS_ELEMENT: return _deleteConnectors(state, action.payload.connectorGUIDs);
        case ADD_CONNECTOR: return addItem(state, action.payload);
        case SELECT_ON_CANVAS: return _selectConnector(state, action.payload.guid);
        case TOGGLE_ON_CANVAS: return _toggleConnector(state, action.payload.guid);
        case DESELECT_ON_CANVAS: return _deselectConnectors(state);
        case MODIFY_DECISION_WITH_OUTCOMES: return _deleteConnectorsForChildElements(state, action.payload.deletedOutcomes);
        default: return state;
    }
}

/**
 * Helper function to delete all selected and associated connectors.
 *
 * @param {Array} connectors - current state of connectors in the store
 * @param {Array} connectorGUIDs - contains GUIDs of all selcted and associated connectors
 * @return {Array} new state of connectors after reduction
 * @private
 */
function _deleteConnectors(connectors, connectorGUIDs) {
    let newState = connectors;
    if (connectorGUIDs && connectorGUIDs.length > 0) {
        newState = connectors.filter((connector) => {
            return (connectorGUIDs.indexOf(connector.guid) === -1);
        });
    }
    return newState;
}

/**
 * Delete connectors for all of the given child elements
 *
 * @param {Array} connectors   current state of connectors in the store
 * @param {Array} elements     array of child elements (outcomes or wait events) whose connectors are to be deleted
 *
 * @return {Array} new state of connectors after reduction
 * @private
 */
function _deleteConnectorsForChildElements(connectors, elements) {
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // Keep in the connector list only if the connector does not have a child source,
        // OR if child source exists and it does not match the element's guid
        connectors = connectors.filter(connector => {
            return !connector.childSource || connector.childSource !== element.guid;
        });
    }

    return connectors;
}

/**
 * Helper function to select a connectors. Iterates over all the connectors and sets the isSelected property for
 * the selected connector to true. Also sets the isSelected property for all other connectors to false.
 *
 * @param {Array} connectors - current state of connectors in the store
 * @param {String} selectedGUID - GUID of the connector to be selected
 * @return {Array} new state of connectors after reduction
 * @private
 */
function _selectConnector(connectors, selectedGUID) {
    return connectors.map((connector) => {
        if (connector.guid === selectedGUID) {
            if (!connector.config.isSelected) {
                return updateProperties(connector, {
                    config: {
                        isSelected: true
                    }
                });
            }
        } else if (connector.config.isSelected) {
            return updateProperties(connector, {
                config: {
                    isSelected: false
                }
            });
        }
        return connector;
    });
}

/**
 * Helper function to toggle the isSelected state of a connector.
 *
 * @param {Array} connectors - current state of connectors in the store
 * @param {String} selectedGUID - GUID of the connector to be toggled
 * @return {Array} new state of connectors after reduction
 * @private
 */
function _toggleConnector(connectors, selectedGUID) {
    const index = connectors.findIndex(connector => (connector.guid === selectedGUID));
    if (index !== -1) {
        const newConnector = updateProperties(connectors[index], {
            config: {
                isSelected: !connectors[index].config.isSelected
            }
        });
        return replaceItem(connectors, newConnector, index);
    }
    return connectors;
}

/**
 * Helper function to deselect all the selected connectors. Iterates over all the connectors and sets the
 * isSelected property of all the currently selected connectors to false.
 *
 * @param {Array} connectors - current state of connectors in the store
 * @return {Array} new state of connectors after reduction
 * @private
 */
function _deselectConnectors(connectors) {
    return connectors.map((connector) => {
        if (connector.config.isSelected) {
            return updateProperties(connector, {
                config: {
                    isSelected: false
                }
            });
        }
        return connector;
    });
}