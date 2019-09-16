import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { waitValidation } from '../waitValidation';
import { LABELS } from '../../validationRules/validationRulesLabels';

const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/elementFactory', () => {
    return {
        createCondition: jest.fn().mockReturnValue({
            leftHandSide: '',
            operator: '',
            rightHandSide: ''
        }),
        createFlowProperties: jest.fn()
    };
});

describe('Additional Wait Validations', () => {
    describe('when props set to conditionLogic', () => {
        it('and when valid string is passed should return - null', () => {
            expect(
                waitValidation.validateProperty(
                    'conditionLogic',
                    'valid condition'
                )
            ).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(waitValidation.validateProperty('conditionLogic', '')).toBe(
                CANNOT_BE_BLANK_ERROR
            );
        });
    });
    describe('when props set to defaultConnectorLabel', () => {
        it('and when valid string is passed should return - null', () => {
            expect(
                waitValidation.validateProperty(
                    'defaultConnectorLabel',
                    'valid default outcome name'
                )
            ).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(
                waitValidation.validateProperty('defaultConnectorLabel', '')
            ).toBe(CANNOT_BE_BLANK_ERROR);
        });
    });
});

describe('All validation happens when OK is clicked', () => {
    it('check all rules are included in finalizedRules', () => {
        // 5 is the combination of defaultRules in Validation.js and the additionalRules in DecisionValidation
        expect(Object.keys(waitValidation.finalizedRules)).toHaveLength(4);
        // conditions rule is added when condition logic is not always wait when validateAll is called
    });

    describe('when conditions are set', () => {
        it('and they are correct should return the same node with no error messages', () => {
            const waitWithCorrectCondition = {
                waitEvents: [
                    {
                        guid: 'SOME_WAIT_EVENT_1',
                        label: {
                            value: 'waitEvent1',
                            error: null
                        },
                        name: {
                            value: 'waitEvent1',
                            error: null
                        },
                        conditionLogic: {
                            value: CONDITION_LOGIC.AND,
                            error: null
                        },
                        conditions: [
                            {
                                leftHandSide: {
                                    value: 'TEST_VAR',
                                    error: null
                                },
                                operator: { value: 'EqualTo', error: null },
                                rightHandSide: { value: '1', error: null }
                            }
                        ]
                    },
                    {
                        guid: 'SOME_WAIT_EVENT_2',
                        label: {
                            value: 'waitEvent2',
                            error: null
                        },
                        name: {
                            value: 'waitEvent2',
                            error: null
                        },
                        conditionLogic: {
                            value: CONDITION_LOGIC.AND,
                            error: null
                        },
                        conditions: [
                            {
                                leftHandSide: {
                                    value: 'TEST_VAR',
                                    error: null
                                },
                                operator: { value: 'EqualTo', error: null },
                                rightHandSide: { value: '1', error: null }
                            }
                        ]
                    }
                ]
            };
            expect(
                waitValidation.validateAll(waitWithCorrectCondition)
            ).toEqual(waitWithCorrectCondition);
        });
        it('and when empty string is passed on leftHandSide, should return - Cannot be blank.', () => {
            const waitWithEmptyLHSInCondition = {
                waitEvents: [
                    {
                        guid: 'SOME_WAIT_EVENT_1',
                        label: {
                            value: 'waitEvent1',
                            error: null
                        },
                        name: {
                            value: 'waitEvent1',
                            error: null
                        },
                        conditionLogic: {
                            value: CONDITION_LOGIC.AND,
                            error: null
                        },
                        conditions: [
                            {
                                leftHandSide: {
                                    value: 'TEST_VAR',
                                    error: null
                                },
                                operator: { value: 'EqualTo', error: null },
                                rightHandSide: { value: '1', error: null }
                            }
                        ]
                    },
                    {
                        guid: 'SOME_WAIT_EVENT_2',
                        label: {
                            value: 'waitEvent2',
                            error: null
                        },
                        name: {
                            value: 'waitEvent2',
                            error: null
                        },
                        conditionLogic: {
                            value: CONDITION_LOGIC.AND,
                            error: null
                        },
                        conditions: [
                            {
                                leftHandSide: { value: '', error: null },
                                operator: { value: 'EqualTo', error: null },
                                rightHandSide: { value: '1', error: null }
                            }
                        ]
                    }
                ]
            };
            // The node returned after validation has only one change - the correct error added to the invalid property
            const expectedNode = { ...waitWithEmptyLHSInCondition };
            expectedNode.waitEvents[1].conditions[0].leftHandSide.error = CANNOT_BE_BLANK_ERROR;
            const validatedNode = waitValidation.validateAll(
                waitWithEmptyLHSInCondition
            );
            expect(validatedNode).toEqual(expectedNode);
        });
    });
    it('when name, API name and condition logic are not set, should return this error for all of them - Cannot be blank', () => {
        const waitWithEmptyProperties = {
            label: {
                value: 'wait1',
                error: null
            },
            name: {
                value: 'wait1',
                error: null
            },
            waitEvents: [
                {
                    guid: 'SOME_WAIT_EVENT_1',
                    eventType: '',
                    label: {
                        value: '',
                        error: null
                    },
                    name: {
                        value: '',
                        error: null
                    },
                    conditionLogic: {
                        value: '',
                        error: null
                    }
                }
            ]
        };

        const validatedWait = waitValidation.validateAll(
            waitWithEmptyProperties,
            waitValidation.getBaseWaitRules()
        );
        const waitEvent = validatedWait.waitEvents[0];

        expect(waitEvent.label.error).toBe(CANNOT_BE_BLANK_ERROR);
        expect(waitEvent.name.error).toBe(CANNOT_BE_BLANK_ERROR);
    });
});
