import { ExtraTypeInfo, FieldDataType } from 'builder_platform_interaction/dataTypeLib';

/**
 * Determines whether the screen field is of compound Name type
 *
 * @param screenField
 * @returns true if the current field type is of compound name type
 */
export function isFieldCompoundName(screenField: UI.ScreenField): boolean {
    return screenField.entityFieldExtraTypeInfo === ExtraTypeInfo.PersonName;
}

/**
 * Determines whether the screen field is of compound Address type
 *
 * @param screenField
 * @returns true if the current field type is of compound address type
 */
export function isFieldCompoundAddress(screenField: UI.ScreenField): boolean {
    return screenField.entityFieldDataType === FieldDataType.Address;
}

/**
 * Determines whether the screen field is of compound type (Name or Address)
 *
 * @param screenField
 * @returns true if the current field type is of compound type
 */
export function isFieldCompound(screenField: UI.ScreenField): boolean {
    return isFieldCompoundName(screenField) || isFieldCompoundAddress(screenField);
}
