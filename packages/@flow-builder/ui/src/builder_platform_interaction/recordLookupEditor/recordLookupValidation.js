import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { SORT_ORDER, RECORD_FILTER_CRITERIA } from "builder_platform_interaction/recordEditorLib";
import { WAY_TO_STORE_FIELDS, NUMBER_RECORDS_TO_STORE } from "builder_platform_interaction/recordEditorLib";

/**
 * Validate the filter item. Here we can't use the ValidationRules.validateExpressionWith3Properties because this function allows empty RHS
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateFilter = () => ValidationRules.validateExpressionWith3PropertiesWithNoEmptyRHS();

/**
 * Validate the assignments item.
 * The rule on the RHS is added only if the LHS has a value.
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateAssignments = () => {
    return ValidationRules.validateExpressionWith2PropertiesWithNoEmptyRHS();
};

/**
 * Validate the outputReference item.
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateOutputReference = (outputReferenceIndex) => {
    return [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.validateResourcePicker(outputReferenceIndex)];
};

/**
 * Validate the queried field.
 * @return {function} the function to be called with each queried field to return the array of rules.
 */
const validateQueriedField = () => {
    return () => {
        const rules = {
            'field': [ValidationRules.shouldNotBeBlank]
        };
        return rules;
    };
};
const additionalRules = {
    object: [
        ValidationRules.shouldNotBeBlank
    ],
};

export const recordLookupValidation = new Validation(additionalRules);

/**
 * Build specific overridden rules
 * @param {Object} nodeElement the element that need to be validated
 * @param {string} nodeElement.filterType - current element's filterType
 * @param {string} nodeElement.sortOrder - current element's sortOrder
 * @param {Object} nodeElement.object - current element's object
 * @param {string} nodeElement.wayToStoreFields - current element's wayToStoreFields
 * @param {string} nodeElement.numberRecordsToStore - current element's numberRecordsToStore
 * @param {Object[]} nodeElement.outputAssignments - current element's outputAssignments
 * @param {Object} nodeElement.outputReference - current element's outputReference
 * @param {Object[]} nodeElement.queriedFields - current element's queriedFields
 * @return {Object} the overridden rules
 */
export const getRules = ({filterType, sortOrder, object, objectIndex, wayToStoreFields, numberRecordsToStore, outputAssignments, outputReference, outputReferenceIndex, queriedFields, outputHandled}) => {
    const overriddenRules = { ...recordLookupValidation.finalizedRules};
    overriddenRules.object.push(ValidationRules.validateResourcePicker(objectIndex));
    // validate filters if filter type is ALL
    if (filterType === RECORD_FILTER_CRITERIA.ALL) {
        overriddenRules.filters = validateFilter();
    }
    // validate sortField when sortOrder !== NOT_SORTED
    if (sortOrder !== SORT_ORDER.NOT_SORTED) {
        overriddenRules.sortField = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
    }

    if (object && object.value && !object.error && !outputHandled) {
        if (wayToStoreFields === WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES && numberRecordsToStore === NUMBER_RECORDS_TO_STORE.FIRST_RECORD && outputAssignments.length > 1) {
            overriddenRules.outputAssignments = validateAssignments();
        } else if (outputAssignments && outputAssignments.length === 1 && outputAssignments[0].leftHandSide.value) {
            overriddenRules.outputAssignments = validateAssignments();
        } else if (wayToStoreFields === WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE) {
            overriddenRules.outputReference = validateOutputReference(outputReferenceIndex);
            if (outputReference && outputReference.value && queriedFields.length > 2) {
                overriddenRules.queriedFields = validateQueriedField();
            }
        }
    }
    return overriddenRules;
};
