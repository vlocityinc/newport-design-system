import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
/**
 * Create a map of the next connector reference
 * @param element
 * @param type
 */
export function getMapping(element, type) {
    const mapping = {};
    const elementName = !element.name && type === ELEMENT_TYPE.START_ELEMENT ? type : element.name;
    if (element) {
        if (element.connector) {
            mapping[elementName] = {
                next: element.connector.targetReference,
                type
            };
        }
        if (element.nextValueConnector) {
            mapping[elementName] = {
                next: element.nextValueConnector.targetReference,
                type
            };
        }
    }
    return mapping;
}
