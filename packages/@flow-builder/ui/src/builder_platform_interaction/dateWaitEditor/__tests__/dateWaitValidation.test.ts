import { LABELS } from '../../validationRules/validationRulesLabels';
import { dateWaitValidation } from '../dateWaitValidation';

const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;

describe('Resume Date Validations', () => {
    it('should not be null', () => {
        expect(dateWaitValidation.validateProperty('resumeDate', null)).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should not be blank', () => {
        expect(dateWaitValidation.validateProperty('resumeDate', '')).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should be valid date string', () => {
        expect(dateWaitValidation.validateProperty('resumeDate', '2022-08-22')).toBeNull();
    });
});

describe('Resume Time Validations', () => {
    it('should not be null', () => {
        expect(dateWaitValidation.validateProperty('resumeTime', null)).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should not be blank', () => {
        expect(dateWaitValidation.validateProperty('resumeTime', '')).toBe(CANNOT_BE_BLANK_ERROR);
    });
    it('should be valid time string', () => {
        expect(dateWaitValidation.validateProperty('resumeTime', '00:00:00Z')).toBeNull();
    });
});
