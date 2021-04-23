// @ts-nocheck
import { scheduledPathsValidation } from '../scheduledPathsValidation';
import { LABELS } from '../../validationRules/validationRulesLabels';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';

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
        it('and when a negatif number is passed should return - Enter a valid value..', () => {
            expect(scheduledPathsValidation.validateProperty('offsetNumber', -3)).toBe(
                LABELS.shouldBeAPositiveIntegerOrZero
            );
        });
    });
});
