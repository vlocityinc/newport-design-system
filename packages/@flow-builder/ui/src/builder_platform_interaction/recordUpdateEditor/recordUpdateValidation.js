import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { NUMBER_RECORDS_TO_STORE, RECORD_FILTER_CRITERIA } from "builder_platform_interaction/recordEditorLib";

/**
 * Validate the filter item.
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateAssignments = () => ValidationRules.validateExpressionWith2Properties();

/**
 * Validate the filter item. Here we can't use the ValidationRules.validateExpressionWith3Properties because this function allows empty RHS
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateInputReference = () => {
    return [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined];
};

/**
 * Validate the filter item.
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateFilter = () => {
    return ValidationRules.validateExpressionWith3PropertiesWithNoEmptyRHS();
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
        if (nodeElement.object.value !== '' && !nodeElement.object.error) {
            overrideRules.inputAssignments = validateAssignments();
            // validate filters if filter type is ALL
            if (nodeElement.filterType.value === RECORD_FILTER_CRITERIA.ALL) {
                overrideRules.filters = validateFilter();
            }
        }
    }

    return overrideRules;
};