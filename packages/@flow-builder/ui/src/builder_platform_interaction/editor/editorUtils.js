import { usedBy, invokeUsedByAlertModal } from 'builder_platform_interaction/usedByLib';
import { drawingLibInstance as lib } from 'builder_platform_interaction/drawingLib';
import { deleteElement } from 'builder_platform_interaction/actions';
import { canvasSelector } from 'builder_platform_interaction/selectors';

/**
 * Helper method to delete the selected elements
 *
 * @param {Object} storeInstance instance of the store
 * @param {String[]} selectedElementGUIDs - Contains GUIDs of all the selected canvas elements
 * @param {String[]} connectorsToDelete - Contains all the selected and associated connectors that need to be deleted
 * @param {String} elementType - Type of the element being deleted
 */
const doDelete = (storeInstance, selectedElementGUIDs, connectorsToDelete, elementType) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    const selectedElementsLength  = selectedElementGUIDs.length;
    for (let i = 0; i < selectedElementsLength; i++) {
        const selectedGUID = selectedElementGUIDs[i];
        lib.removeNodeFromLib(selectedGUID);
    }

    const payload = {
        selectedElementGUIDs,
        connectorsToDelete,
        elementType
    };
    storeInstance.dispatch(deleteElement(payload));
};

/**
 * Helper method to determine if the connector is an associated connector or not
 *
 * @param {String[]} selectedElementGUIDs - Contains GUIDs of all the selected canvas elements
 * @param {Object} connector - A single connector object
 * @return {boolean} returns boolean based on if the connector is associated with any canvas element that is being deleted or not
 */
const isAssociatedConnector = (selectedElementGUIDs, connector) => {
    return (selectedElementGUIDs.indexOf(connector.target) !== -1 || selectedElementGUIDs.indexOf(connector.source) !== -1);
};

/**
 * This function returns list of connectors to be deleted
 * @param {Array} selectedElementGUIDs Array of guids selected elements
 * @param {Array} connectors Array of connectors
 * @param {Boolean} includeSelectedConnector config to include selected connectors or not
 * @return {Array} Array of connectors to be deleted
 */
const connectorsToBeDeleted = (selectedElementGUIDs = [], connectors = [], includeSelectedConnector = false) => {
    return connectors.filter((connector) => {
        return (includeSelectedConnector && connector.config.isSelected) || (isAssociatedConnector(selectedElementGUIDs, connector));
    });
};

/**
 * This function returns an array of guids of selected elements
 * @param {Array} canvasElements list of canvas element
 * @return {Array} array of guids of selected elements
 */
const selectedCanvasElementGuids = (canvasElements = []) => {
    return canvasElements.filter((canvasElement) => {
        return canvasElement.config && canvasElement.config.isSelected;
    }).map((canvasElement) => {
        return canvasElement.guid;
    });
};

/**
 * Helper method to delete the selected elements or invoke delete alert modal
 *
 * @param {Object} storeInstance instance of the store
 * @param {String[]} selectedElementGUIDs - Contains GUIDs of all the selected canvas elements
 * @param {String[]} connectorsToDelete - Contains all the selected and associated connectors that need to be deleted
 * @param {String} elementType - Type of the element being deleted
 */
const doDeleteOrInvokeAlert = (storeInstance, selectedElementGUIDs, connectorsToDelete, elementType) => {
    const currentState = storeInstance.getCurrentState();
    const storeElements = currentState.elements;

    const usedByElements = usedBy(selectedElementGUIDs, storeElements);

    if (!usedByElements || usedByElements.length === 0) {
        // Deleting the elements that are not being referenced anywhere else
        doDelete(storeInstance, selectedElementGUIDs, connectorsToDelete, elementType);
    } else {
        // Handling cases when the element/elements being deleted are being referenced somewhere in the flow
        invokeUsedByAlertModal(usedByElements, selectedElementGUIDs, elementType, storeElements);
    }
};

/**
 * This function deletes an element if it is not referenced else open used by modal
 * @param {Object} storeInstance instance of the store
 * @param {Object} containing selected Element GUID and type
 */
export const getElementsToBeDeleted = (storeInstance, { selectedElementGuid, selectedElementType }) => {
    const isMultiElementDelete = !selectedElementGuid;
    let canvasElementGuidsToDelete = [];
    let connectorsToDelete = [];
    const currentState = storeInstance.getCurrentState();
    const connectors = currentState.connectors;
    const elementType = selectedElementType;

    if (isMultiElementDelete) {
        const canvasElements = canvasSelector(currentState);
        canvasElementGuidsToDelete = selectedCanvasElementGuids(canvasElements);
        connectorsToDelete = connectorsToBeDeleted(canvasElementGuidsToDelete, connectors, true);
    } else {
        canvasElementGuidsToDelete = [...selectedElementGuid];
        connectorsToDelete = connectorsToBeDeleted(canvasElementGuidsToDelete, connectors);
    }
    doDeleteOrInvokeAlert(storeInstance, canvasElementGuidsToDelete, connectorsToDelete, elementType);
};