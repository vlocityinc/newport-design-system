// @ts-nocheck
import { timeTriggersValidation } from '../timeTriggersValidation';
import { LABELS } from '../../validationRules/validationRulesLabels';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';

describe('Additional Time Trigger Validations', () => {
    describe('when props set to offsetUnit', () => {
        it('and when valid string is passed should return - null', () => {
            expect(timeTriggersValidation.validateProperty('offsetUnit', TIME_OPTION.DAYS_BEFORE)).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(timeTriggersValidation.validateProperty('offsetUnit', '')).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('when props set to timeSource', () => {
        it('and when valid string is passed should return - null', () => {
            expect(timeTriggersValidation.validateProperty('timeSource', 'createDate')).toBeNull();
        });
        it('and when empty string is passed should return - Cannot be blank.', () => {
            expect(timeTriggersValidation.validateProperty('timeSource', '')).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('when props set to offset Number', () => {
        it('and when valid number is passed should return - null', () => {
            expect(timeTriggersValidation.validateProperty('offsetNumber', 1)).toBeNull();
        });
        it('and when a negatif number is passed should return - Enter a valid value..', () => {
            expect(timeTriggersValidation.validateProperty('offsetNumber', -3)).toBe(
                LABELS.shouldBeAPositiveIntegerOrZero
            );
        });
    });
});
