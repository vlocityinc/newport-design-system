import { Store } from 'builder_platform_interaction_mocks/storeLib';
import {
    validateTextWithMergeFields,
    validateMergeField,
    isTextWithMergeFields
} from '../mergeFieldValidation';
import {
    datetimeParamTypes,
    numberParamCanBeAnything,
    accountParam,
    apexClassParam
} from 'mock/ruleService';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import { getCachedExtension } from 'builder_platform_interaction/flowExtensionLib';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { userFields as mockUserFields } from 'serverData/GetFieldsForEntity/userFields.json';
import { feedItemFields as mockFeedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { autolaunchedFlowUIModel } from 'mock/storeDataAutolaunched';
import { mockScreenElement } from 'mock/calloutData';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/systemLib', () => {
    const emptyString = '$GlobalConstant.EmptyString';
    const currentDateSystemVariable = '$Flow.CurrentDate';
    const currentStageSystemVariable = '$Flow.CurrentStage';
    return {
        GLOBAL_CONSTANTS: {
            EMPTY_STRING: emptyString
        },
        GLOBAL_CONSTANT_PREFIX: '$GlobalConstant',
        SYSTEM_VARIABLE_PREFIX: '$Flow',
        SYSTEM_VARIABLE_CLIENT_PREFIX: '$Client',
        getGlobalConstantOrSystemVariable: id => {
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
                    subtype: 'Flow',
                    readOnly: true
                };
            }
            if (id === currentStageSystemVariable) {
                return {
                    isCollection: false,
                    isAssignable: true,
                    dataType: 'String',
                    elementType: 'STAGE',
                    apiName: 'CurrentStage',
                    guid: '$Flow.CurrentStage',
                    label: 'CurrentStage',
                    name: '$Flow.CurrentStage',
                    readOnly: false,
                    isSystemVariable: true,
                    subtype: 'Flow'
                };
            }
            if (id === emptyString) {
                return {
                    label: '$GlobalConstant.EmptyString',
                    name: '$GlobalConstant.EmptyString',
                    guid: '$GlobalConstant.EmptyString',
                    isCollection: false,
                    dataType: 'String',
                    category: 'Global Constants',
                    description: 'Equivalent to empty string (not null)'
                };
            }
            return undefined;
        }
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn().mockImplementation(entityName => {
            if (entityName === 'Account') {
                return mockAccountFields;
            } else if (entityName === 'User') {
                return mockUserFields;
            } else if (entityName === 'FeedItem') {
                return mockFeedItemFields;
            }
            return undefined;
        })
    };
});

jest.mock('builder_platform_interaction/apexTypeLib', () => ({
    getPropertiesForClass: jest
        .fn()
        .mockImplementation(
            () => require('mock/apexTypesData').mockCarApexTypeProperties
        )
}));

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    return {
        getCachedExtension: jest
            .fn()
            .mockImplementation(
                () =>
                    require('mock/flowExtensionsData')
                        .mockFlowRuntimeEmailFlowExtensionDescription
            )
    };
});

jest.mock(
    '@salesforce/label/FlowBuilderMergeFieldValidation.notAValidMergeField',
    () => ({ default: `"{0}" isn't a valid merge field.` }),
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderMergeFieldValidation.unknownResource',
    () => ({ default: `The "{0}" resource doesn't exist in this flow.` }),
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderMergeFieldValidation.unknownRecordField',
    () => ({
        default: `The "{0}" field doesn't exist on the "{1}" object, or you don't have access to the field.`
    }),
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderMergeFieldValidation.invalidDataType',
    () => ({
        default: `The data type of the resource you entered isn't compatible.`
    }),
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderMergeFieldValidation.resourceCannotBeUsedAsMergeField',
    () => ({ default: `The "{0}" resource can't be used as a merge field.` }),
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderMergeFieldValidation.globalConstantsNotAllowed',
    () => ({ default: `Global constants aren't supported in this context.` }),
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderMergeFieldValidation.invalidPolymorphicRecordField',
    () => ({
        default: `Invalid polymorphic relationship reference : "{1}" is not a valid polymorphic field for "{0}"`
    }),
    { virtual: true }
);

// we should probably not use this error message
jest.mock(
    '@salesforce/label/FlowBuilderCombobox.genericErrorMessage',
    () => ({ default: `Enter a valid value.` }),
    { virtual: true }
);

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getScreenElement: jest.fn().mockImplementation(() => mockScreenElement),
        isElementAllowed: require.requireActual(
            'builder_platform_interaction/expressionUtils'
        ).isElementAllowed
    };
});

const validationError = (startIndex, endIndex, errorType, message) => ({
    startIndex,
    endIndex,
    errorType,
    message
});

describe('Merge field validation', () => {
    it('Returns a validation error when it is not a valid merge field', () => {
        const validationErrors = validateMergeField('{!stringVariable');
        expect(validationErrors).toEqual([
            validationError(
                0,
                15,
                'notAValidMergeField',
                `"{!stringVariable" isn't a valid merge field.`
            )
        ]);
    });
    it('Returns a validation error when the field in current session (not in store) is not a valid merge field', () => {
        const validationErrors = validateMergeField(
            '{!invalidMergeFieldScreenElementNotInStore}'
        );
        expect(validationErrors).toEqual([
            validationError(
                2,
                41,
                'wrongDataType',
                'The "invalidMergeFieldScreenElementNotInStore" resource can\'t be used as a merge field.'
            )
        ]);
    });
    describe('Variables', () => {
        it('Returns no validation error when it references an existing variable', () => {
            const validationErrors = validateMergeField('{!stringVariable}');
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns no validation error when it references an existing variable in current session but not in store', () => {
            const validationErrors = validateMergeField(
                '{!validMergeFieldScreenElementNotInStore}'
            );
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns a validation error when it does not reference an existing variable', () => {
            const validationErrors = validateMergeField(
                '{!not_existing_variable}'
            );
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    22,
                    'unknownMergeField',
                    `The "not_existing_variable" resource doesn't exist in this flow.`
                )
            ]);
        });
        describe('Record field', () => {
            it('Returns no validation error when it references an existing variable record field', () => {
                const validationErrors = validateMergeField(
                    '{!accountSObjectVariable.Name}'
                );
                expect(validationErrors).toHaveLength(0);
            });
            it('is not case-sensitive for field names', () => {
                const validationErrors = validateMergeField(
                    '{!accountSObjectVariable.NAME}'
                );
                expect(validationErrors).toHaveLength(0);
            });
            it('Returns a validation error when it does not reference an existing variable record field', () => {
                // we will have the same error if user does not have access to this record field
                const validationErrors = validateMergeField(
                    '{!accountSObjectVariable.Unknown}'
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        31,
                        'unknownMergeField',
                        `The "Unknown" field doesn't exist on the "Account" object, or you don't have access to the field.`
                    )
                ]);
            });
            it('Returns a validation error for variable field merge field when variable does not exist', () => {
                const validationErrors = validateMergeField(
                    '{!unknownVariable.Unknown}'
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        24,
                        'unknownMergeField',
                        `The "unknownVariable" resource doesn't exist in this flow.`
                    )
                ]);
            });
        });
        describe('Cross-Object field references', () => {
            it('Returns no error if intermediary fields are spannable and all fields exist', () => {
                const validationErrors = validateMergeField(
                    '{!accountSObjectVariable.CreatedBy.AboutMe}'
                );
                expect(validationErrors).toHaveLength(0);
            });
            it('Returns an error if one of the intermediary fields is not spannable', () => {
                const validationErrors = validateMergeField(
                    '{!feedItemVariable.OriginalCreatedBy.Name}'
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        40,
                        'unknownMergeField',
                        `The "OriginalCreatedBy" field doesn't exist on the "FeedItem" object, or you don't have access to the field.`
                    )
                ]);
            });
        });

        describe('Cross-Object Field References in Flows: Polymorphic Relationships', () => {
            it('Returns no error if it is a valid merge field with polymorphic relationship', () => {
                const validationErrors = validateMergeField(
                    '{!feedItemVariable.Parent:User.AboutMe}'
                );
                expect(validationErrors).toHaveLength(0);
            });
            it('Returns an error if the specific entity name in the polymorphic relationship merge field is not a valid one', () => {
                const validationErrors = validateMergeField(
                    '{!feedItemVariable.Parent:Group.AboutMe}'
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        38,
                        'unknownMergeField',
                        `Invalid polymorphic relationship reference : "Parent:Group" is not a valid polymorphic field for "FeedItem"`
                    )
                ]);
            });
        });
        it('Returns no validation error for datetime param types and date var', () => {
            const validationErrors = validateMergeField('{!dateVariable}', {
                allowGlobalConstants: true,
                allowedParamTypes: datetimeParamTypes
            });
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns validation error for datetime param types and number var', () => {
            const validationErrors = validateMergeField('{!numberVariable}', {
                allowGlobalConstants: true,
                allowedParamTypes: datetimeParamTypes
            });
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    15,
                    'wrongDataType',
                    `The data type of the resource you entered isn't compatible.`
                )
            ]);
        });
        it('Returns no validation error for datetime param types and sobject date field', () => {
            const validationErrors = validateMergeField(
                '{!accountSObjectVariable.LastModifiedDate}',
                {
                    allowGlobalConstants: true,
                    allowedParamTypes: datetimeParamTypes
                }
            );
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns validation error for datetime param types and sobject string field', () => {
            const validationErrors = validateMergeField(
                '{!accountSObjectVariable.Name}',
                {
                    allowGlobalConstants: true,
                    allowedParamTypes: datetimeParamTypes
                }
            );
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    28,
                    'wrongDataType',
                    `The data type of the resource you entered isn't compatible.`
                )
            ]);
        });
        it('Returns no validation error for collection variables with allowCollectionVariables true', () => {
            const validationErrors = validateMergeField(
                '{!stringCollectionVariable1}',
                {
                    allowGlobalConstants: true,
                    allowCollectionVariables: true
                }
            );
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns validation error for sobject collection variables with allowCollectionVariables is not set to true ', () => {
            const validationErrors = validateMergeField(
                '{!accountSObjectCollectionVariable}',
                { allowGlobalConstants: true }
            );
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    33,
                    'wrongDataType',
                    `The "accountSObjectCollectionVariable" resource can't be used as a merge field.`
                )
            ]);
        });
        it('Allows sobject which matches object type', () => {
            const validationErrors = validateMergeField(
                '{!accountSObjectVariable}',
                {
                    allowedParamTypes: accountParam
                }
            );
            expect(validationErrors).toHaveLength(0);
        });
        describe('Apex types', () => {
            it('Allows apex which matches class type', () => {
                const validationErrors = validateMergeField(
                    '{!apexSampleVariable}',
                    { allowedParamTypes: apexClassParam }
                );
                expect(validationErrors).toHaveLength(0);
            });
            it('Allows apex property which matches allowed type', () => {
                const validationErrors = validateMergeField(
                    '{!apexSampleVariable.account}',
                    { allowedParamTypes: accountParam }
                );
                expect(validationErrors).toHaveLength(0);
            });
            it('Returns validation error if apex property does not match allowed type', () => {
                const validationErrors = validateMergeField(
                    '{!apexSampleVariable.model}',
                    { allowedParamTypes: accountParam }
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        25,
                        'wrongDataType',
                        `The data type of the resource you entered isn't compatible.`
                    )
                ]);
            });
            it('Returns validation error if apex property does not exist', () => {
                const validationErrors = validateMergeField(
                    '{!apexSampleVariable.unexisting}',
                    { allowedParamTypes: accountParam }
                );
                // message should be specific for apex properties ?
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        30,
                        'unknownMergeField',
                        `The "unexisting" field doesn't exist on the "MyApexClass" object, or you don't have access to the field.`
                    )
                ]);
            });
        });
    });
    describe('Global variables', () => {
        it('Returns a validation error when it references a global variable that does not exist', () => {
            const validationErrors = validateMergeField('{!$Flow.A}');
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    8,
                    'invalidGlobalVariable',
                    `Enter a valid value.`
                )
            ]);
        });
        it('Returns a validation error when it references a global variable with invalid data type', () => {
            const validationErrors = validateMergeField(
                '{!$Flow.CurrentDate}',
                { allowedParamTypes: numberParamCanBeAnything }
            );
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    18,
                    'wrongDataType',
                    `The data type of the resource you entered isn't compatible.`
                )
            ]);
        });
    });
    describe('Global constants', () => {
        it('Returns no validation error when it references {!$GlobalConstant.EmptyString}', () => {
            const validationErrors = validateMergeField(
                '{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}'
            );
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns a validation error when it references a global constant that does not exist', () => {
            const validationErrors = validateMergeField('{!$GlobalConstant.A}');
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    18,
                    'invalidGlobalConstant',
                    `Enter a valid value.`
                )
            ]);
        });
        it('Returns a validation error when it references {!$GlobalConstant.EmptyString} when global constants are not allowed', () => {
            const validationErrors = validateMergeField(
                '{!' + GLOBAL_CONSTANTS.EMPTY_STRING + '}',
                { allowGlobalConstants: false }
            );
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    28,
                    'notAValidMergeField',
                    `Global constants aren't supported in this context.`
                )
            ]);
        });
    });
    describe('Elements', () => {
        it('Returns no validation error when it references a canvas element', () => {
            const validationErrors = validateMergeField('{!actionCall1}');
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns a validation error when it references a canvas element without a type', () => {
            const validationErrors = validateMergeField('{!assignment1}');
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    12,
                    'wrongDataType',
                    `The "assignment1" resource can't be used as a merge field.`
                )
            ]);
        });
        it('Returns a validation error when it references a property of a canvas element that has not a complex type', () => {
            const validationErrors = validateMergeField(
                '{!actionCall1.property}'
            );
            expect(validationErrors).toEqual([
                validationError(
                    2,
                    21,
                    'wrongDataType',
                    `The "actionCall1.property" resource can't be used as a merge field.`
                )
            ]);
        });
        it('Returns no validation error when it references a decision outcome', () => {
            const validationErrors = validateMergeField('{!outcome1}');
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns no validation error when it references a wait event', () => {
            Store.resetStore();
            Store.setMockState(autolaunchedFlowUIModel);
            const validationErrors = validateMergeField('{!waitEvent1}');
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns no validation error when it references a text template', () => {
            const validationErrors = validateMergeField('{!textTemplate1}');
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns no validation error when it references a stage', () => {
            const validationErrors = validateMergeField('{!stage1}');
            expect(validationErrors).toHaveLength(0);
        });
        it('Returns no validation error when it references a choice', () => {
            const validationErrors = validateMergeField('{!numberChoice}');
            expect(validationErrors).toHaveLength(0);
        });
    });
    describe('Lookup element', () => {
        describe('Automatic output handling mode', () => {
            it('Returns no validation error when it references an existing field', () => {
                const validationErrors = validateMergeField(
                    '{!lookupRecordAutomaticOutput.Name}'
                );
                expect(validationErrors).toHaveLength(0);
            });
            it('Returns a validation error when it references a non existing field', () => {
                const validationErrors = validateMergeField(
                    '{!lookupRecordAutomaticOutput.UnknownField}'
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        41,
                        'unknownMergeField',
                        `The "UnknownField" field doesn't exist on the "Account" object, or you don't have access to the field.`
                    )
                ]);
            });
        });
        describe('Not in automatic output handling mode', () => {
            it('Returns a validation error when it references a field', () => {
                const validationErrors = validateMergeField(
                    '{!lookupRecordOutputReference.Name}'
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        33,
                        'wrongDataType',
                        `The "lookupRecordOutputReference.Name" resource can't be used as a merge field.`
                    )
                ]);
            });
            it('Returns no validation error when it references the element', () => {
                const validationErrors = validateMergeField(
                    '{!lookupRecordOutputReference}'
                );
                expect(validationErrors).toHaveLength(0);
            });
        });
    });
    describe('LC screen field', () => {
        describe('Automatic output handling mode', () => {
            it('Returns no validation error when it references an existing LC param', () => {
                const validationErrors = validateMergeField(
                    '{!emailScreenFieldAutomaticOutput.value}'
                );
                expect(validationErrors).toHaveLength(0);
            });
            it('Returns a validation error when it references a non existing LC param', () => {
                const validationErrors = validateMergeField(
                    '{!emailScreenFieldAutomaticOutput.nonExisting}'
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        44,
                        'unknownMergeField',
                        `The "nonExisting" field doesn't exist on the "flowruntime:email" object, or you don't have access to the field.`
                    )
                ]);
            });
            it('Returns no validation error even for non existing LC param when the extension description is not in the cache', () => {
                getCachedExtension.mockReturnValueOnce(undefined);
                const validationErrors = validateMergeField(
                    '{!emailScreenFieldAutomaticOutput.nonExisting}'
                );
                expect(validationErrors).toHaveLength(0);
            });
        });
        describe('Not in automatic output handling mode', () => {
            it('Returns a validation error when it references a LC param', () => {
                const validationErrors = validateMergeField(
                    '{!emailScreenField.Name}'
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        22,
                        'notAValidMergeField',
                        `"{!emailScreenField.Name}" isn't a valid merge field.`
                    )
                ]);
            });
            it('Returns no validation error when it references the element', () => {
                const validationErrors = validateMergeField(
                    '{!emailScreenField}'
                );
                expect(validationErrors).toEqual([
                    validationError(
                        2,
                        17,
                        'wrongDataType',
                        `The "emailScreenField" resource can't be used as a merge field.`
                    )
                ]);
            });
        });
    });
});

describe('Text with merge fields validation', () => {
    it('Returns no validation error when it references existing variables', () => {
        const validationErrors = validateTextWithMergeFields(
            '{!accountSObjectVariable.Name} == {!stringVariable}'
        );
        expect(validationErrors).toHaveLength(0);
    });
});

describe('Is text with merge fields validation', () => {
    const validationTestData = [
        { value: '{!MyVar1}', result: false },
        { value: 'test name', result: false },
        { value: '{test}', result: false },
        { value: '{test.test}', result: false },
        { value: '{$test}', result: false },
        { value: '{!test test', result: false },
        { value: '{!myAccount.Description}', result: false },
        { value: '{!myAccount.Contact.Id}', result: false },
        { value: { a: '1', b: '2' }, result: false },
        { value: true, result: false },
        { value: null, result: false },
        { value: undefined, result: false },
        { value: '', result: false },
        { value: '{$test} {!var1}', result: true },
        { value: '{!myAccount.Description} ', result: true },
        { value: ' {!myAccount.Description}', result: true },
        { value: '{!myAccount.Description} {!test}', result: true },
        { value: 'My name is {!firstName}', result: true }
    ];

    validationTestData.forEach(testData => {
        it(`returns ${testData.result} for '${testData.value}'`, () => {
            expect(isTextWithMergeFields(testData.value)).toEqual(
                testData.result
            );
        });
    });
});
