import { Store } from 'builder_platform_interaction/storeLib';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

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

const validateMapItems = () => ValidationRules.validateExpressionWith3Properties();

export const mapValidation = new Validation();

/**
 * Build specific overridden rules
 *
 * @returns {Object} the overridden rules
 */
export const getRules = () => {
    const overriddenRules = { ...mapValidation.finalizedRules };
    const elements = Store.getStore().getCurrentState().elements;
    // validate assignNextValueToReference
    overriddenRules.assignNextValueToReference = [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank
    ];
    // validate outputSObjectType
    overriddenRules.outputSObjectType = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
    // validate collectionReference
    overriddenRules.collectionReference = validateCollectionReference(elements);
    // validate mapItems
    overriddenRules.mapItems = validateMapItems();
    return overriddenRules;
};
