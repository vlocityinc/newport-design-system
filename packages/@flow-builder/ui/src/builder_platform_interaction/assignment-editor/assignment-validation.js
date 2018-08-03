import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
// TODO here to replace the expected error message with a reference to the label file once we have that in place
const additionalRules = {
    'assignmentItems': ValidationRules.validateExpressionWith3Properties({elementType: ELEMENT_TYPE.ASSIGNMENT}),
};

export const assignmentValidation = new Validation(additionalRules);