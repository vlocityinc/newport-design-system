import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';
import { getValueFromHydratedItem } from 'builder_platform_interaction-data-mutation-lib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { isUndefinedOrNull } from 'builder_platform_interaction-common-utils';
import { LABELS } from "./variable-editor-labels";

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    'name'  : [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ],
    'dataType': [ValidationRules.shouldNotBeNullOrUndefined],
};

/**
 * Test if the given value is from an sobject element, and if it is also check that it is not null or undefined
 * @param {Boolean} isSobject true if the value to be tested is an sobject, false otherwise
 * @returns {function} function that checks if the given value is a valid sobject
 */
const validateVariableObjectType = (isSobject) => {
    /**
     * @param {String} value the value to be tested
     * @returns {String|null} errorString or null
     */
    return (value) => {
        if (isSobject) {
            return isUndefinedOrNull(value) ? LABELS.sObjectCannotBeBlank : null;
        }
        return null;
    };
};

class VariableValidation extends Validation {
    /**
     * @param {Object} variableResource - node element data passed as an object.
     * @param {Object} overrideRules - if passed, will override the default rules.
     * @returns {Object} nodeElement - updated Node element after all the rules are run on respective data values.
     */
    validateAll(variableResource, overrideRules) {
        const isSobject = getValueFromHydratedItem(variableResource.dataType) === FLOW_DATA_TYPE.SOBJECT.value;
        this.finalizedRules.objectType = [validateVariableObjectType(isSobject)];
        return super.validateAll(variableResource, overrideRules);
    }
}

export const variableValidation = new VariableValidation(additionalRules);