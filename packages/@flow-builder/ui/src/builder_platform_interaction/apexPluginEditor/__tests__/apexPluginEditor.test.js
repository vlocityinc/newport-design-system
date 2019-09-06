import { createElement } from 'lwc';
import ApexPluginEditor from '../apexPluginEditor';
import { mockApexPluginParameters, mockApexPlugins } from 'mock/calloutData';
import {
    ClosePropertyEditorEvent,
    CannotRetrieveCalloutParametersEvent,
    SetPropertyEditorTitleEvent
} from 'builder_platform_interaction/events';
import {
    untilNoFailure,
    ticks
} from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/baseCalloutEditor', () =>
    require('builder_platform_interaction_mocks/baseCalloutEditor')
);

jest.mock('builder_platform_interaction/storeLib', () => {
    function getCurrentState() {
        return {
            properties: {
                processType: 'flow'
            },
            elements: {}
        };
    }
    function getStore() {
        return {
            getCurrentState
        };
    }
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
});

const commonUtils = require.requireActual('../../commonUtils/commonUtils.js');
commonUtils.format = jest
    .fn()
    .mockImplementation(
        (formatString, ...args) => formatString + '(' + args.toString() + ')'
    );

const defaultNode = {
    apexClass: { value: 'flowchat', error: null },
    description: { value: '', error: null },
    elementType: 'APEX_PLUGIN_CALL',
    guid: '6b35c757-1d0f-442e-acb6-6ac8f098ea1f',
    isCanvasElemen: true,
    label: { value: 'flowchat', error: null },
    locationX: 5,
    locationY: 165,
    name: { value: 'flowchat', error: null },
    inputParameters: [
        {
            rowIndex: '2067b573-86d6-4bd7-b906-8fc01a7e889a',
            isInput: true,
            isRequired: true,
            dataType: 'String',
            name: 'Name',
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        },
        {
            rowIndex: 'd58427c8-7db3-458c-b698-a2de1ed3f2f0',
            isInput: true,
            isRequired: true,
            dataType: 'String',
            name: 'Phone',
            value: {
                value: '0123456789',
                error: null
            },
            valueDataType: 'String'
        }
    ],
    outputParameters: [
        {
            rowIndex: '41d02758-f34f-4207-9bf2-42e2c9930100',
            isInput: false,
            isRequired: false,
            dataType: 'String',
            name: 'AccountId',
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        }
    ],
    storeOutputAutomatically: false,
    automaticOutputHandlingSupported: false
};

const createComponentUnderTest = (node, { isNewMode = false } = {}) => {
    const el = createElement(
        'builder_platform_interaction-apex-plugin-editor',
        { is: ApexPluginEditor }
    );
    Object.assign(el, { node, isNewMode });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    baseCalloutEditor: 'builder_platform_interaction-base-callout-editor'
};

let mockApexPluginParametersPromise = Promise.resolve(mockApexPluginParameters);
let mockApexPluginsPromise = Promise.resolve(mockApexPlugins);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual(
        '../../serverDataLib/serverDataLib.js'
    );
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: serverActionType => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_APEX_PLUGINS:
                    return mockApexPluginsPromise;
                case SERVER_ACTION_TYPE.GET_APEX_PLUGIN_PARAMETERS:
                    return mockApexPluginParametersPromise;
                default:
                    return Promise.reject();
            }
        }
    };
});

const getBaseCalloutEditor = apexPluginEditor => {
    return apexPluginEditor.shadowRoot.querySelector(
        selectors.baseCalloutEditor
    );
};

describe('Apex Plugin editor', () => {
    afterEach(() => {
        mockApexPluginParametersPromise = Promise.resolve(
            mockApexPluginParameters
        );
        mockApexPluginsPromise = Promise.resolve(mockApexPlugins);
    });
    it('should display a subtitle including the apex plugin name', async () => {
        const apexPluginEditorCmp = createComponentUnderTest(defaultNode);
        const baseCalloutEditorCmp = getBaseCalloutEditor(apexPluginEditorCmp);
        await mockApexPluginsPromise;
        await mockApexPluginParametersPromise;
        expect(baseCalloutEditorCmp.subtitle).toBe(
            'FlowBuilderApexPluginEditor.subtitle(flow chat plugin,FlowBuilderApexPluginEditor.apexPluginTypeLabel)'
        );
    });
    it('contains base callout editor', () => {
        const apexPluginEditorCmp = createComponentUnderTest(defaultNode);
        const baseCalloutEditorCmp = getBaseCalloutEditor(apexPluginEditorCmp);
        expect(baseCalloutEditorCmp).not.toBeNull();
    });
    it('should display a subtitle using unique name if call to GET_APEX_PLUGINS failed', async () => {
        mockApexPluginsPromise = Promise.reject();
        const apexPluginEditorCmp = createComponentUnderTest(defaultNode, {
            isNewMode: false
        });
        const baseCalloutEditorCmp = getBaseCalloutEditor(apexPluginEditorCmp);
        await mockApexPluginsPromise.catch(() => {
            expect(baseCalloutEditorCmp.subtitle).toBe(
                'FlowBuilderApexPluginEditor.subtitle(flowchat,FlowBuilderApexPluginEditor.apexPluginTypeLabel)'
            );
        });
    });
    describe('Edit existing apex plugin', () => {
        it('should dispatch a ClosePropertyEditorEvent if call to GET_APEX_PLUGIN_PARAMETERS failed', async () => {
            mockApexPluginParametersPromise = Promise.reject();
            createComponentUnderTest(defaultNode, { isNewMode: false });
            const eventCallback = jest.fn();
            document.addEventListener(
                ClosePropertyEditorEvent.EVENT_NAME,
                eventCallback
            );
            await mockApexPluginsPromise;
            await mockApexPluginParametersPromise.catch(() => {
                document.removeEventListener(
                    ClosePropertyEditorEvent.EVENT_NAME,
                    eventCallback
                );
                expect(eventCallback).toHaveBeenCalled();
            });
        });
        it('should dispatch a SetPropertyEditorTitleEvent with a title containing the apex plugin label', async () => {
            const eventCallback = jest.fn();
            document.addEventListener(
                SetPropertyEditorTitleEvent.EVENT_NAME,
                eventCallback
            );
            createComponentUnderTest(defaultNode, { isNewMode: false });
            await untilNoFailure(() => {
                expect(eventCallback).toHaveBeenCalledTimes(2);
                expect(eventCallback.mock.calls[0][0].detail.title).toBe(
                    'FlowBuilderApexPluginEditor.editPropertyEditorTitle(flowchat)'
                );
                expect(eventCallback.mock.calls[1][0].detail.title).toBe(
                    'FlowBuilderApexPluginEditor.editPropertyEditorTitle(flow chat plugin)'
                );
            });
        });
        it('should dispatch a SetPropertyEditorTitleEvent with a title containing the apex plugin unique name if we cannot get the apex plugin label', async () => {
            mockApexPluginsPromise = Promise.reject();
            const eventCallback = jest.fn();
            document.addEventListener(
                SetPropertyEditorTitleEvent.EVENT_NAME,
                eventCallback
            );
            createComponentUnderTest(defaultNode, { isNewMode: false });
            await ticks(10);
            expect(eventCallback).toHaveBeenCalledTimes(1);
            expect(eventCallback.mock.calls[0][0].detail.title).toBe(
                'FlowBuilderApexPluginEditor.editPropertyEditorTitle(flowchat)'
            );
        });
    });
    describe('New apex plugin node', () => {
        it('should dispatch a CannotRetrieveCalloutParametersEvent if call to GET_APEX_PLUGIN_PARAMETERS failed', async () => {
            mockApexPluginParametersPromise = Promise.reject();
            createComponentUnderTest(defaultNode, { isNewMode: true });
            const eventCallback = jest.fn();
            document.addEventListener(
                CannotRetrieveCalloutParametersEvent.EVENT_NAME,
                eventCallback
            );
            await mockApexPluginsPromise;
            await mockApexPluginParametersPromise.catch(() => {
                document.removeEventListener(
                    CannotRetrieveCalloutParametersEvent.EVENT_NAME,
                    eventCallback
                );
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });
});
