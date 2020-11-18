import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
import { Store } from 'builder_platform_interaction/storeLib';
import { SORT_OUTPUT_OPTION } from 'builder_platform_interaction/sortEditorLib';

/**
 * Validate the collectionReferenceIndex item.
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
 * @return {function} the function to be called with each queried field to return the array of rules.
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
 * @param {Object} nodeElement the element that need to be validated
 * @param {string} nodeElement.filterLogic - current element's filterLogic
 * @param {string} nodeElement.sortOrder - current element's sortOrder
 * @param {Object} nodeElement.object - current element's object
 * @param {string} nodeElement.wayToStoreFields - current element's wayToStoreFields
 * @param {boolean} nodeElement.getFirstRecordOnly - current element's getFirstRecordOnly
 * @param {Object[]} nodeElement.outputAssignments - current element's outputAssignments
 * @param {Object} nodeElement.outputReference - current element's outputReference
 * @param {Object[]} nodeElement.queriedFields - current element's queriedFields
 * @param {boolean} nodeElement.storeOutputAutomatically - current's element is using automatic output handling
 * @return {Object} the overridden rules
 */
export const getRules = ({ collectionReference, selectedOutput, isSObjectOrApexClass }) => {
    const overriddenRules = { ...sortValidation.finalizedRules };
    const elements = Store.getStore().getCurrentState().elements;
    // validate collectionReference
    overriddenRules.collectionReference = validateCollectionReference(collectionReference, elements);
    if (selectedOutput === SORT_OUTPUT_OPTION.CUSTOM) {
        overriddenRules.limit = [
            ValidationRules.shouldNotBeBlank,
            ValidationRules.shouldNotBeNullOrUndefined,
            ValidationRules.shouldBeAPositiveIntegerOrZero
        ];
    }
    // validate sort options
    overriddenRules.sortOptions = validateSortOptions(isSObjectOrApexClass);
    return overriddenRules;
};
