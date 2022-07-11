// @ts-nocheck
import { FlowTestPointValidator } from 'builder_platform_interaction/elementFactory';
import { FLOW_TRIGGER_SAVE_TYPE, SCHEDULED_PATH_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FlowTestParameterType } from '../../elementFactory/flowTestData';
import { translateFlowTestToUIModel } from '../flowTestToUiTranslator';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('../uidSwapping', () => {
    return Object.assign({}, jest.requireActual('../uidSwapping'), {
        swapDevNamesToGuids: jest.fn().mockImplementation(() => {
            return {};
        })
    });
});

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
        const { testTriggerType } = translateFlowTestToUIModel(flowTestUpdated, FLOW_TRIGGER_SAVE_TYPE.UPDATE);
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.UPDATE);
    });

    it('returns Created as test trigger type when the test was originally saved as Updated because the flow trigger type changed', () => {
        const { testTriggerType } = translateFlowTestToUIModel(flowTestUpdated, FLOW_TRIGGER_SAVE_TYPE.CREATE);
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.CREATE);
    });

    it('returns Created as test trigger type', () => {
        const { testTriggerType } = translateFlowTestToUIModel(flowTest, FLOW_TRIGGER_SAVE_TYPE.CREATE);
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.CREATE);
    });

    it('returns Updated as test trigger type when the test was originally saved as Created because the flow trigger type changed', () => {
        const { testTriggerType } = translateFlowTestToUIModel(flowTest, FLOW_TRIGGER_SAVE_TYPE.UPDATE);
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.UPDATE);
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
        const { testInitialRecordData, testUpdatedRecordData } = translateFlowTestToUIModel(
            flowTestUpdated,
            FLOW_TRIGGER_SAVE_TYPE.UPDATE
        );
        expect(testInitialRecordData).not.toBe(undefined);
        expect(testUpdatedRecordData).not.toBe(undefined);
    });
    it('returns label, name, description, testInitialRecordData, testUpdatedRecordData, testAssertions as undefined in case flowTest is null  ', () => {
        const { label, name, description, testInitialRecordData, testUpdatedRecordData, testAssertions } =
            translateFlowTestToUIModel({});
        expect(label).toBe(undefined);
        expect(name).toBe(undefined);
        expect(description).toBe(undefined);
        expect(testInitialRecordData).toBe(undefined);
        expect(testUpdatedRecordData).toBe(undefined);
        expect(testAssertions).toBe(undefined);
    });
    it('returns Updated test trigger type, initial and updated record data when test created from debug run and debug is of type Updated ', () => {
        const { testTriggerType, testInitialRecordData, testUpdatedRecordData } = translateFlowTestToUIModel(
            flowTestUpdated,
            FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE,
            true
        );
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.UPDATE);
        expect(testInitialRecordData).not.toBe(undefined);
        expect(testUpdatedRecordData).not.toBe(undefined);
    });
    it('returns Created test trigger type and initial record data when test created from debug run and debug is of type Created ', () => {
        const { testTriggerType, testInitialRecordData, testUpdatedRecordData } = translateFlowTestToUIModel(
            flowTest,
            FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE,
            true
        );
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.CREATE);
        expect(testInitialRecordData).not.toBe(undefined);
        expect(testUpdatedRecordData).toBe(undefined);
    });
    it('returns Created test trigger type and initial record data when not creating from debug run ', () => {
        const { testTriggerType, testInitialRecordData, testUpdatedRecordData } = translateFlowTestToUIModel(
            flowTest,
            FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE
        );
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.CREATE);
        expect(testInitialRecordData).not.toBe(undefined);
        expect(testUpdatedRecordData).toBe(undefined);
    });

    it('returns Updated test trigger type and initial and updated record data when not creating test from debug run and test data contains 2 records ', () => {
        const { testTriggerType, testInitialRecordData, testUpdatedRecordData } = translateFlowTestToUIModel(
            flowTestUpdated,
            FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE
        );
        expect(testTriggerType).toBe(FLOW_TRIGGER_SAVE_TYPE.UPDATE);
        expect(testInitialRecordData).not.toBe(undefined);
        expect(testUpdatedRecordData).not.toBe(undefined);
    });
});
