import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { NUMBER_RECORDS_TO_STORE, RECORD_FILTER_CRITERIA } from "builder_platform_interaction/recordEditorLib";

/**
 * Validate the filter item. Here we can't use the ValidationRules.validateExpressionWith3Properties because this function allows empty RHS
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateAssignments = () => {
    return () => {
        const rules = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [ValidationRules.shouldNotBeBlank]
        };
        return rules;
    };
};

/**
 * Validate the filter item. Here we can't use the ValidationRules.validateExpressionWith3Properties because this function allows empty RHS
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateInputReference = () => {
    return [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined];
};

/**
 * Validate the filter item. Here we can't use the ValidationRules.validateExpressionWith3Properties because this function allows empty RHS
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateFilter = () => {
    return (filter) => {
        const rules = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [ValidationRules.shouldNotBeBlank]
        };
        if (filter[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.OPERATOR] = [ValidationRules.shouldNotBeBlank];
            if (filter[EXPRESSION_PROPERTY_TYPE.OPERATOR].value) {
                rules[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = [ValidationRules.shouldNotBeBlank];
            }
        }
        return rules;
    };
};

export const recordUpdateValidation = new Validation();

/**
 * @param {Object} nodeElement the element that need to be validated
 * @return {Object} the override rules
 */
export const getRules = (nodeElement) => {
    const overrideRules = Object.assign({}, recordUpdateValidation.finalizedRules);
    // case where a sObject has been selected
    if (nodeElement.numberRecordsToStore.value === NUMBER_RECORDS_TO_STORE.FIRST_RECORD) {
        overrideRules.inputReference = validateInputReference();
    } else if (nodeElement.inputAssignments) {
        overrideRules.object = validateInputReference();
        if (nodeElement.object.value !== '') {
            overrideRules.inputAssignments = validateAssignments();
            // validate filters if filter type is ALL
            if (nodeElement.filterType.value === RECORD_FILTER_CRITERIA.ALL) {
                overrideRules.filters = validateFilter();
            }
        }
    }

    return overrideRules;
};