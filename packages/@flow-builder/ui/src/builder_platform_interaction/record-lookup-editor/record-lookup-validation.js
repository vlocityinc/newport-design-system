import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';
import { SORT_ORDER, RECORD_FILTER_CRITERIA } from 'builder_platform_interaction-record-editor-lib';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-expression-utils';

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

export const getRules = (nodeElement) => {
    const overrideRules = {
        'name': [
            ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
            ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
            ValidationRules.maximumCharactersLimit(80),
            ValidationRules.shouldNotBeBlank,
        ],
        'label': [
            ValidationRules.shouldAcceptOnlyAlphanumericOrSpecialCharacters,
            ValidationRules.maximumCharactersLimit(255),
            ValidationRules.shouldNotBeBlank
        ],
        'object': [
            ValidationRules.shouldNotBeBlank
        ],
        // TODO: only validate outputReference if store fields in sObject variable
        'outputReference': [
            ValidationRules.shouldNotBeNullOrUndefined,
            ValidationRules.shouldNotBeBlank
        ],
    };
    // validate filters if filter type is ALL
    if (nodeElement.filterType.value === RECORD_FILTER_CRITERIA.ALL) {
        overrideRules.filters = validateFilter();
    }
    // validate sortField when sortOrder !== NOT_SORTED
    if (nodeElement.sortOrder.value !== SORT_ORDER.NOT_SORTED) {
        overrideRules.sortField = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
    }
    // validate queriedFields if store fields in sObject variable and queriedFiels contains 'ID' + more than one row
    if (nodeElement.outputReference && nodeElement.outputReference.value && nodeElement.queriedFields.length > 2) {
        overrideRules.queriedFields = validateQueriedField();
    }
    return overrideRules;
};

export const recordLookupValidation = new Validation();