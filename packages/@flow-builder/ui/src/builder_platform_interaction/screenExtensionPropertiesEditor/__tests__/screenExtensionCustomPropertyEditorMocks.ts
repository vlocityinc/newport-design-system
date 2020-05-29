// @ts-nocheck
import { createTestScreenField } from 'builder_platform_interaction/builderTestUtils';

export const CPE_DESCRIPTOR_NAME = 'c:lookup';

export function createScreenFieldForCPE() {
    return Object.assign({}, createTestScreenField('lcField', 'Extension', CPE_DESCRIPTOR_NAME, {}, true), {
        isNewField: true,
        dynamicTypeMappings: [
            {
                typeName: 'T',
                typeValue: 'Account',
                rowIndex: 'abc'
            },
            {
                typeName: 'U',
                typeValue: '',
                rowIndex: 'def'
            }
        ],
        inputParameters: [
            {
                name: { value: 'inputName', error: null },
                value: { value: 'inputValue', error: null },
                valueDataType: 'String'
            }
        ],
        outputParameters: []
    });
}

export function createFlowExtensionForCPE() {
    return {
        name: CPE_DESCRIPTOR_NAME,
        genericTypes: [
            {
                name: 'T',
                superType: 'SOBJECT',
                label: 'First sobject',
                description: 'This is the first object'
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
                apiName: 'inputName',
                dataType: 'string',
                description: 'Input property',
                hasDefaultValue: false,
                isInput: true,
                isOutput: false,
                isRequired: false,
                label: 'Input property label',
                maxOccurs: 1
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
