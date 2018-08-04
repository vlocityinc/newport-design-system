export function baseElementMetadataObject(element = {}) {
    const { name = '' } = element;
    return ({
        name
    });
}

export function baseResourceMetadataObject(resource = {}) {
    const newResource = baseElementMetadataObject(resource);
    const { description = '' } = resource;
    return Object.assign(newResource, {
        description
    });
}

export function baseCanvasMetadataObject(canvasElement = {}) {
    const newCanvasElement = baseResourceMetadataObject(canvasElement);
    const { locationX = 0, locationY = 0 } = canvasElement;
    return Object.assign(newCanvasElement, {
        locationX,
        locationY
    });
}

export function baseChildElementMetadataObject(childElement = {}) {
    const newChildElement = baseElementMetadataObject(childElement);
    const { label = '' } = childElement;
    return Object.assign(newChildElement, {
        label
    });
}