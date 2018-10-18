import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import ApexPluginEditor from "../apexPluginEditor";
import { mockApexPluginParameters, mockApexPlugins } from "mock/calloutData";

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

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-apex-plugin-editor', { is: ApexPluginEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    baseCalloutEditor: 'builder_platform_interaction-base-callout-editor',
};

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce : (serverActionType) => {
            switch (serverActionType) {
            case SERVER_ACTION_TYPE.GET_APEX_PLUGINS:
                return Promise.resolve(mockApexPlugins);
            case SERVER_ACTION_TYPE.GET_APEX_PLUGIN_PARAMETERS:
                return Promise.resolve(mockApexPluginParameters);
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
    beforeEach(() => {
        apexPluginEditorCmp = createComponentUnderTest(defaultNode);
        baseCalloutEditorCmp = getBaseCalloutEditor(apexPluginEditorCmp);
    });
    it('should display a subtitle including the apex plugin name', () => {
        expect(baseCalloutEditorCmp.subtitle).toBe('FlowBuilderApexPluginEditor.subtitle(flow chat plugin)');
    });
    it('contains base callout editor', () => {
        expect(baseCalloutEditorCmp).not.toBeNull();
    });
});