// @ts-nocheck
import { LABELS } from '../../validationRules/validationRulesLabels';
import { RECORD_DATA_ERROR } from '../flowTestEditor';
import { flowTestValidation } from '../flowTestValidation';
const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

describe('Flow Test Validation', () => {
    it('should return the same object with no error message when properly populated', () => {
        const flowTestWithCorrectCondition = {
            label: { value: 'HELLO', error: null },
            name: { value: 'HELLO', error: null },
            testAssertions: [
                {
                    expression: {
                        leftHandSide: { value: 'TEST_VAR', error: null },
                        operator: { value: 'EqualTo', error: null },
                        rightHandSide: { value: '1', error: null }
                    }
                },
                {
                    expression: {
                        leftHandSide: { value: 'TEST_VAR', error: null },
                        operator: { value: 'EqualTo', error: null },
                        rightHandSide: { value: '1', error: null }
                    }
                }
            ]
        };
        expect(flowTestValidation.validateAll(flowTestWithCorrectCondition)).toEqual(flowTestWithCorrectCondition);
    });
    it('should have error when an expression lefthandside is empty', () => {
        const flowTestWithCorrectCondition = {
            testAssertions: [
                {
                    expression: {
                        leftHandSide: { value: '', error: null },
                        operator: { value: 'EqualTo', error: null },
                        rightHandSide: { value: '1', error: null }
                    }
                },
                {
                    expression: {
                        leftHandSide: { value: 'TEST_VAR', error: null },
                        operator: { value: 'EqualTo', error: null },
                        rightHandSide: { value: '1', error: null }
                    }
                }
            ]
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.testAssertions[0].expression.leftHandSide.error).toEqual(CANNOT_BE_BLANK_ERROR);
        expect(validatedFlowTest.testAssertions[1].expression.leftHandSide.error).toBeNull();
    });
    it('should have error when label is empty', () => {
        const flowTestWithCorrectCondition = {
            label: { value: '', error: null }
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.label.error).toEqual(CANNOT_BE_BLANK_ERROR);
    });
    it('should have error when api name is empty', () => {
        const flowTestWithCorrectCondition = {
            name: { value: '', error: null }
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.name.error).toEqual(CANNOT_BE_BLANK_ERROR);
    });
    it('should have an error when initial record data is in error', () => {
        const flowTestWithCorrectCondition = {
            initialTestRecordData: { value: {}, error: RECORD_DATA_ERROR }
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.initialTestRecordData.error).toEqual(RECORD_DATA_ERROR);
    });
});
