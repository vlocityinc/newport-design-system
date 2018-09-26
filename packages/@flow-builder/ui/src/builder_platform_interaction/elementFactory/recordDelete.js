import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const elementType = ELEMENT_TYPE.RECORD_DELETE;
const maxConnections = 2;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

export function createRecordDelete(recordDelete = {}) {
    const newRecordDelete = baseCanvasElement(recordDelete);
    const { inputReference = '', availableConnections = getDefaultAvailableConnections() } = recordDelete;

    const recordDeleteObject = Object.assign(newRecordDelete, {
        inputReference,
        maxConnections,
        availableConnections,
        elementType,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
    });

    return recordDeleteObject;
}

export function createRecordDeleteWithConnectors(recordDelete) {
    const newRecordDelete = createRecordDelete(recordDelete);

    const connectors = createConnectorObjects(
        recordDelete,
        newRecordDelete.guid
    );
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const recordDeleteObject = Object.assign(newRecordDelete, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([recordDeleteObject], connectors);
}

export function createRecordDeleteMetadataObject(recordDelete, config) {
    if (!recordDelete) {
        throw new Error('recordDelete is not defined');
    }

    const recordDeleteMetadata = baseCanvasElementMetadataObject(recordDelete, config);
    const { inputReference } = recordDelete;

    return Object.assign(recordDeleteMetadata, {
        inputReference
    });
}
