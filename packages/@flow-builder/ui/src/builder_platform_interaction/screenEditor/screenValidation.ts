import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation, defaultRules } from 'builder_platform_interaction/validation';

import { getCachedExtension, getCachedExtensionType } from 'builder_platform_interaction/flowExtensionLib';
import {
    isExtensionField,
    isChoiceField,
    isRegionField,
    isRegionContainerField
} from 'builder_platform_interaction/screenEditorUtils';
import { isReference } from 'builder_platform_interaction/commonUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const LONG_STRING_LEN = 65535;
const MAX_SCALE_VALUE = 17;

type Guid = string;
interface GuidName {
    guid: Guid;
    name: string;
}

// TODO: tighten up
interface Field {
    [key: string]: any;
}

// TODO: tighten up
interface Rules {
    [key: string]: any;
}

const addRules = (property, rules, propertyRules) => {
    if (!rules.hasOwnProperty(property)) {
        rules[property] = [];
    }

    rules[property].push(...propertyRules);
};

const addDefaultRules = (rules) => {
    for (const propertyName in defaultRules) {
        if (defaultRules.hasOwnProperty(propertyName)) {
            addRules(propertyName, rules, defaultRules[propertyName]);
        }
    }
};

/**
 * Rules common to screen and screen field. Right now it only adds default validation rules,
 * but all rules applying to all properties from either a screen or a screen field should be added here
 *
 * @param {object} rules - The rules
 */
const addCommonRules = (rules) => {
    // Common rules
    addRules('helpText', rules, [ValidationRules.isValidResourcedTextArea]);

    addRules('pausedText', rules, [ValidationRules.isValidResourcedTextArea]);

    addDefaultRules(rules);
};

const addCommonFieldRules = (rules, { defaultValueIndex }) => {
    // Common rules
    addRules('defaultValue', rules, [
        ValidationRules.maximumCharactersLimit(255),
        ValidationRules.validateResourcePicker(defaultValueIndex)
    ]);

    addRules('errorMessage', rules, [ValidationRules.maximumCharactersLimit(LONG_STRING_LEN)]);

    addRules('helpText', rules, [ValidationRules.maximumCharactersLimit(LONG_STRING_LEN)]);
};

const getDescriptorForExtension = (extName: string): any => {
    if (extName) {
        const descriptor = getCachedExtension(extName);
        if (descriptor) {
            return descriptor;
        }
    }

    throw new Error('Error found trying to determine the descriptor for ' + extName);
};

const getGenericTypesForExtension = (extName: string) => {
    if (extName) {
        let extensionGenericTypes;
        const extension: any = getCachedExtensionType(extName);
        if (extension) {
            extensionGenericTypes = extension.genericTypes;
        } else {
            extensionGenericTypes = null;
        }
        return extensionGenericTypes;
    }
    throw new Error('Flow extension not found ' + extName);
};

// DISABLED UNTIL WE HAVE A CONVERSATION ABOUT TYPE VALIDATION OUTSIDE OF FRP
// THIS IS EXTRA VALIDATION AND NOT REALLY REQUIRED, I WANTED TO HAVE IT HERE TO
// DOUBLE CHECK BEFORE SAVING THE SCREEN TO THE STORE SO THAT WE DON'T RELY EXCLUSIVELY
// ON THE VALIDATION PERFORMED BY THE FRP (AS THIS WOULD BE VIEW-ONLY VALIDATION),
// BUT IT SEEMS THAT IS THE WAY ALL OTHER EDITORS WORK AND THERE IS NO WAY TO
// HAVE TYPE ASSIGNMENT VALIDATION RULES RUN HERE RIGHT NOW (LET'S REVISIT IN 220)
const createTypeValidationRule = (/* type */) => {
    // This is the validation rule itself, here we return an error message if the type of the reference is not compatible with the type in the descriptor
    return (/* value */) => {
        return null;
        /*
        let error = null;
        // TODO Check if it is a reference and if it is not do regular validation
        if (isReference(value)) {
            // go to store and retrive the type of 'value' and make sure that it is compatible with 'type'
            const valueTypeFromStore = getElementByDevName(removeCurlyBraces(value));
            if (type !== valueTypeFromStore.dataType.toLowerCase()) { // We should use assignment rules here
                error =  'Reference should be of type ' + type;
            }
        } else {
            const normalizedType = getFerovTypeFromTypeName(type);
            if (normalizedType === 'Number') {
                error = ValidationRules.shouldBeANumber(value);
            } else if (normalizedType === 'Date') {
                error = ValidationRules.shouldBeANumber(value);
            }
        }

        return error;
        */
    };
};

/**
 * Returns a set of rules for the property, checking type and requiredness
 *
 * @param type - The data type
 * @param required - Requiredness
 * @param rowIndex
 * @returns - The rules
 */
const getExtensionParameterRules = (type: string, required: boolean, rowIndex?: number): Rules => {
    const rules: any = [];
    if (required) {
        rules.push(ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined);
    }

    if (type) {
        rules.push(createTypeValidationRule(/* type */));
    }

    rules.push(ValidationRules.validateResourcePicker(rowIndex));

    return rules;
};

const getDynamicTypeMappingRules = (rowIndex) => {
    return [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.validateResourcePicker(rowIndex)
    ];
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
    const genericTypes = getGenericTypesForExtension(extensionName);

    if (genericTypes) {
        rules.dynamicTypeMappings = function (dynamicTypeMapping) {
            return {
                typeValue: getDynamicTypeMappingRules(dynamicTypeMapping.rowIndex)
            };
        };
    }

    rules.inputParameters = (param) => {
        const inputName = param.name.value ? param.name.value : param.name;
        const attributeDescriptor = descriptor.inputParameters.find((p) => p.apiName === inputName);
        if (!attributeDescriptor) {
            throw new Error(`Cannot find parameter ${inputName} in the description of ${extensionName}`);
        } else {
            // here we have the attribute from the definition and the parameter from the field, let's make sure that the type and the requiredness match
            const type = attributeDescriptor.dataType;
            const required = attributeDescriptor.isRequired && !attributeDescriptor.hasDefaultValue;
            return {
                value: getExtensionParameterRules(type, required, param.rowIndex)
            };
        }
    };

    rules.outputParameters = (param) => {
        // Find attribute description in the definition of the extension
        const outputName = param.name.value ? param.name.value : param.name;
        const attributeDescriptors = descriptor.outputParameters.filter((p) => p.apiName === outputName);
        if (attributeDescriptors.length < 1) {
            throw new Error('Cannot find parameter ' + outputName + ' in the description of ' + extensionName);
        } else {
            // const type = attributeDescriptors[0].dataType;
            return {
                value: [createTypeValidationRule(/* type */), ValidationRules.validateResourcePicker(param.rowIndex)]
            };
        }
    };
};

/**
 * Creates a validation rule that will execute requiredness validation only if the value provided (dependentValue) is not empty
 *
 * @param {string} dependentValue - The value that toggles requiredness validation (passing a value in this argument will trigger requiredness validation)
 * @returns {Function} - The validation rule
 */
const createConditionalRuleForTextProperty = (dependentValue) => {
    return (propertyValue) => {
        if (dependentValue && dependentValue.value && dependentValue.value.length) {
            let error = ValidationRules.shouldNotBeBlank(propertyValue);
            if (!error) {
                error = ValidationRules.shouldNotBeNullOrUndefined(propertyValue);
            }

            return error;
        }

        return null;
    };
};

/**
 * Creates a validation rule that will always return null if the value is a reference, if it is not, the wrapped rule will be executed
 *
 * @param rule - The rule to execute if the value is not a reference
 * @param dataType
 * @returns - The validation rule
 */
const createReferenceSafeRule = (rule: any, dataType?: any): Function => {
    return (value) => {
        if (isReference(value) || (dataType && dataType === 'reference')) {
            return null;
        }

        return rule(value);
    };
};

/**
 * Adds rules for the provided screen field (specific rules based on type)
 *
 * @param {screenfield} field - The screen field
 * @param {object} rules - The rules
 * @param newValueIsReference
 */
const getRulesForInputField = (field, rules, newValueIsReference = false) => {
    const typeName = field && field.type && field.type.name;

    if (!newValueIsReference) {
        // Number based fields
        if (typeName === 'Number' || typeName === 'Currency') {
            addRules('scale', rules, [
                createReferenceSafeRule(ValidationRules.shouldBeAPositiveIntegerOrZero),
                createReferenceSafeRule(ValidationRules.shouldBeUnderMaxValue(MAX_SCALE_VALUE))
            ]);
        }

        // Date
        if (typeName === 'Date') {
            addRules('defaultValue', rules, [
                createReferenceSafeRule(ValidationRules.shouldBeADate, field.defaultValueDataType)
            ]);
        }

        // Date/Time
        if (typeName === FLOW_DATA_TYPE.DATE_TIME.value) {
            addRules('defaultValue', rules, [createReferenceSafeRule(ValidationRules.shouldBeADateTime)]);
        }
    }

    // Choice based field
    if (isChoiceField(field)) {
        rules.choiceReferences = () => {
            return {
                choiceReference: [
                    createReferenceSafeRule(ValidationRules.shouldNotBeBlank),
                    ValidationRules.shouldNotBeNullOrUndefined
                ]
            };
        };
    }

    // LargeTextArea
    if (typeName === 'LargeTextArea') {
        addRules('defaultValue', rules, [ValidationRules.isValidResourcedTextArea]);
    }

    // DisplayText
    if (typeName === 'DisplayText') {
        addRules('fieldText', rules, [
            createReferenceSafeRule(ValidationRules.maximumCharactersLimit(LONG_STRING_LEN)),
            ValidationRules.isValidResourcedTextArea
        ]);
    }

    // Error message and formulaExpression are dependent on each other
    rules.validationRule = {
        formulaExpression: [
            createConditionalRuleForTextProperty(field.validationRule.errorMessage),
            ValidationRules.isValidFormulaExpression
        ],
        errorMessage: [
            createConditionalRuleForTextProperty(field.validationRule.formulaExpression),
            ValidationRules.isValidResourcedTextArea
        ]
    };
};

/**
 * Returns validation rules for a screenfield
 *
 * @param {screenfield} field - The screen field
 * @param newValueIsReference
 * @returns {object} rules - The rules
 */
export const getRulesForField = (field, newValueIsReference = false) => {
    const rules: Rules = {};

    addCommonRules(rules);
    addCommonFieldRules(rules, field);

    if (isExtensionField(field)) {
        getRulesForExtensionField(field, rules);
    } else if (isRegionContainerField(field) || isRegionField(field)) {
        rules.fields = (childField) => {
            return getRulesForField(childField, childField.defaultValueDataType === 'reference');
        };
    } else {
        getRulesForInputField(field, rules, newValueIsReference);
    }

    return rules;
};

/**
 * Returns all validation rules for a screen
 *
 * @returns The rules
 */
const getScreenAdditionalRules = (): Rules => {
    const rules: Rules = {};

    addCommonRules(rules);

    rules.fields = (field) => {
        return getRulesForField(field, field.defaultValueDataType === 'reference');
    };

    return rules;
};

/**
 * Create a GuidName for all the entries in fields, recursively.
 *
 * @param fields - The fields
 * @returns the GuidName array for the fields
 */
export const fieldsToGuidNames = (fields: Field[] = []): GuidName[] => {
    let guidNameTuples: GuidName[] = [];

    fields
        .filter((field) => field.name != null)
        .forEach((field) => {
            guidNameTuples.push({ guid: field.guid, name: field.name.value });

            const nestedFields = field.fields;
            if (nestedFields) {
                guidNameTuples = [...guidNameTuples, ...fieldsToGuidNames(nestedFields)];
            }
        });

    return guidNameTuples;
};

class ScreenValidation extends Validation {
    /**
     * Method to check if devname is unique locally amongst all other fields and parent screen node state.
     *
     * @param state -  overall state of screen node
     * @param devNameToBeValidated - for uniqueness
     * @param currentFieldGuid - guid of the current field whose devname is tested for uniquness
     * @returns errorString or null
     */
    validateFieldNameUniquenessLocally = (
        state: any,
        devNameToBeValidated: string,
        currentFieldGuid: Guid
    ): string | null => {
        const stateGuidToDevName = [
            {
                guid: state.guid,
                name: state.name.value
            }
        ];
        const fieldsDevNameToGuidList = fieldsToGuidNames(state.fields);
        const finalListOfGuidToDevNames = stateGuidToDevName.concat(fieldsDevNameToGuidList);
        return this.validateDevNameUniquenessLocally(finalListOfGuidToDevNames, devNameToBeValidated, currentFieldGuid);
    };
}

// @ts-ignore
export const screenValidation = new ScreenValidation(getScreenAdditionalRules());

export const getExtensionParameterValidation = (propertyName, type, required) => {
    const rules = getExtensionParameterRules(type, required);

    // @ts-ignore
    return new Validation({ [propertyName]: rules });
};

/**
 * @param rowIndex
 */
export function getDynamicTypeMappingValidation(rowIndex) {
    const rules = getDynamicTypeMappingRules(rowIndex);

    // @ts-ignore
    return new Validation({ dynamicTypeMapping: rules });
}
