// @ts-nocheck
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from '../../validationRules/validationRulesLabels';
import { scheduledPathsValidation } from '../scheduledPathsValidation';

describe('Additional Scheduled Path Validations', () => {
    describe('when props set to offsetUnit', () => {
        it('and when valid string is passed should return - null', () => {
            expect(scheduledPathsValidation.validateProperty('offsetUnit', TIME_OPTION.DAYS_BEFORE)).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(scheduledPathsValidation.validateProperty('offsetUnit', '')).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('when props set to timeSource', () => {
        it('and when valid string is passed should return - null', () => {
            expect(scheduledPathsValidation.validateProperty('timeSource', 'createDate')).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(scheduledPathsValidation.validateProperty('timeSource', '')).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('when props set to offset Number', () => {
        it('and when valid number is passed should return - null', () => {
            expect(scheduledPathsValidation.validateProperty('offsetNumber', 1)).toBeNull();
        });
        it('and when a negative number is passed should return - Enter a valid value..', () => {
            expect(scheduledPathsValidation.validateProperty('offsetNumber', -3)).toBe(
                LABELS.shouldBeAPositiveIntegerOrZero
            );
        });
    });
    describe('when props set to maxBatchSize', () => {
        it('and when NaN is passed should return - mustBeAValidNumber', () => {
            expect(scheduledPathsValidation.validateProperty('maxBatchSize', 'a')).toBe(LABELS.mustBeAValidNumber);
        });
        it('and when an invalid number is passed should return - shouldBeInRange', () => {
            expect(scheduledPathsValidation.validateProperty('maxBatchSize', 300)).toBe(LABELS.shouldBeInRange);
        });
        it('and when a valid number is passed should return - null', () => {
            expect(scheduledPathsValidation.validateProperty('maxBatchSize', 100)).toBeNull();
        });
    });
});
