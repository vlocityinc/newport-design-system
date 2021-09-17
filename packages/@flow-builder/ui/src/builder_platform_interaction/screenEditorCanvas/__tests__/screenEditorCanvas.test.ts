// @ts-nocheck
import { createElement } from 'lwc';
import ScreenEditorCanvas from '../screenEditorCanvas';
import { createTestScreen, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import {
    createScreenElementKeyboardInteractionEvent,
    createScreenElementSelectedEvent,
    ScreenEditorEventName
} from 'builder_platform_interaction/events';
import { ScreenCanvasKeyboardInteractions } from 'builder_platform_interaction/screenEditorUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    flowWithAllElementsUIModel,
    screenWithSection,
    slider1,
    dateTimeInSection,
    section2Column1,
    text2,
    address2,
    section2Column2,
    number2,
    section1,
    section2,
    email2
} from 'mock/storeData';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { hydrateIfNecessary } from 'builder_platform_interaction/dataMutationLib';
import { FOOTER_LABEL_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

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
    pauseBtn: '.test-pause-btn',
    ariaLiveRegion: '.aria-live-instruction'
};

beforeAll(() => {
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    Store.resetStore();
});

describe('screen editor canvas', () => {
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

    describe('handle screen element keyboard interaction', () => {
        let screenEditorCanvasElement, screen;
        beforeAll(() => {
            /* Layout of Screen Canvas
                - ScreenWithSection_Section1
                    - ScreenWithSection_Section1_Column1
                        - slider_1
                - number_2
                - ScreenWithSection_Section2
                    - ScreenWithSection_Section2_Column1
                        - text_2
                        - dateTimeInSection
                    - ScreenWithSection_Section2_Column2
                        - email_2
                        - accounts
                - address_2
                */
            screen = getElementForPropertyEditor(screenWithSection);
            screenEditorCanvasElement = createComponentUnderTest({
                screen
            });
        });
        describe('move a component', () => {
            it('should fire the correct event when moving a component out of a section (up)', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    slider1.guid,
                    ScreenCanvasKeyboardInteractions.Up
                ); // move slider1 up
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: slider1.guid,
                            destinationParentGuid: screen.guid,
                            destinationIndex: 0
                        }
                    })
                );
            });

            it('should fire the correct event when moving a component out of a section (down)', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    slider1.guid,
                    ScreenCanvasKeyboardInteractions.Down
                ); // move slider1 down
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: slider1.guid,
                            destinationParentGuid: screen.guid,
                            destinationIndex: 1
                        }
                    })
                );
            });

            it('should fire the correct event when using up arrow to move a component within its column', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    dateTimeInSection.guid,
                    ScreenCanvasKeyboardInteractions.Up
                ); // move date up
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: dateTimeInSection.guid,
                            destinationParentGuid: section2Column1.guid,
                            destinationIndex: 0
                        }
                    })
                );
            });

            it('should fire the correct event when using down arrow to move a component within its column', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    text2.guid,
                    ScreenCanvasKeyboardInteractions.Down
                ); // move text2 down
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: text2.guid,
                            destinationParentGuid: section2Column1.guid,
                            destinationIndex: 2 // 2 instead of 1 because we decrement this by 1 in screenReducer's moveFieldEvent
                        }
                    })
                );
            });

            it('should fire the correct event when using up arrow to move a component into a section', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    address2.guid,
                    ScreenCanvasKeyboardInteractions.Up
                ); // move address2 up
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: address2.guid,
                            destinationParentGuid: section2Column2.guid,
                            destinationIndex: 2
                        }
                    })
                );
            });

            it('should fire the correct event when using down arrow to move a component into a section', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    number2.guid,
                    ScreenCanvasKeyboardInteractions.Down
                ); // move number2 down
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: number2.guid,
                            destinationParentGuid: section2Column1.guid,
                            destinationIndex: 0
                        }
                    })
                );
            });
            it('should fire the correct event when using up arrow to move a section within the main canvas', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    section2.guid,
                    ScreenCanvasKeyboardInteractions.Up
                ); // move section 2 up
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: section2.guid,
                            destinationParentGuid: screen.guid,
                            destinationIndex: 1
                        }
                    })
                );
            });
            it('should fire the correct event when using down arrow to section a component within the main canvas', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    section2.guid,
                    ScreenCanvasKeyboardInteractions.Down
                ); // move section 2 down
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: section2.guid,
                            destinationParentGuid: screen.guid,
                            destinationIndex: 4 // 4 instead of 3 because we decrement this by 1 in screenReducer's moveFieldEvent
                        }
                    })
                );
            });

            it('should not fire an event when using up arrow to move the first component in the main canvas', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    section1.guid,
                    ScreenCanvasKeyboardInteractions.Up
                ); // move section1 up
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).not.toHaveBeenCalled();
            });

            it('should not fire an event when using down arrow to move the last component in the main canvas', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    address2.guid,
                    ScreenCanvasKeyboardInteractions.Down
                ); // move address2 down
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).not.toHaveBeenCalled();
            });

            it('should not fire an event when using left / right arrow to move a component not in a section', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event1 = createScreenElementKeyboardInteractionEvent(
                    address2.guid,
                    ScreenCanvasKeyboardInteractions.Left
                ); // move address2 left
                canvasDiv.dispatchEvent(event1);
                const event2 = createScreenElementKeyboardInteractionEvent(
                    address2.guid,
                    ScreenCanvasKeyboardInteractions.Right
                ); // move address2 right
                canvasDiv.dispatchEvent(event2);
                expect(eventCallback).not.toHaveBeenCalled();
            });

            it('should fire the correct event when using left arrow to move a component to the left column', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    email2.guid,
                    ScreenCanvasKeyboardInteractions.Left
                ); // Move email2 left
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: email2.guid,
                            destinationParentGuid: section2Column1.guid,
                            destinationIndex: 2
                        }
                    })
                );
            });

            it('should not fire an event when using left arrow to move a component in the leftmost column', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    text2.guid,
                    ScreenCanvasKeyboardInteractions.Left
                ); // Move text2 left
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).not.toHaveBeenCalled();
            });

            it('should fire the correct event when using right arrow to move a component to the right column', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    text2.guid,
                    ScreenCanvasKeyboardInteractions.Right
                ); // Move text2 right
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: text2.guid,
                            destinationParentGuid: section2Column2.guid,
                            destinationIndex: 0
                        }
                    })
                );
            });

            it('should not fire an event when using right arrow to move a component in the rightmost column', () => {
                const eventCallback = jest.fn().mockImplementation();
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                const canvasDiv = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    email2.guid,
                    ScreenCanvasKeyboardInteractions.Right
                ); // Move email2 right
                canvasDiv.dispatchEvent(event);
                expect(eventCallback).not.toHaveBeenCalled();
            });
        });

        describe('cancel a move with keyboard', () => {
            it('should fire the correct event when component was originally outside section', () => {
                const eventCallback = jest.fn().mockImplementation();
                const canvasContainer = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event1 = createScreenElementKeyboardInteractionEvent(
                    number2.guid,
                    ScreenCanvasKeyboardInteractions.Start
                );
                canvasContainer.dispatchEvent(event1);
                const event2 = createScreenElementKeyboardInteractionEvent(
                    number2.guid,
                    ScreenCanvasKeyboardInteractions.Cancel
                );
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                canvasContainer.dispatchEvent(event2);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: number2.guid,
                            destinationParentGuid: screen.guid,
                            destinationIndex: 2
                        }
                    })
                );
            });

            it('should fire the correct event when component was originally in section', () => {
                const eventCallback = jest.fn().mockImplementation();
                const canvasContainer = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event1 = createScreenElementKeyboardInteractionEvent(
                    text2.guid,
                    ScreenCanvasKeyboardInteractions.Start
                );
                canvasContainer.dispatchEvent(event1);
                const event2 = createScreenElementKeyboardInteractionEvent(
                    text2.guid,
                    ScreenCanvasKeyboardInteractions.Cancel
                );
                screenEditorCanvasElement.addEventListener(ScreenEditorEventName.ScreenElementMoved, eventCallback);
                canvasContainer.dispatchEvent(event2);
                expect(eventCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: text2.guid,
                            destinationParentGuid: section2Column1.guid,
                            destinationIndex: 1
                        }
                    })
                );
            });
        });

        describe('start a move with keyboard', () => {
            it('should construct the correct aria text when the component is not within a section', async () => {
                const canvasContainer = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    number2.guid,
                    ScreenCanvasKeyboardInteractions.Start
                );
                await canvasContainer.dispatchEvent(event);
                let expectedString = format(LABELS.componentGrabbedMessage, number2.type.label, number2.name);
                expectedString += format(LABELS.componentCurrentPosition, 2, 4);
                expectedString += LABELS.componentStartMovingInstruction;
                const ariaLiveSpan = screenEditorCanvasElement.shadowRoot.querySelectorAll(selectors.ariaLiveRegion)[0];
                expect(ariaLiveSpan.textContent).toEqual(expectedString);
            });
            it('should construct the correct aria text when the component is within a section', async () => {
                const canvasContainer = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    text2.guid,
                    ScreenCanvasKeyboardInteractions.Start
                );
                await canvasContainer.dispatchEvent(event);
                let expectedString = format(LABELS.componentGrabbedMessage, text2.type.label, text2.name);
                expectedString += format(LABELS.columnPosition, 1, 2);
                expectedString += format(LABELS.componentCurrentPosition, 1, 2);
                expectedString += LABELS.componentStartMovingInstruction;
                const ariaLiveSpan = screenEditorCanvasElement.shadowRoot.querySelectorAll(selectors.ariaLiveRegion)[0];
                expect(ariaLiveSpan.textContent).toEqual(expectedString);
            });
        });
        describe('stop a move with keyboard', () => {
            it('should construct the correct aria text when the component is not within a section', async () => {
                const canvasContainer = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    number2.guid,
                    ScreenCanvasKeyboardInteractions.Stop
                );
                await canvasContainer.dispatchEvent(event);
                let expectedString = format(LABELS.componentDroppedMessage, number2.type.label, number2.name);
                expectedString += format(LABELS.componentFinalPosition, 2, 4);
                const ariaLiveSpan = screenEditorCanvasElement.shadowRoot.querySelectorAll(selectors.ariaLiveRegion)[0];
                expect(ariaLiveSpan.textContent).toEqual(expectedString);
            });
            it('should construct the correct aria text when the component is within a section', async () => {
                const canvasContainer = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    text2.guid,
                    ScreenCanvasKeyboardInteractions.Stop
                );
                await canvasContainer.dispatchEvent(event);
                let expectedString = format(LABELS.componentDroppedMessage, text2.type.label, text2.name);
                expectedString += format(LABELS.columnPosition, 1, 2);
                expectedString += format(LABELS.componentFinalPosition, 1, 2);
                const ariaLiveSpan = screenEditorCanvasElement.shadowRoot.querySelectorAll(selectors.ariaLiveRegion)[0];
                expect(ariaLiveSpan.textContent).toEqual(expectedString);
            });
        });
        describe('focus on a specific component', () => {
            it('should construct the correct aria text when the component is not within a section', async () => {
                const canvasContainer = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    number2.guid,
                    ScreenCanvasKeyboardInteractions.Focus
                );
                await canvasContainer.dispatchEvent(event);
                let expectedString = format(LABELS.componentCurrentPosition, 2, 4);
                expectedString += LABELS.componentKeyboardInstruction;
                const ariaLiveSpan = screenEditorCanvasElement.shadowRoot.querySelectorAll(selectors.ariaLiveRegion)[1];
                expect(ariaLiveSpan.textContent).toEqual(expectedString);
            });
            it('should construct the correct aria text when the component is within a section', async () => {
                const canvasContainer = screenEditorCanvasElement.shadowRoot.querySelector(selectors.canvasContainer);
                const event = createScreenElementKeyboardInteractionEvent(
                    text2.guid,
                    ScreenCanvasKeyboardInteractions.Focus
                );
                await canvasContainer.dispatchEvent(event);
                let expectedString = format(LABELS.columnPosition, 1, 2);
                expectedString += format(LABELS.componentCurrentPosition, 1, 2);
                expectedString += LABELS.componentKeyboardInstruction;
                const ariaLiveSpan = screenEditorCanvasElement.shadowRoot.querySelectorAll(selectors.ariaLiveRegion)[1];
                expect(ariaLiveSpan.textContent).toEqual(expectedString);
            });
        });
    });
});
