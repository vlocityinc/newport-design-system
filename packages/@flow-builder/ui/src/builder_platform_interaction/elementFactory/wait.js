import { ELEMENT_TYPE, CONDITION_LOGIC, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    baseChildElement
} from "./base/baseElement";
import { createConnectorObjects } from './connector';
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

/**
 * @typedef waitEvent
 * @property {module:flowMetadata.CONDITION_LOGIC} conditionLogic - Condition logic for the wait event
 * @property {module:flowMetadata.ELEMENT_TYPE.WAIT_EVENT} elementType - ELEMENT_TYPE.WAIT_EVENT
 * @property {module:baseList.ListRowItem[]} conditions - array of conditions
 */

/**
 * @typedef waitEventReference
 * @property {String} waitEventReference - guid of the wait event
 */

/**
 * @typedef waitInStore - A wait object in the shape stored by the store, containing waitEventReferences
 * @property {waitEventReference[]} waitEventReferences - array of references
 */

/**
 * @typedef waitInPropertyEditor - A wait object in the shape used by the property editor, containing waitEvents
 * @property {waitEvent[]} waitEvent - array of waitEvents
 * @property {int} maxConnections = max number of connections,
 * @property {connection[]} availableConnections - connwections available for the wait,
 * @property {module:flowMetadata.ELEMENT_TYPE.WAIT} elementType - WAIT
 */

/**
 * Called when opening a property editor or copying a wait element
 * @param {waitInStore} wait
 * @return {waitInPropertyEditor} Wait in the shape expected by a property editor
 */
export function createWaitWithWaitEvents(wait = {}) {
    const newWait = baseCanvasElement(wait);
    // TODO: W-5395924 connections need to be done properly.

    let { waitEvents } = wait;
    const { waitEventReferences } = wait;

    if (waitEventReferences && waitEventReferences.length > 0) {
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

/**
 * Creates a waitEvent with defaults if needed
 * @param {waitEvent} waitEvent - waitEvent
 * @return {waitEvent}
 */
export function createWaitEvent(waitEvent = {conditionLogic : CONDITION_LOGIC.NO_CONDITIONS}) {
    return baseChildElement(waitEvent, ELEMENT_TYPE.WAIT_EVENT);
}

/**
 * Create a wait in the shape needed by the flow metadata
 * @param {waitInStore} wait - wait from the store
 * @param {Object} config - configuration for converting wait
 * @return {Object} wait in the shape for the metadata
 */
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
        waitEvents,
        defaultConnectorLabel
    });
}

/**
 * Given a wait element in a property editor, create a wait element in the shape expected by the store
 * @param {wait} wait - wait in the shape of the property editor
 * @return {
 *   {
 *     wait: wait,
 *     deletedWaitEvents: waitEvent[] , waitEvents: Array, elementType: string}
 * }
 */
export function createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor(wait) {
    const newWait = baseCanvasElement(wait);
    const { waitEvents } = wait;
    let waitEventReferences = [];
    let newWaitEvents = [];
    for (let i = 0; i < waitEvents.length; i++) {
        const waitEvent = waitEvents[i];
        const newWaitEvent = createWaitEvent(waitEvent);
        waitEventReferences = updateWaitEventReferences(waitEventReferences, newWaitEvent);
        newWaitEvents = [...newWaitEvents, newWaitEvent];
    }
    const deletedWaitEvents = getDeletedWaitEventsUsingStore(wait, newWaitEvents);
    Object.assign(newWait, {
        waitEventReferences,
        elementType
    });
    return {
        wait: newWait,
        deletedWaitEvents,
        waitEvents: newWaitEvents,
        elementType: ELEMENT_TYPE.WAIT_WITH_MODIFIED_AND_DELETED_WAIT_EVENTS
    };
}

/**
 * Create a wait in the shape of the store (with waitEvent references).  This is used when taking a flow element and
 * converting it for use in the store
 * @param {Object} wait - wait from metadata
 * @return {waitInStore} wait in the shape used by the store
 */
export function createWaitWithWaitEventReferences(wait = {}) {
    const newWait = baseCanvasElement(wait);
    let waitEvents = [], waitEventReferences = [], availableConnections = [];
    const { defaultConnectorLabel = LABELS.emptyDefaultWaitEventLabel, waitEventsFromMetadata = [] } = wait;
    // create connectors for wait which is default value. This can be refactor to update available connection as well.
    let connectors = createConnectorObjects(wait, newWait.guid);
    for (let i = 0; i < waitEventsFromMetadata.length; i++) {
        const waitEvent = createWaitEvent(waitEventsFromMetadata[i]);
        const connector = createConnectorObjects(waitEventsFromMetadata[i], waitEvent.guid, newWait.guid);
        waitEvents = [...waitEvents, waitEvent];
        // updating waitEventReferences
        waitEventReferences = updateWaitEventReferences(waitEventReferences, waitEvent);

        // TODO: W-5395924 - wait event connectors
        availableConnections = 0; // availableConnections = addRegularConnectorToAvailableConnections(availableConnections, rule);
        // connector is an array. FIX it.
        connectors = [...connectors, ...connector];
    }
    // TODO: W-5395924 - wait event connectors
    // availableConnections = addDefaultConnectorToAvailableConnections(availableConnections, decision);
    const connectorCount = connectors ? connectors.length : 0;
    // TODO: W-5395924 - wait event connectors
    // const maxConnections = calculateMaxConnections(decision);
    Object.assign(newWait, {
        waitEventReferences,
        defaultConnectorLabel,
        elementType,
        connectorCount,
        // TODO: W-5395924 - wait event connectors
        // maxConnections,
        availableConnections
    });
    return baseCanvasElementsArrayToMap([newWait, ...waitEvents], connectors);
}

function updateWaitEventReferences(waitEventReferences = [], waitEvent) {
    if (!waitEvent || !waitEvent.guid) {
        throw new Error('Either waitEvent or waitEvent.guid is not defined');
    }
    return [...waitEventReferences, {
        waitEventReference: waitEvent.guid
    }];
}

function getDeletedWaitEventsUsingStore(originalWait, newWaitEvents = []) {
    if (!originalWait) {
        throw new Error('wait is not defined');
    }
    const { guid } = originalWait;
    const waitFromStore = getElementByGuid(guid);
    let waitEventReferencesFromStore;
    if (waitFromStore) {
        waitEventReferencesFromStore = waitFromStore.waitEventReferences.map((waitEventReference) => waitEventReference.waitEventReference);
    }
    if (waitEventReferencesFromStore) {
        const newWaitEventGuids = newWaitEvents.map((newWaitEvent) => newWaitEvent.guid);
        return waitEventReferencesFromStore.filter((waitEventReferenceGuid) => {
            return !newWaitEventGuids.includes(waitEventReferenceGuid);
        }).map((waitEventReference) => getElementByGuid(waitEventReference));
    }
    return [];
}