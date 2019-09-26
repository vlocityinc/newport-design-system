import { createElement } from 'lwc';
import Canvas from 'builder_platform_interaction/canvas';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { DeleteElementEvent } from 'builder_platform_interaction/events';
import { KeyboardInteractions } from 'builder_platform_interaction/keyboardInteractionUtils';

jest.mock('builder_platform_interaction/drawingLib', () =>
    require('builder_platform_interaction_mocks/drawingLib')
);

jest.mock('builder_platform_interaction/keyboardInteractionUtils', () =>
    require('builder_platform_interaction_mocks/keyboardInteractionUtils')
);

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
                isSelected: false,
                isHighlighted: false
            },
            guid: 'node1'
        },
        {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            config: {
                isSelected: true,
                isHighlighted: false
            },
            guid: 'node2'
        },
        {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            config: {
                isSelected: false,
                isHighlighted: false
            },
            guid: 'node3'
        }
    ];
    const defaultConnectors = [
        {
            config: {
                isSelected: false,
                isHighlighted: false
            },
            guid: 'connector1',
            source: 'node1',
            target: 'node2'
        },
        {
            config: {
                isSelected: true,
                isHighlighted: false
            },
            guid: 'connector2',
            source: 'node2',
            target: 'node3'
        }
    ];

    const createComponentForTest = (
        nodes,
        connectors,
        keyboardInteractions = new KeyboardInteractions()
    ) => {
        const el = createElement('builder_platform_interaction-canvas', {
            is: Canvas
        });

        el.nodes = nodes;
        el.connectors = connectors;
        el.keyboardInteractions = keyboardInteractions;

        document.body.appendChild(el);

        return el;
    };

    describe('commands', () => {
        it('DeleteElementEvent is fired on backspace or delete key', () => {
            const keyboardInteractions = new KeyboardInteractions();
            const canvas = createComponentForTest(
                defaultNodes,
                defaultConnectors,
                keyboardInteractions
            );

            const eventCallback = jest.fn();
            canvas.addEventListener(
                DeleteElementEvent.EVENT_NAME,
                eventCallback
            );
            // on backspace or delete, 'deletenodes' command is executed
            keyboardInteractions.execute('deletenodes');
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({});
        });
        it('Canvas zooms out when meta key is pressed down along with "-" key', () => {
            const keyboardInteractions = new KeyboardInteractions();
            const canvas = createComponentForTest(
                defaultNodes,
                defaultConnectors,
                keyboardInteractions
            );
            const innerCanvasDiv = canvas.shadowRoot.querySelector(
                SELECTORS.INNER_CANVAS_DIV
            );
            // on meta+"-", 'zoomout' command is executed
            keyboardInteractions.execute('zoomout');
            expect(innerCanvasDiv.style.transform).toEqual('scale(0.8)');
        });
    });
});
