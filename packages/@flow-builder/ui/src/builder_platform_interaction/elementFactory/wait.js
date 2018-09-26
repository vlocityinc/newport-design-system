import { ELEMENT_TYPE, CONDITION_LOGIC, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    baseChildElement
} from "./base/baseElement";
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from "builder_platform_interaction/connectorUtils";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject } from "./base/baseMetadata";
import { LABELS } from "./elementFactoryLabels";

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

// For Opening Property editor or copying a wait element
export function createWaitWithWaitEvents(wait = {}) {
    const newWait = baseCanvasElement(wait);
    // TODO: W-5395924 connections need to be done properly.

    let { waitEvents } = wait;
    const { waitEventReferences } = wait;

    if (waitEvents && waitEvents.length > 0) {
        waitEvents = waitEvents.map(waitEvent => createWaitEvent(waitEvent));
    } else if (waitEventReferences && waitEventReferences.length > 0) {
        // Decouple waitEvent from store.
        waitEvents = waitEventReferences.map(waitEventReference =>
            createWaitEvent(getElementByGuid(waitEventReference.waitEventReference))
        );
    } else {
        const newWaitEvent = createWaitEvent();
        waitEvents = [newWaitEvent];
    }

    const {
        availableConnections = getDefaultAvailableConnections()
    } = wait;

    return Object.assign(newWait, {
        waitEvents,
        maxConnections,
        availableConnections,
        elementType
    });
}

export function createWaitWithConnectors(wait) {
    const newWait = createWaitWithWaitEvents(wait);
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

export function createWaitEvent(waitEvent = {conditionLogic : CONDITION_LOGIC.NO_CONDITIONS}) {
    return baseChildElement(waitEvent, ELEMENT_TYPE.WAIT_EVENT);
}

export function createWaitMetadataObject(wait, config = {}) {
    if (!wait) {
        throw new Error('Wait is not defined');
    }
    const newWait = baseCanvasElementMetadataObject(wait, config);
    const { waitEventReferences, defaultConnectorLabel = LABELS.emptyDefaultWaitEventLabel} = wait;
    let waitEvents;
    if (waitEventReferences && waitEventReferences.length > 0) {
        waitEvents = waitEventReferences.map(({waitEventReference}) => {
            return baseChildElementMetadataObject(getElementByGuid(waitEventReference), config);
        });
    }
    return Object.assign(newWait, {
        rules: waitEvents,
        defaultConnectorLabel
    });
}
