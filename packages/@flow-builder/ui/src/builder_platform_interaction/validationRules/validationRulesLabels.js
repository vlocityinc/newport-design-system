import cannotBeBlank from '@salesforce/label/FlowBuilderValidation.cannotBeBlank';
import shouldNotBeginOrEndWithUnderscores from '@salesforce/label/FlowBuilderValidation.shouldNotBeginOrEndWithUnderscores';
import shouldNotBeginWithNumericOrSpecialCharacters from '@salesforce/label/FlowBuilderValidation.shouldNotBeginWithNumericOrSpecialCharacters';
import shouldAcceptOnlyAlphanumericCharacters from '@salesforce/label/FlowBuilderValidation.shouldAcceptOnlyAlphanumericCharacters';
import shouldBeAPositiveIntegerOrZero from '@salesforce/label/FlowBuilderValidation.shouldBeAPositiveIntegerOrZero';
import mustBeAValidNumber from '@salesforce/label/FlowBuilderValidation.mustBeAValidNumber';
import maximumCharactersLimit from '@salesforce/label/FlowBuilderValidation.maximumCharactersLimit';
import fieldNotUnique from '@salesforce/label/FlowBuilderValidation.fieldNotUnique';
import overMaxIntegerValue from '@salesforce/label/FlowBuilderValidation.overMaxIntegerValue';
import orderNumberNotUnique from '@salesforce/label/FlowBuilderValidation.numberNotUnique';
import shouldBeInRange from '@salesforce/label/FlowBuilderValidation.shouldBeInRange';
import enterValidValue from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';
import dateErrorMessage from "@salesforce/label/FlowBuilderCombobox.dateErrorMessage";
import datetimeErrorMessage from "@salesforce/label/FlowBuilderCombobox.datetimeErrorMessage";

export const LABELS = {
    cannotBeBlank,
    shouldNotBeginOrEndWithUnderscores,
    shouldNotBeginWithNumericOrSpecialCharacters,
    shouldAcceptOnlyAlphanumericCharacters,
    shouldBeAPositiveIntegerOrZero,
    dateErrorMessage,
    datetimeErrorMessage,
    mustBeAValidNumber,
    maximumCharactersLimit,
    fieldNotUnique,
    overMaxIntegerValue,
    orderNumberNotUnique,
    shouldBeInRange,
    enterValidValue
};