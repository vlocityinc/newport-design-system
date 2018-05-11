import { createElement } from 'engine';
import LoopEditor from '../loop-editor';
import {PropertyChangedEvent} from 'builder_platform_interaction-events';
import {deepCopy} from 'builder_platform_interaction-store-lib';

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-loop-editor', { is: LoopEditor });
    document.body.appendChild(el);
    return el;
}

const testObj = {
    loopItems : [],
    description : {value: '', error: null},
    elementType : 'LOOP',
    guid : '985f916fee-1c6f3-108bg-1ca54-16c041fcba152a8',
    isCanvasElemen : true,
    label : {value: 'testLoop', error: null},
    locationX : 456,
    locationY : 234,
    name : {value: 'testLoop', error: null}
};

describe('loop-editor', () => {
    it('handles the property changed event and updates the property', () => {
        const loopElement = createComponentForTest();
        loopElement.node = deepCopy(testObj);
        return Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            loopElement.querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
            expect(loopElement.node.description.value).toBe('new desc');
        });
    });
});
