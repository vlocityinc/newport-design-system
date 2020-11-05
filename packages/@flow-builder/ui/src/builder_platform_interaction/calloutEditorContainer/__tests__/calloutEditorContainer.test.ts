// @ts-nocheck
import { createElement } from 'lwc';
import CalloutEditorContainer from '../calloutEditorContainer';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/translatorLib', () => ({
    translateUIModelToFlow: jest.fn(),
    swapUidsForDevNames: jest.fn()
}));

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

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-callout-editor-container', {
        is: CalloutEditorContainer
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
    elementType: ELEMENT_TYPE.ACTION_CALL
};

const mockSelectedSubflow = {
    flowName: 'mySubFlow',
    elementType: ELEMENT_TYPE.SUBFLOW
};

describe('callout-editor-container', () => {
    describe('When there is no selected action', () => {
        let container;
        beforeEach(() => {
            container = setupComponentUnderTest();
        });
        it('should have an empty template', () => {
            const innerEditor = container.shadowRoot.querySelector(NO_ACTION_TEMPLATE_SELECTOR);
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
            container = setupComponentUnderTest({
                selectedAction: mockSelectedAction,
                location: { locationX: 100, locationY: 100 },
                hasActions: { value: true }
            });
        });
        it('should accept the selected action', () => {
            expect(container.selectedAction).toEqual(mockSelectedAction);
        });

        it('should create inner editor', () => {
            const innerEditor = container.shadowRoot.querySelector(EDITOR_SELECTOR);
            const node = innerEditor.getNode();
            expect(node.actionName).toEqual(mockSelectedAction.actionName);
            expect(node.actionType).toEqual(mockSelectedAction.actionType);
            expect(node.elementType).toEqual(mockSelectedAction.elementType);
        });

        it('should call validate on the inner editor', () => {
            const innerEditor = container.shadowRoot.querySelector(EDITOR_SELECTOR);
            innerEditor.validate = jest.fn();
            container.validate();
            expect(innerEditor.validate).toHaveBeenCalledTimes(1);
        });

        it('should be at location(100, 100)', () => {
            const innerEditor = container.shadowRoot.querySelector(EDITOR_SELECTOR);
            const node = innerEditor.getNode();
            expect(node.locationX).toEqual(100);
            expect(node.locationY).toEqual(100);
        });
        it('should preserve name, label, description when changing the referenced action', async () => {
            const innerEditor = container.shadowRoot.querySelector(EDITOR_SELECTOR);
            // set name, label, description
            const testNode = Object.assign({}, innerEditor.node, {
                name: { value: 'test name', error: null },
                label: { value: 'test label', error: null },
                description: { value: 'test description', error: null }
            });
            innerEditor.node = testNode;
            await Promise.resolve();
            const taskSelectedAction = {
                actionName: 'Task.UpdateStatus',
                actionType: 'quickAction',
                elementType: ELEMENT_TYPE.ACTION_CALL
            };
            container.selectedAction = taskSelectedAction;
            await Promise.resolve();
            const innerNode = innerEditor.getNode();
            expect(innerNode.name.value).toEqual('test name');
            expect(innerNode.label.value).toEqual('test label');
            expect(innerNode.description.value).toEqual('test description');
        });
        it('should preserve guid if selected action has guid associated with it', async () => {
            expect.assertions(1);
            const innerEditor = container.shadowRoot.querySelector(EDITOR_SELECTOR);
            const taskSelectedAction = {
                actionName: 'Task.UpdateStatus',
                actionType: 'quickAction',
                elementType: ELEMENT_TYPE.ACTION_CALL,
                guid: '5'
            };
            container.selectedAction = taskSelectedAction;
            await ticks(1);
            const innerNode = innerEditor.getNode();
            expect(innerNode.guid).toEqual('5');
        });
        it('when field level commit is enabled, all parameters should be preserved when changing fields', async () => {
            expect.assertions(1);
            container.editorParams = { panelConfig: { isFieldLevelCommitEnabled: true } };

            await ticks(1);

            const innerEditor = container.shadowRoot.querySelector(EDITOR_SELECTOR);
            let testNode = Object.assign({}, innerEditor.node, {
                name: { value: 'test name', error: null },
                label: { value: 'test label', error: null },
                description: { value: 'test description', error: null },
                inputParameters: [
                    {
                        rowIndex: '2eecf67b-f8eb-4fc8-bde0-1fa0fc0a21fb',
                        value: { value: 'test value', error: null },
                        name: 'cartId',
                        isRequired: true,
                        maxOccurs: 1,
                        label: 'Cart Id',
                        dataType: 'String',
                        subtype: null,
                        valueDataType: 'String'
                    }
                ]
            });
            innerEditor.node = testNode;
            await ticks(1);
            const activateOrderSelectedAction = {
                actionName: 'activateOrderAction',
                actionType: 'activateOrderAction',
                elementType: ELEMENT_TYPE.ACTION_CALL,
                guid: '5'
            };

            testNode = Object.assign({}, testNode, activateOrderSelectedAction);

            container.selectedAction = activateOrderSelectedAction;
            await ticks(1);
            const innerNode = innerEditor.getNode();
            expect(innerNode).toEqual(expect.objectContaining(testNode));
        });
    });
    describe('When a subflow is selected', () => {
        let container;
        beforeEach(() => {
            container = setupComponentUnderTest({
                selectedAction: mockSelectedSubflow,
                location: { locationX: 100, locationY: 100 },
                hasActions: { value: true },
                processType: FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW
            });
        });
        it('should accept the selected subflow', () => {
            expect(container.selectedAction).toEqual(mockSelectedSubflow);
        });
        it('should create inner editor for subflow', () => {
            const innerEditor = container.shadowRoot.querySelector(EDITOR_SELECTOR);
            const node = innerEditor.getNode();
            expect(node.flowName).toEqual(mockSelectedSubflow.flowName);
            expect(node.elementType).toEqual(mockSelectedSubflow.elementType);
            expect(innerEditor.processType).toEqual(FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW);
        });
    });
});
