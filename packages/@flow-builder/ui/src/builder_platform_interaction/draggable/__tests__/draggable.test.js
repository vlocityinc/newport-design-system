import {createElement} from 'lwc';
import Draggable from "builder_platform_interaction/draggable";

const SELECTORS = {
    DRAGGABLE: 'div'
};
const SOURCE_INDEX = 'TEST_SOURCE_INDEX';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-draggable', {
        is: Draggable
    });
    document.body.appendChild(el);
    return el;
};

describe('Draggable component', () => {
    let element;
    let draggableItem;
    beforeEach(() => {
        element = createComponentUnderTest();
        draggableItem = element.shadowRoot.querySelector(SELECTORS.DRAGGABLE);
    });
    it('fires ReorderListEvent when item is dropped', () => {
        return Promise.resolve().then(() => {
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
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({sourceGuid: SOURCE_INDEX});
        });
    });
    it('sets id of the element as text data in the event when drag starts', () => {
        element.index = SOURCE_INDEX;
        return Promise.resolve().then(() => {
            // Create 'dragstart' custom event to dispatch in order to test what happens
            const dragStartEvent = new CustomEvent('dragstart');
            dragStartEvent.dataTransfer = {
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
            draggableItem.dispatchEvent(dragStartEvent);

            expect(dragStartEvent.dataTransfer.getData('text')).toBe(SOURCE_INDEX);
            expect(dragStartEvent.dataTransfer.effectAllowed).toBe('move');
        });
    });
});