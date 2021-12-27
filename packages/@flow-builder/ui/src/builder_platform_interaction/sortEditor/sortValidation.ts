import { LIMIT_RANGE, SORT_OUTPUT_OPTION } from 'builder_platform_interaction/sortEditorLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * Validate the collectionReferenceIndex item.
 *
 * @param collectionReference
 * @param elements
 */
const validateCollectionReference = (collectionReference, elements) => {
    return [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldReferenceACollection(elements)
    ];
};

/**
 * Validate the queried field.
 *
 * @param isSObjectOrApexClass
 * @returns {Function} the function to be called with each queried field to return the array of rules.
 */
const validateSortOptions = (isSObjectOrApexClass) => {
    return () => {
        if (isSObjectOrApexClass) {
            return {
                sortField: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined],
                sortOrder: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined]
            };
        }
        return {
            sortOrder: [ValidationRules.shouldNotBeBlank]
        };
    };
};

export const sortValidation = new Validation();

/**
 * Build specific overridden rules
 *
 * @param details {Object}
 * @returns {Object} the overridden rules
 */
export const getRules = (details) => {
    const { collectionReference, selectedOutput, isSObjectOrApexClass } = details;

    const overriddenRules = { ...sortValidation.finalizedRules };
    const elements = Store.getStore().getCurrentState().elements;
    // validate collectionReference
    overriddenRules.collectionReference = validateCollectionReference(collectionReference, elements);
    if (selectedOutput === SORT_OUTPUT_OPTION.CUSTOM) {
        overriddenRules.limit = [
            ValidationRules.shouldNotBeBlank,
            ValidationRules.shouldNotBeNullOrUndefined,
            ValidationRules.shouldBeAPositiveIntegerOrZero,
            ValidationRules.shouldBeInRange(LIMIT_RANGE.min, LIMIT_RANGE.max)
        ];
    }
    // validate sort options
    overriddenRules.sortOptions = validateSortOptions(isSObjectOrApexClass);
    return overriddenRules;
};
