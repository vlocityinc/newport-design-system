// @ts-nocheck
import { createTestScreenField } from 'builder_platform_interaction/builderTestUtils';

export const DYNAMIC_TYPES_DESCRIPTOR_NAME = 'c:lookup';

export function createScreenFieldWithDynamicTypes() {
    return Object.assign({}, createTestScreenField('lcField', 'Extension', DYNAMIC_TYPES_DESCRIPTOR_NAME, {}, true), {
        isNewField: true,
        dynamicTypeMappings: [
            {
                typeName: 'T',
                typeValue: 'Asset',
                rowIndex: 'abc'
            },
            {
                typeName: 'S',
                typeValue: '',
                rowIndex: 'def'
            }
        ],
        inputParameters: [],
        outputParameters: []
    });
}

export function createFlowExtensionWithDynamicTypes() {
    return {
        name: DYNAMIC_TYPES_DESCRIPTOR_NAME,
        genericTypes: [
            {
                name: 'T',
                superType: 'SOBJECT',
                label: 'First sobject',
                description: 'This is the first object'
            },
            {
                name: 'S',
                superType: 'SOBJECT',
                label: 'Second sobject',
                description: 'This is the second object'
            }
        ],
        inputParameters: [
            {
                apiName: 'selectedRecordA',
                dataType: 'sobject',
                description: 'The A object to process',
                hasDefaultValue: false,
                isInput: true,
                isOutput: false,
                isRequired: false,
                label: 'Selected Record A',
                maxOccurs: 1,
                subtype: '{T}'
            },
            {
                apiName: 'selectedRecordB',
                dataType: 'sobject',
                description: 'The B object to process',
                hasDefaultValue: false,
                isInput: true,
                isOutput: false,
                isRequired: false,
                label: 'Selected Record B',
                maxOccurs: 1,
                subtype: '{S}'
            }
        ],
        outputParameters: [
            {
                apiName: 'computeA',
                dataType: 'string',
                description: 'Result of the first object procecssing',
                hasDefaultValue: false,
                isInput: false,
                isOutput: true,
                isRequired: false,
                label: 'Compute result A',
                maxOccurs: 1
            }
        ]
    };
}
