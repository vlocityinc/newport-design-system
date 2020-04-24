import { LightningElement, track, api } from 'lwc';
import {
    renderFlow,
    toggleFlowMenu,
    calculateFlowLayout,
    getDefaultLayoutConfig,
    animate,
    MenuType,
    panzoom
} from 'builder_platform_interaction/flowUtils';

import { ZOOM_ACTION, FlcSelectionEvent, ClosePropertyEditorEvent } from 'builder_platform_interaction/events';
import { getStyleFromGeometry, getFlcFlowData } from 'builder_platform_interaction/flcComponentsUtils';

import {
    getCanvasElementSelectionData,
    getCanvasElementDeselectionData,
    getCanvasElementDeselectionDataOnToggleOff
} from 'builder_platform_interaction/flcBuilderUtils';

const MAX_ZOOM = 1;
const MIN_ZOOM = 0.1;
const ZOOM_SCALE_STEP = 0.2;

const defaultConfig = getDefaultLayoutConfig();

const CONNECTOR_ICON_SIZE = defaultConfig.connector.icon.w;
const MENU_ICON_SIZE = defaultConfig.node.icon.w;

const ROOT_KEY = 'root';

const ZOOM_TO_VIEW_EVENT = { detail: { action: ZOOM_ACTION.ZOOM_TO_VIEW } };

// needed to compensate for floating point arithmetic imprecisions
const FUDGE = 0.02;

const CENTER_MIDDLE_TRANSFORM = {
    x: 0.5,
    y: 0.5
};

const CENTER_TOP_TRANSFORM = {
    x: 0.5,
    y: 0
};

function getTransformOriginOffset(ele, { x, y }) {
    const { width, height } = ele.getBoundingClientRect();

    return {
        x: width * x,
        y: height * y
    };
}

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

function findElementOffsets(flowRenderInfo, guid) {
    const { nodes } = flowRenderInfo;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.guid === guid) {
            return { x: 0, y: node.y };
        }

        const flows = node.flows;
        if (flows) {
            for (let j = 0; j < flows.length; j++) {
                const flow = flows[j];
                const offsets = findElementOffsets(flow, guid);
                if (offsets) {
                    const { x, y } = offsets;
                    return { x: x + flow.x, y: y + node.y };
                }
            }
        }
    }

    return null;
}

export default class FlcBuilder extends LightningElement {
    _builderElement;
    _flowElement;
    _flowModel;
    _elementsMetadata;
    _flowRenderContext;
    _isSelectionMode;
    _scale = 1;
    _topSelectedGuid;

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

    @api
    isPasteAvailable;

    @api
    set elementsMetadata(elementsMetadata) {
        this._elementsMetadata = elementsMetadata;
        this.updateFlowRenderContext();
    }

    get elementsMetadata() {
        return this._elementsMetadata;
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

    constructor() {
        super();

        this.rerender = debounce(this.rerender, 10);
    }

    createInitialFlowRenderContext() {
        const elementsMetadata = this._elementsMetadata.reduce((acc, elementMetadata) => {
            acc[elementMetadata.elementType] = elementMetadata;
            return acc;
        }, {});

        return {
            flowModel: this._flowModel,
            nodeLayoutMap: {},
            interactionState: {},
            elementsMetadata,
            layoutConfig: { ...getDefaultLayoutConfig() }
        };
    }

    handleSelectionChange() {
        if (this._isSelectionMode) {
            this.hideMenu();
        } else if (this._topSelectedGuid) {
            const {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableCanvasElementGuids,
                topSelectedGuid
            } = getCanvasElementDeselectionDataOnToggleOff(this._flowModel, this._topSelectedGuid);

            this._topSelectedGuid = topSelectedGuid;

            const flcSelectionEvent = new FlcSelectionEvent(
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableCanvasElementGuids,
                this._topSelectedGuid
            );
            this.dispatchEvent(flcSelectionEvent);
        }
    }

    updateFlowRenderContext(flowRenderContext = {}) {
        if (this._elementsMetadata == null || this._flowModel == null || this._builderElement == null) {
            return;
        }

        const isFirstRender = this._flowRenderContext == null;

        if (isFirstRender) {
            this._flowRenderContext = this.createInitialFlowRenderContext();
        }

        this._flowRenderContext = Object.assign(this._flowRenderContext, flowRenderContext);
        this.rerender(isFirstRender);
    }

    hideMenu() {
        if (this.menu) {
            this.updateFlowRenderContext({
                interactionState: toggleFlowMenu(null, this._flowRenderContext.interactionState)
            });
        }
    }

    handleToggleMenu = event => {
        const { detail } = event;

        const interactionState = toggleFlowMenu(detail, this._flowRenderContext.interactionState);

        let menu = this._flowRenderContext.interactionState.menuInfo;

        const connectorMenu = detail.type === MenuType.CONNECTOR;
        const { top, left } = this._flowElement.getBoundingClientRect();
        const offset = connectorMenu ? CONNECTOR_ICON_SIZE * (1 - this._scale) : MENU_ICON_SIZE * (1 - this._scale);

        const style = getStyleFromGeometry({
            x: (detail.left - left) * (1 / this._scale) - offset,
            y: (detail.top - top) * (1 / this._scale) - offset
        });

        const guid = detail.guid;
        const elementHasFault = guid ? this._flowModel[guid].fault : false;

        menu = menu
            ? null
            : {
                  elementHasFault,
                  ...detail,
                  connectorMenu,
                  elementsMetadata: this._elementsMetadata,
                  style
              };

        this.menu = menu;
        this.updateFlowRenderContext({ interactionState });

        if (menu) {
            this.handleClickToZoom(ZOOM_TO_VIEW_EVENT);
        }
    };

    handleZoomElement(event) {
        const guid = event.detail;
        const { y } = findElementOffsets(this.flowRenderInfo, guid);
        const offsets = getTransformOriginOffset(this._flowElement.parentElement, CENTER_MIDDLE_TRANSFORM);
        const transform = this._panzoom.getTransform();
        this._panzoom.smoothZoomAbs(offsets.x, transform.y + transform.scale * y, 1);
    }

    handleNodeSelectionDeselection = event => {
        const flowModel = this._flowModel;

        if (event && event.detail) {
            const {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableCanvasElementGuids,
                topSelectedGuid
            } = !event.detail.isSelected
                ? getCanvasElementSelectionData(flowModel, event.detail.canvasElementGUID, this._topSelectedGuid)
                : getCanvasElementDeselectionData(flowModel, event.detail.canvasElementGUID, this._topSelectedGuid);

            this._topSelectedGuid = topSelectedGuid;

            const flcSelectionEvent = new FlcSelectionEvent(
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableCanvasElementGuids,
                this._topSelectedGuid
            );
            this.dispatchEvent(flcSelectionEvent);
        }
    };

    rerender = isFirstRender => {
        calculateFlowLayout(this._flowRenderContext);

        if (isFirstRender) {
            // first render, no animation
            this.renderFlow(1);
        } else {
            animate(progress => this.renderFlow(progress));
        }
    };

    renderedCallback() {
        if (!this._builderElement) {
            this._builderElement = this.query('.builder');
            this.updateFlowRenderContext();
        } else if (!this._flowElement) {
            const flowElement = this.query('.flows');
            if (flowElement) {
                this._flowElement = flowElement;
                this._panzoom = panzoom(this._flowElement, {
                    transformOrigin: CENTER_TOP_TRANSFORM,
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

                this._panzoom.moveTo(this._flowElement.clientWidth / 2, 0);
                this._panzoom.on('pan', this.handleOnPan);
            }
        }
    }

    query = selector => {
        return this.template.querySelector(selector);
    };

    renderFlow(progress) {
        const flowRenderInfo = renderFlow(this._flowRenderContext, progress);
        this.flow = getFlcFlowData(flowRenderInfo, { guid: ROOT_KEY }, 0);
        //   this.updateElementsForViewport();
    }

    // updateShouldRender(elements, rect) {
    //     const { scale } = this._panzoom.getTransform();
    //     let { height } = rect;
    //     const { top } = rect;

    //     height /= scale;

    //     const minY = -top + 26 - RENDER_BUFFER_SIZE;
    //     const maxY = minY + height + 2 * RENDER_BUFFER_SIZE;

    //     elements.forEach(element => {
    //         let { y, h } = element;
    //         y *= scale;
    //         h *= scale;

    //         const shouldRender = y + h >= minY && y <= maxY;
    //         if (shouldRender !== element.shouldRender) {
    //             element = { ...element, shouldRender };
    //         }
    //     });
    // }

    getFlowHeight() {
        const { nodes } = this.flowRenderInfo;
        return nodes.reduce((prev, curr) => (prev < curr.y ? curr.y : prev), 0);
    }

    // updateElementsForViewport = () => {
    //     if (!this._builderElement) {
    //         return;
    //     }

    //     if (this._flowElement) {
    //         const rect = this._flowElement.getBoundingClientRect();

    //         this.updateShouldRender(this.flowRenderInfo.nodes, rect);
    //     }
    // };

    handleClickToZoom = event => {
        const zoomAction = event.detail.action;
        let { x, y, scale } = this._panzoom.getTransform();
        let moveToCenterTop = false;

        switch (zoomAction) {
            case ZOOM_ACTION.ZOOM_OUT:
                scale -= ZOOM_SCALE_STEP;
                break;
            case ZOOM_ACTION.ZOOM_IN:
                scale += ZOOM_SCALE_STEP;
                break;
            case ZOOM_ACTION.ZOOM_TO_VIEW:
                scale = 1;
                moveToCenterTop = true;
                break;
            case ZOOM_ACTION.ZOOM_TO_FIT:
                scale = Math.min(
                    /* TODO: FLC remove hardcoded 50 */
                    (this._builderElement.clientHeight - 50) / this.getFlowHeight(),
                    1
                );
                moveToCenterTop = true;
                break;
            default:
        }

        if (moveToCenterTop) {
            const centerX = this._builderElement.clientWidth / 2;
            this._panzoom.moveTo(centerX, 0);
            x = centerX;
            y = 0;
        }
        this._panzoom.smoothZoomAbs(x, y, scale);
        this.updateScale(scale);
    };

    updateUiAfterPanzoom(scale) {
        this.isZoomInDisabled = scale >= MAX_ZOOM - FUDGE;
        this.isZoomOutDisabled = scale <= MIN_ZOOM + FUDGE;
        this.isZoomToView = this.isZoomInDisabled;
        //    this.updateElementsForViewport();
    }

    updateScale = scale => {
        this._scale = scale;
        this.updateUiAfterPanzoom(scale);
    };

    handleOnPan = e => {
        const { scale } = e.getTransform();
        this.updateUiAfterPanzoom(scale);
    };

    handleFlcFlowClick = event => {
        event.stopPropagation();
        if (event.target === this.template.querySelector('builder_platform_interaction-flc-flow')) {
            const closePropertyEditorEvent = new ClosePropertyEditorEvent();
            this.dispatchEvent(closePropertyEditorEvent);
        }
    };
}
