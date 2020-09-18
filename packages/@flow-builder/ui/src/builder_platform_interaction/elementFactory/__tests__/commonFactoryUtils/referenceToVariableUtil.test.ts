// @ts-nocheck
import {
    flowWithAllElementsUIModel,
    apexCallAutomaticAnonymousAccountsOutput,
    apexCallAutomaticAnonymousAccountOutput,
    loopOnAccountAutoOutput,
    apexComplexTypeTwoVariable,
    accountSObjectVariable
} from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';
import { getVariableOrField } from '../../commonFactoryUtils/referenceToVariableUtil';
import { setApexClasses, getPropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { getAccountFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getAccountFromApexActionDetails.json';
import {
    mockLightningCompWithAccountOutputFlowExtensionDescription,
    mockLightningCompWithSObjectCollectionOutputFlowExtensionDescription
} from 'mock/flowExtensionsData';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/flowExtensionLib', () =>
    require('builder_platform_interaction_mocks/flowExtensionLib')
);
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
    });
    afterAll(() => {
        Store.resetStore();
        setApexClasses(null);
    });
    describe('getVariableOrField', () => {
        const expectedGeneratedAccount = getAccountFromApexActionDetails.parameters[1];
        expectedGeneratedAccount.dataType = 'SObject';
        const expectedLwcAccount = mockLightningCompWithAccountOutputFlowExtensionDescription.outputParameters[0];
        expectedLwcAccount.dataType = 'SObject';
        const expectedLwcAccounts =
            mockLightningCompWithSObjectCollectionOutputFlowExtensionDescription.outputParameters[0];
        expectedLwcAccounts.dataType = 'SObject';
        setApexClasses(apexTypesForFlow);
        const expectedApexTestOneAcct = getPropertiesForClass('ApexComplexTypeTestOne216').acct;

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
