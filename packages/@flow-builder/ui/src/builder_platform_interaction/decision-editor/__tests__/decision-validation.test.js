// TODO here to replace the expected error message with a reference to the label file once we have that in place
import {decisionValidation} from '../decision-validation';

import { LABELS } from '../../validation-rules/validation-rules-labels';
const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;


describe('Default Decision Validations - from label-dev name-description', () => {
    describe('when props set to LABEL', () => {
        it('and when valid string is passed should return - null', () => {
            expect(decisionValidation.validateProperty('label', "valid string")).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(decisionValidation.validateProperty('label', '')).toBe(CANNOT_BE_BLANK_ERROR);
        });
    });
    describe('when props set to NAME', () => {
        it('and when valid string is passed should return - null', () => {
            expect(decisionValidation.validateProperty('name', "valid string")).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(decisionValidation.validateProperty('name', '')).toBe(CANNOT_BE_BLANK_ERROR);
        });
        it('and when a string starting with _ is passed should return - Should always begin with Alphabetical Characters instead of Numeric or Special Characters.', () => {
            expect(decisionValidation.validateProperty('name', '_someUniqueName')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
        it('and when a string ending with _ is passed should return - Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.', () => {
            expect(decisionValidation.validateProperty('name', 'someUniqueName_')).toBe(LABELS.shouldNotBeginOrEndWithUnderscores);
        });
    });
});

describe('Additional Decision Validations', () => {
    describe('when props set to LABEL', () => {
        it('and when string length more than 255 characters should return - {string} Cannot accept more than 255 characters.', () => {
            expect(decisionValidation.validateProperty('label', 'slgtkIhgGmCxhghaqlSsvqzpoVTjXXXpiFkUnrbTffSmlaPBNHviXxZOsuzprwgbDqyRjbmpgfBsHqvuAteZQFpiZOZTMHwqXUhgVVXcazWHrTDtmjVEOkoOBnjnUFftAmcvKZZKaVUUrxnDHKivVwLwmUlgArcCfeXPdzAGWWAntNRCaBAVzlTLIGuiXwKdcjuHkwnhsNuodNQdoqAOetbMZvwzRICvRydEVqLnefBJTUMJkmZQhbCIwYhQGlla')).toBe(LABELS.maximumCharactersLimit);
        });
    });
    describe('when props set to NAME', () => {
        it('and when invalid string is passed should return - {string} Should begin with Alphabetical Characters instead of Numeric or Special Characters', () => {
            expect(decisionValidation.validateProperty('name', '1111111')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
        it('and when invalid string is passed should return - {string} Cannot accept any Special Characters.', () => {
            expect(decisionValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe(LABELS.shouldAcceptOnlyAlphanumericCharacters);
        });
        it('and when string length more than 80 characters should return - {string} Cannot accept more than 80 characters.', () => {
            expect(decisionValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe(LABELS.maximumCharactersLimit);
        });
    });
    describe('when props set to conditionLogic', () => {
        it('and when valid string is passed should return - null', () => {
            expect(decisionValidation.validateProperty('conditionLogic', "valid condition")).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(decisionValidation.validateProperty('conditionLogic', '')).toBe(CANNOT_BE_BLANK_ERROR);
        });
    });
    describe('when props set to defaultConnectorLabel', () => {
        it('and when valid string is passed should return - null', () => {
            expect(decisionValidation.validateProperty('defaultConnectorLabel', "valid default outcome name")).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(decisionValidation.validateProperty('defaultConnectorLabel', '')).toBe(CANNOT_BE_BLANK_ERROR);
        });
    });
});
describe('All validations happen when OK is clicked', () => {
    describe('when conditions are set', () => {
        it('and they are correct should return the same node with no error messages', () => {
            const decisionWithCorrectCondition = {
                outcomes: [
                    {
                        guid: 'SOME_OUTCOME_1',
                        conditions: [{
                            leftHandSide: {value: 'TEST_VAR', error: null},
                            operator: {value: 'EqualTo', error: null},
                            rightHandSide: {value: '1', error: null}
                        }]
                    },
                    {
                        guid: 'SOME_OUTCOME_2',
                        conditions: [{
                            leftHandSide: {value: 'TEST_VAR', error: null},
                            operator: {value: 'EqualTo', error: null},
                            rightHandSide: {value: '1', error: null}
                        }]
                    },
                ]
            };
            expect(decisionValidation.validateAll(decisionWithCorrectCondition)).toEqual(decisionWithCorrectCondition);
        });
        it('and when empty string is passed on leftHandSide, should return - Cannot be blank.', () => {
            const decisionWithEmptyLHSInCondition = {
                outcomes: [
                    {
                        guid: 'SOME_OUTCOME_1',
                        conditions: [{
                            leftHandSide: {value: 'TEST_VAR', error: null},
                            operator: {value: 'EqualTo', error: null},
                            rightHandSide: {value: '1', error: null}
                        }]
                    },
                    {
                        guid: 'SOME_OUTCOME_2',
                        conditions: [{
                            leftHandSide: {value: '', error: null},
                            operator: {value: 'EqualTo', error: null},
                            rightHandSide: {value: '1', error: null}
                        }]
                    },
                ]
            };
            // The node returned after validation has only one change - the correct error added to the invalid property
            const expectedNode = {...decisionWithEmptyLHSInCondition};
            expectedNode.outcomes[1].conditions[0].leftHandSide.error = CANNOT_BE_BLANK_ERROR;
            const validatedNode = decisionValidation.validateAll(decisionWithEmptyLHSInCondition);
            expect(validatedNode).toEqual(expectedNode);
        });
    });
    describe('when name, API name and condition logic are set', () => {
        it('and when empty should return this error for all of them - Cannot be blank', () => {
            const decisionWithEmptyProperties = {
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
                },
                outcomes: [{}]
            };
            const validatedDecision = decisionValidation.validateAll(decisionWithEmptyProperties);
            expect(validatedDecision.label.error).toBe(CANNOT_BE_BLANK_ERROR);
            expect(validatedDecision.name.error).toBe(CANNOT_BE_BLANK_ERROR);
            expect(validatedDecision.conditionLogic.error).toBe(CANNOT_BE_BLANK_ERROR);
        });
    });
});
