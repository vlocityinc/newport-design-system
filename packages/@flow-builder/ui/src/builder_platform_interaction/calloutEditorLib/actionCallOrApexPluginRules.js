import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * Validate the parameter item's value
 * @return {function} the function to be called with each queried field to return the array of rules.
 */
export const validateParameter = () => {
    return parameter => {
        const rules = { value: [] };
        if (parameter.isRequired) {
            rules.value = [
                ValidationRules.shouldNotBeNullOrUndefined,
                ValidationRules.shouldNotBeBlank
            ];
        }
        rules.value.push(
            ValidationRules.validateResourcePicker(parameter.rowIndex)
        );
        return rules;
    };
};
