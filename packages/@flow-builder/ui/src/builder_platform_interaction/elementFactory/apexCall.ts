// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createActionCall, getDefaultAvailableConnections } from './actionCall';
import { createPastedCanvasElement, duplicateCanvasElement } from './base/baseElement';

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
 * @param root0
 * @param root0.canvasElementToPaste
 * @param root0.newGuid
 * @param root0.newName
 * @param root0.canvasElementGuidMap
 * @param root0.topCutOrCopiedGuid
 * @param root0.bottomCutOrCopiedGuid
 * @param root0.source - The connection source
 * @param root0.next - The next guid
 */
export function createPastedApexCall({
    canvasElementToPaste,
    newGuid,
    newName,
    canvasElementGuidMap,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    source,
    next
}) {
    const { duplicatedElement } = createDuplicateApexCall(canvasElementToPaste, newGuid, newName);

    const pastedCanvasElement = createPastedCanvasElement(
        duplicatedElement,
        canvasElementGuidMap,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        source,
        next
    );

    return {
        pastedCanvasElement
    };
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
