// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createActionCall, getDefaultAvailableConnections } from './actionCall';
import { createPastedCanvasElement, duplicateCanvasElement } from './base/baseElement';

const elementType = ELEMENT_TYPE.EMAIL_ALERT;

/**
 * Either creates a new email alert or create a new copy of existing email alert
 * @param {Object} emailAlert existing email alert which needs to be copied
 * @return {Object} newEmailAlert new email alert which is created
 */
export function createEmailAlert(emailAlert = {}) {
    emailAlert.storeOutputAutomatically = false;
    return createActionCall(emailAlert, elementType);
}

export function createPastedEmailAlert({
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
    const { duplicatedElement } = createDuplicateEmailAlert(canvasElementToPaste, newGuid, newName);

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

export function createDuplicateEmailAlert(emailAlert, newGuid, newName) {
    const newEmailAlert = createEmailAlert(emailAlert);
    Object.assign(newEmailAlert, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateEmailAlert = duplicateCanvasElement(newEmailAlert, newGuid, newName);

    return duplicateEmailAlert;
}
