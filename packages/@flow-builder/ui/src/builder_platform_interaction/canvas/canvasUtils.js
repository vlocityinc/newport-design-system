import { drawingLibInstance as lib} from "builder_platform_interaction/drawingLib";
import { isElementOverlapWithBox } from './marqueeSelectionLib';
import { KEYS } from "./keyConstants";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

const NODE_LENGTH = 48;

/**
 * Helper function to set the id on the canvas element container.
 *
 * @param {Object} canvasElementContainer - Container of the canvas element
 * @param {String} canvasElementGuid - Guid of the canvas element
 * @private
 */
const _setIdOnCanvasElementContainer = (canvasElementContainer, canvasElementGuid) => {
    if (!canvasElementContainer) {
        throw new Error('canvasElementContainer is not defined. It must be defined.');
    }

    if (!canvasElementGuid) {
        throw new Error('canvasElementGuid is not defined. It must be defined.');
    }

    if (!canvasElementContainer.getAttribute('id')) {
        canvasElementContainer.setAttribute('id', canvasElementGuid);
    }
};

/**
 * Helper function to set the canvas element as draggable using jsPlumb.
 *
 * @param {Object} canvasElementContainerTemplate - Template of the canvas element
 * @param {Object} canvasElementContainer - Container of the canvas element
 * @param {String} elementType - Type of the canvas element
 * @private
 */
const _setElementAsDraggable = (canvasElementContainerTemplate, canvasElementContainer, elementType) => {
    if (!canvasElementContainerTemplate) {
        throw new Error('canvasElementContainerTemplate is not defined. It must be defined.');
    }

    if (!canvasElementContainer) {
        throw new Error('canvasElementContainer is not defined. It must be defined.');
    }

    if (!elementType) {
        throw new Error('elementType is not defined. It must be defined.');
    }

    const { dragStart, dragStop, drag } = canvasElementContainerTemplate;

    if (elementType !== ELEMENT_TYPE.START_ELEMENT) {
        lib.setDraggable(canvasElementContainer, {
            start: dragStart,
            stop: dragStop,
            drag
        });
    }
};

/**
 * Helper function to set the canvas element as a target using jsPlumb.
 *
 * @param {Object} canvasElementContainer - Container of the canvas element
 * @param {String} elementType - Type of the canvas element
 * @private
 */
const _setElementAsTarget = (canvasElementContainer, elementType) => {
    if (!canvasElementContainer) {
        throw new Error('canvasElementContainer is not defined. It must be defined.');
    }

    if (!elementType) {
        throw new Error('elementType is not defined. It must be defined.');
    }

    if (elementType !== ELEMENT_TYPE.START_ELEMENT && !lib.isTarget(canvasElementContainer)) {
        lib.makeTarget(canvasElementContainer);
    }
};

/**
 * Helper function to set the canvas element as a source using jsPlumb.
 *
 * @param {Object} canvasElementContainer - Container of the canvas element
 * @private
 */
const _setElementAsSource = (canvasElementContainer) => {
    if (!canvasElementContainer) {
        throw new Error('canvasElementContainer is not defined. It must be defined.');
    }

    if (!lib.isSource(canvasElementContainer)) {
        lib.makeSource(canvasElementContainer);
    }
};

/**
 * Helper function to update the drag selection based on the isSelected and addToDragSelection config.
 *
 * @param {Object} canvasElementContainer - Container of the canvas element
 * @param {Object} canvasElementConfig - Canvas element's config
 * @private
 */
const _updateDragSelection = (canvasElementContainer, canvasElementConfig = {}) => {
    if (!canvasElementContainer) {
        throw new Error('canvasElementContainer is not defined. It must be defined.');
    }

    if (canvasElementConfig.isSelected || canvasElementConfig.addToDragSelection) {
        lib.addToDragSelection(canvasElementContainer);
    } else {
        lib.removeFromDragSelection(canvasElementContainer);
    }
};

/**
 * Helper function to set up a jsPlumb Connection.
 *
 * @param {Object} connectorTemplate - Connector's Template object
 * @param {Object} connector - Object containing the connector data
 * @param {Object} sourceElementContainer - Container div of the source element
 * @param {Object} targetElementContainer - Container div of the target element
 * @returns {Object} jsPlumbConnector - Newly setup jsPlumb connection
 * @private
 */
const _setJsPlumbConnection = (connectorTemplate, connector, sourceElementContainer, targetElementContainer) => {
    if (!connectorTemplate) {
        throw new Error('connectorTemplate is not defined. It must be defined.');
    }

    if (!connector) {
        throw new Error('connector is not defined. It must be defined.');
    }

    if (!sourceElementContainer) {
        throw new Error('sourceElementContainer is not defined. It must be defined.');
    }

    if (!targetElementContainer) {
        throw new Error('sourceElementContainer is not defined. It must be defined.');
    }

    const jsPlumbConnector = lib.setExistingConnections(sourceElementContainer, targetElementContainer, connector.label, connector.guid, connector.type);
    connectorTemplate.setJsPlumbConnector(jsPlumbConnector);
    return jsPlumbConnector;
};

/**
 * Helper function to update the styling of the connector based on it's selected state.
 *
 * @param {Object} connector - Object containing the connector data
 * @param {Object} jsPlumbConnector - Connector Object provided by jsPlumb
 * @private
 */
const _updateConnectorStyling = (connector, jsPlumbConnector) => {
    if (!connector) {
        throw new Error('connector is not defined. It must be defined.');
    }

    if (!jsPlumbConnector) {
        throw new Error('jsPlumbConnector is not defined. It must be defined.');
    }

    if (connector.config.isSelected) {
        lib.selectConnector(jsPlumbConnector, connector.type);
    } else {
        lib.deselectConnector(jsPlumbConnector, connector.type);
    }
};

/**
 * Helper function to set up the connector label.
 *
 * @param {Object} connector - Object containing the connector data
 * @param {Object} jsPlumbConnector - Connector Object provided by jsPlumb
 * @private
 */
const _setConnectorLabel = (connector, jsPlumbConnector) => {
    if (!connector) {
        throw new Error('connector is not defined. It must be defined.');
    }

    if (!jsPlumbConnector) {
        throw new Error('jsPlumbConnector is not defined. It must be defined.');
    }

    if (jsPlumbConnector.getLabel() !== connector.label) {
        jsPlumbConnector.setLabel(connector.label);
    }
};

/**
 * Helper function to check if canvas elements need to be selected/deselected and update the current selection list accordingly,
 * the node would be selected when it is overlapping with the marquee box.
 *
 * @param {Object[]} canvasElements - Array of canvas elements
 * @param {String[]} currentSelectedCanvasElementGuids - Array of current selected canvas elements
 * @param {Integer[]} boxStartPos - marquee box start position
 * @param {Integer[]} boxEndPos - marquee box end position
 * @param {String[]} canvasElementGuidsToSelect - Array of canvas element guids to be selected
 * @param {String[]} canvasElementGuidsToDeselect - Array of canvas element guids to be deselected
 */
const _getCanvasElementGuidsToSelectAndDeselect = (canvasElements, currentSelectedCanvasElementGuids, boxStartPos, boxEndPos, canvasElementGuidsToSelect = [], canvasElementGuidsToDeselect = []) => {
    canvasElements.forEach(({ locationX, locationY, config, guid, elementType }) => {
        const isCanvasElementOverlapped = isElementOverlapWithBox([locationX, locationY], [locationX + NODE_LENGTH, locationY + NODE_LENGTH], boxStartPos, boxEndPos);
        const isCanvasElementSelected = config && config.isSelected;
        if (!isCanvasElementSelected && isCanvasElementOverlapped) {
            // Todo: Without this check will throw exception when marquee select 'START_ELEMENT' and duplicate, can remove it once the refactoring of element config happens
            if (elementType !== 'START_ELEMENT') {
                canvasElementGuidsToSelect.push(guid);
            }
            currentSelectedCanvasElementGuids.add(guid);
        } else if (isCanvasElementSelected && !isCanvasElementOverlapped) {
            canvasElementGuidsToDeselect.push(guid);
            currentSelectedCanvasElementGuids.delete(guid);
        }
    });
    return { canvasElementGuidsToSelect, canvasElementGuidsToDeselect };
};

/**
 * Helper function to check if connectors need to be selected/deselected,
 * the connector would only be selected when both the source and targe nodes are selected.
 *
 * @param {Object[]} connectors - Array of connectors
 * @param {String[]} currentSelectedCanvasElementGuids - Array of current selected canvas elements
 * @param {String[]} connectorGuidsToSelect - Array of connector guids to be selected
 * @param {String[]} connectorGuidsToDeselect - Array of connector guids to be deselected
 */
const _getConnectorGuidsToSelectAndDeselect = (connectors, currentSelectedCanvasElementGuids, connectorGuidsToSelect = [], connectorGuidsToDeselect = []) => {
    connectors.forEach(({ source, target, config, guid }) => {
        const isSourceSeleted = currentSelectedCanvasElementGuids.has(source);
        const isTargetSelected = currentSelectedCanvasElementGuids.has(target);
        const isConnectorSelected = config && config.isSelected;
        if ((!isConnectorSelected && (isSourceSeleted && isTargetSelected))) {
            connectorGuidsToSelect.push(guid);
        } else if (isConnectorSelected && (!isSourceSeleted || !isTargetSelected)) {
            connectorGuidsToDeselect.push(guid);
        }
    });
    return { connectorGuidsToSelect, connectorGuidsToDeselect };
};

/**
 * Checks if the user is trying to multi-select, i.e. checks if the shift key is pressed during the event or not.
 *
 * @param {Object} event - Any event that needs to be checked for multi-selection
 * @returns {boolean}  Returns true if shift key is down during the event
 */
export const isMultiSelect = (event) => {
    return event && event.shiftKey;
};

/**
 * Checks if the user is trying to delete, i.e. checks if the delete shortcut is used during the event or not.
 *
 * @param {Object} event - Any event that needs to be checked for deletion
 * @returns {boolean}  Returns true if deletion shortcut is used during the event
 */
export const canDelete = (event, isCanvasMouseDown, isMarqueeModeOn) => {
    return event && (event.key === KEYS.BACKSPACE || event.key === KEYS.DELETE)
                 && !isCanvasMouseDown && !isMarqueeModeOn;
};

/**
 * Checks if the user is trying to zoom, i.e. checks if the zooming shortcut is used during the event or not.
 *
 * @param {Object} event - Any event that needs to be checked for zooming
 * @returns {boolean}  Returns true if zooming shortcut is used during the event
 */
export const canZoom = (event, isCanvasMouseDown, isMarqueeModeOn) => {
    return event && (event.metaKey || event.ctrlKey)
                 && (event.key === KEYS.NEGATIVE || event.key === KEYS.ZERO || event.key === KEYS.ONE || event.key === KEYS.EQUAL)
                 && !isCanvasMouseDown && !isMarqueeModeOn;
};

/**
 * Helper function to set the id and jsPlumb properties on the canvas elements. Also updates the drag selection and
 * pans the element into view if needed.
 *
 * @param {Object[]} canvasElementTemplates - Array of Canvas Element Templates
 * @returns {Object} canvasElementGuidToContainerMap - Map of Guid to Canvas Element Container
 */
export const setupCanvasElements = (canvasElementTemplates) => {
    const canvasElementGuidToContainerMap = {};
    const canvasElementTemplatesLength = canvasElementTemplates && canvasElementTemplates.length;
    for (let index = 0; index < canvasElementTemplatesLength; index++) {
        const canvasElementContainerTemplate = canvasElementTemplates[index];
        const canvasElementContainer = canvasElementContainerTemplate && canvasElementContainerTemplate.shadowRoot && canvasElementContainerTemplate.shadowRoot.firstChild;

        const canvasElementGuid = canvasElementContainerTemplate && canvasElementContainerTemplate.node && canvasElementContainerTemplate.node.guid;
        canvasElementGuidToContainerMap[canvasElementGuid] = canvasElementContainer;
        _setIdOnCanvasElementContainer(canvasElementContainer, canvasElementGuid);

        const elementType = canvasElementContainerTemplate && canvasElementContainerTemplate.node && canvasElementContainerTemplate.node.elementType;
        _setElementAsDraggable(canvasElementContainerTemplate, canvasElementContainer, elementType);
        _setElementAsTarget(canvasElementContainer, elementType);
        _setElementAsSource(canvasElementContainer);

        const canvasElementConfig = canvasElementContainerTemplate && canvasElementContainerTemplate.node && canvasElementContainerTemplate.node.config;
        _updateDragSelection(canvasElementContainer, canvasElementConfig);
    }

    return canvasElementGuidToContainerMap;
};

/**
 * Helper function to set the jsPlumb properties on the connectors along with updating the styling of the connectors.
 *
 * @param {Object[]} connectorTemplates - Array of connector templates
 * @param {Object} canvasElementGuidToContainerMap - Map of Guid to Canvas Element Container
 */
export const setupConnectors = (connectorTemplates, canvasElementGuidToContainerMap) => {
    if (!canvasElementGuidToContainerMap) {
        throw new Error('canvasElementGuidToContainerMap is not defined. It must be defined.');
    }

    const connectorTemplatesLength = connectorTemplates && connectorTemplates.length;
    for (let index = 0; index < connectorTemplatesLength; index++) {
        const connectorTemplate = connectorTemplates[index];
        const connector = connectorTemplate && connectorTemplate.connector;

        let jsPlumbConnector = connectorTemplate && connectorTemplate.getJsPlumbConnector && connectorTemplate.getJsPlumbConnector();

        if (!jsPlumbConnector) {
            const sourceElementContainer = canvasElementGuidToContainerMap[connector.source];
            const targetElementContainer = canvasElementGuidToContainerMap[connector.target];
            jsPlumbConnector = _setJsPlumbConnection(connectorTemplate, connector, sourceElementContainer, targetElementContainer);
            if (connector.config && connector.config.isSelected) {
                lib.selectConnector(jsPlumbConnector, connector.type);
            }
        } else {
            _updateConnectorStyling(connector, jsPlumbConnector);
            _setConnectorLabel(connector, jsPlumbConnector);
        }
    }
};

/**
 * Helper function to check elements (nodes && connectors) selection/deselection when starting the marquee
 *
 * @param {Object[]} canvasElements - Array of canvas elements
 * @param {Object[]} connectors - Array of connectors
 * @param {String[]} currentSelectedCanvasElementGuids - Array of current selected canvas element guids
 * @param {Integer[]} boxStartPos - marquee box start position
 * @param {Integer[]} boxEndPos - marquee box end position
 * @returns {Object} - Object of arrays containing the node && connector guids that needed to be selected && deselected
 */
export const checkMarqueeSelection = (canvasElements, connectors, currentSelectedCanvasElementGuids, boxStartPos, boxEndPos) => {
    if (!canvasElements) {
        throw new Error('canvasElements is not defined. It must be defined.');
    }

    if (!connectors) {
        throw new Error('connectors is not defined. It must be defined.');
    }

    const { canvasElementGuidsToSelect, canvasElementGuidsToDeselect } = _getCanvasElementGuidsToSelectAndDeselect(canvasElements, currentSelectedCanvasElementGuids, boxStartPos, boxEndPos);
    const { connectorGuidsToSelect, connectorGuidsToDeselect } = _getConnectorGuidsToSelectAndDeselect(connectors, currentSelectedCanvasElementGuids);

    return { canvasElementGuidsToSelect, canvasElementGuidsToDeselect, connectorGuidsToSelect, connectorGuidsToDeselect };
};