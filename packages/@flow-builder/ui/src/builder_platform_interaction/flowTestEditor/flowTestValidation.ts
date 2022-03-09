import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MAX_DEV_NAME_LENGTH } from 'builder_platform_interaction/flowTestDetails';
import { RECORD_DATA_ERROR } from 'builder_platform_interaction/flowTestTriggerRecordEditForm';
import { defaultRules, Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const flowTestAssertionExpressionRule = () => {
    return (testAssertion) => {
        const validation = ValidationRules.validateExpressionWith3Properties();
        return validation(testAssertion.expression);
    };
};

const overriddenDefaultRules: RuleSet = {
    ...defaultRules,
    // we need to override the default rules for the dev name field to set a
    // custom char limit for flow test dev names
    name: [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeginOrEndWithUnderscores,
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(MAX_DEV_NAME_LENGTH),
        ValidationRules.checkDevNameUniqueness
    ]
};

const additionalRules: {} = {
    testAssertions: flowTestAssertionExpressionRule()
};

class FlowTestValidation extends Validation {
    constructor(defaultRules, additionalRules) {
        super();
        this.finalizedRules = this.getMergedRules(defaultRules, additionalRules);
    }

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

export const flowTestValidation = new FlowTestValidation(overriddenDefaultRules, additionalRules);

export const getRules = (mode: FlowTestMode) => {
    const overrideRules = Object.assign({}, flowTestValidation.finalizedRules);

    if (mode === FlowTestMode.Edit) {
        overrideRules.name = [];
    }

    return overrideRules;
};
