import { stageValidation } from '../stageValidation';
import { LABELS } from "builder_platform_interaction/validationRules";

describe('Default Validations', () => {
    describe('Stage Order property', () => {
        it('should return an error if null.', () => {
            expect(stageValidation.validateProperty('stageOrder', null)).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
        });
        it('should return an error if NaN or exponential value is entered.', () => {
            expect(stageValidation.validateProperty('stageOrder', 'e4')).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
        });
        it('should return an error if negative value is entered.', () => {
            expect(stageValidation.validateProperty('stageOrder', '-4')).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
        });
        it('should not return an error if valid number is entered.', () => {
            expect(stageValidation.validateProperty('stageOrder', '4')).toBe(null);
        });
        it('should return an error if empty string value is entered.', () => {
            expect(stageValidation.validateProperty('stageOrder', '')).toBe(LABELS.cannotBeBlank);
        });
    });
});