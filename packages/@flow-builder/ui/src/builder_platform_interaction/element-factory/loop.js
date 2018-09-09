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

const elementType = ELEMENT_TYPE.LOOP;
const maxConnections = 2;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.LOOP_NEXT
    },
    {
        type: CONNECTOR_TYPE.LOOP_END
    }
];
const ITERATION_ORDER_ASCENDING = 'Asc';

export function createLoop(loop = {}) {
    const newLoop = baseCanvasElement(loop);
    const {
        assignNextValueToReference = null,
        collectionReference = null,
        iterationOrder = ITERATION_ORDER_ASCENDING,
        availableConnections = getDefaultAvailableConnections()
    } = loop;

    return Object.assign(newLoop, {
        assignNextValueToReference,
        collectionReference,
        iterationOrder,
        maxConnections,
        availableConnections,
        elementType
    });
}

export function createLoopWithConnectors(loop) {
    const newLoop = createLoop(loop);
    const connectors = createConnectorObjects(loop, newLoop.guid);
    const connectorCount = connectors ? connectors.length : 0;
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(
        defaultAvailableConnections,
        connectors
    );

    const loopObject = Object.assign(newLoop, {
        connectorCount,
        availableConnections
    });

    return baseCanvasElementsArrayToMap([loopObject], connectors);
}

export function createLoopMetadataObject(loop) {
    if (!loop) {
        throw new Error('loop is not defined');
    }

    const newLoop = baseCanvasElementMetadataObject(loop);
    const {
        assignNextValueToReference,
        collectionReference,
        iterationOrder
    } = loop;

    return Object.assign(newLoop, {
        assignNextValueToReference,
        collectionReference,
        iterationOrder
    });
}
