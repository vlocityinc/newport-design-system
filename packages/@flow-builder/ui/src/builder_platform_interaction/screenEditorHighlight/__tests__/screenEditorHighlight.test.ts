import {
    dragStartEvent,
    LIGHTNING_COMPONENTS_SELECTORS,
    mouseoutEvent,
    mouseoverEvent,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { createScreenFieldWithFields } from 'builder_platform_interaction/elementFactory';
import { ScreenEditorEventName } from 'builder_platform_interaction/events';
import ScreenEditorHighlight from 'builder_platform_interaction/screenEditorHighlight';
import {
    CANVAS_SCREEN_GUIDS,
    CONTAINER_DIV_SELECTOR,
    DRAGGING_CLASS,
    HIGHLIGHT_DIV_HEADER,
    HOVERING_CLASS,
    ScreenCanvasKeyboardInteractions,
    VISIBILITY_ICON,
    VISIBILITY_ICON_CONTAINER
} from 'builder_platform_interaction/screenEditorUtils';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import {
    accountVariableNameAutomaticField,
    emailScreenField,
    flowWithAllElementsUIModel,
    screenFieldAccounts,
    screenFieldTextBoxSomeText
} from 'mock/storeData';

const { Keys } = keyboardInteractionUtils;

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/screenEditorUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/screenEditorUtils');
    return Object.assign({}, actual, {
        setDragFieldValue: () => {}
    });
});

const createComponentForTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor-highlight', { is: ScreenEditorHighlight });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

const getContainerDiv = (highlight) => highlight.shadowRoot.querySelector(CONTAINER_DIV_SELECTOR);
const clickHighlight = async (highlight, callback) => {
    const highlightDiv = getContainerDiv(highlight);
    highlight.addEventListener(ScreenEditorEventName.ScreenElementSelected, callback);
    highlightDiv.click();
    await ticks(1);
};
const getVisibilityIconContainer = (element) => element.shadowRoot.querySelector(VISIBILITY_ICON_CONTAINER);
const getVisibilityIconNoShadow = (parent) => parent.querySelector(VISIBILITY_ICON);
const getHeaderBadge = (element) => element.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BADGE);
const getHeader = (element) => element.shadowRoot.querySelector(HIGHLIGHT_DIV_HEADER);
const getIconInHeader = (parent) => parent.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON);

const createKeyDownEvent = (key) => {
    return new KeyboardEvent('keydown', { key, code: key === Keys.Space ? 'Space' : key });
};

describe('Click highlight', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: screenFieldTextBoxSomeText
        });
    });
    test('clicking on highlight component fires correct event', async () => {
        const callback = jest.fn();
        await clickHighlight(highlight, callback);
        expect(callback).toHaveBeenCalled();
    });
    it('should not fire an event when already selected', async () => {
        highlight.selected = true;
        const callback = jest.fn();
        await clickHighlight(highlight, callback);
        expect(callback).not.toHaveBeenCalled();
    });
});
describe('onDragStart', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: screenFieldTextBoxSomeText
        });
    });
    test('dragging an element sets correct dataTransfer', async () => {
        const dragStart = dragStartEvent() as CustomEvent & { dataTransfer };
        const highlightDiv = getContainerDiv(highlight);
        highlightDiv.dispatchEvent(dragStart);
        await ticks(1);
        expect(dragStart.dataTransfer.effectAllowed).toBe('move');
        expect(dragStart.dataTransfer.getData('text')).toBe(highlight.screenElement.guid);
        expect(highlightDiv.classList).toContain(DRAGGING_CLASS);
    });
});
describe('onDragEnd', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: screenFieldTextBoxSomeText
        });
    });
    test('The end of dragging an element sets the correct styling', async () => {
        const dragStart = dragStartEvent();
        const dragEndEvent = new CustomEvent('dragend');

        const highlightDiv = highlight.shadowRoot.querySelector(CONTAINER_DIV_SELECTOR);
        highlightDiv.dispatchEvent(dragStart);
        await ticks(1);
        highlightDiv.dispatchEvent(dragEndEvent);
        await ticks(1);
        expect(highlightDiv.classList).not.toContain(DRAGGING_CLASS);
    });
});
describe('highlight behavior on hover', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: screenFieldTextBoxSomeText
        });
    });

    test('mouse over sets the correct styling', async () => {
        const highlightDiv = highlight.shadowRoot.querySelector(CONTAINER_DIV_SELECTOR);
        expect(highlightDiv.classList).not.toContain(HOVERING_CLASS);

        highlightDiv.dispatchEvent(mouseoverEvent());
        await ticks(1);
        expect(highlightDiv.classList).toContain(HOVERING_CLASS);
    });

    test('mouse out sets the correct styling', async () => {
        const highlightDiv = highlight.shadowRoot.querySelector(CONTAINER_DIV_SELECTOR);

        highlightDiv.dispatchEvent(mouseoverEvent());
        await ticks(1);

        highlightDiv.dispatchEvent(mouseoutEvent());
        await ticks(1);
        expect(highlightDiv.classList).not.toContain(HOVERING_CLASS);
    });
});
describe('Header (Icon/Visibility Icon/Badge)', () => {
    let element: ScreenEditorHighlight;
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    describe('Icon', () => {
        describe('when icon changes in screen field', () => {
            beforeEach(() => {
                element = createComponentForTest({ screenElement: emailScreenField });
            });
            it('hightlight icon should be correct', async () => {
                const header = getHeader(element);
                expect(header).not.toBeNull();
                const icon = getIconInHeader(header);
                expect(icon).not.toBeNull();
                expect(icon.iconName).toEqual('standard:lightning_component');
                const screenField = emailScreenField;
                screenField.type.icon = 'foobar';
                element.screenElement = screenField;
                await ticks(1);
                expect(icon).not.toBeNull();
                expect(icon.iconName).toEqual('foobar');
            });
        });
    });
    describe('Visibility Icon', () => {
        describe('screen field has visibility condition', () => {
            beforeEach(() => {
                element = createComponentForTest({ screenElement: screenFieldAccounts });
            });
            test('visibility icon should be visible', () => {
                const iconContainer = getVisibilityIconContainer(element);
                expect(iconContainer).not.toBeNull();
                expect(iconContainer.hidden).toBe(false);
                const icon = getVisibilityIconNoShadow(iconContainer);
                expect(icon).not.toBeNull();
                expect(icon.iconName).not.toBeNull();
            });
            it('should have an alternative text', () => {
                const iconContainer = getVisibilityIconContainer(element);
                const icon = getVisibilityIconNoShadow(iconContainer);
                expect(icon.alternativeText).toBe('FlowBuilderScreenEditor.altTextVisibilityCondition');
            });
            describe('When Selected', () => {
                beforeEach(async () => {
                    element.selected = true;
                });
                it('visibility icon should be visible in the frame', async () => {
                    const iconContainer = getVisibilityIconContainer(element);
                    expect(iconContainer).not.toBeNull();
                    expect(iconContainer.hidden).toBe(false);
                    const icon = getVisibilityIconNoShadow(iconContainer);
                    expect(icon).not.toBeNull();
                    expect(icon.iconName).not.toBeNull();
                });
            });
        });
        describe('screen field has NO visibility condition', () => {
            beforeEach(() => {
                element = createComponentForTest({ screenElement: emailScreenField });
            });
            it('visibility icon should NOT be visible', async () => {
                const icon = getVisibilityIconContainer(element);
                expect(icon).toBeNull();
            });
            describe('When Selected', () => {
                beforeEach(async () => {
                    element.selected = true;
                });
                it('visibility icon should NOT be visible in the frame', async () => {
                    const iconContainer = getVisibilityIconContainer(element);
                    expect(iconContainer).toBeNull();
                });
            });
        });
    });
    describe('Badge', () => {
        test.each`
            label     | screenField                          | isBadgeVisible
            ${''}     | ${accountVariableNameAutomaticField} | ${true}
            ${' NOT'} | ${emailScreenField}                  | ${false}
        `(
            'For a screenField that is$label an automatic field the badge should$label be displayed (if so with correct label and CSS class)',
            ({ screenField, isBadgeVisible }) => {
                element = createComponentForTest({ screenElement: createScreenFieldWithFields(screenField) });
                const badge = getHeaderBadge(element);
                expect(!!badge).toBe(isBadgeVisible);
                if (badge) {
                    expect(badge!.label).toEqual('FlowBuilderScreenEditor.automaticFieldHighlightHeaderFieldLabel');
                    expect(badge!.className).toEqual('slds-m-left_xx-small automatic-field-badge');
                }
            }
        );
    });
});

describe('Keyboard interactions on a component', () => {
    describe('Selecting a component with Enter', () => {
        let highlight, highlightDiv;
        beforeEach(() => {
            highlight = createComponentForTest({
                screenElement: screenFieldTextBoxSomeText
            });
            highlightDiv = getContainerDiv(highlight);
        });
        it('selecting component with Enter dispatches the correct event', () => {
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementSelected, callback);
            const event = createKeyDownEvent(Keys.Enter);
            highlightDiv.dispatchEvent(event);
            expect(callback).toHaveBeenCalled();
        });
        it('should not fire an event when already selected', () => {
            highlight.selected = true;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementSelected, callback);
            const event = createKeyDownEvent(Keys.Enter);
            highlightDiv.dispatchEvent(event);
            expect(callback).not.toHaveBeenCalled();
        });
        it('should not fire an event when in move mode', () => {
            highlight.isInKeyboardReorderableMode = true;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementSelected, callback);
            const event = createKeyDownEvent(Keys.Enter);
            highlightDiv.dispatchEvent(event);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Deleting a component with Backspace key', () => {
        let highlight, highlightDiv;
        beforeEach(() => {
            highlight = createComponentForTest({
                screenElement: screenFieldTextBoxSomeText
            });
            highlightDiv = getContainerDiv(highlight);
        });
        it('deleting component with Backspace dispatches the correct event', () => {
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementDeleted, callback);
            const event = createKeyDownEvent(Keys.Backspace);
            highlightDiv.dispatchEvent(event);
            expect(callback).toHaveBeenCalled();
        });
        it('should not fire an event when in move mode', () => {
            highlight.isInKeyboardReorderableMode = true;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementSelected, callback);
            const event = createKeyDownEvent(Keys.Backspace);
            highlightDiv.dispatchEvent(event);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Deleting a component with Delete key', () => {
        let highlight, highlightDiv;
        beforeEach(() => {
            highlight = createComponentForTest({
                screenElement: screenFieldTextBoxSomeText
            });
            highlightDiv = getContainerDiv(highlight);
        });
        it('deleting component with Delete dispatches the correct event', () => {
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementDeleted, callback);
            const event = createKeyDownEvent(Keys.Delete);
            highlightDiv.dispatchEvent(event);
            expect(callback).toHaveBeenCalled();
        });
        it('should not fire an event when in move mode', () => {
            highlight.isInKeyboardReorderableMode = true;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementSelected, callback);
            const event = createKeyDownEvent(Keys.Delete);
            highlightDiv.dispatchEvent(event);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Entering / Exiting the move mode with Space key', () => {
        let highlight, highlightDiv;
        beforeEach(() => {
            highlight = createComponentForTest({
                screenElement: screenFieldTextBoxSomeText
            });
            highlightDiv = getContainerDiv(highlight);
        });
        it('Entering the move mode of a component dispatches the correct event', () => {
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            const event = createKeyDownEvent(Keys.Space);
            highlightDiv.dispatchEvent(event);
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: {
                        sourceGuid: highlight.screenElement.guid,
                        interaction: ScreenCanvasKeyboardInteractions.Start
                    }
                })
            );
        });
        it("Does not dispatch event to enter move mode if it's a header component", () => {
            const callback = jest.fn();
            highlight.property = CANVAS_SCREEN_GUIDS.HEADER_GUID;
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            const event = createKeyDownEvent(Keys.Space);
            highlightDiv.dispatchEvent(event);
            expect(callback).not.toHaveBeenCalled();
        });

        it("Does not dispatch event to enter move mode if it's a footer component", () => {
            const callback = jest.fn();
            highlight.property = CANVAS_SCREEN_GUIDS.FOOTER_GUID;
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            const event = createKeyDownEvent(Keys.Space);
            highlightDiv.dispatchEvent(event);
            expect(callback).not.toHaveBeenCalled();
        });
        it('Exiting the move mode of a component dispatches the correct event', () => {
            highlight.isInKeyboardReorderableMode = true;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            const event = createKeyDownEvent(Keys.Space);
            highlightDiv.dispatchEvent(event);
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: {
                        sourceGuid: highlight.screenElement.guid,
                        interaction: ScreenCanvasKeyboardInteractions.Stop
                    }
                })
            );
        });
    });

    describe('Canceling the current move with Escape key', () => {
        let highlight, highlightDiv;
        beforeEach(() => {
            highlight = createComponentForTest({
                screenElement: screenFieldTextBoxSomeText
            });
            highlightDiv = getContainerDiv(highlight);
        });
        it('Canceling dispatches the correct event if in move mode', () => {
            highlight.isInKeyboardReorderableMode = true;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            const event = createKeyDownEvent(Keys.Escape);
            highlightDiv.dispatchEvent(event);
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: {
                        sourceGuid: highlight.screenElement.guid,
                        interaction: ScreenCanvasKeyboardInteractions.Cancel
                    }
                })
            );
        });
        it('Should not fire an event to cancel if not in move mode', () => {
            highlight.isInKeyboardReorderableMode = false;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            const event = createKeyDownEvent(Keys.Escape);
            highlightDiv.dispatchEvent(event);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Putting focus on a component', () => {
        let highlight, highlightDiv;
        beforeEach(() => {
            highlight = createComponentForTest({
                screenElement: screenFieldTextBoxSomeText
            });
            highlightDiv = getContainerDiv(highlight);
        });
        it('Dispatches the correct event if not in move mode', () => {
            highlight.isInKeyboardReorderableMode = false;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            highlightDiv.focus();
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: {
                        sourceGuid: highlight.screenElement.guid,
                        interaction: ScreenCanvasKeyboardInteractions.Focus
                    }
                })
            );
        });
        it('Should not fire an event if in move mode', () => {
            highlight.isInKeyboardReorderableMode = true;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            highlightDiv.focus();
            expect(callback).not.toHaveBeenCalled();
        });
        it('Should not fire an event if component is header', () => {
            highlight.isInKeyboardReorderableMode = false;
            highlight.property = CANVAS_SCREEN_GUIDS.HEADER_GUID;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            highlightDiv.focus();
            expect(callback).not.toHaveBeenCalled();
        });
        it('Should not fire an event if component is footer', () => {
            highlight.isInKeyboardReorderableMode = false;
            highlight.property = CANVAS_SCREEN_GUIDS.FOOTER_GUID;
            const callback = jest.fn();
            highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
            highlightDiv.focus();
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('Moving a component with arrow keys fires the correct event to Screen Editor Canvas', () => {
        describe('Moving a component with the up arrow', () => {
            let highlight, highlightDiv;
            beforeEach(() => {
                highlight = createComponentForTest({
                    screenElement: screenFieldTextBoxSomeText
                });
                highlightDiv = getContainerDiv(highlight);
            });
            it('Moving a component with the up arrow dispatches the correct event', () => {
                highlight.isInKeyboardReorderableMode = true;
                const callback = jest.fn();
                highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
                const event = createKeyDownEvent(Keys.ArrowUp);
                highlightDiv.dispatchEvent(event);
                expect(callback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: highlight.screenElement.guid,
                            interaction: ScreenCanvasKeyboardInteractions.Up
                        }
                    })
                );
            });
            it('Should not fire an event if not in move mode', () => {
                highlight.isInKeyboardReorderableMode = false;
                const callback = jest.fn();
                highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
                const event = createKeyDownEvent(Keys.ArrowUp);
                highlightDiv.dispatchEvent(event);
                expect(callback).not.toHaveBeenCalled();
            });
        });

        describe('Moving a component with the down arrow', () => {
            let highlight, highlightDiv;
            beforeEach(() => {
                highlight = createComponentForTest({
                    screenElement: screenFieldTextBoxSomeText
                });
                highlightDiv = getContainerDiv(highlight);
            });
            it('Moving a component with the down arrow dispatches the correct event', () => {
                highlight.isInKeyboardReorderableMode = true;
                const callback = jest.fn();
                highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
                const event = createKeyDownEvent(Keys.ArrowDown);
                highlightDiv.dispatchEvent(event);
                expect(callback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: highlight.screenElement.guid,
                            interaction: ScreenCanvasKeyboardInteractions.Down
                        }
                    })
                );
            });
            it('Should not fire an event if not in move mode', () => {
                highlight.isInKeyboardReorderableMode = false;
                const callback = jest.fn();
                highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
                const event = createKeyDownEvent(Keys.ArrowDown);
                highlightDiv.dispatchEvent(event);
                expect(callback).not.toHaveBeenCalled();
            });
        });

        describe('Moving a component with the left arrow', () => {
            let highlight, highlightDiv;
            beforeEach(() => {
                highlight = createComponentForTest({
                    screenElement: screenFieldTextBoxSomeText
                });
                highlightDiv = getContainerDiv(highlight);
            });
            it('Moving a component with the left arrow dispatches the correct event', () => {
                highlight.isInKeyboardReorderableMode = true;
                const callback = jest.fn();
                highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
                const event = createKeyDownEvent(Keys.ArrowLeft);
                highlightDiv.dispatchEvent(event);
                expect(callback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: highlight.screenElement.guid,
                            interaction: ScreenCanvasKeyboardInteractions.Left
                        }
                    })
                );
            });
            it('Should not fire an event if not in move mode', () => {
                highlight.isInKeyboardReorderableMode = false;
                const callback = jest.fn();
                highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
                const event = createKeyDownEvent(Keys.ArrowLeft);
                highlightDiv.dispatchEvent(event);
                expect(callback).not.toHaveBeenCalled();
            });
        });

        describe('Moving a component with the right arrow', () => {
            let highlight, highlightDiv;
            beforeEach(() => {
                highlight = createComponentForTest({
                    screenElement: screenFieldTextBoxSomeText
                });
                highlightDiv = getContainerDiv(highlight);
            });
            it('Moving a component with the right arrow dispatches the correct event', () => {
                highlight.isInKeyboardReorderableMode = true;
                const callback = jest.fn();
                highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
                const event = createKeyDownEvent(Keys.ArrowRight);
                highlightDiv.dispatchEvent(event);
                expect(callback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        detail: {
                            sourceGuid: highlight.screenElement.guid,
                            interaction: ScreenCanvasKeyboardInteractions.Right
                        }
                    })
                );
            });
            it('Should not fire an event if not in move mode', () => {
                highlight.isInKeyboardReorderableMode = false;
                const callback = jest.fn();
                highlight.addEventListener(ScreenEditorEventName.ScreenElementKeyboardInteraction, callback);
                const event = createKeyDownEvent(Keys.ArrowRight);
                highlightDiv.dispatchEvent(event);
                expect(callback).not.toHaveBeenCalled();
            });
        });
    });
});
