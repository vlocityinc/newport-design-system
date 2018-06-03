import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

/**
 * @param {Object} item     parameter item
 * @param {String} elementType      type of element
 * @returns {String} label of parameter
 */
export function getParameterLabel(item, elementType) {
    if (isInvocableAction(elementType)) {
        return item.label;
    } else if (elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
        return item.Name; // for Apex Plugin, there is no Label property, we may use Name instead
    }
    return ''; // TODO: there is no service for subflow for now
}

/**
 * @param {Object} item     parameter item
 * @param {String} elementType      type of element
 * @returns {Boolean} true if this parameter is input
 */
export function isInputParameter(item, elementType) {
    if (isInvocableAction(elementType)) {
        return item.isInput;
    } else if (elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
        return item.IsInput;
    }
    return false; // TODO: there is no service for subflow for now
}

/**
 * @param {Object} item     parameter item
 * @param {String} elementType      type of element
 * @returns {Boolean} true if this parameter is required
 */
export function isRequiredParameter(item, elementType) {
    if (isInvocableAction(elementType)) {
        return item.isRequired;
    } else if (elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
        return item.IsRequired;
    }
    return false; // TODO: there is no service for subflow for now
}

/**
 * @param {Object} item     parameter item
 * @param {String} elementType      type of element
 * @returns {String} data type of parameter
 */
export function getParameterDataType(item, elementType) {
    if (isInvocableAction(elementType)) {
        return item.dataType;
    } else if (elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
        return item.DataType;
    }
    return false; // TODO: there is no service for subflow for now
}

/**
 * @param {String} elementType      type of element
 * @returns {Boolean} true if invocable action
 */
function isInvocableAction(elementType) {
    return elementType === ELEMENT_TYPE.ACTION_CALL || elementType === ELEMENT_TYPE.EMAIL_ALERT || elementType === ELEMENT_TYPE.APEX_CALL || ELEMENT_TYPE.LOCAL_ACTION_CALL;
}