import { UPDATE_FLOW, DELETE_CANVAS_ELEMENT, ADD_CONNECTOR, SELECT_ON_CANVAS, TOGGLE_ON_CANVAS, DESELECT_ON_CANVAS } from 'builder_platform_interaction-actions';
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
        default: return state;
    }
}

/**
 * Helper function to delete all selected and associated connectors.
 *
 * @param {Array} connectors - current state of connectors in the store
 * @param {Array} connectorGUIDs - contains GUIDs of all selected and associated connectors
 * @return {Array} new state of connectors after reduction
 * @private
 */
function _deleteConnectors(connectors, connectorGUIDs) {
    let newState = connectors;
    if (connectorGUIDs && connectorGUIDs.length > 0) {
        newState = connectors.filter(connector => (connectorGUIDs.indexOf(connector.guid) === -1));
    }
    return newState;
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