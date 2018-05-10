import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
// TODO here to replace the expected error message with a reference to the label file once we have that in place
const additionalRules = {
    'label' : [
        ValidationRules.shouldAcceptOnlyAlphanumericOrSpecialCharacters,
        ValidationRules.maximumCharactersLimit(255)
    ],
    'name'  : [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ],
    'assignmentItems': ValidationRules.validateExpressionWith3Properties({elementType: ELEMENT_TYPE.ASSIGNMENT}),
};

export const assignmentValidation = new Validation(additionalRules);