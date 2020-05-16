// @ts-nocheck
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    duplicateCanvasElement,
    baseCanvasElementsArrayToMap,
    INCOMPLETE_ELEMENT
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getElementByGuidFromState, getElementByDevNameFromState } from 'builder_platform_interaction/storeUtils';
import { Store } from 'builder_platform_interaction/storeLib';

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

export function createLoop(loop = {}, { elements } = Store.getStore().getCurrentState()) {
    const newLoop = baseCanvasElement(loop);
    const {
        assignNextValueToReference = null,
        assignNextValueToReferenceIndex = generateGuid(),
        collectionReference = null,
        collectionReferenceIndex = generateGuid(),
        iterationOrder = ITERATION_ORDER_ASCENDING,
        availableConnections = getDefaultAvailableConnections()
    } = loop;

    let dataType, subtype;
    let complete = true;
    const storeOutputAutomatically = assignNextValueToReference === null;

    if (storeOutputAutomatically && collectionReference) {
        // When the flow is loaded, this factory is called twice. In the first phase, elements is empty. In the second phase, elements is set and
        // we can calculate dataType and subtype
        const loopedCollection =
            getElementByGuidFromState({ elements }, collectionReference) ||
            getElementByDevNameFromState({ elements }, collectionReference);
        if (loopedCollection) {
            ({ dataType, subtype } = loopedCollection);
        } else {
            complete = false;
        }
    }
    return Object.assign(
        newLoop,
        {
            assignNextValueToReference,
            assignNextValueToReferenceIndex,
            collectionReference,
            collectionReferenceIndex,
            iterationOrder,
            maxConnections,
            availableConnections,
            elementType,
            storeOutputAutomatically,
            dataType,
            subtype
        },
        complete ? {} : { [INCOMPLETE_ELEMENT]: true }
    );
}

export function createDuplicateLoop(loop, newGuid, newName) {
    const newLoop = createLoop(loop);
    Object.assign(newLoop, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateLoop = duplicateCanvasElement(newLoop, newGuid, newName);

    return duplicateLoop;
}

export function createLoopWithConnectors(loop, { elements } = Store.getStore().getCurrentState()) {
    const newLoop = createLoop(loop, { elements });
    const connectors = createConnectorObjects(loop, newLoop.guid);
    const connectorCount = connectors ? connectors.length : 0;
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);

    const loopObject = Object.assign(newLoop, {
        connectorCount,
        availableConnections
    });

    return baseCanvasElementsArrayToMap([loopObject], connectors);
}

export function createLoopMetadataObject(loop, config = {}) {
    if (!loop) {
        throw new Error('loop is not defined');
    }

    const newLoop = baseCanvasElementMetadataObject(loop, config);
    const { assignNextValueToReference, collectionReference, iterationOrder } = loop;

    return Object.assign(newLoop, {
        assignNextValueToReference,
        collectionReference,
        iterationOrder
    });
}
