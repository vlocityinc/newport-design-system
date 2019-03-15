import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";
import { getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";


/**
 * Validate the assignment item.
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateAssignments = () => ValidationRules.validateExpressionWith2Properties();

/**
 * Validate the inputReference item.
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateInputReference = () => {
    return [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined];
};

export const recordCreateValidation = new Validation();

/**
 * Build specific overridden rules
 * @param {Object} nodeElement the element that needs to be validated
 * @param {string} nodeElement.numberRecordsToStore - current element's numberRecordsToStore
 * @param {Object} nodeElement.object - current element's object
 * @param {Object[]} nodeElement.inputAssignments - current element's inputAssignments
 * @param {string} wayToStoreFields can be sObjectVariable or separateVariables
 * @return {Object} the overridden rules
 */
export const getRules = ({numberRecordsToStore, object, inputAssignments}, wayToStoreFields) => {
    const overriddenRules = Object.assign({}, recordCreateValidation.finalizedRules);
    // case where a sObject has been selected
    if (getValueFromHydratedItem(numberRecordsToStore) ===  NUMBER_RECORDS_TO_STORE.FIRST_RECORD && wayToStoreFields === WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES) {
        overriddenRules.object = validateInputReference();
        if (object.value !== '' && !object.error) {
            if (inputAssignments.length > 1) {
                overriddenRules.inputAssignments = validateAssignments();
            }
        }
    } else {
        overriddenRules.inputReference = validateInputReference();
    }

    return overriddenRules;
};