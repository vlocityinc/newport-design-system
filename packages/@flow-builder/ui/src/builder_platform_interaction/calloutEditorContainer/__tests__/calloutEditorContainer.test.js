import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import CalloutEditorContainer from "../calloutEditorContainer";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { getElementForPropertyEditor } from "builder_platform_interaction/propertyEditorFactory";

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-callout-editor-container', {
        is: CalloutEditorContainer,
    });
    if (props) {
        Object.assign(element, props);
    }
    document.body.appendChild(element);
    return element;
};

const EDITOR_SELECTOR = '.editor_template';
const NO_ACTION_TEMPLATE_SELECTOR = 'builder_platform_interaction-gone-camping';

const mockSelectedAction = {
    actionName: 'chatterPost',
    actionType: 'chatterPost',
    elementType : ELEMENT_TYPE.ACTION_CALL
};

const invocableActionNode = {
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

jest.mock('builder_platform_interaction/propertyEditorFactory', () => {
    return {
        getElementForPropertyEditor: jest.fn().mockImplementation((node) => node),
    };
});

describe('callout-editor-container', () => {
    describe('When there is no selected action', () => {
        let container;
        beforeEach(() => {
            container = setupComponentUnderTest();
        });
        it('should have an empty template', () => {
            const innerEditor = getShadowRoot(container).querySelector(NO_ACTION_TEMPLATE_SELECTOR);
            expect(innerEditor).not.toBeNull();
        });
        it('should not have an inner node element without selected action', () => {
            const innerNode = container.getNode();
            expect(innerNode).toBeUndefined();
        });
    });
    describe('When an action is selected', () => {
        let container;
        beforeEach(() => {
            getElementForPropertyEditor.mockReturnValue(invocableActionNode);
            container = setupComponentUnderTest({selectedAction: mockSelectedAction, hasActions: { value: true}});
        });
        it('should accept the selected action', () => {
            expect(container.selectedAction).toEqual(mockSelectedAction);
        });

        it('should create inner editor', () => {
            const innerEditor = getShadowRoot(container).querySelector(EDITOR_SELECTOR);
            expect(innerEditor.getNode()).toEqual(invocableActionNode);
        });

        it('should call validate on the inner editor', () => {
            const innerEditor = getShadowRoot(container).querySelector(EDITOR_SELECTOR);
            innerEditor.validate = jest.fn();
            container.validate();
            expect(innerEditor.validate).toHaveBeenCalledTimes(1);
        });
    });
});