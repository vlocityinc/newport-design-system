// @ts-nocheck
import { forEachMetadataFlowElement } from 'builder_platform_interaction/flowMetadata';

/**
 * Get element with given name in the flow
 */
export const getMetadataFlowElementByName = (flow, name) => {
    let result;
    forEachMetadataFlowElement(flow.metadata, (metadataElement) => {
        if (name === metadataElement.name) {
            result = metadataElement;
        }
    });
    return result;
};
