import { createFlowTestAssertionsMetadataObject, createFlowTestData } from '../flowTestData';

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
});
