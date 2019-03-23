import { createValidationRuleObject } from "../../base/baseValidationInput";

const validationRule = {
    errorMessage: 'mock error message value',
    formulaExpression: 'mock formula'
};
const defaultValidationRule = {
    errorMessage: '',
    formulaExpression: ''
};

describe('createValidationRuleForUserInput function', () => {
    it('returns a new validation rule object with default values when no arguments are passed', () => {
        const actualResult = createValidationRuleObject();
        expect(actualResult).toMatchObject(defaultValidationRule);
    });

    describe('when existing validation rule object is passed', () => {
        it('returns a new validation rule object with the same value', () => {
            const actualResult = createValidationRuleObject(validationRule);
            expect(actualResult).toMatchObject(validationRule);
        });
        it('returns a new validation rule object', () => {
            const actualResult = createValidationRuleObject(validationRule);
            expect(actualResult).not.toBe(validationRule);
        });
    });
});