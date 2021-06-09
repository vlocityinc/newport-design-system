import {
    baseCanvasElement,
    createPastedCanvasElement,
    duplicateCanvasElement,
    baseCanvasElementsArrayToMap
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { COLLECTION_PROCESSOR_SUB_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createSortOption, createSortOptionMetadataObject } from './sortOption';

const elementType = ELEMENT_TYPE.COLLECTION_PROCESSOR;
const maxConnections = 1;

/**
 * @param collectionProcessor
 */
export function createCollectionProcessor(collectionProcessor?) {
    const newCollectionProcessor = baseCanvasElement(collectionProcessor);
    if (collectionProcessor) {
        return Object.assign(newCollectionProcessor, createCollectionProcessorItem(collectionProcessor));
    }
    return Object.assign(newCollectionProcessor, {
        elementType,
        maxConnections
    });
}

/**
 * @param collectionProcessor
 */
function createCollectionProcessorItem(collectionProcessor) {
    const collectionProcessorType = collectionProcessor.collectionProcessorType
        ? collectionProcessor.collectionProcessorType
        : collectionProcessor.elementSubtype;
    const { collectionReference = null } = collectionProcessor;
    switch (collectionProcessorType) {
        case COLLECTION_PROCESSOR_SUB_TYPE.SORT: {
            let { sortOptions } = collectionProcessor;
            if (sortOptions && sortOptions.length > 0) {
                sortOptions = sortOptions.map((sortOption) => createSortOption(sortOption));
            } else {
                const newSortOption = createSortOption();
                sortOptions = [newSortOption];
            }
            return {
                collectionReference,
                collectionProcessorType,
                limit: collectionProcessor.limit ? collectionProcessor.limit.toString() : null,
                sortOptions,
                elementType,
                maxConnections
            };
        }
        default:
            return {
                collectionReference,
                collectionProcessorType,
                elementType,
                maxConnections
            };
    }
}

/**
 * Function to create the pasted CollectionProcessor element
 *
 * @param {Object} dataForPasting - Data required to create the pasted element
 * @param dataForPasting.canvasElementToPaste
 * @param dataForPasting.newGuid
 * @param dataForPasting.newName
 * @param dataForPasting.canvasElementGuidMap
 * @param dataForPasting.topCutOrCopiedGuid
 * @param dataForPasting.bottomCutOrCopiedGuid
 * @param dataForPasting.prev
 * @param dataForPasting.next
 * @param dataForPasting.parent
 * @param dataForPasting.childIndex
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

/**
 * @param collectionProcessor
 * @param newGuid
 * @param newName
 */
export function createDuplicateCollectionProcessor(collectionProcessor = {}, newGuid, newName) {
    const newCollectionProcessor = createCollectionProcessor(collectionProcessor);
    return duplicateCanvasElement(newCollectionProcessor, newGuid, newName);
}

/**
 * @param collectionProcessor
 * @param config
 */
export function createCollectionProcessorMetadataObject(collectionProcessor, config = {}) {
    if (!collectionProcessor) {
        throw new Error('collectionProcessor is not defined');
    }
    const { collectionReference = null, collectionProcessorType } = collectionProcessor;
    const newCollectionProcessor = baseCanvasElementMetadataObject(collectionProcessor, config);
    const item = createCollectionProcessorItemMetadataObject(collectionProcessorType, collectionProcessor);
    return Object.assign(newCollectionProcessor, { collectionReference, collectionProcessorType }, item);
}

/**
 * @param collectionProcessorType
 * @param collectionProcessor
 */
function createCollectionProcessorItemMetadataObject(collectionProcessorType, collectionProcessor) {
    switch (collectionProcessorType) {
        case COLLECTION_PROCESSOR_SUB_TYPE.SORT: {
            const limit = collectionProcessor.limit;
            let { sortOptions } = collectionProcessor;
            if (sortOptions && sortOptions.length > 0) {
                sortOptions = sortOptions.map((sortOption) => createSortOptionMetadataObject(sortOption));
            } else {
                const newSortOption = createSortOptionMetadataObject();
                sortOptions = [newSortOption];
            }
            return { limit, sortOptions };
        }
        default:
            return {};
    }
}

/**
 * @param collectionProcessor
 */
export function createCollectionProcessorWithConnectors(collectionProcessor) {
    const newCollectionProcessor = createCollectionProcessor(collectionProcessor);
    const connectors = createConnectorObjects(collectionProcessor, newCollectionProcessor.guid, null);
    const connectorCount = connectors ? connectors.length : 0;

    const collectionProcessorObject = Object.assign(newCollectionProcessor, { connectorCount });

    return baseCanvasElementsArrayToMap([collectionProcessorObject], connectors);
}
