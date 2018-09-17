import { recordDeleteValidation } from '../recordDeleteValidation';
import { LABELS } from 'builder_platform_interaction/validationRules';

const INPUT_REFERENCE_PROPERTY_NAME = 'inputReference';

describe('Default Validations', () => {
    describe('when props set to inputReference', () => {
        test('should return null if valid', () => {
            expect(recordDeleteValidation.validateProperty(INPUT_REFERENCE_PROPERTY_NAME, "valid string")).toBeNull();
        });
        test('should return an error if blank', () => {
            expect(recordDeleteValidation.validateProperty(INPUT_REFERENCE_PROPERTY_NAME, '')).toBe(LABELS.cannotBeBlank);
        });
        test('should return an error if null', () => {
            expect(recordDeleteValidation.validateProperty(INPUT_REFERENCE_PROPERTY_NAME, null)).toBe(LABELS.cannotBeBlank);
        });
    });
});