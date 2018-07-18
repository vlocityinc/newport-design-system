import cannotBeBlank from '@salesforce/label/FlowBuilderValidation.cannotBeBlank';
import shouldNotBeginOrEndWithUnderscores from '@salesforce/label/FlowBuilderValidation.shouldNotBeginOrEndWithUnderscores';
import shouldAcceptOnlyAlphanumericOrSpecialCharacters from '@salesforce/label/FlowBuilderValidation.shouldAcceptOnlyAlphanumericOrSpecialCharacters';
import shouldNotBeginWithNumericOrSpecialCharacters from '@salesforce/label/FlowBuilderValidation.shouldNotBeginWithNumericOrSpecialCharacters';
import shouldAcceptOnlyAlphanumericCharacters from '@salesforce/label/FlowBuilderValidation.shouldAcceptOnlyAlphanumericCharacters';
import shouldBeAPositiveIntegerOrZero from '@salesforce/label/FlowBuilderValidation.shouldBeAPositiveIntegerOrZero';
import mustBeAValidDate from '@salesforce/label/FlowBuilderValidation.mustBeAValidDate';
import maximumCharactersLimit from '@salesforce/label/FlowBuilderValidation.maximumCharactersLimit';
import fieldNotUnique from '@salesforce/label/FlowBuilderValidation.fieldNotUnique';

export const LABELS = {
    cannotBeBlank,
    shouldNotBeginOrEndWithUnderscores,
    shouldAcceptOnlyAlphanumericOrSpecialCharacters,
    shouldNotBeginWithNumericOrSpecialCharacters,
    shouldAcceptOnlyAlphanumericCharacters,
    shouldBeAPositiveIntegerOrZero,
    mustBeAValidDate,
    maximumCharactersLimit,
    fieldNotUnique
};