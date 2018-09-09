import { generateGuid } from 'builder_platform_interaction-store-lib';

export function baseResource(resource = {}) {
    const newResource = baseElement(resource);
    const { description = '' } = resource;
    return Object.assign(newResource, {
        description
    });
}

export function baseCanvasElement(canvasElement = {}) {
    const newCanvasElement = baseResource(canvasElement);
    const { label = '', locationX = 0, locationY = 0, connectorCount = 0, availableConnections, config = { isSelected: false} } = canvasElement;
    return Object.assign(newCanvasElement, {
        label,
        locationX,
        locationY,
        isCanvasElement: true,
        connectorCount,
        availableConnections,
        config
    });
}

export function baseChildElement(childElement = {}) {
    const newChildElement = baseElement(childElement);
    const { label = '' } = childElement;
    return Object.assign(newChildElement, {
        label
    });
}

export function baseCanvasElementsArrayToMap(elementList = [], connectors = []) {
    const elements = baseElementsArrayToMap(elementList);
    return Object.assign(elements, {
        connectors
    });
}

export function baseElementsArrayToMap(elementList = []) {
    const elements = elementList.reduce((acc, element) => {
        return Object.assign(acc, {[element.guid]: element});
    }, {});
    return {
        elements
    };
}

function baseElement(element = {}) {
    const { guid = generateGuid(), name = '' } = element;
    return ({
        guid,
        name
    });
}