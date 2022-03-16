import { FlowTestPointValidator } from 'builder_platform_interaction/elementFactory';
import { FLOW_TRIGGER_SAVE_TYPE, SCHEDULED_PATH_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FlowTestParameterType } from '../../elementFactory/flowTestData';
import { translateFlowTestToUIModel } from '../flowTestToUiTranslator';

const flowTest = {
    fullName: 'flowTest',
    metadata: {
        label: 'testLabel',
        description: 'testDescription',
        testPoints: [
            {
                elementApiName: FlowTestPointValidator.Start,
                assertions: [],
                parameters: [
                    {
                        leftValueReference: '$Record',
                        type: FlowTestParameterType.Input,
                        value: {
                            numberValue: 0,
                            sobjectValue: '{"name":"TestAccount","attributes":{"type":"Account"}}'
                        }
                    }
                ]
            },
            {
                elementApiName: FlowTestPointValidator.Finish,
                assertions: [
                    {
                        conditions: [
                            {
                                leftValueReference: '$Record.AnnualRevenue',
                                operator: 'EqualTo',
                                rightValue: {
                                    numberValue: 100000.0
                                }
                            }
                        ],
                        errorMessage: 'Failed'
                    }
                ],
                parameters: []
            }
        ]
    }
};

const flowTestUpdated = {
    fullName: 'flowTest',
    metadata: {
        label: 'testLabel',
        description: 'testDescription',
        testPoints: [
            {
                elementApiName: FlowTestPointValidator.Start,
                assertions: [],
                parameters: [
                    {
                        leftValueReference: '$Record',
                        type: FlowTestParameterType.Input,
                        value: {
                            numberValue: 0,
                            sobjectValue: '{"name":"TestAccount","attributes":{"type":"Account"}}'
                        }
                    },
                    {
                        leftValueReference: '$Record',
                        type: FlowTestParameterType.UpdateRecord,
                        value: {
                            numberValue: 0,
                            sobjectValue: '{"name":"TestAccountUpdated","attributes":{"type":"Account"}}'
                        }
                    }
                ]
            },
            {
                elementApiName: FlowTestPointValidator.Finish,
                assertions: [
                    {
                        conditions: [
                            {
                                leftValueReference: '$Record.AnnualRevenue',
                                operator: 'EqualTo',
                                rightValue: {
                                    numberValue: 100000.0
                                }
                            }
                        ],
                        errorMessage: 'Failed'
                    }
                ],
                parameters: []
            }
        ]
    }
};

describe('Flow Test to UI Translation', () => {
    it('returns label, name, description, runPathValue ', () => {
        const { label, name, description, runPathValue } = translateFlowTestToUIModel(flowTest);
        expect(label).toBe('testLabel');
        expect(name).toBe('flowTest');
        expect(description).toBe('testDescription');
        expect(runPathValue).toBe(SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH);
    });

    it('returns Updated as test trigger type', () => {
        const { testTriggerType } = translateFlowTestToUIModel(flowTestUpdated);
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.UPDATE);
    });

    it('returns Created as test trigger type', () => {
        const { testTriggerType } = translateFlowTestToUIModel(flowTest);
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.CREATE);
    });

    it('returns assertions', () => {
        const { testAssertions } = translateFlowTestToUIModel(flowTest);
        expect(testAssertions).not.toBe(undefined);
        expect(testAssertions.length).toBe(1);
        expect(testAssertions[0].expression.leftHandSide).toBe('$Record.AnnualRevenue');
        expect(testAssertions[0].expression.leftHandSideDataType).toBe(undefined);
        expect(testAssertions[0].expression.operator).toBe('EqualTo');
        expect(testAssertions[0].expression.rightHandSide).toBe('100000');
        expect(testAssertions[0].expression.rightHandSideDataType).toBe('Number');
        expect(testAssertions[0].message).toBe('Failed');
    });

    it('returns initial record data only for Create test trigger type', () => {
        const { testInitialRecordData, testUpdatedRecordData } = translateFlowTestToUIModel(flowTest);
        expect(testInitialRecordData).not.toBe(undefined);
        expect(testUpdatedRecordData).toBe(undefined);
    });
    it('returns initial and updated record data for Updated test trigger type', () => {
        const { testInitialRecordData, testUpdatedRecordData } = translateFlowTestToUIModel(flowTestUpdated);
        expect(testInitialRecordData).not.toBe(undefined);
        expect(testUpdatedRecordData).not.toBe(undefined);
    });
    it('returns label, name, description, testInitialRecordData, testUpdatedRecordData, testAssertions as undefined in case flowTest is null  ', () => {
        const { label, name, description, runPathValue, testInitialRecordData, testUpdatedRecordData, testAssertions } =
            translateFlowTestToUIModel({});
        expect(label).toBe(undefined);
        expect(name).toBe(undefined);
        expect(description).toBe(undefined);
        expect(testInitialRecordData).toBe(undefined);
        expect(testUpdatedRecordData).toBe(undefined);
        expect(testAssertions).toBe(undefined);
    });
});
