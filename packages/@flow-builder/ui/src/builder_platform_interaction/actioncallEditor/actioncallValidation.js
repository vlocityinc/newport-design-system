import { Validation } from "builder_platform_interaction/validation";
/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
// TODO here to replace the expected error message with a reference to the label file once we have that in place
const additionalRules = {
};

class ActionCallValidation extends Validation {
    /**
     * @param {string} propName - property name to be validated
     * @param {string} value - value
     * @returns {string|null} error - error string or null based on if the field value is valid or not
     */
    validateProperty(propName, value) {
        return super.validateProperty(propName, value, additionalRules[propName]);
    }
}

export const actionCallValidation = new ActionCallValidation();