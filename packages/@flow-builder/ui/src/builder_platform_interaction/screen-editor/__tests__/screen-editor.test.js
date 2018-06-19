/**
 * Screen-editor tests for the following handlers:
 *      handleAddScreenField
 *      handleDeleteScreenElement
 *      handlePropertyChanged
 *      handleSelectScreenElement
 *      handleDeselectScreenElement
 *      handleReorder
 */
import ScreenEditor from '../screen-editor';
import { createElement } from 'engine';
import { createTestScreen } from 'builder_platform_interaction-builder-test-utils';
import {
    PropertyChangedEvent,
    ReorderListEvent,
    createAddScreenFieldEvent,
    createScreenElementDeletedEvent,
    createScreenElementSelectedEvent,
    createScreenNodeSelectedEvent,
    createScreenElementDeselectedEvent
} from 'builder_platform_interaction-events';

const CANVAS_ELEMENT_NAME = 'builder_platform_interaction-screen-editor-canvas';
const EDITOR_CONTAINER_ELEMENT_NAME = 'builder_platform_interaction-screen-properties-editor-container';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor', {
        is: ScreenEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction-builder-utils', () => {
    return {
        showConfirmationDialog: jest.fn((attributes, cb) => {
            cb();
        })
    };
});

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

describe('Event handling on editor', () => {
    let screenEditorElement;
    beforeEach(() => {
        const screen = createTestScreen('Screen1', null);
        screen.showHeader = true;
        screen.elementType = "SCREEN";
        screenEditorElement = createComponentUnderTest({node:screen});
        expect(screen.fields).toHaveLength(9);
    });

    it('add screen field event adds a field', () => { // handleAddScreenField (onaddscreenfield)
        return Promise.resolve().then(() => {
            const length = screenEditorElement.node.fields.length;
            const canvas = screenEditorElement.querySelector(CANVAS_ELEMENT_NAME);
            canvas.dispatchEvent(createAddScreenFieldEvent('Currency'));
            expect(screenEditorElement.node.fields).toHaveLength(length + 1);
        });
    });

    it('delete screen field event deletes the field', () => { // handleDeleteScreenElement - Field (onscreenelementdeleted)
        return Promise.resolve().then(() => {
            const length = screenEditorElement.node.fields.length;
            const canvas = screenEditorElement.querySelector(CANVAS_ELEMENT_NAME);
            canvas.dispatchEvent(createScreenElementDeletedEvent(screenEditorElement.node.fields[1]));
            expect(screenEditorElement.node.fields).toHaveLength(length - 1);
        });
    });

    it('property change changes screen property', () => { // handlePropertyChanged (onpropertychanged)
        return Promise.resolve().then(() => {
            const newPausedText =  'screen-editor-test.js property change paused text';
            const editor = screenEditorElement.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
            editor.dispatchEvent(new PropertyChangedEvent('pausedText', newPausedText, null, null, screenEditorElement.node.pausedText));
            expect(screenEditorElement.node.pausedText.value).toBe(newPausedText);
        });
    });

    it('select screen element sets the current node to the selected element', () => { // handleSelectScreenElement (onscreenelementselected)
        return Promise.resolve().then(() => {
            const canvas = screenEditorElement.querySelector(CANVAS_ELEMENT_NAME);
            const field = screenEditorElement.node.fields[3];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));
            expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);
        });
    });

    it('deselect screen element sets the screen as the selected node', () => { // handleDeselectScreenElement - Canvas (onscreenelementdeselected)
        return Promise.resolve().then(() => {
            const canvas = screenEditorElement.querySelector(CANVAS_ELEMENT_NAME);

            // Select field
            const field = screenEditorElement.node.fields[3];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));
            expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);

            // Clear selection
            canvas.dispatchEvent(createScreenElementDeselectedEvent(field));
            expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
        });
    });

    it('selecting the screen in the properties editor container breadcrumbs header screen as the selected node', () => { // handleDeselectScreenElement - Property Editor Container (onscreennodeselected)
        return Promise.resolve().then(() => {
            const canvas = screenEditorElement.querySelector(CANVAS_ELEMENT_NAME);

            // Select field
            const field = screenEditorElement.node.fields[3];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));
            expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);

            // Select screen element in the editor container breadcrumbs
            const editor = screenEditorElement.querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
            editor.dispatchEvent(createScreenNodeSelectedEvent(field));
            expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
        });
    });

    it('rearranges fields', () => { // handleReorder (onreorderlist)
        return Promise.resolve().then(() => {
            const canvas = screenEditorElement.querySelector(CANVAS_ELEMENT_NAME);
            const field1 = screenEditorElement.node.fields[3];
            const field2 = screenEditorElement.node.fields[5];
            canvas.dispatchEvent(new ReorderListEvent(field1.guid, field2.guid));
            expect(screenEditorElement.node.fields[4].guid).toBe(field2.guid);
            expect(screenEditorElement.node.fields[5].guid).toBe(field1.guid);
        });
    });
});