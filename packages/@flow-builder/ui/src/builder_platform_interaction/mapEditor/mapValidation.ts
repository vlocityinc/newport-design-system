import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
import { Store } from 'builder_platform_interaction/storeLib';

/**
 * Validate the collectionReferenceIndex item.
 *
 * @param elements all elements in store
 * @returns list of function
 */
const validateCollectionReference = (elements) => {
    return [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldReferenceACollection(elements, true)
    ];
};

export const mapValidation = new Validation();

/**
 * Build specific overridden rules
 *
 * @returns {Object} the overridden rules
 */
export const getRules = () => {
    const overriddenRules = { ...mapValidation.finalizedRules };
    const elements = Store.getStore().getCurrentState().elements;
    // validate collectionReference
    overriddenRules.collectionReference = validateCollectionReference(elements);
    return overriddenRules;
};
