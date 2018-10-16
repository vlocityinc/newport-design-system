import { createConnectorMetadataObjects } from '../connector';
import { createFEROVMetadataObject } from "../ferov";
import { RHS_DATA_TYPE_PROPERTY, RHS_PROPERTY } from "./baseList";

function baseElementMetadataObject(element = {}) {
    const { name = '' } = element;
    return {
        name
    };
}

export function baseResourceMetadataObject(resource = {}) {
    const newResource = baseElementMetadataObject(resource);
    const { description = '' } = resource;
    return Object.assign(newResource, {
        description
    });
}

export function baseCanvasElementMetadataObject(canvasElement = {}, config = {}) {
    const newCanvasElement = baseResourceMetadataObject(canvasElement);
    const { xyTranslate, connectorMap = {}, hasMultipleRegularConnectors = false } = config;
    const { label = '' } = canvasElement;
    let { locationX = 0, locationY = 0 } = canvasElement;

    if (xyTranslate) {
        locationX += xyTranslate.translateX;
        locationY += xyTranslate.translateY;
    }

    let connectorMetadata;
    const connectors = connectorMap[canvasElement.guid];
    const { elementType } = canvasElement;

    if (connectors) {
        connectorMetadata = createConnectorMetadataObjects(connectors, hasMultipleRegularConnectors, elementType);
    }

    return Object.assign(
        newCanvasElement,
        {
            label,
            locationX,
            locationY
        },
        connectorMetadata
    );
}

/**
 * @typedef {Object} MetadataChildElement
 * @property {String} label - element label
 * @property {String} name - element devName
 * @property {module:flowMetadata.CONDITION_LOGIC} conditionLogic - element condition logic
 * @property {module:connector.ConnectorMetadata[]} conditions - array of conditions
 */

/**
 * Given a store element, create a metadata child element
 * @param {module:baseElement.Childelement} childElement - store representation of a child element
 * @param {Object} config - flow config
 * @return {MetadataChildElement}
 */
export function baseChildElementMetadataObject(childElement = {}, config = {}) {
    const newChildElement = baseElementMetadataObject(childElement);
    const { label = '', } = childElement;
    const { connectorMap = {} } = config;
    const connectors = connectorMap[childElement.guid];

    let connectorMetadata;
    if (connectors) {
        connectorMetadata = createConnectorMetadataObjects(connectors, false);
    }
    return Object.assign(newChildElement,
        { label },
        connectorMetadata
    );
}

export function createConditionMetadataObject(condition) {
    if (!condition) {
        throw new Error('Condition is not defined');
    }
    const { leftHandSide, operator } = condition;
    const rightValue = createFEROVMetadataObject(condition, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
    return Object.assign({}, {
        leftValueReference: leftHandSide,
        rightValue,
        operator
    });
}

