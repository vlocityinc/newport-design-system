import { FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { omit, updateProperties } from './objectMutation';

// keys are the types we find in our ferov objects, values are flow builder ferov data types
const META_DATA_TYPES_TO_FEROV_TYPES_MAP = {
    'stringValue': FEROV_DATA_TYPE.STRING,
    'numberValue': FEROV_DATA_TYPE.NUMBER,
    'dateValue': FEROV_DATA_TYPE.DATE,
    'dateTimeValue': FEROV_DATA_TYPE.DATETIME,
    'booleanValue': FEROV_DATA_TYPE.BOOLEAN,
    'elementReference': FEROV_DATA_TYPE.REFERENCE,
};

// the possilbe data types for the default value we find our FEROV obejcts
const FEROV_DATA_TYPE_VALUES = Object.keys(META_DATA_TYPES_TO_FEROV_TYPES_MAP);

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
    // sanity checks
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

    if (!element.hasOwnProperty(ferovObjectName)) {
        // some elements of the same element type may not have the given ferovObject (ex: variables may or may not have default value)
        return updateProperties(element);
    }

    const ferovObject = element[ferovObjectName];

    // find the element's ferov meta data type
    const metaDataType = FEROV_DATA_TYPE_VALUES.find((type) => {
        return ferovObject.hasOwnProperty(type);
    });
    // set the value of the ferov to the given property on the element
    // store the value inside the ferov object in case we need to delete (handles edge case where FEROV object prop name is same as valueProperty)
    const ferovObjectValue = ferovObject[metaDataType];
    // omit the ferov object property
    const elementNoFerov = omit(element, [ferovObjectName]);
    // TODO: this only works for top level properties, if we ever need to mutate inner props change this implementation to use set instead of updateProperties
    const props = {
        [dataTypeProperty]: META_DATA_TYPES_TO_FEROV_TYPES_MAP[metaDataType],
        [valueProperty]: ferovObjectValue,
    };
    const updatedElement = updateProperties(elementNoFerov, props);
    return updatedElement;
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
    // sanity checks
    if (!element) {
        throw new Error('The element you want to mutate cannot be undefined or null');
    }

    if (!ferovObjectName) {
        throw new Error('The ferov object name cannot be undefined or null');
    }

    if (!element.hasOwnProperty(valueProperty)) {
        // some elements of the same element type may not have the given ferovObject (ex: variables may or may not have default value)
        return updateProperties(element);
    }

    if (!valueProperty) {
        throw new Error('value property cannot be undefined or null');
    }

    // if the data type property is not specified the deMutation will fail
    if (!dataTypeProperty) {
        throw new Error('data type property cannot be undefined or null');
    }

    // find the data type key of the element object
    const ferovDataTypeValue = element[dataTypeProperty];
    const ferovDataTypeKey = FEROV_DATA_TYPE_VALUES.find((type) => {
        return ferovDataTypeValue === META_DATA_TYPES_TO_FEROV_TYPES_MAP[type];
    });

    const ferovObject = {};
    // set the value of the ferov to the given property on the element
    // store the value stored in the element before deleting it
    const elementPropValue = element[valueProperty];
    ferovObject[ferovDataTypeKey] = elementPropValue;
    // now omit the value property and the dataTypeProperty
    const elementNoValueProp = omit(element, [valueProperty, dataTypeProperty]);
    // set the ferov object to the element
    // TODO: this only works if we want ferovObject to be a top level property. If we ever need to set it as an inner prop use set and pass a path instead of ferovObjectName
    const updatedElement = updateProperties(elementNoValueProp, { [ferovObjectName]: ferovObject});
    return updatedElement;
};
