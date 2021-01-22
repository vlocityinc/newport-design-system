// @ts-nocheck
import { createElement } from 'lwc';
import ScreenEditorHighlight from 'builder_platform_interaction/screenEditorHighlight';
import { SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction/events';
import { DRAGGING_CLASS, HOVERING_CLASS, CONTAINER_DIV_SELECTOR } from 'builder_platform_interaction/screenEditorUtils';
import {
    createTestScreenField,
    ticks,
    mouseoverEvent,
    mouseoutEvent,
    dragStartEvent
} from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/screenEditorUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/screenEditorUtils');
    return Object.assign({}, actual, {
        setDragFieldValue: () => {}
    });
});

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-editor-highlight', { is: ScreenEditorHighlight });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

function clickHighlight(highlight, callback) {
    const highlightDiv = highlight.shadowRoot.querySelector(CONTAINER_DIV_SELECTOR);
    highlight.addEventListener(SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_SELECTED, callback);
    highlightDiv.click();
}

describe('Click highlight', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: createTestScreenField('Name', 'TextBox')
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
            screenElement: createTestScreenField('Name', 'TextBox')
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
            screenElement: createTestScreenField('Name', 'TextBox')
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
            screenElement: createTestScreenField('Name', 'TextBox')
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
