// @ts-nocheck
import { createElement } from 'lwc';
import ScreenCanvas from '../screenCanvas';
import { createTestScreen, createDropEvent, ticks } from 'builder_platform_interaction/builderTestUtils';
import { ScreenEditorEventName } from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/screenEditorUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/screenEditorUtils');
    return Object.assign({}, actual, {
        getDragFieldValue: jest.fn().mockImplementation(() => {
            return 'Section';
        })
    });
});

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-canvas', {
        is: ScreenCanvas
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningButtonIcon: 'lightning-button-icon',
    highlightFields: '.screen-canvas-body builder_platform_interaction-screen-editor-highlight',
    canvasBody: '.screen-canvas-body',
    canvasEmptyPlaceHolder: '.screen-canvas-empty-place-holder',
    draggingRegion: '.screen-canvas-dragging-region',
    highlightElementSlot: 'div[slot="screen-element"]',
    screenFieldCard: 'builder_platform_interaction-screen-field-card',
    screenFieldCardBody: 'p.slds-text-heading_small'
};

beforeAll(() => {
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    Store.resetStore();
});

describe('Empty placeholder', () => {
    it('not rendered when there are child fields and showEmptyPlaceholder flag is set to true', async () => {
        const screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen 1', null),
            showEmptyPlaceholder: true,
            labels: {}
        });
        await ticks(1);
        const emptyPlaceHolder = screenCanvasElement.shadowRoot.querySelector(selectors.canvasEmptyPlaceHolder);
        expect(emptyPlaceHolder).toBeNull();
    });
    it('not rendered when there are child fields and showEmptyPlaceholder flag is set to false', async () => {
        const screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen 1', null),
            showEmptyPlaceholder: false,
            labels: {}
        });
        await ticks(1);
        const emptyPlaceHolder = screenCanvasElement.shadowRoot.querySelector(selectors.canvasEmptyPlaceHolder);
        expect(emptyPlaceHolder).toBeNull();
    });
    it('rendered when there are no child fields and showEmptyPlaceholder flag is set to true', async () => {
        const screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen 1', []),
            showEmptyPlaceholder: true,
            labels: {}
        });
        await ticks(1);
        const emptyPlaceHolder = screenCanvasElement.shadowRoot.querySelector(selectors.canvasEmptyPlaceHolder);
        expect(emptyPlaceHolder).not.toBeNull();
    });
    it('not rendered when there are no child fields and showEmptyPlaceholder flag is set to false', async () => {
        const screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen 1', []),
            showEmptyPlaceholder: false,
            labels: {}
        });
        await ticks(1);
        const emptyPlaceHolder = screenCanvasElement.shadowRoot.querySelector(selectors.canvasEmptyPlaceHolder);
        expect(emptyPlaceHolder).toBeNull();
    });
});

describe('Fields rendered', () => {
    let screenCanvasElement;
    beforeEach(() => {
        screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen 1', null),
            labels: {}
        });
    });
    it('Correct number of screen fields are rendered', async () => {
        await ticks(1);
        const highlightFields = screenCanvasElement.shadowRoot.querySelectorAll(selectors.highlightFields);
        expect(highlightFields).toHaveLength(8);
    });
});

describe('No fields rendered for empty screen', () => {
    let screenCanvasElement;
    beforeEach(() => {
        screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen 1', []),
            labels: {}
        });
    });
    it('Correct number of screen fields are rendered', async () => {
        await ticks(1);
        const highlightFields = screenCanvasElement.shadowRoot.querySelectorAll(selectors.highlightFields);
        expect(highlightFields).toHaveLength(0);
    });
});

describe('canvas elements draggability', () => {
    let screenCanvasElement;
    beforeEach(() => {
        screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen 1', null),
            labels: {}
        });
    });
    it('screen field is draggable', async () => {
        await ticks(1);
        const field = screenCanvasElement.shadowRoot.querySelector(selectors.highlightFields);
        expect(field.draggable).toBeTruthy();
    });
});

describe('handleDragEnter', () => {
    let screenCanvasElement;
    beforeEach(() => {
        screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen1', null)
        });
    });
    it('dragEnter removes the expect class from the highlight', async () => {
        await ticks(1);
        const dragEnterEvent = new CustomEvent('dragenter');
        // Before firing the event, we should see the class in question.
        const draggingRegion = screenCanvasElement.shadowRoot.querySelector(selectors.draggingRegion);
        expect(draggingRegion.classList).toContain('slds-hide');

        // Fire dragEnter event on the canvas
        const canvasBody = screenCanvasElement.shadowRoot.querySelector(selectors.canvasBody);
        canvasBody.dispatchEvent(dragEnterEvent);
        expect(draggingRegion.classList).not.toContain('slds-hide');
    });
});

describe('handleDragEnterForSectionWithinField', () => {
    let screenCanvasElement;
    const testScreen = createTestScreen('Screen1');
    testScreen.elementType = ELEMENT_TYPE.SCREEN_FIELD;
    beforeEach(() => {
        screenCanvasElement = createComponentUnderTest({
            element: testScreen
        });
    });
    it('dragEnter does not remove the expect class from the highlight', async () => {
        await ticks(1);
        const dragEnterEvent = new CustomEvent('dragenter');

        // Before firing the event, we should see the class in question.
        const draggingRegion = screenCanvasElement.shadowRoot.querySelector(selectors.draggingRegion);
        expect(draggingRegion.classList).toContain('slds-hide');

        // Fire dragEnter event on the canvas
        const canvasBody = screenCanvasElement.shadowRoot.querySelector(selectors.canvasBody);
        canvasBody.dispatchEvent(dragEnterEvent);
        expect(draggingRegion.classList).toContain('slds-hide');
    });
});

describe('handleDragEnd', () => {
    let screenCanvasElement;
    beforeEach(() => {
        screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen 1', null),
            labels: {}
        });
    });
    it('dragEnd adds the expected class to the highlight', async () => {
        await ticks(1);
        const dragEndEvent = new CustomEvent('dragend');
        const draggingRegion = screenCanvasElement.shadowRoot.querySelector(selectors.draggingRegion);

        // First dragEnter so the class is removed.
        const dragEnterEvent = new CustomEvent('dragenter');
        const canvasBody = screenCanvasElement.shadowRoot.querySelector(selectors.canvasBody);
        canvasBody.dispatchEvent(dragEnterEvent);
        expect(draggingRegion.classList).not.toContain('slds-hide');

        // Fire dragEnd event on the canvas
        canvasBody.dispatchEvent(dragEndEvent);
        expect(draggingRegion.classList).toContain('slds-hide');
    });
});

describe('onDrop', () => {
    let screenCanvasElement;
    beforeEach(() => {
        screenCanvasElement = createComponentUnderTest({
            element: createTestScreen('Screen 1', null),
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
                    right: 120
                };
            };
        }

        // Add a getBoundingClientRect() function to each highlight element, which is used by the dragging method.
        const fieldHighlights = screenCanvasElement.shadowRoot
            .querySelector('div.screen-canvas-body')
            .querySelectorAll('builder_platform_interaction-screen-editor-highlight');
        let counter = 0;
        for (const fieldHighlight of fieldHighlights) {
            fieldHighlight.getBoundingClientRect = boundingClientRectMock(counter);
            counter++;
        }
    });
    it('dropping an element to the same location does not result in reorder', async () => {
        await ticks(1);
        const eventCallback = jest.fn().mockImplementation();
        screenCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);

        // This drop event tries to drop field 0 to it's current location.
        const dropEvent = createDropEvent();
        dropEvent.y = 100;
        dropEvent.dataTransfer.setData('text', screenCanvasElement.element.fields[0].guid);

        const canvasBodyDiv = screenCanvasElement.shadowRoot.querySelector(selectors.canvasBody);
        canvasBodyDiv.dispatchEvent(dropEvent);
        expect(eventCallback).toHaveBeenCalled();
    });
    it('dropping an element to a higher y coordinate should result in reorder event', async () => {
        await ticks(1);
        const eventCallback = jest.fn().mockImplementation();
        screenCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);

        // Drop field index 2 to the area where field index 0 current resides.
        const dropEvent = createDropEvent();
        dropEvent.y = 100;
        dropEvent.dataTransfer.setData('text', screenCanvasElement.element.fields[2].guid);

        const canvasBodyDiv = screenCanvasElement.shadowRoot.querySelector(selectors.canvasBody);
        canvasBodyDiv.dispatchEvent(dropEvent);
        expect(eventCallback).toHaveBeenCalled();
    });
    it('dropping an element to a lower y coordinate should result in reorder event', async () => {
        await ticks(1);
        const eventCallback = jest.fn().mockImplementation();
        screenCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);

        // Drop field index 0 to the area where field index 1 current resides.
        const dropEvent = createDropEvent();
        dropEvent.y = 230;
        dropEvent.dataTransfer.setData('text', screenCanvasElement.element.fields[0].guid);

        const canvasBodyDiv = screenCanvasElement.shadowRoot.querySelector(selectors.canvasBody);
        canvasBodyDiv.dispatchEvent(dropEvent);
        expect(eventCallback).toHaveBeenCalled();
    });
    it('dropping to the bottom fires a re-order event', async () => {
        await ticks(1);
        const eventCallback = jest.fn().mockImplementation();
        screenCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);

        // Drop field index 0 to the area where field index 1 current resides.
        const dropEvent = createDropEvent();
        dropEvent.y = 1202;
        dropEvent.dataTransfer.setData('text', screenCanvasElement.element.fields[0].guid);

        const canvasBodyDiv = screenCanvasElement.shadowRoot.querySelector(selectors.canvasBody);
        canvasBodyDiv.dispatchEvent(dropEvent);
        expect(eventCallback).toHaveBeenCalled();
    });
    it('should fire the right event when dropping a new field from palette', async () => {
        await ticks(1);
        const eventCallback = jest.fn().mockImplementation();
        screenCanvasElement.addEventListener(ScreenEditorEventName.ScreenFieldAdded, eventCallback);

        const dropEvent = createDropEvent();
        dropEvent.y = 100;
        dropEvent.dataTransfer.setData('text', JSON.stringify({ fieldTypeName: 'numberInput' }));
        dropEvent.dataTransfer.effectAllowed = 'copy';

        const canvasBodyDiv = screenCanvasElement.shadowRoot.querySelector(selectors.canvasBody);
        canvasBodyDiv.dispatchEvent(dropEvent);
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            typeName: 'numberInput',
            position: 1
        });
    });
    it('should fire the right event when dropping a new automatic field from palette', async () => {
        const eventCallback = jest.fn().mockImplementation();
        screenCanvasElement.addEventListener(ScreenEditorEventName.AutomaticScreenFieldAdded, eventCallback);

        const dropEvent = createDropEvent();
        dropEvent.y = 100;
        dropEvent.dataTransfer.setData(
            'text',
            JSON.stringify({ fieldTypeName: 'TextBox', objectFieldReference: 'account.Name' })
        );
        dropEvent.dataTransfer.effectAllowed = 'copy';

        const canvasBodyDiv = screenCanvasElement.shadowRoot.querySelector(selectors.canvasBody);
        canvasBodyDiv.dispatchEvent(dropEvent);
        await ticks(1);
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            typeName: 'TextBox',
            objectFieldReference: 'account.Name',
            position: 1
        });
    });
});
