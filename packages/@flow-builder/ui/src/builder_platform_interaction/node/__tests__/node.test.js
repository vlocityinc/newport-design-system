import { createElement } from 'lwc';
import {
    EditElementEvent,
    DeleteElementEvent,
    SelectNodeEvent
} from 'builder_platform_interaction/events';
import Node from 'builder_platform_interaction/node';
import { isTestMode } from 'builder_platform_interaction/contextLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/drawingLib', () =>
    require('builder_platform_interaction_mocks/drawingLib')
);

const elementConfig = require.requireActual(
    '../../elementConfig/elementConfig.js'
);
elementConfig.getConfigForElementType = jest
    .fn()
    .mockImplementation(elementType => {
        return elementType === ELEMENT_TYPE.START_ELEMENT
            ? {
                  isDeletable: false,
                  nodeConfig: { isSelectable: false, isEditable: false },
                  labels: {}
              }
            : elementConfig.elementTypeToConfigMap[elementType];
    });

const createComponentUnderTest = (
    isSelected,
    isHighlighted,
    elementType = ELEMENT_TYPE.ASSIGNMENT
) => {
    const el = createElement('builder_platform_interaction-node', {
        is: Node
    });
    el.node = {
        guid: '1',
        locationX: '20px',
        locationY: '40px',
        elementType,
        label: 'First Node',
        description: 'My first test node',
        config: { isSelected, isHighlighted }
    };
    document.body.appendChild(el);
    return el;
};

const selectors = {
    nodeContainer: '.node-container',
    iconSelected: '.icon-section.selected',
    highlightedContainer: '.node-container.highlighted-container',
    icon: '.icon',
    trash: '.trash-can'
};

jest.mock('builder_platform_interaction/contextLib', () => ({
    isTestMode: jest.fn()
}));

jest.mock('builder_platform_interaction/loggingUtils', () => ({
    logInteraction: jest.fn()
}));

const dblClick = component => {
    const doubleClickEvent = new Event('dblclick', {
        bubbles: true,
        cancelable: true
    });
    const nodeIcon = component.shadowRoot.querySelector(selectors.icon);
    nodeIcon.dispatchEvent(doubleClickEvent);
};

describe('node', () => {
    it('Checks if node is rendered correctly', () => {
        const nodeComponent = createComponentUnderTest(false, false);
        expect(nodeComponent.node.guid).toEqual('1');
        expect(nodeComponent.node.locationX).toEqual('20px');
        expect(nodeComponent.node.locationY).toEqual('40px');
        expect(nodeComponent.node.elementType).toEqual(ELEMENT_TYPE.ASSIGNMENT);
        expect(nodeComponent.node.label).toEqual('First Node');
        expect(nodeComponent.node.description).toEqual('My first test node');
        expect(nodeComponent.node.config.isSelected).toBeFalsy();
        expect(nodeComponent.node.config.isHighlighted).toBeFalsy();
    });

    it('Checks if node selected event is dispatched when icon is clicked', () => {
        const nodeComponent = createComponentUnderTest(false, false);
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            nodeComponent.addEventListener(
                SelectNodeEvent.EVENT_NAME,
                callback
            );
            nodeComponent.shadowRoot.querySelector(selectors.icon).click();
            expect(callback).toHaveBeenCalled();
        });
    });

    it('Checks if node selected event is dispatched when selected icon is clicked', () => {
        const nodeComponent = createComponentUnderTest(true, false);
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            nodeComponent.addEventListener(
                SelectNodeEvent.EVENT_NAME,
                callback
            );
            nodeComponent.shadowRoot.querySelector(selectors.icon).click();
            expect(callback).toHaveBeenCalled();
        });
    });

    it('Checks if node selected event is not dispatched when element that is configured to be non-selectable is clicked', () => {
        const nodeComponent = createComponentUnderTest(
            false,
            false,
            ELEMENT_TYPE.START_ELEMENT
        );
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            nodeComponent.addEventListener(
                SelectNodeEvent.EVENT_NAME,
                callback
            );
            nodeComponent.shadowRoot.querySelector(selectors.icon).click();
            expect(callback).not.toHaveBeenCalled();
        });
    });

    it('Checks if a selected node has the right styling', () => {
        const nodeComponent = createComponentUnderTest(true);
        expect(
            nodeComponent.shadowRoot.querySelector(selectors.iconSelected)
        ).toBeTruthy();
    });

    it('Checks if a highlighted node has the right styling', () => {
        const nodeComponent = createComponentUnderTest(false, true);
        expect(
            nodeComponent.shadowRoot.querySelector(
                selectors.highlightedContainer
            )
        ).toBeTruthy();
    });

    it('Checks if an EditElementEvent is dispatched when icon is double clicked', () => {
        const nodeComponent = createComponentUnderTest(false, false);
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            nodeComponent.addEventListener(
                EditElementEvent.EVENT_NAME,
                callback
            );
            dblClick(nodeComponent);
            expect(callback).toHaveBeenCalled();
            expect(callback.mock.calls[0][0]).toMatchObject({
                detail: {
                    canvasElementGUID: nodeComponent.node.guid
                }
            });
        });
    });

    it('Checks that EditElementEvent is not dispatched when element configured to be non-editable is double clicked', () => {
        const nodeComponent = createComponentUnderTest(
            false,
            false,
            ELEMENT_TYPE.START_ELEMENT
        );
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            nodeComponent.addEventListener(
                EditElementEvent.EVENT_NAME,
                callback
            );
            dblClick(nodeComponent);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    it('Checks if node delete event is dispatched when trash is clicked', () => {
        const nodeComponent = createComponentUnderTest(true, false);
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            nodeComponent.addEventListener(
                DeleteElementEvent.EVENT_NAME,
                callback
            );
            nodeComponent.shadowRoot.querySelector(selectors.trash).click();
            expect(callback).toHaveBeenCalled();
        });
    });

    it('Checks that trash icon is not displayed when element configured to be non-deletable is clicked', () => {
        const nodeComponent = createComponentUnderTest(
            false,
            false,
            ELEMENT_TYPE.START_ELEMENT
        );
        return Promise.resolve().then(() => {
            nodeComponent.shadowRoot.querySelector(selectors.icon).click();
            expect(
                nodeComponent.shadowRoot.querySelector(selectors.trash)
            ).toBeNull();
        });
    });

    describe('parent div class', () => {
        const testModeSpecificClassName = `test-node-${ELEMENT_TYPE.ASSIGNMENT.toLowerCase()}`;
        let parentDiv;
        it('in test mode  (test class added for parent div)', () => {
            isTestMode.mockReturnValue(true);
            const node = createComponentUnderTest();
            parentDiv = node.shadowRoot.querySelector('div');
            expect(parentDiv.classList).toContain(testModeSpecificClassName);
        });
        it('NOT in test mode (no test class added for parent div)', () => {
            isTestMode.mockReturnValue(false);
            const node = createComponentUnderTest();
            parentDiv = node.shadowRoot.querySelector('div');
            expect(parentDiv.classList).not.toContain(
                testModeSpecificClassName
            );
        });
    });
});
