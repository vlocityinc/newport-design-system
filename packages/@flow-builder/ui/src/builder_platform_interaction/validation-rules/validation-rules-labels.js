import cannotBeBlank from '@salesforce/label/FlowBuilderValidation.cannotBeBlank';
import shouldNotBeginOrEndWithUnderscores from '@salesforce/label/FlowBuilderValidation.shouldNotBeginOrEndWithUnderscores';
import shouldNotBeginWithNumericOrSpecialCharacters from '@salesforce/label/FlowBuilderValidation.shouldNotBeginWithNumericOrSpecialCharacters';
import shouldAcceptOnlyAlphanumericCharacters from '@salesforce/label/FlowBuilderValidation.shouldAcceptOnlyAlphanumericCharacters';
import shouldBeAPositiveIntegerOrZero from '@salesforce/label/FlowBuilderValidation.shouldBeAPositiveIntegerOrZero';
import mustBeAValidDate from '@salesforce/label/FlowBuilderValidation.mustBeAValidDate';
import maximumCharactersLimit from '@salesforce/label/FlowBuilderValidation.maximumCharactersLimit';
import fieldNotUnique from '@salesforce/label/FlowBuilderValidation.fieldNotUnique';
import overMaxIntegerValue from '@salesforce/label/FlowBuilderValidation.overMaxIntegerValue';

export const LABELS = {
    cannotBeBlank,
    shouldNotBeginOrEndWithUnderscores,
    shouldNotBeginWithNumericOrSpecialCharacters,
    shouldAcceptOnlyAlphanumericCharacters,
    shouldBeAPositiveIntegerOrZero,
    mustBeAValidDate,
    maximumCharactersLimit,
    fieldNotUnique,
    overMaxIntegerValue
};