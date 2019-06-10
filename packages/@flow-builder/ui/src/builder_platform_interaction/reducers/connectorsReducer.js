import {
    UPDATE_FLOW,
    DO_DUPLICATE,
    DELETE_ELEMENT,
    ADD_CONNECTOR,
    SELECT_ON_CANVAS,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    MARQUEE_SELECT_ON_CANVAS,
    MODIFY_DECISION_WITH_OUTCOMES,
    MODIFY_WAIT_WITH_WAIT_EVENTS
} from 'builder_platform_interaction/actions';
import {
    addItem,
    updateProperties,
    replaceItem
} from 'builder_platform_interaction/dataMutationLib';
import { CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createConnector } from 'builder_platform_interaction/elementFactory';

/**
 * Reducer for connectors.
 *
 * @param {Object[]} state - connector array in the store
 * @param {Object} action - with type and payload
 * @return {Object[]} new state after reduction
 */
export default function connectorsReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW:
            return [...action.payload.connectors];
        case DO_DUPLICATE:
            return _duplicateConnector(
                state,
                action.payload.canvasElementGuidMap,
                action.payload.childElementGuidMap,
                action.payload.connectorsToDuplicate
            );
        case DELETE_ELEMENT:
            return _deleteConnectors(state, action.payload.connectorsToDelete);
        case ADD_CONNECTOR:
            return addItem(state, action.payload);
        case SELECT_ON_CANVAS:
            return _selectConnector(state, action.payload.guid);
        case TOGGLE_ON_CANVAS:
            return _toggleConnector(state, action.payload.guid);
        case DESELECT_ON_CANVAS:
            return _deselectConnectors(state);
        case MARQUEE_SELECT_ON_CANVAS:
            return _marqueeSelect(
                state,
                action.payload.connectorGuidsToSelect,
                action.payload.connectorGuidsToDeselect
            );
        case MODIFY_DECISION_WITH_OUTCOMES:
        case MODIFY_WAIT_WITH_WAIT_EVENTS:
            return _deleteAndUpdateConnectorsForChildElements(
                state,
                action.payload.canvasElement.guid,
                action.payload.canvasElement.defaultConnectorLabel,
                action.payload.childElements,
                action.payload.deletedChildElementGuids
            );
        default:
            return state;
    }
}

/**
 * Helper function to duplicate connectors.
 *
 * @param {Object[]} connectors - current state of connectors in the store
 * @param {Object[]} canvasElementGuidMap - Map of selected canvas elements guids to a newly generated guid that will be used as
 * the guid for the duplicate element
 * @param {Object[]} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 * @param {Object[]} connectorsToDuplicate - connectors selected for duplication
 *
 * @return {Object[]} new state of connectors after reduction
 * @private
 */
function _duplicateConnector(
    connectors,
    canvasElementGuidMap = {},
    childElementGuidMap = {},
    connectorsToDuplicate = []
) {
    let newState = connectors.map(connector => {
        // Deselect each connector to be duplicated (since the duplicated connectors will now be selected)
        if (connector.config && connector.config.isSelected) {
            return Object.assign({}, connector, {
                config: {
                    isSelected: false
                }
            });
        }
        return connector;
    });

    for (let i = 0; i < connectorsToDuplicate.length; i++) {
        const originalConnector = connectorsToDuplicate[i];
        const source = canvasElementGuidMap[originalConnector.source];
        const target = canvasElementGuidMap[originalConnector.target];
        const childSource =
            originalConnector.childSource &&
            childElementGuidMap[originalConnector.childSource];
        const { label, type } = originalConnector;

        const duplicateConnector = createConnector(
            source,
            childSource,
            target,
            label,
            type,
            true
        );

        newState = addItem(newState, duplicateConnector);
    }

    return newState;
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
        newState = connectors.filter(
            connector => connectorGUIDs.indexOf(connector.guid) === -1
        );
    }
    return newState;
}

/**
 * Update/delete connectors for all of the given child elements
 *
 * @param {Object[]} origConnectors   current state of connectors in the store
 * @param {String} parentElementGuid    Guid of the parent element (e.g. decision, wait)
 * @param {String} defaultConnectorLabel    Connector Label of the default connector
 * @param {Object[]} updatedElements     array of child elements (outcomes or wait events) whose connectors are to be
 * updated
 * @param {Object[]} deletedChildElementGuids     array of guids of child elements (outcomes or wait events) whose connectors are to be
 * deleted
 *
 * @return {Object[]} new state of connectors after reduction
 * @private
 */
function _deleteAndUpdateConnectorsForChildElements(
    origConnectors,
    parentElementGuid,
    defaultConnectorLabel,
    updatedElements,
    deletedChildElementGuids
) {
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
            if (
                connector.type === CONNECTOR_TYPE.DEFAULT &&
                connector.source === parentElementGuid
            ) {
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
        } else if (!deletedChildElementGuids.includes(connector.childSource)) {
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
    let hasStateChanged = false;
    const newState = connectors.map(connector => {
        if (connector.guid === selectedGUID) {
            if (!connector.config.isSelected) {
                hasStateChanged = true;
                return updateProperties(connector, {
                    config: {
                        isSelected: true
                    }
                });
            }
        } else if (connector.config.isSelected) {
            hasStateChanged = true;
            return updateProperties(connector, {
                config: {
                    isSelected: false
                }
            });
        }
        return connector;
    });

    return hasStateChanged ? newState : connectors;
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
    const index = connectors.findIndex(
        connector => connector.guid === selectedGUID
    );
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
    let hasStateChanged = false;
    const newState = connectors.map(connector => {
        if (connector.config.isSelected) {
            hasStateChanged = true;
            return updateProperties(connector, {
                config: {
                    isSelected: false
                }
            });
        }
        return connector;
    });

    return hasStateChanged ? newState : connectors;
}

/**
 * Helper function to marquee select connectors. Iterates over the guidsToSelect/guidsToDeselect array
 * and sets the isSelected property of the connector to true/false.
 *
 * @param {Object[]} connectors - current state of connectors in the store
 * @param {String[]} guidsToSelect - Array of connector guids to be selected
 * @param {String[]} guidsToDeselect - Array of connector guids to be deselected
 */
function _marqueeSelect(connectors, guidsToSelect, guidsToDeselect) {
    let hasStateChanged = false;
    const newState = connectors.map(connector => {
        if (guidsToSelect.includes(connector.guid)) {
            hasStateChanged = true;
            return updateProperties(connector, {
                config: {
                    isSelected: true
                }
            });
        } else if (guidsToDeselect.includes(connector.guid)) {
            hasStateChanged = true;
            return updateProperties(connector, {
                config: {
                    isSelected: false
                }
            });
        }
        return connector;
    });

    return hasStateChanged ? newState : connectors;
}
