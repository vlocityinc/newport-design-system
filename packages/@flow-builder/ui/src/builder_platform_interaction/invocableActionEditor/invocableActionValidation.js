// @ts-nocheck
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { validateParameter } from 'builder_platform_interaction/calloutEditorLib';

const getDynamicTypeMappingRules = rowIndex => [
    ValidationRules.shouldNotBeBlank,
    ValidationRules.shouldNotBeNullOrUndefined,
    ValidationRules.validateResourcePicker(rowIndex)
];

/**
 * Validate the data type mapping's value
 * @return {function} the function to be called with each queried field to return the array of rules.
 */
export const validateDataTypeMapping = () => dataTypeMapping => ({
    typeValue: getDynamicTypeMappingRules(dataTypeMapping.rowIndex)
});

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    inputParameters: validateParameter(),
    outputParameters: validateParameter(),
    dataTypeMappings: validateDataTypeMapping()
};

export const invocableActionValidation = new Validation(additionalRules);

export function getDynamicTypeMappingValidation(rowIndex) {
    const rules = getDynamicTypeMappingRules(rowIndex);
    return new Validation({ dynamicTypeMapping: rules });
}
