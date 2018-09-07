import { createElement } from 'lwc';
import WaitEditor from '../wait-editor';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-wait-editor', { is: WaitEditor });
    document.body.appendChild(el);
    return el;
}

const selectors = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description'
};

describe('wait-editor', () => {
    let noErrorState;
    beforeEach(() => {
        noErrorState = {
            name : {value: 'testWaitName', error: null},
            label : {value: 'testWaitLabel', error: null},
            elementType : 'WAIT',
            guid : '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
            isCanvasElement : true,
            locationX : 789,
            locationY : 123,
        };
    });
    it('handles the property changed event and updates the property', () => {
        const waitElement = createComponentForTest();
        waitElement.node = noErrorState;
        Promise.resolve().then(() => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            getShadowRoot(waitElement).querySelector(selectors.LABEL_DESCRIPTION).dispatchEvent(event);
        });
        return Promise.resolve().then(() => {
            expect(waitElement.node.description.value).toBe('new desc');
        });
    });
});