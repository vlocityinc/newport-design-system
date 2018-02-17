import { createElement } from 'engine';
import { EVENT } from 'builder_platform_interaction-constant';
import Canvas from 'builder_platform_interaction-canvas';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-canvas', {
        is: Canvas
    });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    root: '.canvas'
};

const mouseUp = (component) => {
    const mouseUpEvent = new Event('mouseup', {
        'bubbles'   : true,
        'cancelable': true
    });
    const canvasArea = component.querySelector(selectors.root);
    canvasArea.dispatchEvent(mouseUpEvent);
};

describe('canvas', () => {
    it('Checks if mouseup event is dispatched when you do mouse up on the canvas', () => {
        const canvasComponent = createComponentUnderTest();
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            canvasComponent.addEventListener(EVENT.CANVAS_MOUSEUP, callback);
            mouseUp(canvasComponent);
            expect(callback).toHaveBeenCalled();
        });
    });
});