export function baseMetadataObject(element = {}) {
    const { name = '', label = '', description = '' } = element;
    return ({
        name,
        label,
        description
    });
}

export function baseCanvasMetadataObject(canvasElement = {}) {
    const newCanvasElement = baseMetadataObject(canvasElement);
    const { locationX = 0, locationY = 0 } = canvasElement;
    return Object.assign(newCanvasElement, {
        locationX,
        locationY
    });
}