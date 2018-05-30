import {createElement} from 'engine';
import Canvas from 'builder_platform_interaction-canvas';
import { CANVAS_EVENT } from 'builder_platform_interaction-events';

const SELECTORS = {
    CANVAS_DIV: '.canvas',
    NODE: 'builder_platform_interaction-node'
};

describe('Canvas', () => {
    const defaultNodes = [
        {
            config: {
                isSelected: false
            },
            guid: 'node1'
        },
        {
            config: {
                isSelected: true
            },
            guid: 'node2'
        },
        {
            config: {
                isSelected: false
            },
            guid: 'node1'
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

    describe('handleCanvasElementDelete', () => {
        it('fires a DELETE_ON_CANVAS event', () => {
            const canvas = createComponentForTest(defaultNodes, defaultConnectors);

            const eventCallback = jest.fn();
            canvas.addEventListener(CANVAS_EVENT.DELETE_ON_CANVAS, eventCallback);

            const deleteEvent = new CustomEvent(CANVAS_EVENT.CANVAS_ELEMENT_DELETE, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    canvasElementGUID: defaultNodes[0].guid
                }
            });

            const node = canvas.querySelector(SELECTORS.NODE);
            node.dispatchEvent(deleteEvent);

            expect(eventCallback).toHaveBeenCalled();
        });

        it('event includes node guid and no connectors', () => {
            const canvas = createComponentForTest(defaultNodes, defaultConnectors);

            const eventCallback = jest.fn();
            canvas.addEventListener(CANVAS_EVENT.DELETE_ON_CANVAS, eventCallback);

            const deleteEvent = new CustomEvent(CANVAS_EVENT.CANVAS_ELEMENT_DELETE, {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    canvasElementGUID: defaultNodes[0].guid
                }
            });

            const node = canvas.querySelector(SELECTORS.NODE);
            node.dispatchEvent(deleteEvent);

            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
                selectedCanvasElementGUIDs: [defaultNodes[0].guid]
            });
        });
    });

    describe('handleKeyDown', () => {
        describe('BACKSPACE', () => {
            it('does nothing if canvas is empty', () => {
                const canvas = createComponentForTest([], defaultConnectors);

                const eventCallback = jest.fn();
                canvas.addEventListener(CANVAS_EVENT.DELETE_ON_CANVAS, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: 'Backspace'
                });

                const canvasDiv = canvas.querySelector(SELECTORS.CANVAS_DIV);
                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback).not.toHaveBeenCalled();
            });

            it('does nothing if canvas is in pan mode', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);
                const canvasDiv = canvas.querySelector(SELECTORS.CANVAS_DIV);

                // Space key to toggle pan mode on
                const spaceEvent = new KeyboardEvent('keydown', {
                    key: ' '
                });
                canvasDiv.dispatchEvent(spaceEvent);

                const eventCallback = jest.fn();
                canvas.addEventListener(CANVAS_EVENT.DELETE_ON_CANVAS, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: 'Backspace'
                });

                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback).not.toHaveBeenCalled();
            });

            describe('DELETE_ON_CANVAS event', () => {
                it('is fired with empty detail', () => {
                    const canvas = createComponentForTest(defaultNodes, defaultConnectors);

                    const eventCallback = jest.fn();
                    canvas.addEventListener(CANVAS_EVENT.DELETE_ON_CANVAS, eventCallback);

                    const backspaceEvent = new KeyboardEvent('keydown', {
                        key: 'Backspace'
                    });

                    const canvasDiv = canvas.querySelector(SELECTORS.CANVAS_DIV);

                    canvasDiv.dispatchEvent(backspaceEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0].detail).toEqual({});
                });
            });
        });
    });
});