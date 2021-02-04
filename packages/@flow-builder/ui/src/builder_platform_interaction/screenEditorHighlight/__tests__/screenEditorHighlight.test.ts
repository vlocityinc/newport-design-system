// @ts-nocheck
import { createElement } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import ScreenEditorHighlight from 'builder_platform_interaction/screenEditorHighlight';
import { ScreenEditorEventName } from 'builder_platform_interaction/events';
import {
    ticks,
    mouseoverEvent,
    mouseoutEvent,
    dragStartEvent,
    setDocumentBodyChildren
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
    screenFieldTextBoxSomeText
} from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/screenEditorUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/screenEditorUtils');
    return Object.assign({}, actual, {
        setDragFieldValue: () => {}
    });
});

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-editor-highlight', { is: ScreenEditorHighlight });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

function clickHighlight(highlight, callback) {
    const highlightDiv = highlight.shadowRoot.querySelector(CONTAINER_DIV_SELECTOR);
    highlight.addEventListener(ScreenEditorEventName.ScreenElementSelected, callback);
    highlightDiv.click();
}

function getVisibilityIconContainer(element) {
    return element.shadowRoot.querySelector(VISIBILITY_ICON_CONTAINER);
}

function getVisibiltyIconNoShadow(parent) {
    return parent.querySelector(VISIBILITY_ICON);
}

describe('Click highlight', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: screenFieldTextBoxSomeText
        });
    });
    it('clicking on highlight component fires correct event', async () => {
        const callback = jest.fn();
        clickHighlight(highlight, callback);
        await ticks(1);
        expect(callback).toHaveBeenCalled();
    });
    it('should not fire an event when already selected', async () => {
        highlight.selected = true;
        const callback = jest.fn();
        clickHighlight(highlight, callback);
        await ticks(1);
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
    it('dragging an element sets correct dataTransfer', async () => {
        const dragStart = dragStartEvent();
        const highlightDiv = highlight.shadowRoot.querySelector(CONTAINER_DIV_SELECTOR);
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
    it('The end of dragging an element sets the correct styling', async () => {
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

    it('mouse over sets the correct styling', async () => {
        const highlightDiv = highlight.shadowRoot.querySelector(CONTAINER_DIV_SELECTOR);
        expect(highlightDiv.classList).not.toContain(HOVERING_CLASS);

        highlightDiv.dispatchEvent(mouseoverEvent());
        await ticks(1);
        expect(highlightDiv.classList).toContain(HOVERING_CLASS);
    });

    it('mouse out sets the correct styling', async () => {
        const highlightDiv = highlight.shadowRoot.querySelector(CONTAINER_DIV_SELECTOR);

        highlightDiv.dispatchEvent(mouseoverEvent());
        await ticks(1);

        highlightDiv.dispatchEvent(mouseoutEvent());
        await ticks(1);
        expect(highlightDiv.classList).not.toContain(HOVERING_CLASS);
    });
});

describe('Visibility Icon', () => {
    let element: ScreenEditorHighlight;
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('screen field has visibility condition', () => {
        beforeEach(() => {
            element = createComponentForTest({ screenElement: screenFieldAccounts });
        });
        it('visibility icon should be visible', async () => {
            const iconContainer = getVisibilityIconContainer(element);
            expect(iconContainer).not.toBeNull();
            expect(iconContainer.hidden).toBe(false);
            const icon = getVisibiltyIconNoShadow(iconContainer);
            expect(icon).not.toBeNull();
            expect(icon.iconName).not.toBeNull();
        });
        describe('When Selected', () => {
            beforeEach(async () => {
                element.selected = true;
            });
            it('visibility icon should be visible in the header', () => {
                const highlightHeaderDiv = element.shadowRoot.querySelector(HIGHLIGHT_DIV_HEADER);
                const icon = getVisibiltyIconNoShadow(highlightHeaderDiv);
                expect(icon).not.toBeNull();
            });
            it('visibility icon should NOT be visible in the frame', async () => {
                const iconContainer = getVisibilityIconContainer(element);
                expect(iconContainer).toBeNull();
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
            it('visibility icon should NOT be visible in the header', () => {
                const highlightHeaderDiv = element.shadowRoot.querySelector(HIGHLIGHT_DIV_HEADER);
                const icon = getVisibiltyIconNoShadow(highlightHeaderDiv);
                expect(icon).toBeNull();
            });
            it('visibility icon should NOT be visible in the frame', async () => {
                const iconContainer = getVisibilityIconContainer(element);
                expect(iconContainer).toBeNull();
            });
        });
    });
});
