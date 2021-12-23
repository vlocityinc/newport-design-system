// @ts-nocheck
import { createElement } from 'lwc';
import AlcCanvas from 'builder_platform_interaction/alcCanvas';
import { flowModel, elementsMetadata } from './mockData';
import {
    ToggleMenuEvent,
    DeleteBranchElementEvent,
    MenuPositionUpdateEvent
} from 'builder_platform_interaction/alcEvents';
import { MenuType } from 'builder_platform_interaction/autoLayoutCanvas';
import {
    ClickToZoomEvent,
    DeleteElementEvent,
    ZOOM_ACTION,
    EditElementEvent
} from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import {
    setDocumentBodyChildren,
    removeDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils/domTestUtils';
import { commands, invokeModal } from 'builder_platform_interaction/sharedUtils';
import { setup } from '@sa11y/jest';

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

const nodeToggleMenuEventProps = {
    source: { guid: 'screen-two' },
    left: 702.0999755859375,
    offsetX: 2.4000244140625,
    top: 140,
    type: MenuType.NODE,
    elementMetadata: { menuComponent: 'builder_platform_interaction/alcNodeMenu' }
};

const nodeToggleMenuEventProps2 = { source: { guid: '837e0692-6f17-4d5c-ba5d-854851d31fcb', top: 140 } };

function getNodeToggleMenuEvent(props = {}) {
    return new ToggleMenuEvent({ ...nodeToggleMenuEventProps, ...props });
}

const getConnectorToggleMenuEvent = () => {
    return new ToggleMenuEvent({
        left: 716.5,
        offsetX: 2,
        source: { guid: '837e0692-6f17-4d5c-ba5d-854851d31fcb' },
        top: 84,
        type: MenuType.CONNECTOR
    });
};

const getCloseToggleMenuEvent = () => {
    return new ToggleMenuEvent({});
};

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    const sharedcommands = jest.requireActual('builder_platform_interaction/sharedUtils/commands');
    const auraUtils = jest.requireActual('builder_platform_interaction/sharedUtils/auraUtils');
    return Object.assign({}, sharedUtils, auraUtils, { commands: sharedcommands, invokeModal: jest.fn() });
});
jest.mock('builder_platform_interaction/zoomPanel', () =>
    jest.requireActual('builder_platform_interaction_mocks/zoomPanel')
);
jest.mock('builder_platform_interaction/alcFlow', () =>
    jest.requireActual('builder_platform_interaction_mocks/alcFlow')
);

jest.mock('builder_platform_interaction/alcConnectorMenu', () =>
    jest.requireActual('builder_platform_interaction_mocks/alcConnectorMenu')
);

jest.mock('builder_platform_interaction/alcNodeMenu', () =>
    jest.requireActual('builder_platform_interaction_mocks/alcNodeMenu')
);

jest.mock('builder_platform_interaction/alcStartMenu', () => {
    const AlcNodeMenu = jest.requireActual('builder_platform_interaction/alcNodeMenu').default;
    return class extends AlcNodeMenu {
        static className = 'start-menu';
    };
});

jest.mock('builder_platform_interaction/autoLayoutCanvas', () => {
    const autoLayoutCanvas = jest.requireActual('builder_platform_interaction/autoLayoutCanvas');
    const {
        NodeType,
        getDefaultLayoutConfig,
        panzoom,
        resolveNode,
        toggleFlowMenu,
        hasGoToOnNext,
        hasGoTo,
        resolveParent,
        isBranchTerminal,
        shouldDeleteGoToOnNext,
        getConnectionTarget,
        getConnectionSource,
        getTargetGuidsForReconnection
    } = autoLayoutCanvas;
    const { flowRenderInfo } = jest.requireActual('./mockData');

    return {
        getConnectionTarget,
        renderFlow: jest.fn(() => flowRenderInfo),
        toggleFlowMenu,
        closeFlowMenu: jest.fn(() => ({})),
        calculateFlowLayout: jest.fn(),
        getDefaultLayoutConfig,
        animate: jest.fn(),
        findParentElement: jest.fn(() => ({ elementType: 'Decision' })),
        getElementMetadata: jest.fn(() => ({
            Decision: {
                type: NodeType.BRANCH
            }
        })),
        resolveNode,
        invokeModal: jest.fn(),
        updateDeletionPathInfo: jest.fn(),
        MenuType: autoLayoutCanvas.MenuType,
        panzoom,
        NodeType,
        hasGoToOnNext,
        hasGoTo,
        resolveParent,
        isBranchTerminal,
        shouldDeleteGoToOnNext,
        getConnectionSource,
        getTargetGuidsForReconnection
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
    const el = createElement('builder_platform_interaction-alc-canvas', {
        is: AlcCanvas
    });

    el.flowModel = flowModel;
    el.disableAnimation = true;
    el.elementsMetadata = elementsMetadata;
    el.disableDebounce = true;
    el.connectorMenuMetadata = {
        menuComponent: 'builder_platform_interaction/alcConnectorMenu',
        elementTypes: new Set()
    };
    setDocumentBodyChildren(el);
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
        cmp.focusOnConnector = jest.fn();
        cmp.focusOnNode = jest.fn();
    });

    afterEach(() => {
        removeDocumentBodyChildren();
    });

    const getOverlay = () => cmp.shadowRoot.querySelector('.canvas-overlay');
    const getFlow = () => cmp.shadowRoot.querySelector('builder_platform_interaction-alc-flow');
    const getZoomPanel = () => cmp.shadowRoot.querySelector('builder_platform_interaction-zoom-panel');
    const getNodeMenu = () => cmp.shadowRoot.querySelector('.node-menu');
    const getStartNodeMenu = () => cmp.shadowRoot.querySelector('.start-menu');
    const getConnectorMenu = () => cmp.shadowRoot.querySelector('.connector-menu');
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
        const { isZoomInDisabled, isZoomOutDisabled } = getZoomPanel();
        expect(isZoomInDisabled).toEqual(true);
        expect(isZoomOutDisabled).toEqual(false);
    }

    it('renders the component', async () => {
        await ticks(1);

        const flow = getFlow();
        expect(flow).not.toBeNull();

        expect(getZoomPanel()).not.toBeNull();
        checkZoomToView();
    });

    describe('canvas cursor style', () => {
        it('Canvas should have the "grabbing-cursor" class on mouse down', () => {
            const canvasCmp = cmp.shadowRoot.querySelector('.canvas');
            canvasCmp.dispatchEvent(new CustomEvent('mousedown', {}));
            expect(canvasCmp.classList[1]).toEqual('grabbing-cursor');
        });

        it('Canvas should not have the "grabbing-cursor" class after mouse down and mouse up', () => {
            const canvasCmp = cmp.shadowRoot.querySelector('.canvas');
            canvasCmp.dispatchEvent(new CustomEvent('mousedown', {}));
            canvasCmp.dispatchEvent(new CustomEvent('mouseup', {}));
            expect(canvasCmp.classList[1]).toBeUndefined();
        });

        it('Canvas should not have the "grabbing-cursor" class after mouse down and mouse leave', () => {
            const canvasCmp = cmp.shadowRoot.querySelector('.canvas');
            canvasCmp.dispatchEvent(new CustomEvent('mousedown', {}));
            canvasCmp.dispatchEvent(new CustomEvent('mouseleave', {}));
            expect(canvasCmp.classList[1]).toBeUndefined();
        });
    });

    describe('zoom', () => {
        beforeAll(() => {
            setup();
        });
        it('accessibility', async () => {
            const zoomPanel = getZoomPanel();
            await expect(zoomPanel).toBeAccessible();
        });
        it('zoom-in/zoom-out actions', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_OUT));
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_IN));
            checkZoomToView();
        });

        it('zoom-in/zoom-to-view actions', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_OUT));
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_TO_VIEW));
            checkZoomToView();
        });

        it('zoom-in/zoom-to-fit actions', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_OUT));
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);

            await dispatchEvent(zoomPanel, new ClickToZoomEvent(ZOOM_ACTION.ZOOM_TO_FIT));
            checkZoomToView();
        });

        it('zoom-in/zoom-out actions with keyboard', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchKeyboardCommand(cmp, ZoomOutCommand.COMMAND_NAME);
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);

            await dispatchKeyboardCommand(cmp, ZoomInCommand.COMMAND_NAME);
            checkZoomToView();
        });

        it('zoom-in/zoom-to-view actions with keyboard', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchKeyboardCommand(cmp, ZoomOutCommand.COMMAND_NAME);
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);

            await dispatchKeyboardCommand(cmp, ZoomToViewCommand.COMMAND_NAME);
            checkZoomToView();
        });

        it('zoom-in/zoom-to-fit actions with keyboard', async () => {
            const zoomPanel = getZoomPanel();

            await dispatchKeyboardCommand(cmp, ZoomOutCommand.COMMAND_NAME);
            expect(zoomPanel.isZoomInDisabled).toEqual(false);
            expect(zoomPanel.isZoomOutDisabled).toEqual(false);

            await dispatchKeyboardCommand(cmp, ZoomToFitCommand.COMMAND_NAME);
            checkZoomToView();
        });
    });

    describe('menus', () => {
        it('opens the start menu on load', async () => {
            await ticks(1);
            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED, START_MENU_OPENED);
        });

        it('close the node menu', async () => {
            await closeStartMenu();

            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            const flow = getFlow();

            await dispatchEvent(flow, getNodeToggleMenuEvent());
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            cmp.closeNodeOrConnectorMenu();
            await ticks(1);
            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('open the node menu', async () => {
            await closeStartMenu();

            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            const flow = getFlow();

            await dispatchEvent(flow, getNodeToggleMenuEvent());
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('when node menu opened, click on another node closes and reopens menu', async () => {
            await closeStartMenu();

            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            const flow = getFlow();

            // open the menu for a node
            await dispatchEvent(
                flow,
                getNodeToggleMenuEvent({
                    top: 140
                })
            );
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            // open the menu for another node
            await dispatchEvent(flow, getNodeToggleMenuEvent(nodeToggleMenuEventProps2));
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            // close the menu
            await dispatchEvent(flow, getNodeToggleMenuEvent(nodeToggleMenuEventProps2));
            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('open and close the connector menu', async () => {
            await closeStartMenu();

            const flow = getFlow();

            await dispatchEvent(flow, getConnectorToggleMenuEvent());
            await ticks(10);
            checkMenusOpened(!NODE_MENU_OPENED, CONNECTOR_MENU_OPENED);

            await dispatchEvent(flow, getCloseToggleMenuEvent());
            checkMenusOpened(false, false);
        });

        it('when connector menu opened, click on a node closes and reopens menu', async () => {
            await closeStartMenu();

            const flow = getFlow();

            // open a connector menu
            await dispatchEvent(flow, getConnectorToggleMenuEvent());
            checkMenusOpened(!NODE_MENU_OPENED, CONNECTOR_MENU_OPENED);

            // open the menu for a node
            await dispatchEvent(flow, getNodeToggleMenuEvent());
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            // close the menu
            await dispatchEvent(flow, getNodeToggleMenuEvent());
            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);
        });

        it('clicking on the canvas closes the connector menu', async () => {
            await closeStartMenu();

            const flow = getFlow();

            await dispatchEvent(flow, getConnectorToggleMenuEvent());
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

        it('node menu opened, double clicking on another node fires an EditElementEvent', async () => {
            //
            // see alcCanvas.handleOverlayClick for more information about this test sequence
            //

            await closeStartMenu();

            checkMenusOpened(!NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            const flow = getFlow();

            // open the menu for a node
            await dispatchEvent(flow, getNodeToggleMenuEvent());
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            // open the menu for another node
            await dispatchEvent(flow, getNodeToggleMenuEvent(nodeToggleMenuEventProps2));
            checkMenusOpened(NODE_MENU_OPENED, !CONNECTOR_MENU_OPENED);

            // fire the a menu position update event (as done by alcMenuTrigger in this scenario)
            const menuUpdateEvent = new MenuPositionUpdateEvent({
                ...getNodeToggleMenuEvent().detail,
                needToPosition: true
            });
            await dispatchEvent(flow, menuUpdateEvent);

            // at this point the overlay should be present to capture the second click
            const overlay = getOverlay();
            expect(overlay).toBeTruthy();

            // send the second click to the overlay
            const editElementCallback = jest.fn();
            cmp.addEventListener(EditElementEvent.EVENT_NAME, editElementCallback);
            await dispatchEvent(
                overlay,
                new CustomEvent('click', {
                    bubbles: true,
                    cancelable: false
                })
            );

            // check that the EditElementEvent was fired
            expect(editElementCallback).toHaveBeenCalled();
        });

        /* Skip this test, we are using the zoomEnd event to open the menu
        we need to find a way to dispatch this event
        it.skip('opening a menu zooms out', async () => {
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
        });*/
    });

    describe('spinner', () => {
        it('is shown on initial load if there are unrendered dynamic node components', async () => {
            expect(getSpinner()).not.toBeNull();
        });

        it('is not shown if dynamic node components have been rendered', async () => {
            const flow = getFlow();

            const event = new CustomEvent('noderesize', {
                detail: {
                    source: { guid: '837e0692-6f17-4d5c-ba5d-854851d31f99' },
                    width: 48,
                    height: 100
                }
            });
            await dispatchEvent(flow, event);

            expect(getSpinner()).toBeNull();
        });
    });

    describe('modal', () => {
        it('calls the invokeModal function when deleting an element and the branch to persist is terminated and next element is not end element', async () => {
            const flow = getFlow();
            const nodeToggleMenuEvent = getNodeToggleMenuEvent({
                source: { guid: '1c397973-762d-443f-9780-2b9777b6d6a3' }
            });
            await dispatchEvent(flow, nodeToggleMenuEvent);
            const nodeMenu = getNodeMenu();
            const deleteBranchElementEvent = new DeleteBranchElementEvent(
                ['1c397973-762d-443f-9780-2b9777b6d6a3'],
                'Decision',
                0
            );
            await dispatchEvent(nodeMenu, deleteBranchElementEvent);
            expect(invokeModal).toHaveBeenCalled();
        });
        it('dispatches a deleteElement event when deleting an element and persist no branches', async () => {
            const callback = jest.fn();
            cmp.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
            const flow = getFlow();
            const nodeToggleMenuEvent = getNodeToggleMenuEvent({
                source: { guid: '1c397973-762d-443f-9780-2b9777b6d6a3' }
            });
            await dispatchEvent(flow, nodeToggleMenuEvent);
            const nodeMenu = getNodeMenu();
            const deleteBranchElementEvent = new DeleteBranchElementEvent(
                ['1c397973-762d-443f-9780-2b9777b6d6a3'],
                'Decision',
                null
            );
            await dispatchEvent(nodeMenu, deleteBranchElementEvent);
            expect(callback).toHaveBeenCalled();
        });
        it('dispatches a deleteElement event when deleting an element and the branch to persist is not terminated', async () => {
            const callback = jest.fn();
            cmp.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
            const flow = getFlow();
            const nodeToggleMenuEvent = getNodeToggleMenuEvent({
                source: { guid: '1c397973-762d-443f-9780-2b9777b6d6a3' }
            });

            await dispatchEvent(flow, nodeToggleMenuEvent);
            const nodeMenu = getNodeMenu();
            const deleteBranchElementEvent = new DeleteBranchElementEvent(
                ['1c397973-762d-443f-9780-2b9777b6d6a3'],
                'Decision',
                1
            );
            await dispatchEvent(nodeMenu, deleteBranchElementEvent);
            expect(callback).toHaveBeenCalled();
        });
        it('dispatches a deleteElement event when deleting an element and next element is end element', async () => {
            const callback = jest.fn();
            cmp.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
            const flow = getFlow();
            const nodeToggleMenuEvent = getNodeToggleMenuEvent({
                source: { guid: '9731c397-443f-9780-762d-d6a32b9777b6' }
            });
            await dispatchEvent(flow, nodeToggleMenuEvent);
            const nodeMenu = getNodeMenu();
            const deleteBranchElementEvent = new DeleteBranchElementEvent(
                ['9731c397-443f-9780-762d-d6a32b9777b6'],
                'Decision',
                0
            );
            await dispatchEvent(nodeMenu, deleteBranchElementEvent);
            expect(callback).toHaveBeenCalled();
        });
        it('dispatches a deleteElement event when deleting an element and a GoTo is present on next', async () => {
            const callback = jest.fn();
            cmp.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
            const flow = getFlow();
            const nodeToggleMenuEvent = getNodeToggleMenuEvent({
                source: { guid: 'decision' },
                left: 702.0999755859375,
                top: 140
            });
            await dispatchEvent(flow, nodeToggleMenuEvent);
            const nodeMenu = getNodeMenu();
            const deleteBranchElementEvent = new DeleteBranchElementEvent(['decision'], 'Decision', 2);
            await dispatchEvent(nodeMenu, deleteBranchElementEvent);
            expect(callback).toHaveBeenCalled();
        });
        it('dispatches a deleteElement event when deleting an element and head element is null', async () => {
            const callback = jest.fn();
            cmp.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
            const flow = getFlow();
            const nodeToggleMenuEvent = getNodeToggleMenuEvent({
                source: { guid: '1c397973-762d-443f-9780-2b9777b6d6a3' }
            });
            await dispatchEvent(flow, nodeToggleMenuEvent);
            const nodeMenu = getNodeMenu();
            const deleteBranchElementEvent = new DeleteBranchElementEvent(
                ['1c397973-762d-443f-9780-2b9777b6d6a3'],
                'Decision',
                -1
            );
            await dispatchEvent(nodeMenu, deleteBranchElementEvent);
            expect(callback).toHaveBeenCalled();
        });
        it('dispatches a deleteElement event when deleting an element and next element is null', async () => {
            const callback = jest.fn();
            cmp.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
            const flow = getFlow();
            const nodeToggleMenuEvent = getNodeToggleMenuEvent({
                source: { guid: '4b54cd8b-6bba-407b-a02b-c2129290162e' }
            });
            await dispatchEvent(flow, nodeToggleMenuEvent);
            const nodeMenu = getNodeMenu();
            const deleteBranchElementEvent = new DeleteBranchElementEvent(
                ['4b54cd8b-6bba-407b-a02b-c2129290162e'],
                'Decision',
                0
            );
            await dispatchEvent(nodeMenu, deleteBranchElementEvent);
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('focus', () => {
        it('focusOnConnector should be called when deleting an element with branches', async () => {
            const flow = getFlow();
            const nodeToggleMenuEvent = getNodeToggleMenuEvent({
                source: { guid: 'decision' }
            });
            await dispatchEvent(flow, nodeToggleMenuEvent);
            const nodeMenu = getNodeMenu();
            const deleteElementEvent = new DeleteBranchElementEvent(['decision'], 'Decision', null);
            await dispatchEvent(nodeMenu, deleteElementEvent);
            expect(cmp.focusOnConnector).toHaveBeenCalledWith({ guid: 'screen-one' });
        });
        it('focusOnConnector should be called when deleting a branch element', async () => {
            const flow = getFlow();
            const nodeToggleMenuEvent = getNodeToggleMenuEvent({
                source: { guid: 'screen-two' }
            });
            await dispatchEvent(flow, nodeToggleMenuEvent);
            const nodeMenu = getNodeMenu();
            const deleteElementEvent = new DeleteElementEvent(['screen-two'], 'Screen', null);
            await dispatchEvent(nodeMenu, deleteElementEvent);
            expect(cmp.focusOnConnector).toHaveBeenCalledWith({ guid: 'decision', childIndex: 1 });
        });
    });

    // TODO: 238 clco - fix and uncomment these tests
    // describe('highlight path', () => {
    //     it('should set shouldDeleteBeyondMergingPoint to false when deleting an element and no branch is persisted', async () => {
    //         const flow = getFlow();
    //         const nodeToggleMenuEvent = new ToggleMenuEvent({
    //             source: { guid: '1c397973-762d-443f-9780-2b9777b6d6a3' },
    //             left: 702.0999755859375,
    //             offsetX: 2.4000244140625,
    //             top: 140,
    //             type: MenuType.NODE,
    //             elementMetadata: { supportsMenu: true }
    //         });
    //         await dispatchEvent(flow, nodeToggleMenuEvent);
    //         const nodeMenu = getNodeMenu();
    //         const highlightPathsToDeleteEvent = new HighlightPathsToDeleteEvent(
    //             '1c397973-762d-443f-9780-2b9777b6d6a3',
    //             null
    //         );
    //         await dispatchEvent(nodeMenu, highlightPathsToDeleteEvent);
    //         expect(updateDeletionPathInfo).toHaveBeenCalledWith(
    //             '1c397973-762d-443f-9780-2b9777b6d6a3',
    //             null,
    //             expect.anything(),
    //             false
    //         );
    //     });
    //     it('should set shouldDeleteBeyondMergingPoint to false when deleting an element and the branch to persist is not terminated', async () => {
    //         const flow = getFlow();
    //         const nodeToggleMenuEvent = new ToggleMenuEvent({
    //             source: { guid: '1c397973-762d-443f-9780-2b9777b6d6a3' },
    //             left: 702.0999755859375,
    //             offsetX: 2.4000244140625,
    //             top: 140,
    //             type: MenuType.NODE,
    //             elementMetadata: { supportsMenu: true }
    //         });
    //         await dispatchEvent(flow, nodeToggleMenuEvent);
    //         const nodeMenu = getNodeMenu();
    //         const highlightPathsToDeleteEvent = new HighlightPathsToDeleteEvent(
    //             '1c397973-762d-443f-9780-2b9777b6d6a3',
    //             1
    //         );
    //         await dispatchEvent(nodeMenu, highlightPathsToDeleteEvent);
    //         expect(updateDeletionPathInfo).toHaveBeenCalledWith(
    //             '1c397973-762d-443f-9780-2b9777b6d6a3',
    //             1,
    //             expect.anything(),
    //             false
    //         );
    //     });
    //     it('should set shouldDeleteBeyondMergingPoint to true when deleting an element and the branch to persist is terminated and next element is not end element', async () => {
    //         const flow = getFlow();
    //         const nodeToggleMenuEvent = new ToggleMenuEvent({
    //             source: { guid: '1c397973-762d-443f-9780-2b9777b6d6a3' },
    //             left: 702.0999755859375,
    //             offsetX: 2.4000244140625,
    //             top: 140,
    //             type: MenuType.NODE,
    //             elementMetadata: { supportsMenu: true }
    //         });
    //         await dispatchEvent(flow, nodeToggleMenuEvent);
    //         const nodeMenu = getNodeMenu();
    //         const highlightPathsToDeleteEvent = new HighlightPathsToDeleteEvent(
    //             '1c397973-762d-443f-9780-2b9777b6d6a3',
    //             0
    //         );
    //         await dispatchEvent(nodeMenu, highlightPathsToDeleteEvent);
    //         expect(updateDeletionPathInfo).toHaveBeenCalledWith(
    //             '1c397973-762d-443f-9780-2b9777b6d6a3',
    //             0,
    //             expect.anything(),
    //             true
    //         );
    //     });
    //     it('should set shouldDeleteBeyondMergingPoint to false when deleting an element and head element is null', async () => {
    //         const flow = getFlow();
    //         const nodeToggleMenuEvent = new ToggleMenuEvent({
    //             source: { guid: '1c397973-762d-443f-9780-2b9777b6d6a3' },
    //             left: 702.0999755859375,
    //             offsetX: 2.4000244140625,
    //             top: 140,
    //             type: MenuType.NODE,
    //             elementMetadata: { supportsMenu: true }
    //         });
    //         await dispatchEvent(flow, nodeToggleMenuEvent);
    //         const nodeMenu = getNodeMenu();
    //         const highlightPathsToDeleteEvent = new HighlightPathsToDeleteEvent(
    //             '1c397973-762d-443f-9780-2b9777b6d6a3',
    //             -1
    //         );
    //         await dispatchEvent(nodeMenu, highlightPathsToDeleteEvent);
    //         expect(updateDeletionPathInfo).toHaveBeenCalledWith(
    //             '1c397973-762d-443f-9780-2b9777b6d6a3',
    //             -1,
    //             expect.anything(),
    //             false
    //         );
    //     });
    //     it('should set shouldDeleteBeyondMergingPoint to false when deleting an element and next element is null', async () => {
    //         const flow = getFlow();
    //         const nodeToggleMenuEvent = new ToggleMenuEvent({
    //             source: { guid: '4b54cd8b-6bba-407b-a02b-c2129290162e' },
    //             left: 702.0999755859375,
    //             offsetX: 2.4000244140625,
    //             top: 140,
    //             type: MenuType.NODE,
    //             elementMetadata: { supportsMenu: true }
    //         });
    //         await dispatchEvent(flow, nodeToggleMenuEvent);
    //         const nodeMenu = getNodeMenu();
    //         const highlightPathsToDeleteEvent = new HighlightPathsToDeleteEvent(
    //             '4b54cd8b-6bba-407b-a02b-c2129290162e',
    //             0
    //         );
    //         await dispatchEvent(nodeMenu, highlightPathsToDeleteEvent);
    //         expect(updateDeletionPathInfo).toHaveBeenCalledWith(
    //             '4b54cd8b-6bba-407b-a02b-c2129290162e',
    //             0,
    //             expect.anything(),
    //             false
    //         );
    //     });

    //     describe('Highlight Path with GoTo present at the merge point', () => {
    //         it('GoTo is present at the merge point and no branch is being persisted', async () => {
    //             const flow = getFlow();
    //             const nodeToggleMenuEvent = new ToggleMenuEvent({
    //                 source: { guid: 'decision' },
    //                 left: 702.0999755859375,
    //                 offsetX: 2.4000244140625,
    //                 top: 140,
    //                 type: MenuType.NODE,
    //                 elementMetadata: { supportsMenu: true }
    //             });
    //             await dispatchEvent(flow, nodeToggleMenuEvent);
    //             const nodeMenu = getNodeMenu();
    //             const highlightPathsToDeleteEvent = new HighlightPathsToDeleteEvent('decision', undefined);
    //             await dispatchEvent(nodeMenu, highlightPathsToDeleteEvent);
    //             expect(updateDeletionPathInfo).toHaveBeenCalledWith('decision', undefined, expect.anything(), true);
    //         });

    //         it('GoTo is present at the merge point and the persisted branch is empty', async () => {
    //             const flow = getFlow();
    //             const nodeToggleMenuEvent = new ToggleMenuEvent({
    //                 source: { guid: 'decision' },
    //                 left: 702.0999755859375,
    //                 offsetX: 2.4000244140625,
    //                 top: 140,
    //                 type: MenuType.NODE,
    //                 elementMetadata: { supportsMenu: true }
    //             });
    //             await dispatchEvent(flow, nodeToggleMenuEvent);
    //             const nodeMenu = getNodeMenu();
    //             const highlightPathsToDeleteEvent = new HighlightPathsToDeleteEvent('decision', 0);
    //             await dispatchEvent(nodeMenu, highlightPathsToDeleteEvent);
    //             expect(updateDeletionPathInfo).toHaveBeenCalledWith('decision', 0, expect.anything(), true);
    //         });

    //         it('GoTo is present at the merge point and the persisted branch is terminated', async () => {
    //             const flow = getFlow();
    //             const nodeToggleMenuEvent = new ToggleMenuEvent({
    //                 source: { guid: 'decision' },
    //                 left: 702.0999755859375,
    //                 offsetX: 2.4000244140625,
    //                 top: 140,
    //                 type: MenuType.NODE,
    //                 elementMetadata: { supportsMenu: true }
    //             });
    //             await dispatchEvent(flow, nodeToggleMenuEvent);
    //             const nodeMenu = getNodeMenu();
    //             const highlightPathsToDeleteEvent = new HighlightPathsToDeleteEvent('decision', 2);
    //             await dispatchEvent(nodeMenu, highlightPathsToDeleteEvent);
    //             expect(updateDeletionPathInfo).toHaveBeenCalledWith('decision', 2, expect.anything(), true);
    //         });

    //         it('GoTo is present at the merge point and the persisted branch is not terminated', async () => {
    //             const flow = getFlow();
    //             const nodeToggleMenuEvent = new ToggleMenuEvent({
    //                 source: { guid: 'decision' },
    //                 left: 702.0999755859375,
    //                 offsetX: 2.4000244140625,
    //                 top: 140,
    //                 type: MenuType.NODE,
    //                 elementMetadata: { supportsMenu: true }
    //             });
    //             await dispatchEvent(flow, nodeToggleMenuEvent);
    //             const nodeMenu = getNodeMenu();
    //             const highlightPathsToDeleteEvent = new HighlightPathsToDeleteEvent('decision', 1);
    //             await dispatchEvent(nodeMenu, highlightPathsToDeleteEvent);
    //             expect(updateDeletionPathInfo).toHaveBeenCalledWith('decision', 1, expect.anything(), false);
    //         });
    //     });
    // });
});
