import { createSelector } from 'builder_platform_interaction-store-lib';
import { pick } from 'builder_platform_interaction-data-mutation-lib';

const elementsSelector = (state) => state.elements;

const canvasElementsSelector = (state) => state.canvasElements;

/**
 * Transform canvas elements guids to shape canvas expects
 * @param {Object} elements list of all the elements
 * @param {Object} canvasElements list of guids of canvas elements
 * @return {Array} collection of canvas elements
 */
const getCanvasElements = (elements, canvasElements) => canvasElements.reduce((acc, guid) => {
    const element = elements[guid];
    // TODO: pick doesn't support deep copy, so relying on object.assign. Need to fix it after pick support deepcopy
    const newElement = pick(element, ['guid', 'elementType', 'description', 'label', 'locationX', 'locationY', 'config', 'connector']);
    acc.nodes.push(newElement);

    const connector = {};
    if (element && element.connector && element.connector.targetReference !== undefined) {
        connector.source = element.guid;
        connector.target = element.connector.targetReference;
        connector.label = 'Label';
        connector.config = element.connector.config;
        connector.jsPlumbConnector = element.connector.jsPlumbConnector;
        acc.connectors.push(connector);
    }

    return acc;
}, {nodes: [], connectors: []});

export const canvasSelector = createSelector([elementsSelector, canvasElementsSelector], getCanvasElements);