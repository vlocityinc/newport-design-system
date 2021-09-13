// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createActionCall, getDefaultAvailableConnections } from './actionCall';
import { duplicateCanvasElement } from './base/baseElement';

const elementType = ELEMENT_TYPE.APEX_CALL;

/**
 * Either creates a new apex call or create a new copy of existing apex call
 *
 * @param {Object} apexCall existing apex call which needs to be copied
 * @returns {Object} newApexCall new apex call which is created
 */
export function createApexCall(apexCall = {}) {
    return createActionCall(apexCall, elementType);
}

/**
 * @param apexCall
 * @param newGuid
 * @param newName
 */
export function createDuplicateApexCall(apexCall, newGuid, newName) {
    const newApexCall = createApexCall(apexCall);
    Object.assign(newApexCall, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateApexCall = duplicateCanvasElement(newApexCall, newGuid, newName);

    return duplicateApexCall;
}
