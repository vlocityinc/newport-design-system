import { validateTextWithMergeFields, validateMergeField, isTextWithMergeFields } from '../mergeFieldValidation';
import { datetimeParamTypes } from "mock/ruleService";
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import { areFieldsForEntityAlreadyFetched } from 'builder_platform_interaction/sobjectLib';

jest.mock('builder_platform_interaction/systemLib', () => {
    const emptyString = '$GlobalConstant.EmptyString';
    return {
        GLOBAL_CONSTANTS: {
            EMPTY_STRING: emptyString,
        },
        GLOBAL_CONSTANT_PREFIX: '$GlobalConstant',
        getGlobalConstantOrSystemVariable: (id) => {
            return id === emptyString;
        }
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        fetchFieldsForEntity: jest.fn().mockImplementation(() => {
            return Promise.resolve(require.requireActual('mock/serverEntityData').mockAccountFields);
        }),
        areFieldsForEntityAlreadyFetched: jest.fn().mockImplementation(() => false)
    };
});

describe('Merge field validation', () => {
    it('Returns a validation error when it is not a valid merge field', (done) => {
        validateMergeField('{!strVar1').then(validationErrors => {
            expect(validationErrors).toEqual([
                {
                    'endIndex': 8,
                    'errorType': 'notAValidMergeField',
                    'message': 'FlowBuilderMergeFieldValidation.notAValidMergeField',
                    'startIndex': 0
                }]);
            done();
        });
    });
    describe('Variables', () => {
        it('Returns no validation error when it references an existing variable', (done) => {
            validateMergeField('{!strVar1}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns a validation error when it does not reference an existing variable', (done) => {
            validateMergeField('{!not_existing_variable}').then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 22,
                        'errorType': 'unknownMergeField',
                        'message': 'FlowBuilderMergeFieldValidation.unknownResource',
                        'startIndex': 2
                    }]);
                done();
            });
        });
        it('Returns no validation error when it references an existing variable record field', (done) => {
            validateMergeField('{!accVar1.Name}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('is not case-sensitive for field names', (done) => {
            validateMergeField('{!accVar1.NAME}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns a validation error when it does not reference an existing variable record field', (done) => {
            validateMergeField('{!accVar1.Unknown}').then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 16,
                        'errorType': 'unknownMergeField',
                        'message': 'FlowBuilderMergeFieldValidation.unknownRecordField',
                        'startIndex': 2
                    }]);
                done();
            });
        });
        it('Returns a validation error for variable field merge field when variable does not exist', (done) => {
            validateMergeField('{!unknownVariable.Unknown}').then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 24,
                        'errorType': 'unknownMergeField',
                        'message': 'FlowBuilderMergeFieldValidation.unknownResource',
                        'startIndex': 2
                    }]);
                done();
            });
        });
        it('Returns no validation errors if quickValidation and fields are not cached', (done) => {
            areFieldsForEntityAlreadyFetched.mockImplementationOnce(() => false);
            validateMergeField('{!accVar1.FieldName}', { quickValidation : true }).then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns no validation error for datetime param types and date var', (done) => {
            validateMergeField('{!dateVar1}', { allowGlobalConstants: true, allowedParamTypes: datetimeParamTypes }).then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns validation error for datetime param types and number var', (done) => {
            validateMergeField('{!numVar1}', { allowGlobalConstants: true, allowedParamTypes: datetimeParamTypes }).then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 8,
                        'errorType': 'wrongDataType',
                        'message': 'FlowBuilderMergeFieldValidation.invalidDataType',
                        'startIndex': 2
                    }]);
                done();
            });
        });
        it('Returns no validation error for datetime param types and sobject date field', (done) => {
            validateMergeField('{!accVar1.LastModifiedDate}', { allowGlobalConstants: true, allowedParamTypes: datetimeParamTypes }).then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns validation error for datetime param types and sobject string field', (done) => {
            validateMergeField('{!accVar1.Name}', { allowGlobalConstants: true, allowedParamTypes: datetimeParamTypes }).then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 13,
                        'errorType': 'wrongDataType',
                        'message': 'FlowBuilderMergeFieldValidation.invalidDataType',
                        'startIndex': 2
                    }]);
                done();
            });
        });
    });
    describe('Global constants', () => {
        it('Returns no validation error when it references {!$GlobalConstant.EmptyString}', (done) => {
            validateMergeField('{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns a validation error when it references a global constant that does not exist', (done) => {
            validateMergeField('{!$GlobalConstant.A}').then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 18,
                        'errorType': 'invalidGlobalConstant',
                        'message': 'FlowBuilderCombobox.genericErrorMessage',
                        'startIndex': 2
                    }]);
                done();
            });
        });
        it('Returns a validation error when it references a global variable that does not exist', (done) => {
            validateMergeField('{!$Flow.A}').then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 8,
                        'errorType': 'invalidGlobalVariable',
                        'message': 'FlowBuilderCombobox.genericErrorMessage',
                        'startIndex': 2
                    }]);
                done();
            });
        });
        it('Returns a validation error when it references {!$GlobalConstant.EmptyString} when global constants are not allowed', (done) => {
            validateMergeField('{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}', { allowGlobalConstants : false }).then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 28,
                        'errorType': 'notAValidMergeField',
                        'message': 'FlowBuilderMergeFieldValidation.globalConstantsNotAllowed',
                        'startIndex': 2
                    }]);
                done();
            });
        });
    });
    describe('Elements', () => {
        it('Returns no validation error when it references a canvas element', (done) => {
            validateMergeField('{!actionCall1}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns a validation error when it references a canvas element without a type', (done) => {
            validateMergeField('{!assignment1}').then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 12,
                        'errorType': 'wrongDataType',
                        'message': 'FlowBuilderMergeFieldValidation.resourceCannotBeUsedAsMergeField',
                        'startIndex': 2
                    }]);
                done();
            });
        });
        it('Returns a validation error when it references a property of a canvas element', (done) => {
            validateMergeField('{!actionCall1.property}').then(validationErrors => {
                expect(validationErrors).toEqual([
                    {
                        'endIndex': 21,
                        'errorType': 'notAValidMergeField',
                        'message': 'FlowBuilderMergeFieldValidation.notAValidMergeField',
                        'startIndex': 2
                    }]);
                done();
            });
        });
        it('Returns no validation error when it references a decision outcome', (done) => {
            validateMergeField('{!outcome1}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns no validation error when it references a wait event', (done) => {
            validateMergeField('{!waitEvent1}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns no validation error when it references a text template', (done) => {
            validateMergeField('{!textTemplate1}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns no validation error when it references a stage', (done) => {
            validateMergeField('{!stage1}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
        it('Returns no validation error when it references a choice', (done) => {
            validateMergeField('{!numberChoice}').then(validationErrors => {
                expect(validationErrors).toEqual([]);
                done();
            });
        });
    });
});

describe('Text with merge fields validation', () => {
    it('Returns no validation error when it references existing variables', (done) => {
        validateTextWithMergeFields('{!accVar1.Name} == {!strVar1}').then(validationErrors => {
            expect(validationErrors).toEqual([]);
            done();
        });
    });
});

describe('Is text with merge fields validation', () => {
    const validationTestData = [
        {value: '{!MyVar1}', result: false},
        {value: 'test name', result: false},
        {value: '{test}', result: false},
        {value: '{test.test}', result: false},
        {value: '{$test}', result: false},
        {value: '{!test test', result: false},
        {value: '{!myAccount.Description}', result: false},
        {value: '{!myAccount.Contact.Id}', result: false},
        {value: { a:'1', b:'2' }, result: false},
        {value: true, result: false},
        {value: null, result: false},
        {value: undefined, result: false},
        {value: '', result: false},
        {value: '{$test} {!var1}', result: true},
        {value: '{!myAccount.Description} ', result: true},
        {value: ' {!myAccount.Description}', result: true},
        {value: '{!myAccount.Description} {!test}', result: true},
        {value: 'My name is {!firstName}', result: true},
    ];

    validationTestData.forEach(testData => {
        it(`returns ${testData.result} for '${testData.value}'`, () => {
            expect(isTextWithMergeFields(testData.value)).toEqual(testData.result);
        });
    });
});