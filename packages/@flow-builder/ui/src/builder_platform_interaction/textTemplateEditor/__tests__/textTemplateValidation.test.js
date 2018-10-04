import { textTemplateValidation } from "../textTemplateValidation";

import { LABELS } from "../../validationRules/validationRulesLabels";
const CANNOT_BE_BLANK_ERROR = LABELS.cannotBeBlank;

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
});