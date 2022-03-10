import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    createFlowTestAssertionsMetadataObject,
    createFlowTestAssertionsUIModel,
    createFlowTestData,
    createFlowTestParametersMetadataObject,
    createFlowTestRecordsUIModel,
    FlowTestParameterType,
    FlowTestPointValidator
} from '../flowTestData';

const uiModel = {
    guid: '5cc0fb58-8b70-4eff-a095-d5ed80cb8f6e',
    name: 'test',
    description: 'testDescription',
    label: 'testLabel',
    runPathValue: 'RunImmediately',
    testTriggerType: 'Create',
    testAssertions: [
        {
            expression: {
                rowIndex: '6c6e8656-aced-4115-a62a-e9b6e40b55f8',
                leftHandSide: '$Record.AccountNumber',
                rightHandSide: 'testAcc',
                rightHandSideDataType: 'String',
                operator: 'EqualTo'
            },
            message: 'Failed!'
        }
    ],
    testInitialRecordData: {
        AccountNumber: null,
        Name: 'testAcc2',
        OwnerId: '005xx000001X7ttAAC'
    }
};

const uiModelUpdateRecord = {
    guid: '5cc0fb58-8b70-4eff-a095-d5ed80cb8f6e',
    name: 'test',
    description: 'testDescription',
    label: 'testLabel',
    runPathValue: 'RunImmediately',
    testTriggerType: 'Update',
    testAssertions: [
        {
            expression: {
                rowIndex: '6c6e8656-aced-4115-a62a-e9b6e40b55f8',
                leftHandSide: '$Record.AccountNumber',
                rightHandSide: 'testAcc',
                rightHandSideDataType: 'String',
                operator: 'EqualTo'
            },
            message: 'Failed!'
        }
    ],
    testInitialRecordData: {
        AccountNumber: null,
        Name: 'testAcc2',
        OwnerId: '005xx000001X7ttAAC'
    },
    testUpdatedRecordData: {
        AccountNumber: null,
        Name: 'testAcc2',
        OwnerId: '005xx000001X7ttAAC',
        AnnualRevenue: 1000
    }
};

const flowTestMetadata = {
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
};

const flowTestMetadataMultipleParameters = {
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
};

const flowTestMetadataMultipleAssertions = {
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
                            leftValueReference: '$Record.Name',
                            operator: 'EqualTo',
                            rightValue: {
                                numberValue: 0,
                                stringValue: 'foo'
                            }
                        }
                    ],
                    errorMessage: 'Name mistmatch'
                },
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
                    errorMessage: 'Revenue mismatch'
                }
            ],
            parameters: []
        }
    ]
};

describe('Flow Test Data', () => {
    describe('createFlowTestData function', () => {
        it('returns a new flow test data object when no argument is passed', () => {
            const expectedResult = {
                label: '',
                name: '',
                description: '',
                runPathValue: '',
                testTriggerType: '',
                testAssertions: [
                    {
                        expression: {
                            leftHandSide: '',
                            leftHandSideDataType: undefined,
                            operator: '',
                            rightHandSide: '',
                            rightHandSideDataType: ''
                        }
                    }
                ],
                elementType: 'FLOW_TEST_EDITOR'
            };
            const actualResult = createFlowTestData({});
            expect(actualResult).toMatchObject(expectedResult);
        });
    });
    describe('createFlowTestAssertionsMetadataObject function', () => {
        it('returns 1 assertion', () => {
            const assertions = createFlowTestAssertionsMetadataObject(uiModel);
            expect(assertions.length).toBe(1);
        });
        it('returns assertion with 1 condition', () => {
            const assertions = createFlowTestAssertionsMetadataObject(uiModel);
            expect(assertions[0].conditions.length).toBe(1);
        });
        it('returns assertion with 1 errorMessage', () => {
            const assertions = createFlowTestAssertionsMetadataObject(uiModel);
            expect(assertions[0].errorMessage).toBe('Failed!');
        });
        it('returns assertion with 1 condition having LHS, RHS', () => {
            const assertions = createFlowTestAssertionsMetadataObject(uiModel);
            expect(assertions[0].conditions[0].leftValueReference).toBe('$Record.AccountNumber');
            expect(assertions[0].conditions[0].operator).toBe('EqualTo');
            expect(assertions[0].conditions[0].rightValue.stringValue).toBe('testAcc');
        });
    });
    describe('createFlowTestParametersMetadataObject function', () => {
        it('returns 1 parameter ', () => {
            const parameters = createFlowTestParametersMetadataObject(uiModel);
            expect(parameters.length).toBe(1);
        });
        it('returns parameter of type Input, left reference value of $Record and value of account data', () => {
            const parameters = createFlowTestParametersMetadataObject(uiModel);
            expect(parameters[0].leftValueReference).toBe('$Record');
            expect(parameters[0].type).toBe(FlowTestParameterType.Input);
            expect(parameters[0].value.sobjectValue).toBe(
                '{"AccountNumber":null,"Name":"testAcc2","OwnerId":"005xx000001X7ttAAC"}'
            );
        });
        it('returns 2 parameters ', () => {
            const parameters = createFlowTestParametersMetadataObject(uiModelUpdateRecord);
            expect(parameters.length).toBe(2);
        });
        it('returns parameters of type Input and UpdatedRecord', () => {
            const parameters = createFlowTestParametersMetadataObject(uiModelUpdateRecord);
            expect(parameters[0].leftValueReference).toBe('$Record');
            expect(parameters[0].type).toBe(FlowTestParameterType.Input);
            expect(parameters[0].value.sobjectValue).toBe(
                '{"AccountNumber":null,"Name":"testAcc2","OwnerId":"005xx000001X7ttAAC"}'
            );
            expect(parameters[1].leftValueReference).toBe('$Record');
            expect(parameters[1].type).toBe(FlowTestParameterType.UpdateRecord);
            expect(parameters[1].value.sobjectValue).toBe(
                '{"AccountNumber":null,"Name":"testAcc2","OwnerId":"005xx000001X7ttAAC","AnnualRevenue":1000}'
            );
        });
    });
    describe('createFlowTestAssertionsUIModel function', () => {
        it('returns 1 assertion', () => {
            const assertions = createFlowTestAssertionsUIModel(flowTestMetadata);
            expect(assertions.length).toBe(1);
        });
        it('returns 1 expression with expected left hand side', () => {
            const assertions = createFlowTestAssertionsUIModel(flowTestMetadata);
            expect(assertions[0].expression.leftHandSide).toBe('$Record.AnnualRevenue');
        });
        it('returns 2 assertions', () => {
            const assertions = createFlowTestAssertionsUIModel(flowTestMetadataMultipleAssertions);
            expect(assertions.length).toBe(2);
        });
        it('returns 2 expressions with expected RHS datatypes', () => {
            const assertions = createFlowTestAssertionsUIModel(flowTestMetadataMultipleAssertions);
            expect(assertions[0].expression.rightHandSideDataType).toBe('String');
            expect(assertions[1].expression.rightHandSideDataType).toBe('Number');
        });
    });
    describe('createFlowTestRecordsUIModel function', () => {
        it('returns 1 record, initial', () => {
            const records = createFlowTestRecordsUIModel(flowTestMetadata, FLOW_TRIGGER_SAVE_TYPE.CREATE);
            expect(records.length).toBe(1);
        });
        it('returns 2 records, initial and updated, when Update trigger type', () => {
            const assertions = createFlowTestRecordsUIModel(
                flowTestMetadataMultipleParameters,
                FLOW_TRIGGER_SAVE_TYPE.UPDATE
            );
            expect(assertions.length).toBe(2);
        });
        it('returns 1 record, initial, when Create trigger type, even if multiple records are present in metadata object', () => {
            const assertions = createFlowTestRecordsUIModel(
                flowTestMetadataMultipleParameters,
                FLOW_TRIGGER_SAVE_TYPE.CREATE
            );
            expect(assertions.length).toBe(1);
        });
    });
});
