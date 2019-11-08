import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

/**
 * A complex type field description has a dataType, an apiName, optionally a subtype, label and isCollection
 */
export const expectComplexTypeFieldDescription = field => {
    // need a dataType and apiName. isCollection and label optional
    expect(field.dataType).toBeDefined();
    expect(field.apiName).toBeDefined();
    if (
        field.dataType === FLOW_DATA_TYPE.SOBJECT.value ||
        field.dataType === FLOW_DATA_TYPE.APEX.value
    ) {
        expect(field.subtype).toBeDefined();
        expect(field.subtype).not.toBeNull();
    }
};

export const expectFieldsAreComplexTypeFieldDescriptions = fields => {
    for (const fieldName in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, fieldName)) {
            const field = fields[fieldName];
            expectComplexTypeFieldDescription(field);
        }
    }
};
