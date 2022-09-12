// @ts-nocheck
import ActionAndParameters from 'builder_platform_interaction/actionAndParameters';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { ValueChangedEvent } from 'builder_platform_interaction/events';
import { ACTION_TYPE } from 'builder_platform_interaction/flowMetadata';
import { openFlow } from 'builder_platform_interaction/inlineOpenFlowUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import { invocableActionsForOrchestrator } from 'serverData/GetAllInvocableActionsForType/invocableActionsForOrchestrator.json';
import { flowIds } from 'serverData/GetFlowIds/flowIds.json';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/inlineOpenFlowUtils', () => {
    return {
        openFlow: jest.fn(),
        getFlowIdsForNames: jest.fn(() => {
            return mockFlowIdsPromise;
        })
    };
});

const mockFlowIdsPromise = Promise.resolve(flowIds);

const createComponentUnderTest = (element = {}) => {
    let el = createElement('builder_platform_interaction-action-and-parameters', {
        is: ActionAndParameters
    });

    el = Object.assign(
        el,
        {
            processType: 'someProcessType',
            availableActions: invocableActionsForOrchestrator
        },
        element
    );
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    ACTION_SELECTOR: 'builder_platform_interaction-action-selector',
    PARAMETER_LIST: 'builder_platform_interaction-parameter-list',
    OPEN_FLOW_SELECTOR: '.open-flow',
    REQUIRE_ASYNC_CHECKBOX: 'lightning-input'
};

describe('ActionAndParameters', () => {
    beforeAll(() => {
        Store.setMockState({
            properties: {},
            elements: {}
        });
    });

    describe('input parameters', () => {
        it('are shown when a valid action and parameters are present', () => {
            const withAction = {
                selectedAction: {
                    actionName: 'ScreenFlow',
                    actionType: ACTION_TYPE.STEP_INTERACTIVE
                },
                actionParameterListConfig: {
                    inputs: [{ rowIndex: 1 }],
                    warnings: []
                }
            };

            const editor = createComponentUnderTest(withAction);

            const parameterList = editor.shadowRoot.querySelector(selectors.PARAMETER_LIST);
            expect(parameterList).not.toBeNull();
        });
        it('are not shown if no action is present', () => {
            const editor = createComponentUnderTest();

            const parameterList = editor.shadowRoot.querySelector(selectors.PARAMETER_LIST);
            expect(parameterList).toBeNull();
        });
        it('are not shown if either action name or type is missing', () => {
            const noActionNameAndType = {
                selectedAction: {
                    actionName: undefined,
                    actionType: undefined
                }
            };

            const editor = createComponentUnderTest(noActionNameAndType);

            const parameterList = editor.shadowRoot.querySelector(selectors.PARAMETER_LIST);
            expect(parameterList).toBeNull();
        });
    });

    describe('inline open flow', () => {
        let editor;
        const mockFlowName = invocableActionsForOrchestrator[0].name;
        beforeEach(() => {
            editor = createComponentUnderTest({
                selectedAction: {
                    actionName: mockFlowName,
                    actionType: ACTION_TYPE.STEP_INTERACTIVE
                },
                actionErrorMessage: null
            });
        });
        it('show open flow button when a flow is selected', () => {
            const openFlowButton = editor.shadowRoot.querySelector(selectors.OPEN_FLOW_SELECTOR);
            expect(openFlowButton).not.toBeNull();
        });
        it('do not show open flow button when a flow is not selected', () => {
            editor = createComponentUnderTest({
                actionName: undefined
            });
            const openFlowButton = editor.shadowRoot.querySelector(selectors.OPEN_FLOW_SELECTOR);
            expect(openFlowButton).toBeNull();
        });
        it('openFlow is called when click on Open Flow button', () => {
            editor.shadowRoot.querySelector(selectors.OPEN_FLOW_SELECTOR).click();
            // verify openFlow is called with the flow name
            expect(openFlow).toHaveBeenCalledWith(flowIds[mockFlowName]);
        });
    });

    it('action selected dispatches OrchestrationActionValueChangedEvent', () => {
        const editor = createComponentUnderTest();
        const mockHandler = jest.fn();
        editor.addEventListener('orchestrationactionvaluechanged', mockHandler);
        const newAction = {
            actionName: 'foo'
        };
        const error = 'error';
        const e = new ValueChangedEvent(newAction, error);
        editor.shadowRoot.querySelector(selectors.ACTION_SELECTOR).dispatchEvent(e);

        // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
        // Until then use the more brittle `.mocks`
        expect(mockHandler.mock.calls[0][0].detail).toEqual({
            actionCategory: null,
            value: newAction,
            error
        });
    });

    it('external callouts required dispatches RequiresAsyncProcessingChangedEvent', () => {
        const editor = createComponentUnderTest({
            showExternalCalloutsCheckbox: true
        });
        const mockHandler = jest.fn();
        editor.addEventListener('requiresasyncprocessingchanged', mockHandler);
        editor.shadowRoot.querySelector(selectors.REQUIRE_ASYNC_CHECKBOX).dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    checked: true
                }
            })
        );

        // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
        // Until then use the more brittle `.mocks`
        expect(mockHandler.mock.calls[0][0].detail).toEqual({
            checked: true
        });

        editor.shadowRoot.querySelector(selectors.REQUIRE_ASYNC_CHECKBOX).dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    checked: false
                }
            })
        );

        // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
        // Until then use the more brittle `.mocks`
        expect(mockHandler.mock.calls[1][0].detail).toEqual({
            checked: false
        });
    });
});
