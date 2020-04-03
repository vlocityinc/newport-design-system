import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
/**
 * Create a map of the next connector references
 * @param element
 * @param type
 */
export function getMappings(element, type) {
    const mapping = {};
    const elementName = !element.name && type === ELEMENT_TYPE.START_ELEMENT ? type : element.name;
    if (element) {
        const connectors = getConnectors(element);
        mapping[elementName] = {
            next: connectors,
            type
        };
    }
    return mapping;
}

function getConnectors(element) {
    let connectors = [];
    if (element) {
        for (const [prop, value] of Object.entries(element)) {
            if (typeof value === 'object' && prop !== 'faultConnector') {
                const childConnectors = getConnectors(value);
                connectors = connectors.concat(childConnectors);
            } else if (prop === 'targetReference') {
                connectors.push(value);
            }
        }
    }
    return connectors;
}
