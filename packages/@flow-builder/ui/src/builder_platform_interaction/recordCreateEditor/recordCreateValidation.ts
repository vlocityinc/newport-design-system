// @ts-nocheck
import { WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * Validate the assignment item.
 *
 * @returns {Function} the function to be called with each filter item to return the array of rules.
 */
const validateAssignments = () => ValidationRules.validateExpressionWith2Properties();

/**
 * Validate the inputReference item.
 *
 * @param index
 * @returns {Function} the function to be called with each filter item to return the array of rules.
 */
const validateInputReference = (index) => {
    return [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.validateResourcePicker(index)
    ];
};

export const recordCreateValidation = new Validation();

/**
 * Build specific overridden rules
 *
 * @param {Object} nodeElement the element that needs to be validated
 * @param {boolean} nodeElement.getFirstRecordOnly - current element's getFirstRecordOnly
 * @param {Object} nodeElement.object - current element's object
 * @param nodeElement.objectIndex
 * @param {Object[]} nodeElement.inputAssignments - current element's inputAssignments
 * @param nodeElement.inputReferenceIndex
 * @param nodeElement.assignRecordIdToReferenceIndex
 * @param wayToStoreFields
 * @returns {Object} the overridden rules
 */
export const getRules = (
    { getFirstRecordOnly, object, objectIndex, inputAssignments, inputReferenceIndex, assignRecordIdToReferenceIndex },
    wayToStoreFields
) => {
    const overriddenRules = Object.assign({}, recordCreateValidation.finalizedRules);
    // case where a sObject has been selected
    if (getFirstRecordOnly && wayToStoreFields === WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES) {
        overriddenRules.object = validateInputReference(objectIndex);
        if (object.value !== '' && !object.error) {
            if (inputAssignments.length > 1) {
                overriddenRules.inputAssignments = validateAssignments();
            }
            overriddenRules.assignRecordIdToReference = [
                ValidationRules.validateResourcePicker(assignRecordIdToReferenceIndex)
            ];
        }
    } else {
        overriddenRules.inputReference = validateInputReference(inputReferenceIndex);
    }

    return overriddenRules;
};
