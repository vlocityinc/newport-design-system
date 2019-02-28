import { validateTextWithMergeFields, validateMergeField, isTextWithMergeFields } from '../mergeFieldValidation';
import { datetimeParamTypes, numberParamCanBeField, accountParam } from 'mock/ruleService';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/systemLib', () => {
    const emptyString = '$GlobalConstant.EmptyString';
    const currentDateSystemVariable = '$Flow.CurrentDate';
    return {
        GLOBAL_CONSTANTS: {
            EMPTY_STRING: emptyString,
        },
        GLOBAL_CONSTANT_PREFIX: '$GlobalConstant',
        getGlobalConstantOrSystemVariable: (id) => {
            if (id === currentDateSystemVariable) {
                return {
                    apiName: 'CurrentDate',
                    dataType: 'Date',
                    guid: '$Flow.CurrentDate',
                    isAssignable: false,
                    isCollection: false,
                    isSystemVariable: true,
                    label: 'CurrentDate',
                    name: '$Flow.CurrentDate',
                    subtype: '$Flow',
                    readOnly: true,
                    };
            }
            return id === emptyString;
        }
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn().mockImplementation(() => {
            return require('mock/serverEntityData').mockAccountFields;
        }),
    };
});

describe('Merge field validation', () => {
    it('Returns a validation error when it is not a valid merge field', () => {
        const validationErrors = validateMergeField('{!strVar1');
        expect(validationErrors).toEqual([
            {
                'endIndex': 8,
                'errorType': 'notAValidMergeField',
                'message': 'FlowBuilderMergeFieldValidation.notAValidMergeField',
                'startIndex': 0
            }]);
    });
    describe('Variables', () => {
        it('Returns no validation error when it references an existing variable', () => {
            const validationErrors = validateMergeField('{!strVar1}');
            expect(validationErrors).toEqual([]);
        });
        it('Returns a validation error when it does not reference an existing variable', () => {
            const validationErrors = validateMergeField('{!not_existing_variable}');
            expect(validationErrors).toEqual([
                {
                    'endIndex': 22,
                    'errorType': 'unknownMergeField',
                    'message': 'FlowBuilderMergeFieldValidation.unknownResource',
                    'startIndex': 2
                }]);
        });
        it('Returns no validation error when it references an existing variable record field', () => {
            const validationErrors = validateMergeField('{!accVar1.Name}');
            expect(validationErrors).toEqual([]);
        });
        it('is not case-sensitive for field names', () => {
            const validationErrors = validateMergeField('{!accVar1.NAME}');
            expect(validationErrors).toEqual([]);
        });
        it('Returns a validation error when it does not reference an existing variable record field', () => {
            // we will have the same error if user does not have access to this record field
            const validationErrors = validateMergeField('{!accVar1.Unknown}');
            expect(validationErrors).toEqual([
                {
                    'endIndex': 16,
                    'errorType': 'unknownMergeField',
                    'message': 'FlowBuilderMergeFieldValidation.unknownRecordField',
                    'startIndex': 2
                }]);
        });
        it('Returns a validation error for variable field merge field when variable does not exist', () => {
            const validationErrors = validateMergeField('{!unknownVariable.Unknown}');
            expect(validationErrors).toEqual([
                {
                    'endIndex': 24,
                    'errorType': 'unknownMergeField',
                    'message': 'FlowBuilderMergeFieldValidation.unknownResource',
                    'startIndex': 2
                }]);
        });
        it('Returns no validation error for datetime param types and date var', () => {
            const validationErrors = validateMergeField('{!dateVar1}', { allowGlobalConstants: true, allowedParamTypes: datetimeParamTypes });
            expect(validationErrors).toEqual([]);
        });
        it('Returns validation error for datetime param types and number var', () => {
            const validationErrors = validateMergeField('{!numVar1}', { allowGlobalConstants: true, allowedParamTypes: datetimeParamTypes });
            expect(validationErrors).toEqual([
                {
                    'endIndex': 8,
                    'errorType': 'wrongDataType',
                    'message': 'FlowBuilderMergeFieldValidation.invalidDataType',
                    'startIndex': 2
                }]);
        });
        it('Returns no validation error for datetime param types and sobject date field', () => {
            const validationErrors = validateMergeField('{!accVar1.LastModifiedDate}', { allowGlobalConstants: true, allowedParamTypes: datetimeParamTypes });
            expect(validationErrors).toEqual([]);
        });
        it('Returns validation error for datetime param types and sobject string field', () => {
            const validationErrors = validateMergeField('{!accVar1.Name}', { allowGlobalConstants: true, allowedParamTypes: datetimeParamTypes });
            expect(validationErrors).toEqual([
                {
                    'endIndex': 13,
                    'errorType': 'wrongDataType',
                    'message': 'FlowBuilderMergeFieldValidation.invalidDataType',
                    'startIndex': 2
                }]);
        });
        it('Returns no validation error for collection variables with allowCollectionVariables true', () => {
            const validationErrors = validateMergeField('{!collStrVar1}', { allowGlobalConstants: true, allowCollectionVariables: true });
            expect(validationErrors).toEqual([]);
        });
        it('Returns validation error for sobject collection variables with allowCollectionVariables is not set to true ', () => {
            const validationErrors = validateMergeField('{!accCollectionVar1}', { allowGlobalConstants: true });
            expect(validationErrors).toEqual([
                {
                    'endIndex': 18,
                    'errorType': 'wrongDataType',
                    'message': 'FlowBuilderMergeFieldValidation.resourceCannotBeUsedAsMergeField',
                    'startIndex': 2
                }]);
        });
        it('Allows sobject which matches object type', () => {
            const validationErrors = validateMergeField('{!accVar1}', { allowedParamTypes: accountParam });
            expect(validationErrors).toEqual([]);
        });
    });
    describe('Global constants', () => {
        it('Returns no validation error when it references {!$GlobalConstant.EmptyString}', () => {
            const validationErrors = validateMergeField('{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}');
            expect(validationErrors).toEqual([]);
        });
        it('Returns a validation error when it references a global constant that does not exist', () => {
            const validationErrors = validateMergeField('{!$GlobalConstant.A}');
            expect(validationErrors).toEqual([
                {
                    'endIndex': 18,
                    'errorType': 'invalidGlobalConstant',
                    'message': 'FlowBuilderCombobox.genericErrorMessage',
                    'startIndex': 2
                }]);
        });
        it('Returns a validation error when it references a global variable that does not exist', () => {
            const validationErrors = validateMergeField('{!$Flow.A}');
            expect(validationErrors).toEqual([
                {
                    'endIndex': 8,
                    'errorType': 'invalidGlobalVariable',
                    'message': 'FlowBuilderCombobox.genericErrorMessage',
                    'startIndex': 2
                }]);
        });
        it('Returns a validation error when it references a global variable with invalid data type', () => {
            const validationErrors = validateMergeField('{!$Flow.CurrentDate}', { allowedParamTypes: numberParamCanBeField });
            expect(validationErrors).toEqual([
                {
                    'endIndex': 18,
                    'errorType': 'wrongDataType',
                    'message': 'FlowBuilderMergeFieldValidation.invalidDataType',
                    'startIndex': 2
                }]);
        });
        it('Returns a validation error when it references {!$GlobalConstant.EmptyString} when global constants are not allowed', () => {
            const validationErrors = validateMergeField('{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}', { allowGlobalConstants : false });
            expect(validationErrors).toEqual([
                {
                    'endIndex': 28,
                    'errorType': 'notAValidMergeField',
                    'message': 'FlowBuilderMergeFieldValidation.globalConstantsNotAllowed',
                    'startIndex': 2
                }]);
        });
    });
    describe('Elements', () => {
        it('Returns no validation error when it references a canvas element', () => {
            const validationErrors = validateMergeField('{!actionCall1}');
            expect(validationErrors).toEqual([]);
        });
        it('Returns a validation error when it references a canvas element without a type', () => {
            const validationErrors = validateMergeField('{!assignment1}');
            expect(validationErrors).toEqual([
                {
                    'endIndex': 12,
                    'errorType': 'wrongDataType',
                    'message': 'FlowBuilderMergeFieldValidation.resourceCannotBeUsedAsMergeField',
                    'startIndex': 2
                }]);
        });
        it('Returns a validation error when it references a property of a canvas element', () => {
            const validationErrors = validateMergeField('{!actionCall1.property}');
            expect(validationErrors).toEqual([
                {
                    'endIndex': 21,
                    'errorType': 'notAValidMergeField',
                    'message': 'FlowBuilderMergeFieldValidation.notAValidMergeField',
                    'startIndex': 2
                }]);
        });
        it('Returns no validation error when it references a decision outcome', () => {
            const validationErrors = validateMergeField('{!outcome1}');
            expect(validationErrors).toEqual([]);
        });
        it('Returns no validation error when it references a wait event', () => {
            const validationErrors = validateMergeField('{!waitEvent1}');
            expect(validationErrors).toEqual([]);
        });
        it('Returns no validation error when it references a text template', () => {
            const validationErrors = validateMergeField('{!textTemplate1}');
            expect(validationErrors).toEqual([]);
        });
        it('Returns no validation error when it references a stage', () => {
            const validationErrors = validateMergeField('{!stage1}');
            expect(validationErrors).toEqual([]);
        });
        it('Returns no validation error when it references a choice', () => {
            const validationErrors = validateMergeField('{!numberChoice}');
            expect(validationErrors).toEqual([]);
        });
    });
});

describe('Text with merge fields validation', () => {
    it('Returns no validation error when it references existing variables', () => {
        const validationErrors = validateTextWithMergeFields('{!accVar1.Name} == {!strVar1}');
        expect(validationErrors).toEqual([]);
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