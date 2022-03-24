import cannotContainMergeFields from '@salesforce/label/FlowBuilderValidation.cannotContainMergeFields';
import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MAX_DEV_NAME_LENGTH } from 'builder_platform_interaction/flowTestDetails';
import { RECORD_DATA_ERROR } from 'builder_platform_interaction/flowTestTriggerRecordEditForm';
import { Store } from 'builder_platform_interaction/storeLib';
import { getGlobalVariableTypes } from 'builder_platform_interaction/systemLib';
import { defaultRules, Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const flowTestAssertionExpressionRule = () => {
    return (testAssertion) => {
        let validationResult;
        const expressionValidation = validateExpressioWith3PropertiesWithRHSNoEmptyNoRef();
        // Extra validation for merge fields in message field
        validationResult = expressionValidation(testAssertion.expression);
        const messageValidation = validateMessageHasNoMergeFields();
        if (testAssertion.message) {
            const messageResult = messageValidation(testAssertion.message);
            if (messageResult) {
                validationResult = { ...validationResult, ...messageResult };
            }
        }
        return validationResult;
    };
};

const validateExpressioWith3PropertiesWithRHSNoEmptyNoRef = () => {
    return (expression) => {
        const rules = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [ValidationRules.shouldNotBeBlank]
        };

        if (expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].push(ValidationRules.lhsShouldBeValid(expression.rowIndex));
            rules[EXPRESSION_PROPERTY_TYPE.OPERATOR] = [ValidationRules.shouldNotBeBlank];
        }

        if (expression[EXPRESSION_PROPERTY_TYPE.OPERATOR].value) {
            rules[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = [
                ValidationRules.shouldNotBeBlank,
                ValidationRules.rhsShouldBeValid(expression.rowIndex),
                containsVariableReferences()
            ];
        }

        return rules;
    };
};

// Flow Testing-specific validation for message field
// This and functions below be removed in 240+ when we support merge fields in Flow Testing (not including LHS)

/**
 * @returns function that returns an object for rules that contains the rule function for the message field
 */
const validateMessageHasNoMergeFields = () => {
    return (testMessage) => {
        return testMessage.value ? { message: [isValidTextWithoutMergeFields()] } : null;
    };
};

/**
 * @returns function that validates text for mergefields and returns error message or null
 */
const isValidTextWithoutMergeFields = () => {
    return (text) => {
        return isTextWithMergeFieldsOrPureMergeField(text) ? cannotContainMergeFields : null;
    };
};

const MERGEFIELD_REGEX = /.*\{!(((\$\w+)(\.[A-Za-z0-9_:]+)+)|(\w+|\$(Record|Record__Prior))(\.[A-Za-z0-9_:]+)*)\}.*/;

/**
 * Evaluated if text contains merge fields
 *
 * @param text
 * @returns true or false
 */
const isTextWithMergeFieldsOrPureMergeField = (text: string): boolean => {
    try {
        const match = MERGEFIELD_REGEX.exec(text);
        return match !== null;
    } finally {
        MERGEFIELD_REGEX.lastIndex = 0;
    }
};

const containsVariableReferences = () => {
    return (text) => {
        let containsRef = null;
        const elements = Store.getStore().getCurrentState().elements;
        const globalVariables = getGlobalVariableTypes();
        if (text.includes('$Record')) {
            return cannotContainMergeFields;
        }
        if (globalVariables) {
            Object.keys(globalVariables).forEach((uid) => {
                if (text.includes(uid)) {
                    containsRef = cannotContainMergeFields;
                }
            });
        }
        if (elements) {
            Object.keys(elements).forEach((uid) => {
                if (text.includes(uid)) {
                    containsRef = cannotContainMergeFields;
                }
            });
        }
        return containsRef;
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
        if (nodeElement.message) {
            const validatedAssertion = super.validateAll(nodeElement, overrideRules);
            nodeElement = updateProperties(nodeElement, { message: validatedAssertion.message });
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
