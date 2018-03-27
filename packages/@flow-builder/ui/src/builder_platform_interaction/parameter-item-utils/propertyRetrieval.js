import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

/**
 * @param {Object} item     parameter item
 * @param {String} elementType      type of element
 * @returns {String} label of parameter
 */
export function getParameterLabel(item, elementType) {
    switch (elementType) {
        case ELEMENT_TYPE.ACTION_CALL:
            return item.Label;
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
        case ELEMENT_TYPE.SUBFLOW:
        default:
            return ''; // FIXME: will fix it when the service is available for ApexPlugin and Subflow
    }
}

/**
 * @param {Object} item     parameter item
 * @param {String} elementType      type of element
 * @returns {Boolean} true if this parameter is input
 */
export function isInputParameter(item, elementType) {
    switch (elementType) {
        case ELEMENT_TYPE.ACTION_CALL:
            return item.IsInput;
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
        case ELEMENT_TYPE.SUBFLOW:
        default:
            return false; // FIXME: will fix it when the service is available for ApexPlugin and Subflow
    }
}

/**
 * @param {Object} item     parameter item
 * @param {String} elementType      type of element
 * @returns {Boolean} true if this parameter is required
 */
export function isRequiredParameter(item, elementType) {
    switch (elementType) {
        case ELEMENT_TYPE.ACTION_CALL:
            return item.IsRequired;
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
        case ELEMENT_TYPE.SUBFLOW:
        default:
            return false; // FIXME: will fix it when the service is available for ApexPlugin and Subflow
    }
}

/**
 * @param {Object} item     parameter item
 * @param {String} elementType      type of element
 * @returns {String} data type of parameter
 */
export function getParameterDataType(item, elementType) {
    switch (elementType) {
        case ELEMENT_TYPE.ACTION_CALL:
            return item.DataType;
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
        case ELEMENT_TYPE.SUBFLOW:
        default:
            return ''; // FIXME: will fix it when the service is available for ApexPlugin and Subflow
    }
}