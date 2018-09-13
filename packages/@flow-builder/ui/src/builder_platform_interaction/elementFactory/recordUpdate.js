import { ELEMENT_TYPE, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from "./base/baseElement";
import { baseCanvasElementMetadataObject } from "./base/baseMetadata";
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from "builder_platform_interaction/connectorUtils";

const elementType = ELEMENT_TYPE.RECORD_UPDATE;
const maxConnections = 2;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

export function createRecordUpdate(recordUpdate = {}) {
    const newRecordUpdate = baseCanvasElement(recordUpdate);
    const { inputReference = '', availableConnections = getDefaultAvailableConnections() } = recordUpdate;

    const recordUpdateObject = Object.assign(newRecordUpdate, {
        inputReference,
        maxConnections,
        availableConnections,
        elementType
    });

    return recordUpdateObject;
}

export function createRecordUpdateWithConnectors(recordUpdate = {}) {
    const newRecordUpdate = createRecordUpdate(recordUpdate);

    const connectors = createConnectorObjects(
        recordUpdate,
        newRecordUpdate.guid
    );
    const availableConnections = removeFromAvailableConnections(getDefaultAvailableConnections(), connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const recordUpdateObject = Object.assign(newRecordUpdate, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([recordUpdateObject], connectors);
}

export function createRecordUpdateMetadataObject(recordUpdate, config) {
    if (!recordUpdate) {
        throw new Error('recordUpdate is not defined');
    }

    const recordUpdateMetadata = baseCanvasElementMetadataObject(recordUpdate, config);
    const { inputReference } = recordUpdate;

    return Object.assign(recordUpdateMetadata, {
        inputReference
    });
}
