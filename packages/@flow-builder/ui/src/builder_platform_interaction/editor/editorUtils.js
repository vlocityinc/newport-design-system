import { usedBy, invokeUsedByAlertModal } from 'builder_platform_interaction/usedByLib';
import { drawingLibInstance as lib } from 'builder_platform_interaction/drawingLib';
import { deleteElement, updatePropertiesAfterSaving, updateProperties } from 'builder_platform_interaction/actions';
import { canvasSelector } from 'builder_platform_interaction/selectors';
import { SaveType } from 'builder_platform_interaction/saveType';
import { SaveFlowEvent } from 'builder_platform_interaction/events';
import { getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { setRules, setOperators } from 'builder_platform_interaction/ruleLib';
import { setResourceTypes } from 'builder_platform_interaction/dataTypeLib';
import { setEntities, setEventTypes } from 'builder_platform_interaction/sobjectLib';
import { setGlobalVariables, setSystemVariables, setProcessTypes } from 'builder_platform_interaction/systemLib';
import { getFlowSystemVariableComboboxItem, getGlobalVariableTypeComboboxItems } from 'builder_platform_interaction/expressionUtils';
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';

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
export const getElementsToBeDeleted = (storeInstance, { selectedElementGUID, selectedElementType }) => {
    const isMultiElementDelete = !selectedElementGUID;
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
        canvasElementGuidsToDelete = [...selectedElementGUID];
        connectorsToDelete = connectorsToBeDeleted(canvasElementGuidsToDelete, connectors);
    }
    doDeleteOrInvokeAlert(storeInstance, canvasElementGuidsToDelete, connectorsToDelete, elementType);
};

/**
 * This function is used to figure save type which is used to figure out if a modal should be displayed or not while saving a flow
 * @param {String} eventType There are 2 save event type: save and save as
 * @param {String} flowId It will be undefined if it is a brand new flow
 * @param {Boolean} canOnlySaveAsNewDefinition It is needed to handle use case for flow template. They can only be saved as new flow
 */
export const getSaveType = (eventType, flowId, canOnlySaveAsNewDefinition) => {
    if (!eventType) {
        throw new Error('Event type for saving a flow is not defined');
    }
    if (eventType === SaveFlowEvent.Type.SAVE && flowId) {
        return SaveType.UPDATE;
    }
    if (eventType === SaveFlowEvent.Type.SAVE) {
        return SaveType.CREATE;
    }
    if (eventType === SaveFlowEvent.Type.SAVE_AS && canOnlySaveAsNewDefinition) {
        return SaveType.NEW_DEFINITION;
    }
    return SaveType.NEW_VERSION;
};

export const updateStoreAfterSaveFlowIsSuccessful = (storeInstance, {versionNumber, status, lastModifiedDate, lastModifiedBy}) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    storeInstance.dispatch(updatePropertiesAfterSaving({
        versionNumber,
        status,
        lastModifiedDate,
        isLightningFlowBuilder: true,
        lastModifiedBy,
        canOnlySaveAsNewDefinition: false
    }));
};

export const updateStoreAfterSaveAsNewFlowIsFailed = (storeInstance) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    storeInstance.dispatch(updateProperties({
        versionNumber: null,
        status: null,
        lastModifiedDate: null,
        isLightningFlowBuilder: true,
        lastModifiedBy: null,
        canOnlySaveAsNewDefinition: false
    }));
};

export const updateStoreAfterSaveAsNewVersionIsFailed = (storeInstance, label, description, interviewLabel) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    storeInstance.dispatch(updateProperties({
        label,
        description,
        interviewLabel
    }));
};

export const updateUrl = (flowId) => {
    let urlParams = '';
    if (flowId) {
        urlParams += '?flowId=' + flowId;
    }
    window.history.pushState(null, 'Flow Builder', window.location.href.split('?')[0] + urlParams);
};

export const setFlowErrorsAndWarnings = ({errors = {}, warnings = {}}) => {
    return {
        errors,
        warnings
    };
};

/**
 * It return another function which will have closure on store instance. The returned function will be executed when user clicks okay on flow property editor.
 * @param {Object} storeInstance Instance of client side store
 */
export const flowPropertiesCallback = (storeInstance) => (flowProperties) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    const properties = getElementForStore(flowProperties);
    storeInstance.dispatch(updateProperties(properties));
};

/**
 * It return another function which will be called when a user clicks okay on save as modal
 * @param {Object} storeInstance instance of the client side store
 * @param {Function} saveFlowFn function which make server call to save the flow
 */
export const saveAsFlowCallback = (storeInstance, saveFlowFn) => (flowProperties) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    if (!saveFlowFn) {
        throw new Error('Save flow function is not defined');
    }
    const { saveType } = flowProperties;
    flowPropertiesCallback(storeInstance)(flowProperties);
    if (saveType !== SaveType.UPDATE) {
        saveFlowFn(saveType);
    }
};

const setGlobalVariableAndUpdateCache = (globalVariables) => {
    setGlobalVariables(globalVariables);
    getGlobalVariableTypeComboboxItems().forEach(item => {
        addToParentElementCache(item.displayText, item);
    });
};

const setSystemVariableAndUpdateCache = (systemVariables) => {
    const item = getFlowSystemVariableComboboxItem();
    // system variables are treated like sobjects in the menu data so this category is a "parent element" as well
    addToParentElementCache(item.displayText, item);
    setSystemVariables(systemVariables);
};

export const setPeripheralDataForPropertyEditor = ({rules, operators, resourceTypes, eventTypes, processTypes, globalVariables, systemVariables, entities}) => {
    setRules(rules);
    setOperators(operators);
    setResourceTypes(resourceTypes);
    setEventTypes(eventTypes);
    setProcessTypes(processTypes);
    setGlobalVariableAndUpdateCache(globalVariables);
    setSystemVariableAndUpdateCache(systemVariables);
    setEntities(entities);
};