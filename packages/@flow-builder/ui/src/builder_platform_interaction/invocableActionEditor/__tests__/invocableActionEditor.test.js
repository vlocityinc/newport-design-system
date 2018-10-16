import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import InvocableActionEditor from "../invocableActionEditor";
import { mockActionParameters, mockActions } from "mock/calloutData";

const defaultNode = {
        actionName: {value: 'chatterPost', error: null},
        actionType: {value: 'chatterPost', error: null},
        description : {value: 'This is a description', error: null},
        elementType : 'ACTION_CALL',
        guid : '66b95c2c-468d-466b-baaf-5ad964be585e',
        isCanvasElemen : true,
        label : {value: 'Post to Chatter', error: null},
        locationX : 358,
        locationY : 227,
        name : {value: 'Post_to_Chatter', error: null},
        inputParameters : [
            {
                rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
                name: {
                  value: 'subjectNameOrId',
                  error: null
                },
                value: {
                  value: 'textVar',
                  error: null
                },
                valueDataType: 'reference',
              },
              {
                  rowIndex: '84b6d19d-718f-452d-9803-fe97a263f76c',
                  name: {
                    value: 'text',
                    error: null
                  },
                  value: {
                    value: 'This is a message',
                    error: null
                  },
                  valueDataType: 'String',
              }
        ],
        outputParameters: [
            {
                rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
                name: {
                  value: 'feedItemId',
                  error: null
                },
                value: {
                  value: 'textVar',
                  error: null
                },
                valueDataType: 'reference',
            }
        ]
    };

const commonUtils = require.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest.fn().mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-invocable-action-editor', { is: InvocableActionEditor });
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
            case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS:
                return Promise.resolve(mockActions);
            case SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS:
                return Promise.resolve(mockActionParameters);
            default:
                return Promise.reject();
            }
        }
    };
});

const getBaseCalloutEditor = (actionEditor) => {
    return getShadowRoot(actionEditor).querySelector(selectors.baseCalloutEditor);
};

describe('Invocable Action editor', () => {
    let actionEditorCmp, baseCalloutEditorCmp;
    beforeEach(() => {
        actionEditorCmp = createComponentUnderTest(defaultNode);
        baseCalloutEditorCmp = getBaseCalloutEditor(actionEditorCmp);
    });
    it('should display a subtitle including the action call label', () => {
        expect(baseCalloutEditorCmp.subtitle).toBe('FlowBuilderInvocableActionEditor.subtitle(Post to Chatter)');
    });
    it('contains base callout editor', () => {
        expect(baseCalloutEditorCmp).not.toBeNull();
    });
});