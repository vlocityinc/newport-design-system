import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

/**
 * Add property editor mutation for FEROVs
 *
 * @param {Object} item Property editor row data with ferov (eg. condition)
 * @param {Object} rhs Ferov object
 */
export const mutateFEROV = (item, rhs) => {
    if (rhs.hasOwnProperty('stringValue')) {
        item.rightHandSideDataType = FEROV_DATA_TYPE.STRING;
        item.rightHandSide = rhs.stringValue;
    } else if (rhs.hasOwnProperty('numberValue')) {
        item.rightHandSideDataType = FEROV_DATA_TYPE.NUMBER;
        item.rightHandSide = rhs.numberValue;
    } else if (rhs.hasOwnProperty('dateValue')) {
        item.rightHandSideDataType = FEROV_DATA_TYPE.DATE;
        item.rightHandSide = rhs.dateValue;
    } else if (rhs.hasOwnProperty('dateTimeValue')) {
        item.rightHandSideDataType = FEROV_DATA_TYPE.DATETIME;
        item.rightHandSide = rhs.dateTimeValue;
    } else if (rhs.hasOwnProperty('booleanValue')) {
        item.rightHandSideDataType = FEROV_DATA_TYPE.BOOLEAN;
        item.rightHandSide = rhs.booleanValue;
    } else if (rhs.hasOwnProperty('elementReference')) {
        item.rightHandSideDataType = FEROV_DATA_TYPE.REFERENCE;
        item.rightHandSide = rhs.elementReference;
    }
};

/**
 * Remove property editor mutation for FEROVs
 *
 * @param {Object} item Property editor row data with ferov (eg. condition)
 * @param {Object} rhs Ferov object
 */
export const deMutateFEROV = (item, rhs) => {
    if (item.rightHandSideDataType === FEROV_DATA_TYPE.STRING) {
        rhs.stringValue = item.rightHandSide;
    } else if (item.rightHandSideDataType === FEROV_DATA_TYPE.NUMBER) {
        rhs.numberValue = item.rightHandSide;
    } else if (item.rightHandSideDataType === FEROV_DATA_TYPE.DATE) {
        rhs.dateValue = item.rightHandSide;
    } else if (item.rightHandSideDataType === FEROV_DATA_TYPE.DATETIME) {
        rhs.dateTimeValue = item.rightHandSide;
    } else if (item.rightHandSideDataType === FEROV_DATA_TYPE.BOOLEAN) {
        rhs.booleanValue = item.rightHandSide;
    } else if (item.rightHandSideDataType === FEROV_DATA_TYPE.REFERENCE) {
        rhs.elementReference = item.rightHandSide;
    }

    delete item.rightHandSide;
    delete item.rightHandSideDataType;
};
