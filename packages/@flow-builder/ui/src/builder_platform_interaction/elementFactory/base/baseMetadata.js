import { createConnectorMetadataObjects } from '../connector';

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
    if (connectors) {
        connectorMetadata = createConnectorMetadataObjects(connectors, hasMultipleRegularConnectors);
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

export function baseChildElementMetadataObject(childElement = {}) {
    const newChildElement = baseElementMetadataObject(childElement);
    const { label = '' } = childElement;
    return Object.assign(newChildElement, {
        label
    });
}
