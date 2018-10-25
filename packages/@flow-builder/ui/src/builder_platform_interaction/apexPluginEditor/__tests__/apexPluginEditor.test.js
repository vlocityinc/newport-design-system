import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import ApexPluginEditor from "../apexPluginEditor";
import { mockApexPluginParameters, mockApexPlugins } from "mock/calloutData";
import { ClosePropertyEditorEvent, CannotRetrieveCalloutParametersEvent } from 'builder_platform_interaction/events';

const defaultNode = {
        apexClass: {value: 'flowchat', error: null},
        description : {value: '', error: null},
        elementType : 'APEX_PLUGIN_CALL',
        guid : '6b35c757-1d0f-442e-acb6-6ac8f098ea1f',
        isCanvasElemen : true,
        label : {value: 'flowchat', error: null},
        locationX : 5,
        locationY : 165,
        name : {value: 'flowchat', error: null},
        inputParameters : [
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
                valueDataType: 'reference',
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
                  valueDataType: 'String',
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
                valueDataType: 'reference',
            }
        ]
};

const commonUtils = require.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest.fn().mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

const createComponentUnderTest = (node, { isNewMode = false} = {}) => {
    const el = createElement('builder_platform_interaction-apex-plugin-editor', { is: ApexPluginEditor });
    Object.assign(el, {node, isNewMode});
    document.body.appendChild(el);
    return el;
};

const selectors = {
    baseCalloutEditor: 'builder_platform_interaction-base-callout-editor',
};

let mockApexPluginParametersPromise = Promise.resolve(mockApexPluginParameters);
let mockApexPluginsPromise = Promise.resolve(mockApexPlugins);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce : (serverActionType) => {
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

const getBaseCalloutEditor = (apexPluginEditor) => {
    return getShadowRoot(apexPluginEditor).querySelector(selectors.baseCalloutEditor);
};

describe('Apex Plugin editor', () => {
    let apexPluginEditorCmp, baseCalloutEditorCmp;
    afterEach(() => {
        mockApexPluginParametersPromise = Promise.resolve(mockApexPluginParameters);
        mockApexPluginsPromise = Promise.resolve(mockApexPlugins);
    });
    it('should display a subtitle including the apex plugin name', async () => {
        apexPluginEditorCmp = createComponentUnderTest(defaultNode);
        baseCalloutEditorCmp = getBaseCalloutEditor(apexPluginEditorCmp);
        await Promise.resolve();
        expect(baseCalloutEditorCmp.subtitle).toBe('FlowBuilderApexPluginEditor.subtitle(flow chat plugin)');
    });
    it('contains base callout editor', () => {
        apexPluginEditorCmp = createComponentUnderTest(defaultNode);
        baseCalloutEditorCmp = getBaseCalloutEditor(apexPluginEditorCmp);
        expect(baseCalloutEditorCmp).not.toBeNull();
    });
    it('should not display a subtitle if call to GET_APEX_PLUGINS failed', async () => {
        mockApexPluginsPromise = Promise.reject();
        apexPluginEditorCmp = createComponentUnderTest(defaultNode, {isNewMode:false});
        baseCalloutEditorCmp = getBaseCalloutEditor(apexPluginEditorCmp);
        await Promise.resolve();
        expect(baseCalloutEditorCmp.subtitle).toBe('');
    });
    describe('Edit existing apex plugin', () => {
        it('should dispatch a ClosePropertyEditorEvent if call to GET_APEX_PLUGIN_PARAMETERS failed', async () => {
            mockApexPluginParametersPromise = Promise.reject();
            apexPluginEditorCmp = createComponentUnderTest(defaultNode, {isNewMode:false});
            const eventCallback = jest.fn();
            document.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);
            await Promise.resolve();
            document.removeEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);
            expect(eventCallback).toHaveBeenCalled();
        });
    });
    describe('New apex plugin node', () => {
        it('should dispatch a CannotRetrieveCalloutParametersEvent if call to GET_APEX_PLUGIN_PARAMETERS failed', async () => {
            mockApexPluginParametersPromise = Promise.reject();
            apexPluginEditorCmp = createComponentUnderTest(defaultNode, {isNewMode:true});
            const eventCallback = jest.fn();
            document.addEventListener(CannotRetrieveCalloutParametersEvent.EVENT_NAME, eventCallback);
            await Promise.resolve();
            document.removeEventListener(CannotRetrieveCalloutParametersEvent.EVENT_NAME, eventCallback);
            expect(eventCallback).toHaveBeenCalled();
        });
    });
});