// @ts-nocheck
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
    MODIFY_WAIT_WITH_WAIT_EVENTS,
    MODIFY_START_WITH_TIME_TRIGGERS,
    DECORATE_CANVAS,
    CLEAR_CANVAS_DECORATION,
    UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE
} from 'builder_platform_interaction/actions';
import { addItem, updateProperties, replaceItem } from 'builder_platform_interaction/dataMutationLib';
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
        case UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE:
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
        case MODIFY_START_WITH_TIME_TRIGGERS:
            return _deleteAndUpdateConnectorsForChildElements(
                state,
                action.payload.canvasElement.guid,
                action.payload.canvasElement.defaultConnectorLabel,
                action.payload.childElements,
                action.payload.deletedChildElementGuids
            );
        case DECORATE_CANVAS:
            return _highlightConnectors(
                _clearConnectorHighlights(_deselectConnectors(state)),
                action.payload.connectorsToHighlight
            );
        case CLEAR_CANVAS_DECORATION:
            return _clearConnectorHighlights(state);
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
    let newState = connectors.map((connector) => {
        // Deselect each connector to be duplicated (since the duplicated connectors will now be selected)
        if (connector.config && connector.config.isSelected) {
            return _updateConnectorConfig(connector, { isSelected: false });
        }
        return connector;
    });

    for (let i = 0; i < connectorsToDuplicate.length; i++) {
        const originalConnector = connectorsToDuplicate[i];
        const source = canvasElementGuidMap[originalConnector.source];
        const target = canvasElementGuidMap[originalConnector.target];
        const childSource = originalConnector.childSource && childElementGuidMap[originalConnector.childSource];
        const { label, type } = originalConnector;

        const duplicateConnector = createConnector(source, childSource, target, label, type, true);

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
        const connectorGUIDs = connectorsToDelete.map((deleteConnector) => {
            return deleteConnector.guid;
        });
        newState = connectors.filter((connector) => connectorGUIDs.indexOf(connector.guid) === -1);
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
            if (connector.type === CONNECTOR_TYPE.DEFAULT && connector.source === parentElementGuid) {
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
    const newState = connectors.map((connector) => {
        if (connector.guid === selectedGUID) {
            if (!connector.config.isSelected) {
                hasStateChanged = true;
                return _updateConnectorConfig(connector, {
                    isSelected: true
                });
            }
        } else if (connector.config.isSelected) {
            hasStateChanged = true;
            return _updateConnectorConfig(connector, {
                isSelected: false
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
    const index = connectors.findIndex((connector) => connector.guid === selectedGUID);
    if (index !== -1) {
        const newConnector = _updateConnectorConfig(connectors[index], {
            isSelected: !connectors[index].config.isSelected
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
    const newState = connectors.map((connector) => {
        if (connector.config.isSelected) {
            hasStateChanged = true;
            return _updateConnectorConfig(connector, {
                isSelected: false
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
    const newState = connectors.map((connector) => {
        if (guidsToSelect.includes(connector.guid)) {
            hasStateChanged = true;
            return _updateConnectorConfig(connector, {
                isSelected: true
            });
        } else if (guidsToDeselect.includes(connector.guid)) {
            hasStateChanged = true;
            return _updateConnectorConfig(connector, {
                isSelected: false
            });
        }
        return connector;
    });

    return hasStateChanged ? newState : connectors;
}

/**
 * Helper function to highlight connectors. Iterates over the connectorsToHighlight array
 * and sets the isHighlighted property of the corresponding connector in the store to true.
 *
 * @param connectors - current state of connectors in the store
 * @param connectorsToHighlight - Array of connectors to be highlighted
 */
function _highlightConnectors(connectors: object[], connectorsToHighlight: object[]) {
    let hasStateChanged = false;
    const newState = connectors.map((connector) => {
        // Check if the connector exists in the connectorsToHighlight list by matching source element and connector type,
        // and if a child source (like decision outcome) exists, match that as well
        const foundConnector = connectorsToHighlight.some((connectorToHighlight) => {
            return (
                connectorToHighlight.source === connector.source &&
                connectorToHighlight.type === connector.type &&
                (!connectorToHighlight.childSource || connectorToHighlight.childSource === connector.childSource)
            );
        });
        // Set the isHighlighted property of the connector to true if found in connectorsToHighlight list
        if (foundConnector && !connector.config.isHighlighted) {
            hasStateChanged = true;
            return _updateConnectorConfig(connector, {
                isHighlighted: true
            });
        }

        return connector;
    });

    return hasStateChanged ? newState : connectors;
}

/**
 * Helper function to clear highlighting on all connectors.
 *
 * @param connectors - current state of connectors in the store
 */
function _clearConnectorHighlights(connectors: object[]) {
    let hasStateChanged = false;
    const newState = connectors.map((connector) => {
        if (connector.config.isHighlighted) {
            hasStateChanged = true;
            return _updateConnectorConfig(connector, {
                isHighlighted: false
            });
        }
        return connector;
    });

    return hasStateChanged ? newState : connectors;
}

/**
 * Helper function to update properties in connector config
 */
function _updateConnectorConfig(connector: object, updatedConfig: object) {
    return updateProperties(connector, { config: updateProperties(connector.config, updatedConfig) });
}
