import { createElement } from 'engine';
import  ScreenEditorCanvas  from '../screen-editor-canvas';
import { createScreenElementSelectedEvent, SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction-events';
import { createTestScreen } from 'builder_platform_interaction-builder-test-utils';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor-canvas', {
        is: ScreenEditorCanvas
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('screen-editor-canvas', () => {
    it('displays the help icon when there is help text', () => {
        const screenEditorCanvasElement = createComponentUnderTest({
            screen: createTestScreen(), // {helpText: {value: "help!!", error: null}, label:{value:"label", error: null}, showHeader: true},
            labels: {}
        });
        return Promise.resolve().then(() => {
            const helpIcon = screenEditorCanvasElement.querySelector('lightning-button-icon');
            expect(helpIcon).toBeDefined();
        });
    });
});

describe('canvas elements draggability', () => {
    let screenEditorCanvasElement;
    beforeEach(() => {
        screenEditorCanvasElement = createComponentUnderTest({
            screen: createTestScreen('Screen 1', null),
            labels: {}
        });
    });
    it('screen field is draggable', () => {
        return Promise.resolve().then(() => {
            const field = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-body builder_platform_interaction-screen-editor-highlight');
            expect(field.draggable).toBeTruthy();
        });
    });
    it('screen header is not draggable', () => {
        return Promise.resolve().then(() => {
            const header = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-content builder_platform_interaction-screen-editor-highlight');
            expect(header.draggable).toBeFalsy();
        });
    });
});

describe('Click handling on canvas', () => {
    let screenEditorCanvasElement;
    beforeEach(() => {
        screenEditorCanvasElement = createComponentUnderTest({
            screen: createTestScreen(),
            labels: {}
        });
    });
    it('clicking on the canvas fires correct event', () => {
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn().mockImplementation();
            screenEditorCanvasElement.addEventListener(SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_SELECTED, eventCallback);
            const canvasDiv = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-container');
            const selectEvent = createScreenElementSelectedEvent();
            canvasDiv.dispatchEvent(selectEvent);
            expect(eventCallback).toHaveBeenCalled();
        });
    });
});