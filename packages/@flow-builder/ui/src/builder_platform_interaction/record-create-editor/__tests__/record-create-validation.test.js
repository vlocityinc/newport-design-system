import { recordCreateValidation } from '../record-create-validation';
import { LABELS } from 'builder_platform_interaction-validation-rules';
describe('Default Validations', () => {
    describe('when props set to inputReference', () => {
        it('should return null if valid', () => {
            expect(recordCreateValidation.validateProperty('inputReference', "valid string")).toBeNull();
        });
        it('should return an error if blank', () => {
            expect(recordCreateValidation.validateProperty('inputReference', '')).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if null', () => {
            expect(recordCreateValidation.validateProperty('inputReference', null)).toBe(LABELS.cannotBeBlank);
        });
    });
});