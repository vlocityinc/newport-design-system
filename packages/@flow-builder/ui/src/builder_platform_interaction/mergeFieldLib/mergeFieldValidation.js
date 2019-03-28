import { getElementByDevName } from "builder_platform_interaction/storeUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE, isComplexType } from "builder_platform_interaction/dataTypeLib";
import * as sobjectLib from "builder_platform_interaction/sobjectLib";
import { LABELS } from "./mergeFieldValidationLabels";
import { GLOBAL_CONSTANT_PREFIX, getGlobalConstantOrSystemVariable } from "builder_platform_interaction/systemLib";
import { format, splitStringBySeparator } from "builder_platform_interaction/commonUtils";
import { isElementAllowed } from "builder_platform_interaction/expressionUtils";
import { elementToParam, getDataType } from "builder_platform_interaction/ruleLib";
import { getPropertiesForClass } from 'builder_platform_interaction/apexTypeLib';

const MERGE_FIELD_START_CHARS = '{!';
const MERGE_FIELD_END_CHARS = '}';
// This regex does not support Cross-Object field references
const MERGEFIELD_REGEX = /\{!(\$\w+\.\w+|\w+\.\w+|\w+)\}/g;

const SYSTEM_VARIABLE_PREFIX = '$Flow.';
const SYSTEM_VARIABLE_CLIENT_PREFIX = '$Client.';

const VALIDATION_ERROR_TYPE = {
    INVALID_MERGEFIELD : 'notAValidMergeField',
    INVALID_GLOBAL_CONSTANT : 'invalidGlobalConstant',
    INVALID_GLOBAL_VARIABLE : 'invalidGlobalVariable',
    UNKNOWN_MERGE_FIELD : 'unknownMergeField',
    WRONG_DATA_TYPE : 'wrongDataType'
};

/**
 * Validate merge fields.
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
     * Validate text with merge fields
     *
     * @param {string}
     *            textWithMergeFields text with merge fields (ex :
     *            '{!variable1.Name} == {!variable2.Name}')
     * @returns {ValidationError[]} The validation errors
     */
    validateTextWithMergeFields(textWithMergeFields) {
        const results = [];
        let match;
        try {
            while ((match = MERGEFIELD_REGEX.exec(textWithMergeFields)) !== null) {
                results.push(this._validateMergeFieldReferenceValue(match[1], match.index + 2));
            }
            return [].concat.apply([], results);
        } finally {
            MERGEFIELD_REGEX.lastIndex = 0;
        }
    }

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
                const validationErrorLabel = format(LABELS.notAValidMergeField, mergeField);
                const validationError = this._validationError(VALIDATION_ERROR_TYPE.INVALID_MERGEFIELD, validationErrorLabel, 0, mergeField.length - 1);
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
        return mergeFieldReference.substring(MERGE_FIELD_START_CHARS.length, mergeFieldReference.length - MERGE_FIELD_END_CHARS.length);
    }

    _isGlobalConstantMergeField(mergeFieldReferenceValue) {
        return mergeFieldReferenceValue.startsWith(GLOBAL_CONSTANT_PREFIX);
    }

    _isSystemVariableMergeField(mergeFieldReferenceValue) {
        return mergeFieldReferenceValue.startsWith(SYSTEM_VARIABLE_PREFIX);
    }

    _isSystemVariableClientMergeField(mergeFieldReferenceValue) {
        return mergeFieldReferenceValue.startsWith(SYSTEM_VARIABLE_CLIENT_PREFIX);
    }

    _isGlobalVariableMergeField(mergeFieldReferenceValue) {
        return mergeFieldReferenceValue.startsWith('$')
            && !this._isGlobalConstantMergeField(mergeFieldReferenceValue)
            && !this._isSystemVariableMergeField(mergeFieldReferenceValue)
            && !this._isSystemVariableClientMergeField(mergeFieldReferenceValue);
    }

    _validateMergeFieldReferenceValue(mergeFieldReferenceValue, index) {
        if (this._isGlobalConstantMergeField(mergeFieldReferenceValue)) {
            return this._validateGlobalConstant(mergeFieldReferenceValue, index);
        }
        if (this._isGlobalVariableMergeField(mergeFieldReferenceValue)) {
            return this._validateGlobalVariable(mergeFieldReferenceValue, index);
        }
        if (this._isSystemVariableMergeField(mergeFieldReferenceValue)) {
            return this._validateSystemVariable(mergeFieldReferenceValue, index);
        }
        if (this._isSystemVariableClientMergeField(mergeFieldReferenceValue)) {
            return this._validateSystemVariable(mergeFieldReferenceValue, index);
        }
        if (mergeFieldReferenceValue.indexOf('.') !== -1) {
            return this._validateApexOrSObjectVariableFieldMergeField(mergeFieldReferenceValue, index);
        }
        return this._validateElementMergeField(mergeFieldReferenceValue, index);
    }

    _validateGlobalConstant(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const globalConstant = getGlobalConstantOrSystemVariable(mergeFieldReferenceValue);
        if (!this.allowGlobalConstants) {
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.INVALID_MERGEFIELD, LABELS.globalConstantsNotAllowed, index, endIndex);
            return [validationError];
        }
        if (!globalConstant) {
            const validationErrorLabel = format(LABELS.genericErrorMessage, MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.INVALID_GLOBAL_CONSTANT, validationErrorLabel, index, endIndex);
            return [validationError];
        }
        if (this.allowedParamTypes) {
            return this._validateForAllowedParamTypes(globalConstant, index, endIndex);
        }
        return [];
    }

    _validateSystemVariable(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const systemVariable = getGlobalConstantOrSystemVariable(mergeFieldReferenceValue);
        if (!systemVariable) {
            const validationErrorLabel = format(LABELS.genericErrorMessage, MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.INVALID_GLOBAL_VARIABLE, validationErrorLabel, index, endIndex);
            return [validationError];
        }
        if (this.allowedParamTypes) {
            return this._validateForAllowedParamTypes(systemVariable, index, endIndex);
        }
        return [];
    }

    _validateGlobalVariable() {
        // TODO : validate global variables
        return [];
    }

    _isElementValidForAllowedParamTypes(element) {
        return isElementAllowed(this.allowedParamTypes, elementToParam(element));
    }

    _validateElementMergeField(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const element = getElementByDevName(mergeFieldReferenceValue);
        if (!element) {
            const validationErrorLabel = format(LABELS.unknownResource, mergeFieldReferenceValue);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD, validationErrorLabel, index, endIndex);
            return [validationError];
        }

        if (this.allowedParamTypes) {
            return this._validateForAllowedParamTypes(element, index, endIndex);
        }
        const elementType = this._getElementType(element);
        if (elementType.dataType === null || (!this.allowCollectionVariables && elementType.isCollection)) {
            const validationErrorLabel = format(LABELS.resourceCannotBeUsedAsMergeField, mergeFieldReferenceValue);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE, validationErrorLabel, index, endIndex);
            return [validationError];
        }
        return [];
    }

    _getElementType(element) {
        let dataType = getDataType(element) || null;
        let isCollection = false;
        let subtype;
        const elementType = element.elementType;

        switch (elementType) {
            case ELEMENT_TYPE.VARIABLE:
                isCollection = element.isCollection;
                subtype = element.subtype;
                break;
            case ELEMENT_TYPE.STAGE:
                dataType = FLOW_DATA_TYPE.STRING.value;
                break;
            // no default
        }
        return {
            dataType,
            isCollection,
            subtype
        };
    }

    _validateApexOrSObjectVariableFieldMergeField(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const parts = splitStringBySeparator(mergeFieldReferenceValue);
        const variableName = parts[0];
        const fieldName = parts[1];
        const element = getElementByDevName(variableName);

        if (!element) {
            const validationErrorLabel = format(LABELS.unknownResource, variableName);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD, validationErrorLabel, index, endIndex);
            return [validationError];
        }
        if (element.elementType !== ELEMENT_TYPE.VARIABLE) {
            const validationErrorLabel = format(LABELS.notAValidMergeField, MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.INVALID_MERGEFIELD, validationErrorLabel, index, endIndex);
            return [validationError];
        }
        if (!isComplexType(element.dataType) || (!this.allowCollectionVariables && element.isCollection)) {
            const validationErrorLabel = format(LABELS.resourceCannotBeUsedAsMergeField, mergeFieldReferenceValue);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE, validationErrorLabel, index, endIndex);
            return [validationError];
        }

        const field = this._getFieldForEntity(element.dataType, element.subtype, fieldName);
        let errors = [];
        if (!field) {
            const validationErrorLabel = format(LABELS.unknownRecordField, fieldName, element.subtype);
            errors = [this._validationError(VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD, validationErrorLabel, index, endIndex)];
        } else if (this.allowedParamTypes) {
            errors = this._validateForAllowedParamTypes(field, index, endIndex);
        }
        return errors;
    }

    _getFieldForEntity(dataType, entityName, fieldName) {
        fieldName = fieldName.toLowerCase();
        const fetchFieldsFn = dataType === FLOW_DATA_TYPE.SOBJECT.value ? sobjectLib.getFieldsForEntity : getPropertiesForClass;
        const fields = fetchFieldsFn(entityName);
        for (const apiName in fields) {
            if (fields.hasOwnProperty(apiName)) {
                if (fieldName === apiName.toLowerCase()) {
                    return fields[apiName];
                }
            }
        }
        return undefined;
    }

    _validateForAllowedParamTypes(element, index, endIndex) {
        if (!this._isElementValidForAllowedParamTypes(element)) {
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE, LABELS.invalidDataType, index, endIndex);
            return [validationError];
        }
        return [];
    }
}

export function validateTextWithMergeFields(textWithMergeFields, { allowGlobalConstants = true, allowCollectionVariables = false } = { }) {
    const validation = new MergeFieldsValidation();
    validation.allowGlobalConstants = allowGlobalConstants;
    validation.allowCollectionVariables = allowCollectionVariables;
    return validation.validateTextWithMergeFields(textWithMergeFields);
}

export function validateMergeField(mergeField, { allowGlobalConstants = true, allowedParamTypes = null, allowCollectionVariables = false } = { }) {
    const validation = new MergeFieldsValidation();
    validation.allowGlobalConstants = allowGlobalConstants;
    validation.allowedParamTypes = allowedParamTypes;
    validation.allowCollectionVariables = allowCollectionVariables;
    return validation.validateMergeField(mergeField);
}

export function isTextWithMergeFields(text) {
    return MergeFieldsValidation.isTextWithMergeFields(text);
}