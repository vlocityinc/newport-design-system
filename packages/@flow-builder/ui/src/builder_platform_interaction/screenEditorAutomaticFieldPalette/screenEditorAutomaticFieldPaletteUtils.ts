import { FieldDataType } from 'builder_platform_interaction/dataTypeLib';

/**
 * Returns if an automatic field must be seen as a "real" required field
 *
 * @param field automatic field to be checked
 * @returns true if the given field must be seen as a required automatic field, otherwise false
 */
export const isAutomaticFieldRequired = (field: FieldDefinition) =>
    field.required && field.fieldDataType !== FieldDataType.Boolean;
