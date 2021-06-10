import {
    baseCanvasElement,
    createPastedCanvasElement,
    duplicateCanvasElement,
    baseCanvasElementsArrayToMap
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { createAssignmentItem, createAssignmentItemMetadataObject } from './assignment';
import { COLLECTION_PROCESSOR_SUB_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createSortOption, createSortOptionMetadataObject } from './sortOption';

const elementType = ELEMENT_TYPE.COLLECTION_PROCESSOR;
const maxConnections = 1;

/**
 * Create the collection processor object
 *
 * @param collectionProcessor - collection processor md
 * @returns collection processor object
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
 * Create the collection processor object
 *
 * @param collectionProcessor - collection processor md
 * @returns collection processor object
 */
function createCollectionProcessorItem(collectionProcessor) {
    const collectionProcessorType = collectionProcessor.collectionProcessorType
        ? collectionProcessor.collectionProcessorType
        : collectionProcessor.elementSubtype;
    const { collectionReference = null } = collectionProcessor;
    let { sortOptions = null, assignmentItems = null } = collectionProcessor;
    const cpItem = {
        collectionReference,
        collectionProcessorType,
        elementType,
        maxConnections,
        limit: collectionProcessor.limit ? collectionProcessor.limit.toString() : null
    };
    switch (collectionProcessorType) {
        case COLLECTION_PROCESSOR_SUB_TYPE.SORT: {
            if (sortOptions && sortOptions.length > 0) {
                sortOptions = sortOptions.map((sortOption) => createSortOption(sortOption));
            } else {
                const newSortOption = createSortOption();
                sortOptions = [newSortOption];
            }
            return Object.assign(cpItem, { sortOptions });
        }
        case COLLECTION_PROCESSOR_SUB_TYPE.MAP: {
            // create new assignment items
            if (assignmentItems && assignmentItems.length > 0) {
                assignmentItems = assignmentItems.map((assignmentItem) => createAssignmentItem(assignmentItem));
            } else {
                assignmentItems = [];
            }
            return Object.assign(cpItem, { assignmentItems });
        }
        default:
            return cpItem;
    }
}

/**
 * Function to create the pasted CollectionProcessor element
 *
 * @param {Object} dataForPasting - Data required to create the pasted element
 * @param dataForPasting.canvasElementToPaste collection processor object
 * @param dataForPasting.newGuid new guid
 * @param dataForPasting.newName new name
 * @param dataForPasting.canvasElementGuidMap Map containing element guids -> pasted element guids
 * @param dataForPasting.topCutOrCopiedGuid Guid of the top most cut or copied element
 * @param dataForPasting.bottomCutOrCopiedGuid Guid of the bottom most cut or copied element
 * @param dataForPasting.prev Guid of the element below which the cut/copied block will be pasted. This can be null when pasting at the top of a branch
 * @param dataForPasting.next Guid of the element above which the cut/copied block will be pasted. This can be null when pasting at the bottom of a branch
 * @param dataForPasting.parent Guid of the parent element. This has a value only when pasting at the top of a branch
 * @param dataForPasting.childIndex Index of the branch. This has a value only when pasting at the top of a branch
 * @returns the pasted collection processor node
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
 * Create a duplicated collection processor node with new name
 *
 * @param collectionProcessor collection processor object
 * @param newGuid new guid
 * @param newName new name
 * @returns {Object} new collection processor object
 */
export function createDuplicateCollectionProcessor(collectionProcessor = {}, newGuid, newName) {
    const newCollectionProcessor = createCollectionProcessor(collectionProcessor);
    return duplicateCanvasElement(newCollectionProcessor, newGuid, newName);
}

/**
 * Create collection processor metadata object
 *
 * @param collectionProcessor collection processor object
 * @param config the config
 * @returns {Object} collection processor metadata object
 */
export function createCollectionProcessorMetadataObject(collectionProcessor, config = {}) {
    if (!collectionProcessor) {
        throw new Error('collectionProcessor is not defined');
    }
    const { collectionReference = null, collectionProcessorType } = collectionProcessor;
    const newCollectionProcessor = baseCanvasElementMetadataObject(collectionProcessor, config);
    const item = createCollectionProcessorItemMetadataObject(collectionProcessor);
    return Object.assign(newCollectionProcessor, { collectionReference, collectionProcessorType }, item);
}

/**
 * Create collection processor metadata object
 *
 * @param collectionProcessor collection processor object
 * @returns {Object} collection processor metadata object
 */
function createCollectionProcessorItemMetadataObject(collectionProcessor) {
    const { collectionReference = null, collectionProcessorType, limit = null } = collectionProcessor;
    const cpItemMd = { collectionReference, collectionProcessorType, limit };
    let { sortOptions = null, assignmentItems = null } = collectionProcessor;
    switch (collectionProcessorType) {
        case COLLECTION_PROCESSOR_SUB_TYPE.SORT: {
            if (sortOptions && sortOptions.length > 0) {
                sortOptions = sortOptions.map((sortOption) => createSortOptionMetadataObject(sortOption));
            } else {
                const newSortOption = createSortOptionMetadataObject();
                sortOptions = [newSortOption];
            }
            return Object.assign(cpItemMd, { sortOptions });
        }
        case COLLECTION_PROCESSOR_SUB_TYPE.MAP: {
            if (assignmentItems && assignmentItems.length > 0) {
                assignmentItems = assignmentItems.map((assignmentItem) =>
                    createAssignmentItemMetadataObject(assignmentItem)
                );
            } else {
                assignmentItems = [];
            }
            return Object.assign(cpItemMd, { assignmentItems });
        }
        default:
            return cpItemMd;
    }
}

/**
 * Create collection processor with the connectors
 *
 * @param collectionProcessor collection processor object
 * @returns the map of connector's guid and collection processor node
 */
export function createCollectionProcessorWithConnectors(collectionProcessor) {
    const newCollectionProcessor = createCollectionProcessor(collectionProcessor);
    const connectors = createConnectorObjects(collectionProcessor, newCollectionProcessor.guid, null);
    const connectorCount = connectors ? connectors.length : 0;

    const collectionProcessorObject = Object.assign(newCollectionProcessor, { connectorCount });

    return baseCanvasElementsArrayToMap([collectionProcessorObject], connectors);
}
