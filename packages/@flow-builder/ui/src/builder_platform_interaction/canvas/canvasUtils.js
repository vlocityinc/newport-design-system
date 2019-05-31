import { drawingLibInstance as lib} from "builder_platform_interaction/drawingLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

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
 * Checks if the user is trying to multi-select, i.e. checks if the shift key is pressed during the event or not.
 *
 * @param {Object} event - Any event that needs to be checked for multi-selection
 * @returns {boolean}  Returns true if shift key is down during the event
 */
export const isMultiSelect = (event) => {
    return event && event.shiftKey;
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