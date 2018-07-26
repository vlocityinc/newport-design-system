import {
    UPDATE_FLOW,
    DELETE_ELEMENT,
    ADD_CONNECTOR,
    SELECT_ON_CANVAS,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    MODIFY_DECISION_WITH_OUTCOMES
} from 'builder_platform_interaction-actions';
import { addItem, updateProperties, replaceItem} from 'builder_platform_interaction-data-mutation-lib';
import { CONNECTOR_TYPE } from 'builder_platform_interaction-flow-metadata';

/**
 * Reducer for connectors.
 *
 * @param {Object[]} state - connector array in the store
 * @param {Object} action - with type and payload
 * @return {Object[]} new state after reduction
 */
export default function connectorsReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW: return [...action.payload.connectors];
        case DELETE_ELEMENT: return _deleteConnectors(state, action.payload.connectorsToDelete);
        case ADD_CONNECTOR: return addItem(state, action.payload);
        case SELECT_ON_CANVAS: return _selectConnector(state, action.payload.guid);
        case TOGGLE_ON_CANVAS: return _toggleConnector(state, action.payload.guid);
        case DESELECT_ON_CANVAS: return _deselectConnectors(state);
        case MODIFY_DECISION_WITH_OUTCOMES: return _deleteAndUpdateConnectorsForChildElements(
            state,
            action.payload.decision.guid,
            action.payload.decision.defaultConnectorLabel,
            action.payload.outcomes,
            action.payload.deletedOutcomes
        );
        default: return state;
    }
}

/**
 * Helper function to delete all selected and associated connectors.
 *
 * @param {Object[]} connectors - current state of connectors in the store
 * @param {Object[]} connectorsToDelete - contains all selected and associated connectors
 * @return {Object[]} new state of connectors after reduction
 * @private
 */
function _deleteConnectors(connectors, connectorsToDelete) {
    let newState = connectors;
    if (connectorsToDelete && connectorsToDelete.length > 0) {
        const connectorGUIDs = connectorsToDelete.map(deleteConnector => {
            return deleteConnector.guid;
        });
        newState = connectors.filter(connector => (connectorGUIDs.indexOf(connector.guid) === -1));
    }
    return newState;
}

/**
 * Update/delete connectors for all of the given child elements
 *
 * @param {Object[]} origConnectors   current state of connectors in the store
 * @param {String} decisionGuid    Guid of the decision element
 * @param {String} defaultConnectorLabel    Connector Label of the default connector
 * @param {Object[]} updatedElements     array of child elements (outcomes or wait events) whose connectors are to be
 * updated
 * @param {Object[]} deletedElements     array of child elements (outcomes or wait events) whose connectors are to be
 * deleted
 *
 * @return {Object[]} new state of connectors after reduction
 * @private
 */
function _deleteAndUpdateConnectorsForChildElements(origConnectors, decisionGuid, defaultConnectorLabel, updatedElements, deletedElements) {
    const deletedElementGuidMap = new Map();
    for (let i = 0; i < deletedElements.length; i++) {
        deletedElementGuidMap.set(deletedElements[i].guid, deletedElements[i]);
    }

    const updatedElementGuidMap = new Map();
    for (let i = 0; i < updatedElements.length; i++) {
        updatedElementGuidMap.set(updatedElements[i].guid, updatedElements[i]);
    }

    const connectors = [];

    for (let i = 0; i < origConnectors.length; i++) {
        const connector = origConnectors[i];

        const updatedElement = updatedElementGuidMap.get(connector.childSource);

        if (!connector.childSource) {
            let updatedConnector = connector;
            if (connector.type === CONNECTOR_TYPE.DEFAULT && connector.source === decisionGuid) {
                updatedConnector = updateProperties(connector, {
                    label: defaultConnectorLabel
                });
            }
            connectors.push(updatedConnector);
        } else if (updatedElement) {
            const updatedConnector = updateProperties(connector, {
                label: updatedElement.label
            });
            connectors.push(updatedConnector);
        } else if (!deletedElementGuidMap.has(connector.childSource)) {
            connectors.push(connector);
        }
    }

    return connectors;
}

/**
 * Helper function to select a connectors. Iterates over all the connectors and sets the isSelected property for
 * the selected connector to true. Also sets the isSelected property for all other connectors to false.
 *
 * @param {Object[]} connectors - current state of connectors in the store
 * @param {String} selectedGUID - GUID of the connector to be selected
 * @return {Object[]} new state of connectors after reduction
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
 * @param {Object[]} connectors - current state of connectors in the store
 * @param {String} selectedGUID - GUID of the connector to be toggled
 * @return {Object[]} new state of connectors after reduction
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
 * @param {Object[]} connectors - current state of connectors in the store
 * @return {Object[]} new state of connectors after reduction
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