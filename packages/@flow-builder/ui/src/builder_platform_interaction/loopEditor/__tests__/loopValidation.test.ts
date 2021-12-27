// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { ManuallyAssignVariablesChangedEvent } from 'builder_platform_interaction/events';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { createElement } from 'lwc';
import { scheduleTriggeredFlowUIModel } from 'mock/storeDataScheduleTriggered';
import LoopEditor from '../loopEditor';
import { loopReducer } from '../loopReducer';
import { validate } from '../loopValidation';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-loop-editor', {
        is: LoopEditor
    });
    if (node) {
        el.node = node;
    }
    setDocumentBodyChildren(el);
    return el;
}

const validateLoop = (node, elements) => {
    return getErrorsFromHydratedElement(validate(node, elements));
};

describe('Loop Validation', () => {
    let loopNode, loopForPropertyEditor;
    beforeAll(() => {
        Store.setMockState(scheduleTriggeredFlowUIModel);
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
                type: ManuallyAssignVariablesChangedEvent.EVENT_NAME,
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
