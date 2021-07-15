import { LABELS } from './mergeFieldValidationLabels';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

const VALIDATION_ERROR_TYPE = {
    INVALID_MERGE_FIELD: 'notAValidMergeField',
    INVALID_GLOBAL_CONSTANT: 'invalidGlobalConstant',
    INVALID_GLOBAL_VARIABLE: 'invalidGlobalVariable',
    UNKNOWN_MERGE_FIELD: 'unknownMergeField',
    WRONG_DATA_TYPE: 'wrongDataType',
    MAXIMUM_LEVEL_REACHED: 'maximumLevelReached'
};

export type ValidationError = {
    errorType: string;
    message: string;
    startIndex: number;
    endIndex: number;
};

/**
 * @param errorType
 * @param message
 * @param startIndex
 * @param endIndex
 */
function validationError(errorType: string, message: string, startIndex: number, endIndex: number): ValidationError {
    return {
        errorType,
        message,
        startIndex,
        endIndex
    };
}

/**
 * @param startIndex
 * @param endIndex
 */
export function mergeFieldNotAllowed(startIndex: number, endIndex: number) {
    return validationError(VALIDATION_ERROR_TYPE.INVALID_MERGE_FIELD, LABELS.genericErrorMessage, startIndex, endIndex);
}

/**
 * @param startIndex
 * @param endIndex
 */
export function maximumNumberOfLevelsReached(startIndex: number, endIndex: number) {
    return validationError(
        VALIDATION_ERROR_TYPE.MAXIMUM_LEVEL_REACHED,
        LABELS.maximumNumberOfLevelsReached,
        startIndex,
        endIndex
    );
}

/**
 * @param startIndex
 * @param endIndex
 */
export function globalConstantsNotAllowed(startIndex: number, endIndex: number) {
    return validationError(
        VALIDATION_ERROR_TYPE.INVALID_MERGE_FIELD,
        LABELS.globalConstantsNotAllowed,
        startIndex,
        endIndex
    );
}

/**
 * @param mergeField
 * @param startIndex
 * @param endIndex
 */
export function invalidGlobalConstant(mergeField: string, startIndex: number, endIndex: number) {
    const validationErrorLabel = format(LABELS.genericErrorMessage, mergeField);
    return validationError(VALIDATION_ERROR_TYPE.INVALID_GLOBAL_CONSTANT, validationErrorLabel, startIndex, endIndex);
}

/**
 * @param mergeField
 * @param startIndex
 * @param endIndex
 */
export function invalidMergeField(mergeField: string, startIndex: number, endIndex: number) {
    const validationErrorLabel = format(LABELS.notAValidMergeField, mergeField);
    return validationError(VALIDATION_ERROR_TYPE.INVALID_MERGE_FIELD, validationErrorLabel, startIndex, endIndex);
}

/**
 * @param startIndex
 * @param endIndex
 */
export function invalidDataType(startIndex: number, endIndex: number) {
    return validationError(VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE, LABELS.invalidDataType, startIndex, endIndex);
}

/**
 * @param mergeField
 * @param startIndex
 * @param endIndex
 */
export function invalidGlobalVariable(mergeField: string, startIndex: number, endIndex: number) {
    const validationErrorLabel = format(LABELS.genericErrorMessage, mergeField);
    return validationError(VALIDATION_ERROR_TYPE.INVALID_GLOBAL_VARIABLE, validationErrorLabel, startIndex, endIndex);
}

/**
 * @param resourceName
 * @param startIndex
 * @param endIndex
 */
export function unknownResource(resourceName: string, startIndex: number, endIndex: number) {
    const validationErrorLabel = format(LABELS.unknownResource, resourceName);
    return validationError(VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD, validationErrorLabel, startIndex, endIndex);
}

/**
 * @param resourceName
 * @param startIndex
 * @param endIndex
 */
export function resourceCannotBeUsedAsMergeField(resourceName: string, startIndex: number, endIndex: number) {
    const validationErrorLabel = format(LABELS.resourceCannotBeUsedAsMergeField, resourceName);
    return validationError(VALIDATION_ERROR_TYPE.WRONG_DATA_TYPE, validationErrorLabel, startIndex, endIndex);
}

/**
 * @param entityName
 * @param fieldName
 * @param startIndex
 * @param endIndex
 */
export function unknownRecordField(entityName: string, fieldName: string, startIndex: number, endIndex: number) {
    const validationErrorLabel = format(LABELS.unknownRecordField, fieldName, entityName);
    return validationError(VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD, validationErrorLabel, startIndex, endIndex);
}

/**
 * @param entityName
 * @param polymorphicReference
 * @param startIndex
 * @param endIndex
 */
export function invalidPolymorphicRecordFieldReference(
    entityName: string,
    polymorphicReference: string,
    startIndex: number,
    endIndex: number
) {
    const validationErrorLabel = format(LABELS.invalidPolymorphicRecordField, entityName, polymorphicReference);
    return validationError(VALIDATION_ERROR_TYPE.UNKNOWN_MERGE_FIELD, validationErrorLabel, startIndex, endIndex);
}
