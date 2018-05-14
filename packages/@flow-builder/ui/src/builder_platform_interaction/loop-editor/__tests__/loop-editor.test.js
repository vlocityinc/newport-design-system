import { createElement } from 'engine';
import LoopEditor from '../loop-editor';
import {PropertyChangedEvent} from 'builder_platform_interaction-events';

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-loop-editor', { is: LoopEditor });
    document.body.appendChild(el);
    return el;
}

describe('decision-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            loopItems : [],
            description : {value: '', error: null},
            elementType : 'LOOP',
            guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
            isCanvasElemen : true,
            label : {value: 'testLoop', error: null},
            locationX : 789,
            locationY : 123,
            name : {value: 'testLoop', error: null}
        };
    });

    describe('loop-editor', () => {
        it('handles the property changed event and updates the property', () => {
            const loopElement = createComponentForTest();
            loopElement.node = originalState;
            return Promise.resolve().then(() => {
                const event = new PropertyChangedEvent('description', 'new desc', null);
                loopElement.querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
                expect(loopElement.node.description.value).toBe('new desc');
            });
        });
    });
});