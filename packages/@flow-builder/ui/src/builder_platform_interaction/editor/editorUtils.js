import { usedBy, invokeUsedByAlertModal } from 'builder_platform_interaction/usedByLib';
import { deleteElement, updatePropertiesAfterSaving, updateProperties, updatePropertiesAfterSaveFailed, highlightOnCanvas, addElement } from 'builder_platform_interaction/actions';
import { canvasSelector } from 'builder_platform_interaction/selectors';
import { SaveType } from 'builder_platform_interaction/saveType';
import { SaveFlowEvent } from 'builder_platform_interaction/events';
import { getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { setRules, setOperators } from 'builder_platform_interaction/ruleLib';
import { setResourceTypes } from 'builder_platform_interaction/dataTypeLib';
import { setEntities, setEventTypes } from 'builder_platform_interaction/sobjectLib';
import { setGlobalVariables, setSystemVariables } from 'builder_platform_interaction/systemLib';
import { getFlowSystemVariableComboboxItem, getGlobalVariableTypeComboboxItems } from 'builder_platform_interaction/expressionUtils';
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { setApexClasses } from "builder_platform_interaction/apexTypeLib";
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getConfigForElementType } from "builder_platform_interaction/elementConfig";
import { getFullErrorMessage } from 'builder_platform_interaction/newFlowModalUtils';

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
        storeInstance.dispatch(deleteElement({selectedElementGUIDs, connectorsToDelete, elementType}));
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
    storeInstance.dispatch(updatePropertiesAfterSaveFailed({
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

export const setFlowErrorsAndWarnings = (data) => {
    const { errors = {}, warnings = {} } = data || {};
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
    saveFlowFn(saveType);
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

export const setPeripheralDataForPropertyEditor = ({rules, operators, resourceTypes, eventTypes, globalVariables, systemVariables, entities, apexTypes}) => {
    setRules(rules);
    setOperators(operators);
    setResourceTypes(resourceTypes);
    setEventTypes(eventTypes);
    setGlobalVariableAndUpdateCache(globalVariables);
    setSystemVariableAndUpdateCache(systemVariables);
    setEntities(entities);
    setApexClasses(apexTypes);
};

/**
 * Checks if the canvas element needs to be duplicated or not. We only need to duplicate canvas elements (excluding Step)
 * that are selected.
 *
 * @param {Object} canvasElement - canvas element being duplicated
 * @returns {Boolean} Returns true if the canvas element should be duplicated
 */
const shouldDuplicateElement = (canvasElement) => {
    if (!canvasElement) {
        throw new Error('canvasElement is not defined');
    }

    return (canvasElement.guid && canvasElement.elementType && canvasElement.elementType !== ELEMENT_TYPE.STEP
        && canvasElement.config && canvasElement.config.isSelected);
};

/**
 * Checks if the canvas element being duplicated can have any child elements associated with it or not. Only Decision,
 * Screen and wait (Pause) element can have child elements.
 *
 * @param {Object} canvasElement - canvas element being duplicated
 * @returns {Boolean} - Returns true if canvas element is Decision, Screen or Wait
 */
const hasChildElements = (canvasElement) => {
    if (!canvasElement) {
        throw new Error('canvasElement is not defined');
    }

    return (canvasElement.elementType && (canvasElement.elementType === ELEMENT_TYPE.SCREEN
        || canvasElement.elementType === ELEMENT_TYPE.DECISION || canvasElement.elementType === ELEMENT_TYPE.WAIT));
};

/**
 * Iterates over the childReferences array present in the canvas element and uses it to create childElementGuidMap.
 *
 * @param {Object} canvasElement - canvas element being duplicated
 * @returns {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 */
const setupChildElementGuidMap = (canvasElement) => {
    if (!canvasElement) {
        throw new Error('canvasElement is not defined');
    }

    const elementConfig = canvasElement.elementType && getConfigForElementType(canvasElement.elementType);
    const childReferenceKey = elementConfig && elementConfig.childReferenceKey;

    const childElementGuidMap = {};
    const childReferenceArray = childReferenceKey && childReferenceKey.plural && canvasElement[childReferenceKey.plural];

    if (childReferenceArray && childReferenceKey.singular) {
        for (let i = 0; i < childReferenceArray.length; i++) {
            const childReferenceObject = childReferenceArray[i];
            childElementGuidMap[childReferenceObject[childReferenceKey.singular]] = generateGuid();
        }
    }

    return childElementGuidMap;
};

/**
 * Creates two maps containing canvasElementGuid -> duplicateCanvasElementGuid and childElementGuid -> duplicateChildElementGuid.
 *
 * @param {String[]} canvasElementsInStore - Current state of canvas elements in store
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

    const nodesLength = canvasElementsInStore.length;
    for (let i = 0; i < nodesLength; i++) {
        const canvasElementGuid = canvasElementsInStore[i];
        const canvasElement = elementsInStore[canvasElementGuid];
        if (shouldDuplicateElement(canvasElement)) {
            canvasElementGuidMap[canvasElement.guid] = generateGuid();

            if (hasChildElements) {
                childElementGuidMap = {...childElementGuidMap, ...setupChildElementGuidMap(canvasElement)};
            }
        }
    }

    return { canvasElementGuidMap, childElementGuidMap };
};

/**
 * Checks if the connector is both selected and associated with a selected source and a selected target.
 *
 * @param {Object} connector - Connector object as present in the store
 * @param {Object} canvasElementGuidMap - Map of selected canvas elements guids to a newly generated guid that will be used as
 * the guid for the duplicate element
 * @returns {Boolean} Returns true is the connector is selected and both it's source guid and target guid are present in canvasElementGuidMap
 */
const isConnectorSelectedAndAssociated = (connector, canvasElementGuidMap) => {
    if (!connector) {
        throw new Error('connector is not defined');
    }

    if (!canvasElementGuidMap) {
        throw new Error('canvasElementGuidMap is not defined');
    }

    return (connector.config && connector.config.isSelected && canvasElementGuidMap.hasOwnProperty(connector.source)
        && canvasElementGuidMap.hasOwnProperty(connector.target));
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
 * @return {Boolean} Returns true if the canvas element is currently highlighted
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
 * @param {String} elementGuid - Guid of the canvas element that needs to be highlighted
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
* @param {object} storeInstance store instancce
*/
export const createStartElement = (storeInstance) => {
   const startElement = getElementForStore({
       elementType: ELEMENT_TYPE.START_ELEMENT
   });
   storeInstance.dispatch(addElement(startElement));
};

/**
* Close modal and navigate the parent window to the specific url
* @param {String} navigateUrl url to navigate to
* @return true if you want to skip the close modal
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
* @typedef {Object} SelectedTemplate
*
* @property {String} [templateId]
* @property {String} [processType]
*/
/**
* Get the selected template
* @param modal the flow modal
* @return {SelectedTemplate} selectedTemplate
*/
export const getSelectedTemplate = (modal) => {
   const templatesModalBody = modal.get('v.body')[0];
   const isProcessType = templatesModalBody.get('v.isProcessType');
   const processTypeOrTemplateId = templatesModalBody.get('v.selectedTemplate');
   const processTypeOrTemplateProp = isProcessType ? 'processType' : 'templateId';
   return {[processTypeOrTemplateProp]: processTypeOrTemplateId};
};

/**
* Set the error message in the flow modal
* @param modal the flow modal
* @param message the error message
* @param type the error message type
*/
export const setErrorMessage = (modal, type, message) => {
    const templatesModalBody = modal.get('v.body')[0];
    templatesModalBody.set('v.errorMessage', getFullErrorMessage({type, message}));
 };