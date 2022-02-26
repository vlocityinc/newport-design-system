import { FlowTestPointValidator } from 'builder_platform_interaction/elementFactory';
import { FLOW_TRIGGER_SAVE_TYPE, SCHEDULED_PATH_TYPE } from 'builder_platform_interaction/flowMetadata';
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
                        type: 'INPUT',
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
                        type: 'INPUT',
                        value: {
                            numberValue: 0,
                            sobjectValue: '{"name":"TestAccount","attributes":{"type":"Account"}}'
                        }
                    },
                    {
                        leftValueReference: '$Record',
                        type: 'UPDATE_RECORD',
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
});
