import { createElement } from 'engine';
import ScreenEditorHighlight from 'builder_platform_interaction-screen-editor-highlight';
import { SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction-events';
import { DRAGGING_CLASS, CONTAINER_DIV_SELECTOR} from 'builder_platform_interaction-screen-editor-utils';
import { createTestScreenField } from 'builder_platform_interaction-builder-test-utils';
import { getShadowRoot } from 'lwc-test-utils';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-editor-highlight', { is: ScreenEditorHighlight });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

describe('Click highlight', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: createTestScreenField('Name', 'TextBox')
        });
    });
    it('clicking on highlight component fires correct event', () => {
        return Promise.resolve().then(() => {
            const hightlightDiv = getShadowRoot(highlight).querySelector(CONTAINER_DIV_SELECTOR);
            const callback = jest.fn();
            highlight.addEventListener(SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_SELECTED, callback);
            hightlightDiv.click();
            expect(callback).toHaveBeenCalled();
        });
    });
});

describe('onDragStart', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: createTestScreenField('Name', 'TextBox')
        });
    });
    it('dragging an element sets correct dataTransfer', () => {
        return Promise.resolve().then(() => {
            const dragStartEvent = new CustomEvent('dragstart');
            dragStartEvent.dataTransfer = {
                data: {},
                setData(type, val) {
                    this.data[type] = val;
                },
                getData(type) {
                    return this.data[type];
                }
            };
            const hightlightDiv = getShadowRoot(highlight).querySelector(CONTAINER_DIV_SELECTOR);
            hightlightDiv.dispatchEvent(dragStartEvent);
            expect(dragStartEvent.dataTransfer.effectAllowed).toBe('move');
            expect(dragStartEvent.dataTransfer.getData('text')).toBe(highlight.screenElement.guid);
            expect(hightlightDiv.classList).toContain(DRAGGING_CLASS);
        });
    });
});

describe('onDragEnd', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: createTestScreenField('Name', 'TextBox')
        });
    });
    it('The end of dragging an element sets the correct styling', () => {
        return Promise.resolve().then(() => {
            const dragStartEvent = new CustomEvent('dragstart');
            dragStartEvent.dataTransfer = {
                data: {},
                setData(type, val) {
                    this.data[type] = val;
                },
                getData(type) {
                    return this.data[type];
                }
            };
            const dragEndEvent = new CustomEvent('dragend');

            const hightlightDiv = getShadowRoot(highlight).querySelector(CONTAINER_DIV_SELECTOR);
            hightlightDiv.dispatchEvent(dragStartEvent);
            hightlightDiv.dispatchEvent(dragEndEvent);
            expect(hightlightDiv.classList).not.toContain(DRAGGING_CLASS);
        });
    });
});
