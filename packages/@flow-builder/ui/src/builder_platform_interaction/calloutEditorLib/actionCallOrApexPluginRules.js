import * as ValidationRules from "builder_platform_interaction/validationRules";

/**
 * Validate the parameter item's value
 * @return {function} the function to be called with each queried field to return the array of rules.
 */
export const validateRequiredInputParameter = () => {
    return (inputParameter) => {
        if (inputParameter.isRequired) {
            return {
                'value': [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank]
            };
        }
        return {};
    };
};