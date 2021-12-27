// @ts-nocheck
import { dragStartEvent, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import Draggable from 'builder_platform_interaction/draggable';
import { createElement } from 'lwc';

const SELECTORS = {
    DRAGGABLE: 'div'
};
const SOURCE_INDEX = 'TEST_SOURCE_INDEX';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-draggable', {
        is: Draggable
    });
    setDocumentBodyChildren(el);
    return el;
};

describe('Draggable component', () => {
    let element;
    let draggableItem;
    beforeEach(() => {
        element = createComponentUnderTest();
        draggableItem = element.shadowRoot.querySelector(SELECTORS.DRAGGABLE);
    });
    it('fires ReorderListEvent when item is dropped', async () => {
        await ticks(1);
        // Create 'drop' custom event to dispatch in order to test what happens
        const dropEvent = new CustomEvent('drop');
        dropEvent.dataTransfer = {
            data: {},
            setData(type, val) {
                this.data[type] = val;
                this.types = [];
                this.types[0] = type;
            },
            getData(type) {
                return this.data[type];
            }
        };
        dropEvent.dataTransfer.setData('text', SOURCE_INDEX);
        const eventCallback = jest.fn();
        element.addEventListener('reorderlist', eventCallback);
        draggableItem.dispatchEvent(dropEvent);

        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
            sourceGuid: SOURCE_INDEX
        });
    });
    it('sets id of the element as text data in the event when drag starts', async () => {
        element.index = SOURCE_INDEX;
        await ticks(1);
        // Create 'dragstart' custom event to dispatch in order to test what happens
        const dragStart = dragStartEvent();
        draggableItem.dispatchEvent(dragStart);

        expect(dragStart.dataTransfer.getData('text')).toBe(SOURCE_INDEX);
        expect(dragStart.dataTransfer.effectAllowed).toBe('move');
    });
});
