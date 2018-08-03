import { formulaValidation } from '../formula-validation';
import { LABELS } from 'builder_platform_interaction-validation-rules';

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
    });
});