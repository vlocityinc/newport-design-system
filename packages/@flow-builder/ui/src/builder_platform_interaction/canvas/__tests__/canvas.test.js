import { createElement } from 'lwc';
import Canvas from "builder_platform_interaction/canvas";
import { KEYS } from "../keyConstants";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { DeleteElementEvent } from "builder_platform_interaction/events";
import { getShadowRoot } from 'lwc-test-utils';

const SELECTORS = {
    CANVAS_DIV: '.canvas',
    OVERLAY: '.overlay',
    INNER_CANVAS_DIV: '.inner-canvas',
    NODE: 'builder_platform_interaction-node'
};

describe('Canvas', () => {
    const defaultNodes = [
        {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            config: {
                isSelected: false
            },
            guid: 'node1'
        },
        {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            config: {
                isSelected: true
            },
            guid: 'node2'
        },
        {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            config: {
                isSelected: false
            },
            guid: 'node3'
        }
    ];
    const defaultConnectors = [
        {
            config: {
                isSelected: false
            },
            guid: 'connector1'
        },
        {
            config: {
                isSelected: true
            },
            guid: 'connector2'
        },
    ];

    const createComponentForTest = (nodes, connectors) => {
        const el = createElement('builder_platform_interaction-canvas', {
            is: Canvas
        });

        el.nodes = nodes;
        el.connectors = connectors;

        document.body.appendChild(el);

        return el;
    };

    describe('handleKeyDown', () => {
        describe('BACKSPACE KEY', () => {
            it('DeleteElementEvent is fired on backspace', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);

                const eventCallback = jest.fn();
                canvas.addEventListener(DeleteElementEvent.EVENT_NAME, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: KEYS.BACKSPACE
                });

                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);
                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback).toHaveBeenCalled();
            });

            it('DeleteElementEvent is fired on backspace with empty detail', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);

                const eventCallback = jest.fn();
                canvas.addEventListener(DeleteElementEvent.EVENT_NAME, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: KEYS.BACKSPACE
                });

                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);
                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback.mock.calls[0][0].detail).toEqual({});
            });

            it('DeleteElementEvent is not fired if canvas is in pan mode', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);
                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);

                // Space key to toggle pan mode on
                const spaceEvent = new KeyboardEvent('keydown', {
                    key: KEYS.SPACE
                });
                canvasDiv.dispatchEvent(spaceEvent);

                const eventCallback = jest.fn();
                canvas.addEventListener(DeleteElementEvent.EVENT_NAME, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: KEYS.BACKSPACE
                });

                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback).not.toHaveBeenCalled();
            });
        });

        describe('DELETE KEY', () => {
            it('DeleteElementEvent is fired on delete', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);

                const eventCallback = jest.fn();
                canvas.addEventListener(DeleteElementEvent.EVENT_NAME, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: KEYS.DELETE
                });

                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);
                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback).toHaveBeenCalled();
            });

            it('DeleteElementEvent is fired on delete with empty detail', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);

                const eventCallback = jest.fn();
                canvas.addEventListener(DeleteElementEvent.EVENT_NAME, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: KEYS.DELETE
                });

                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);
                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback.mock.calls[0][0].detail).toEqual({});
            });

            it('DeleteElementEvent is not fired if canvas is in pan mode', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);
                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);

                // Space key to toggle pan mode on
                const spaceEvent = new KeyboardEvent('keydown', {
                    key: KEYS.SPACE
                });
                canvasDiv.dispatchEvent(spaceEvent);

                const eventCallback = jest.fn();
                canvas.addEventListener(DeleteElementEvent.EVENT_NAME, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: KEYS.DELETE
                });

                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback).not.toHaveBeenCalled();
            });
        });

        describe('META KEY', () => {
            it('Canvas zooms out when meta key is pressed down along with "-" key', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);
                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);
                const innerCanvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.INNER_CANVAS_DIV);

                const negativeKeyEvent = new KeyboardEvent('keydown', {
                    metaKey: true,
                    key: KEYS.NEGATIVE
                });

                canvasDiv.dispatchEvent(negativeKeyEvent);
                expect(innerCanvasDiv.style.transform).toEqual('scale(0.8)');
            });
        });

        describe('SPACE KEY', () => {
            it('Toggles the pan mode on', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);
                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);

                const spaceEvent = new KeyboardEvent('keydown', {
                    key: KEYS.SPACE
                });
                canvasDiv.dispatchEvent(spaceEvent);
                expect(canvasDiv.style.cursor).toEqual('-webkit-grab');
            });
        });
    });

    describe('handleKeyUp', () => {
        describe('SPACE KEY', () => {
            it('Toggles the pan mode off', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);
                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);

                const spaceKeyDownEvent = new KeyboardEvent('keydown', {
                    key: KEYS.SPACE
                });
                canvasDiv.dispatchEvent(spaceKeyDownEvent);

                const spaceKeyUpEvent = new KeyboardEvent('keyup', {
                    key: KEYS.SPACE
                });
                canvasDiv.dispatchEvent(spaceKeyUpEvent);
                expect(canvasDiv.style.cursor).toEqual('default');
            });
        });
    });
});