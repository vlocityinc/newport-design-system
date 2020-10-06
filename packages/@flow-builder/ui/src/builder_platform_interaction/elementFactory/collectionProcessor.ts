import {
    baseCanvasElement,
    createPastedCanvasElement,
    duplicateCanvasElement,
    baseCanvasElementsArrayToMap
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const elementType = ELEMENT_TYPE.COLLECTION_PROCESSOR;
const maxConnections = 1;

export function createCollectionProcessor(collectionProcessor?) {
    const newCollectionProcessor = baseCanvasElement(collectionProcessor);
    const collectionProcessorObject = Object.assign(newCollectionProcessor, {
        maxConnections,
        elementType
    });
    return collectionProcessorObject;
}

/**
 * Function to create the pasted CollectionProcessor element
 *
 * @param {Object} dataForPasting - Data required to create the pasted element
 */
export function createPastedCollectionProcessor({
    canvasElementToPaste,
    newGuid,
    newName,
    canvasElementGuidMap,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    prev,
    next,
    parent,
    childIndex
}) {
    const { duplicatedElement } = createDuplicateCollectionProcessor(canvasElementToPaste, newGuid, newName);

    const pastedCanvasElement = createPastedCanvasElement(
        duplicatedElement,
        canvasElementGuidMap,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        prev,
        next,
        parent,
        childIndex
    );

    return {
        pastedCanvasElement
    };
}

export function createDuplicateCollectionProcessor(collectionProcessor = {}, newGuid, newName) {
    const newCollectionProcessor = createCollectionProcessor(collectionProcessor);
    return duplicateCanvasElement(newCollectionProcessor, newGuid, newName);
}

export function createCollectionProcessorMetadataObject(collectionProcessor, config = {}) {
    if (!collectionProcessor) {
        throw new Error('collectionProcessor is not defined');
    }

    return baseCanvasElementMetadataObject(collectionProcessor, config);
}

export function createCollectionProcessorWithConnectors(collectionProcessor) {
    const newCollectionProcessor = createCollectionProcessor(collectionProcessor);
    const connectors = createConnectorObjects(collectionProcessor, collectionProcessor.guid, null);
    const connectorCount = connectors ? connectors.length : 0;

    const collectionProcessorObject = Object.assign(newCollectionProcessor, { connectorCount });

    return baseCanvasElementsArrayToMap([collectionProcessorObject], connectors);
}
