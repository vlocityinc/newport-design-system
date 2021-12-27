// @ts-nocheck
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { clearExtensionsCache, setExtensionDescriptions } from 'builder_platform_interaction/flowExtensionLib';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    accountSObjectVariable,
    apexCallAutomaticAnonymousAccountOutput,
    apexCallAutomaticAnonymousAccountsOutput,
    apexComplexTypeTwoVariable,
    flowWithAllElementsUIModel,
    loopOnAccountAutoOutput
} from 'mock/storeData';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { flowExtensionDetails } from 'serverData/GetFlowExtensionDetails/flowExtensionDetails.json';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/invocableActionLib', () =>
    require('builder_platform_interaction_mocks/invocableActionLib')
);
jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getEntity: (objectType) => {
            return { apiName: objectType.charAt(0).toUpperCase() + objectType.slice(1) };
        },
        getFieldsForEntity: jest.fn()
    };
});

describe('reference to variable util', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
        setApexClasses(apexTypesForFlow);
        setExtensionDescriptions(flowExtensionDetails);
    });
    afterAll(() => {
        Store.resetStore();
        setApexClasses(null);
        clearExtensionsCache();
    });
    describe('getVariableOrField', () => {
        const expectedGeneratedAccount = {
            apiName: 'generatedAccount',
            label: 'generatedAccount',
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: false
        };
        const expectedLwcAccount = {
            apiName: 'account',
            label: 'Account',
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: false
        };
        const expectedLwcAccounts = {
            apiName: 'accounts',
            label: 'Accounts',
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: true
        };
        const expectedApexTestOneAcct = {
            apexClass: 'ApexComplexTypeTestOne216',
            apiName: 'acct',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account'
        };

        it.each`
            reference                                               | expectedVariable
            ${'accountSObjectVariable'}                             | ${accountSObjectVariable}
            ${'apexCall_account_automatic_output.generatedAccount'} | ${expectedGeneratedAccount}
            ${'apexCall_anonymous_account'}                         | ${apexCallAutomaticAnonymousAccountOutput}
            ${'apexCall_anonymous_accounts'}                        | ${apexCallAutomaticAnonymousAccountsOutput}
            ${'lightningCompWithAccountOutput.account'}             | ${expectedLwcAccount}
            ${'apexComplexTypeTwoVariable.testOne.acct'}            | ${expectedApexTestOneAcct}
            ${'loopOnAccountAutoOutput'}                            | ${loopOnAccountAutoOutput}
            ${'lightningCompWithAccountsOutput.accounts'}           | ${expectedLwcAccounts}
            ${accountSObjectVariable.guid}                          | ${accountSObjectVariable}
            ${apexComplexTypeTwoVariable.guid + '.testOne.acct'}    | ${expectedApexTestOneAcct}
        `(
            'variable should match $expectedVariable.apiName when reference is $reference',
            ({ reference, expectedVariable }) => {
                const { elements } = Store.getStore().getCurrentState();
                const variable = getVariableOrField(reference, elements);

                expect(variable).toMatchObject(expectedVariable);
            }
        );
        it.each`
            reference
            ${'IDontExist'}
            ${'accountSObjectVariable.IDontExist'}
            ${'apexComplexTypeTwoVariable.testOne.IDontExist'}
        `('returns undefined when variable or field does not exist. Reference: $reference', ({ reference }) => {
            const { elements } = Store.getStore().getCurrentState();
            const variable = getVariableOrField(reference, elements);

            expect(variable).toBeUndefined();
        });
    });
});
