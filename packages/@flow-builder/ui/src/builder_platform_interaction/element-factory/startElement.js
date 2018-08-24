import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { LABELS } from './element-factory-labels';
import { generateGuid } from 'builder_platform_interaction-store-lib';

export const START_ELEMENT_X_Y = {
    x: 50,
    y: 50
};

/**
 * Method to create the start element object
 *
 * @returns {Object} startElement   the start element object
 */
export function createStartElement() {
    const guid = generateGuid(ELEMENT_TYPE.START_ELEMENT);
    const elementType = ELEMENT_TYPE.START_ELEMENT;
    const label = LABELS.startElementLabel;
    const locationX = START_ELEMENT_X_Y.x;
    const locationY = START_ELEMENT_X_Y.y;
    const config = { isSelected: false };
    const maxConnections = 1;
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
