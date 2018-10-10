import { FEROV_DATA_TYPE, FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
// import { mutateTextWithMergeFields } from './mergeFieldsMutation';
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { addCurlyBraces, splitStringByPeriod } from "builder_platform_interaction/commonUtils";
import { GLOBAL_CONSTANTS } from "builder_platform_interaction/systemLib";
import { getLocalizationService } from "lightning/configProvider";
import { METADATA_DATE_FORMAT, formatDateTime } from "builder_platform_interaction/dateTimeUtils";

const localizationService = getLocalizationService();

// keys are the types we find in our ferov objects, values are flow builder ferov data types
const META_DATA_TYPES_TO_FEROV_TYPES_MAP = {
    'stringValue': FEROV_DATA_TYPE.STRING,
    'numberValue': FEROV_DATA_TYPE.NUMBER,
    'dateValue': FEROV_DATA_TYPE.DATE,
    'dateTimeValue': FEROV_DATA_TYPE.DATETIME,
    'booleanValue': FEROV_DATA_TYPE.BOOLEAN,
    'elementReference': FEROV_DATA_TYPE.REFERENCE,
};

// the possible data types for the default value we find our FEROV obejcts
const FEROV_DATA_TYPE_VALUES = Object.keys(META_DATA_TYPES_TO_FEROV_TYPES_MAP);

// guid suffix to add to defaultValue when ferov object value is a reference
export const GUID_SUFFIX = 'Guid';

/**
 * Returns true if ferov is type reference
 * @param {string}      metaDataType ferov object meta data type
 * @return {boolean}    true if metaDataType is reference otherwise false
 */
function isFerovReference(metaDataType) {
    return META_DATA_TYPES_TO_FEROV_TYPES_MAP[metaDataType] === FEROV_DATA_TYPE.REFERENCE;
}

/**
 * Returns true if ferov is type boolean
 * @param {string}      metaDataType ferov object meta data type
 * @return {boolean}    true if metaDataType is boolean otherwise false
 */
function isFerovBoolean(metaDataType) {
    return META_DATA_TYPES_TO_FEROV_TYPES_MAP[metaDataType] === FEROV_DATA_TYPE.BOOLEAN;
}

/**
 * Returns true if ferov is type date/time
 * @param {string}      metaDataType ferov object meta data type
 * @return {boolean}    true if metaDataType is date/time otherwise false
 */
function isFerovDateTime(metaDataType) {
    return META_DATA_TYPES_TO_FEROV_TYPES_MAP[metaDataType] === FEROV_DATA_TYPE.DATETIME;
}

/**
 * Returns true if ferov is type date
 * @param {string}      metaDataType ferov object meta data type
 * @return {boolean}    true if metaDataType is date otherwise false
 */
function isFerovDate(metaDataType) {
    return META_DATA_TYPES_TO_FEROV_TYPES_MAP[metaDataType] === FEROV_DATA_TYPE.DATE;
}

/**
 * Returns true if ferov is type string
 * @param {string}      metaDataType ferov object meta data type
 * @return {boolean}    true if metaDataType is string otherwise false
 */
function isFerovString(metaDataType) {
    return META_DATA_TYPES_TO_FEROV_TYPES_MAP[metaDataType] === FEROV_DATA_TYPE.STRING;
}

/**
 * Returns true if ferov is type reference
 * @param {string}      metaDataType ferov object meta data type
 * @return {boolean}    true if metaDataType is reference otherwise false
 */
function isFerovNumber(metaDataType) {
    return META_DATA_TYPES_TO_FEROV_TYPES_MAP[metaDataType] === FEROV_DATA_TYPE.NUMBER;
}

/**
 * Convert the guids in the value to return dev name and guid object
 * Eg: VARIABLE_12 -> { value: {!var1}, guid: 'VARIABLE_12' }
 * Eg: VARIABLE_12.AccountSource -> { value: {!myAccount.AccountSource}, guid: 'VARIABLE_12' }
 * Note: Does not handle merge fields, needs more spiking.
 * merge field - 'Flow Builder is going pilot in {!releasePilot} and GA in {!releaseGA}'
 * @param {String}      value input
 * @return {Object}     object with value and guid if the corresponding flow element exists
 */
function convertGuidToDevName(value) {
    if (!value) {
        throw new Error(`Input value must be a guid but instead was ${value}`);
    }

    const ferovObjectValueParts = splitStringByPeriod(value);
    const guid = value;
    const flowElement = getElementByGuid(ferovObjectValueParts[0]);

    if (flowElement) {
        ferovObjectValueParts[0] = flowElement.name;
        value = addCurlyBraces(ferovObjectValueParts.join('.'));
        return { value, guid };
    }

    return { value };
}

/**
 * Get the ferov object value and optionally guid for a reference metaDataType.
 * Eg: { stringValue: 'Test String' } -> { value:'Test String' }
 * Eg: { elementReference: 'VARIABLE_12' } -> { value:'{var1}', guid:'VARIABLE_12' }
 * @param {Object}      ferovObject input ferov object
 * @return {*}          returns object with ferov value and optionally guid for a reference type
 */
function getFerovObjectValue(ferovObject) {
    // find the element's ferov meta data type
    const metaDataType = getMetaDataType(ferovObject);

    // set the value of the ferov to the given property on the element
    // store the value inside the ferov object in case we need to delete (handles edge case where FEROV object prop name is same as valueProperty)
    const value = ferovObject[metaDataType];

    if (isFerovReference(metaDataType)) {
        return convertGuidToDevName(value);
    }
    return {value};
}

/**
 * Get the Ferov object meta data type.
 * @param {Object}      ferovObject input
 * @return {string}     returns the metadataType
 */
function getMetaDataType(ferovObject) {
    return FEROV_DATA_TYPE_VALUES.find((type) => {
        return ferovObject.hasOwnProperty(type);
    });
}

/**
 * Returns true if the input value is undefined.
 * Note: This will be moved to utils lib once we have one.
 * @param {Object} value input
 * @return {boolean} true if undefined otherwise false.
 */
function isUndefined(value) {
    return value === undefined;
}

/**
 * Converts Flow datatypes to FEROV compatible datatype
 * @param {String} value The string representation of the Flow datatype
 * @returns {String} The FEROF compatible datatype
 */
function getFerovDataTypeValue(value) {
    let dataType;
    switch (value) {
        case FLOW_DATA_TYPE.CURRENCY.value:
            dataType = FLOW_DATA_TYPE.NUMBER.value;
            break;
        case FLOW_DATA_TYPE.PICKLIST.value:
        case FLOW_DATA_TYPE.MULTI_PICKLIST.value:
            dataType = FLOW_DATA_TYPE.STRING.value;
            break;
        default:
            dataType = value;
    }

    return dataType;
}

/**
 * Sanity checks on the mutate and deMutate params
 * @param {String} valueProperty        The name of scalar we want to set in our element. This is the property that replaces the ferov object
 * @param {String} dataTypeProperty     The name of the data type property we want to set in our element
 */
function validateParams(valueProperty, dataTypeProperty) {
    if (!valueProperty) {
        throw new Error('value property cannot be undefined or null');
    }

    // if the data type property is not specified the deMutation will fail
    if (!dataTypeProperty) {
        throw new Error('data type property cannot be undefined or null');
    }
}

/**
 * Creates a ferov object in the shape that the store expects
 *
 * @param {Object} ferovObject        The name of the flow metadata Ferov object inside the element (eg. 'value' which is the RHS of a condition). This object will be changed into a scalar and placed inside @param valueProperty
 * @param {String} valueProperty      The name of scalar we want to set in our element. This is the property that replaces the ferov object
 * @param {String} dataTypeProperty   The name of the data type property we want to set in our element
 * @returns {Object}                  The element with ferov object and props based on @param valueProperty & @param dataTypeProperty
 */
export const createFEROV = (ferovObject, valueProperty, dataTypeProperty) => {
    validateParams(valueProperty, dataTypeProperty);

    const props = {[valueProperty]: ''};

    if (ferovObject) {
        const { value, guid } = getFerovObjectValue(ferovObject);

        if (!isUndefined(value)) {
            const metadataType = getMetaDataType(ferovObject);
            props[dataTypeProperty] = META_DATA_TYPES_TO_FEROV_TYPES_MAP[metadataType];
            if (isFerovBoolean(metadataType)) {
                if (value === true) {
                    props[valueProperty] = GLOBAL_CONSTANTS.BOOLEAN_TRUE;
                } else {
                    props[valueProperty] = GLOBAL_CONSTANTS.BOOLEAN_FALSE;
                }
            } else if (isFerovNumber(metadataType)) {
                props[valueProperty] = value.toString();
            } else if (isFerovString(metadataType) && value === '') {
                props[valueProperty] = GLOBAL_CONSTANTS.EMPTY_STRING;
            } else if (isFerovDate(metadataType)) {
                props[valueProperty] = formatDateTime(value.split('T')[0], false);
            } else if (isFerovDateTime(metadataType)) {
                props[valueProperty] = formatDateTime(value, true);
            } else {
                props[valueProperty] = value;
            }
            if (guid) {
                props[valueProperty + GUID_SUFFIX] = guid;
            }
        }
    }

    return props;
};

/**
 * Creates a ferov object in the shape that the flow metadata expects
 *
 * @param {Object} element              Store element with ferov (eg. condition or variable)
 * @param {String} valueProperty        The name of the value property of the ferov
 * @param {String} dataTypeProperty     The name of the data type property of the ferov
 * @returns {Object} ferovObject        The ferov object in the shape that the flow metadata expects
 */
export const createFEROVMetadataObject = (element, valueProperty, dataTypeProperty) => {
    validateParams(valueProperty, dataTypeProperty);

    let ferovObject;
    if (element.hasOwnProperty(valueProperty)) {
        const value = element[valueProperty];
        const dataType = element[dataTypeProperty];
        const valuePropertyGuid = valueProperty + GUID_SUFFIX;

        if (dataType && value !== '' && value !== undefined && value !== null) {
            // find the data type key of the element object
            const ferovDataTypeValue = getFerovDataTypeValue(dataType);
            const ferovDataTypeKey = FEROV_DATA_TYPE_VALUES.find((type) => {
                return ferovDataTypeValue === META_DATA_TYPES_TO_FEROV_TYPES_MAP[type];
            });

            // set the value of the ferov to the given property or its guid on the element
            let ferovValue;
            if (isFerovReference(ferovDataTypeKey)) {
                ferovValue = element[valuePropertyGuid] || value;
            } else if (isFerovString(ferovDataTypeKey) && value === GLOBAL_CONSTANTS.EMPTY_STRING) {
                ferovValue = '';
            } else if (isFerovBoolean(ferovDataTypeKey)) {
                if (value === GLOBAL_CONSTANTS.BOOLEAN_TRUE) {
                    ferovValue = true;
                } else if (value === GLOBAL_CONSTANTS.BOOLEAN_FALSE) {
                    ferovValue = false;
                }
            } else if (isFerovDateTime(ferovDataTypeKey)) {
                // the date time we get from the property editor (user)
                const dateTime = new Date(element[valueProperty]);
                // transform date to ISO string in UTC format
                const utcDateTime = localizationService.parseDateTimeUTC(dateTime.toISOString());
                // what we store on save, an ISO8601 formatted string in UTC
                ferovValue = utcDateTime.toISOString();
            } else if (isFerovDate(ferovDataTypeKey)) {
                // the date we get from the property editor (user)
                const date = new Date(element[valueProperty]);
                // transform date to just date format (no time)
                const utcDateString = localizationService.formatDateUTC(date.toISOString(), METADATA_DATE_FORMAT);
                // what we store on save in yyyy-MM-dd
                ferovValue = utcDateString;
            } else {
                ferovValue = element[valueProperty];
            }

            ferovObject = Object.assign({}, { [ferovDataTypeKey]: ferovValue });
        }
    }

    return ferovObject;
};