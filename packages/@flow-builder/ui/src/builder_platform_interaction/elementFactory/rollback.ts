import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseCanvasElement, duplicateCanvasElement, baseCanvasElementsArrayToMap } from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';

const elementType = ELEMENT_TYPE.ROLLBACK;
const maxConnections = 1;

/**
 * @param rollback
 */
export function createRollback(rollback = {}) {
    const newRollback: UI.CanvasElement = <UI.CanvasElement>baseCanvasElement(rollback);
    return Object.assign(newRollback, {
        elementType,
        maxConnections
    });
}

/**
 * @param rollback
 * @param newGuid
 * @param newName
 */
export function createDuplicateRollback(rollback = {}, newGuid, newName) {
    const newRollback = createRollback(rollback);
    const duplicateRollback = duplicateCanvasElement(newRollback, newGuid, newName);

    return duplicateRollback;
}

/**
 * @param rollback
 */
export function createRollbackWithConnectors(rollback = {}) {
    const newRollback = createRollback(rollback);
    const connectors = createConnectorObjects(rollback, newRollback.guid, null);
    const connectorCount = connectors ? connectors.length : 0;

    const rollbackObject = Object.assign(newRollback, { connectorCount });

    return baseCanvasElementsArrayToMap([rollbackObject], connectors);
}

/**
 * @param rollback
 * @param config
 */
export function createRollbackMetadataObject(rollback, config = {}) {
    if (!rollback) {
        throw new Error('rollback is not defined');
    }
    const newRollback = baseCanvasElementMetadataObject(rollback, config);
    return Object.assign(newRollback);
}
