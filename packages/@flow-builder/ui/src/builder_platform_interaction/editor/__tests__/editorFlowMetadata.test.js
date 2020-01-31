import { createElement } from 'lwc';
import Editor from '../editor';
import { loadParametersForInvocableApexActionsInFlowFromMetadata } from 'builder_platform_interaction/preloadLib';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { initializeAuraFetch } from '../../integrationTests/__tests__/serverDataTestUtils';

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-editor', {
        is: Editor
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/preloadLib', () => {
    return {
        loadParametersForInvocableApexActionsInFlowFromMetadata: jest.fn().mockResolvedValue({}),
        loadFieldsForComplexTypesInFlow: jest.fn(),
        loadReferencesIn: jest.fn().mockResolvedValue({}),
        initializeLoader: jest.fn(),
        loadOnStart: jest.fn(),
        loadOnProcessTypeChange: jest.fn()
    };
});

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: jest.fn().mockResolvedValue({}),
        fetch: actual.fetch,
        setAuraFetch: actual.setAuraFetch,
        setAuraGetCallback: actual.setAuraGetCallback
    };
});

jest.mock('builder_platform_interaction/drawingLib', () => require('builder_platform_interaction_mocks/drawingLib'));

jest.mock('builder_platform_interaction/loggingUtils', () => ({
    setAppName: jest.fn(),
    logPerfMarkStart: jest.fn(),
    logPerfTransactionStart: jest.fn(),
    logPerfTransactionEnd: jest.fn(),
    logPerfMarkEnd: jest.fn()
}));

jest.mock('builder_platform_interaction/keyboardInteractionUtils', () =>
    require('builder_platform_interaction_mocks/keyboardInteractionUtils')
);

describe('editorMetadata', () => {
    describe('set flowId', () => {
        test.each`
            source        | mockData
            ${'flow'}     | ${flowWithAllElements}
            ${'template'} | ${flowWithAllElements.metadata}
        `(
            'calls "loadParametersForInvocableApexActionsInFlowFromMetadata" with action calls from $source',
            async ({ mockData }) => {
                initializeAuraFetch({
                    'c.retrieveFlow': () => ({
                        data: mockData
                    })
                });
                createComponentUnderTest({
                    flowId: '301RM0000000E4N'
                });
                await ticks(20);
                expect(loadParametersForInvocableApexActionsInFlowFromMetadata).toHaveBeenCalledWith(
                    (mockData.metadata || mockData).actionCalls
                );
            }
        );
    });
});
