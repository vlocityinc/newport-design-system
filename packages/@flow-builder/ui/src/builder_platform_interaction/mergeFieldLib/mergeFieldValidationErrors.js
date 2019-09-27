import { LABELS } from './mergeFieldValidationLabels';
import { format } from 'builder_platform_interaction/commonUtils';

const VALIDATION_ERROR_TYPE = {
    INVALID_MERGE_FIELD: 'notAValidMergeField',
    INVALID_GLOBAL_CONSTANT: 'invalidGlobalConstant',
    INVALID_GLOBAL_VARIABLE: 'invalidGlobalVariable',
    UNKNOWN_MERGE_FIELD: 'unknownMergeField',
    WRONG_DATA_TYPE: 'wrongDataType'
};

function validationError(errorType, message, startIndex, endIndex) {
    return {
        errorType,
        message,
        startIndex,
        endIndex
    };
}

export function globalConstantsNotAllowed(startIndex, endIndex) {
    return validationError(
        VALIDATION_ERROR_TYPE.INVALID_MERGE_FIELD,
        LABELS.globalConstantsNotAllowed,
        startIndex,
        endIndex
    );
}

export function invalidGlobalConstant(mergeField, startIndex, endIndex) {
    const validationErrorLabel = format(LABELS.genericErrorMessage, mergeField);
    return validationError(
        VALIDATION_ERROR_TYPE.INVALID_GLOBAL_CONSTANT,
        validationErrorLabel,
        startIndex,
        endIndex
    );
}

export function invalidMergeField(mergeField, startIndex, endIndex) {
    const validationErrorLabel = format(LABELS.notAValidMergeField, mergeField);
    return validationError(
        VALIDATION_ERROR_TYPE.INVALID_MERGE_FIELD,
        validationErrorLabel,
        startIndex,
        endIndex
    );
}

export function invalidDataType(startIndex, endIndex) {
    return validationError(
        VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE,
        LABELS.invalidDataType,
        startIndex,
        endIndex
    );
}

export function invalidGlobalVariable(mergeField, startIndex, endIndex) {
    const validationErrorLabel = format(LABELS.genericErrorMessage, mergeField);
    return validationError(
        VALIDATION_ERROR_TYPE.INVALID_GLOBAL_VARIABLE,
        validationErrorLabel,
        startIndex,
        endIndex
    );
}

export function unknownResource(resourceName, startIndex, endIndex) {
    const validationErrorLabel = format(LABELS.unknownResource, resourceName);
    return validationError(
        VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD,
        validationErrorLabel,
        startIndex,
        endIndex
    );
}

export function resourceCannotBeUsedAsMergeField(
    resourceName,
    startIndex,
    endIndex
) {
    const validationErrorLabel = format(
        LABELS.resourceCannotBeUsedAsMergeField,
        resourceName
    );
    return validationError(
        VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE,
        validationErrorLabel,
        startIndex,
        endIndex
    );
}

export function unknownRecordField(
    entityName,
    fieldName,
    startIndex,
    endIndex
) {
    const validationErrorLabel = format(
        LABELS.unknownRecordField,
        fieldName,
        entityName
    );
    return validationError(
        VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD,
        validationErrorLabel,
        startIndex,
        endIndex
    );
}

export function invalidPolymorphicRecordFieldReference(
    entityName,
    polymorphicReference,
    startIndex,
    endIndex
) {
    const validationErrorLabel = format(
        LABELS.invalidPolymorphicRecordField,
        entityName,
        polymorphicReference
    );
    return validationError(
        VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD,
        validationErrorLabel,
        startIndex,
        endIndex
    );
}
