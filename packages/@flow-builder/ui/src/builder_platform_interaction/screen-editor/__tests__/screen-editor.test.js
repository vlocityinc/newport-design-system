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
import { createElement } from 'lwc';
import { createTestScreen, createTestScreenField } from 'builder_platform_interaction-builder-test-utils';
import {
    PropertyChangedEvent,
    ReorderListEvent,
    createAddScreenFieldEvent,
    createScreenElementDeletedEvent,
    createScreenElementSelectedEvent,
    createScreenNodeSelectedEvent,
    createScreenElementDeselectedEvent
} from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

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
        invokeAlertModal: jest.fn(data => {
            return data;
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

        expect(screen.fields).toHaveLength(8);
    });

    it('add screen field event adds a field to the end by default', () => { // handleAddScreenField (onaddscreenfield)
        return Promise.resolve().then(() => {
            const length = screenEditorElement.node.fields.length;
            const canvas = getShadowRoot(screenEditorElement).querySelector(CANVAS_ELEMENT_NAME);
            canvas.dispatchEvent(createAddScreenFieldEvent('Currency'));
            expect(screenEditorElement.node.fields).toHaveLength(length + 1);
            expect(screenEditorElement.node.fields[length].guid).toBe(screenEditorElement.getSelectedNode().guid);
        });
    });

    it('add screen field event can add a field to a specific position', () => {
        return Promise.resolve().then(() => {
            const length = screenEditorElement.node.fields.length;
            const canvas = screenEditorElement.querySelector(CANVAS_ELEMENT_NAME);
            canvas.dispatchEvent(createAddScreenFieldEvent('Currency', 0));
            expect(screenEditorElement.node.fields).toHaveLength(length + 1);
            expect(screenEditorElement.node.fields[0].guid).toBe(screenEditorElement.getSelectedNode().guid);
        });
    });

    it('delete screen field event deletes the field', () => { // handleDeleteScreenElement - Field (onscreenelementdeleted)
        return Promise.resolve().then(() => {
            const length = screenEditorElement.node.fields.length;
            const canvas = getShadowRoot(screenEditorElement).querySelector(CANVAS_ELEMENT_NAME);
            canvas.dispatchEvent(createScreenElementDeletedEvent(screenEditorElement.node.fields[1]));
            expect(screenEditorElement.node.fields).toHaveLength(length - 1);
        });
    });

    it('property change changes screen property', () => { // handlePropertyChanged (onpropertychanged)
        return Promise.resolve().then(() => {
            const newPausedText =  'screen-editor-test.js property change paused text';
            const editor = getShadowRoot(screenEditorElement).querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
            editor.dispatchEvent(new PropertyChangedEvent('pausedText', newPausedText, null, null, screenEditorElement.node.pausedText));
            expect(screenEditorElement.node.pausedText.value).toBe(newPausedText);
            expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
        });
    });

    it('select screen element sets the current node to the selected element', () => { // handleSelectScreenElement (onscreenelementselected)
        return Promise.resolve().then(() => {
            const canvas = getShadowRoot(screenEditorElement).querySelector(CANVAS_ELEMENT_NAME);
            const field = screenEditorElement.node.fields[3];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));
            expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);
        });
    });

    it('deselect screen element sets the screen as the selected node', () => { // handleDeselectScreenElement - Canvas (onscreenelementdeselected)
        return Promise.resolve().then(() => {
            const canvas = getShadowRoot(screenEditorElement).querySelector(CANVAS_ELEMENT_NAME);

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
            const canvas = getShadowRoot(screenEditorElement).querySelector(CANVAS_ELEMENT_NAME);

            // Select field
            const field = screenEditorElement.node.fields[3];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));
            expect(screenEditorElement.getSelectedNode().guid).toBe(field.guid);

            // Select screen element in the editor container breadcrumbs
            const editor = getShadowRoot(screenEditorElement).querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
            editor.dispatchEvent(createScreenNodeSelectedEvent(field));
            expect(screenEditorElement.getSelectedNode().guid).toBe(screenEditorElement.node.guid);
        });
    });

    it('rearranges fields', () => { // handleReorder (onreorderlist)
        return Promise.resolve().then(() => {
            const canvas = getShadowRoot(screenEditorElement).querySelector(CANVAS_ELEMENT_NAME);
            const field1 = screenEditorElement.node.fields[3];
            const field2 = screenEditorElement.node.fields[5];
            canvas.dispatchEvent(new ReorderListEvent(field1.guid, field2.guid));
            expect(screenEditorElement.node.fields[4].guid).toBe(field2.guid);
            expect(screenEditorElement.node.fields[5].guid).toBe(field1.guid);
        });
    });
});

describe('Screen field property editor events', () => {
    let screenEditorElement;
    const origDisplayText = 'Display This Please';
    const newDisplayText = 'New Display Text';
    const newFieldName = 'my new screen field name';
    beforeEach(() => {
        const screen = createTestScreen('Screen1', null);
        screen.showHeader = true;
        screen.elementType = "SCREEN";
        screen.fields = [];
        const field = createTestScreenField('Screenfield1', 'DisplayText', origDisplayText);
        screen.fields.push(field);
        screenEditorElement = createComponentUnderTest({node:screen});

        // Make sure screen is created with the expected fields.
        expect(screen.fields).toHaveLength(1);
    });
    it('Value of DisplayText field changed', () => {
        return Promise.resolve().then(() => {
            const editor = getShadowRoot(screenEditorElement).querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
            const canvas = getShadowRoot(screenEditorElement).querySelector(CANVAS_ELEMENT_NAME);

            // Select the field to be changed.
            const field = screenEditorElement.node.fields[0];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));

            // Change the field
            editor.dispatchEvent(new PropertyChangedEvent('fieldText', newDisplayText, null, screenEditorElement.node.fields[0].guid, origDisplayText));
            expect(screenEditorElement.node.fields[0].fieldText).toBe(newDisplayText);
        });
    });
    it('Name of DisplayText field changed', () => {
        return Promise.resolve().then(() => {
            const editor = getShadowRoot(screenEditorElement).querySelector(EDITOR_CONTAINER_ELEMENT_NAME);
            const canvas = getShadowRoot(screenEditorElement).querySelector(CANVAS_ELEMENT_NAME);

            // Select the field to be changed.
            const field = screenEditorElement.node.fields[0];
            canvas.dispatchEvent(createScreenElementSelectedEvent(field));

            // Change the field
            editor.dispatchEvent(new PropertyChangedEvent('name', newFieldName, null, screenEditorElement.node.fields[0].guid, 'Display This Please'));
            expect(screenEditorElement.node.fields[0].name).toBe(newFieldName);
        });
    });
});