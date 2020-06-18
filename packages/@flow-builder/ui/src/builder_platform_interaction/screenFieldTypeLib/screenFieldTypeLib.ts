let supportedScreenFieldTypes: Array<string> = [];

/**
 * Sets the names of all screen field types
 */
export function setSupportedScreenFieldTypes(fieldTypes: Array<any>) {
    supportedScreenFieldTypes = fieldTypes.map(fieldType => fieldType.name);
}

/**
 * Return the names of all screen field types
 */
export function getSupportedScreenFieldTypes(): Array<string> {
    return supportedScreenFieldTypes;
}
