import {createElement} from 'engine';
import Canvas from 'builder_platform_interaction-canvas';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { DeleteElementEvent } from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

const SELECTORS = {
    CANVAS_DIV: '.canvas',
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
        describe('BACKSPACE', () => {
            it('DeleteElementEvent is fired on backspace with empty detail', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);

                const eventCallback = jest.fn();
                canvas.addEventListener(DeleteElementEvent.EVENT_NAME, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: 'Backspace'
                });

                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);
                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0].detail).toEqual({});
            });

            it('DeleteElementEvent is not fired if canvas is in pan mode', () => {
                const canvas = createComponentForTest(defaultNodes, defaultConnectors);
                const canvasDiv = getShadowRoot(canvas).querySelector(SELECTORS.CANVAS_DIV);

                // Space key to toggle pan mode on
                const spaceEvent = new KeyboardEvent('keydown', {
                    key: ' '
                });
                canvasDiv.dispatchEvent(spaceEvent);

                const eventCallback = jest.fn();
                canvas.addEventListener(DeleteElementEvent.EVENT_NAME, eventCallback);

                const backspaceEvent = new KeyboardEvent('keydown', {
                    key: 'Backspace'
                });

                canvasDiv.dispatchEvent(backspaceEvent);

                expect(eventCallback).not.toHaveBeenCalled();
            });
        });
    });
});