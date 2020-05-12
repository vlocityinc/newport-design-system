// @ts-nocheck
import { createElement } from 'lwc';
import ScreenEditorCanvas from '../screenEditorCanvas';
import { createTestScreen, ticks } from 'builder_platform_interaction/builderTestUtils';
import { createScreenElementSelectedEvent, SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-screen-editor-canvas', {
        is: ScreenEditorCanvas
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningButtonIcon: 'lightning-button-icon',
    canvasContainer: 'div.screen-editor-canvas-container',
    highlightElementSlot: 'div[slot="screen-element"]',
    screenFieldCard: 'builder_platform_interaction-screen-field-card',
    screenFieldCardBody: 'p.slds-text-heading_small',
    screenCanvasHeader: 'span.slds-card__header-link'
};

beforeAll(() => {
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    Store.resetStore();
});

describe('help icon', () => {
    it('displays the help icon when there is help text', async () => {
        const screenEditorCanvasElement = createComponentUnderTest({
            screen: createTestScreen(), // {helpText: {value: "help!!", error: null}, label:{value:"label", error: null}, showHeader: true},
            labels: {}
        });
        await ticks(1);
        const helpIcon = screenEditorCanvasElement.shadowRoot.querySelector(selectors.lightningButtonIcon);
        expect(helpIcon).toBeDefined();
    });
});

describe('screen canvas', () => {
    it('displays error card when screen has errors', async () => {
        const screen = createTestScreen('Screen 1', null);
        screen.helpText.error = 'text too long';
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });

        await ticks(1);
        const headerHighlight = screenEditorCanvasElement.shadowRoot.querySelector(selectors.highlightElementSlot);
        const screenFieldCard = headerHighlight.querySelector(selectors.screenFieldCard);
        expect(screenFieldCard).not.toBeNull();
        const cardBody = screenFieldCard.shadowRoot.querySelector(selectors.screenFieldCardBody);
        expect(cardBody).not.toBeNull();
        expect(cardBody.textContent).toEqual('FlowBuilderScreenEditor.invalidScreen');
    });

    it('displays flow label when screen has no error and flow label is defined', async () => {
        const screen = createTestScreen('Screen 1', null);
        const flowLabel = 'Flow Label';
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {},
            flowLabel
        });

        await ticks(1);
        const headerHighlight = screenEditorCanvasElement.shadowRoot.querySelector(selectors.highlightElementSlot);
        const screenCanvasHeader = headerHighlight.querySelector(selectors.screenCanvasHeader);
        expect(screenCanvasHeader.textContent).toEqual(flowLabel);
    });

    it('displays default string when screen has no error and flow label is not defined', async () => {
        const screen = createTestScreen('Screen 1', null);
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });

        await ticks(1);
        const headerHighlight = screenEditorCanvasElement.shadowRoot.querySelector(selectors.highlightElementSlot);
        const screenCanvasHeader = headerHighlight.querySelector(selectors.screenCanvasHeader);
        expect(screenCanvasHeader.textContent).toEqual('[FlowBuilderScreenEditor.screenTitlePlaceHolder]');
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
    it('screen header is not draggable', async () => {
        await ticks(1);
        const header = screenEditorCanvasElement.shadowRoot.querySelector(
            'div.screen-editor-canvas-content builder_platform_interaction-screen-editor-highlight'
        );
        expect(header.draggable).toBeFalsy();
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
    it('clicking on the canvas fires correct event', async () => {
        await ticks(1);
        const eventCallback = jest.fn().mockImplementation();
        screenEditorCanvasElement.addEventListener(SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_SELECTED, eventCallback);
        const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
        const selectEvent = createScreenElementSelectedEvent();
        canvasDiv.dispatchEvent(selectEvent);
        expect(eventCallback).toHaveBeenCalled();
    });
});
