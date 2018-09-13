import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { getFerovTypeFromTypeName, getCachedExtensions } from "builder_platform_interaction/screenEditorUtils";

const MAX_ERR_MESSAGE_LEN = 65535;
const MAX_SCALE_VALUE = 17;


/**
 * @constant screenAdditionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const screenAdditionalRules = {
    'fields' : {
        'name' : [
            ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
            ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
            ValidationRules.maximumCharactersLimit(80)
        ],
        'label' : [
            ValidationRules.maximumCharactersLimit(1000)
        ],
        'type.name="Number"': {
            'scale' : [
                ValidationRules.shouldBeAPositiveIntegerOrZero,
                ValidationRules.shouldBeUnderMaxValue(MAX_SCALE_VALUE)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="TextBox"': {
            'defaultValue' : [
                ValidationRules.maximumCharactersLimit(255)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="LargeTextArea"': {
            'defaultValue' : [
                ValidationRules.maximumCharactersLimit(255)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="Currency"': {
            'scale' : [
                ValidationRules.shouldBeAPositiveIntegerOrZero,
                ValidationRules.shouldBeUnderMaxValue(MAX_SCALE_VALUE)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="Date"': {
            'defaultValue' : [
                ValidationRules.shouldBeADate
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="Password"': {
            'defaultValue' : [
                ValidationRules.maximumCharactersLimit(255)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'inputParameters': (parameter, parentChain) => {
            return getRulesFromDescripton('value', parameter, parentChain);
        },
        'outputParameters': (parameter, parentChain) => {
            return getRulesFromDescripton('assignToReference', parameter, parentChain);
        },
        // TODO: W-5297355 - add complete set of validation rules for screens
    }
};

export const screenValidation = new Validation(screenAdditionalRules);

export function getExtensionParameterValidation(propertyName, type, required) {
    return new Validation(getExtensionParameterRules(propertyName, type, required));
}

/**
 * Returns the validation rules for a extension screen field parameter (determines requiredness and type using the LC definition).
 *
 * @param {*} propertyName - The property to validate in the parameter
 * @param {*} parameter - The parameter
 * @param {*} parentChain - The stack of parent containers (used to determine the extensionName)
 * @returns {object} - The set of rules for the parameter
 */
function getRulesFromDescripton(propertyName, parameter, parentChain) {
    // Get validation data from the (cached) extension description
    const parent = parentChain[parentChain.length - 1];
    const descs = getCachedExtensions([parent.extensionName.value]);
    if (descs && descs.length === 1) {
        const paramName = parameter.name.value ? parameter.name.value : parameter.name;
        const filteredInputs = descs[0].inputParameters.filter(p => p.apiName === paramName);
        if (filteredInputs.length !== 1) {
            throw new Error('Cannot find parameter ' + paramName + ' in the description of ' + parent.extensionName.value);
        }

        const type = filteredInputs[0].dataType;
        const required = filteredInputs[0].isRequired;
        return getExtensionParameterRules(propertyName, type, required);
    }

    throw new Error('Cannot find description for extension: ' + parent.extensionName.value);
}

/**
 * Returns a set of rules for the property, checking type and requiredness
 *
 * @param {string} propertyName - The name of the property
 * @param {string} type - The data type
 * @param {boolean} required - Requiredness
 * @returns {object} - The rules
 */
function getExtensionParameterRules(propertyName, type, required) {
    const rules = [];
    if (required) {
        rules.push(ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined);
    }

    if (type) {
        const normalizedType = getFerovTypeFromTypeName(type);
        // TODO validate all supported types - W-5297355
        if (normalizedType === 'date') {
            rules.push(ValidationRules.shouldBeADate);
        }

        if (normalizedType === 'number') {
            rules.push(ValidationRules.shouldBeANumber);
        }
    }

    return {
        [propertyName] : rules
    };
}
