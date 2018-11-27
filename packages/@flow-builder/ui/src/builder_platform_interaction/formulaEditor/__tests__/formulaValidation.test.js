import { formulaValidation } from "../formulaValidation";
import { LABELS } from "builder_platform_interaction/validationRules";
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockName('validateTextWithMergeFields').mockReturnValue([]),
    };
});

describe('Default Validations', () => {
    describe('DataType property', () => {
        it('should return an error if null', () => {
            expect(formulaValidation.validateProperty('dataType', null)).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('Expression property', () => {
        it('should return an error if empty', () => {
            expect(formulaValidation.validateProperty('expression', '')).toBe(LABELS.cannotBeBlank);
        });

        it('returns an error if invalid merge field', () => {
            const mockError = { message: 'invalid merge field' };
            validateTextWithMergeFields.mockReturnValueOnce([mockError]);
            expect(formulaValidation.validateProperty('expression', '{!badMergeField}')).toBe(mockError.message);
        });
    });
});