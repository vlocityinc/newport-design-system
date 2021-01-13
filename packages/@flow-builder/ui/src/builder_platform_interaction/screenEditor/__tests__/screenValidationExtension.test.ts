// @ts-nocheck
import { getRulesForField, screenValidation } from '../screenValidation';
import { elementsForPropertyEditors, emailScreenFieldAutomaticOutput, emailScreenField } from 'mock/storeData';
import { flowExtensionDetails as mockFlowExtensionDetails } from 'serverData/GetFlowExtensionDetails/flowExtensionDetails.json';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/flowExtensionLib');
    const mockExtensionType = () => ({
        category: 'Input',
        description: 'Email Component',
        fieldType: 'ComponentInstance',
        genericTypes: undefined,
        icon: 'standard:email',
        label: 'Email',
        marker: undefined,
        name: 'flowruntime:email',
        source: 'server'
    });
    return {
        getCachedExtension: jest
            .fn()
            .mockImplementation(() =>
                actual.createExtensionDescription('flowruntime:email', mockFlowExtensionDetails['flowruntime:email'])
            ),
        getCachedExtensionType: jest.fn().mockReturnValue(mockExtensionType)
    };
});

describe('field from extension', () => {
    let emailScreenFieldAutomaticElement;
    beforeEach(() => {
        emailScreenFieldAutomaticElement = elementsForPropertyEditors[emailScreenFieldAutomaticOutput.name];
        // In the facctory the property fieldType is hydrated while in the code it isn't
        emailScreenFieldAutomaticElement.fieldType = FlowScreenFieldType.ComponentInstance;
    });
    describe('When field has validation enabled', () => {
        it('Error message cannot be blank', () => {
            const rules = getRulesForField(emailScreenFieldAutomaticElement);
            // Set input parameter value to empty string
            emailScreenFieldAutomaticElement.name.value = '';
            expect(screenValidation.validateAll(emailScreenFieldAutomaticElement, rules).name.error).toBe(
                'FlowBuilderValidation.cannotBeBlank'
            );
        });
    });
    describe('When field type is Section', () => {
        const emailScreenFieldElement = elementsForPropertyEditors[emailScreenField.name];
        // In the facctory the property fieldType is hydrated while in the code it isn't
        emailScreenFieldElement.fieldType = FlowScreenFieldType.ComponentInstance;

        it('validates child fields', () => {
            let section = {
                guid: 'section1',
                name: 'section1',
                fieldType: 'RegionContainer',
                fields: [
                    {
                        guid: 'column1',
                        name: 'column1',
                        fieldType: 'Region',
                        type: {
                            name: 'Column'
                        },
                        inputParameters: [
                            {
                                name: 'width',
                                value: '6'
                            }
                        ],
                        fields: [emailScreenFieldElement]
                    },
                    {
                        guid: 'column2',
                        name: 'column2',
                        fieldType: 'Region',
                        type: {
                            name: 'Column'
                        },
                        inputParameters: [
                            {
                                name: 'width',
                                value: '6'
                            }
                        ],
                        fields: [emailScreenFieldAutomaticElement]
                    }
                ]
            };

            emailScreenFieldAutomaticElement.name.value = '';
            section = screenValidation.validateAll(section);

            expect(section.fields[1].fields[0].name.error).toBe('FlowBuilderValidation.cannotBeBlank');
        });
    });
});
