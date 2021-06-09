import { forEachMetadataFlowElement } from 'builder_platform_interaction/flowMetadata';

/**
 * Get element with given name in the flow
 *
 * @param flow
 * @param name
 */
export const getMetadataFlowElementByName = (flow, name: string) => {
    let result;
    forEachMetadataFlowElement(flow.metadata, undefined, (metadataElement) => {
        if (name === metadataElement.name) {
            result = metadataElement;
        }
    });
    return result;
};

export const getMetadataAutomaticField = (flow, screenName: string, objectFieldReference: string) => {
    const screenElement = getMetadataFlowElementByName(flow, screenName);
    if (!screenElement) {
        return undefined;
    }
    return getMetadataScreenField(screenElement, (field) => field.objectFieldReference === objectFieldReference);
};

const getMetadataScreenField = (screenOrScreenField, filter: (screenField) => boolean) => {
    for (const field of screenOrScreenField.fields) {
        if (filter(field)) {
            return field;
        }
        const matchingScreenField = getMetadataScreenField(field, filter);
        if (matchingScreenField) {
            return matchingScreenField;
        }
    }
    return undefined;
};
