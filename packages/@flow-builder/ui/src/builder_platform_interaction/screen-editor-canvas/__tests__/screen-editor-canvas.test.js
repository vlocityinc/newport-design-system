import { createElement } from 'engine';
import  ScreenEditorCanvas  from '../screen-editor-canvas';
import { ScreenElementSelectedEvent, screenEventNames } from 'builder_platform_interaction-events';

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
            screen: {helpText: {value: "help!!", error: null}, label:{value:"label", error: null}, showHeader: true},
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
            screen: {
                label: {value: "label", error: null},
                showHeader: true,
                fields: [
                    {
                        name: {value : "Name", error: null},
                        fieldType: "InputField",
                        fieldText: {value: "Name", error: null},
                        dataType: "String",
                        type: { dataType: "String", label: "Text Field"}
                    },
                ]
            },
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
            screen: {
                helpText: {value: "help!!", error: null},
                label: {value: "label", error: null},
                showHeader: true,
                fields: []
            },
            labels: {}
        });
    });
    it('clicking on the canvas fires correct event', () => {
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn().mockImplementation();
            screenEditorCanvasElement.addEventListener(screenEventNames.screenElementSelectedEvent, eventCallback);
            const canvasDiv = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-container');
            const selectEvent = new ScreenElementSelectedEvent();
            canvasDiv.dispatchEvent(selectEvent);
            expect(eventCallback).toHaveBeenCalled();
        });
    });
});