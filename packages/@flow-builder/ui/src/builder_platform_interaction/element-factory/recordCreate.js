import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from 'builder_platform_interaction-flow-metadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from './base/base-element';
import { baseCanvasElementMetadataObject } from './base/base-metadata';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from 'builder_platform_interaction-connector-utils';

const elementType = ELEMENT_TYPE.RECORD_CREATE;
const maxConnections = 2;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

export function createRecordCreate(recordCreate = {}) {
    const newRecordCreate = baseCanvasElement(recordCreate);
    const { inputReference = '', availableConnections = getDefaultAvailableConnections() } = recordCreate;

    const recordCreateObject = Object.assign(newRecordCreate, {
        inputReference,
        availableConnections,
        maxConnections,
        elementType
    });

    return recordCreateObject;
}

export function createRecordCreateWithConnectors(recordCreate) {
    const newRecordCreate = createRecordCreate(recordCreate);

    const connectors = createConnectorObjects(
        recordCreate,
        newRecordCreate.guid
    );
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const recordCreateObject = Object.assign(newRecordCreate, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([recordCreateObject], connectors);
}

export function createRecordCreateMetadataObject(recordCreate, config) {
    if (!recordCreate) {
        throw new Error('recordCreate is not defined');
    }

    const recordCreateMetadata = baseCanvasElementMetadataObject(recordCreate, config);
    const { inputReference } = recordCreate;

    return Object.assign(recordCreateMetadata, {
        inputReference
    });
}
