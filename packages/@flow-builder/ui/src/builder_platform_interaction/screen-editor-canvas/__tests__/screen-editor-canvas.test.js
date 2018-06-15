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

describe('help icon', () => {
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

describe('fields rendered', () => {
    let screenEditorCanvasElement;
    beforeEach(() => {
        screenEditorCanvasElement = createComponentUnderTest({
            screen: createTestScreen('Screen 1', null),
            labels: {}
        });
    });
    it('Correct number of screen fields are rendered', () => {
        return Promise.resolve().then(() => {
            const highlightFields = screenEditorCanvasElement.querySelectorAll('.screen-editor-canvas-body builder_platform_interaction-screen-editor-highlight');
            expect(highlightFields).toHaveLength(9);
        });
    });
});

describe('No fields rendered for empty screen', () => {
    let screenEditorCanvasElement;
    beforeEach(() => {
        screenEditorCanvasElement = createComponentUnderTest({
            screen: createTestScreen('Screen 1', []),
            labels: {}
        });
    });
    it('Correct number of screen fields are rendered', () => {
        return Promise.resolve().then(() => {
            const highlightFields = screenEditorCanvasElement.querySelectorAll('.screen-editor-canvas-body builder_platform_interaction-screen-editor-highlight');
            expect(highlightFields).toHaveLength(0);
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

describe('handleDragEnter', () => {
    let screenEditorCanvasElement;
    beforeEach(() => {
        screenEditorCanvasElement = createComponentUnderTest({
            screen: createTestScreen('Screen 1', null),
            labels: {}
        });
    });
    it('dragEnter removes the expect class from the highlight', () => {
        return Promise.resolve().then(() => {
            const dragEnterEvent = new CustomEvent('dragenter');

            // Before firing the event, we should see the class in question.
            const draggingRegion = screenEditorCanvasElement.querySelector('.screen-editor-canvas-dragging-region');
            expect(draggingRegion.classList).toContain('slds-hide');

            // Fire dragEnter event on the canvas
            const canvasDiv = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-container');
            canvasDiv.dispatchEvent(dragEnterEvent);
            expect(draggingRegion.classList).not.toContain('slds-hide');
        });
    });
});

describe('handleDragEnd', () => {
    let screenEditorCanvasElement;
    beforeEach(() => {
        screenEditorCanvasElement = createComponentUnderTest({
            screen: createTestScreen('Screen 1', null),
            labels: {}
        });
    });
    it('dragEnd adds the expected class to the highlight', () => {
        return Promise.resolve().then(() => {
            const dragEndEvent = new CustomEvent('dragend');
            const draggingRegion = screenEditorCanvasElement.querySelector('.screen-editor-canvas-dragging-region');

            // First dragEnter so the class is removed.
            const dragEnterEvent = new CustomEvent('dragenter');
            const canvasDiv = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-container');
            canvasDiv.dispatchEvent(dragEnterEvent);
            expect(draggingRegion.classList).not.toContain('slds-hide');

            // Fire dragEnd event on the canvas
            canvasDiv.dispatchEvent(dragEndEvent);
            expect(draggingRegion.classList).toContain('slds-hide');
        });
    });
});

describe('onDrop', () => {
    let screenEditorCanvasElement;
    beforeEach(() => {
        screenEditorCanvasElement = createComponentUnderTest({
            screen: createTestScreen('Screen 1', null),
            labels: {}
        });

        // Assume each screen field is 120 pixels side and long.
        function boundingClientRectMock(counter) {
            return function () {
                return {
                    width: 120,
                    height: 120,
                    top: counter * 120,
                    left: 0,
                    bottom: (counter + 1) * 120,
                    right: 120,
                };
            };
        }

        // Add a getBoundingClientRect() funciont to each highlight element, which is used by the dragging method.
        const fieldHighlights = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-body').querySelectorAll('builder_platform_interaction-screen-editor-highlight');
        let counter = 0;
        for (const fieldHighlight of fieldHighlights) {
            fieldHighlight.getBoundingClientRect = boundingClientRectMock(counter);
            counter++;
        }
    });
    it('dropping an element to the same location does not result in reorder', () => {
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn().mockImplementation();
            screenEditorCanvasElement.addEventListener('reorderlist', eventCallback);

            // This drop even tries to drop field 0 to it's current location.
            const dropEvent = new CustomEvent('drop');
            dropEvent.dataTransfer = {
                data: {},
                setData(type, val) {
                    this.data[type] = val;
                },
                getData(type) {
                    return this.data[type];
                }
            };
            dropEvent.y = 100;
            dropEvent.dataTransfer.setData('text', screenEditorCanvasElement.screen.fields[0].guid);

            const canvasBodyDiv = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-container');
            canvasBodyDiv.dispatchEvent(dropEvent);
            expect(eventCallback).not.toHaveBeenCalled();
        });
    });
    it('dropping an element to a higher y coordiant should result in reorder event', () => {
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn().mockImplementation();
            screenEditorCanvasElement.addEventListener('reorderlist', eventCallback);

            // Drop field index 2 to the area where field index 0 current resides.
            const dropEvent = new CustomEvent('drop');
            dropEvent.dataTransfer = {
                data: {},
                setData(type, val) {
                    this.data[type] = val;
                },
                getData(type) {
                    return this.data[type];
                }
            };
            dropEvent.y = 100;
            dropEvent.dataTransfer.setData('text', screenEditorCanvasElement.screen.fields[2].guid);

            const canvasBodyDiv = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-container');
            canvasBodyDiv.dispatchEvent(dropEvent);
            expect(eventCallback).toHaveBeenCalled();
        });
    });
    it('dropping an element to a lower y coordiant should result in reorder event', () => {
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn().mockImplementation();
            screenEditorCanvasElement.addEventListener('reorderlist', eventCallback);

            // Drop field index 0 to the area where field index 1 current resides.
            const dropEvent = new CustomEvent('drop');
            dropEvent.dataTransfer = {
                data: {},
                setData(type, val) {
                    this.data[type] = val;
                },
                getData(type) {
                    return this.data[type];
                }
            };
            dropEvent.y = 230;
            dropEvent.dataTransfer.setData('text', screenEditorCanvasElement.screen.fields[0].guid);

            const canvasBodyDiv = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-container');
            canvasBodyDiv.dispatchEvent(dropEvent);
            expect(eventCallback).toHaveBeenCalled();
        });
    });
    it('dropping to the bottom fires a re-order event', () => {
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn().mockImplementation();
            screenEditorCanvasElement.addEventListener('reorderlist', eventCallback);

            // Drop field index 0 to the area where field index 1 current resides.
            const dropEvent = new CustomEvent('drop');
            dropEvent.dataTransfer = {
                data: {},
                setData(type, val) {
                    this.data[type] = val;
                },
                getData(type) {
                    return this.data[type];
                }
            };
            dropEvent.y = 1202;
            dropEvent.dataTransfer.setData('text', screenEditorCanvasElement.screen.fields[0].guid);

            const canvasBodyDiv = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-container');
            canvasBodyDiv.dispatchEvent(dropEvent);
            expect(eventCallback).toHaveBeenCalled();
        });
    });
    it('if no y coordinate is found, no reordering should be fired', () => {
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn().mockImplementation();
            screenEditorCanvasElement.addEventListener('reorderlist', eventCallback);

            // Setup the even with no y target.
            const dropEvent = new CustomEvent('drop');
            dropEvent.dataTransfer = {
                data: {},
                setData(type, val) {
                    this.data[type] = val;
                },
                getData(type) {
                    return this.data[type];
                }
            };
            dropEvent.y = null;
            dropEvent.dataTransfer.setData('text', screenEditorCanvasElement.screen.fields[0].guid);

            const canvasBodyDiv = screenEditorCanvasElement.querySelector('div.screen-editor-canvas-container');
            canvasBodyDiv.dispatchEvent(dropEvent);
            expect(eventCallback).not.toHaveBeenCalled();
        });
    });
});
