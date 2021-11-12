// @ts-nocheck
import { usedBy, invokeUsedByAlertModal } from 'builder_platform_interaction/usedByLib';
import {
    deleteElements,
    updatePropertiesAfterSaving,
    updateProperties,
    updatePropertiesAfterSaveFailed,
    highlightOnCanvas,
    addElement,
    updateElement,
    decorateCanvas,
    clearCanvasDecoration
} from 'builder_platform_interaction/actions';
import { createVariable } from 'builder_platform_interaction/elementFactory';
import { canvasSelector } from 'builder_platform_interaction/selectors';
import { SaveType } from 'builder_platform_interaction/saveType';
import { DeleteElementEventDetail, SaveFlowEvent } from 'builder_platform_interaction/events';
import { getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { isConfigurableStartSupported } from 'builder_platform_interaction/processTypeLib';
import { generateGuid, Store } from 'builder_platform_interaction/storeLib';
import {
    ELEMENT_TYPE,
    FLOW_TRIGGER_TYPE,
    CONNECTOR_TYPE,
    DECORATION_TYPE,
    METADATA_KEY,
    FlowScreenFieldType
} from 'builder_platform_interaction/flowMetadata';
import {
    getConfigForElementType,
    updateElementConfigMapWithSubtypes
} from 'builder_platform_interaction/elementConfig';
import { getPropertyOrDefaultToTrue } from 'builder_platform_interaction/commonUtils';
import {
    baseCanvasElement,
    createStartElementWhenUpdatingFromPropertyEditor as createBasicStartElement,
    getConnectionProperties,
    shouldSupportScheduledPaths
} from 'builder_platform_interaction/elementFactory';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import {
    canUserVAD,
    orgHasFlowBuilderGuardrails,
    CLASSIC_EXPERIENCE,
    getPreferredExperience
} from 'builder_platform_interaction/contextLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { getElementSections } from 'builder_platform_interaction/editorElementsUtils';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { getElementByDevName, getStartElement } from 'builder_platform_interaction/storeUtils';
import { sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import { hasGoToOnNext } from 'builder_platform_interaction/autoLayoutCanvas';

const LEFT_PANEL_ELEMENTS = 'LEFT_PANEL_ELEMENTS';
const { logPerfTransactionStart, logPerfTransactionEnd, logInteraction } = loggingUtils;
/**
 * Helper method to determine if the connector is an associated connector or not
 *
 * @param {string[]} selectedElementGUIDs - Contains GUIDs of all the selected canvas elements
 * @param {Object} connector - A single connector object
 * @returns {boolean} returns boolean based on if the connector is associated with any canvas element that is being deleted or not
 */
const isAssociatedConnector = (selectedElementGUIDs, connector) => {
    return (
        selectedElementGUIDs.indexOf(connector.target) !== -1 || selectedElementGUIDs.indexOf(connector.source) !== -1
    );
};

/**
 * This function returns list of connectors to be deleted
 *
 * @param {Array} selectedElementGUIDs Array of guids selected elements
 * @param {Array} connectors Array of connectors
 * @param {boolean} includeSelectedConnector config to include selected connectors or not
 * @returns {Array} Array of connectors to be deleted
 */
const connectorsToBeDeleted = (selectedElementGUIDs = [], connectors = [], includeSelectedConnector = false) => {
    return connectors.filter((connector) => {
        return (
            (includeSelectedConnector && connector.config.isSelected) ||
            isAssociatedConnector(selectedElementGUIDs, connector)
        );
    });
};

/**
 * This function returns an array of guids of selected elements
 *
 * @param {Array} canvasElements list of canvas element
 * @returns {Array} array of guids of selected elements
 */
const selectedCanvasElementGuids = (canvasElements = []) => {
    return canvasElements
        .filter((canvasElement) => {
            return canvasElement.config && canvasElement.config.isSelected;
        })
        .map((canvasElement) => {
            return canvasElement.guid;
        });
};

/**
 * This function returns an array of deletable canvas elements
 *
 * @param {Array} canvasElements list of canvas elements
 * @returns {Array} array of deletable canvas elements
 */
const deletableCanvasElements = (canvasElements = []) => {
    return canvasElements.filter((canvasElement) => {
        return getPropertyOrDefaultToTrue(getConfigForElementType(canvasElement.elementType), 'isDeletable');
    });
};

/**
 * Helper method to delete the selected elements or invoke delete alert modal
 *
 * @param storeInstance instance of the store
 * @param selectedElementGUIDs - Contains GUIDs of all the selected canvas elements
 * @param connectorsToDelete - Contains all the selected and associated connectors that need to be deleted
 * @param elementType - Type of the element being deleted
 * @param childIndexToKeep - The child branch you want to persist when deleting a branch element in Auto-Layout Canvas
 * @param parentGUID
 */
const doDeleteOrInvokeAlert = (
    storeInstance: Store,
    selectedElementGUIDs: UI.Guid[],
    connectorsToDelete: Object[],
    elementType: UI.ElementType,
    childIndexToKeep?: number,
    parentGUID?: UI.Guid
) => {
    const currentState = storeInstance.getCurrentState();
    const storeElements = currentState.elements;

    const usedByElements = usedBy(selectedElementGUIDs, currentState);
    const selectedElements = Object.values(storeElements).filter(
        (element) => selectedElementGUIDs.indexOf(element.guid) !== -1
    );

    const usedOnlyByParent: boolean = usedByElements.length === 1 && usedByElements[0].guid === parentGUID;

    if (!usedByElements || usedByElements.length === 0 || usedOnlyByParent) {
        // Deleting the elements that are not being referenced anywhere else
        storeInstance.dispatch(
            deleteElements({
                selectedElements,
                connectorsToDelete,
                elementType,
                childIndexToKeep,
                parentGUID
            })
        );
    } else {
        // Handling cases when the element/elements being deleted are being referenced somewhere in the flow
        invokeUsedByAlertModal(usedByElements, selectedElementGUIDs, elementType, storeElements);
    }
};

const resetStartElementIfNeeded = (storeInstance, processType, triggerType) => {
    const startElement = Object.values(storeInstance.getCurrentState().elements).find(
        (element) => element.elementType === ELEMENT_TYPE.START_ELEMENT
    );
    if (
        !isConfigurableStartSupported(processType) ||
        triggerType !== startElement.triggerType ||
        (triggerType && startElement.triggerType === FLOW_TRIGGER_TYPE.NONE)
    ) {
        let deletedChildElementGuids = [];
        if (startElement.childReferences) {
            deletedChildElementGuids = startElement.childReferences.map((element) => {
                return element.childReference;
            });
        }
        // Order is important here, since we are resetting the start element we need to remove all the scheduled paths/scheduled paths and reset the available connections and connector count so that we end up with a clean and saveable start element
        const newBaseCanvasElement = baseCanvasElement(startElement);
        const { connectorCount, availableConnections } = getConnectionProperties(
            startElement,
            [],
            deletedChildElementGuids
        );
        newBaseCanvasElement.availableConnections = availableConnections;
        newBaseCanvasElement.connectorCount = connectorCount;
        const newStartElement = createBasicStartElement({ ...newBaseCanvasElement, triggerType });
        newStartElement.deletedChildElementGuids = deletedChildElementGuids;
        storeInstance.dispatch(updateElement(newStartElement));
    }
};

/**
 * This function deletes an element if it is not referenced else open used by modal
 *
 * @param {Object} storeInstance instance of the store
 * @param {Object} containing selected Element GUID, type and childIndexToKeep (only when deleting a branch element in Auto-Layout Canvas)
 * @param containing.selectedElementGUID
 * @param containing.selectedElementType
 * @param containing.childIndexToKeep
 * @param containing.parentGUID
 */
export const getElementsToBeDeleted = (
    storeInstance: Store,
    { selectedElementGUID, selectedElementType, childIndexToKeep, parentGUID }: DeleteElementEventDetail
) => {
    const isMultiElementDelete = !selectedElementGUID;
    const currentState = storeInstance.getCurrentState();
    const connectors = currentState.connectors;

    const canvasElementGuidsToDelete = isMultiElementDelete
        ? selectedCanvasElementGuids(deletableCanvasElements(canvasSelector(currentState)))
        : [...selectedElementGUID];

    const connectorsToDelete = connectorsToBeDeleted(canvasElementGuidsToDelete, connectors, isMultiElementDelete);

    if (
        (canvasElementGuidsToDelete && canvasElementGuidsToDelete.length > 0) ||
        (connectorsToDelete && connectorsToDelete.length > 0)
    ) {
        doDeleteOrInvokeAlert(
            storeInstance,
            canvasElementGuidsToDelete,
            connectorsToDelete,
            selectedElementType,
            childIndexToKeep,
            parentGUID
        );
    }
};

/**
 * This method is used to figure save type which is used to figure out if a modal should be displayed or not while saving a flow
 *
 * @param {string} eventType There are 2 save event type: save and save as
 * @param {string} flowId It will be undefined if it is a brand new flow
 * @param {boolean} canOnlySaveAsNewDefinition It is needed to handle use case for flow template. They can only be saved as new flow
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
    if (
        (eventType === SaveFlowEvent.Type.SAVE_AS ||
            eventType === SaveFlowEvent.Type.SAVE_AS_OVERRIDDEN ||
            eventType === SaveFlowEvent.Type.SAVE_AS_TEMPLATE) &&
        canOnlySaveAsNewDefinition
    ) {
        return SaveType.NEW_DEFINITION;
    }
    return SaveType.NEW_VERSION;
};

export const updateStoreAfterSaveFlowIsSuccessful = (
    storeInstance,
    { versionNumber, status, lastModifiedDate, lastModifiedBy, fullName }
) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    storeInstance.dispatch(
        updatePropertiesAfterSaving({
            versionNumber,
            status,
            lastModifiedDate,
            isLightningFlowBuilder: true,
            lastModifiedBy,
            canOnlySaveAsNewDefinition: false,
            name: fullName
        })
    );
};

export const updateStoreAfterSaveAsNewFlowIsFailed = (storeInstance) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    storeInstance.dispatch(
        updatePropertiesAfterSaveFailed({
            versionNumber: null,
            status: null,
            lastModifiedDate: null,
            isLightningFlowBuilder: true,
            lastModifiedBy: null,
            canOnlySaveAsNewDefinition: false
        })
    );
};

export const updateStoreAfterSaveAsNewVersionIsFailed = (storeInstance, label, description, interviewLabel) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    storeInstance.dispatch(
        updateProperties({
            label,
            description,
            interviewLabel
        })
    );
};

export const updateUrl = (flowId) => {
    let urlParams = '';
    if (flowId) {
        urlParams += '?flowId=' + flowId;
    }
    window.history.pushState(null, 'Flow Builder', window.location.href.split('?')[0] + urlParams);
};

export const launchSubflow = (subflowVersionId) => {
    const baseUrl = '/builder_platform_interaction/flowBuilder.app?';
    const url =
        getPreferredExperience() === CLASSIC_EXPERIENCE
            ? baseUrl + 'isFromAloha=true&flowId=' + subflowVersionId
            : baseUrl + 'flowId=' + subflowVersionId;
    window.open(url);
};

export const setFlowErrorsAndWarnings = (data) => {
    const { errors = {}, warnings = {} } = data || {};
    return {
        errors,
        warnings
    };
};

/**
 * It return another function which will have closure on store instance. The returned function will be executed when user clicks okay on flow property editor.
 *
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
 *
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
    const { saveType, processType, triggerType } = flowProperties;
    flowPropertiesCallback(storeInstance)(flowProperties);
    resetStartElementIfNeeded(
        storeInstance,
        getValueFromHydratedItem(processType),
        getValueFromHydratedItem(triggerType)
    );
    saveFlowFn(saveType);
};

/**
 * Checks if the canvas element needs to be duplicated or not. We only need to duplicate canvas elements (excluding Step)
 * that are selected.
 *
 * @param {Object} canvasElement - canvas element being duplicated
 * @returns {boolean} Returns true if the canvas element should be duplicated
 */
const shouldDuplicateElement = (canvasElement) => {
    if (!canvasElement) {
        throw new Error('canvasElement is not defined');
    }

    if (!canvasElement.elementType) {
        throw new Error('element type is not defined');
    }

    const canBeDuplicated = getPropertyOrDefaultToTrue(
        getConfigForElementType(canvasElement.elementType),
        'canBeDuplicated'
    );

    return canvasElement.guid && canBeDuplicated && canvasElement.config && canvasElement.config.isSelected;
};

/**
 * Checks if a canvas element is selected
 *
 * @param {Object} canvasElement - canvas element being duplicated
 * @returns {boolean} Returns true if the canvas element is selected
 */
const isSelected = (canvasElement) => {
    if (!canvasElement) {
        throw new Error('canvasElement is not defined');
    }

    return canvasElement.config && canvasElement.config.isSelected;
};

/**
 * Checks if the canvas element being duplicated can have any child elements associated with it or not. Only Decision,
 * Screen and wait (Pause) element can have child elements.
 *
 * @param {Object} canvasElement - canvas element being duplicated
 * @returns {boolean} - Returns true if canvas element is Decision, Screen or Wait
 */
const hasChildElements = (canvasElement) => {
    if (!canvasElement) {
        throw new Error('canvasElement is not defined');
    }

    return canvasElement.elementType && getConfigForElementType(canvasElement.elementType).areChildElementsSupported;
};

/**
 * Helper function to get the bottom most cut or copied guid
 *
 * @param {Object} elementsInStore - State of the elements in store
 * @param {string} topCutOrCopiedGuid - Guid of the top-most cut or copied element
 * @returns {string} - Guid of the bottom most cut or copied element
 */
const getBottomCutOrCopiedGuid = (elementsInStore, topCutOrCopiedGuid) => {
    const topCutOrCopiedElement = elementsInStore[topCutOrCopiedGuid];
    let bottomCutOrCopiedElement = topCutOrCopiedElement;

    // Traversing down the selected elements vertical chain to get the bottom-most selected element guid
    while (bottomCutOrCopiedElement) {
        if (
            elementsInStore[bottomCutOrCopiedElement.next] &&
            elementsInStore[bottomCutOrCopiedElement.next].config &&
            elementsInStore[bottomCutOrCopiedElement.next].config.isSelected &&
            !hasGoToOnNext(elementsInStore, bottomCutOrCopiedElement.guid)
        ) {
            bottomCutOrCopiedElement = elementsInStore[bottomCutOrCopiedElement.next];
        } else {
            break;
        }
    }

    return bottomCutOrCopiedElement.guid;
};

/**
 * Function to recurse through the screen field references and getting all the nested screen fields to cut or copy
 *
 * @param {Object} elementsInStore - State of the elements in store
 * @param {Object []} fieldReferencesArray - Array containing field reference objects like: {childReference: 'fieldGuid'}
 * @returns nestedChildElementsToCutOrCopy - Object containing all the nested screen field to cut or copy
 */
const getNestedChildElementsToCutOrCopy = (elementsInStore, fieldReferencesArray) => {
    let nestedChildElementsToCutOrCopy = {};
    if (fieldReferencesArray && fieldReferencesArray.length > 0) {
        for (let i = 0; i < fieldReferencesArray.length; i++) {
            const childReference = fieldReferencesArray[i].childReference;
            nestedChildElementsToCutOrCopy[childReference] = elementsInStore[childReference];
            if (nestedChildElementsToCutOrCopy[childReference].childReferences) {
                nestedChildElementsToCutOrCopy = {
                    ...nestedChildElementsToCutOrCopy,
                    ...getNestedChildElementsToCutOrCopy(
                        elementsInStore,
                        nestedChildElementsToCutOrCopy[childReference].childReferences
                    )
                };
            }
        }
    }

    return nestedChildElementsToCutOrCopy;
};

/**
 * Function to get all the copied child elements
 *
 * @param {Object} elementsInStore - State of the elements in store
 * @param {Object} copiedElement - The copied element
 * @returns copiedChildElements containing all the copied child elements
 */
export const getCopiedChildElements = (elementsInStore, copiedElement) => {
    let copiedChildElements = {};
    if (hasChildElements(copiedElement)) {
        const childReferenceArray = copiedElement.childReferences;

        for (let j = 0; j < childReferenceArray.length; j++) {
            const childReference = childReferenceArray[j].childReference;
            copiedChildElements[childReference] = elementsInStore[childReference];

            // In case of screens we need to look for the nested screen fields too
            if (copiedChildElements[childReference].childReferences) {
                copiedChildElements = {
                    ...copiedChildElements,
                    ...getNestedChildElementsToCutOrCopy(
                        elementsInStore,
                        copiedChildElements[childReference].childReferences
                    )
                };
            }
        }
    }

    return copiedChildElements;
};

/**
 * Function to get all the copied data
 *
 * @param {Object} elementsInStore - State of the elements in store
 * @param {string} topCopiedGuid - Guid of the top copied element
 * @returns {Object} - Contains copiedCanvasElements, copiedChildElements and bottomCutOrCopiedGuid
 */
export const getCopiedData = (elementsInStore, topCopiedGuid) => {
    const copiedCanvasElements = {};
    let copiedChildElements = {};

    // Calculating the copiedCanvasElements and copiedChildElements objects
    for (let i = 0; i < Object.values(elementsInStore).length; i++) {
        const canvasElement = Object.values(elementsInStore)[i];
        if (canvasElement.config && canvasElement.config.isSelected) {
            copiedCanvasElements[canvasElement.guid] = canvasElement;
            copiedChildElements = {
                ...copiedChildElements,
                ...getCopiedChildElements(elementsInStore, canvasElement)
            };
        }
    }

    // Getting the guid of the bottom most selected element
    const bottomCutOrCopiedGuid = getBottomCutOrCopiedGuid(elementsInStore, topCopiedGuid);

    return { copiedCanvasElements, copiedChildElements, bottomCutOrCopiedGuid };
};

// TODO: Move this to a common util
/**
 * Function to create a guid -> new guid map
 *
 * @param {Object} elements - Object containing element objects for which the maps needs to be created
 */
const createGuidMap = (elements) => {
    return Object.keys(elements).reduce((acc, guid) => {
        acc[guid] = generateGuid();
        return acc;
    }, {});
};

/**
 * Function to get the guid -> pasted guid maps for canvas elements and child elements (like outcome, screen fields etc.)
 *
 * @param {Object} cutOrCopiedCanvasElements - Contains all the cut or copied Canvas Elements
 * @param {Object} cutOrCopiedChildElements - contains all the cut or copied Child Elements
 * @returns {Object} - Contains canvasElementGuidMap and childElementGuidMap
 */
export const getPasteElementGuidMaps = (cutOrCopiedCanvasElements, cutOrCopiedChildElements) => {
    return {
        canvasElementGuidMap: createGuidMap(cutOrCopiedCanvasElements),
        childElementGuidMap: createGuidMap(cutOrCopiedChildElements)
    };
};

/**
 * Recursively finds the nested child elements in a screen field and updates the childElementGuidMap
 *
 * @param {string} childElementGuid - Guid of a given child element
 * @param {Object} elementsInStore - Current state of elements in store
 * @param {Object} childElementGuidMap - Contains a map of childElementGuid -> duplicateChildElementGuid
 */
const addNestedChildElementsToGuidMap = (childElementGuid, elementsInStore, childElementGuidMap) => {
    const screenField = elementsInStore[childElementGuid];
    for (let i = 0; i < screenField.childReferences.length; i++) {
        childElementGuidMap[screenField.childReferences[i].childReference] = generateGuid();

        if (elementsInStore[screenField.childReferences[i].childReference].childReferences) {
            addNestedChildElementsToGuidMap(
                screenField.childReferences[i].childReference,
                elementsInStore,
                childElementGuidMap
            );
        }
    }

    return childElementGuidMap;
};

/**
 * Iterates over the childReferences array present in the canvas element and uses it to create childElementGuidMap.
 *
 * @param {Object} canvasElement - canvas element being duplicated
 * @param {Object} elementsInStore - Current state of elements in store
 * @returns {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 */
const setupChildElementGuidMap = (canvasElement, elementsInStore) => {
    if (!canvasElement) {
        throw new Error('canvasElement is not defined');
    }

    let childElementGuidMap = {};
    const childReferenceArray = canvasElement && canvasElement.childReferences;

    if (childReferenceArray) {
        for (let i = 0; i < childReferenceArray.length; i++) {
            const childReferenceObject = childReferenceArray[i];
            const childElementGuid = childReferenceObject.childReference;
            childElementGuidMap[childElementGuid] = generateGuid();

            // Adding nested screen fields to the childElementGuidMap
            if (elementsInStore[childElementGuid].childReferences) {
                childElementGuidMap = addNestedChildElementsToGuidMap(
                    childElementGuid,
                    elementsInStore,
                    childElementGuidMap
                );
            }
        }
    }

    return childElementGuidMap;
};

/**
 * Creates two maps containing canvasElementGuid -> duplicateCanvasElementGuid and childElementGuid -> duplicateChildElementGuid.
 *
 * @param {string[]} canvasElementsInStore - Current state of canvas elements in store
 * @param {Object} elementsInStore - Current state of elements in store
 * @returns {{canvasElementGuidMap, childElementGuidMap}} - Contains a map of canvasElementGuid -> duplicateCanvasElementGuid
 * and childElementGuid -> duplicateChildElementGuid
 */
export const getDuplicateElementGuidMaps = (canvasElementsInStore, elementsInStore) => {
    if (!canvasElementsInStore) {
        throw new Error('canvasElementsInStore is not defined');
    }

    if (!elementsInStore) {
        throw new Error('elementsInStore is not defined');
    }

    const canvasElementGuidMap = {};
    let childElementGuidMap = {};
    const unduplicatedCanvasElementsGuids = [];

    const nodesLength = canvasElementsInStore.length;
    for (let i = 0; i < nodesLength; i++) {
        const canvasElementGuid = canvasElementsInStore[i];
        const canvasElement = elementsInStore[canvasElementGuid];
        if (shouldDuplicateElement(canvasElement)) {
            canvasElementGuidMap[canvasElement.guid] = generateGuid();

            if (hasChildElements) {
                childElementGuidMap = {
                    ...childElementGuidMap,
                    ...setupChildElementGuidMap(canvasElement, elementsInStore)
                };
            }
        } else if (isSelected(canvasElement)) {
            unduplicatedCanvasElementsGuids.push(canvasElement.guid);
        }
    }

    return {
        canvasElementGuidMap,
        childElementGuidMap,
        unduplicatedCanvasElementsGuids
    };
};

/**
 * Checks if the connector is both selected and associated with a selected source and a selected target.
 *
 * @param {Object} connector - Connector object as present in the store
 * @param {Object} canvasElementGuidMap - Map of selected canvas elements guids to a newly generated guid that will be used as
 * the guid for the duplicate element
 * @returns {boolean} Returns true is the connector is selected and both it's source guid and target guid are present in canvasElementGuidMap
 */
const isConnectorSelectedAndAssociated = (connector, canvasElementGuidMap) => {
    if (!connector) {
        throw new Error('connector is not defined');
    }

    if (!canvasElementGuidMap) {
        throw new Error('canvasElementGuidMap is not defined');
    }

    return (
        connector.config &&
        connector.config.isSelected &&
        canvasElementGuidMap.hasOwnProperty(connector.source) &&
        canvasElementGuidMap.hasOwnProperty(connector.target)
    );
};

/**
 * Iterates over the connectors in store and pushes all selected connectors that are also associated with selected elements
 * that neeed to be duplicated into the connectorsToDuplicate array.
 *
 * @param {Object[]} connectorsInStore - Current state of connectors in store
 * @param {Object} canvasElementGuidMap - Map of selected canvas elements guids to a newly generated guid that will be used as \
 * the guid for the duplicate element
 * @returns {Object[]} connectorsToDuplicate - Array containing connectors that need to be duplicated
 */
export const getConnectorToDuplicate = (connectorsInStore, canvasElementGuidMap) => {
    if (!connectorsInStore) {
        throw new Error('connectorsInStore is not defined');
    }

    if (!canvasElementGuidMap) {
        throw new Error('canvasElementGuidMap is not defined');
    }

    const connectorsToDuplicate = [];

    const connectorsLength = connectorsInStore.length;
    for (let i = 0; i < connectorsLength; i++) {
        const connector = connectorsInStore[i];
        if (isConnectorSelectedAndAssociated(connector, canvasElementGuidMap)) {
            connectorsToDuplicate.push(connector);
        }
    }

    return connectorsToDuplicate;
};

/**
 * Checks if the element is already highlighted or not
 *
 * @param {Object} canvasElementToHighlight - canvas element that is being highlighted
 * @returns {boolean} Returns true if the canvas element is currently highlighted
 */
const isCanvasElementHighlighted = (canvasElementToHighlight) => {
    if (!canvasElementToHighlight) {
        throw new Error('canvasElementToHighlight is not defined');
    }

    return canvasElementToHighlight.config && canvasElementToHighlight.config.isHighlighted;
};

/**
 * Dispatches the highlightOnCanvas action if the searched element is already not highlighted
 *
 * @param {Object} storeInstance - Instance of client side store
 * @param {string} elementGuid - Guid of the canvas element that needs to be highlighted
 */
export const highlightCanvasElement = (storeInstance, elementGuid) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }

    if (!elementGuid) {
        throw new Error('elementGuid is not defined');
    }

    const currentStoreState = storeInstance.getCurrentState();
    const storeElements = currentStoreState && currentStoreState.elements;

    const canvasElementToHighlight = storeElements && storeElements[elementGuid];
    if (!isCanvasElementHighlighted(canvasElementToHighlight)) {
        const payload = {
            guid: elementGuid
        };
        storeInstance.dispatch(highlightOnCanvas(payload));
    }
};

/**
 *
 * Create start element
 *
 * @param {object} storeInstance store instance
 * @param triggerType
 */
export const createStartElement = (storeInstance, triggerType) => {
    const startElement = getElementForStore({
        elementType: ELEMENT_TYPE.START_ELEMENT,
        triggerType
    });

    storeInstance.dispatch(addElement(startElement));
    return startElement;
};

/**
 *
 * Create variable element
 *
 * @param {object} storeInstance store instance
 * @param {string} name variable name
 * @param {string} dataType data type
 * @param {string} subtype data subtype
 * @param {boolean} isCollection is collection variable?
 * @param {boolean} isInput is input variable?
 * @param {boolean} isOutput is output variable?
 */
export const createVariableElement = (
    storeInstance,
    name,
    dataType,
    subtype,
    isCollection = false,
    isInput = false,
    isOutput = false
) => {
    const varElement = createVariable({ name, dataType, subtype, isCollection, isInput, isOutput });
    storeInstance.dispatch(addElement(varElement));
    return varElement;
};

/**
 * Close modal and navigate the parent window to the specific url
 *
 * @param {string} navigateUrl url to navigate to
 * @returns true if you want to skip the close modal
 */
export const closeModalAndNavigateTo = (navigateUrl) => {
    if (navigateUrl) {
        window.top.location = navigateUrl;
        return false;
    }
    // skip exit
    return true;
};

/**
 * @typedef {Object} FlowSnippet
 * @property {string} processType Flow process type
 * @property {string} [triggerType] Flow trigger type
 */
/**
 * @typedef {string} TemplateId
 */
/**
 * Get the selected item
 *
 * @param modal the new flow modal
 * @returns {TemplateId|FlowSnippet} selectedItem
 */
export function getSelectedFlowEntry(modal) {
    const templatesModalBody = modal.get('v.body')[0];
    return templatesModalBody.get('v.selectedItem');
}

/**
 * Set the error message in the flow modal
 *
 * @param modal the flow modal
 * @param message the error message
 */
export const setErrorMessage = (modal, message) => {
    const templatesModalBody = modal.get('v.body')[0];
    templatesModalBody.set('v.errorMessage', message);
};

/**
 * Whether user can run & debug without VAD.
 *
 * @param flow run in mode
 * @param runInMode
 * @param status
 */
export const canRunDebugWith = (runInMode, status) => {
    return (
        status === 'Active' ||
        !((runInMode === 'SystemModeWithSharing' || runInMode === 'SystemModeWithoutSharing') && !canUserVAD())
    );
};

/**
 * Is Guardrails enabled for this org
 */
export const isGuardrailsEnabled = () => {
    return orgHasFlowBuilderGuardrails();
};

/**
 * Get the alc left-pane toolbox / alc connector menu elements
 *
 * @param {string} flowProcessType
 * @param {string} flowTriggerType
 */
export function getToolboxElements(flowProcessType, flowTriggerType) {
    logPerfTransactionStart(LEFT_PANEL_ELEMENTS);
    return new Promise((resolve) => {
        // TODO: fetch should return a promise
        fetch(SERVER_ACTION_TYPE.GET_SUPPORTED_ELEMENTS, resolve, {
            flowProcessType,
            flowTriggerType
        });
    })
        .then(({ data, error }) => {
            if (error) {
                throw error;
            }
            logPerfTransactionEnd(LEFT_PANEL_ELEMENTS, {
                numOfElements: data.length
            });
            updateElementConfigMapWithSubtypes(data);
            return data;
        })
        .catch((/* error */) => {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        });
}

/**
 *  Get the elements metadata for the alc editor
 *
 * @param toolboxElements
 * @param palette
 * @param existingMetadata
 */
export function getElementsMetadata(toolboxElements, palette, existingMetadata = []) {
    const newElementsMetadata = [];
    getElementSections(toolboxElements, palette).forEach((section) => {
        (section._children || []).forEach(
            ({
                canHaveFaultConnector,
                description,
                elementType,
                elementSubtype,
                actionType,
                actionName,
                actionIsStandard,
                label,
                iconBackgroundColor,
                iconName,
                iconShape,
                iconSize,
                dynamicNodeComponent,
                dynamicNodeComponentSelector,
                alcVisible
            }) => {
                const newElementMetadata = {
                    section: section.label,
                    canHaveFaultConnector,
                    supportsMenu: true,
                    description,
                    elementType,
                    actionType,
                    actionName,
                    actionIsStandard,
                    label,
                    iconBackgroundColor,
                    icon: iconName,
                    iconShape,
                    iconSize,
                    dynamicNodeComponent,
                    dynamicNodeComponentSelector,
                    value: elementType, // TODO: ALC remove this property and just use elementType
                    isSupported: alcVisible // make use of isSupported to filter out invisible item in auto-layout
                };
                if (elementSubtype) {
                    newElementMetadata.elementSubtype = elementSubtype;
                }
                newElementsMetadata.push(newElementMetadata);
            }
        );
    });
    if (existingMetadata.length === 0) {
        return newElementsMetadata;
    }
    const updatedElementsMetadata = [...newElementsMetadata];
    const newElementsMetadataMap = {};
    newElementsMetadata.forEach((newMetadata) => {
        newElementsMetadataMap[newMetadata.elementType] = newMetadata;
    });
    // Comparing the existing elementMetadata to the newElementsMetadata
    // If an item of the old list is not found in the new one, push it the the updated list with its "isSupported" property to false
    existingMetadata.forEach((oldMetadata) => {
        if (!newElementsMetadataMap[oldMetadata.elementType]) {
            updatedElementsMetadata.push({ ...oldMetadata, isSupported: false });
        }
    });
    return updatedElementsMetadata;
}

/**
 * Helper function to construct and return the payload for connector highlighting as expected for the DECORATE_CANVAS action
 *
 * @param canvasDecorator canvas decorator object returned from the server
 */
export const getConnectorsToHighlight = (canvasDecorator: Object): Object[] => {
    const connectorsToHighlight = [];
    if (canvasDecorator.decoratedElements) {
        canvasDecorator.decoratedElements.forEach((element) => {
            let storeElement;
            if (element.elementApiName) {
                storeElement = getElementByDevName(element.elementApiName);
            } else if (element.elementType && element.elementType.toLowerCase() === METADATA_KEY.START.toLowerCase()) {
                storeElement = getStartElement();
            }
            if (storeElement && element.decoratedConnectors) {
                // Add highlighted connectors for the each of the elements in the decorator object
                element.decoratedConnectors.forEach((connector) => {
                    let connectorType;
                    // TODO W-8380447 Start element connector type info should come from canvas decorator
                    if (storeElement.elementType === ELEMENT_TYPE.START_ELEMENT) {
                        connectorType =
                            shouldSupportScheduledPaths(storeElement) && !connector.childSource
                                ? CONNECTOR_TYPE.IMMEDIATE
                                : CONNECTOR_TYPE.REGULAR;
                    } else {
                        connectorType = connector.connectorType;
                    }
                    const childSourceElement = connector.childSource && getElementByDevName(connector.childSource);
                    if (!connector.childSource || (connector.childSource && childSourceElement)) {
                        connectorsToHighlight.push({
                            source: storeElement.guid,
                            childSource: childSourceElement && childSourceElement.guid,
                            type: connectorType
                        });
                    }
                });
            }
        });
    }

    return connectorsToHighlight;
};

/**
 * Function to return an array of decorated elements with decorationType as ERROR
 *
 * @param canvasDecorator canvas decorator object returned from the server
 */
export const getElementsWithError = (canvasDecorator: object): Array<object> => {
    let elementsToDecorate = [];
    if (canvasDecorator && canvasDecorator.decoratedElements) {
        elementsToDecorate = canvasDecorator.decoratedElements
            .filter((decoratedElement) => decoratedElement.decorationType === DECORATION_TYPE.ERROR)
            .map((decoratedElement) => {
                return {
                    elementName: decoratedElement.elementApiName,
                    decorationType: decoratedElement.decorationType
                };
            });
    }

    return elementsToDecorate;
};

const screenFieldsInSections = (screenFields: Metadata.ScreenField[]): Metadata.ScreenField[] => {
    return screenFields
        .filter((field) => field.fieldType === FlowScreenFieldType.RegionContainer)
        .reduce((acc, field) => [...acc, ...field.fields], [])
        .reduce((acc, field) => [...acc, ...field.fields], []);
};

const allScreenFields = (screen: Metadata.Screen): Metadata.ScreenField[] => {
    const screenFields = [...screen.fields];
    screenFields.push(...screenFieldsInSections(screenFields));
    return screenFields;
};

export const screenFieldsReferencedByLoops = (flowMetadata: any): Metadata.ScreenField[] => {
    const loopReferences = flowMetadata.loops.map((loop) => sanitizeGuid(loop.collectionReference).guidOrLiteral);
    return flowMetadata.screens.reduce(
        (acc, screen) => [
            ...acc,
            ...allScreenFields(screen).filter((field) => field && field.name && loopReferences.includes(field.name))
        ],
        []
    );
};

/**
 * Helper function contruct debug data object needed for debug panel from service response and to fire the canvas decorator actions
 *
 * @param data Debug service response data containing interview results and canvas decorator
 * @param storeInstance Current store instance
 * @param hasUnsavedChanges Indicates whether there are any currently unsaved changes on the Flow
 * @param keepHighlightOnError
 */
export const debugInterviewResponseCallback = (
    data: Array,
    storeInstance: Store,
    hasUnsavedChanges: boolean,
    keepHighlightOnError: boolean
): Object => {
    // Setup the debug data object for the debug panel
    const interviewData = (data && data[0]) || {};
    const { interviewStatus, debugTrace, errors } = interviewData;

    interviewData.startInterviewTime = new Date(interviewData.startInterviewTime);
    interviewData.endInterviewTime = new Date(interviewData.endInterviewTime);
    const startInterviewTime = interviewData.startInterviewTime;
    const endInterviewTime = interviewData.endInterviewTime;
    const waitEvents = interviewData.waitEvents;
    const interview = interviewData.serializedInterview;

    // Highlight connectors on the canvas if no errors in the debug run, and no unsaved changes in the current flow
    if (!errors && !hasUnsavedChanges) {
        const canvasDecorator = data[1];
        if (canvasDecorator) {
            const connectorsToHighlight = getConnectorsToHighlight(canvasDecorator);
            const elementsToDecorate = getElementsWithError(canvasDecorator);
            storeInstance.dispatch(decorateCanvas({ connectorsToHighlight, elementsToDecorate }));
        }
    } else if (!keepHighlightOnError) {
        // Else, clear any existing highlights on the canvas
        storeInstance.dispatch(clearCanvasDecoration);
    }

    return {
        interviewStatus,
        debugTrace,
        error: errors,
        startInterviewTime,
        endInterviewTime,
        waitEvent: waitEvents,
        serializedInterview: interview
    };
};

/**
 * Helper function to handle shift focus from either canvas component
 *
 * @param leftPanelComponent Left panel component
 * @param toolbarComponent Toolbar component
 * @param headerComponent Header component
 * @param rightPanelComponent Right Panel component
 * @param shiftBackward Whether focus is shifted forwarded (F6) or backwards (shift + F6) from canvas
 */
export const shiftFocusFromCanvas = (
    leftPanelComponent: Object,
    toolbarComponent: Object,
    headerComponent: Object,
    rightPanelComponent: Object,
    shiftBackward: boolean
) => {
    if (shiftBackward) {
        if (leftPanelComponent) {
            leftPanelComponent.focus();
        } else {
            toolbarComponent.focus(shiftBackward);
        }
    } else if (rightPanelComponent) {
        rightPanelComponent.focus();
    } else {
        headerComponent.focus();
    }
};

/**
 * Helper function to handle shifting focous away from the toolbar to the next component depending on direction
 *
 * @param headerComponent the header component that we'll shift focus to if we're shifting backward
 * @param canvasComponent the canvas compnent which we'll be shifting focus to if we're shifting forward
 * @param shiftBackward  true to shift backward, false to shift forward
 */
export const shiftFocusFromToolbar = (headerComponent: Object, canvasComponent: Object, shiftBackward: boolean) => {
    if (shiftBackward) {
        headerComponent.focus();
    } else {
        canvasComponent.focus();
    }
};

/**
 * Function to log element creation
 *
 * @param element pass in created element to be logged
 * @param isQuickCreate option for choice elements, true if quick created from screen editor
 * @param flowDefId flow definition Id to track instrumentation
 */

export const logElementCreation = (element, isResourceQuickCreated, flowDefId) => {
    const elementType = element.elementType;
    const data = { flowDefId };
    if (
        elementType === ELEMENT_TYPE.CHOICE ||
        elementType === ELEMENT_TYPE.RECORD_CHOICE_SET ||
        elementType === ELEMENT_TYPE.PICKLIST_CHOICE_SET
    ) {
        if (element.isAddingResourceViaLeftPanel) {
            Object.assign(data, { isAddingResourceViaLeftPanel: true });
        } else if (isResourceQuickCreated) {
            Object.assign(data, { isResourceQuickCreated: true });
        }
    }
    logInteraction(`add-node-of-type-${element.elementType}`, 'modal', data, 'click');
};
