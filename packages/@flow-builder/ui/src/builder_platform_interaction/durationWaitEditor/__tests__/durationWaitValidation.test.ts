import { LABELS } from '../../validationRules/validationRulesLabels';
import { durationWaitValidation } from '../durationWaitValidation';

const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;
const MUST_BE_NUMBER_ERROR = LABELS.mustBeAValidNumber;

describe('Duration Validations', () => {
    it('should not be null', () => {
        expect(durationWaitValidation.validateProperty('offset', null)).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should not be blank', () => {
        expect(durationWaitValidation.validateProperty('offset', '')).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should be a number', () => {
        expect(durationWaitValidation.validateProperty('offset', '3')).toBeNull();
    });
    it('should not be a non-number', () => {
        expect(durationWaitValidation.validateProperty('offset', 'not really a number')).toBe(MUST_BE_NUMBER_ERROR);
    });
});

describe('Duration Unit Validations', () => {
    it('should not be null', () => {
        expect(durationWaitValidation.validateProperty('offsetUnit', null)).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should not be blank', () => {
        expect(durationWaitValidation.validateProperty('offsetUnit', '')).toBe(CANNOT_BE_BLANK_ERROR);
    });
});
