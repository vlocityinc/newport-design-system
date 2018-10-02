import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import InvocableActionEditor from "../invocableActionEditor";
import { mockActionParameters } from "mock/actionSelectorData";

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
                valueGuid:'578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
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
                  valueGuid: 'This is a message',
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
                valueGuid:'578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
            }
        ]
    };

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-invocable-action-editor', { is: InvocableActionEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    baseCalloutEditor: 'builder_platform_interaction-base-callout-editor',
    labelDescription: 'builder_platform_interaction-label-description',
    lightningTab: 'lightning-tab',
    inputParameterItems: '#tabitem-inputs builder_platform_interaction-parameter-item',
    outputParameterItems: '#tabitem-outputs builder_platform_interaction-parameter-item',
};

let mockActionParametersPromise = Promise.resolve(mockActionParameters);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce : (serverActionType) => {
            if (serverActionType === SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS) {
                return mockActionParametersPromise;
            }
            return Promise.reject();
        }
    };
});

const getBaseCalloutEditor = (actionEditor) => {
    return getShadowRoot(actionEditor).querySelector(selectors.baseCalloutEditor);
};

const getLabelDescription = (baseCalloutEditor) => {
    return getShadowRoot(baseCalloutEditor).querySelector(selectors.labelDescription);
};

const getLightningTabs = (baseCalloutEditor) => {
    return getShadowRoot(baseCalloutEditor).querySelectorAll(selectors.lightningTab);
};

const getInputParameterItems = (baseCalloutEditor) => {
    return getShadowRoot(baseCalloutEditor).querySelectorAll(selectors.inputParameterItems);
};

const getOutputParameterItems = (baseCalloutEditor) => {
    return getShadowRoot(baseCalloutEditor).querySelectorAll(selectors.outputParameterItems);
};

describe('Invocable Action editor', () => {
    let actionEditorCmp, baseCalloutEditorCmp;
    beforeEach(() => {
        actionEditorCmp = createComponentUnderTest(defaultNode);
        baseCalloutEditorCmp = getBaseCalloutEditor(actionEditorCmp);
    });
    afterEach(() => {
        mockActionParametersPromise = Promise.resolve(mockActionParameters);
    });
    it('contains base callout editor', () => {
        expect(getBaseCalloutEditor(actionEditorCmp)).not.toBeNull();
    });
    it('contains label description with values', () => {
        const labelDescription = getLabelDescription(baseCalloutEditorCmp);
        expect(labelDescription.label.value).toEqual(defaultNode.label.value);
        expect(labelDescription.devName.value).toEqual(defaultNode.name.value);
        expect(labelDescription.description.value).toEqual(defaultNode.description.value);
    });
    it('contains 2 tabs', () => {
        const lightningTabs = getLightningTabs(baseCalloutEditorCmp);
        expect(lightningTabs).toHaveLength(2);
    });
    it('contains input parameters in input tab', () => {
        const parameterItems = getInputParameterItems(baseCalloutEditorCmp);
        expect(parameterItems).toHaveLength(mockActionParameters.filter(parameter => parameter.isInput === true).length);
    });
    it('contain output parameters in output tab', () => {
        const parameterItems = getOutputParameterItems(baseCalloutEditorCmp);
        expect(parameterItems).toHaveLength(mockActionParameters.filter(parameter => parameter.isOutput === true).length);
    });
});