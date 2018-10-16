import {
    ELEMENT_TYPE,
    CONDITION_LOGIC,
    CONNECTOR_TYPE,
    WAIT_TIME_EVENT_TYPE
} from "builder_platform_interaction/flowMetadata";
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    baseChildElement,
    createCondition
} from "./base/baseElement";
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createConnectorObjects } from './connector';
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject, createConditionMetadataObject} from "./base/baseMetadata";
import { isObject } from 'builder_platform_interaction/commonUtils';
import { LABELS } from "./elementFactoryLabels";

const elementType = ELEMENT_TYPE.WAIT;
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
const MAX_CONNECTIONS_DEFAULT = 2;

/**
 * Turns an array of paramters into an object where each property contains one index of the array
 * This also creates inputParamter for each param
 * @param {Object[]} parameters list of parameters
 * @returns {Object} object where the key is the param name and the value is the parameter
 */
const inputParameterArrayToMap = (parameters) => {
    const arrayToMap = (acc, param) => {
        acc[param.name] = createInputParameter(param);
        return acc;
    };
    return parameters.reduce(arrayToMap, {});
};

/**
 * Turns an object of parameters into an array of metadata input parameters
 * @param {Object} parameters object of parameters
 * @retursn {Object[]} list of metadata parameters
 */
const inputParameterMapToArray = (parameters) => {
    const mapToArray = (paramName) => {
        return createInputParameterMetadataObject(parameters[paramName]);
    };
    return Object.keys(parameters).map(mapToArray);
};

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
    let { waitEvents } = wait;
    const { defaultConnectorLabel = LABELS.emptyDefaultWaitPathLabel, waitEventReferences } = wait;

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

    const maxConnections = calculateMaxWaitConnections(wait);
    return Object.assign(newWait, {
        waitEvents,
        defaultConnectorLabel,
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
export function createWaitEvent(waitEvent = {}) {
    const newWaitEvent = baseChildElement(waitEvent, ELEMENT_TYPE.WAIT_EVENT);
    const { eventType = WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME } = waitEvent;
    let {
        conditions = [],
        conditionLogic = CONDITION_LOGIC.NO_CONDITIONS,
        inputParameters = {},
    } = waitEvent;

    if (conditions.length > 0 && conditionLogic !== CONDITION_LOGIC.NO_CONDITIONS) {
        conditions = conditions.map(condition => createCondition(condition));
    } else {
        // wait events from metadata have AND as condition logic even when they have no conditions
        conditions = [createCondition()];
        conditionLogic = CONDITION_LOGIC.NO_CONDITIONS;
    }

    if (Array.isArray(inputParameters)) {
        inputParameters = inputParameterArrayToMap(inputParameters);
    }
    return Object.assign(newWaitEvent, {
        conditions,
        conditionLogic,
        eventType,
        inputParameters,
    });
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
    const { waitEventReferences, defaultConnectorLabel = LABELS.emptyDefaultWaitPathLabel} = wait;
    let waitEvents;
    if (waitEventReferences && waitEventReferences.length > 0) {
        waitEvents = waitEventReferences.map(({waitEventReference}) => {
            const waitEvent = getElementByGuid(waitEventReference);
            const metadataWaitEvent = baseChildElementMetadataObject(waitEvent, config);
            const { eventType } = waitEvent;
            let {
                inputParameters,
                conditions = [],
                conditionLogic
            } = waitEvent;

            if (conditions.length === 0 || conditionLogic === CONDITION_LOGIC.NO_CONDITIONS) {
                conditions = [];
                conditionLogic = CONDITION_LOGIC.AND;
            } else {
                conditions = conditions.map(condition => createConditionMetadataObject(condition));
            }

            if (isObject(inputParameters)) {
                inputParameters = inputParameterMapToArray(inputParameters);
            }
            return Object.assign({}, metadataWaitEvent, {
                conditions,
                conditionLogic,
                eventType,
                inputParameters,
            });
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
    const { defaultConnectorLabel = LABELS.emptyDefaultWaitPathLabel, waitEvents } = wait;
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
        elementType,
        defaultConnectorLabel
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
    let newWaitEvents = [], waitEventReferences = [], availableConnections = [];
    const { defaultConnectorLabel = LABELS.emptyDefaultWaitPathLabel, waitEvents = [] } = wait;
    // create connectors for wait, which initially are the default and fault ones.
    let connectors = createConnectorObjects(wait, newWait.guid);
    for (let i = 0; i < waitEvents.length; i++) {
        const waitEvent = createWaitEvent(waitEvents[i]);
        const connectorsFromWaitEvent = createConnectorObjects(waitEvents[i], waitEvent.guid, newWait.guid);
        // add the wait event connector to the list of connectors
        connectors = [...connectors, ...connectorsFromWaitEvent];
        newWaitEvents = [...newWaitEvents, waitEvent];
        // updating waitEventReferences
        waitEventReferences = updateWaitEventReferences(waitEventReferences, waitEvent);
        // updating availableConnections
        availableConnections = addRegularConnectorToAvailableConnections(availableConnections, waitEvents[i]);
    }
    availableConnections = addDefaultConnectorToAvailableConnections(availableConnections, wait);
    availableConnections = addFaultConnectorToAvailableConnections(availableConnections, wait);
    const connectorCount = connectors ? connectors.length : 0;
    const maxConnections = calculateMaxWaitConnections(wait);
    Object.assign(newWait, {
        waitEventReferences,
        defaultConnectorLabel,
        elementType,
        connectorCount,
        maxConnections,
        availableConnections
    });
    return baseCanvasElementsArrayToMap([newWait, ...newWaitEvents], connectors);
}

function calculateMaxWaitConnections(wait) {
    if (!wait) {
        throw new Error('Max connection cannot be calculated because wait object is not defined');
    }

    // TODO: Change this to get the value from connectorUtils when the connector utils are refactored:
    // W-5478126 https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000005ajm1IAA/view
    // Regular connectors for each event + default + fault
    let length = MAX_CONNECTIONS_DEFAULT;
    if (wait.waitEvents) {
        length = wait.waitEvents.length + MAX_CONNECTIONS_DEFAULT;
    }
    return length;
}

function addDefaultConnectorToAvailableConnections(availableConnections = [], wait) {
    if (!availableConnections || !wait) {
        throw new Error('Either availableConnections or wait is not defined');
    }
    const { defaultConnector } = wait;
    if (!defaultConnector) {
        return [...availableConnections, {
            type: CONNECTOR_TYPE.DEFAULT
        }];
    }
    return availableConnections;
}

function addFaultConnectorToAvailableConnections(availableConnections = [], wait) {
    if (!availableConnections || !wait) {
        throw new Error('Either availableConnections or wait is not defined');
    }
    const { faultConnector } = wait;
    if (!faultConnector) {
        return [...availableConnections, {
            type: CONNECTOR_TYPE.FAULT
        }];
    }
    return availableConnections;
}

function addRegularConnectorToAvailableConnections(availableConnections = [], waitEvent) {
    if (!availableConnections || !waitEvent || !waitEvent.name) {
        throw new Error('Either availableConnections or wait event is not defined');
    }
    const { name, connector } = waitEvent;

    if (!connector) {
        const childReference = name;
        return [...availableConnections, {
            type: CONNECTOR_TYPE.REGULAR,
            childReference
        }];
    }
    return availableConnections;
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
