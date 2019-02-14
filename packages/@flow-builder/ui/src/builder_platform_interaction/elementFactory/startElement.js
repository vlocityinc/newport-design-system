import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { LABELS } from "./elementFactoryLabels";
import { baseCanvasElement, baseCanvasElementsArrayToMap } from "./base/baseElement";
import { createStartElementConnector } from "./connector";

export const START_ELEMENT_LOCATION = {
    x: 50,
    y: 50
};
const maxConnections = 1;
const elementType = ELEMENT_TYPE.START_ELEMENT;

/**
 * create the start element object. Start element exists on client side only
 * @returns {Object} startElement the start element object
 */
export function createStartElement() {
    const newStartElement = baseCanvasElement({
        label: LABELS.startElementLabel,
        locationX: START_ELEMENT_LOCATION.x,
        locationY: START_ELEMENT_LOCATION.y
    });

    Object.assign(newStartElement,
        {
            elementType,
            maxConnections
        }
    );
    return newStartElement;
}

/**
 * create the start element object with connectors. It is used during translation.
 * @param {string} startElementReference guid/name of the start element
 * @returns {Object} startElement the start element object
 */
export function createStartElementWithConnectors(startElementReference) {
    const newStartElement = createStartElement();
    let connectors = [];
    if (startElementReference) {
        connectors = createStartElementConnector(newStartElement.guid, startElementReference);
    }
    const connectorCount = connectors.length;
    Object.assign(newStartElement, { connectorCount });
    return baseCanvasElementsArrayToMap([newStartElement], connectors);
}
