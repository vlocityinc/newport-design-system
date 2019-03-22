import { createElement } from 'lwc';
import InvocableActionEditor from "../invocableActionEditor";
import { invocableActionValidation } from "../invocableActionValidation.js";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";

jest.mock('builder_platform_interaction/storeLib', () => {
    const getCurrentState = function () {
        return {
            properties: {
                processType: 'flow'
            },
            elements: {}
        };
    };
    const getStore = function () {
        return {
            getCurrentState
        };
    };
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
});
jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));
jest.mock('builder_platform_interaction/outputResourcePicker', () => require('builder_platform_interaction_mocks/outputResourcePicker'));

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-invocable-action-editor', { is: InvocableActionEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const validate = (node) => {
    return getErrorsFromHydratedElement(invocableActionValidation.validateAll(node));
};

describe('Invocable Action Editor Validation', () => {
    let invocableActionNode;
    beforeEach(() => {
        invocableActionNode = {
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
                        isInput: true,
                        isRequired: true,
                        dataType: 'String',
                        name: 'subjectNameOrId',
                        value: {
                          value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                          error: null
                        },
                        valueDataType: 'reference',
                      },
                      {
                          rowIndex: '84b6d19d-718f-452d-9803-fe97a263f76c',
                          isInput: true,
                          isRequired: false,
                          dataType: 'String',
                          name: 'text',
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
                        isInput: false,
                        isRequired: false,
                        dataType: 'String',
                        name: 'feedItemId',
                        value: {
                          value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                          error: null
                        },
                        valueDataType: 'reference',
                    }
                ]
        };
    });
    describe('node is valid', () => {
        it('returns no errors', () => {
            const invocableActionEditor = createComponentForTest(invocableActionNode);
            const errors = validate(invocableActionEditor.node);
            expect(errors).toHaveLength(0);
        });
    });
    describe('no label', () => {
        it('should return an error', () => {
            invocableActionNode.label.value = '';
            const invocableActionEditor = createComponentForTest(invocableActionNode);
            const errors = validate(invocableActionEditor.node);
            expect(errors).toEqual([{"errorString": "FlowBuilderValidation.cannotBeBlank", "key": "label"}]);
        });
    });
    describe('no apiName', () => {
        it('should return an error', () => {
            invocableActionNode.name.value = '';
            const invocableActionEditor = createComponentForTest(invocableActionNode);
            const errors = validate(invocableActionEditor.node);
            expect(errors).toEqual([{"errorString": "FlowBuilderValidation.cannotBeBlank", "key": "name"}]);
        });
    });
    describe('required input parameter is not valid', () => {
        it('should return an error if subjectNameOrId is null', () => {
            invocableActionNode.inputParameters[0].value.value = null;
            const invocableActionEditor = createComponentForTest(invocableActionNode);
            const errors = validate(invocableActionEditor.node);
            expect(errors).toEqual([{"errorString": "FlowBuilderValidation.cannotBeBlank", "key": "value"}]);
        });
        it('should return an error if subjectNameOrId is blank', () => {
            invocableActionNode.inputParameters[0].value.value = '';
            const invocableActionEditor = createComponentForTest(invocableActionNode);
            const errors = validate(invocableActionEditor.node);
            expect(errors).toEqual([{"errorString": "FlowBuilderValidation.cannotBeBlank", "key": "value"}]);
        });
    });
});