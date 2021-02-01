import { createElement } from 'lwc';
import Editor from '../editor';
import { loadParametersForInvocableApexActionsInFlowFromMetadata } from 'builder_platform_interaction/preloadLib';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { initializeAuraFetch } from '../../integrationTests/__tests__/serverDataTestUtils';

jest.mock('builder_platform_interaction/flcBuilder', () => require('builder_platform_interaction_mocks/flcBuilder'));

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-editor', {
        is: Editor
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

jest.mock('builder_platform_interaction/preloadLib', () => {
    return {
        loadParametersForInvocableApexActionsInFlowFromMetadata: jest.fn().mockResolvedValue({}),
        loadFieldsForExtensionsInFlowFromMetadata: jest.fn().mockResolvedValue({}),
        loadFieldsForComplexTypesInFlow: jest.fn(),
        initializeLoader: jest.fn(),
        loadOnStart: jest.fn().mockResolvedValue({}),
        loadOnProcessTypeChange: jest.fn().mockImplementation(() => {
            return {
                loadActionsPromise: Promise.resolve({}),
                loadPeripheralMetadataPromise: Promise.resolve({}),
                loadPalettePromise: Promise.resolve({})
            };
        }),
        loadAllSupportedFeatures: jest.fn().mockResolvedValue({}),
        loadApexClasses: jest.fn().mockResolvedValue({}),
        loadVersioningData: jest.fn().mockResolvedValue({})
    };
});

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
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

jest.mock('builder_platform_interaction/screenFieldTypeLib', () => {
    return {
        setSupportedScreenFieldTypes: jest.fn()
    };
});

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
