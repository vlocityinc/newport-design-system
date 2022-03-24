// @ts-nocheck
import cannotContainMergeFields from '@salesforce/label/FlowBuilderValidation.cannotContainMergeFields';
import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MAX_DEV_NAME_LENGTH } from 'builder_platform_interaction/flowTestDetails';
import { Store } from 'builder_platform_interaction/storeLib';
import { LABELS } from '../../validationRules/validationRulesLabels';
import { RECORD_DATA_ERROR } from '../flowTestEditor';
import { flowTestValidation, getRules } from '../flowTestValidation';

const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;
const TEXT_WITH_129_CHARS = 'a'.repeat(MAX_DEV_NAME_LENGTH + 1);
const TEXT_WITH_81_CHARS = 'a'.repeat(81);

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        getGlobalVariableTypes: jest.fn().mockImplementation(() => {
            return { $Api: 'test' };
        })
    };
});

describe('Flow Test Validation', () => {
    beforeAll(() => {
        Store.setMockState({
            properties: {
                name: 'flowTestApi',
                versionNumber: 1
            },
            elements: {
                element1: 'test'
            }
        });
    });
    afterAll(() => {
        Store.resetStore();
    });
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
    it('should have error when an expression righthandside is empty', () => {
        const flowTestWithCorrectCondition = {
            testAssertions: [
                {
                    expression: {
                        leftHandSide: { value: 'TEST_VAR', error: null },
                        operator: { value: 'EqualTo', error: null },
                        rightHandSide: { value: '', error: null }
                    }
                }
            ]
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.testAssertions[0].expression.rightHandSide.error).toEqual(CANNOT_BE_BLANK_ERROR);
    });
    it('should have error when an message contains a merge field', () => {
        const flowTestWithCorrectCondition = {
            testAssertions: [
                {
                    expression: {
                        leftHandSide: { value: 'TEST_VAR', error: null },
                        operator: { value: 'EqualTo', error: null },
                        rightHandSide: { value: 'FOO', error: null }
                    },
                    message: {
                        value: '{!$Record}',
                        error: null
                    }
                }
            ]
        };
        let validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.testAssertions[0].message.error).toEqual(cannotContainMergeFields);
        flowTestWithCorrectCondition.testAssertions[0].message = { value: '{!$Record}', error: null };
        validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.testAssertions[0].message.error).toEqual(cannotContainMergeFields);
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
    it('should have an error when record data is in error', () => {
        const flowTestWithCorrectCondition = {
            initialTestRecordData: { value: {}, error: RECORD_DATA_ERROR },
            updatedTestRecordData: { value: {}, error: RECORD_DATA_ERROR }
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.initialTestRecordData.error).toEqual(RECORD_DATA_ERROR);
        expect(validatedFlowTest.updatedTestRecordData.error).toEqual(RECORD_DATA_ERROR);
    });
    it('should have an error when the flow test api name is > 128 characters', () => {
        expect(flowTestValidation.validateProperty('name', TEXT_WITH_129_CHARS)).toBe(LABELS.maximumCharactersLimit);
    });
    it('should not return an error when the flow test api name is > 80 characters', () => {
        expect(flowTestValidation.validateProperty('name', TEXT_WITH_81_CHARS)).toBeNull();
    });
    it('should have an error when record data is empty', () => {
        const flowTestWithEmptyRecordData = {
            initialTestRecordData: {},
            updatedTestRecordData: {},
            testTriggerType: FLOW_TRIGGER_SAVE_TYPE.UPDATE
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithEmptyRecordData);
        expect(validatedFlowTest.initialTestRecordData.error).toEqual(RECORD_DATA_ERROR);
        expect(validatedFlowTest.updatedTestRecordData.error).toEqual(RECORD_DATA_ERROR);
    });
    it('should not return an error when a Flow Test from a namespaced org is being updated', () => {
        const devName = 'hey';
        const orgNameSpace = 'ns';
        // this prepending happens server side when a flow test is saved in a namespaced org
        const devNameWithNamespacePrepended = orgNameSpace + '__' + devName;
        const flowTestFromNamespacedOrg = {
            label: { value: 'hi', error: null },
            name: { value: devNameWithNamespacePrepended, error: null },
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

        const validatedFlowTest = flowTestValidation.validateAll(
            flowTestFromNamespacedOrg,
            getRules(FlowTestMode.Edit)
        );
        expect(flowTestFromNamespacedOrg).toEqual(validatedFlowTest);
    });
    it('should have error when an expression righthandside contains $Record fields', () => {
        const flowTestWithCorrectCondition = {
            testAssertions: [
                {
                    expression: {
                        leftHandSide: { value: 'TEST_VAR', error: null },
                        operator: { value: 'EqualTo', error: null },
                        rightHandSide: { value: '$Record.Name', error: null }
                    }
                }
            ]
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.testAssertions[0].expression.rightHandSide.error).toEqual(cannotContainMergeFields);
    });
    it('should have error when an expression righthandside contains global variable fields', () => {
        const flowTestWithCorrectCondition = {
            testAssertions: [
                {
                    expression: {
                        leftHandSide: { value: 'TEST_VAR', error: null },
                        operator: { value: 'EqualTo', error: null },
                        rightHandSide: { value: '$Api.Name', error: null }
                    }
                }
            ]
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.testAssertions[0].expression.rightHandSide.error).toEqual(cannotContainMergeFields);
    });
    it('should have error when an expression righthandside contains flow variable', () => {
        const flowTestWithCorrectCondition = {
            testAssertions: [
                {
                    expression: {
                        leftHandSide: { value: 'TEST_VAR', error: null },
                        operator: { value: 'EqualTo', error: null },
                        rightHandSide: { value: '$Api.Name', error: null }
                    }
                }
            ]
        };
        const validatedFlowTest = flowTestValidation.validateAll(flowTestWithCorrectCondition);
        expect(validatedFlowTest.testAssertions[0].expression.rightHandSide.error).toEqual(cannotContainMergeFields);
    });
});
