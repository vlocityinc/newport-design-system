// @ts-nocheck
import { createElement } from 'lwc';
import ScreenEditorCanvas from '../screenEditorCanvas';
import { createTestScreen, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { createScreenElementSelectedEvent, ScreenEditorEventName } from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { hydrateIfNecessary } from 'builder_platform_interaction/dataMutationLib';
import { FOOTER_LABEL_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor-canvas', {
        is: ScreenEditorCanvas
    });
    if (props) {
        Object.assign(el, props);
    }
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    lightningButtonIcon: 'lightning-button-icon',
    canvasContainer: 'div.screen-editor-canvas-container',
    highlightElementSlot: 'div[slot="screen-element"]',
    screenFieldCard: 'builder_platform_interaction-screen-field-card',
    screenFieldCardBody: 'p.slds-text-heading_small',
    screenCanvasHeader: 'span.slds-card__header-link',
    nextOrFinishBtn: '.test-next-or-finish-btn',
    backBtn: '.test-back-btn',
    pauseBtn: '.test-pause-btn'
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
        screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementSelected, eventCallback);
        const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
        const selectEvent = createScreenElementSelectedEvent();
        canvasDiv.dispatchEvent(selectEvent);
        expect(eventCallback).toHaveBeenCalled();
    });
});

describe('Screen canvas footer labels', () => {
    let screen;
    beforeEach(() => {
        screen = createTestScreen('Screen 1', null);
    });
    it('Footer label is shown when footer label type is STANDARD', () => {
        screen.nextOrFinishLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.STANDARD);
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const nextOrFinishBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.nextOrFinishBtn);
        expect(nextOrFinishBtn).toBeDefined();
    });
    it('Footer label is not shown when footer label type is HIDE', () => {
        screen.nextOrFinishLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.HIDE);
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const nextOrFinishBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.nextOrFinishBtn);
        expect(nextOrFinishBtn).toBeNull();
    });

    it('Next or Finish Footer label is not shown when footer label type is CUSTOM but label is empty or not defined', () => {
        screen.nextOrFinishLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.CUSTOM);
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const nextOrFinishBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.nextOrFinishBtn);
        expect(nextOrFinishBtn).toBeNull();
    });
    it('Back Footer label is not shown when footer label type is CUSTOM but label is empty or not defined', () => {
        screen.backLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.CUSTOM);
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const backLabelBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.backBtn);
        expect(backLabelBtn).toBeNull();
    });
    it('Pause Footer label is not shown when footer label type is CUSTOM but label is empty or not defined', () => {
        screen.pauseLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.CUSTOM);
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const pauseBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.pauseBtn);
        expect(pauseBtn).toBeNull();
    });

    it('Next or Finish footer label is shown nextOrFinishLabelType is CUSTOM and nextOrFinishLabel is defined', () => {
        screen.nextOrFinishLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.CUSTOM);
        screen.nextOrFinishLabel = hydrateIfNecessary('Custom Next');
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const nextOrFinishBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.nextOrFinishBtn);
        expect(nextOrFinishBtn).toBeDefined();
    });
    it('Back footer label is shown backLabelType is CUSTOM and backLabel is defined', () => {
        screen.backLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.CUSTOM);
        screen.backLabel = hydrateIfNecessary('Custom Back');
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const backBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.backBtn);
        expect(backBtn).toBeDefined();
    });
    it('Pause footer label is shown pauseLabelType is CUSTOM and pauseLabel is defined', () => {
        screen.pauseLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.CUSTOM);
        screen.pauseLabel = hydrateIfNecessary('Custom Pause');
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const pauseBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.pauseBtn);
        expect(pauseBtn).toBeDefined();
    });
    it('Footer label shown is standard label when label type is not CUSTOM', () => {
        screen.nextOrFinishLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.STANDARD);
        screen.nextOrFinishLabel = hydrateIfNecessary('Custom Next');
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const nextOrFinishBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.nextOrFinishBtn);
        expect(nextOrFinishBtn.textContent).toEqual(LABELS.finish);
    });
    it('Footer label shown is custom label when label type is CUSTOM', () => {
        screen.nextOrFinishLabelType = hydrateIfNecessary(FOOTER_LABEL_TYPE.CUSTOM);
        const label = 'Custom Next';
        screen.nextOrFinishLabel = hydrateIfNecessary(label);
        const screenEditorCanvasElement = createComponentUnderTest({
            screen,
            labels: {}
        });
        const nextOrFinishBtn = screenEditorCanvasElement.shadowRoot.querySelector(selectors.nextOrFinishBtn);
        expect(nextOrFinishBtn.textContent).toEqual(label);
    });
});
