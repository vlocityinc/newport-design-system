import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from "builder_platform_interaction/flowMetadata";
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from "./base/baseElement";
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from "builder_platform_interaction/connectorUtils";

const elementType = ELEMENT_TYPE.WAIT;
const maxConnections = 2;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    },
    {
        type: CONNECTOR_TYPE.DEFAULT
    }
];

export function createWait(wait = {}) {
    const newWait = baseCanvasElement(wait);
    // TODO: W-5395924 connections need to be done properly.
    const {
        availableConnections = getDefaultAvailableConnections()
    } = wait;

    return Object.assign(newWait, {
        maxConnections,
        availableConnections,
        elementType
    });
}

export function createWaitWithConnectors(wait) {
    const newWait = createWait(wait);
    const connectors = createConnectorObjects(wait, newWait.guid);
    // TODO: W-5395924 connections need to be done properly.
    const connectorCount = connectors ? connectors.length : 0;
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(
        defaultAvailableConnections,
        connectors
    );

    const waitObject = Object.assign(newWait, {
        connectorCount,
        availableConnections
    });

    return baseCanvasElementsArrayToMap([waitObject], connectors);
}

export function createWaitMetadataObject() {
    // TODO: saving flow will work after W-5395893
}
