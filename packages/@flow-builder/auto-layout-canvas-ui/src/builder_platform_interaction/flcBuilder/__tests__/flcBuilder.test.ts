// @ts-nocheck
import { createElement } from 'lwc';
import FlcBuilder from 'builder_platform_interaction/flcBuilder';
import { flowModel, elementsMetadata /* , nodeLayoutMap,*/ } from './mockData';
import { ToggleMenuEvent } from 'builder_platform_interaction/flcEvents';
import { MenuType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ClickToZoomEvent, ZOOM_ACTION } from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { commands } from 'builder_platform_interaction/sharedUtils';

const { ZoomInCommand, ZoomOutCommand, ZoomToFitCommand, ZoomToViewCommand } = commands;

const NODE_MENU_OPENED = true;
const CONNECTOR_MENU_OPENED = true;
const START_MENU_OPENED = true;

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

const DEFAULT_CLIENT_RECT = {
    top: 0,
    left: 0,
    bottom: 100,
    right: 100
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

const nodeToggleMenuEvent2 = new ToggleMenuEvent({
    guid: '837e0692-6f17-4d5c-ba5d-854851d31fcb',
    left: 702.0999755859375,
    offsetX: 2.4000244140625,
    top: 140,
    type: MenuType.NODE,
    elementMetadata: { supportsMenu: true }
});

const closeToggleMenuEvent = new ToggleMenuEvent({});

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    const sharedcommands = require('builder_platform_interaction/sharedUtils/commands');
    return Object.assign({}, sharedUtils, { commands: sharedcommands });
});
jest.mock('builder_platform_interaction/zoomPanel', () => require('builder_platform_interaction_mocks/zoomPanel'));
jest.mock('builder_platform_interaction/flcFlow', () => require('builder_platform_interaction_mocks/flcFlow'));
jest.mock('builder_platform_interaction/flcConnectorMenu', () =>
    require('builder_platform_interaction_mocks/flcConnectorMenu')
);

jest.mock('builder_platform_interaction/flcNodeMenu', () => require('builder_platform_interaction_mocks/flcNodeMenu'));
jest.mock('builder_platform_interaction/flcNodeStartMenu', () =>
    require('builder_platform_interaction_mocks/flcNodeStartMenu')
);

jest.mock('builder_platform_interaction/autoLayoutCanvas', () => {
    const autoLayoutCanvas = jest.requireActual('builder_platform_interaction/autoLayoutCanvas');
    const { ElementType, getDefaultLayoutConfig, panzoom, toggleFlowMenu } = autoLayoutCanvas;
    const { flowRenderInfo } = require('./mockData');

    return {
        renderFlow: jest.fn(() => flowRenderInfo),
        toggleFlowMenu,
        closeFlowMenu: jest.fn(() => ({})),
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

Element.prototype.getBoundingClientRect = jest.fn(function () {
    switch (this.className) {
        case 'canvas':
            return CANVAS_BOUNDING_CLIENT_RECT;
        case 'flow-container':
            return FLOW_CONTAINER_BOUNDING_CLIENT_RECT;
        default:
            return DEFAULT_CLIENT_RECT;
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

async function dispatchKeyboardCommand(element, command) {
    element.keyboardInteractions.execute(command);
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
    const getStartNodeMenu = () => cmp.shadowRoot.querySelector('builder_platform_interaction-flc-node-start-menu');
    const getConnectorMenu = () => cmp.shadowRoot.querySelector('builder_platform_interaction-flc-connector-menu');
    const getSpinner = () => cmp.shadowRoot.querySelector('div.slds-spinner_container');

    const checkMenusOpened = (isNodeMenuOpened, isConnectorMenuOpened, isStartMenuOpened = false) => {
        expect(getNodeMenu() != null).toBe(isNodeMenuOpened);
        expect(getConnectorMenu() != null).toBe(isConnectorMenuOpened);
        expect(getStartNodeMenu() != null).toBe(isStartMenuOpened);
    };

    async function closeStartMenu() {
        cmp.closeNodeOrConnectorMenu();
        await ticks(1);
    }

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

        it('zoom-in/zoom-out actions with keyboard', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchKeyboardCommand(cmp, ZoomOutCommand.COMMAND_NAME);
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);
            expect(zoomPanel.isZoomToView).toEqual(false);

            await dispatchKeyboardCommand(cmp, ZoomInCommand.COMMAND_NAME);
            checkZoomToView();
        });

        it('zoom-in/zoom-to-view actions with keyboard', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchKeyboardCommand(cmp, ZoomOutCommand.COMMAND_NAME);
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);
            expect(zoomPanel.isZoomToView).toEqual(false);

            await dispatchKeyboardCommand(cmp, ZoomToViewCommand.COMMAND_NAME);
            checkZoomToView();
        });

        it('zoom-in/zoom-to-fit actions with keyboard', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchKeyboardCommand(cmp, ZoomOutCommand.COMMAND_NAME);
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);
            expect(zoomPanel.isZoomToView).toEqual(false);

            await dispatchKeyboardCommand(cmp, ZoomToFitCommand.COMMAND_NAME);
            checkZoomToView();
        });
    });

    describe('menus', () => {
        it('opens the start menu on load', async () => {
            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED, START_MENU_OPENED);
        });

        it('close the node menu', async () => {
            await closeStartMenu();

            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            const flow = getFlow();

            await dispatchEvent(flow, nodeToggleMenuEvent);
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            cmp.closeNodeOrConnectorMenu();
            await ticks(1);
            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('open the node menu', async () => {
            await closeStartMenu();

            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            const flow = getFlow();

            await dispatchEvent(flow, nodeToggleMenuEvent);
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('when node menu opened, click on another node closes and reopens menu', async () => {
            await closeStartMenu();

            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            const flow = getFlow();

            // open the menu for a node
            await dispatchEvent(flow, nodeToggleMenuEvent2);
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            // open the menu for another node
            await dispatchEvent(flow, nodeToggleMenuEvent);
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            // close the menu
            await dispatchEvent(flow, nodeToggleMenuEvent);
            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('open and close the connector menu', async () => {
            await closeStartMenu();

            const flow = getFlow();

            await dispatchEvent(flow, connectorToggleMenuEvent);
            checkMenusOpened(!NODE_MENU_OPENED, CONNECTOR_MENU_OPENED);

            await dispatchEvent(flow, closeToggleMenuEvent);
            checkMenusOpened(false, false);
        });

        it('when connector menu opened, click on a node closes and reopens menu', async () => {
            await closeStartMenu();

            const flow = getFlow();

            // open a connector menu
            await dispatchEvent(flow, connectorToggleMenuEvent);
            checkMenusOpened(!NODE_MENU_OPENED, CONNECTOR_MENU_OPENED);

            // open the menu for a node
            await dispatchEvent(flow, nodeToggleMenuEvent);
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            // close the menu
            await dispatchEvent(flow, nodeToggleMenuEvent);
            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('clicking on the canvas closes the connector menu', async () => {
            await closeStartMenu();

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
            await closeStartMenu();

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

    describe('spinner', () => {
        it('is shown on initial load if there are unrendered dynamic node components', async () => {
            expect(getSpinner()).not.toBeNull();
        });

        it('is not shown if dynamic node components have been rendered', async () => {
            const flow = getFlow();

            const event = new CustomEvent('noderesize', {
                detail: {
                    guid: '837e0692-6f17-4d5c-ba5d-854851d31f99',
                    width: 48,
                    height: 100
                }
            });
            await dispatchEvent(flow, event);

            expect(getSpinner()).toBeNull();
        });
    });
});
