import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
// TODO here to replace the expected error message with a reference to the label file once we have that in place
const additionalRules = {
    'name': [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ],
    'label': [
        ValidationRules.shouldAcceptOnlyAlphanumericOrSpecialCharacters,
        ValidationRules.maximumCharactersLimit(255)
    ],
    'object': [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank
    ],
    'outputReference': [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank
    ],
    'filters': ValidationRules.validateExpressionWith3Properties({elementType: ELEMENT_TYPE.RECORD_LOOKUP}),
    // TODO: validate queriedFields, sortField when sortOrder != NOT_SORTED
};

export const recordLookupValidation = new Validation(additionalRules);