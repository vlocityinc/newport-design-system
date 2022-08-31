import { LABELS } from '../../validationRules/validationRulesLabels';
import { durationWaitValidation } from '../durationWaitValidation';

const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;
const MUST_BE_NUMBER_ERROR = LABELS.mustBeAValidNumber;

describe('Duration Validations', () => {
    it('should not be null', () => {
        expect(durationWaitValidation.validateProperty('duration', null)).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should not be blank', () => {
        expect(durationWaitValidation.validateProperty('duration', '')).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should be a number', () => {
        expect(durationWaitValidation.validateProperty('duration', '3')).toBeNull();
    });
    it('should not be a non-number', () => {
        expect(durationWaitValidation.validateProperty('duration', 'not really a number')).toBe(MUST_BE_NUMBER_ERROR);
    });
});

describe('Duration Unit Validations', () => {
    it('should not be null', () => {
        expect(durationWaitValidation.validateProperty('durationUnit', null)).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should not be blank', () => {
        expect(durationWaitValidation.validateProperty('durationUnit', '')).toBe(CANNOT_BE_BLANK_ERROR);
    });
});
