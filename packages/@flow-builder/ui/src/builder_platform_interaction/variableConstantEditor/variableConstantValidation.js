import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { isUndefinedOrNull } from "builder_platform_interaction/commonUtils";
import { LABELS } from "./variableConstantEditorLabels";

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
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

class VariableConstantValidation extends Validation {
    /**
     * @param {Object} variableConstantResource - node element data passed as an object.
     * @param {Object} overrideRules - if passed, will override the default rules.
     * @returns {Object} nodeElement - updated Node element after all the rules are run on respective data values.
     */
    validateAll(variableConstantResource, overrideRules) {
        const isSobject = getValueFromHydratedItem(variableConstantResource.dataType) === FLOW_DATA_TYPE.SOBJECT.value;
        this.finalizedRules.objectType = [validateVariableObjectType(isSobject)];
        return super.validateAll(variableConstantResource, overrideRules);
    }
}

export const variableConstantValidation = new VariableConstantValidation(additionalRules);