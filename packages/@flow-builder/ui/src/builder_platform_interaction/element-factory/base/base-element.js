import { generateGuid } from 'builder_platform_interaction-store-lib';

export function baseElement(element = {}) {
    const { guid = generateGuid(), name = '' } = element;
    return ({
        guid,
        name
    });
}

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

export function baseElements(elementList) {
    const elements = {};
    for (let i = 0; i < elementList.length; i++) {
        const element = elementList[i];
        Object.assign(elements, {[element.guid]: element});
    }

    return { elements };
}

export function baseElementsWithConnectors(elementList, connectors) {
    const elements = baseElements(elementList);

    return Object.assign(elements, { connectors });
}