import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
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
        return super.validateAll(nodeElement, overrideRules);
    }
}

export const flowTestValidation = new FlowTestValidation(additionalRules);
