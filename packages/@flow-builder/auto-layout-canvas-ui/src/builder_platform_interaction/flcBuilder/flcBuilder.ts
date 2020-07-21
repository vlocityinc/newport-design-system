import { LightningElement, track, api } from 'lwc';
import {
    renderFlow,
    toggleFlowMenu,
    closeFlowMenu,
    updateDeletionPathInfo,
    calculateFlowLayout,
    getDefaultLayoutConfig,
    animate,
    MenuType,
    panzoom,
    ElementType,
    getTargetGuidsForBranchReconnect,
    Guid,
    NodeRenderInfo
} from 'builder_platform_interaction/autoLayoutCanvas';

import {
    ZOOM_ACTION,
    ClosePropertyEditorEvent,
    DeleteElementEvent,
    ToggleSelectionModeEvent
} from 'builder_platform_interaction/events';

import { FlcSelectionEvent, FlcCreateConnectionEvent } from 'builder_platform_interaction/flcEvents';
import { getFlcFlowData, getFlcMenuData } from 'builder_platform_interaction/flcComponentsUtils';

import {
    getCanvasElementSelectionData,
    getCanvasElementDeselectionData
} from 'builder_platform_interaction/flcComponentsUtils';
import { FlowRenderContext, FlowRenderInfo } from '../../../../auto-layout-canvas/dist/types/flowRendererUtils';

const MAX_ZOOM = 1;
const MIN_ZOOM = 0.1;

const ZOOM_SCALE_STEP = 0.2;

const CANVAS_CLASS = '.canvas';
const FLOW_CONTAINER_CLASS = '.flow-container';

const defaultConfig = getDefaultLayoutConfig();

const CONNECTOR_ICON_SIZE = defaultConfig.connector.icon.w;
const MENU_ICON_SIZE = defaultConfig.node.icon.w;

const SYNTHETIC_ZOOM_TO_VIEW_EVENT = { detail: { action: ZOOM_ACTION.ZOOM_TO_VIEW } };

// needed to compensate for floating point arithmetic imprecisions
const FUDGE = 0.02;

function debounce(fct, wait) {
    let timeoutId;

    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        timeoutId = setTimeout(() => {
            return fct.apply(null, args);
        }, wait);
    };
}

export default class FlcBuilder extends LightningElement {
    /* if the builder has been disconnected */
    _isDisconnected = false;

    /* the canvas element (ie the viewport) */
    _canvasElement;

    /* the container for the flow and menus */
    _flowContainerElement;

    /* the flow model to render */
    _flowModel;

    /* map fo element metadata */
    _elementsMetadata?: any[];

    /* the rendering context */
    _flowRenderContext!: FlowRenderContext;

    /* the rendered flow */
    _flowRenderInfo!: FlowRenderInfo;

    /* the selection mode */
    _isSelectionMode: boolean | undefined;

    /* the top most selected element's guid */
    _topSelectedGuid!: Guid | null;

    /* the guid of the element we are reconnecting to another element */
    _reconnectSourceGuid!: Guid | null;

    /* the current scale with a domain of [MIN_ZOOM, MAX_ZOOM] */
    _scale!: number;

    /* offsets to center the zoom */
    _panzoomOffsets;

    @track
    isZoomToView = true;

    @track
    isZoomInDisabled = true;

    @track
    isZoomOutDisabled = false;

    @track
    flow;

    @track
    menu;

    @track
    isCanvasReady;

    @api
    disableDebounce = false;

    @api
    disableAnimation = false;

    @api
    isPasteAvailable!: boolean;

    get isReconnecting() {
        return this._reconnectSourceGuid != null;
    }

    @api
    set elementsMetadata(elementsMetadata: any[]) {
        this._elementsMetadata = elementsMetadata;
        this.updateFlowRenderContext();
    }

    get elementsMetadata(): any[] {
        return this._elementsMetadata!;
    }

    @api
    set isSelectionMode(isSelectionMode) {
        this._isSelectionMode = isSelectionMode;
        this.handleSelectionChange();
    }

    get isSelectionMode() {
        return this._isSelectionMode;
    }

    @api
    set flowModel(flowModel) {
        this._flowModel = flowModel;
        this.updateFlowRenderContext({ flowModel });
    }

    get flowModel() {
        return this._flowModel;
    }

    get showConnectorMenu() {
        return this.menu != null && this.menu.connectorMenu === MenuType.CONNECTOR;
    }

    get showNodeMenu() {
        return this.menu != null && this.menu.connectorMenu === MenuType.NODE;
    }

    get elementMetadata() {
        let item;
        for (item of this.flow.flowInfo.nodes) {
            if (item.guid === this.menu.guid) {
                return item.node;
            }
        }
        return undefined;
    }

    get isStart() {
        return this.menu.elementMetadata.type === ElementType.START;
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = scale;
        this.isZoomInDisabled = scale >= MAX_ZOOM - FUDGE;
        this.isZoomOutDisabled = scale <= MIN_ZOOM + FUDGE;
        this.isZoomToView = this.isZoomInDisabled;
    }

    renderedCallback() {
        if (this._canvasElement == null) {
            this._canvasElement = this.template.querySelector(CANVAS_CLASS);
            this.updateFlowRenderContext();
        }

        if (!this._flowContainerElement) {
            const flowContainerElement = this.template.querySelector(FLOW_CONTAINER_CLASS);
            if (flowContainerElement != null) {
                this._flowContainerElement = flowContainerElement;
                this.initializePanzoom();
                this.isCanvasReady = true;
            }
        }
    }

    /**
     * Helper function that converts this._elementsMetadata to map of elementType -> metaData
     */
    _convertToElementMetadataMap() {
        return this._elementsMetadata!.reduce((acc, elementMetadata) => {
            acc[elementMetadata.elementType] = elementMetadata;
            return acc;
        }, {});
    }

    /**
     * Creates the initial flow render context
     *
     * @return A new flow render context
     */
    createInitialFlowRenderContext(): FlowRenderContext {
        // transforms the elementsMetadata array to a map
        const elementsMetadataMap = this._convertToElementMetadataMap();

        return {
            flowModel: this._flowModel,
            nodeLayoutMap: {},
            interactionState: {},
            elementsMetadata: elementsMetadataMap,
            layoutConfig: { ...getDefaultLayoutConfig() },
            isDeletingBranch: false
        } as FlowRenderContext;
    }

    /**
     * Handles a elements selection change
     */
    handleSelectionChange() {
        if (this._isSelectionMode) {
            this.closeNodeOrConnectorMenu();
        } else {
            this._topSelectedGuid = null;

            // make all elements selectable and unselected when exiting selection mode
            if (this._flowModel != null) {
                const allGuids = Object.keys(this._flowModel);
                const flcSelectionEvent = new FlcSelectionEvent([], allGuids, allGuids, null);
                this.dispatchEvent(flcSelectionEvent);
            }
        }
    }

    /**
     * Updates the flow render context, and triggers a rerender
     *
     * @param {FlowRenderContext} flowRenderContext - One or more flow render context properties
     */
    updateFlowRenderContext(flowRenderContext = {}) {
        if (this._elementsMetadata == null || this._flowModel == null || this._canvasElement == null) {
            return;
        }

        const isFirstRender = this._flowRenderContext == null;

        if (isFirstRender) {
            this.rerender = this.disableDebounce ? this.rerender : debounce(this.rerender, 10);
            this._flowRenderContext = this.createInitialFlowRenderContext();
            this._scale = MAX_ZOOM;
        }

        this._flowRenderContext = Object.assign(this._flowRenderContext, flowRenderContext);
        this.rerender(isFirstRender);
    }

    /**
     * Closes any opened node or connector menu
     */
    closeNodeOrConnectorMenu() {
        if (this.menu != null) {
            this.updateFlowRenderContext({
                interactionState: closeFlowMenu(this._flowRenderContext.interactionState)
            });
            this.menu = null;
        }
    }

    /**
     * Zoom to full scale when clicking on a node or connector button
     *
     * @param {Object} param0  - The top and left position of the menu button
     * @param {number} menuButtonHalfWidth - The half width of the menu button
     */
    zoomForMenuDisplay({ top, left }, menuButtonHalfWidth) {
        const { x, y } = this.getDomElementGeometry(this._canvasElement);

        const buttonOffset = menuButtonHalfWidth * this.scale;
        top = top - y + buttonOffset;
        left = left - x + buttonOffset;

        this.handleZoomAction(SYNTHETIC_ZOOM_TO_VIEW_EVENT, { top, left });
    }

    /**
     * Toggles the node or connector menu
     *
     * @param {ToggleMenuEvent} event - the toggle menu event
     */
    handleToggleMenu = event => {
        const { detail } = event;
        const { type, elementMetadata } = detail;
        const isNodeMenu = type === MenuType.NODE;

        // return if a node doesn't support a menu
        if (isNodeMenu && !elementMetadata.supportsMenu) {
            return;
        }

        const interactionState = toggleFlowMenu(detail, this._flowRenderContext.interactionState);

        if (interactionState.menuInfo != null) {
            const connectorMenu = detail.type;
            const menuButtonHalfWidth =
                connectorMenu === MenuType.CONNECTOR ? CONNECTOR_ICON_SIZE / 2 : MENU_ICON_SIZE / 2;
            const containerGeometry = this.getDomElementGeometry(this._flowContainerElement);

            this.menu = Object.assign(
                getFlcMenuData(event, menuButtonHalfWidth, containerGeometry, this._scale, this._flowRenderContext),
                { elementsMetadata: this._elementsMetadata }
            );

            this.zoomForMenuDisplay(detail, menuButtonHalfWidth);
        } else {
            this.menu = null;
        }

        this.updateFlowRenderContext({ interactionState });
    };

    /**
     * Handles the "merge with existing path" connector menu item selection
     */
    handleMergeWithExistingPath = event => {
        event.stopPropagation();

        const { targetGuid } = event.detail;
        this._reconnectSourceGuid = targetGuid;

        const selectableGuids = getTargetGuidsForBranchReconnect(this.flowModel, targetGuid);
        if (selectableGuids.length > 1) {
            this.dispatchEvent(new ToggleSelectionModeEvent());
            const flcSelectionEvent = new FlcSelectionEvent([], [], selectableGuids, null);
            this.dispatchEvent(flcSelectionEvent);
        } else if (selectableGuids.length === 1) {
            this.dispatchCreateConnectionEvent(selectableGuids[0]);
        } else {
            // no merge point or elements on other branches, so just delete the end node to reconnect
            this.dispatchEvent(new DeleteElementEvent([targetGuid], this.flowModel[targetGuid].elementType, null));
        }
    };

    dispatchCreateConnectionEvent(targetGuid) {
        this.dispatchEvent(new FlcCreateConnectionEvent(this._reconnectSourceGuid, targetGuid));
        this._reconnectSourceGuid = null;
    }

    dispatchFlcSelectionEvent({ isSelected, canvasElementGUID }) {
        // transforms the elementsMetadata array to a map
        const elementsMetadataMap = this._convertToElementMetadataMap();
        const flowModel = this._flowModel;

        const {
            canvasElementGuidsToSelect,
            canvasElementGuidsToDeselect,
            selectableCanvasElementGuids,
            topSelectedGuid
        } = !isSelected
            ? getCanvasElementSelectionData(elementsMetadataMap, flowModel, canvasElementGUID, this._topSelectedGuid)
            : getCanvasElementDeselectionData(elementsMetadataMap, flowModel, canvasElementGUID, this._topSelectedGuid);

        this._topSelectedGuid = topSelectedGuid;

        const flcSelectionEvent = new FlcSelectionEvent(
            canvasElementGuidsToSelect,
            canvasElementGuidsToDeselect,
            selectableCanvasElementGuids,
            this._topSelectedGuid
        );
        this.dispatchEvent(flcSelectionEvent);
    }

    /**
     * Handles node selection and deleselection
     */
    handleNodeSelectionDeselection = event => {
        event.stopPropagation();

        if (this._reconnectSourceGuid != null) {
            this.dispatchCreateConnectionEvent(event.detail.canvasElementGUID);
            this.dispatchEvent(new ToggleSelectionModeEvent());
        } else {
            this.dispatchFlcSelectionEvent(event.detail);
        }
    };

    handleHighlightPathsToDelete = event => {
        const interactionState = updateDeletionPathInfo(
            event.detail.elementGuidToDelete,
            event.detail.childIndexToKeep,
            this._flowRenderContext.interactionState
        );
        this.updateFlowRenderContext({ interactionState });
    };

    /**
     * Rerenders the flow
     *
     * @param {boolean} isFirstRender - true if it's the first time rendering the flow
     */
    rerender = isFirstRender => {
        if (this._isDisconnected) {
            // return if disconnected; this may occur because of debouncing
            return;
        }

        calculateFlowLayout(this._flowRenderContext);

        if (isFirstRender || this.disableAnimation) {
            // first render, no animation
            this.renderFlow(1);
        } else {
            animate(progress => this.renderFlow(progress));
        }
    };

    /**
     * Initializes the panzoom object
     */
    initializePanzoom() {
        this._panzoom = panzoom(this._flowContainerElement, {
            smoothScroll: false,
            minZoom: MIN_ZOOM,
            maxZoom: MAX_ZOOM,
            // disable wheel zoom
            beforeWheel: () => true,

            // disable touch zoom
            onTouch: () => true,

            // disable double click zoom
            onDoubleClick: () => true,

            // disable pinch zoom
            pinchSpeed: 1,

            // disable zoom keys
            filterKey: () => true
        });

        this.panzoomMoveToCenterTop();
        this._panzoomOffsets = { x: 0, y: 0 - (this.getFlowHeight() * MIN_ZOOM) / 2 };
    }

    /**
     * Centers the flow
     */
    panzoomMoveToCenterTop() {
        this._panzoom.moveTo(this.getDomElementGeometry(this._canvasElement).w / 2, 0);
    }

    /**
     * Renders the flow
     *
     * @param {number} progress - the animation progress with domain [0, 1]
     */
    renderFlow(progress) {
        this._flowRenderInfo = renderFlow(this._flowRenderContext, progress);
        this.flow = getFlcFlowData(this._flowRenderInfo, { guid: ElementType.ROOT } as NodeRenderInfo, 0);
    }

    /**
     * Returns the natural height of the flow (without scaling)
     *
     * @returns the non-scaled height of the flow
     */
    getFlowHeight() {
        return this._flowRenderInfo.geometry.h;
    }

    /**
     * Returns a Geometry object for a DOM element
     *
     * @param {Object} domElement - a DOM element
     * @returns {Geometry} The Geometry for the DOM element
     */
    getDomElementGeometry(domElement) {
        const { left, right, top, bottom } = domElement.getBoundingClientRect();
        return { x: left, y: top, w: right - left, h: bottom - top };
    }

    /**
     * Returns the coordinates of the center of the canvas
     */
    getCanvasCenter() {
        const { w, h } = this.getDomElementGeometry(this._canvasElement);

        return {
            left: w / 2,
            top: h / 2
        };
    }

    /**
     * Handles a zoom action
     *
     * @param {Object} event - An event with the zoom action
     * @param {Object} position - The coords of the mouse click
     */
    handleZoomAction = (event, position = this.getCanvasCenter()) => {
        let { top, left } = position;
        const zoomAction = event.detail.action;

        let closeMenu = this.menu != null;
        let scale = this.scale;

        switch (zoomAction) {
            case ZOOM_ACTION.ZOOM_OUT:
                scale -= ZOOM_SCALE_STEP;
                scale = Math.max(scale, MIN_ZOOM);
                break;
            case ZOOM_ACTION.ZOOM_IN:
                scale += ZOOM_SCALE_STEP;
                scale = Math.min(scale, MAX_ZOOM);
                break;
            case ZOOM_ACTION.ZOOM_TO_VIEW:
                if (scale + FUDGE < MAX_ZOOM) {
                    scale = MAX_ZOOM;
                } else {
                    return;
                }
                closeMenu = false;
                break;
            case ZOOM_ACTION.ZOOM_TO_FIT:
                // center top
                top = 0;
                this._panzoomOffsets = { x: 0, y: 0 };
                ({ left } = this.getCanvasCenter());
                this.panzoomMoveToCenterTop();

                scale = Math.min(this.getDomElementGeometry(this._canvasElement).h / this.getFlowHeight(), MAX_ZOOM);
                break;
            default:
        }

        if (closeMenu) {
            this.closeNodeOrConnectorMenu();
        }

        const { x, y } = this._panzoomOffsets;
        this._panzoom.smoothZoomAbs(left + x, top + y, scale);
        this.scale = scale;
    };

    disconnectedCallback() {
        this._isDisconnected = true;
    }

    handleCanvasClick = event => {
        event.stopPropagation();

        this.closeNodeOrConnectorMenu();
        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
    };
}
