import { ELEMENT_TYPE, CONDITION_LOGIC, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap, baseChildElement
} from "./base/baseElement";
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from "builder_platform_interaction/connectorUtils";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import {baseCanvasElementMetadataObject, baseChildElementMetadataObject} from "./base/baseMetadata";
import {LABELS} from "./elementFactoryLabels";

// TODO: Refactor for commonalities with mutateOutcome in decisionEditorDataMutation
// https://gus.my.salesforce.com/a07B0000005YnL5IAK (W-5395893)
import {createCondition, createConditionMetadataObject} from "./decision";

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

export function createWaitEvent(waitEvent = {}) {
    const newWaitEvent = baseChildElement(waitEvent);
    const { conditionLogic = CONDITION_LOGIC.AND, dataType = FLOW_DATA_TYPE.BOOLEAN.value } = waitEvent;

    let { conditions } = waitEvent;
    if (conditions && conditions.length > 0) {
        conditions = conditions.map(condition => createCondition(condition));
    } else {
        const newCondition = createCondition();
        conditions = [newCondition];
    }

    return Object.assign(newWaitEvent, {
        conditions,
        conditionLogic,
        dataType,
        elementType: ELEMENT_TYPE.WAIT_EVENT
    });
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
            return createWaitEventMetadataObject(getElementByGuid(waitEventReference), config);
        });
    }
    return Object.assign(newWait, {
        rules: waitEvents,
        defaultConnectorLabel
    });
}

export function createWaitEventMetadataObject(waitEvent, config = {}) {
    if (!waitEvent) {
        throw new Error('Wait event is not defined');
    }

    const newWaitEvent = baseChildElementMetadataObject(waitEvent, config);
    let { conditions } = waitEvent;
    const { conditionLogic } = waitEvent;
    if (conditions && conditions.length > 0) {
        conditions = conditions.map(condition => createConditionMetadataObject(condition));
    }
    return Object.assign(newWaitEvent, {
        conditions,
        conditionLogic
    });
}
