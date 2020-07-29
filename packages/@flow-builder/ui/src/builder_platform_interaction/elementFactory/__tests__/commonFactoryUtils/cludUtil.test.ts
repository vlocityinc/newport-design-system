// @ts-nocheck
import {
    flowWithAllElementsUIModel,
    apexCallAccountAutomaticOutput,
    apexCallAutomaticAnonymousAccountsOutput,
    apexCallAutomaticAnonymousAccountOutput,
    lightningCompAutomaticOutputContainsAccountExtension,
    loopOnAccountAutoOutput,
    lightningCompAutomaticOutputSObjectCollectionExtension,
    apexComplexTypeTwoVariable,
    accountSObjectVariable
} from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';
import { referenceToVariable, getFirstRecordOnlyFromVariable } from '../../commonFactoryUtils/cludUtil';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/flowExtensionLib', () =>
    require('builder_platform_interaction_mocks/flowExtensionLib')
);
jest.mock('builder_platform_interaction/invocableActionLib', () =>
    require('builder_platform_interaction_mocks/invocableActionLib')
);

describe('clud util', () => {
    beforeAll(() => {
        setApexClasses(apexTypesForFlow);
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
        setApexClasses(null);
    });
    describe('reference to variable', () => {
        it.each`
            reference                                               | expectedVariable
            ${'accountSObjectVariable.IDontExist'}                  | ${accountSObjectVariable}
            ${'apexComplexTypeTwoVariable.testOne.IDontExist'}      | ${apexComplexTypeTwoVariable}
            ${'accountSObjectVariable'}                             | ${accountSObjectVariable}
            ${'apexCall_account_automatic_output.generatedAccount'} | ${apexCallAccountAutomaticOutput}
            ${'apexCall_anonymous_account'}                         | ${apexCallAutomaticAnonymousAccountOutput}
            ${'apexCall_anonymous_accounts'}                        | ${apexCallAutomaticAnonymousAccountsOutput}
            ${'lightningCompWithAccountOutput.account'}             | ${lightningCompAutomaticOutputContainsAccountExtension}
            ${'apexComplexTypeTwoVariable.testOne.acc'}             | ${apexComplexTypeTwoVariable}
            ${'loopOnAccountAutoOutput'}                            | ${loopOnAccountAutoOutput}
            ${'lightningCompWithAccountsOutput.accounts'}           | ${lightningCompAutomaticOutputSObjectCollectionExtension}
            ${accountSObjectVariable.guid}                          | ${accountSObjectVariable}
            ${apexComplexTypeTwoVariable.guid + '.testOne.acc'}     | ${apexComplexTypeTwoVariable}
        `(
            'variable should match $expectedVariable.name when reference is $reference',
            ({ reference, expectedVariable }) => {
                const { elements } = Store.getStore().getCurrentState();
                const variable = referenceToVariable(reference, elements);

                expect(variable).toMatchObject(expectedVariable);
            }
        );
        it('returns undefined when variable does not exist', () => {
            const variable = referenceToVariable('IDontExist', Store.getStore().getCurrentState().elements);

            expect(variable).toBeUndefined();
        });
    });
    describe('get first record only', () => {
        it.each`
            reference                                                                    | variable                                                  | expectedGetFirstRecordOnly
            ${'IDontExist'}                                                              | ${undefined}                                              | ${undefined}
            ${'accountSObjectVariable.IDontExist'}                                       | ${accountSObjectVariable}                                 | ${undefined}
            ${'apexComplexTypeTwoVariable.testOne.IDontExist'}                           | ${apexComplexTypeTwoVariable}                             | ${undefined}
            ${'accountSObjectVariable'}                                                  | ${accountSObjectVariable}                                 | ${true}
            ${'apexCall_account_automatic_output.generatedAccount'}                      | ${apexCallAccountAutomaticOutput}                         | ${true}
            ${'apexCall_anonymous_account'}                                              | ${apexCallAutomaticAnonymousAccountOutput}                | ${true}
            ${'apexCall_anonymous_accounts'}                                             | ${apexCallAutomaticAnonymousAccountsOutput}               | ${false}
            ${'lightningCompWithAccountOutput.account'}                                  | ${lightningCompAutomaticOutputContainsAccountExtension}   | ${true}
            ${'apexComplexTypeTwoVariable.testOne.acct'}                                 | ${apexComplexTypeTwoVariable}                             | ${true}
            ${'loopOnAccountAutoOutput'}                                                 | ${loopOnAccountAutoOutput}                                | ${true}
            ${'lightningCompWithAccountsOutput.accounts'}                                | ${lightningCompAutomaticOutputSObjectCollectionExtension} | ${false}
            ${lightningCompAutomaticOutputSObjectCollectionExtension.guid + '.accounts'} | ${lightningCompAutomaticOutputSObjectCollectionExtension} | ${false}
        `(
            'getFirstRecordOnly should be $expectedGetFirstRecordOnly when reference is $reference',
            ({ reference, variable, expectedGetFirstRecordOnly }) => {
                const getFirstRecordOnly = getFirstRecordOnlyFromVariable(variable, reference);

                expect(getFirstRecordOnly).toBe(expectedGetFirstRecordOnly);
            }
        );
        it('returns undefined when variable does not match reference', () => {
            const getFirstRecordOnly = getFirstRecordOnlyFromVariable(
                accountSObjectVariable,
                'apexComplexTypeTwoVariable.testOne.acct'
            );

            expect(getFirstRecordOnly).toBeUndefined();
        });
    });
});
