import { createElement } from 'lwc';
import CalloutEditor from '../calloutEditor';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { CannotRetrieveCalloutParametersEvent, ActionsLoadedEvent } from 'builder_platform_interaction/events';
import { untilNoFailure, ticks } from 'builder_platform_interaction/builderTestUtils';
import { mockActions } from 'mock/calloutData';
import { LABELS } from '../calloutEditorLabels';

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: () => {
            return Promise.resolve(mockActions);
        }
    };
});

jest.mock('builder_platform_interaction/calloutEditorContainer', () =>
    require('builder_platform_interaction_mocks/calloutEditorContainer')
);

const setupComponentUnderTest = ({ node = { elementType: ELEMENT_TYPE.ACTION_CALL }, processType = 'Flow' } = {}) => {
    const element = createElement('builder_platform_interaction-callout-editor', {
        is: CalloutEditor
    });
    Object.assign(element, { node, processType });
    document.body.appendChild(element);
    return element;
};

const selectors = {
    CONTAINER: 'builder_platform_interaction-callout-editor-container',
    ACTION_SELECTOR: 'builder_platform_interaction-action-selector',
    FILTER_BY_COMBO: 'lightning-combobox',
    ACTION_CATEGORIES: 'lightning-vertical-navigation'
};

const mockSelectedAction = {
    actionName: 'chatterPost',
    actionType: 'chatterPost',
    elementType: ELEMENT_TYPE.ACTION_CALL
};

const mockSelectedApex = {
    apexClass: 'flowChat',
    elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL
};

const mockSelectedSubflow = {
    flowName: 'myFlow',
    elementType: ELEMENT_TYPE.SUBFLOW
};

const dispatchValueChangeEvent = (component, value, error = null) => {
    const changeEvent = new CustomEvent('valuechanged', {
        detail: {
            value,
            error
        }
    });
    component.dispatchEvent(changeEvent);
};

const dispatchSelectedActionChangeEvent = (component, actionName, actionType) =>
    dispatchValueChangeEvent(component, {
        actionName,
        actionType,
        elementType: ELEMENT_TYPE.ACTION_CALL
    });

const dispatchSelectedApexChangeEvent = (component, apexClass) =>
    dispatchValueChangeEvent(component, {
        apexClass,
        elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL
    });

const dispatchSelectedSubflowChangeEvent = (component, flowName) =>
    dispatchValueChangeEvent(component, {
        flowName,
        elementType: ELEMENT_TYPE.SUBFLOW
    });

const getActionSelector = calloutEditor => {
    return calloutEditor.shadowRoot.querySelector(selectors.ACTION_SELECTOR);
};

const getContainer = calloutEditor => calloutEditor.shadowRoot.querySelector(selectors.CONTAINER);

const filterByCombobox = calloutEditor => calloutEditor.shadowRoot.querySelector(selectors.FILTER_BY_COMBO);

const actionCategories = calloutEditor => calloutEditor.shadowRoot.querySelector(selectors.ACTION_CATEGORIES);

describe('callout-editor', () => {
    let calloutEditor;
    beforeEach(() => {
        calloutEditor = setupComponentUnderTest();
        calloutEditor.filterBy = LABELS.filterByCategoryOption;
    });
    describe('filter by combo', () => {
        it('displays all filter options', () => {
            expect(filterByCombobox(calloutEditor).options.map(option => option.label)).toEqual([
                'FlowBuilderActionSelector.filterByCategoryOption',
                'FlowBuilderActionSelector.filterByTypeOption'
            ]);
        });
        it('displays Category option by default', () => {
            expect(filterByCombobox(calloutEditor).value).toBe('FlowBuilderActionSelector.filterByCategoryOption');
        });

        it('fires change event with Type when filterBy type is selected', async () => {
            const valueChangedEventCallback = jest.fn();
            document.addEventListener('filterByChange', valueChangedEventCallback);
            filterByCombobox(calloutEditor).dispatchEvent(
                new CustomEvent('filterByChange', {
                    cancelable: true,
                    composed: true,
                    bubbles: true,
                    detail: { value: 'Type' }
                })
            );
            await untilNoFailure(() => expect(valueChangedEventCallback).toHaveBeenCalled());
            expect(valueChangedEventCallback.mock.calls[0][0].detail).toEqual({
                value: 'Type'
            });
        });
    });

    describe('general things', () => {
        it('updates hasActions on receiving actions Loaded Event with no actions', async () => {
            const changeEvent = new ActionsLoadedEvent(mockSelectedAction.actionName, 0);
            getActionSelector(calloutEditor).dispatchEvent(changeEvent);
            await Promise.resolve();
            expect(getContainer(calloutEditor).hasActions).toEqual({
                value: false
            });
        });
        it('updates hasActions on receiving actions Loaded Event with actions', async () => {
            const changeEvent = new ActionsLoadedEvent(mockSelectedAction.actionName, 3);
            getActionSelector(calloutEditor).dispatchEvent(changeEvent);
            await Promise.resolve();
            expect(getContainer(calloutEditor).hasActions).toEqual({
                value: true
            });
        });
    });
    it('has an action-selector component', () => {
        expect(getActionSelector(calloutEditor)).not.toBeNull();
    });
    it('has a action categories navigation list', () => {
        expect(actionCategories(calloutEditor)).not.toBeNull();
    });
    it('reset the selected action if an error occurs while retrieving parameters', async () => {
        const actionSelector = getActionSelector(calloutEditor);
        actionSelector.selectedFilterBy = 'FlowBuilderActionSelector.filterByTypeOption';
        dispatchSelectedActionChangeEvent(actionSelector, mockSelectedAction.actionName, mockSelectedAction.actionType);
        await Promise.resolve();
        const container = getContainer(calloutEditor);
        expect(container.selectedAction).toEqual(mockSelectedAction);
        container.dispatchEvent(new CannotRetrieveCalloutParametersEvent());
        await Promise.resolve();
        expect(container.selectedAction).toEqual({
            elementType: ELEMENT_TYPE.ACTION_CALL
        });
    });
    describe('invocable-action', () => {
        it('has an inner callout-editor-container component that takes in the selected action', async () => {
            const actionSelector = getActionSelector(calloutEditor);
            dispatchSelectedActionChangeEvent(
                actionSelector,
                mockSelectedAction.actionName,
                mockSelectedAction.actionType
            );
            await ticks(1);
            const container = calloutEditor.shadowRoot.querySelector(selectors.CONTAINER);
            expect(container).not.toBeNull();
            expect(container.selectedAction).toEqual(mockSelectedAction);
        });
        it('calls the inner container validate method on validate', async () => {
            const actionSelector = getActionSelector(calloutEditor);
            dispatchSelectedActionChangeEvent(
                actionSelector,
                mockSelectedAction.actionName,
                mockSelectedAction.actionType
            );
            await ticks(1);
            const container = calloutEditor.shadowRoot.querySelector(selectors.CONTAINER);
            const errors = ['error'];
            container.validate.mockReturnValueOnce(errors);
            const val = calloutEditor.validate();
            expect(container.validate).toHaveBeenCalledTimes(1);
            expect(val).toEqual(errors);
        });
        it('calls the inner container getNode method on getNode', () => {
            const container = calloutEditor.shadowRoot.querySelector(selectors.CONTAINER);
            const node = {
                name: 'my node',
                elementType: ELEMENT_TYPE.ACTION_CALL
            };
            container.getNode.mockReturnValueOnce(node);
            const value = calloutEditor.getNode();
            expect(container.getNode).toHaveBeenCalledTimes(1);
            expect(value).toEqual(node);
        });
    });
    describe('apex-plugin', () => {
        it('has an inner callout-editor-container component that takes in the selected apex class', async () => {
            const actionSelector = getActionSelector(calloutEditor);
            dispatchSelectedApexChangeEvent(actionSelector, mockSelectedApex.apexClass);
            await ticks(1);
            const container = calloutEditor.shadowRoot.querySelector(selectors.CONTAINER);
            expect(container).not.toBeNull();
            expect(container.selectedAction).toEqual(mockSelectedApex);
        });
    });
    describe('subflow', () => {
        it('has an inner callout-editor-container component that takes in the selected apex class', async () => {
            const actionSelector = getActionSelector(calloutEditor);
            dispatchSelectedSubflowChangeEvent(actionSelector, mockSelectedSubflow.flowName);
            await ticks(1);
            const container = calloutEditor.shadowRoot.querySelector(selectors.CONTAINER);
            expect(container).not.toBeNull();
            expect(container.selectedAction).toEqual(mockSelectedSubflow);
        });
    });
    describe('Validation', () => {
        const mockError = 'mockError';
        it('returns an error when there is no selected action', () => {
            const errors = calloutEditor.validate();
            expect(errors).toEqual(['FlowBuilderValidation.cannotBeBlank']);
        });

        it('returns an error when typing the invalid action', async () => {
            const actionSelector = getActionSelector(calloutEditor);
            dispatchValueChangeEvent(actionSelector, { elementType: ELEMENT_TYPE.ACTION_CALL }, mockError);
            await ticks(1);
            const errors = calloutEditor.validate();
            expect(errors).toEqual([mockError]);
        });

        it('returns no error when referenced action is selected', async () => {
            const actionSelector = getActionSelector(calloutEditor);
            dispatchSelectedActionChangeEvent(
                actionSelector,
                mockSelectedAction.actionName,
                mockSelectedAction.actionType
            );
            await ticks(1);
            const container = calloutEditor.shadowRoot.querySelector(selectors.CONTAINER);
            container.validate.mockReturnValueOnce([]);
            const errors = calloutEditor.validate();
            expect(errors).toHaveLength(0);
        });

        it('returns no error when changing action type from action call to subflow', async () => {
            const actionSelector = getActionSelector(calloutEditor);
            dispatchSelectedSubflowChangeEvent(actionSelector, mockSelectedSubflow.flowName);
            await ticks(1);
            const container = calloutEditor.shadowRoot.querySelector(selectors.CONTAINER);
            container.validate.mockReturnValueOnce([]);
            const errors = calloutEditor.validate();
            expect(errors).toHaveLength(0);
        });
    });
    describe('palette promoted action', () => {
        beforeEach(() => {
            calloutEditor = setupComponentUnderTest({
                node: { elementType: ELEMENT_TYPE.ACTION_CALL, actionType: 'testAction', actionName: 'testActionName' }
            });
        });
        it('does not render the left panel', async () => {
            expect(actionCategories(calloutEditor)).toBeNull();
        });
        it('does not render the action selector', async () => {
            expect(getActionSelector(calloutEditor)).toBeNull();
        });
    });
});
