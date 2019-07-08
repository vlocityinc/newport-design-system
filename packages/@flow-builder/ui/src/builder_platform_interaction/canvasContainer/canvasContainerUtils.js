import { canvasSelector } from 'builder_platform_interaction/selectors';
import {
    selectOnCanvas,
    toggleOnCanvas,
    addConnector
} from 'builder_platform_interaction/actions';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    invokePropertyEditor,
    PROPERTY_EDITOR
} from 'builder_platform_interaction/builderUtils';
import {
    sortConnectorPickerComboboxOptions,
    getLabelAndValueForConnectorPickerOptions,
    createNewConnector
} from 'builder_platform_interaction/connectorUtils';
import { drawingLibInstance as lib } from 'builder_platform_interaction/drawingLib';

/** Private functions */

/**
 * This function looks up element in the store given the guid.
 * @param {Object} storeInstance instance of the store.
 * @param {Object} guid element guid.
 * @returns element details
 */
const getElement = (storeInstance, guid) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    if (!guid) {
        throw new Error('Guid is not defined');
    }

    const elements = storeInstance.getCurrentState().elements;
    return elements[guid];
};

/** Public functions */

/**
 * This function checks if a given array is empty or not.
 * @param {Array} array to be checked.
 * @returns true if an array is empty.
 */
export const isEmptyArray = array => {
    if (!Array.isArray(array)) {
        throw new Error('Value passed to the function is not an array');
    }
    return !array.length;
};

/**
 * This function returns all the nodes in the given store state
 * @param {Object} currentStoreState is client side model
 * @return all the nodes in the client side model. If model is not passed, then return an empty array
 */
export const getNodesFromStore = currentStoreState => {
    if (!currentStoreState) {
        return [];
    }
    return canvasSelector(currentStoreState);
};

/**
 * This function returns all the connection in the given store state
 * @param {Object} currentStoreState is client side model
 * @return all the connectors in the client side model. If model is not passed, then return an empty array
 */
export const getConnectorsFromStore = currentStoreState => {
    if (!currentStoreState) {
        return [];
    }
    return currentStoreState.connectors;
};

/**
 * This function update store state based on elements which are selected
 * @param {Object} storeInstance instance of the client side model
 * @param {Object} payload contains element which get selected by the user
 * @param {Boolean} isMultiSelection whether operation was multiselection or not
 */
export const updateStoreOnSelection = (
    storeInstance,
    payload,
    isMultiSelection = false
) => {
    if (!storeInstance) {
        throw new Error(
            'Store instance is not defined while selecting an element in canvas'
        );
    }
    if (!payload) {
        throw new Error(
            'Payload is not defined while selecting an element in canvas'
        );
    }
    if (isMultiSelection) {
        storeInstance.dispatch(toggleOnCanvas(payload));
    } else {
        storeInstance.dispatch(selectOnCanvas(payload));
    }
};

/**
 * This function checks whether connector type should be start or not
 * @param {Object} storeInstance instance of the client side model
 * @param {String} sourceGuid Guid of the source element
 * @returns true if element is start element and has no available connections
 */
export const shouldCreateStartConnection = (storeInstance, sourceGuid) => {
    const { availableConnections, elementType } = getElement(
        storeInstance,
        sourceGuid
    );
    if (!availableConnections && elementType === ELEMENT_TYPE.START_ELEMENT) {
        return true;
    }
    return false;
};

/**
 * This function checks whether element has only one connection left.
 * @param {Object} storeInstance instance of the client side model
 * @param {String} sourceGuid Guid of the source element
 * @returns true if element has only one connection available
 */
export const hasOneAvailableConnection = (storeInstance, sourceGuid) => {
    const { availableConnections } = getElement(storeInstance, sourceGuid);
    return availableConnections && availableConnections.length === 1;
};

/**
 * This function checks whether connector selection modal should be invoked or not.
 * @param {Object} storeInstance instance of the client side model
 * @param {String} sourceGuid Guid of the source element
 * @returns true if element has more than one available connections and element type is decision, loop and wait.
 */
export const shouldOpenConnectorSelectionModal = (
    storeInstance,
    sourceGuid
) => {
    const { availableConnections, elementType } = getElement(
        storeInstance,
        sourceGuid
    );
    if (
        availableConnections &&
        availableConnections.length > 1 &&
        (elementType === ELEMENT_TYPE.DECISION ||
            elementType === ELEMENT_TYPE.WAIT ||
            elementType === ELEMENT_TYPE.LOOP)
    ) {
        return true;
    }
    return false;
};

/**
 * Dispatches add connection action with the new connector
 *
 * @param {Object} storeInstance instance of the client side model
 * @param {String} sourceGuid - Contains the source guid
 * @param {String} targetGuid - Contains the target guid
 * @return {Function} - Creates the connector object based on the selected or remaining availableConnection value
 */
export const addConnection = (
    storeInstance,
    sourceGuid,
    targetGuid
) => valueFromCombobox => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    const elements = storeInstance.getCurrentState().elements;
    const connectorObject = createNewConnector(
        elements,
        sourceGuid,
        targetGuid,
        valueFromCombobox
    );
    storeInstance.dispatch(addConnector(connectorObject));
};

/**
 * This function gets the detail of source and target element given their guids
 * @param {Object} storeInstance instance of the client side model
 * @param {String} sourceGuid Guid of the source element
 * @param {String} targetGuid Guid of the target element
 * @return {object} detail of source and target elements.
 */
export const getSourceAndTargetElement = (
    storeInstance,
    sourceGuid,
    targetGuid
) => {
    const sourceElement = getElement(storeInstance, sourceGuid);
    const targetElement = getElement(storeInstance, targetGuid);
    return {
        sourceElement,
        targetElement
    };
};

/**
 * This function creates a connection when only one connection is available for given source element
 * @param {Object} storeInstance instance of the client side model
 * @param {String} sourceGuid Guid of the source element
 * @param {String} targetGuid Guid of the target element
 */
export const createConnectorWhenOneConnectionAvailable = (
    storeInstance,
    sourceGuid,
    targetGuid
) => {
    const { availableConnections } = getElement(storeInstance, sourceGuid);
    if (availableConnections && availableConnections.length === 1) {
        const { childReference, type } = availableConnections[0];
        const remainingConnectionValue = childReference || type;
        addConnection(storeInstance, sourceGuid, targetGuid)(
            remainingConnectionValue
        );
    }
};

/**
 * This function invokes connector selection modal for given element
 * @param {Object} storeInstance instance of the client side model
 * @param {String} sourceGuid Guid of the source element
 * @param {String} targetGuid Guid of the target element
 * @param {String} mode Mode for invoking property editor
 */
export const openConnectorSelectionModal = (
    storeInstance,
    sourceGuid,
    targetGuid,
    mode
) => {
    if (!storeInstance) {
        throw new Error('Store instance is not defined');
    }
    const elements = storeInstance.getCurrentState().elements;
    const { sourceElement, targetElement } = getSourceAndTargetElement(
        storeInstance,
        sourceGuid,
        targetGuid
    );
    if (sourceElement && targetElement) {
        const targetElementLabel = targetElement.label;
        const sourceElementType = sourceElement.elementType;
        const { availableConnections } = sourceElement;
        if (availableConnections && availableConnections.length > 0) {
            let comboboxOptions = availableConnections.reduce(
                (acc, availableConnection) => {
                    const { type, childReference } = availableConnection;
                    const {
                        label,
                        value
                    } = getLabelAndValueForConnectorPickerOptions(
                        elements,
                        sourceElement,
                        childReference,
                        type
                    );
                    acc.push({
                        label,
                        value
                    });
                    return acc;
                },
                []
            );
            // Sorting the options in the right order
            comboboxOptions = sortConnectorPickerComboboxOptions(
                sourceElement,
                comboboxOptions
            );
            const nodeUpdate = addConnection(
                storeInstance,
                sourceGuid,
                targetGuid
            );
            invokePropertyEditor(PROPERTY_EDITOR, {
                mode,
                nodeUpdate,
                comboboxOptions,
                sourceElementType,
                targetElementLabel
            });
        }
    }
};

/**
 * Calculates the deleted canvas element guids by comparing existingCanvasElements and updatedCanvasElements.
 * Sends them drawing lib Instance for calling cleanup methods on the ids.
 * @param {Object[]} existingCanvasElements existing array of node objects from canvas container internal state
 * @param {Object[]} updatedCanvasElements updated array of node objects from store
 * @param {Object} canvasTemplate template of the canvas
 */
export const calculateDeletedNodeIdsAndCleanUpDrawingLibInstance = (
    existingCanvasElements,
    updatedCanvasElements,
    canvasTemplate
) => {
    if (!existingCanvasElements) {
        throw new Error(
            'existingCanvasElements is not defined. It must be defined.'
        );
    }

    if (!updatedCanvasElements) {
        throw new Error(
            'updatedCanvasElements is not defined. It must be defined.'
        );
    }

    if (
        existingCanvasElements.length !== 0 &&
        updatedCanvasElements.length < existingCanvasElements.length
    ) {
        const existingCanvasElementGuids = existingCanvasElements.map(
            node => node.guid
        );
        const updatedCanvasElementGuids = updatedCanvasElements.map(
            node => node.guid
        );
        const canvasElementGuidsToBeDeleted = existingCanvasElementGuids.filter(
            guid => !updatedCanvasElementGuids.includes(guid)
        );
        for (let i = 0; i < canvasElementGuidsToBeDeleted.length; i++) {
            const canvasElementGuid = canvasElementGuidsToBeDeleted[i];
            const canvasElementContainer =
                canvasTemplate &&
                canvasTemplate.getCanvasElementContainer &&
                canvasTemplate.getCanvasElementContainer(canvasElementGuid);
            lib.removeNodeFromLib(canvasElementGuid, canvasElementContainer);
        }
    }
};

/**
 * Calculates the deleted connector guids by comparing existingConnectors and updatedConnectors.
 * Sends them drawing lib Instance for calling cleanup methods on the ids and delete them from the JsPlumbConnectorMap.
 * @param {Object[]} existingConnectors existing array of connector objects from canvas container internal state
 * @param {Object[]} updatedConnectors updated array of connector objects from store
 * @param {Object} canvasTemplate template of the canvas
 */
export const calculateDeletedConnectorIdsAndCleanUpDrawingLibInstance = (
    existingConnectors,
    updatedConnectors,
    canvasTemplate
) => {
    if (!existingConnectors) {
        throw new Error(
            'existingConnectors is not defined. It must be defined.'
        );
    }

    if (!updatedConnectors) {
        throw new Error(
            'updatedConnectors is not defined. It must be defined.'
        );
    }

    const existingConnectorGuids = existingConnectors.map(
        connector => connector.guid
    );
    const updatedConnectorGuids = updatedConnectors.map(
        connector => connector.guid
    );
    const connectorGuidsToBeDeleted = existingConnectorGuids.filter(
        guid => !updatedConnectorGuids.includes(guid)
    );
    connectorGuidsToBeDeleted.forEach(connectorGuid => {
        // remove jsPlumbConnector instance from drawingLib
        const connectorToBeDeleted =
            canvasTemplate &&
            canvasTemplate.getJsPlumbConnectorFromMap &&
            canvasTemplate.getJsPlumbConnectorFromMap(connectorGuid);
        lib.removeConnectorFromLib(connectorToBeDeleted);

        // remove jsPlumbConnector from the map
        if (canvasTemplate && canvasTemplate.deleteJsPlumbConnectorFromMap) {
            canvasTemplate.deleteJsPlumbConnectorFromMap(connectorGuid);
        }
    });
};
