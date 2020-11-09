// @ts-nocheck
import { CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ChildReference, Guid } from 'builder_platform_interaction/flowModel';

/**
 * Helper function to get an array of all child references that have connectors associated with them
 * (i.e. they are not present in the original availableConnections) and have not been deleted.
 *
 * @param {Object[]} flatOriginalAvailableConnections - Array containing child references of the available connections
 * along with available "Default" and "Fault" types
 * @param {Object[]} originalChildReferences - Original elements childReferences array (eg: decision.childReferences)
 * @param {Object[]} deletedChildElementGuids - Guids of all the child elements that have been deleted
 * @returns {Object[]} usedChildReferences - child references that have an associated connector and have not been deleted
 * @private
 */
function _getChildReferencesWithAssociatedConnectors(
    flatOriginalAvailableConnections = [],
    originalChildReferences = [],
    deletedChildElementGuids = []
) {
    const usedChildReferences = [];
    for (let i = 0; i < originalChildReferences.length; i++) {
        if (
            !flatOriginalAvailableConnections.includes(originalChildReferences[i].childReference) &&
            !deletedChildElementGuids.includes(originalChildReferences[i].childReference)
        ) {
            usedChildReferences.push(originalChildReferences[i].childReference);
        }
    }

    return usedChildReferences;
}

/**
 * Helper function to get all the available connections associated with the 'free' child references
 *
 * @param {Object[]} newChildReferences - Child References Array for the updated element state (eg: decision.childReferences)
 * @param {Object[]} usedChildReferences - child references that have an associated connector and have not been deleted
 * @returns {Object[]} childAvailableConnections - availableConnections associated with the 'free' childReferences
 * @private
 */
function _getAvailableConnectionsContainingChildReferences(newChildReferences = [], usedChildReferences = []) {
    const childAvailableConnections = [];
    for (let i = 0; i < newChildReferences.length; i++) {
        const reference = newChildReferences[i].childReference;
        if (!usedChildReferences.includes(reference)) {
            childAvailableConnections.push({
                childReference: reference,
                type: CONNECTOR_TYPE.REGULAR
            });
        }
    }

    return childAvailableConnections;
}

/**
 * Helper function to check for the Default and Fault available connections. Editing an element doesn't have any affect
 * on the availability of Default/Fault Connection. If the Default/Fault Connection wasn't available in the original element,
 * then increment the connector count. For Fault connection, increment the count only if it's a Wait element. The logic for
 * Fault connection is handled in the wait factory itself.
 *
 * @param {Object[]} flatOriginalAvailableConnections - Array containing child references of the available connections
 * along with available "Default" and "Fault" types
 * @returns {{additionalConnectorCount: number, defaultAvailableConnection: Array, addFaultConnection: Boolean}} - Any additional connector
 * count, available connection corresponding to Default Connection and addFaultConnection to track if we need to add Fault Connection
 */
function _calculateForDefaultAndFaultAvailableConnections(flatOriginalAvailableConnections = []) {
    let additionalConnectorCount = 0;
    const defaultAvailableConnection = [];

    if (flatOriginalAvailableConnections.includes(CONNECTOR_TYPE.DEFAULT)) {
        defaultAvailableConnection.push({ type: CONNECTOR_TYPE.DEFAULT });
    } else if (
        flatOriginalAvailableConnections.includes(CONNECTOR_TYPE.IMMEDIATE) ||
        flatOriginalAvailableConnections.includes(CONNECTOR_TYPE.REGULAR)
    ) {
        // Adding the Regular check to update the availableConnection type from Regular to Immediate
        // when switching to a start element that supports time triggers
        defaultAvailableConnection.push({ type: CONNECTOR_TYPE.IMMEDIATE });
    } else {
        additionalConnectorCount += 1;
    }

    let addFaultConnection = false;
    if (flatOriginalAvailableConnections.includes(CONNECTOR_TYPE.FAULT)) {
        addFaultConnection = true;
    }

    return {
        additionalConnectorCount,
        defaultAvailableConnection,
        addFaultConnection
    };
}

/**
 * Function to calculate the availableConnections, connectorCount and the deletedChildElementGuids of an edited or
 * a newly created Decision or Wait element.
 *
 * @param {Object} originalCanvasElement - original state of the canvas element
 * @param {Object[]} newChildReferences - Child References Array for the updated element state (eg: decision.childReferences)
 * @param {Object[]} deletedChildElementGuids - all the deleted child element guids (if any)
 * @returns {{connectorCount: Number, availableConnections: Object[]}} - availableConnections and connectorCount of the
 * updated element along with the deletedChildElementGuids
 */
export function getConnectionProperties(
    originalCanvasElement,
    newChildReferences: ChildReference[] = [],
    deletedChildElementGuids: Guid[] = []
) {
    let connectorCount = 0;
    let availableConnections = [];

    // This is required by the wait factory to add a Fault Connection to our availableConnections
    let addFaultConnectionForWaitElement = false;

    if (originalCanvasElement && originalCanvasElement.availableConnections && originalCanvasElement.childReferences) {
        const flatOriginalAvailableConnections = originalCanvasElement.availableConnections.map(
            (availableConnection) => availableConnection.childReference || availableConnection.type
        );
        const originalChildReferences = originalCanvasElement.childReferences;

        // Gets the childReferences that already have a connector associated. These should not be included in our availableConnections
        const usedChildReferences = _getChildReferencesWithAssociatedConnectors(
            flatOriginalAvailableConnections,
            originalChildReferences,
            deletedChildElementGuids
        );

        // Gets the availableConnections associated with any available childElements
        const childAvailableConnections = _getAvailableConnectionsContainingChildReferences(
            newChildReferences,
            usedChildReferences
        );

        // Gets any additionalConnectorCount and defaultAvailableConnection associated with the Default Connection along
        // with a boolean to indicate whether a Fault Connection needs to be added or not. The addition of the Fault Connection
        // or the increment in the connectorCount due to the unavailability of the Fault Connection is handle in the wait factory
        const {
            additionalConnectorCount,
            defaultAvailableConnection,
            addFaultConnection
        } = _calculateForDefaultAndFaultAvailableConnections(flatOriginalAvailableConnections);

        connectorCount = usedChildReferences.length + additionalConnectorCount;
        availableConnections = [...childAvailableConnections, ...defaultAvailableConnection];
        addFaultConnectionForWaitElement = addFaultConnection;
    }

    return {
        connectorCount,
        availableConnections,
        addFaultConnectionForWaitElement
    };
}
