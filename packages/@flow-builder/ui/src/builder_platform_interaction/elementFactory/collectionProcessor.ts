import {
    baseCanvasElement,
    createCondition,
    duplicateCanvasElement,
    baseCanvasElementsArrayToMap,
    INCOMPLETE_ELEMENT
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import {
    COLLECTION_PROCESSOR_SUB_TYPE,
    CONDITION_LOGIC,
    ELEMENT_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { createSortOption, createSortOptionMetadataObject } from './sortOption';
import { createMapItem, createMapItemMetadataObject } from './mapItem';
import { createFilterConditionItem, createFilterConditionMetadataObject } from './filterConditionItem';
import { Store } from 'builder_platform_interaction/storeLib';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';

const elementType = ELEMENT_TYPE.COLLECTION_PROCESSOR;
const maxConnections = 1;

/**
 * Create the collection processor object
 *
 * @param collectionProcessor - collection processor md
 * @param root0 store
 * @param root0.elements store elements
 * @returns collection processor object
 */
export function createCollectionProcessor(collectionProcessor = {}, { elements } = Store.getStore().getCurrentState()) {
    const newCollectionProcessor = baseCanvasElement(collectionProcessor);
    if (collectionProcessor) {
        return Object.assign(newCollectionProcessor, createCollectionProcessorItem(collectionProcessor, elements));
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
 * @param elements store elements
 * @returns collection processor object
 */
function createCollectionProcessorItem(collectionProcessor, elements) {
    const collectionProcessorType = collectionProcessor.collectionProcessorType
        ? collectionProcessor.collectionProcessorType
        : collectionProcessor.elementSubtype;
    const {
        collectionReference = null,
        assignNextValueToReference = null,
        conditionLogic = CONDITION_LOGIC.AND,
        formula = null,
        outputSObjectType = null
    } = collectionProcessor;
    let { conditions = [], sortOptions = null, mapItems = null } = collectionProcessor;
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
            if (mapItems && mapItems.length > 0) {
                mapItems = mapItems.map((mapItem) => createMapItem(mapItem, outputSObjectType));
            } else {
                mapItems = [];
            }
            return Object.assign(cpItem, {
                mapItems,
                assignNextValueToReference,
                outputSObjectType,
                dataType: FLOW_DATA_TYPE.SOBJECT.value,
                isCollection: true,
                subtype: outputSObjectType
            });
        }
        case COLLECTION_PROCESSOR_SUB_TYPE.FILTER: {
            if (conditions && conditions.length) {
                conditions = conditions.map((condition) =>
                    createFilterConditionItem(assignNextValueToReference, condition)
                );
            } else if (!formula) {
                const initFilterCondition = createCondition();
                conditions = [initFilterCondition];
            }
            let dataType, subtype;
            let complete = true;
            // When the flow is loaded, this factory is called twice. In the first phase, elements is empty. In the second phase, elements contain variables and
            // we can calculate dataType and subtype
            if (collectionReference) {
                const collectionVariable = getVariableOrField(collectionReference, elements);
                if (collectionVariable) {
                    ({ dataType, subtype } = collectionVariable);
                } else {
                    complete = false;
                }
                if (collectionVariable) {
                    ({ dataType, subtype } = collectionVariable);
                }
            }
            return Object.assign(
                cpItem,
                {
                    assignNextValueToReference,
                    conditions,
                    conditionLogic,
                    dataType,
                    subtype,
                    isCollection: true,
                    formula
                },
                complete ? {} : { [INCOMPLETE_ELEMENT]: true }
            );
        }
        default:
            return cpItem;
    }
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
    const {
        collectionReference = null,
        collectionProcessorType,
        limit = null,
        conditionLogic = null,
        formula = null,
        assignNextValueToReference = null,
        outputSObjectType = null
    } = collectionProcessor;
    const cpItemMd = { collectionReference, collectionProcessorType, limit };
    let { conditions = [], sortOptions = null, mapItems = null } = collectionProcessor;
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
            if (mapItems && mapItems.length > 0) {
                mapItems = mapItems.map((mapItem) => createMapItemMetadataObject(mapItem));
            } else {
                mapItems = [];
            }
            return Object.assign(cpItemMd, {
                mapItems,
                assignNextValueToReference,
                outputSObjectType
            });
        }
        case COLLECTION_PROCESSOR_SUB_TYPE.FILTER: {
            if (formula) {
                conditions = null;
            } else if (conditions && conditions.length) {
                conditions = conditions.map((condition) =>
                    createFilterConditionMetadataObject(assignNextValueToReference, condition)
                );
            }

            return Object.assign(cpItemMd, {
                assignNextValueToReference,
                conditions,
                conditionLogic,
                formula
            });
        }
        default:
            return cpItemMd;
    }
}

/**
 * Create collection processor with the connectors
 *
 * @param collectionProcessor collection processor object
 * @param root0 store
 * @param root0.elements store elements
 * @returns the map of connector's guid and collection processor node
 */
export function createCollectionProcessorWithConnectors(
    collectionProcessor = {},
    { elements } = Store.getStore().getCurrentState()
) {
    // @ts-ignore
    const newCollectionProcessor = createCollectionProcessor(collectionProcessor, { elements });
    const connectors = createConnectorObjects(collectionProcessor, newCollectionProcessor.guid, null);
    const connectorCount = connectors ? connectors.length : 0;

    const collectionProcessorObject = Object.assign(newCollectionProcessor, { connectorCount });

    return baseCanvasElementsArrayToMap([collectionProcessorObject], connectors);
}
