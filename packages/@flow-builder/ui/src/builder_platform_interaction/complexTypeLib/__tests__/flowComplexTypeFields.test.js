import {
    loadFieldsForSobjectsInFlow,
    loadFieldsForExtensionsInFlow,
    loadParametersForInvocableActionsInFlow
} from '../flowComplexTypeFields';
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
    actionCallElement
} from 'mock/storeData';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { describeExtensions } from 'builder_platform_interaction/flowExtensionLib';
import { fetchParametersForInvocableAction } from 'builder_platform_interaction/invocableActionLib';

jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn().mockImplementation(() => Promise.resolve())
}));

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    const actual = require.requireActual(
        '../../flowExtensionLib/flowExtensionLib.js'
    );
    return {
        COMPONENT_INSTANCE: actual.COMPONENT_INSTANCE,
        describeExtensions: jest
            .fn()
            .mockImplementation(() => Promise.resolve())
    };
});

jest.mock('builder_platform_interaction/invocableActionLib', () => ({
    fetchParametersForInvocableAction: jest
        .fn()
        .mockImplementation(() => Promise.resolve())
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
            expect(fetchFieldsForEntity.mock.calls[0][0]).toBe(
                expectedEntityName
            );
        };
        it('Load fields for sobject variables', async () => {
            await loadFieldsForSobjectsInFlow(
                stateWithElements([accountSObjectVariable])
            );
            expectOneCallToFetchFieldsForEntity('Account');
        });
        it('Does not load fields for sobject variable collections', async () => {
            await loadFieldsForSobjectsInFlow(
                stateWithElements([accountSObjectCollectionVariable])
            );
            expect(fetchFieldsForEntity.mock.calls).toHaveLength(0);
        });
        it('Load fields for lookups in automatic output mode with first record only', async () => {
            await loadFieldsForSobjectsInFlow(
                stateWithElements([lookupRecordAutomaticOutput])
            );
            expectOneCallToFetchFieldsForEntity('Account');
        });
        it('Does not load fields for lookups in automatic output mode when we retrieve all records', async () => {
            await loadFieldsForSobjectsInFlow(
                stateWithElements([lookupRecordCollectionAutomaticOutput])
            );
            expect(fetchFieldsForEntity.mock.calls).toHaveLength(0);
        });
        it('Does not load fields for lookups not in automatic output mode', async () => {
            await loadFieldsForSobjectsInFlow(
                stateWithElements([lookupRecordOutputReference])
            );
            expect(fetchFieldsForEntity.mock.calls).toHaveLength(0);
        });
    });
    describe('loadFieldsForExtensionsInFlow', () => {
        const expectOneCallToDescribeExtensions = expectedNames => {
            expect(describeExtensions.mock.calls).toHaveLength(1);
            expect(describeExtensions.mock.calls[0][0]).toEqual(expectedNames);
        };
        it('Load fields for screen fields in automatic output mode', async () => {
            await loadFieldsForExtensionsInFlow(
                stateWithElements([
                    screenElement,
                    emailScreenFieldAutomaticOutput
                ])
            );
            expectOneCallToDescribeExtensions([
                emailScreenFieldAutomaticOutput.extensionName
            ]);
        });
        it('Does not load fields for screen fields not in automatic mode', async () => {
            await loadFieldsForExtensionsInFlow(
                stateWithElements([screenElement, emailScreenField])
            );
            expectOneCallToDescribeExtensions([]);
        });
    });
    describe('loadParametersForInvocableActionsInFlow', () => {
        const expectOneCallToFetchParametersForInvocableAction = expectedActionCallNameAndType => {
            expect(fetchParametersForInvocableAction.mock.calls).toHaveLength(
                1
            );
            expect(fetchParametersForInvocableAction.mock.calls[0][0]).toEqual(
                expectedActionCallNameAndType
            );
        };
        it('Load invocable action parameters for actions in automatic output mode', async () => {
            await loadParametersForInvocableActionsInFlow(
                stateWithElements([actionCallAutomaticOutput])
            );
            expectOneCallToFetchParametersForInvocableAction({
                actionName: 'chatterPost',
                actionType: 'chatterPost'
            });
        });
        it('Does not load invocable action parameters for actions not in automatic output mode', async () => {
            await loadParametersForInvocableActionsInFlow(
                stateWithElements([actionCallElement])
            );
            expect(fetchParametersForInvocableAction.mock.calls).toHaveLength(
                0
            );
        });
    });
});
