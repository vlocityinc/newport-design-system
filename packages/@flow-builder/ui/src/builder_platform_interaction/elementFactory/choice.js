import { baseElementsArrayToMap, baseResource } from './base/baseElement';
import {
    createFEROV,
    createFEROVMetadataObject,
    getDataTypeKey
} from './ferov';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseResourceMetadataObject } from './base/baseMetadata';
import { createValidationRuleObject } from './base/baseValidationInput';
import { generateGuid } from 'builder_platform_interaction/storeLib';

const elementType = ELEMENT_TYPE.CHOICE;
const STORED_VALUE_PROPERTY = 'storedValue';
export const STORED_VALUE_DATA_TYPE_PROPERTY = getDataTypeKey(
    STORED_VALUE_PROPERTY
);

/**
 * @typedef {Object} userInput
 * @param {boolean} isRequired used in required checkbox for input label settings
 * @param {string} promptText used as input label
 * @param {validationRule} validationRule object containing formula expression and its related error message
 */
/**
 * Factory function to create userInput Object that is used inside the choice element object
 * @param {userInput} userInput
 * @returns {userInput} userInput object for choice
 */
export function createUserInputForChoice(userInput = {}) {
    const { isRequired = false, promptText = null } = userInput;
    let validationRule;
    if (userInput.validationRule) {
        validationRule = createValidationRuleObject(userInput.validationRule);
    }
    return {
        isRequired,
        promptText,
        validationRule
    };
}

/**
 * @typedef {choice} choice factory element object
 * @param {string} dataType data type of the choice element
 * @param {string} choiceText label for choices
 * @param {Object} value ferov object
 * @param {userInput} userInput
 * @param {string} elementType represents element type meta data string
 * @param {string} storedValue derived from the ferov value object
 * @param {string} storedValueDataType derived from the ferov value object
 * @param {boolean} isShowInputSelected false by default, true if userInput section is present
 * @param {boolean} isValidateSelected false by default, true if validationRule section is present
 */
/**
 * Factory function for creating choice element
 * @param {choice} choice
 * @returns {choice} choice factory object
 */
export function createChoice(choice = {}) {
    const newChoice = baseResource(choice);
    let valueFerov,
        isShowInputSelected = false, // isShowIfInputSelected is false by default to hide the section
        isValidateSelected = false; // false by default to keep the validate section close by default
    const { dataType = null, choiceText = null, value, userInput } = choice;
    let newUserInput;
    // create metadata for supporting the UI section state (show/hide)
    if (userInput) {
        isShowInputSelected = true;
        newUserInput = createUserInputForChoice(userInput);
        if (userInput.validationRule) {
            isValidateSelected = true;
        }
    }

    if (value) {
        valueFerov = createFEROV(
            value,
            STORED_VALUE_PROPERTY,
            STORED_VALUE_DATA_TYPE_PROPERTY
        );
    }

    const {
        storedValue = null,
        storedValueDataType = null,
        storedValueIndex = generateGuid()
    } = valueFerov || choice;

    return Object.assign(newChoice, {
        elementType,
        dataType,
        choiceText,
        storedValue,
        storedValueDataType,
        storedValueIndex,
        isShowInputSelected,
        isValidateSelected,
        userInput: newUserInput
    });
}

/**
 * Factory function for creating choice element object for store
 * @param {choice} choice
 * @returns {Object} object in a {guid : [choice]} format
 */
export function createChoiceForStore(choice) {
    if (!choice) {
        throw new Error(
            'choice is required to create choice element for store'
        );
    }
    const newChoice = createChoice(choice);
    return baseElementsArrayToMap([newChoice]);
}

/**
 * Factory function to create choice object compatible with meta data shape.
 * @param {choice} choice
 * @returns {choice} choice object in metadata compatible shape.
 */
export function createChoiceMetadataObject(choice) {
    if (!choice) {
        throw new Error(
            'choice element object is required while creating choice metadata object'
        );
    }
    const newChoice = baseResourceMetadataObject(choice);
    const { dataType, choiceText, userInput } = choice;
    let valueFerovObject, newUserInput;
    const valueFerov = createFEROVMetadataObject(
        choice,
        STORED_VALUE_PROPERTY,
        STORED_VALUE_DATA_TYPE_PROPERTY
    );
    if (valueFerov) {
        valueFerovObject = { value: valueFerov };
    }
    if (userInput) {
        newUserInput = createUserInputForChoice(userInput);
    }
    return Object.assign(
        newChoice,
        {
            dataType,
            choiceText,
            userInput: newUserInput
        },
        valueFerovObject
    );
}
