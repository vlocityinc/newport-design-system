import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { getFerovTypeFromTypeName, getCachedExtensions, isExtensionField } from "builder_platform_interaction/screenEditorUtils";
import { getElementByDevName } from "builder_platform_interaction/storeUtils";
import { removeCurlyBraces, isReference } from "builder_platform_interaction/commonUtils";

const LONG_STRING_LEN = 65535;
const MAX_SCALE_VALUE = 17;

const addRules = (property, rules, propertyRules) => {
    if (!rules.hasOwnProperty(property)) {
        rules[property] = [];
    }

    rules[property].push(...propertyRules);
};

// Rules common to screen and screen field
const addCommonRules = (rules) => {
    // Common rules
    addRules('name', rules, [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ]);

    addRules('label', rules, [
        ValidationRules.maximumCharactersLimit(1000)
    ]);
};

const addCommonFieldRules = (rules) => {
    // Common rules
    addRules('defaultValue', rules, [
        ValidationRules.maximumCharactersLimit(255)
    ]);

    addRules('errorMessage', rules, [
        ValidationRules.maximumCharactersLimit(LONG_STRING_LEN)
    ]);

    addRules('helpText', rules [
        ValidationRules.maximumCharactersLimit(LONG_STRING_LEN)
    ]);
};

const getDescriptorForExtension = (extName) => {
    if (extName) {
        const descs = getCachedExtensions([extName]);
        if (descs && descs.length === 1) {
            return descs[0];
        }
    }

    throw new Error('Error found trying to determine the descriptor for ' + extName);
};

const createTypeValidationRule = (type) => {
    // This is the validation rule itself, here we return an error message if the type of the reference is not compatible with the type in the descriptor
    return (value) => {
        let error = null;
        // TODO Check if it is a reference and if it is not do regular validation
        if (isReference(value)) {
            // go to store and retrive the type of 'value' and make sure that it is compatible with 'type'
            const valueTypeFromStore = getElementByDevName(removeCurlyBraces(value));
            if (type !== valueTypeFromStore.dataType) { // We should use assignment rules here
                error =  'Reference should be of type ' + type;
            }
        } else {
            const normalizedType = getFerovTypeFromTypeName(type);
            if (normalizedType === 'number') {
                error = ValidationRules.shouldBeANumber(value);
            } else if (normalizedType === 'date') {
                error = ValidationRules.shouldBeANumber(value);
            }
        }

        return error;
    };
};

/**
 * Returns a set of rules for the property, checking type and requiredness
 *
 * @param {string} type - The data type
 * @param {boolean} required - Requiredness
 * @returns {object} - The rules
 */
const getExtensionParameterRules = (type, required) => {
    const rules = [];
    if (required) {
        rules.push(ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined);
    }

    if (type) {
        rules.push(createTypeValidationRule(type));
    }

    return rules;
};

/**
 * Adds rules for the provided extension screen field (type and requiredness checks for input params)
 *
 * @param {screenfield} field - The screen field
 * @param {object} rules - The rules
 */
const getRulesForExtensionField = (field, rules) => {
    const extensionName = field.extensionName && field.extensionName.value;
    const descriptor = getDescriptorForExtension(extensionName);

    rules.inputParameters = (param) => {
        const inputName = param.name.value ? param.name.value : param.name;
        const attributeDescriptors = descriptor.inputParameters.filter(p => p.apiName === inputName);
        if (attributeDescriptors.length < 1) {
            throw new Error('Cannot find parameter ' + inputName + ' in the description of ' + extensionName);
        } else {
            // here we have the attribute from the definition and the parameter from the field, let's make sure that the type and the requiredness match
            const type = attributeDescriptors[0].dataType;
            const required = attributeDescriptors[0].isRequired;
            return {value: getExtensionParameterRules(type, required)};
        }
    };

    rules.outputParameters = (param) => {
        // Find attribute description in the definition of the extension
        const outputName = param.name.value ? param.name.value : param.name;
        const attributeDescriptors = descriptor.outputParameters.filter(p => p.apiName === outputName);
        if (attributeDescriptors.length < 1) {
            throw new Error('Cannot find parameter ' + outputName + ' in the description of ' + extensionName);
        } else {
            const type = attributeDescriptors[0].dataType;
            return {
                assignToReference: [createTypeValidationRule(type)]
            };
        }
    };
};

/**
 * Adds rules for the provided screen field (specific rules based on type)
 *
 * @param {screenfield} field - The screen field
 * @param {object} rules - The rules
 */
const getRulesForInputField = (field, rules) => {
    const typeName = field && field.type && field.type.name;

    // Number based fields
    if (typeName === 'Number' || typeName === 'Currency') {
        addRules('scale', rules, [
            ValidationRules.shouldBeAPositiveIntegerOrZero,
            ValidationRules.shouldBeUnderMaxValue(MAX_SCALE_VALUE)
        ]);
    }

    // Date
    if (typeName === 'Date') {
        addRules('defaultValue', rules, [
            ValidationRules.shouldBeADate
        ]);
    }

    // DisplayText
    if (typeName === 'DisplayText') {
        addRules('defaultValue', rules, [
            ValidationRules.maximumCharactersLimit(LONG_STRING_LEN)
        ]);
    }

    // Error message and formulaExpression are dependent on each other
    if (field.errorMessage && field.errorMessage.value) {
        addRules('formulaExpression', rules, [ValidationRules.shouldNotBeBlank]);
    }

    if (field.formulaExpression && field.formulaExpression.value) {
        addRules('errorMessage', rules, [ValidationRules.shouldNotBeBlank]);
    }
};

/**
 * Returns validation rules for a screenfield
 *
 * @param {screenfield} field - The screen field
 * @returns {object} rules - The rules
 */
export const getRulesForField = (field) => {
    const rules = {};

    addCommonRules(rules);
    addCommonFieldRules(rules);

    if (isExtensionField(field)) {
        getRulesForExtensionField(field, rules);
    } else {
        getRulesForInputField(field, rules);
    }

    return rules;
};

/**
 * Returns all validation rules for a screen
 *
 * @returns {object} rules - The rules
 */
const getScreenAdditionalRules = () => {
    const rules = {};

    addCommonRules(rules);
    rules.pausedText = [ValidationRules.maximumCharactersLimit(10)];

    rules.fields = (field) => {
        return getRulesForField(field);
    };

    return rules;
};

export const screenValidation = new Validation(getScreenAdditionalRules());

export const getExtensionParameterValidation = (propertyName, type, required) => {
    const rules = getExtensionParameterRules(type, required);
    return new Validation({[propertyName] : rules});
};