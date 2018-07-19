import { getElementByDevName } from 'builder_platform_interaction-store-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import * as sobjectLib from 'builder_platform_interaction-sobject-lib';
import notAValidMergeFieldLabel from '@label/FlowBuilderMergeFieldValidation.notAValidMergeField';
import invalidGlobalConstant from '@label/FlowBuilderMergeFieldValidation.invalidGlobalConstant';
import unknownMergeField from '@label/FlowBuilderMergeFieldValidation.unknownMergeField';
import wrongDataType from '@label/FlowBuilderMergeFieldValidation.wrongDataType';
import unknownRecordField from '@label/FlowBuilderMergeFieldValidation.unknownRecordField';
import { GLOBAL_CONSTANT_PREFIX, getNonElementResource } from 'builder_platform_interaction-system-lib';
import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { format } from 'builder_platform_interaction-common-utils';

const MERGE_FIELD_START_CHARS = '{!';
const MERGE_FIELD_END_CHARS = '}';
// This regex does not support Cross-Object field references
const MERGEFIELD_REGEX = /\{!(\$\w+\.\w+|\w+\.\w+|\w+)\}/g;

const SYSTEM_VARIABLE_PREFIX = '$Flow.';

const VALIDATION_ERROR_TYPE = {
    INVALID_MERGEFIELD : 'notAValidMergeField',
    INVALID_GLOBAL_CONSTANT : 'invalidGlobalConstant',
    UNKNOWN_MERGE_FIELD : 'unknownMergeField',
    WRONG_DATA_TYPE : 'wrongDataType'
};

/**
 * Validate merge fields. Only support "String" data type for now.
 * Cross-Object field references ({!sObjectVariable.objectName1.objectName2.fieldName}) are not supported.
 */
export class MergeFieldsValidation {
    allowGlobalConstants = true;

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
     * @returns {Promise<ValidationError[]>} The validation errors
     */
    validateTextWithMergeFields(textWithMergeFields) {
        const promises = [];
        let match;
        try {
            while ((match = MERGEFIELD_REGEX.exec(textWithMergeFields)) !== null) {
                promises.push(this._validateMergeFieldReferenceValue(match[1], match.index + 2));
            }
            return Promise.all(promises).then(results => [].concat.apply([], results));
        } finally {
            MERGEFIELD_REGEX.lastIndex = 0;
        }
    }

    /**
     * Validate a merge field
     *
     * @param {string}
     *            mergeField the merge field (ex : {!variable1.Name})
     * @returns {Promise<ValidationError[]>} The validation errors
     */
    validateMergeField(mergeField) {
        const match = MERGEFIELD_REGEX.exec(mergeField);
        MERGEFIELD_REGEX.lastIndex = 0;
        if (match === null || match[0] !== mergeField) {
            const validationErrorLabel = format(notAValidMergeFieldLabel, mergeField);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.INVALID_MERGEFIELD, validationErrorLabel, 0, mergeField.length - 1);
            return Promise.resolve([validationError]);
        }
        return this._validateMergeFieldReferenceValue(match[1], 2);
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

    _isGlobalVariableMergeField(mergeFieldReferenceValue) {
        return mergeFieldReferenceValue.startsWith('$') && !this._isGlobalConstantMergeField(mergeFieldReferenceValue) && !this._isSystemVariableMergeField(mergeFieldReferenceValue);
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
        if (mergeFieldReferenceValue.indexOf('.') !== -1) {
            return this._validateSObjectVariableFieldMergeField(mergeFieldReferenceValue, index);
        }
        return this._validateElementMergeField(mergeFieldReferenceValue, index);
    }

    _validateGlobalConstant(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        if (!this.allowGlobalConstants) {
            const validationErrorLabel = format(notAValidMergeFieldLabel, MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.INVALID_MERGEFIELD, validationErrorLabel, index, endIndex);
            return Promise.resolve([validationError]);
        }
        if (!getNonElementResource(mergeFieldReferenceValue)) {
            const validationErrorLabel = format(invalidGlobalConstant, MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.INVALID_GLOBAL_CONSTANT, validationErrorLabel, index, endIndex);
            return Promise.resolve([validationError]);
        }
        return Promise.resolve([]);
    }

    _validateSystemVariable() {
        // TODO : validate system variables
        return Promise.resolve([]);
    }

    _validateGlobalVariable() {
        // TODO : validate global variables
        return Promise.resolve([]);
    }

    _validateElementMergeField(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const element = getElementByDevName(mergeFieldReferenceValue);
        if (!element) {
            const validationErrorLabel = format(unknownMergeField, mergeFieldReferenceValue);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD, validationErrorLabel, index, endIndex);
            return Promise.resolve([validationError]);
        }
        const elementType = this._getElementType(element);
        if (elementType.dataType === null || elementType.isCollection) {
            const validationErrorLabel = format(wrongDataType, mergeFieldReferenceValue);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE, validationErrorLabel, index, endIndex);
            return Promise.resolve([validationError]);
        }
        return Promise.resolve([]);
    }

    _getElementType(element) {
        let dataType;
        let isCollection = false;
        let objectType;
        const elementType = element.elementType;
        switch (elementType) {
            case ELEMENT_TYPE.VARIABLE:
                dataType = element.dataType;
                isCollection = element.isCollection;
                objectType = element.objectType;
                break;
            case ELEMENT_TYPE.FORMULA:
            case ELEMENT_TYPE.CONSTANT:
            case ELEMENT_TYPE.FLOW_CHOICE:
                // TODO : screenField
                // TODO : dynamicchoiceset
                dataType = element.dataType;
                break;
            case ELEMENT_TYPE.OUTCOME:
                // TODO : waitevent
                dataType = FLOW_DATA_TYPE.BOOLEAN.value;
                break;
            default: {
                const elementConfig = getConfigForElementType(elementType);
                if (elementConfig.canHaveFaultConnector) {
                    // Any element that supports a fault connector is available as a Boolean resource.
                    dataType = FLOW_DATA_TYPE.BOOLEAN.value;
                } else {
                    dataType = null;
                }
            }
        }
        return {
            dataType,
            isCollection,
            objectType
        };
    }

    _validateSObjectVariableFieldMergeField(mergeFieldReferenceValue, index) {
        const endIndex = index + mergeFieldReferenceValue.length - 1;
        const parts = mergeFieldReferenceValue.split('.');
        const variableName = parts[0];
        const fieldName = parts[1];
        const element = getElementByDevName(variableName);
        if (!element) {
            const validationErrorLabel = format(unknownMergeField, MERGE_FIELD_START_CHARS + mergeFieldReferenceValue + MERGE_FIELD_END_CHARS);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD, validationErrorLabel, index, endIndex);
            return Promise.resolve([validationError]);
        }
        if (element.elementType !== ELEMENT_TYPE.VARIABLE || element.dataType !== FLOW_DATA_TYPE.SOBJECT.value || element.isCollection) {
            const validationErrorLabel = format(wrongDataType, mergeFieldReferenceValue);
            const validationError = this._validationError(VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE, validationErrorLabel, index, endIndex);
            return Promise.resolve([validationError]);
        }
        return new Promise((resolve) => {
            sobjectLib.getFieldsForEntity(element.objectType, (fields) => {
                if (!fields[fieldName]) {
                    const validationErrorLabel = format(unknownRecordField, fieldName, element.objectType);
                    resolve([this._validationError(VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD, validationErrorLabel, index, endIndex)]);
                }
                resolve([]);
            });
        });
    }
}

export function validateTextWithMergeFields(textWithMergeFields, { allowGlobalConstants = true } = { }) {
    const validation = new MergeFieldsValidation();
    validation.allowGlobalConstants = allowGlobalConstants;
    return validation.validateTextWithMergeFields(textWithMergeFields);
}

export function validateMergeField(mergeField, { allowGlobalConstants = true } = { }) {
    const validation = new MergeFieldsValidation();
    validation.allowGlobalConstants = allowGlobalConstants;
    return validation.validateMergeField(mergeField);
}