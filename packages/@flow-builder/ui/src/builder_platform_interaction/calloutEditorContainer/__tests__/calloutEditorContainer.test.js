import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import CalloutEditorContainer from "../calloutEditorContainer";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

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
            container = setupComponentUnderTest({selectedAction: mockSelectedAction, location: {locationX: 100, locationY: 100}, hasActions: { value: true}});
        });
        it('should accept the selected action', () => {
            expect(container.selectedAction).toEqual(mockSelectedAction);
        });

        it('should create inner editor', () => {
            const innerEditor = getShadowRoot(container).querySelector(EDITOR_SELECTOR);
            const node = innerEditor.getNode();
            expect(node.actionName).toEqual(mockSelectedAction.actionName);
            expect(node.actionType).toEqual(mockSelectedAction.actionType);
            expect(node.elementType).toEqual(mockSelectedAction.elementType);
        });

        it('should call validate on the inner editor', () => {
            const innerEditor = getShadowRoot(container).querySelector(EDITOR_SELECTOR);
            innerEditor.validate = jest.fn();
            container.validate();
            expect(innerEditor.validate).toHaveBeenCalledTimes(1);
        });

        it('should be at location(100, 100)', () => {
            const innerEditor = getShadowRoot(container).querySelector(EDITOR_SELECTOR);
            const node = innerEditor.getNode();
            expect(node.locationX).toEqual(100);
            expect(node.locationY).toEqual(100);
        });
    });
});