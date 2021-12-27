// @ts-nocheck
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import {
    baseCanvasElementsArrayToMap,
    baseCanvasElementWithFault,
    createAvailableConnection,
    duplicateCanvasElement
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import {
    createFilterMetadataObject,
    createRecordFilters,
    getDefaultAvailableConnections
} from './base/baseRecordElement';
import { createConnectorObjects } from './connector';

const MAX_CONNECTIONS = 2;

const getAvailableConnections = (recordDelete) => {
    const { availableConnections } = recordDelete;
    return availableConnections
        ? availableConnections.map((availableConnection) => createAvailableConnection(availableConnection))
        : getDefaultAvailableConnections();
};

/**
 * @param recordDelete
 */
export function createRecordDelete(recordDelete = {}) {
    const newRecordDelete = baseCanvasElementWithFault(recordDelete);
    const {
        inputReference = '',
        inputReferenceIndex = generateGuid(),
        object = '',
        objectIndex = generateGuid(),
        filterLogic = CONDITION_LOGIC.AND,
        filters,
        isNew
    } = recordDelete;
    const availableConnections = getAvailableConnections(recordDelete);

    const useSobject = isNew || !!inputReference;

    return Object.assign(newRecordDelete, {
        inputReference,
        inputReferenceIndex,
        object,
        objectIndex,
        filterLogic,
        filters: createRecordFilters(filters, object, []),
        maxConnections: MAX_CONNECTIONS,
        availableConnections,
        elementType: ELEMENT_TYPE.RECORD_DELETE,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
        useSobject
    });
}

/**
 * @param recordDelete
 * @param newGuid
 * @param newName
 */
export function createDuplicateRecordDelete(recordDelete, newGuid, newName) {
    const newRecordDelete = createRecordDelete(recordDelete);
    Object.assign(newRecordDelete, {
        availableConnections: getDefaultAvailableConnections()
    });
    return duplicateCanvasElement(newRecordDelete, newGuid, newName);
}

/**
 * @param recordDelete
 */
export function createRecordDeleteWithConnectors(recordDelete) {
    const newRecordDelete = createRecordDelete(recordDelete);

    const connectors = createConnectorObjects(recordDelete, newRecordDelete.guid);
    const availableConnections = removeFromAvailableConnections(getDefaultAvailableConnections(), connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const recordDeleteObject = Object.assign(newRecordDelete, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([recordDeleteObject], connectors);
}

/**
 * @param recordDelete
 * @param config
 */
export function createRecordDeleteMetadataObject(recordDelete, config) {
    if (!recordDelete) {
        throw new Error('recordDelete is not defined');
    }

    const recordDeleteMetadata = baseCanvasElementMetadataObject(recordDelete, config);
    const { inputReference, object, filterLogic } = recordDelete;
    if (inputReference) {
        return Object.assign(recordDeleteMetadata, {
            inputReference,
            filters: []
        });
    }

    let { filters = [] } = recordDelete;
    filters = filters.map((filter) => createFilterMetadataObject(filter));
    return Object.assign(recordDeleteMetadata, {
        object,
        filterLogic,
        filters
    });
}
