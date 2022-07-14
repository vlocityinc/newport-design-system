import {
    AutoLayoutCanvasMode,
    CanvasContext,
    CustomIconMap,
    getAlcFlowData,
    getCanvasElementDeselectionData,
    getCanvasElementSelectionData,
    getFirstSelectableElementGuid,
    getZoomKeyboardInteraction,
    importComponent,
    isCutMode,
    isDefaultMode,
    isReconnectionMode,
    isSelectionMode
} from 'builder_platform_interaction/alcComponentsUtils';
import {
    AlcSelectionEvent,
    CloseMenuEvent,
    CreateGoToConnectionEvent,
    DeleteBranchElementEvent,
    GoToPathEvent,
    MenuRenderedEvent,
    NodeResizeEvent,
    PasteOnCanvasEvent,
    ToggleMenuEvent,
    UpdateAutolayoutCanvasModeEvent
} from 'builder_platform_interaction/alcEvents';
import AlcFlow from 'builder_platform_interaction/alcFlow';
import { processConnectorMenuMetadata } from 'builder_platform_interaction/alcMenuUtils';
import {
    animate,
    calculateFlowLayout,
    clearDeletionPathInfo,
    closeFlowMenu,
    ConnectionSource,
    Dimension,
    ElementMetadata,
    findSourceForPasteOperation,
    FlowInteractionState,
    FlowRenderContext,
    FlowRenderInfo,
    Geometry,
    getConnectionSource,
    getConnectionTarget,
    getCutGuids,
    getDefaultLayoutConfig,
    getTargetGuidsForReconnection,
    Guid,
    isBranchTerminal,
    MenuType,
    NodeType,
    panzoom,
    renderFlow,
    resolveParent,
    shouldDeleteGoToOnNext,
    toggleFlowMenu,
    updateDeletionPathInfo
} from 'builder_platform_interaction/autoLayoutCanvas';
import {
    CanvasMouseUpEvent,
    ClickToZoomEvent,
    ClosePropertyEditorEvent,
    CutElementsEvent,
    DeleteElementEvent,
    EditElementEvent,
    ZOOM_ACTION
} from 'builder_platform_interaction/events';
import {
    commonUtils,
    invokeModal,
    keyboardInteractionUtils,
    loggingUtils,
    lwcUtils,
    modalBodyVariant,
    ShortcutKey
} from 'builder_platform_interaction/sharedUtils';
import { time } from 'instrumentation/service';
import { classSet } from 'lightning/utils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './alcCanvasLabels';
import {
    findConnector,
    findNode,
    getBoundingBoxForElements,
    getDomElementGeometry,
    getGoToElementsGeometry,
    getNodeAndGoToGeometry,
    getSanitizedNodeGeo,
    shouldDeleteBeyondMergingPoint
} from './alcCanvasUtils';

const { debounce } = commonUtils;

type Position = {
    top: number;
    left: number;
};

// Margin added for zoomToFit
const VIEWPORT_SPACING = 100;

const MAX_ZOOM = 1;
const MIN_ZOOM = 0.1;

const ZOOM_SCALE_STEP = 0.2;

const selectors = {
    canvasClass: '.canvas',
    flowContainerClass: '.flow-container',
    alcFlow: 'builder_platform_interaction-alc-flow',
    zoomPanel: 'builder_platform_interaction-zoom-panel'
};

const DOUBLE_CLICK_THRESHOLD = 250;

const defaultConfig = getDefaultLayoutConfig();
const NODE_ICON_SIZE = defaultConfig.node.icon.w;
const CONNECTOR_ICON_SIZE = defaultConfig.connector.icon.w;
const SYNTHETIC_ZOOM_TO_VIEW_EVENT = new ClickToZoomEvent(ZOOM_ACTION.ZOOM_TO_VIEW);

const { withKeyboardInteractions } = keyboardInteractionUtils;

const {
    logPerfTransactionEnd,
    logPerfTransactionStart,
    logInteraction,
    initMetricsTracker,
    writeMetrics,
    AUTOLAYOUT_CANVAS
} = loggingUtils;

const AUTOLAYOUT_CANVAS_SELECTION = 'AUTOLAYOUT_CANVAS_SELECTION';

const GRABBING_CURSOR_CLASS = 'grabbing-cursor';

export default class AlcCanvas extends withKeyboardInteractions(LightningElement) {
    static delegatesFocus = true;

    dom = lwcUtils.createDomProxy(this, selectors);

    // keeps track of whether the flow as been visibly rendered (ie without slds-hidden)
    private hasBeenVisiblyRendered = false;

    _panzoom;
    _animatePromise: Promise<void> = Promise.resolve() as Promise<void>;

    /* if the builder has been disconnected */
    _isDisconnected = false;

    /* the canvas element (ie the viewport) */
    _canvasElement;

    /* the container for the flow and menus */
    _flowContainerElement;

    /* the flow model to render */
    _flowModel;

    /* the rendering context */
    _flowRenderContext!: FlowRenderContext;

    /* the rendered flow */
    _flowRenderInfo!: FlowRenderInfo;

    /* the top most selected element's guid */
    _topSelectedGuid!: Guid | null;

    /* the guid of the source of the GoTo connection */
    _goToSource: ConnectionSource | null = null;

    /* Array of guids the user can goTo */
    _goToableGuids!: Guid[];

    /* whether a goto connection being made is part of rerouting an existing goto */
    _isReroutingGoto!: boolean;

    /**
     * Guid to set focus on when entering selection mode
     * to select a GoTo target
     */
    _elementGuidToFocus!: Guid | null;

    /**
     * Guid of the top element that has been cut
     */
    _topCutGuid!: Guid | null;

    /* the current scale with a domain of [MIN_ZOOM, MAX_ZOOM] */
    _scale!: number;

    /* offsets to center the zoom */
    _panzoomOffsets;

    /** Used for ZoomEnd trigger */
    zoomEndAction: (() => void) | undefined;

    // Number of nodes which require dynamic rendering upon initial load
    // If this is > 0, then a spinner will be shown until all dynamic nodes
    // have rendered and the canvas layout is complete
    //
    // Note: this is only used for the initial render
    dynamicNodeCountAtLoad = 0;

    // Variable to keep a track of when panning is in progress
    isPanInProgress = false;

    @track
    canvasContext: Readonly<CanvasContext> = {
        elementsMetadata: [],
        connectorMenuMetadata: null,
        mode: AutoLayoutCanvasMode.DEFAULT,
        numPasteElementsAvailable: 0,
        cutInfo: {
            guids: []
        },
        menu: null,
        customIconMap: {},
        incomingStubGuid: null
    };

    isFirstTimeCalled = true;
    loadAlcCanvasStartTime;
    _customIconMap: CustomIconMap = {};

    constructor() {
        super();
        logPerfTransactionStart(AUTOLAYOUT_CANVAS, null, null);
        this.loadAlcCanvasStartTime = time();
        initMetricsTracker();
    }

    // stash the last clicked element guid until the DOUBLE_CLICK_THRESHOLD is exceeded
    lastClickedElementGuid: string | null = null;

    @track
    isZoomInDisabled = true;

    @track
    isZoomOutDisabled = false;

    @track
    flow;

    @api
    disableDebounce = false;

    @api
    disableAnimation = false;

    @api
    set numPasteElementsAvailable(numPasteElementsAvailable) {
        this.updateCanvasContext({ numPasteElementsAvailable });
    }

    get numPasteElementsAvailable() {
        return this.canvasContext.numPasteElementsAvailable;
    }

    @api
    offsets = [0, 0];

    @api
    shortcuts: { [key: string]: ShortcutKey } = {};

    @api
    set connectorMenuMetadata(nextMenuMetadata: ConnectorMenuMetadata) {
        const prevMenuMetadata = this.canvasContext.connectorMenuMetadata;
        processConnectorMenuMetadata(prevMenuMetadata, nextMenuMetadata).then(() =>
            this.updateCanvasContext({ connectorMenuMetadata: nextMenuMetadata })
        );
    }
    get connectorMenuMetadata() {
        return this.canvasContext.connectorMenuMetadata!;
    }

    @api
    disableDeleteElements;

    @api
    disableEditElements;

    /**
     * The active element refers to the element currently being edited using the property editor panel
     */
    @api
    activeElementGuid;

    @api
    set elementsMetadata(elementsMetadata: ElementMetadata[]) {
        this.updateCanvasContext({ elementsMetadata });

        elementsMetadata.forEach((elementMetadata) => {
            const { menuComponent } = elementMetadata;

            if (menuComponent != null) {
                importComponent(menuComponent);
            }
        });

        // Used to make sure flow.info sent to alc-flow does not have stale elementsMetadata
        if (this.canvasContext.elementsMetadata) {
            this.updateFlowRenderContext({ elementsMetadata: this._convertToElementMetadataMap() });
        }
    }

    get elementsMetadata(): ElementMetadata[] {
        return this.canvasContext.elementsMetadata!;
    }

    @api
    set canvasMode(canvasMode) {
        this.handleUpdateAutolayoutMode(canvasMode);
    }

    get canvasMode() {
        return this.canvasContext.mode;
    }

    @api
    set flowModel(flowModel) {
        this._flowModel = flowModel;
        this.updateFlowRenderContext({ flowModel });
    }

    get flowModel() {
        return this._flowModel;
    }

    @api
    get customIconMap(): CustomIconMap {
        return this._customIconMap;
    }

    set customIconMap(iconMap: CustomIconMap) {
        this.updateCanvasContext({ customIconMap: iconMap });
        this._customIconMap = iconMap;
    }

    @api
    focusOnNode = (elementGuid: Guid) => {
        this._focusOnNode(elementGuid);
        this.clearIncomingStubGuid();
    };

    _focusOnNode = (elementGuid: Guid) => {
        const alcFlow = this.dom.as<AlcFlow>().alcFlow;
        const node = findNode(elementGuid, this.flowModel, alcFlow);
        // need to focus first as it can change the node's geometry
        node.focus();

        this.panIntoView(getSanitizedNodeGeo(node, this.scale));
    };

    @api
    focusOnConnector = (source: ConnectionSource) => {
        const alcFlow = this.dom.as<AlcFlow>().alcFlow;
        findConnector(source, this.flowModel, alcFlow).focus();
    };

    // TODO: should remove this method, the canvas should take care of this detail itself
    @api
    clearIncomingStubGuid() {
        this.updateCanvasContext({ incomingStubGuid: null });
    }

    /**
     * Closes any opened node or connector menu
     *
     * @param withAnimation - Whether to animate closing the menu
     */
    @api
    closeNodeOrConnectorMenu(withAnimation = true) {
        // W-10101786: Clicking outside the canvas while the canvas is still loading throws a gack
        if (!this._flowRenderContext || this.canvasContext.menu == null) {
            return;
        }

        const interactionState = closeFlowMenu(this._flowRenderContext.interactionState);
        this.updateCanvasContext({ menu: null });
        this.updateFlowRenderContext({ interactionState });

        if (!withAnimation) {
            // To prevent the closing menu animation, reset the flow layout after updating
            // the flow render context, before the animation code runs.
            calculateFlowLayout(this._flowRenderContext);
        }
    }

    getKeyboardInteractions() {
        return [getZoomKeyboardInteraction(this.shortcuts, this.handleZoomAction)];
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = scale;
        this.isZoomInDisabled = scale >= MAX_ZOOM;
        this.isZoomOutDisabled = scale <= MIN_ZOOM;
    }

    /**
     * Spinner shown if all dynamic node components have not rendered
     * We need to wait for them since the layout will not be valid until they are done
     *
     * This should never return true after initial render
     *
     * @returns - True if the spinner should be displayed
     */
    get showSpinner(): boolean {
        return !this._flowRenderContext || this.shouldHideFlow();
    }

    get displayScopedNotification(): boolean {
        return !isDefaultMode(this.canvasMode);
    }

    getStartElementGuid() {
        return this.flowModel[NodeType.ROOT].children[0];
    }

    /**
     * Helper function to pan the canvas given the panning amount in x and y direction
     *
     * @param moveX - Amount to move in x direction
     * @param moveY - Amount to move in y direction
     */
    panAndResetPanningVariable(moveX: number, moveY: number) {
        // Calling moveBy triggers pan event, but doesn't trigger the panend event.
        // Hence need to manually set isPanInProgress to false
        this._panzoom.moveBy(moveX, moveY);
        this.isPanInProgress = false;
    }

    /**
     * Pans an element to the center of the canvas viewport.
     * The element is only panned if it is not already in the viewport
     *
     * @param nodeGeo - The element to pan into the viewport
     * @param alwaysPan - Pan even if in viewport
     * @returns true if had to pan into view port
     */
    panIntoView(nodeGeo: Geometry, alwaysPan = false): boolean {
        const canvasGeo = getDomElementGeometry(this._canvasElement);
        const offsetX = nodeGeo.x - canvasGeo.x;
        const offsetY = nodeGeo.y - canvasGeo.y;

        // only pan if the element is not visible in the canvas viewport
        if (
            offsetX + nodeGeo.w > canvasGeo.w ||
            offsetX < 0 ||
            offsetY + nodeGeo.h > canvasGeo.h ||
            offsetY < 0 ||
            alwaysPan
        ) {
            // pan the element to the center of the canvas viewport
            const moveX = -(offsetX + nodeGeo.w / 2) + canvasGeo.w / 2;
            const moveY = -(offsetY + nodeGeo.h / 2) + canvasGeo.h / 2;
            this.panAndResetPanningVariable(moveX, moveY);
            return true;
        }
        return false;
    }

    @api
    getAriaSections(): HTMLElement[] {
        return [this.dom.alcFlow, this.dom.zoomPanel];
    }

    // flag will be set to true once the canvas as been rendered
    canvasReady = false;

    // TODO: W-10146473 [Trust] use decorator to reduce duplicate code for logging
    renderedCallback() {
        super.renderedCallback();

        let hasLoadAlcCanvasError = false;
        try {
            if (this._canvasElement == null) {
                this._canvasElement = this.dom.canvasClass;
                this.updateFlowRenderContext();
            }

            if (!this._flowContainerElement) {
                this.postRenderInit();
            }
        } catch (e) {
            hasLoadAlcCanvasError = true;
            throw e;
        } finally {
            if (this.isFirstTimeCalled) {
                const numberOfElements = this.flowModel && Object.keys(this.flowModel).length;
                logPerfTransactionEnd(AUTOLAYOUT_CANVAS, { numberOfElements }, null);
                writeMetrics(AUTOLAYOUT_CANVAS, time() - this.loadAlcCanvasStartTime, hasLoadAlcCanvasError, {});
                this.isFirstTimeCalled = false;
            }
        }

        this.checkAndDispatchCanvasReady();
    }

    /**
     * Dispatches a canvasready event when the canvas becomes ready
     */
    checkAndDispatchCanvasReady() {
        if (
            this.dom.alcFlow &&
            !this.canvasReady &&
            (this.canvasContext.menu != null || this.getStartMenuComponent() == null)
        ) {
            this.canvasReady = true;
            this.dispatchEvent(new CustomEvent('canvasready', { bubbles: true, composed: true }));
        }
    }

    postRenderInit() {
        const flowContainerElement = this.dom.flowContainerClass;
        if (flowContainerElement != null) {
            this._flowContainerElement = flowContainerElement;
            this.initializePanzoom();

            // open the start element menu on load
            this.openStartMenu();
        }
    }

    /**
     * Returns the start menu component
     *
     * @returns The start menu component, if any
     */
    getStartMenuComponent(): string | undefined {
        const startElementGuid = this.getStartElementGuid();
        const startElement = this.flowModel[startElementGuid];
        const elementMetadata = this._flowRenderContext.elementsMetadata[startElement.elementType];
        return elementMetadata.menuComponent;
    }

    /**
     * Opens the start menu
     */
    openStartMenu() {
        const menuComponent = this.getStartMenuComponent();

        if (menuComponent) {
            const startElementGuid = this.getStartElementGuid();
            importComponent(menuComponent).then(() => {
                const interactionState = {
                    ...this._flowRenderContext.interactionState,
                    menuInfo: { key: startElementGuid, type: MenuType.NODE },
                    deletionPathInfo: null
                };

                const event = new ToggleMenuEvent({
                    type: MenuType.NODE,
                    source: { guid: startElementGuid },
                    moveFocusToMenu: true,
                    top: 0,
                    left: 0
                });

                this.openMenu(event, interactionState);
            });
        }
    }

    /**
     * Helper function that converts this.canvasContext.elementsMetadata to map of elementType -> metaData
     *
     * @returns - The elements metadata map
     */
    _convertToElementMetadataMap() {
        return this.canvasContext.elementsMetadata!.reduce((acc, elementMetadata) => {
            acc[elementMetadata.elementSubtype || elementMetadata.elementType] = elementMetadata;
            return acc;
        }, {});
    }

    /**
     * Creates the initial flow render context
     *
     * @returns A new flow render context
     */
    createInitialFlowRenderContext(): FlowRenderContext {
        // transforms the elementsMetadata array to a map
        const elementsMetadataMap = this._convertToElementMetadataMap();

        return {
            flowModel: this.flowModel,
            nodeLayoutMap: {},
            interactionState: {
                menuInfo: { key: this.getStartElementGuid(), type: MenuType.NODE }
            },
            elementsMetadata: elementsMetadataMap,
            layoutConfig: { ...getDefaultLayoutConfig() },
            isDeletingBranch: false,
            dynamicNodeDimensionMap: new Map<Guid, Dimension>()
        } as FlowRenderContext;
    }

    /**
     * Handles a elements selection change
     *
     * @param canvasMode - current mode for alc
     */
    handleUpdateAutolayoutMode(canvasMode) {
        // Updating the canvas context with the right mode
        if (this.canvasMode === AutoLayoutCanvasMode.CUT && canvasMode !== AutoLayoutCanvasMode.CUT) {
            this.updateCanvasContext({ mode: canvasMode, cutInfo: { guids: [] } });
        } else {
            this.updateCanvasContext({ mode: canvasMode });
        }
        if (!isDefaultMode(canvasMode)) {
            this.closeNodeOrConnectorMenu();
            if (isReconnectionMode(this.canvasContext.mode)) {
                const firstSelectableElementGuid = getFirstSelectableElementGuid(this.flowModel, 'root');
                if (firstSelectableElementGuid) {
                    // Setting _elementGuidToFocus to firstSelectableElementGuid so that
                    // we can set focus on the correct node during the rerender
                    this._elementGuidToFocus = firstSelectableElementGuid;
                }
            }
        } else {
            this._topSelectedGuid = null;
            this._goToSource = null;
            this._isReroutingGoto = false;

            // make all elements selectable and unselected when exiting selection mode
            if (this.flowModel != null) {
                const allGuids = Object.keys(this.flowModel);
                const alcSelectionEvent = new AlcSelectionEvent([], allGuids, allGuids, null);
                this.dispatchEvent(alcSelectionEvent);
            }
        }
    }

    get zoomPanelStyle() {
        return `left: ${this.offsets[0]}px`;
    }

    /**
     * Updates the flow render context, and triggers a rerender
     *
     * @param flowRenderContext - One or more flow render context properties
     */
    updateFlowRenderContext(flowRenderContext: Partial<FlowRenderContext> = {}) {
        if (this.canvasContext.elementsMetadata == null || this.flowModel == null || this._canvasElement == null) {
            return;
        }

        const isFirstRender = this._flowRenderContext == null;

        if (isFirstRender) {
            this.rerender = this.disableDebounce ? this.rerender : debounce(this.rerender, 10);
            this._flowRenderContext = this.createInitialFlowRenderContext();
            this._scale = MAX_ZOOM;

            // Note the number of dynamic node components we have.  A spinner will be shown
            // until they've all rendered
            const nodes: { elementType: string; elementSubtype: string }[] = Object.values(this.flowModel);

            let count = 0;
            nodes.forEach((node) => {
                const metadata = this._flowRenderContext.elementsMetadata[node.elementSubtype || node.elementType];
                if (metadata && metadata.dynamicNodeComponent) {
                    count++;
                }
            });

            this.dynamicNodeCountAtLoad = count;
        }

        this._flowRenderContext = Object.assign(this._flowRenderContext, flowRenderContext);
        this.rerender();
    }

    setLastClickedElementGuid(guid: Guid) {
        this.lastClickedElementGuid = guid;

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            // clear the guid after the double click threshold is exceeded
            this.lastClickedElementGuid = null;
        }, DOUBLE_CLICK_THRESHOLD);
    }

    /**
     * Zoom to full scale when opening a node or connector menu
     *
     * @param event - The toggle menu event
     */
    zoomForMenuDisplay(event: ToggleMenuEvent) {
        let { left, top } = event.detail;
        const menuButtonHalfWidth =
            event.detail.type === MenuType.CONNECTOR ? CONNECTOR_ICON_SIZE / 2 : NODE_ICON_SIZE / 2;
        const { x, y } = getDomElementGeometry(this._canvasElement);

        const buttonOffset = menuButtonHalfWidth * this.scale;
        top = top - y + buttonOffset;
        left = left - x + buttonOffset;

        this.handleZoomAction(SYNTHETIC_ZOOM_TO_VIEW_EVENT, { top, left });
    }

    /**
     * Hack required to process double clicks on an element when a menu is opened (See @W-8984298):
     *
     * Since the first click of a double click will close the previously opened menu,
     * the second click might not land on the element as it might have changed location
     * because of the new layout. As a workaround, we create a transiant transplarent
     * overlay over the whole canvas to capture the second click and process it.
     *
     * see @W-8984298
     */
    handleOverlayClick() {
        this.dispatchEvent(new EditElementEvent(this.lastClickedElementGuid));
        this.lastClickedElementGuid = null;
    }

    /**
     * Toggles the node or connector menu
     *
     * @param event - the toggle menu event
     */
    handleToggleMenu = (event: ToggleMenuEvent) => {
        const { detail } = event;

        const interactionState = toggleFlowMenu(detail, this._flowRenderContext.interactionState);

        if (interactionState.menuInfo != null) {
            if (this.scale === MAX_ZOOM) {
                this.openMenu(event, interactionState);
            } else {
                this.zoomForMenuDisplay(event);

                this.zoomEndAction = () => {
                    this.openMenu(event, interactionState);
                };
            }
        } else {
            this.updateCanvasContext({ menu: null });
            this.updateFlowRenderContext({ interactionState });
        }
    };

    handleCloseMenu = (event: CloseMenuEvent) => {
        event.stopPropagation();

        const { source, type } = this.canvasContext.menu!;
        if (type === MenuType.CONNECTOR) {
            this.focusOnConnector(source);
        } else if (event.detail.moveFocusToTrigger) {
            this._focusOnNode(source.guid);
        }

        this.closeNodeOrConnectorMenu();
    };

    /**
     * Opens the connector or node menu
     *
     * @param event - The event
     * @param interactionState - The interaction state
     */
    openMenu(event: ToggleMenuEvent, interactionState: FlowInteractionState) {
        const { moveFocusToMenu, type, source } = event.detail;

        if (type === MenuType.NODE) {
            this.setLastClickedElementGuid(source.guid);
        }

        // Close any open menu without animation before opening the new menu.
        // This will avoid the confusing "double animation" where we are both animating the closing of the prior menu,
        // and the opening the new menu.
        this.closeNodeOrConnectorMenu(false);

        this.updateCanvasContext({ menu: { type, source, autoFocus: moveFocusToMenu } });

        this.updateFlowRenderContext({ interactionState });
    }

    fireEventOnCanvasModeChange(mode: AutoLayoutCanvasMode | undefined) {
        // Make sure we always fire an event when we update the mode
        if (mode && this.canvasContext.mode !== mode) {
            this.dispatchEvent(new UpdateAutolayoutCanvasModeEvent(mode));
        }
    }

    updateCanvasContext(canvasContext: Partial<CanvasContext>) {
        this.fireEventOnCanvasModeChange(canvasContext.mode);
        this.canvasContext = { ...this.canvasContext, ...canvasContext };
    }

    /**
     * Handles the "Add GoTo" connector menu item selection
     *
     * @param event - The Goto path event
     */
    handleAddOrRerouteGoToItemSelection = (event: GoToPathEvent) => {
        const { source, isReroute } = event.detail;
        this._goToSource = source;
        this.updateCanvasContext({ mode: AutoLayoutCanvasMode.RECONNECTION });

        this._isReroutingGoto = isReroute!;

        const next = getConnectionTarget(this.flowModel, source)!;
        const { mergeableGuids, goToableGuids, firstMergeableNonNullNext } = getTargetGuidsForReconnection(
            this.flowModel,
            source,
            next
        );

        this._goToableGuids = goToableGuids;

        const selectableGuids = firstMergeableNonNullNext
            ? [...mergeableGuids, ...goToableGuids, firstMergeableNonNullNext]
            : [...mergeableGuids, ...goToableGuids];

        const alcSelectionEvent = new AlcSelectionEvent([], [], selectableGuids, null, true);
        this.dispatchEvent(alcSelectionEvent);
    };

    dispatchAlcSelectionEvent({ isSelected, canvasElementGUID }) {
        logPerfTransactionStart(AUTOLAYOUT_CANVAS_SELECTION, null, null);
        const flowModel = this.flowModel;

        const {
            canvasElementGuidsToSelect,
            canvasElementGuidsToDeselect,
            selectableCanvasElementGuids,
            topSelectedGuid
        } = !isSelected
            ? getCanvasElementSelectionData(flowModel, canvasElementGUID, this._topSelectedGuid)
            : getCanvasElementDeselectionData(flowModel, canvasElementGUID, this._topSelectedGuid);

        this._topSelectedGuid = topSelectedGuid;

        const alcSelectionEvent = new AlcSelectionEvent(
            canvasElementGuidsToSelect,
            canvasElementGuidsToDeselect,
            selectableCanvasElementGuids,
            this._topSelectedGuid
        );
        this.dispatchEvent(alcSelectionEvent);
        logPerfTransactionEnd(
            AUTOLAYOUT_CANVAS_SELECTION,
            {
                numberOfSelectedElements: canvasElementGuidsToSelect.length,
                numberOfDeselectedElements: canvasElementGuidsToDeselect.length
            },
            null
        );
    }

    /**
     * Handles node selection and deselection
     *
     * @param event - The Selected Deselected event
     */
    handleNodeSelectionDeselection = (event) => {
        const goToSource = this._goToSource;
        const target = event.detail.canvasElementGUID;

        event.stopPropagation();
        if (goToSource != null) {
            this._elementGuidToFocus = event.detail.canvasElementGUID;

            this.dispatchEvent(new CreateGoToConnectionEvent(goToSource, target, this._isReroutingGoto));
            this.updateCanvasContext({ mode: AutoLayoutCanvasMode.DEFAULT });
            const connectionType = this._goToableGuids.includes(event.detail.canvasElementGUID) ? 'GoTo' : 'Merge';
            logInteraction('create-goto-or-merge', AUTOLAYOUT_CANVAS, { connectionType }, 'click', 'user');
        } else {
            this.dispatchAlcSelectionEvent(event.detail);
        }
    };

    /**
     * Clears the deletionPathInfo from the interaction state that in turn clears the highlighted
     * path on the canvas
     */
    handleClearHighlightedPath = () => {
        const interactionState = clearDeletionPathInfo(this._flowRenderContext.interactionState);
        this.updateFlowRenderContext({ interactionState });
    };

    /**
     * Highlights the path to be deleted
     *
     * @param event - The HighlightPathsToDeleteOrCut event
     */
    handleHighlightPathsToDeleteOrCut = (event) => {
        const { elementGuid, childIndexToKeep, operationType } = event.detail;
        const elementToDeleteOrCut = resolveParent(this.flowModel, elementGuid);

        const shouldHighlightBeyondMergingPoint = !!(
            shouldDeleteGoToOnNext(this.flowModel, elementToDeleteOrCut, childIndexToKeep) ||
            (elementToDeleteOrCut.next &&
                childIndexToKeep != null &&
                isBranchTerminal(this.flowModel, elementToDeleteOrCut, childIndexToKeep))
        );

        const interactionState = updateDeletionPathInfo(
            event.detail.elementGuid,
            event.detail.childIndexToKeep,
            this._flowRenderContext.interactionState,
            shouldHighlightBeyondMergingPoint,
            operationType
        );
        this.updateFlowRenderContext({ interactionState });
    };

    /**
     * Highlights all incoming GoTo stubs and zoom to fit them if outside of viewport
     *
     * @param event - The OutgoingGoToStubClickEvent event
     */
    handleHighlightAllOutgoingStubs = (event) => {
        // Highlights goTo stubs
        this.updateCanvasContext({ incomingStubGuid: event.detail.guid });

        this.stubInteractionZoomToFit(event.detail.guid);
    };

    /**
     * Handles the zoom to fit stub interaction
     *
     * @param incomingStubGuid - Guid of incoming stub that was clicked
     */
    stubInteractionZoomToFit(incomingStubGuid: Guid) {
        const alcFlow = this.dom.as<AlcFlow>().alcFlow;
        const goToStubElementsGeometry = getGoToElementsGeometry(incomingStubGuid, this.flowModel, alcFlow);
        const canvasElementsGeometry = goToStubElementsGeometry.concat(
            getSanitizedNodeGeo(findNode(incomingStubGuid, this.flowModel, alcFlow), this.scale)
        );
        const elementBounds = getBoundingBoxForElements(canvasElementsGeometry);
        this.stubInteractionPanAndZoom(elementBounds);
    }

    /**
     * Pan and sets scale of provided geometry
     *
     * @param elementBounds - provided element geometry
     */
    stubInteractionPanAndZoom(elementBounds: Geometry) {
        if (this.panIntoView(elementBounds)) {
            const newScale = Math.min(MAX_ZOOM, this.calculateZoomToFitScale(elementBounds));
            const { left, top } = this.getCanvasCenter();
            this._panzoom.smoothZoomAbs(left, top, newScale);
            this.scale = newScale;
        }
    }

    /**
     * Calculates zoom to fit scale  based on given geometry
     *
     * @param elementBounds - provided element geometry
     * @returns - new scale to achieve zoom to fit
     */
    calculateZoomToFitScale(elementBounds: Geometry) {
        const { w, h } = getDomElementGeometry(this._canvasElement);
        let newScale = Math.min((w - VIEWPORT_SPACING) / elementBounds.w, (h - VIEWPORT_SPACING) / elementBounds.h);
        newScale *= this.scale;
        return newScale;
    }

    /**
     * Re-renders the flow
     */
    rerender = () => {
        if (this._isDisconnected) {
            // return if disconnected; this may occur because of debouncing
            return;
        }

        calculateFlowLayout(this._flowRenderContext);

        if (!this.hasBeenVisiblyRendered || this.disableAnimation) {
            // no animations for the first render
            this.renderFlow(1);
            this.hasBeenVisiblyRendered = true;
        } else {
            this._animatePromise = animate((progress) => this.renderFlow(progress));
            this._animatePromise.then(() => {
                // Moving focus to the expected element when entering selection mode to
                // select the GoTo target and when the target is selected.
                if (this._elementGuidToFocus) {
                    if (this.flowModel[this._elementGuidToFocus].nodeType === NodeType.END) {
                        const endElement = this.flowModel[this._elementGuidToFocus];
                        this.focusOnConnector(getConnectionSource(endElement));
                    } else {
                        this.focusOnNode(this._elementGuidToFocus);
                    }
                    this._elementGuidToFocus = null;
                }

                // Moving focus to the connector above the element(s) that
                // were cut and pasted
                if (this._topCutGuid) {
                    const topPastedElement = this.flowModel[this._topCutGuid];
                    this.focusOnConnector(getConnectionSource(topPastedElement));
                    this._topCutGuid = null;
                }
            });
        }
    };

    /**
     * Initializes the panzoom object
     */
    initializePanzoom() {
        this._panzoom = panzoom(this._flowContainerElement, {
            smoothScroll: false,
            // disable double click zoom
            zoomDoubleClickSpeed: 1,
            minZoom: MIN_ZOOM,
            maxZoom: MAX_ZOOM,
            // disable wheel zoom
            beforeWheel: () => true,

            // disable touch zoom
            onTouch: () => true,

            // disable pinch zoom
            pinchSpeed: 1,

            // disable zoom keys
            filterKey: () => true
        });

        const onZoomEnd = () => {
            if (this.zoomEndAction) {
                this.zoomEndAction();
            }
            this.zoomEndAction = undefined;
        };

        this._panzoom.on('zoomend', onZoomEnd);
        this.panzoomMoveToCenterTop();
        this._panzoomOffsets = { x: 0, y: 0 - (this.getFlowHeight() * MIN_ZOOM) / 2 };
        this._panzoom.on('pan', () => {
            this.isPanInProgress = true;
        });
        this._panzoom.on('panend', () => {
            this.isPanInProgress = false;
        });
    }

    /**
     * Centers the flow
     */
    panzoomMoveToCenterTop() {
        this._panzoom.moveTo(getDomElementGeometry(this._canvasElement).w / 2, 0);
    }

    /**
     * Renders the flow
     *
     * @param progress - the animation progress with domain [0, 1]
     */
    renderFlow(progress: number) {
        this._flowRenderInfo = renderFlow(this._flowRenderContext, progress);
        this.flow = getAlcFlowData(this._flowRenderInfo, { guid: NodeType.ROOT, childIndex: 0 });
        // TODO: temp fix to keep flow and flowModel in sync
        this.flow.flowModel = this._flowRenderContext.flowModel;
    }

    shouldHideFlow() {
        return this.dynamicNodeCountAtLoad > this._flowRenderContext?.dynamicNodeDimensionMap?.size;
    }

    get flowContainerClass() {
        return classSet('flow-container').add({
            'slds-hidden': this.shouldHideFlow()
        });
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
     * @param domElement - a DOM element
     * @returns The Geometry for the DOM element
     */
    getDomElementGeometry(domElement: HTMLElement) {
        const { left, right, top, bottom } = domElement.getBoundingClientRect();
        return { x: left, y: top, w: right - left, h: bottom - top };
    }

    /**
     * Returns the coordinates of the center of the canvas
     *
     * @returns - The canvas center
     */
    getCanvasCenter() {
        const { w, h } = getDomElementGeometry(this._canvasElement);

        return {
            left: w / 2,
            top: h / 2
        };
    }

    /**
     * Handles a zoom action
     *
     * @param event - An event with the zoom action
     * @param position - The coords of the mouse click
     */
    handleZoomAction = (event: ClickToZoomEvent, position: Position = this.getCanvasCenter()) => {
        this.closeNodeOrConnectorMenu();

        let { top, left } = position;
        const zoomAction = event.detail.action;

        let closeMenu = this.canvasContext.menu != null;
        let scale = this.scale;
        let flowBounds;
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
                if (scale < MAX_ZOOM) {
                    scale = MAX_ZOOM / scale;
                } else {
                    return;
                }
                closeMenu = false;
                break;
            case ZOOM_ACTION.ZOOM_TO_FIT:
                this._panzoomOffsets = { x: 0, y: 0 };

                // TODO find better way to get the correct flow geometry
                flowBounds = getBoundingBoxForElements(
                    getNodeAndGoToGeometry(this.flowModel, this.dom.as<AlcFlow>().alcFlow, this.scale)
                );
                ({ left, top } = this.getCanvasCenter());
                this.panIntoView(flowBounds, true);
                scale = Math.min(MAX_ZOOM, this.calculateZoomToFitScale(flowBounds));
                break;
            default:
        }

        if (closeMenu) {
            this.closeNodeOrConnectorMenu();
        }

        const { x, y } = this._panzoomOffsets;
        if (zoomAction === ZOOM_ACTION.ZOOM_TO_VIEW) {
            /**
             * smoothZoom is using  scale: scaleMultiplier * fromValue
             * fromValue is the actual scale
             * scaleMultiplier is the third parameter of the function.
             * smoothZoomAbs does not trigger the zoomEnd event that we need in this case.
             */
            this._panzoom.smoothZoom(left + x, top + y, scale);
            scale = MAX_ZOOM;
        } else {
            this._panzoom.smoothZoomAbs(left + x, top + y, scale);
        }
        this.scale = scale;
    };

    handleCanvasClick = (event) => {
        event.stopPropagation();

        this.closeNodeOrConnectorMenu();
        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
    };

    showGrabbing = false;
    /**
     * Whether to show the grabbing cursor
     *
     * @param showGrabbing - if true show the grabbing cursor
     */
    showGrabbingCursor(showGrabbing: boolean) {
        const { classList } = this.dom.canvasClass;
        if (showGrabbing) {
            classList.add(GRABBING_CURSOR_CLASS);
            this.showGrabbing = true;
        } else {
            classList.remove(GRABBING_CURSOR_CLASS);
            this.showGrabbing = false;
        }
    }

    /**
     * Setting the cursor style to 'grabbing' in case the pan is still in progress
     * i.e. the user left the canvas while panning and entered back without doing a mouse up outside
     */
    handleCanvasMouseEnter = () => {
        if (this.isPanInProgress) {
            this.showGrabbingCursor(true);
        }
    };

    /**
     * Resetting the cursor style to 'grab' so that when the user enters the canvas
     */
    handleCanvasMouseLeave = () => {
        // We need to reset the cursor style here to avoid it from being in the 'grabbing' state
        // in case the user had left the canvas while panning and did a mouse up outside the canvas
        this.showGrabbingCursor(false);
    };

    /**
     * Setting the cursor style to 'grabbing' when panning begins on mouse down
     */
    handleCanvasMouseDown = () => {
        this.showGrabbingCursor(true);
    };

    /**
     * Handling mouse up event for canvas. If panning is not in progress and mouse up happens directly on canvas/innerCanvas
     * then dispatch the canvas mouse up event to deselect all the selected canvas elements. Also reset
     * the cursor style and panning variable.
     *
     * @param event - mouse up event
     */
    handleCanvasMouseUp = (event: MouseEvent) => {
        // We need the this.isPanInProgress check here so that we don't deselect elements when the user ends panning
        const target = <HTMLElement>event.currentTarget;
        if (
            !isSelectionMode(this.canvasContext.mode) &&
            !isCutMode(this.canvasContext.mode) &&
            !this.isPanInProgress &&
            target &&
            (target.classList.contains('canvas') || target.classList.contains('flow-container'))
        ) {
            const canvasMouseUpEvent = new CanvasMouseUpEvent();
            this.dispatchEvent(canvasMouseUpEvent);

            this.clearIncomingStubGuid();
        }
        this.showGrabbingCursor(false);
        this.isPanInProgress = false;
    };

    /**
     * Updates the geometry of the menu after it has been rendered
     *
     * @param event - The MenuRenderedEvent with the geometry information
     */
    handleMenuRendered(event: MenuRenderedEvent) {
        const { width, height } = event.detail;
        const interactionState = this._flowRenderContext.interactionState;
        const menuInfo = interactionState.menuInfo!;
        const { geometry } = menuInfo;

        if (geometry == null || geometry.h !== height) {
            this.updateFlowRenderContext({
                interactionState: {
                    ...interactionState,
                    menuInfo: { ...menuInfo, geometry: { w: width, h: height, x: 0, y: 0 } }
                }
            });
        }
    }

    /**
     * Add the dimension information for the guid to dynamicNodeDimensionMap
     * Which will be used during flow rendering to ensure layout respects
     * the dimensions of nodes with dynamicNodeComponents.
     *
     * @param event - The NodeResizeEvent event
     */
    handleDynamicNodeRender = (event: NodeResizeEvent) => {
        event.stopPropagation();
        const { guid, width, height } = event.detail;

        // scale dimensions to account for zooming, and add them to the map
        this._flowRenderContext.dynamicNodeDimensionMap.set(guid, {
            w: width / this.scale,
            h: height / this.scale
        });

        // Wait for all dynamic components from the initial load to render (and thuws have dimensions)
        // before calculating layout.
        //
        // When new dynamic node component nodes are added later, the flow render context is
        // updated immediately
        if (this._flowRenderContext.dynamicNodeDimensionMap.size >= this.dynamicNodeCountAtLoad) {
            this.updateFlowRenderContext();
        }
    };

    /**
     * Handles when cut is clicked in a node menu
     *
     * @param event - CutElementsEvent
     */
    handleCutElements = (event: CutElementsEvent) => {
        event.stopPropagation();
        const { guids, childIndexToKeep } = event.detail;
        const selectedElement = this.flowModel[guids[0]];
        const shouldCutBeyondMergingPoint = shouldDeleteBeyondMergingPoint(
            this.flowModel,
            selectedElement,
            childIndexToKeep
        );

        const cutElementGuids = getCutGuids(this.flowModel, guids[0], {
            shouldCutBeyondMergingPoint,
            childIndexToKeep
        });
        this.updateCanvasContext({
            mode: AutoLayoutCanvasMode.CUT,
            cutInfo: { guids: cutElementGuids, childIndexToKeep }
        });
        this.focusOnConnector(getConnectionSource(selectedElement));
        this.dispatchEvent(new CutElementsEvent(cutElementGuids, childIndexToKeep));
    };

    /**
     * Handles when pasting a cut element. Regular pasting is not changed.
     *
     * @param event - PasteOnCanvasEvent
     */
    handlePasteOnCanvas = (event: PasteOnCanvasEvent) => {
        const { options } = event.detail;
        if (options.isCutPaste) {
            event.stopPropagation();
            this._topCutGuid = this.canvasContext.cutInfo.guids[0];

            const source = findSourceForPasteOperation(
                this.flowModel,
                event.detail.source!,
                this._topCutGuid,
                this.canvasContext.cutInfo.childIndexToKeep
            );
            this.dispatchEvent(
                new PasteOnCanvasEvent(source, {
                    childIndexToKeep: this.canvasContext.cutInfo.childIndexToKeep,
                    isCutPaste: true
                })
            );
        }
    };

    handleDeleteElement = (event) => {
        const { selectedElementGUID } = event.detail;
        const elementToDelete = this.flowModel[selectedElementGUID[0]];
        this.focusOnConnector(getConnectionSource(elementToDelete));
    };

    handleBranchElementDeletion = (event: DeleteBranchElementEvent) => {
        const { selectedElementGUID, selectedElementType, childIndexToKeep } = event.detail;
        const selectedElement = this.flowModel[selectedElementGUID[0]];
        if (shouldDeleteBeyondMergingPoint(this.flowModel, selectedElement, childIndexToKeep)) {
            // When the branch to persist is terminated and the deleting element's next is not an end element
            // or a GoTo target, a warning modal would be invoked, otherwise a DeleteElementEvent would be dispatched
            invokeModal({
                headerData: {
                    headerTitle: LABELS.deleteWarningHeaderTitle
                },
                bodyData: {
                    bodyTextOne: LABELS.deleteWarningBodyTextLabel,
                    bodyVariant: modalBodyVariant.WARNING_ON_CANVAS_MODE_TOGGLE
                },
                footerData: {
                    buttonOne: {
                        buttonVariant: 'Brand',
                        buttonLabel: LABELS.cancelButtonLabel
                    },
                    buttonTwo: {
                        buttonLabel: LABELS.confirmDeleteLabel,
                        buttonCallback: () => {
                            this.dispatchEvent(
                                new DeleteElementEvent(selectedElementGUID, selectedElementType, childIndexToKeep)
                            );
                        }
                    }
                },
                headerClass: 'slds-theme_alert-texture slds-theme_warning',
                bodyClass: 'slds-p-around_medium'
            });
        } else {
            this.dispatchEvent(new DeleteElementEvent(selectedElementGUID, selectedElementType, childIndexToKeep));
        }

        this.focusOnConnector(getConnectionSource(selectedElement));
    };

    get fieldInput() {
        return {
            context: {
                flowElements: Object.values(this._flowRenderContext?.flowModel || [])
            }
        };
    }
}
