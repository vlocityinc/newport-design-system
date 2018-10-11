import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";
import { getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";


/**
 * Validate the assignment item. Here we can't use the ValidationRules.validateExpressionWith3Properties because this function allows empty RHS
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
 * Validate the inputReference item.
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateInputReference = () => {
    return [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined];
};

export const recordCreateValidation = new Validation();

/**
 * @param {Object} nodeElement the element that need to be validated
 * @param {string} wayToStoreFields can be sObjectVariable or separateVariables
 * @return {Object} the override rules
 */
export const getRules = (nodeElement, wayToStoreFields) => {
    const overrideRules = Object.assign({}, recordCreateValidation.finalizedRules);
    // case where a sObject has been selected
    if (getValueFromHydratedItem(nodeElement.numberRecordsToStore) ===  NUMBER_RECORDS_TO_STORE.FIRST_RECORD && wayToStoreFields === WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES) {
        overrideRules.object = validateInputReference();
        if (nodeElement.object.value !== '') {
            overrideRules.inputAssignments = validateAssignments();
        }
    } else {
        overrideRules.inputReference = validateInputReference();
    }

    return overrideRules;
};