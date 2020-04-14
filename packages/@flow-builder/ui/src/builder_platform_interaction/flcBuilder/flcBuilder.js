import { LightningElement, track, api } from 'lwc';
import {
    renderFlow,
    toggleFlowMenu,
    calculateFlowLayout,
    getDefaultLayoutConfig,
    animate,
    MenuType,
    getStyle,
    panzoom
} from 'builder_platform_interaction/flowUtils';
import { ZOOM_ACTION, FlcSelectionEvent, ClosePropertyEditorEvent } from 'builder_platform_interaction/events';
import {
    getCanvasElementSelectionData,
    getCanvasElementDeselectionData,
    getCanvasElementDeselectionDataOnToggleOff
} from 'builder_platform_interaction/flcBuilderUtils';

const RENDER_BUFFER_SIZE = 200;

const MAX_ZOOM = 1;
const MIN_ZOOM = 0.1;
const ZOOM_SCALE_STEP = 0.2;

const CONNECTOR_ICON_SIZE = 20;
const MENU_ICON_SIZE = 48;

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
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(fct, wait);

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
    _flowRenderContext = {};
    _isSelectionMode;
    _observer;
    _scale = 1;
    _topSelectedGuid;

    @track
    isZoomToView = true;

    @track
    isZoomInDisabled = true;

    @track
    isZoomOutDisabled = false;

    @track
    flowRenderInfo;

    @track
    _forceRender = 0;

    @track
    menu;

    @api
    elementsMetadata;

    @api
    isPasteAvailable;

    @api
    set isSelectionMode(isSelectionMode) {
        this._isSelectionMode = isSelectionMode;
        if (this._isSelectionMode) {
            this.hideMenu();
        } else if (this._topSelectedGuid) {
            const {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableCanvasElementGuids,
                topSelectedGuid
            } = getCanvasElementDeselectionDataOnToggleOff(this._flowRenderContext.flowModel, this._topSelectedGuid);

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

    get isSelectionMode() {
        return this._isSelectionMode;
    }

    @api
    set flowModel(flowModel) {
        this.updateFlowRenderContext({ flowModel });
    }

    get flowModel() {
        return this._flowRenderContext.flowModel;
    }

    constructor() {
        super();

        this.rerender = debounce(this.rerender, 10);
    }

    updateFlowRenderContext(flowRenderContext) {
        if (flowRenderContext) {
            Object.assign(this._flowRenderContext, flowRenderContext);
        }

        this.rerender();
    }

    hideMenu() {
        if (this.menu) {
            this.menu = null;
            this.updateFlowRenderContext({
                interactionState: toggleFlowMenu(null, this._flowRenderContext.interactionState)
            });
        }
    }

    handleToggleMenu = event => {
        const { detail } = event;
        const interactionState = toggleFlowMenu(detail, this._flowRenderContext.interactionState);

        const connectorMenu = detail.type === MenuType.CONNECTOR;
        const { top, left } = this._flowElement.getBoundingClientRect();
        const offset = connectorMenu ? CONNECTOR_ICON_SIZE * (1 - this._scale) : MENU_ICON_SIZE * (1 - this._scale);

        const style = getStyle({
            left: (detail.left - left) * (1 / this._scale) - offset,
            top: (detail.top - top) * (1 / this._scale) - offset,
            zIndex: 5
        });

        this.menu = this.menu
            ? null
            : {
                  ...detail,
                  connectorMenu,
                  elementsMetadata: this.elementsMetadata,
                  style
              };

        this.updateFlowRenderContext({ interactionState });
        if (this.menu) {
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
        if (event && event.detail) {
            const {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableCanvasElementGuids,
                topSelectedGuid
            } = !event.detail.isSelected
                ? getCanvasElementSelectionData(
                      this._flowRenderContext.flowModel,
                      event.detail.canvasElementGUID,
                      this._topSelectedGuid
                  )
                : getCanvasElementDeselectionData(
                      this._flowRenderContext.flowModel,
                      event.detail.canvasElementGUID,
                      this._topSelectedGuid
                  );

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

    isFirstRender() {
        return this._flowRenderContext.nodeLayoutMap == null;
    }

    rerender = () => {
        if (!this.shouldRenderFlow) {
            return;
        }

        if (this.isFirstRender()) {
            const elementsMetadata = this.elementsMetadata.reduce((acc, elementMetadata) => {
                acc[elementMetadata.elementType] = elementMetadata;
                return acc;
            }, {});

            Object.assign(this._flowRenderContext, {
                nodeLayoutMap: {},
                interactionState: {},
                elementsMetadata,
                layoutConfig: { ...getDefaultLayoutConfig() }
            });
        }

        this._flowRenderContext.progress = 0;
        calculateFlowLayout(this._flowRenderContext);

        if (this.isFirstRender()) {
            // first render, no animation
            this.renderFlow(1);
        } else {
            animate(progress => this.renderFlow(progress));
        }
    };

    renderedCallback() {
        if (!this._builderElement) {
            this._builderElement = this.query('.builder');
        } else if (!this._flowElement) {
            const flowElement = this.query('builder_platform_interaction-flc-flow');
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

    get shouldRenderFlow() {
        return this._builderElement && this._flowRenderContext.flowModel;
    }

    query = selector => {
        return this.template.querySelector(selector);
    };

    renderFlow(progress) {
        this._flowRenderContext.progress = progress;
        this.flowRenderInfo = renderFlow(this._flowRenderContext);
        this.updateElementsForViewport();
        this._forceRender++;
    }

    updateShouldRender(elements, rect) {
        const { scale } = this._panzoom.getTransform();
        let { height } = rect;
        const { top } = rect;

        height /= scale;

        const minY = -top + 26 - RENDER_BUFFER_SIZE;
        const maxY = minY + height + 2 * RENDER_BUFFER_SIZE;

        let didUpdate = false;
        elements.forEach(element => {
            let { y, h } = element;
            y *= scale;
            h *= scale;

            const shouldRender = y + h >= minY && y <= maxY;
            if (shouldRender !== element.shouldRender) {
                element = { ...element, shouldRender };
                didUpdate = true;
            }
        });

        if (didUpdate) {
            this._forceRender++;
        }
    }

    getFlowHeight() {
        const { nodes } = this.flowRenderInfo;
        return nodes.reduce((prev, curr) => (prev < curr.y ? curr.y : prev), 0);
    }

    updateElementsForViewport = () => {
        if (!this._builderElement) {
            return;
        }

        if (this._flowElement) {
            const rect = this._flowElement.getBoundingClientRect();

            this.updateShouldRender(this.flowRenderInfo.nodes, rect);
        }
    };

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
        this.updateElementsForViewport();
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
