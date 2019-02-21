import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createActionCall } from './actionCall';
import {  duplicateCanvasElement } from "./base/baseElement";

const elementType = ELEMENT_TYPE.EMAIL_ALERT;

/**
 * Either creates a new email alert or create a new copy of existing email alert
 * @param {Object} emailAlert existing email alert which needs to be copied
 * @return {Object} newEmailAlert new email alert which is created
 */
export function createEmailAlert(emailAlert = {}) {
    return  createActionCall(emailAlert, elementType);
}

export function createDuplicateEmailAlert(emailAlert, newGuid) {
    const newEmailAlert = createEmailAlert(emailAlert);
    const duplicateEmailAlert = duplicateCanvasElement(newEmailAlert, newGuid);

    return duplicateEmailAlert;
}