import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { LABELS } from "./elementFactoryLabels";
import { generateGuid } from "builder_platform_interaction/storeLib";

export const START_ELEMENT_LOCATION = {
    x: 50,
    y: 50
};
const maxConnections = 1;

/**
 * Method to create the start element object
 *
 * @returns {Object} startElement   the start element object
 */
export function createStartElement() {
    const guid = generateGuid(ELEMENT_TYPE.START_ELEMENT);
    const elementType = ELEMENT_TYPE.START_ELEMENT;
    const label = LABELS.startElementLabel;
    const locationX = START_ELEMENT_LOCATION.x;
    const locationY = START_ELEMENT_LOCATION.y;
    const config = { isSelected: false };
    const connectorCount = 0;

    const startElement = Object.assign(
        {},
        {
            guid,
            elementType,
            label,
            locationX,
            locationY,
            config,
            maxConnections,
            connectorCount
        }
    );

    return startElement;
}
