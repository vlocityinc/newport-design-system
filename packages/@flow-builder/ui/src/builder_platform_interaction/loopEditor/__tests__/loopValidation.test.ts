// @ts-nocheck
import { createElement } from 'lwc';
import LoopEditor from '../loopEditor';
import { validate } from '../loopValidation';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { loopReducer } from '../loopReducer';
import { UseAdvancedOptionsSelectionChangedEvent } from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { autolaunchedFlowUIModel } from 'mock/storeDataAutolaunched';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-loop-editor', {
        is: LoopEditor
    });
    if (node) {
        el.node = node;
    }
    document.body.appendChild(el);
    return el;
}

const validateLoop = (node, elements) => {
    return getErrorsFromHydratedElement(validate(node, elements));
};

describe('Loop Validation', () => {
    let loopNode, loopForPropertyEditor;
    beforeAll(() => {
        Store.setMockState(autolaunchedFlowUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('with automatic outputs', () => {
        beforeEach(() => {
            loopNode = getElementByDevName('loopAccountAutomaticOutput');
            loopForPropertyEditor = getElementForPropertyEditor(loopNode);
        });
        it('node is valid, returns no errors', () => {
            const loopEditor = createComponentForTest(loopForPropertyEditor);
            const errors = validateLoop(loopEditor.node, Store.getStore().getCurrentState().elements);
            expect(errors).toHaveLength(0);
        });
    });
    describe('advanced option checked', () => {
        beforeEach(() => {
            loopNode = getElementByDevName('loopOnTextCollection');
            loopForPropertyEditor = getElementForPropertyEditor(loopNode);
        });
        it('it returns no errors', () => {
            const loopEditor = createComponentForTest(loopForPropertyEditor);
            const errors = validateLoop(loopEditor.node, Store.getStore().getCurrentState().elements);
            expect(errors).toHaveLength(0);
        });
        it('Switching from advanced (manual) to automatic mode should not cause validation errors', () => {
            const event = {
                type: UseAdvancedOptionsSelectionChangedEvent.EVENT_NAME,
                detail: {
                    useAdvancedOptions: false
                }
            };
            const originalState = loopForPropertyEditor;
            const newState = loopReducer(originalState, event, {});
            const errors = validateLoop(newState, Store.getStore().getCurrentState().elements);
            expect(errors).toHaveLength(0);
        });
    });
});
