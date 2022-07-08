// @ts-nocheck
import { createComponent } from 'aura';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import {
    createConfigurationEditor,
    getActionCallTypeMappings,
    getAutomaticOutputVariables,
    getBuilderContext,
    getElementInfo,
    getInputVariables,
    getScreenFieldTypeMappings,
    useConfigurationEditor
} from 'builder_platform_interaction/customPropertyEditorLib';
import { createActionCall } from 'builder_platform_interaction/elementFactory';
import * as mockFlowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getMetadataFlowElementByName } from 'mock/flows/mock-flow';
import { actionCallAutomaticOutput, flowWithAllElementsUIModel } from 'mock/storeData';
import { chatterPostActionDetails } from 'serverData/GetInvocableActionDetails/chatterPostActionDetails.json';

jest.mock('builder_platform_interaction/invocableActionLib', () =>
    require('builder_platform_interaction_mocks/invocableActionLib')
);
jest.mock('builder_platform_interaction/flowExtensionLib', () =>
    require('builder_platform_interaction_mocks/flowExtensionLib')
);

jest.mock('builder_platform_interaction/translatorLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/translatorLib');
    return {
        translateUIModelToFlow: () => {
            return mockFlowWithAllElements;
        },
        swapUidsForDevNames: actual.swapUidsForDevNames
    };
});

const configurationEditor = { name: 'someConfig' };
const typeMappings = [
    {
        typeName: 'T__record1',
        typeValue: null
    },
    {
        typeName: {
            value: 'T__record2',
            error: null
        },
        typeValue: {
            value: 'Contact',
            error: null
        }
    },
    {
        typeName: {
            value: 'T__record3',
            error: null
        },
        typeValue: {
            value: null,
            error: 'error'
        }
    },
    {
        typeName: {
            value: null,
            error: 'T_error'
        },
        typeValue: {
            value: 'value',
            error: null
        }
    }
];

describe('Custom Property Editor Lib', () => {
    test.each`
        testTitlePart                                                  | configurationEditor                                      | expectedResult
        ${'null configuration editor'}                                 | ${null}                                                  | ${false}
        ${'undefined configuration editor'}                            | ${undefined}                                             | ${false}
        ${'configuration editor with name undefined '}                 | ${{ name: undefined }}                                   | ${false}
        ${'configuration editor with null name undefined '}            | ${{ name: null }}                                        | ${false}
        ${'configuration editor with no name'}                         | ${{ errors: [] }}                                        | ${false}
        ${'configuration editor with a defined name '}                 | ${{ name: 'configurationEditor' }}                       | ${true}
        ${'configuration editor with a defined name and empty errors'} | ${{ name: 'configurationEditor', errors: [] }}           | ${true}
        ${'configuration editor with a defined name and errors'}       | ${{ name: 'configurationEditor', errors: ['an error'] }} | ${false}
    `('useConfigurationEditor with $testTitlePart ', ({ configurationEditor, expectedResult }) => {
        expect(useConfigurationEditor(configurationEditor)).toEqual(expectedResult);
    });
    test('getBuilderContext', () => {
        const mockFlowWithAllElementsMetadata = mockFlowWithAllElements.metadata;

        const builderContext = getBuilderContext(configurationEditor, flowWithAllElementsUIModel);

        expect(builderContext).toEqual({
            variables: mockFlowWithAllElementsMetadata.variables,
            constants: mockFlowWithAllElementsMetadata.constants,
            textTemplates: mockFlowWithAllElementsMetadata.textTemplates,
            stages: mockFlowWithAllElementsMetadata.stages,
            screens: mockFlowWithAllElementsMetadata.screens,
            recordUpdates: mockFlowWithAllElementsMetadata.recordUpdates,
            recordLookups: mockFlowWithAllElementsMetadata.recordLookups,
            recordDeletes: mockFlowWithAllElementsMetadata.recordDeletes,
            recordCreates: mockFlowWithAllElementsMetadata.recordCreates,
            formulas: mockFlowWithAllElementsMetadata.formulas,
            apexPluginCalls: mockFlowWithAllElementsMetadata.apexPluginCalls,
            actionCalls: mockFlowWithAllElementsMetadata.actionCalls,
            loops: mockFlowWithAllElementsMetadata.loops,
            start: mockFlowWithAllElementsMetadata.start,
            assignments: mockFlowWithAllElementsMetadata.assignments,
            collectionProcessors: mockFlowWithAllElementsMetadata.collectionProcessors,
            choices: mockFlowWithAllElementsMetadata.choices,
            dynamicChoiceSets: mockFlowWithAllElementsMetadata.dynamicChoiceSets,
            decisions: mockFlowWithAllElementsMetadata.decisions,
            recordRollbacks: mockFlowWithAllElementsMetadata.recordRollbacks,
            waits: mockFlowWithAllElementsMetadata.waits
        });
    });
    test('getAutomaticOutputVariables', () => {
        const chatterPostActionDetailsOutputParams = chatterPostActionDetails.parameters.filter(
            (param) => !param.isInput
        );
        const automaticOutputVariables = getAutomaticOutputVariables(configurationEditor, flowWithAllElementsUIModel);

        expect(automaticOutputVariables).toMatchObject({
            actionCallAutomaticOutput: chatterPostActionDetailsOutputParams
        });
        expect(Object.keys(automaticOutputVariables)).not.toContain('AllTypesApexAction');
    });
    test('getInputVariables', () => {
        const createdAction = createActionCall(
            getMetadataFlowElementByName(mockFlowWithAllElements, actionCallAutomaticOutput.name)
        );

        const inputVariables = getInputVariables(configurationEditor, createdAction, flowWithAllElementsUIModel);

        expect(inputVariables).toMatchObject([
            { name: 'subjectNameOrId', value: 'jsmith@salesforce.com', valueDataType: 'String' },
            { name: 'text', value: 'This is my message', valueDataType: 'String' }
        ]);
    });
    test('getInputVariables with falsy values', () => {
        const createdAction = createActionCall({
            actionName: 'testAction',
            actionType: 'testAction',
            inputParameters: [
                {
                    name: 'booleanParam',
                    value: {
                        booleanValue: false
                    }
                },
                {
                    name: 'numberParam',
                    value: {
                        numberValue: 0
                    }
                },
                {
                    name: 'stringParam',
                    value: {
                        stringValue: null
                    }
                }
            ],
            label: 'actionCallFalsyInputs',
            name: 'actionCallFalsyInputs',
            outputParameters: []
        });
        const inputVariables = getInputVariables(configurationEditor, createdAction, flowWithAllElementsUIModel);

        expect(inputVariables).toMatchObject([
            { name: 'booleanParam', value: '$GlobalConstant.False', valueDataType: 'Boolean' },
            { name: 'numberParam', value: '0', valueDataType: 'Number' }
        ]);
    });
    test('getScreenFieldTypeMappings', () => {
        const result = getScreenFieldTypeMappings(configurationEditor, { dynamicTypeMappings: typeMappings });

        expect(result).toMatchObject([
            { typeName: 'T__record2', typeValue: 'Contact' },
            { typeName: 'T__record3', typeValue: null },
            { typeName: null, typeValue: 'value' }
        ]);
    });
    test('getActionCallTypeMappings', () => {
        const result = getActionCallTypeMappings(configurationEditor, { dataTypeMappings: typeMappings });

        expect(result).toMatchObject([
            { typeName: 'T__record2', typeValue: 'Contact' },
            { typeName: 'T__record3', typeValue: null },
            { typeName: null, typeValue: 'value' }
        ]);
    });
    test.each`
        testTitlePart                 | name                   | type        | expectedResult
        ${'null name'}                | ${null}                | ${'Action'} | ${{ apiName: '', type: 'Action' }}
        ${'undefined name'}           | ${undefined}           | ${'Action'} | ${{ apiName: '', type: 'Action' }}
        ${'non hydrated name '}       | ${'a name'}            | ${'Action'} | ${{ apiName: '', type: 'Action' }}
        ${'hydrated name value null'} | ${{ value: null }}     | ${'Action'} | ${{ apiName: '', type: 'Action' }}
        ${'hydrated name with value'} | ${{ value: 'a name' }} | ${'Action'} | ${{ apiName: 'a name', type: 'Action' }}
    `('getElementInfo with $testTitlePart ', ({ name, type, expectedResult }) => {
        expect(getElementInfo(name, type)).toEqual(expectedResult);
    });
    describe('createConfigurationEditor', () => {
        const sampleAttributes = {
            elementInfo: { apiName: 'fake', type: 'ActionCall' }
        };
        it('throws error if cmp name is not passed', () => {
            expect(() => {
                createConfigurationEditor();
            }).toThrow('Component name is not defined');
        });
        it('throws error if container is not passed', () => {
            expect(() => {
                createConfigurationEditor({
                    cmpName: 'abc'
                });
            }).toThrow('Container component is not defined');
        });
        it('calls createComponent w/ expected parameters when given standard parameters', async () => {
            createConfigurationEditor({
                cmpName: 'cmpName',
                container: {},
                attr: sampleAttributes
            });
            await ticks(1);
            expect(createComponent).toHaveBeenCalledWith('cmpName', sampleAttributes, expect.anything());
        });
    });
});
