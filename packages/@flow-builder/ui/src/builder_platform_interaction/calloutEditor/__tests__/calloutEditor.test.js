import { createElement } from 'lwc';
import CalloutEditor  from "../calloutEditor";
import { getShadowRoot } from 'lwc-test-utils';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { shouldNotBeNullOrUndefined } from "builder_platform_interaction/validationRules";

const setupComponentUnderTest = () => {
    const element = createElement('builder_platform_interaction-callout-editor', {
        is: CalloutEditor,
    });
    document.body.appendChild(element);
    return element;
};

const selectors = {
    CONTAINER: 'builder_platform_interaction-callout-editor-container',
    ACTION_SELECTOR: 'builder_platform_interaction-action-selector',
    REFERENCED_COMBOBOX: 'builder_platform_interaction-combobox',
};

const mockSelectedAction = {
    actionName: 'chatterPost',
    actionType: 'chatterPost',
    elementType : ELEMENT_TYPE.ACTION_CALL
};

const mockSelectedApex = {
    apexClass: 'flowChat',
    elementType : ELEMENT_TYPE.APEX_PLUGIN_CALL
};

const mockSelectedSubflow = {
    flowName: 'myFlow',
    elementType : ELEMENT_TYPE.SUBFLOW
};

jest.mock('builder_platform_interaction/validationRules', () => {
    return {
        shouldNotBeNullOrUndefined: jest.fn(),
    };
});

const dispatchSelectedActionChangeEvent = (component, actionName, actionType) => {
    const changeEvent = new CustomEvent('valuechanged', {
        detail: {
            value: {
                actionName,
                actionType,
                elementType : ELEMENT_TYPE.ACTION_CALL
            }
        }
    });
    component.dispatchEvent(changeEvent);
};

const dispatchSelectedApexChangeEvent = (component, apexClass) => {
    const changeEvent = new CustomEvent('valuechanged', {
        detail: {
            value: {
                apexClass,
                elementType : ELEMENT_TYPE.APEX_PLUGIN_CALL
            }
        }
    });
    component.dispatchEvent(changeEvent);
};

const dispatchSelectedSubflowChangeEvent = (component, flowName) => {
    const changeEvent = new CustomEvent('valuechanged', {
        detail: {
            value: {
                flowName,
                elementType : ELEMENT_TYPE.SUBFLOW
            }
        }
    });
    component.dispatchEvent(changeEvent);
};
describe('callout-editor', () => {
    let calloutEditor, actionSelector;
    beforeEach(() => {
        calloutEditor = setupComponentUnderTest();
        actionSelector = getShadowRoot(calloutEditor).querySelector(selectors.ACTION_SELECTOR);
    });
    describe('invocable-action', () => {
        it('has an action-selector component', () => {
            expect(actionSelector).not.toBeNull();
        });
        it('has an inner callout-editor-container component that takes in the selected action', () => {
            dispatchSelectedActionChangeEvent(actionSelector, mockSelectedAction.actionName, mockSelectedAction.actionType);
            return Promise.resolve().then(() => {
                const container = getShadowRoot(calloutEditor).querySelector(selectors.CONTAINER);
                expect(container).not.toBeNull();
                expect(container.selectedAction).toEqual(mockSelectedAction);
            });
        });
        it('calls the inner container validate method on validate', () => {
            dispatchSelectedActionChangeEvent(actionSelector, mockSelectedAction.actionName, mockSelectedAction.actionType);
            return Promise.resolve().then(() => {
                const container = getShadowRoot(calloutEditor).querySelector(selectors.CONTAINER);
                const errors = ['error'];
                container.validate.mockReturnValueOnce(errors);
                const val = calloutEditor.validate();
                expect(container.validate).toHaveBeenCalledTimes(1);
                expect(val).toEqual(errors);
            });
        });
        it('calls the inner container getNode method on getNode', () => {
            const container = getShadowRoot(calloutEditor).querySelector(selectors.CONTAINER);
            const node = {
                    name: 'my node',
                    elementType: ELEMENT_TYPE.ACTION_CALL};
            container.getNode.mockReturnValueOnce(node);
            const value = calloutEditor.getNode();
            expect(container.getNode).toHaveBeenCalledTimes(1);
            expect(value).toEqual(node);
        });
    });
    describe('apex-plugin', () => {
        it('has an action-selector component', () => {
            expect(actionSelector).not.toBeNull();
        });
        it('has an inner callout-editor-container component that takes in the selected apex class', () => {
            dispatchSelectedApexChangeEvent(actionSelector, mockSelectedApex.apexClass);
            return Promise.resolve().then(() => {
                const container = getShadowRoot(calloutEditor).querySelector(selectors.CONTAINER);
                expect(container).not.toBeNull();
                expect(container.selectedAction).toEqual(mockSelectedApex);
            });
        });
    });
    describe('subflow', () => {
        it('has an action-selector component', () => {
            expect(actionSelector).not.toBeNull();
        });
        it('has an inner callout-editor-container component that takes in the selected apex class', () => {
            dispatchSelectedSubflowChangeEvent(actionSelector, mockSelectedSubflow.flowName);
            return Promise.resolve().then(() => {
                const container = getShadowRoot(calloutEditor).querySelector(selectors.CONTAINER);
                expect(container).not.toBeNull();
                expect(container.selectedAction).toEqual(mockSelectedSubflow);
            });
        });
    });
    describe('Validation', () => {
        const mockError = 'mockError';
        it('returns an error when there is no selected action', () => {
            shouldNotBeNullOrUndefined.mockReturnValueOnce(mockError);
            const errors = calloutEditor.validate();
            expect(errors).toHaveLength(1);
            expect(errors).toContain(mockError);
            expect(shouldNotBeNullOrUndefined).toHaveBeenCalledWith(undefined);
        });

        it('returns an error when typing the invalid action', () => {
            const referencedCombobox = getShadowRoot(actionSelector).querySelector(selectors.REFERENCED_COMBOBOX);
            referencedCombobox.errorMessage = mockError;
            const errors = calloutEditor.validate();
            expect(errors).toHaveLength(1);
            expect(errors).toContain(mockError);
        });

        it('returns no error when referenced action is selected', () => {
            dispatchSelectedActionChangeEvent(actionSelector, mockSelectedAction.actionName, mockSelectedAction.actionType);
            return Promise.resolve().then(() => {
                const container = getShadowRoot(calloutEditor).querySelector(selectors.CONTAINER);
                container.validate.mockReturnValueOnce([]);
                const errors = calloutEditor.validate();
                expect(errors).toHaveLength(0);
            });
        });
    });
});