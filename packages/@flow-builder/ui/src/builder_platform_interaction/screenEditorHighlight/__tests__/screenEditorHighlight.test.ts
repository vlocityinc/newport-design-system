import { createElement } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import ScreenEditorHighlight from 'builder_platform_interaction/screenEditorHighlight';
import { ScreenEditorEventName } from 'builder_platform_interaction/events';
import {
    ticks,
    mouseoverEvent,
    mouseoutEvent,
    dragStartEvent,
    setDocumentBodyChildren,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import {
    DRAGGING_CLASS,
    HOVERING_CLASS,
    CONTAINER_DIV_SELECTOR,
    VISIBILITY_ICON,
    VISIBILITY_ICON_CONTAINER,
    HIGHLIGHT_DIV_HEADER
} from 'builder_platform_interaction/screenEditorUtils';
import {
    flowWithAllElementsUIModel,
    screenFieldAccounts,
    emailScreenField,
    screenFieldTextBoxSomeText,
    accountVariableNameAutomaticField
} from 'mock/storeData';
import { createScreenFieldWithFields } from 'builder_platform_interaction/elementFactory';

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
