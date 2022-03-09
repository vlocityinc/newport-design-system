import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { RECORD_DATA_ERROR } from 'builder_platform_interaction/flowTestTriggerRecordEditForm';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const flowTestAssertionExpressionRule = () => {
    return (testAssertion) => {
        const validation = ValidationRules.validateExpressionWith3Properties();
        return validation(testAssertion.expression);
    };
};

const additionalRules: {} = {
    testAssertions: flowTestAssertionExpressionRule()
};

class FlowTestValidation extends Validation {
    validateAll(nodeElement: any, overrideRules?: {}) {
        if (nodeElement.expression) {
            const validatedExpression = super.validateAll(nodeElement.expression, overrideRules);
            nodeElement = updateProperties(nodeElement, { expression: validatedExpression });
        }
        if (nodeElement.testInitialRecordData && Object.keys(nodeElement.testInitialRecordData).length === 0) {
            nodeElement = updateProperties(nodeElement, {
                testInitialRecordData: {
                    value: nodeElement.testInitialRecordData,
                    error: RECORD_DATA_ERROR
                }
            });
        }
        if (
            nodeElement.testUpdatedRecordData &&
            nodeElement.testTriggerType.value === FLOW_TRIGGER_SAVE_TYPE.UPDATE &&
            Object.keys(nodeElement.testUpdatedRecordData).length === 0
        ) {
            nodeElement = updateProperties(nodeElement, {
                testUpdatedRecordData: {
                    value: nodeElement.testUpdatedRecordData,
                    error: RECORD_DATA_ERROR
                }
            });
        }
        return super.validateAll(nodeElement, overrideRules);
    }
}

export const flowTestValidation = new FlowTestValidation(additionalRules);
