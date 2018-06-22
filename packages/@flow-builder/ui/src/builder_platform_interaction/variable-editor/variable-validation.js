import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';
import { getValueFromHydratedItem } from 'builder_platform_interaction-data-mutation-lib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
// TODO here to replace the expected error message with a reference to the label file once we have that in place
const additionalRules = {
    'name'  : [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ],
    'dataType': [ValidationRules.shouldNotBeNullOrUndefined],
};

class VariableValidation extends Validation {
    /**
     * @param {Object} variableResource - node element data passed as an object.
     * @param {Object} overrideRules - if passed, will override the default rules.
     * @returns {Object} nodeElement - updated Node element after all the rules are run on respective data values.
     */
    validateAll(variableResource, overrideRules) {
        const isSobject = getValueFromHydratedItem(variableResource.dataType) === FLOW_DATA_TYPE.SOBJECT.value;
        this.finalizedRules.objectType = [ValidationRules.validateVariableObjectType(isSobject)];
        return super.validateAll(variableResource, overrideRules);
    }
}

export const variableValidation = new VariableValidation(additionalRules);