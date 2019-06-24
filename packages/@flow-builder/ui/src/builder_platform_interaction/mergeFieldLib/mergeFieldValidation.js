import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    FLOW_DATA_TYPE,
    isComplexType
} from 'builder_platform_interaction/dataTypeLib';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import { LABELS } from './mergeFieldValidationLabels';
import {
    GLOBAL_CONSTANT_PREFIX,
    getGlobalConstantOrSystemVariable
} from 'builder_platform_interaction/systemLib';
import {
    format,
    splitStringBySeparator
} from 'builder_platform_interaction/commonUtils';
import { isElementAllowed } from 'builder_platform_interaction/expressionUtils';
import {
    elementToParam,
    getDataType
} from 'builder_platform_interaction/ruleLib';
import { getPropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import {
    getCachedExtension,
    getExtensionParamDescriptionAsComplexTypeFieldDescription
} from 'builder_platform_interaction/screenEditorUtils';

const MERGE_FIELD_START_CHARS = '{!';
const MERGE_FIELD_END_CHARS = '}';
// This regex does not support Cross-Object field references
const MERGEFIELD_REGEX = /\{!(\$\w+\.\w+|\w+\.\w+|\w+)\}/g;

const SYSTEM_VARIABLE_PREFIX = '$Flow.';
const SYSTEM_VARIABLE_CLIENT_PREFIX = '$Client.';

const VALIDATION_ERROR_TYPE = {
    INVALID_MERGEFIELD: 'notAValidMergeField',
    INVALID_GLOBAL_CONSTANT: 'invalidGlobalConstant',
    INVALID_GLOBAL_VARIABLE: 'invalidGlobalVariable',
    UNKNOWN_MERGE_FIELD: 'unknownMergeField',
    WRONG_DATA_TYPE: 'wrongDataType'
};

/**
 * Validate merge fields.
 *
 * Validation is best-effort only : no false negatives but there can be false positives. This is because some validations
 * are not yet supported and because validateMergeField is synchronous which means data (field descriptions ...) must
 * already have been retrieved from server for validation.
 *
 * Cross-Object field references ({!sObjectVariable.objectName1.objectName2.fieldName}) are not supported.
 */
export class MergeFieldsValidation {
    allowGlobalConstants = true;
    allowCollectionVariables = false;

    // The allowed param types for merge field based on rule service.
    // If present, this is used to validate the element merge field.
    allowedParamTypes = null;

    /**
     * @typedef {Object} ValidationError
     *
     * @property {String} errorType the error type
     * @property {String} message the validation error message
     * @property {Number} startIndex start index in the text where the error occurred
     * @property {Number} endIndex end index in the text where the error occurred
     */

    /**
     * Validate a merge field
     *
     * @param {string}
     *            mergeField the merge field (ex : {!variable1.Name})
     * @returns {ValidationError[]} The validation errors
     */
    validateMergeField(mergeField) {
        try {
            const match = MERGEFIELD_REGEX.exec(mergeField);
            if (match === null || match[0] !== mergeField) {
                const validationErrorLabel = format(
                    LABELS.notAValidMergeField,
                    mergeField
                );
                const validationError = this._validationError(
                    VALIDATION_ERROR_TYPE.INVALID_MERGEFIELD,
                    validationErrorLabel,
                    0,
                    mergeField.length - 1
                );
                return [validationError];
            }
            return this._validateMergeFieldReferenceValue(match[1], 2);
        } finally {
            MERGEFIELD_REGEX.lastIndex = 0;
        }
    }

    /**
     * Checks if input text is text with merge field(s).
     * ex: {!variable1.Name} - false
     *     test input - false
     *     Hi {!variable1.Name} - true
     * @param {string} text
     *          input text
     * @return {boolean} true if input is text with merge field
     */
    static isTextWithMergeFields(text) {
        if (typeof text !== 'string') {
            return false;
        }

        try {
            const match = MERGEFIELD_REGEX.exec(text);
            return match !== null && match[0] !== text;
        } finally {
            MERGEFIELD_REGEX.lastIndex = 0;
        }
    }

    _validationError(errorType, message, startIndex, endIndex) {
        return {
            errorType,
            message,
            startIndex,
            endIndex
        };
    }

    _getReferenceValue(mergeFieldReference) {
        return mergeFieldReference.substring(
            MERGE_FIELD_START_CHARS.length,
            mergeFieldReference.length - MERGE_FIELD_END_CHARS.length
        );
    }

    _isGlobalConstantMergeField(mergeFieldReferenceValue) {
        return mergeFieldReferenceValue.startsWith(GLOBAL_CONSTANT_PREFIX);
    }

    _isSystemVariableMergeField(mergeFieldReferenceValue) {
        return mergeFieldReferenceValue.startsWith(SYSTEM_VARIABLE_PREFIX);
    }

    _isSystemVariableClientMergeField(mergeFieldReferenceValue) {
        return mergeFieldReferenceValue.startsWith(
            SYSTEM_VARIABLE_CLIENT_PREFIX
        );
    }

    _isGlobalVariableMergeField(mergeFieldReferenceValue) {
        return (
            mergeFieldReferenceValue.startsWith('$') &&
            !this._isGlobalConstantMergeField(mergeFieldReferenceValue) &&
            !this._isSystemVariableMergeField(mergeFieldReferenceValue) &&
            !this._isSystemVariableClientMergeField(mergeFieldReferenceValue)
        );
    }

    _validateMergeFieldReferenceValue(mergeFieldReferenceValue, index) {
        if (this._isGlobalConstantMergeField(mergeFieldReferenceValue)) {
            return this._validateGlobalConstant(
                mergeFieldReferenceValue,
                index
            );
        }
        if (this._isGlobalVariableMergeField(mergeFieldReferenceValue)) {
            return this._validateGlobalVariable(
                mergeFieldReferenceValue,
                index
            );
        }
        if (this._isSystemVariableMergeField(mergeFieldReferenceValue)) {
            return this._validateSystemVariable(
                mergeFieldReferenceValue,
                index
            );
        }
        if (this._isSystemVariableClientMergeField(mergeFieldReferenceValue)) {
            return this._validateSystemVariable(
                mergeFieldReferenceValue,
                index
            );
        }
        if (mergeFieldReferenceValue.indexOf('.') !== -1) {
            return this._validateComplexTypeFieldMergeField(
                mergeFieldReferenceValue,
                index
            );
        }
        return this._validateElementMergeField(mergeFieldReferenceValue, index);
    }

    _validateGlobalConstant(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const globalConstant = getGlobalConstantOrSystemVariable(
            mergeFieldReferenceValue
        );
        if (!this.allowGlobalConstants) {
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.INVALID_MERGEFIELD,
                LABELS.globalConstantsNotAllowed,
                index,
                endIndex
            );
            return [validationError];
        }
        if (!globalConstant) {
            const validationErrorLabel = format(
                LABELS.genericErrorMessage,
                MERGE_FIELD_START_CHARS +
                    mergeFieldReferenceValue +
                    MERGE_FIELD_END_CHARS
            );
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.INVALID_GLOBAL_CONSTANT,
                validationErrorLabel,
                index,
                endIndex
            );
            return [validationError];
        }
        if (!this._isElementValidForAllowedParamTypes(globalConstant)) {
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE,
                LABELS.invalidDataType,
                index,
                endIndex
            );
            return [validationError];
        }
        return [];
    }

    _validateSystemVariable(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const systemVariable = getGlobalConstantOrSystemVariable(
            mergeFieldReferenceValue
        );
        if (!systemVariable) {
            const validationErrorLabel = format(
                LABELS.genericErrorMessage,
                MERGE_FIELD_START_CHARS +
                    mergeFieldReferenceValue +
                    MERGE_FIELD_END_CHARS
            );
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.INVALID_GLOBAL_VARIABLE,
                validationErrorLabel,
                index,
                endIndex
            );
            return [validationError];
        }
        if (!this._isElementValidForAllowedParamTypes(systemVariable)) {
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE,
                LABELS.invalidDataType,
                index,
                endIndex
            );
            return [validationError];
        }
        return [];
    }

    _validateGlobalVariable() {
        // TODO : validate global variables
        return [];
    }

    _isElementValidForAllowedParamTypes(element) {
        if (!this.allowedParamTypes) {
            return true;
        }
        return isElementAllowed(
            this.allowedParamTypes,
            elementToParam(element)
        );
    }

    _validateElementMergeField(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const element = getElementByDevName(mergeFieldReferenceValue);
        if (!element) {
            const validationErrorLabel = format(
                LABELS.unknownResource,
                mergeFieldReferenceValue
            );
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD,
                validationErrorLabel,
                index,
                endIndex
            );
            return [validationError];
        }

        if (this.allowedParamTypes) {
            if (!this._isElementValidForAllowedParamTypes(element)) {
                const validationError = this._validationError(
                    VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE,
                    LABELS.invalidDataType,
                    index,
                    endIndex
                );
                return [validationError];
            }
        } else {
            const elementType = this._getElementType(element);
            if (
                elementType.dataType === null ||
                (!this.allowCollectionVariables && elementType.isCollection)
            ) {
                const validationErrorLabel = format(
                    LABELS.resourceCannotBeUsedAsMergeField,
                    mergeFieldReferenceValue
                );
                const validationError = this._validationError(
                    VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE,
                    validationErrorLabel,
                    index,
                    endIndex
                );
                return [validationError];
            }
        }
        return [];
    }

    _getElementType(element) {
        let dataType = getDataType(element) || null;
        const isCollection = element.isCollection || false;
        const subtype = element.subtype;
        if (element.elementType === ELEMENT_TYPE.STAGE) {
            dataType = FLOW_DATA_TYPE.STRING.value;
        }
        return {
            dataType,
            isCollection,
            subtype
        };
    }

    _validateComplexTypeFieldMergeField(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const parts = splitStringBySeparator(mergeFieldReferenceValue);
        const elementName = parts[0];
        const fieldName = parts[1];
        const element = getElementByDevName(elementName);

        if (!element) {
            const validationErrorLabel = format(
                LABELS.unknownResource,
                elementName
            );
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD,
                validationErrorLabel,
                index,
                endIndex
            );
            return [validationError];
        }
        if (!element.dataType) {
            const validationErrorLabel = format(
                LABELS.notAValidMergeField,
                MERGE_FIELD_START_CHARS +
                    mergeFieldReferenceValue +
                    MERGE_FIELD_END_CHARS
            );
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.INVALID_MERGEFIELD,
                validationErrorLabel,
                index,
                endIndex
            );
            return [validationError];
        }
        if (
            !isComplexType(element.dataType) ||
            (!this.allowCollectionVariables && element.isCollection)
        ) {
            const validationErrorLabel = format(
                LABELS.resourceCannotBeUsedAsMergeField,
                mergeFieldReferenceValue
            );
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE,
                validationErrorLabel,
                index,
                endIndex
            );
            return [validationError];
        }
        let field;
        if (element.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
            field = this._getFieldForEntity(element.subtype, fieldName);
            if (!field) {
                const validationErrorLabel = format(
                    LABELS.unknownRecordField,
                    fieldName,
                    element.subtype
                );
                return [
                    this._validationError(
                        VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD,
                        validationErrorLabel,
                        index,
                        endIndex
                    )
                ];
            }
        } else if (element.dataType === FLOW_DATA_TYPE.APEX.value) {
            field = this._getPropertyForApexClass(element.subtype, fieldName);
            if (!field) {
                const validationErrorLabel = format(
                    LABELS.unknownRecordField,
                    fieldName,
                    element.subtype
                );
                return [
                    this._validationError(
                        VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD,
                        validationErrorLabel,
                        index,
                        endIndex
                    )
                ];
            }
        } else if (
            element.dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value
        ) {
            // this lib is synchronous, we check the field only if already cached.
            const extension = getCachedExtension(element.extensionName);
            if (extension) {
                field = this._getOutputParameterForExtension(
                    extension,
                    fieldName
                );
                if (!field) {
                    const validationErrorLabel = format(
                        LABELS.unknownRecordField,
                        fieldName,
                        element.extensionName
                    );
                    return [
                        this._validationError(
                            VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD,
                            validationErrorLabel,
                            index,
                            endIndex
                        )
                    ];
                }
            }
        }
        if (field && !this._isElementValidForAllowedParamTypes(field)) {
            const validationError = this._validationError(
                VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE,
                LABELS.invalidDataType,
                index,
                endIndex
            );
            return [validationError];
        }
        return [];
    }

    _getOutputParameterForExtension(extension, parameterName) {
        parameterName = parameterName.toLowerCase();
        const outputParam = extension.outputParameters.find(
            param => parameterName === param.apiName.toLowerCase()
        );
        return (
            outputParam &&
            getExtensionParamDescriptionAsComplexTypeFieldDescription(
                outputParam
            )
        );
    }

    _getFieldForEntity(entityName, fieldName) {
        fieldName = fieldName.toLowerCase();
        const fields = sobjectLib.getFieldsForEntity(entityName);
        for (const apiName in fields) {
            if (fields.hasOwnProperty(apiName)) {
                if (fieldName === apiName.toLowerCase()) {
                    return fields[apiName];
                }
            }
        }
        return undefined;
    }

    _getPropertyForApexClass(apexClassName, propertyName) {
        propertyName = propertyName.toLowerCase();
        const properties = getPropertiesForClass(apexClassName);
        for (const apiName in properties) {
            if (properties.hasOwnProperty(apiName)) {
                if (propertyName === apiName.toLowerCase()) {
                    return properties[apiName];
                }
            }
        }
        return undefined;
    }
}

/**
 * Validate text with merge fields
 *
 * @param {string}
 *            textWithMergeFields text with merge fields (ex :
 *            '{!variable1.Name} == {!variable2.Name}')
 * @returns {ValidationError[]} The validation errors
 */
export function validateTextWithMergeFields(
    textWithMergeFields,
    { allowGlobalConstants = true, allowCollectionVariables = false } = {}
) {
    const validation = new MergeFieldsValidation();
    validation.allowGlobalConstants = allowGlobalConstants;
    validation.allowCollectionVariables = allowCollectionVariables;

    const results = [];
    let match;
    try {
        while ((match = MERGEFIELD_REGEX.exec(textWithMergeFields)) !== null) {
            results.push(
                validation._validateMergeFieldReferenceValue(
                    match[1],
                    match.index + 2
                )
            );
        }
        return [].concat.apply([], results);
    } finally {
        MERGEFIELD_REGEX.lastIndex = 0;
    }
}

export function validateMergeField(
    mergeField,
    {
        allowGlobalConstants = true,
        allowedParamTypes = null,
        allowCollectionVariables = false
    } = {}
) {
    const validation = new MergeFieldsValidation();
    validation.allowGlobalConstants = allowGlobalConstants;
    validation.allowedParamTypes = allowedParamTypes;
    validation.allowCollectionVariables = allowCollectionVariables;
    return validation.validateMergeField(mergeField);
}

export function isTextWithMergeFields(text) {
    return MergeFieldsValidation.isTextWithMergeFields(text);
}
