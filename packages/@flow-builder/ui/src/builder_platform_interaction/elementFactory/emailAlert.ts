// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createActionCall, getDefaultAvailableConnections } from './actionCall';
import { createPastedCanvasElement, duplicateCanvasElement } from './base/baseElement';

const elementType = ELEMENT_TYPE.EMAIL_ALERT;

/**
 * Either creates a new email alert or create a new copy of existing email alert
 *
 * @param {Object} emailAlert existing email alert which needs to be copied
 * @returns {Object} newEmailAlert new email alert which is created
 */
export function createEmailAlert(emailAlert = {}) {
    return createActionCall({ ...emailAlert, storeOutputAutomatically: false }, elementType);
}

/**
 * @param root0
 * @param root0.canvasElementToPaste
 * @param root0.newGuid
 * @param root0.newName
 * @param root0.canvasElementGuidMap
 * @param root0.topCutOrCopiedGuid
 * @param root0.bottomCutOrCopiedGuid
 * @param root0.prev
 * @param root0.next
 * @param root0.parent
 * @param root0.childIndex
 */
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

/**
 * @param emailAlert
 * @param newGuid
 * @param newName
 */
export function createDuplicateEmailAlert(emailAlert, newGuid, newName) {
    const newEmailAlert = createEmailAlert(emailAlert);
    Object.assign(newEmailAlert, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateEmailAlert = duplicateCanvasElement(newEmailAlert, newGuid, newName);

    return duplicateEmailAlert;
}
