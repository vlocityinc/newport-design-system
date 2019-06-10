import {
    textTemplateValidation,
    MAX_TEXT_LENGTH
} from '../textTemplateValidation';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { LABELS } from '../../validationRules/validationRulesLabels';
import { format } from 'builder_platform_interaction/commonUtils';

const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;
const MAXIMUM_CHARS_LIMIT_ERROR_FORMAT = LABELS.maximumCharactersLimit;
const TEXT_WITH_65536_CHARS = 'z'.repeat(MAX_TEXT_LENGTH + 1);

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest
            .fn()
            .mockName('validateTextWithMergeFields')
            .mockReturnValue([])
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
            }
        };
        const validatedTextTemplate = textTemplateValidation.validateAll(
            textTemplateWithEmptyTextArea
        );
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
            }
        };
        const validatedTextTemplate = textTemplateValidation.validateAll(
            textTemplateWithEmptyTextArea
        );
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
            }
        };
        const validatedTextTemplate = textTemplateValidation.validateAll(
            textTemplateWithInvalidMergeField
        );
        expect(validatedTextTemplate.label.error).toBeNull();
        expect(validatedTextTemplate.name.error).toBeNull();
        expect(validatedTextTemplate.text.error).toBe(error.message);
    });

    it('Text area cannot exceed ${MAX_TEXT_LENGTH} characters', () => {
        const error = {
            message: format(MAXIMUM_CHARS_LIMIT_ERROR_FORMAT, MAX_TEXT_LENGTH)
        };
        const textTemplateWithMoreThan65535Chars = {
            label: {
                value: 'some label',
                error: null
            },
            name: {
                value: 'someDevName',
                error: null
            },
            text: {
                value: TEXT_WITH_65536_CHARS,
                error: null
            }
        };
        const validatedTextTemplate = textTemplateValidation.validateAll(
            textTemplateWithMoreThan65535Chars
        );
        expect(validatedTextTemplate.label.error).toBeNull();
        expect(validatedTextTemplate.name.error).toBeNull();
        expect(validatedTextTemplate.text.error).toBe(error.message);
    });
});
