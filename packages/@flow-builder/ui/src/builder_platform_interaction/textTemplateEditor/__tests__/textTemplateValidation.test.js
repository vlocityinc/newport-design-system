import { textTemplateValidation } from "../textTemplateValidation";
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { LABELS } from "../../validationRules/validationRulesLabels";
const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockName('validateTextWithMergeFields').mockReturnValue([]),
    };
});

describe('Text Template validation - additional rules', () => {
    it('Text area cannot be empty', () => {
        const textTemplateWithEmptyTextArea = {
                label: {
                    value: 'some label',
                    error: null
                },
                name: {
                    value: 'someDevName',
                    error: null
                },
                text: {
                    value: '',
                    error: null
                },
            };
            const validatedTextTemplate = textTemplateValidation.validateAll(textTemplateWithEmptyTextArea);
            expect(validatedTextTemplate.label.error).toBeNull();
            expect(validatedTextTemplate.name.error).toBeNull();
            expect(validatedTextTemplate.text.error).toBe(CANNOT_BE_BLANK_ERROR);
    });

    it('Text area cannot be only empty space', () => {
        const textTemplateWithEmptyTextArea = {
                label: {
                    value: 'some label',
                    error: null
                },
                name: {
                    value: 'someDevName',
                    error: null
                },
                text: {
                    value: '   ',
                    error: null
                },
            };
            const validatedTextTemplate = textTemplateValidation.validateAll(textTemplateWithEmptyTextArea);
            expect(validatedTextTemplate.label.error).toBeNull();
            expect(validatedTextTemplate.name.error).toBeNull();
            expect(validatedTextTemplate.text.error).toBe(CANNOT_BE_BLANK_ERROR);
    });

    it('Text area cannot be an invalid merge field', () => {
        const error = { message: 'invalid merge field' };
        validateTextWithMergeFields.mockReturnValueOnce([error]);
        const textTemplateWithInvalidMergeField = {
            label: {
                value: 'some label',
                error: null
            },
            name: {
                value: 'someDevName',
                error: null
            },
            text: {
                value: '{!badMergeField}',
                error: null
            },
        };
        const validatedTextTemplate = textTemplateValidation.validateAll(textTemplateWithInvalidMergeField);
        expect(validatedTextTemplate.label.error).toBeNull();
        expect(validatedTextTemplate.name.error).toBeNull();
        expect(validatedTextTemplate.text.error).toBe(error.message);
    });
});