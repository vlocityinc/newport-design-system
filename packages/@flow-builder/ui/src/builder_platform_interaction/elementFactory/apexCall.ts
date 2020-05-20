// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createActionCall, getDefaultAvailableConnections } from './actionCall';
import { createPastedCanvasElement, duplicateCanvasElement } from './base/baseElement';

const elementType = ELEMENT_TYPE.APEX_CALL;

/**
 * Either creates a new apex call or create a new copy of existing apex call
 * @param {Object} apexCall existing apex call which needs to be copied
 * @return {Object} newApexCall new apex call which is created
 */
export function createApexCall(apexCall = {}) {
    return createActionCall(apexCall, elementType);
}

export function createPastedApexCall({
    canvasElementToPaste,
    newGuid,
    newName,
    canvasElementGuidMap,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    prev,
    next,
    parent,
    childIndex
}) {
    const { duplicatedElement } = createDuplicateApexCall(canvasElementToPaste, newGuid, newName);

    const pastedCanvasElement = createPastedCanvasElement(
        duplicatedElement,
        canvasElementGuidMap,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        prev,
        next,
        parent,
        childIndex
    );

    return {
        pastedCanvasElement
    };
}

export function createDuplicateApexCall(apexCall, newGuid, newName) {
    const newApexCall = createApexCall(apexCall);
    Object.assign(newApexCall, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateApexCall = duplicateCanvasElement(newApexCall, newGuid, newName);

    return duplicateApexCall;
}
