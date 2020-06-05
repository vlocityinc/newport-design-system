// @ts-nocheck
import { createElement } from 'lwc';
import FlcBuilder from 'builder_platform_interaction/flcBuilder';
import { flowModel, elementsMetadata /* , nodeLayoutMap,*/ } from './mockData';
import { ToggleMenuEvent } from 'builder_platform_interaction/flcEvents';
import { MenuType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ClickToZoomEvent, ZOOM_ACTION } from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';

const NODE_MENU_OPENED = true;
const CONNECTOR_MENU_OPENED = true;

const CANVAS_BOUNDING_CLIENT_RECT = {
    top: 200,
    left: 200,
    bottom: 768,
    right: 1024
};

const FLOW_CONTAINER_BOUNDING_CLIENT_RECT = {
    top: 224,
    left: 200,
    bottom: 768,
    right: 1024
};

const connectorToggleMenuEvent = new ToggleMenuEvent({
    left: 716.5,
    next: '618725c2-75a5-4374-b625-d64045e831d1',
    offsetX: 2,
    prev: '837e0692-6f17-4d5c-ba5d-854851d31fcb',
    top: 84,
    type: MenuType.CONNECTOR,
    elementMetadata: { supportsMenu: true }
});

const nodeToggleMenuEvent = new ToggleMenuEvent({
    guid: 'eb01a710-d341-4ba0-81d2-f7ef03300db5',
    left: 702.0999755859375,
    offsetX: 2.4000244140625,
    top: -2.3999996185302734,
    type: MenuType.NODE,
    elementMetadata: { supportsMenu: true }
});

const closeToggleMenuEvent = new ToggleMenuEvent({});

jest.mock('builder_platform_interaction/zoomPanel', () => require('builder_platform_interaction_mocks/zoomPanel'));
jest.mock('builder_platform_interaction/flcFlow', () => require('builder_platform_interaction_mocks/flcFlow'));
jest.mock('builder_platform_interaction/flcConnectorMenu', () =>
    require('builder_platform_interaction_mocks/flcConnectorMenu')
);

jest.mock('builder_platform_interaction/flcNodeMenu', () => require('builder_platform_interaction_mocks/flcNodeMenu'));

jest.mock('builder_platform_interaction/autoLayoutCanvas', () => {
    const autoLayoutCanvas = jest.requireActual('builder_platform_interaction/autoLayoutCanvas');
    const { ElementType, getDefaultLayoutConfig, panzoom, toggleFlowMenu } = autoLayoutCanvas;
    const { flowRenderInfo } = require('./mockData');

    return {
        renderFlow: jest.fn(() => flowRenderInfo),
        toggleFlowMenu,
        closeFlowMenu: jest.fn(),
        calculateFlowLayout: jest.fn(),
        getDefaultLayoutConfig,
        animate: jest.fn(),
        findParentElement: jest.fn(() => ({ elementType: 'Decision' })),
        getElementMetadata: jest.fn(() => ({
            Decision: {
                type: ElementType.BRANCH
            }
        })),
        MenuType: autoLayoutCanvas.MenuType,
        panzoom,
        ElementType
    };
});

Element.prototype.getBoundingClientRect = jest.fn(function() {
    switch (this.className) {
        case 'canvas':
            return CANVAS_BOUNDING_CLIENT_RECT;
        case 'flow-container':
            return FLOW_CONTAINER_BOUNDING_CLIENT_RECT;
        default:
            return null;
    }
});

const createComponentForTest = () => {
    const el = createElement('builder_platform_interaction-flc-builder', {
        is: FlcBuilder
    });

    el.flowModel = flowModel;
    el.disableAnimation = true;
    el.elementsMetadata = elementsMetadata;
    el.disableDebounce = true;
    document.body.appendChild(el);

    return el;
};

async function dispatchEvent(element, event) {
    element.dispatchEvent(event);
    await ticks(1);
}

describe('Auto Layout Canvas', () => {
    let cmp;

    beforeEach(() => {
        cmp = createComponentForTest();
    });

    const getFlow = () => cmp.shadowRoot.querySelector('builder_platform_interaction-flc-flow');
    const getZoomPanel = () => cmp.shadowRoot.querySelector('builder_platform_interaction-zoom-panel');
    const getNodeMenu = () => cmp.shadowRoot.querySelector('builder_platform_interaction-flc-node-menu');
    const getConnectorMenu = () => cmp.shadowRoot.querySelector('builder_platform_interaction-flc-connector-menu');

    const checkMenusOpened = (isNodeMenuOpened, isConnectorMenuOpened) => {
        expect(getNodeMenu() != null).toBe(isNodeMenuOpened);
        expect(getConnectorMenu() != null).toBe(isConnectorMenuOpened);
    };

    function checkZoomToView() {
        const { isZoomInDisabled, isZoomOutDisabled, isZoomToView } = getZoomPanel();
        expect(isZoomInDisabled).toEqual(true);
        expect(isZoomOutDisabled).toEqual(false);
        expect(isZoomToView).toEqual(true);
    }

    it('renders the component', async () => {
        await ticks(1);

        const flow = getFlow();
        expect(flow).not.toBeNull();

        expect(getZoomPanel()).not.toBeNull();
        checkZoomToView();
    });

    describe('zoom', () => {
        it('zoom-in/zoom-out actions', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_OUT));
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);
            expect(zoomPanel.isZoomToView).toEqual(false);

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_IN));
            checkZoomToView();
        });

        it('zoom-in/zoom-to-view actions', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_OUT));
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);
            expect(zoomPanel.isZoomToView).toEqual(false);

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_TO_VIEW));
            checkZoomToView();
        });

        it('zoom-in/zoom-to-fit actions', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_OUT));
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);
            expect(zoomPanel.isZoomToView).toEqual(false);

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_TO_FIT));
            checkZoomToView();
        });
    });

    describe('menus', () => {
        it('open the node menu', async () => {
            const flow = getFlow();

            await dispatchEvent(flow, nodeToggleMenuEvent);
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('open and close the connector menu', async () => {
            const flow = getFlow();

            await dispatchEvent(flow, connectorToggleMenuEvent);
            checkMenusOpened(!NODE_MENU_OPENED, CONNECTOR_MENU_OPENED);

            await dispatchEvent(flow, closeToggleMenuEvent);
            checkMenusOpened(false, false);
        });

        it('clicking on the canvas closes the connector menu', async () => {
            const flow = getFlow();

            await dispatchEvent(flow, connectorToggleMenuEvent);
            checkMenusOpened(!NODE_MENU_OPENED, CONNECTOR_MENU_OPENED);

            await dispatchEvent(
                flow,
                new CustomEvent('click', {
                    bubbles: true,
                    cancelable: false
                })
            );
            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('opening a menu zooms out', async () => {
            const flow = getFlow();

            const zoomPanel = getZoomPanel();

            // first zoom-in
            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_OUT));
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);
            expect(zoomPanel.isZoomToView).toEqual(false);

            await dispatchEvent(flow, connectorToggleMenuEvent);
            checkMenusOpened(!NODE_MENU_OPENED, CONNECTOR_MENU_OPENED);

            // check that opening a menu zooms out
            checkZoomToView();
        });
    });
});
