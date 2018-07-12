import { FEROV_DATA_TYPE, FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { omit, updateProperties } from './objectMutation';
import { mutateTextWithMergeFields } from './mergeFieldsMutation';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { addCurlyBraces } from 'builder_platform_interaction-common-utils';
import { GLOBAL_CONSTANT } from 'builder_platform_interaction-flow-metadata';

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

    const ferovObjectValueParts = value.split('.');
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
 * Convert the FEROV object to the value and dataType properties object with valueProperty guids converted to devNames
 * @param {Object}      ferovObject input
 * @param {string}      valueProperty value property name
 * @param {string}      dataTypeProperty data type property name
 * @returns {Object}    returns object with above properties
 */
function convertToProps(ferovObject, valueProperty, dataTypeProperty) {
    const props = {[valueProperty]: ''};

    if (ferovObject) {
        const { value, guid } = getFerovObjectValue(ferovObject);

        if (!isUndefined(value)) {
            const metadataType = getMetaDataType(ferovObject);
            props[dataTypeProperty] = META_DATA_TYPES_TO_FEROV_TYPES_MAP[metadataType];
            if (isFerovBoolean(metadataType)) {
                if (value === true) {
                    props[valueProperty] = addCurlyBraces(GLOBAL_CONSTANT.BOOLEAN_TRUE);
                } else {
                    props[valueProperty] = addCurlyBraces(GLOBAL_CONSTANT.BOOLEAN_FALSE);
                }
            } else if (isFerovNumber(metadataType)) {
                props[valueProperty] = value.toString();
            } else if (isFerovString(metadataType) && value === '') {
                props[valueProperty] = addCurlyBraces(GLOBAL_CONSTANT.EMPTY_STRING);
            } else if (isFerovString(metadataType)) {
                props[valueProperty] = mutateTextWithMergeFields(value);
            } else {
                props[valueProperty] = value;
            }
            if (guid) {
                props[valueProperty + GUID_SUFFIX] = guid;
            }
        }
    }

    return props;
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

    return dataType.toLowerCase();
}

/**
 * Sanity checks on the mutate and deMutate params
 * @param {Object} element              Property editor element with ferov (eg. condition or variable)
 * @param {Object} ferovObjectName      Name of Ferov object inside the element. This object will be chagned into a scalar and placed in side valueProperty
 * @param {String} valueProperty        The name of scalar we want to set in our element. This is the property that replaces the ferov object
 * @param {String} dataTypeProperty     The name of the data type property we want to set in our element
 */
function validateParams(element, ferovObjectName, valueProperty, dataTypeProperty) {
    if (!element) {
        throw new Error('The element you want to mutate cannot be undefined or null');
    }

    if (!ferovObjectName) {
        throw new Error('The ferov object name cannot be undefined or null');
    }

    if (!valueProperty) {
        throw new Error('value property cannot be undefined or null');
    }

    // if the data type property is not specified the deMutation will fail
    if (!dataTypeProperty) {
        throw new Error('data type property cannot be undefined or null');
    }
}

/**
 * Add property editor mutation for FEROVs. Mutates the given element in an immutable way
 * The elemen is not mutated in place
 *
 * @param {Object} element              Property editor element with ferov (eg. condition or variable)
 * @param {Object} ferovObjectName      Name of Ferov object inside the element. This object will be chagned into a scalar and placed in side valueProperty
 * @param {String} valueProperty        The name of scalar we want to set in our element. This is the property that replaces the ferov object
 * @param {String} dataTypeProperty     The name of the data type property we want to set in our element
 * @returns {Object} mutatedElement     The mutated property editor element with no ferov object and props based on @param valueProperty & @param dataTypeProperty
 */
export const mutateFEROV = (element, ferovObjectName, { valueProperty, dataTypeProperty }) => {
    validateParams(element, ferovObjectName, valueProperty, dataTypeProperty);

    const props = convertToProps(element[ferovObjectName], valueProperty, dataTypeProperty);

    // omit the ferov object property
    const elementNoFerov = omit(element, [ferovObjectName]);

    // Note: this only works for top level properties, if we ever need to mutate inner props change this implementation to use set instead of updateProperties
    return updateProperties(elementNoFerov, props);
};

/**
 * Remove property editor mutation for FEROVs. This essentially places the FEROV object we
 * removed in the mutate method back into the element. Mutates the element in an immutable way
 * The element is not mutated in place
 *
 * @param {Object} element              Property editor element with ferov (eg. condition or variable)
 * @param {Object} ferovObjectName      The name of Ferov object we want to place inside the element. We will transform the scalar @param valueProperty into this object.
 * @param {String} valueProperty        The name of the value property we want to delete in our element. This scalar will be transformed into an object called @param ferovObjectName
 * @param {String} dataTypeProperty     The name of the data type property we want to delete in our element
 * @returns {Object} deMutatedElement   The demuated property editor element with a ferovObject
 */
export const deMutateFEROV = (element, ferovObjectName, { valueProperty, dataTypeProperty }) => {
    validateParams(element, ferovObjectName, valueProperty, dataTypeProperty);

    if (!element.hasOwnProperty(valueProperty)) {
        // some elements of the same element type may not have the given ferovObject (ex: variables may or may not have default value)
        return updateProperties(element);
    }

    const value = element[valueProperty];
    const dataType = element[dataTypeProperty];
    const valuePropertyGuid = valueProperty + GUID_SUFFIX;
    let ferovObject;

    if (dataType && value !== '' && value !== undefined && value !== null) {
        // find the data type key of the element object
        const ferovDataTypeValue = getFerovDataTypeValue(dataType);
        const ferovDataTypeKey = FEROV_DATA_TYPE_VALUES.find((type) => {
            return ferovDataTypeValue === META_DATA_TYPES_TO_FEROV_TYPES_MAP[type];
        });

        ferovObject = {};

        // set the value of the ferov to the given property or its guid on the element
        // store the value stored in the element before deleting it
        if (isFerovReference(ferovDataTypeKey) && element.hasOwnProperty(valuePropertyGuid)) {
            ferovObject[ferovDataTypeKey] = element[valuePropertyGuid];
        } else if (isFerovString(ferovDataTypeKey) && value === addCurlyBraces(GLOBAL_CONSTANT.EMPTY_STRING)) {
            ferovObject[ferovDataTypeKey] = '';
        } else if (isFerovBoolean(ferovDataTypeKey)) {
            if (value === addCurlyBraces(GLOBAL_CONSTANT.BOOLEAN_TRUE)) {
                ferovObject[ferovDataTypeKey] = true;
            } else if (value === addCurlyBraces(GLOBAL_CONSTANT.BOOLEAN_FALSE)) {
                ferovObject[ferovDataTypeKey] = false;
            }
        } else {
            ferovObject[ferovDataTypeKey] = element[valueProperty];
        }
    }

    // now omit the value property and the dataTypeProperty
    const elementNoValueProp = omit(element, [valueProperty, valuePropertyGuid, dataTypeProperty]);

    let deMutatedElement;
    if (ferovObject) {
        // set the ferov object to the element
        // Note: this only works if we want ferovObject to be a top level property. If we ever need to set it as an inner prop use set and pass a path instead of ferovObjectName
        deMutatedElement = updateProperties(elementNoValueProp, { [ferovObjectName]: ferovObject });
    } else {
        deMutatedElement = omit(elementNoValueProp, [ferovObjectName]);
    }

    return deMutatedElement;
};