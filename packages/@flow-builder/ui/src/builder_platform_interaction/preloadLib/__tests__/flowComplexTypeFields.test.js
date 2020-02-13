import {
    loadFieldsForSobjectsInFlow,
    loadFieldsForExtensionsInFlow,
    loadParametersForInvocableActionsInFlow,
    loadParametersForInvocableApexActionsInFlowFromMetadata,
    loadFieldsForApexClassesInFlow,
    loadFieldsForSubflowsInFlow
} from '../flowComplexTypeFields';
import { loadApexClasses } from 'builder_platform_interaction/preloadLib';
import {
    accountSObjectVariable,
    accountSObjectCollectionVariable,
    lookupRecordAutomaticOutput,
    lookupRecordCollectionAutomaticOutput,
    lookupRecordOutputReference,
    screenElement,
    emailScreenFieldAutomaticOutput,
    emailScreenField,
    actionCallAutomaticOutput,
    actionCallElement,
    apexCallAutomaticAnonymousAccountOutput,
    externalServiceAutomaticOutput,
    apexCallManualAccountOutput,
    apexCarVariable,
    apexComplexTypeCollectionVariable,
    subflowAutomaticOutput
} from 'mock/storeData';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { describeExtensions } from 'builder_platform_interaction/flowExtensionLib';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { getActionCallsByNames } from 'mock/flows/mock-flow.js';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { fetchActiveOrLatestFlowOutputVariables } from 'builder_platform_interaction/subflowsLib';

jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn().mockImplementation(() => Promise.resolve())
}));

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    const actual = require.requireActual('builder_platform_interaction/flowExtensionLib');
    return {
        COMPONENT_INSTANCE: actual.COMPONENT_INSTANCE,
        describeExtensions: jest.fn().mockImplementation(() => Promise.resolve())
    };
});

jest.mock('builder_platform_interaction/invocableActionLib', () => ({
    fetchDetailsForInvocableAction: jest.fn().mockImplementation(() => Promise.resolve())
}));

jest.mock('builder_platform_interaction/preloadLib', () => ({
    loadApexClasses: jest.fn().mockImplementation(() => Promise.resolve())
}));

jest.mock('builder_platform_interaction/subflowsLib', () => ({
    fetchActiveOrLatestFlowOutputVariables: jest.fn().mockImplementation(() => Promise.resolve())
}));

describe('flowComplexTypeFields', () => {
    const stateWithElements = elements => {
        const elementsMap = elements.reduce((acc, element) => {
            acc[element.guid] = element;
            return acc;
        }, {});
        return { elements: elementsMap };
    };
    describe('loadFieldsForSobjectsInFlow', () => {
        const expectOneCallToFetchFieldsForEntity = expectedEntityName => {
            expect(fetchFieldsForEntity.mock.calls).toHaveLength(1);
            expect(fetchFieldsForEntity.mock.calls[0][0]).toBe(expectedEntityName);
        };
        it('Load fields for sobject variables', async () => {
            await loadFieldsForSobjectsInFlow(stateWithElements([accountSObjectVariable]));
            expectOneCallToFetchFieldsForEntity('Account');
        });
        it('Does not load fields for sobject variable collections', async () => {
            await loadFieldsForSobjectsInFlow(stateWithElements([accountSObjectCollectionVariable]));
            expect(fetchFieldsForEntity.mock.calls).toHaveLength(0);
        });
        it('Load fields for lookups in automatic output mode with first record only', async () => {
            await loadFieldsForSobjectsInFlow(stateWithElements([lookupRecordAutomaticOutput]));
            expectOneCallToFetchFieldsForEntity('Account');
        });
        it('Does not load fields for lookups in automatic output mode when we retrieve all records', async () => {
            await loadFieldsForSobjectsInFlow(stateWithElements([lookupRecordCollectionAutomaticOutput]));
            expect(fetchFieldsForEntity.mock.calls).toHaveLength(0);
        });
        it('Does not load fields for lookups not in automatic output mode', async () => {
            await loadFieldsForSobjectsInFlow(stateWithElements([lookupRecordOutputReference]));
            expect(fetchFieldsForEntity.mock.calls).toHaveLength(0);
        });
    });
    describe('loadFieldsForApexClassesInFlow', () => {
        it('Load fields for apex type variables', async () => {
            await loadFieldsForApexClassesInFlow(stateWithElements([apexCarVariable]));
            expect(loadApexClasses.mock.calls).toHaveLength(1);
        });
        it('Does not load fields for apex type variable collections', async () => {
            await loadFieldsForApexClassesInFlow(stateWithElements([apexComplexTypeCollectionVariable]));
            expect(loadApexClasses.mock.calls).toHaveLength(0);
        });
    });
    describe('loadFieldsForExtensionsInFlow', () => {
        const expectOneCallToDescribeExtensions = expectedNames => {
            expect(describeExtensions.mock.calls).toHaveLength(1);
            expect(describeExtensions.mock.calls[0][0]).toEqual(expectedNames);
        };
        it('Load fields for screen fields in automatic output mode', async () => {
            await loadFieldsForExtensionsInFlow(stateWithElements([screenElement, emailScreenFieldAutomaticOutput]));
            expectOneCallToDescribeExtensions([emailScreenFieldAutomaticOutput.extensionName]);
        });
        it('Does not load fields for screen fields not in automatic mode', async () => {
            await loadFieldsForExtensionsInFlow(stateWithElements([screenElement, emailScreenField]));
            expectOneCallToDescribeExtensions([]);
        });
    });
    describe('loadParametersForInvocableActionsInFlow', () => {
        const expectThreeCallsToFetchParametersForInvocableAction = (...expectedActionCallNameAndType) => {
            expect(fetchDetailsForInvocableAction.mock.calls).toHaveLength(3);
            expect(fetchDetailsForInvocableAction.mock.calls[0][0]).toEqual(expectedActionCallNameAndType[0]);
            expect(fetchDetailsForInvocableAction.mock.calls[1][0]).toEqual(expectedActionCallNameAndType[1]);
            expect(fetchDetailsForInvocableAction.mock.calls[2][0]).toEqual(expectedActionCallNameAndType[2]);
        };
        it('Load invocable action parameters for actions in automatic output mode', async () => {
            await loadParametersForInvocableActionsInFlow(
                stateWithElements([
                    actionCallAutomaticOutput,
                    apexCallAutomaticAnonymousAccountOutput,
                    externalServiceAutomaticOutput
                ])
            );
            expectThreeCallsToFetchParametersForInvocableAction(
                {
                    actionName: 'chatterPost',
                    actionType: 'chatterPost'
                },
                {
                    actionName: 'getAccounts',
                    actionType: 'apex'
                },
                {
                    actionName: 'BankServiceNew.addAccount',
                    actionType: 'externalService'
                }
            );
        });
        it('Does not load invocable action parameters for actions not in automatic output mode', async () => {
            await loadParametersForInvocableActionsInFlow(stateWithElements([actionCallElement]));
            expect(fetchDetailsForInvocableAction.mock.calls).toHaveLength(0);
        });
    });
    describe('loadFieldsForSubflowsInFlow', () => {
        it('Load subflow output variables for subflows in automatic output mode', async () => {
            await loadFieldsForSubflowsInFlow(stateWithElements([subflowAutomaticOutput]));
            expect(fetchActiveOrLatestFlowOutputVariables.mock.calls).toHaveLength(1);
            expect(fetchActiveOrLatestFlowOutputVariables.mock.calls[0][0]).toBe('flowWithActiveAndLatest');
        });
    });
    describe('loadParametersForInvocableApexActionsInFlowFromMetadata', () => {
        const expectOneCallToFetchParametersForInvocableAction = expectedActionCallNameAndType => {
            expect(fetchDetailsForInvocableAction.mock.calls).toHaveLength(1);
            expect(fetchDetailsForInvocableAction.mock.calls[0][0]).toEqual(expectedActionCallNameAndType);
        };
        it('Load invocable action parameters only for apex actions in automatic output mode', async () => {
            await loadParametersForInvocableApexActionsInFlowFromMetadata(
                getActionCallsByNames(flowWithAllElements, [
                    actionCallAutomaticOutput.name,
                    apexCallAutomaticAnonymousAccountOutput.name,
                    externalServiceAutomaticOutput.name,
                    apexCallManualAccountOutput.name
                ])
            );
            expectOneCallToFetchParametersForInvocableAction({
                actionName: 'getAccounts',
                actionType: 'apex'
            });
        });
        it('Does not load invocable action parameters for actions not in automatic output mode', async () => {
            await loadParametersForInvocableApexActionsInFlowFromMetadata(
                getActionCallsByNames(flowWithAllElements, [actionCallElement.name])
            );
            expect(fetchDetailsForInvocableAction.mock.calls).toHaveLength(0);
        });
    });
});
