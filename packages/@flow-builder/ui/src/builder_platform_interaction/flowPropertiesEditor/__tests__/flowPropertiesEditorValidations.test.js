import { flowPropertiesEditorValidation } from '../flowPropertiesEditorValidation';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest
            .fn()
            .mockName('validateTextWithMergeFields')
            .mockReturnValue([])
    };
});

describe('FlowPropertiesValidations', () => {
    describe('Process Type property', () => {
        it('should return an error if null.', () => {
            expect(
                flowPropertiesEditorValidation.validateProperty(
                    'processType',
                    null
                )
            ).toBe(LABELS.cannotBeBlank);
        });
        it('should not return an error if valid processType is entered.', () => {
            expect(
                flowPropertiesEditorValidation.validateProperty(
                    'stageOrder',
                    'Autolauched Flow'
                )
            ).toBe(null);
        });
    });
    describe('Interview Label property', () => {
        it('should return null when valid string is passed.', () => {
            expect(
                flowPropertiesEditorValidation.validateProperty(
                    'interviewLabel',
                    'valid string'
                )
            ).toBeNull();
        });

        it('should return null when a empty string is passed.', () => {
            expect(
                flowPropertiesEditorValidation.validateProperty(
                    'interviewLabel',
                    ''
                )
            ).toBeNull();
        });

        it('should return - {string} Cannot accept more than 1000 characters when string length more than 1000 characters.', () => {
            const test = 'hello'.repeat(1000);
            expect(
                flowPropertiesEditorValidation.validateProperty(
                    'interviewLabel',
                    test
                )
            ).toBe(LABELS.maximumCharactersLimit);
        });

        it('cannnot have an invalid merge field', () => {
            const error = { message: 'invalid merge field' };
            validateTextWithMergeFields.mockReturnValueOnce([error]);
            expect(
                flowPropertiesEditorValidation.validateProperty(
                    'interviewLabel',
                    'some invalid text'
                )
            ).toEqual(error.message);
        });
    });
});
