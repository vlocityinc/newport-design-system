import { deselectOnCanvas } from 'builder_platform_interaction/actions';
import AlcCanvas from 'builder_platform_interaction/alcCanvas';
import { setElementsMetadata } from 'builder_platform_interaction/alcCanvasUtils';
import { shortcuts } from 'builder_platform_interaction/app';
import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { ClosePropertyEditorEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { commonUtils, customIconUtils, lwcUtils, storeUtils } from 'builder_platform_interaction/sharedUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { api, LightningElement, track } from 'lwc';
import { augmentElementsMetadata } from './alcCanvasContainerUtils';

const { removeDuplicates } = commonUtils;
const { generateGuid } = storeUtils;
const { removePrefixFromCustomIcon } = customIconUtils;

// TODO: W-9613981 [Trust] Remove hardcoded alccanvas offsets
const LEFT_PANE_WIDTH = 320;
const NODE_ICON_HALF_HEIGHT_WITH_PADDING = 58;
const SLDS_ICON_PREFIX = 'slds';
let storeInstance;

const defaultConnectorMenuMetadata: ConnectorMenuMetadata = {
    elementTypes: new Set<string>(),
    menuComponent: 'builder_platform_interaction/alcConnectorMenu',
    isSearchEnabled: true,
    isLoading: true,
    menuItems: []
};

const selectors = {
    alcCanvas: 'builder_platform_interaction-alc-canvas'
};

/**
 * Flow Builder container for the ALC builder
 *
 * Configures to the ALC Builder with the Flow Builder elements metadata and
 * listens to the store, passing on the updated state when there are updates.
 */
export default class AlcCanvasContainer extends LightningElement {
    static delegatesFocus = true;

    dom = lwcUtils.createDomProxy(this, selectors);

    _storeUnsubsribe;

    @track
    _elementsMetadata;

    _standardInvocableActions = [];
    _dynamicInvocableActions = [];
    _subflows: UI.Subflow[] = [];

    _startElement!: UI.Start;

    @track
    _connectorMenuMetadata?: ConnectorMenuMetadata = defaultConnectorMenuMetadata;

    @api
    set elementsMetadata(elementsMetadata) {
        if (elementsMetadata != null && elementsMetadata.length > 0) {
            this.setStartElement();
            elementsMetadata = augmentElementsMetadata(elementsMetadata, this._startElement);
            this.updateConnectorMenuMetadata(elementsMetadata);
            setElementsMetadata(elementsMetadata);
            this._elementsMetadata = elementsMetadata;
            this.mapCanvasStateToStore();
        } else {
            this._elementsMetadata = null;
        }
    }

    get elementsMetadata() {
        return this._elementsMetadata;
    }

    @api
    set dynamicInvocableActions(actions) {
        this._dynamicInvocableActions = actions;
        this.updateMetadataMenuItems();
    }

    get dynamicInvocableActions() {
        return this._dynamicInvocableActions;
    }

    @api
    set standardInvocableActions(actions) {
        this._standardInvocableActions = actions;
        this.updateMetadataMenuItems();
    }

    get standardInvocableActions() {
        return this._standardInvocableActions;
    }

    // Getters and setters for subflows
    @api
    set subflows(subflows: UI.Subflow[]) {
        this._subflows = subflows;
        this.updateMetadataMenuItems();
    }

    get subflows() {
        return this._subflows;
    }

    @api
    isMenuDataLoading;

    /**
     * The active element refers to the element currently being edited using the property editor panel
     */
    @api
    activeElementGuid;

    @api
    numPasteElementsAvailable;

    @api
    autolayoutCanvasMode;

    @api
    showLeftPanel;

    @api
    customIconMap;

    @api
    disableDeleteElements;

    @api
    disableEditElements;

    _disableAddElements = false;
    @api
    set disableAddElements(value: boolean) {
        this._disableAddElements = value;
        this.updateConnectorMenuMetadata(this._elementsMetadata || []);
    }

    get disableAddElements() {
        return this._disableAddElements;
    }

    @api
    disableAnimation;

    @api
    disableDebounce;

    @track
    flowModel;

    rootElement;

    isAutoLayoutCanvas = false;

    shortcuts = shortcuts;

    get isSearchEnabled() {
        let found = false;
        found = this._elementsMetadata?.find(
            (element) =>
                element.elementType === ELEMENT_TYPE.ACTION_CALL || element.elementType === ELEMENT_TYPE.SUBFLOW
        );
        return found;
    }

    get shouldRenderCanvas() {
        // only render the canvas when all the data it needs is ready
        return this.isAutoLayoutCanvas && this._elementsMetadata && this.flowModel;
    }

    get canvasOffsets() {
        // TODO: W-9613981 [Trust] Remove hardcoded alccanvas offsets
        return this.showLeftPanel
            ? [LEFT_PANE_WIDTH, NODE_ICON_HALF_HEIGHT_WITH_PADDING]
            : [0, NODE_ICON_HALF_HEIGHT_WITH_PADDING];
    }

    constructor() {
        super();

        storeInstance = Store.getStore();
        this._storeUnsubsribe = storeInstance.subscribe(this.mapCanvasStateToStore);
    }

    disconnectedCallback() {
        this._storeUnsubsribe();
    }

    setStartElement() {
        const storeState = storeInstance.getCurrentState();
        const { elements } = storeState;

        this._startElement = Object.values<UI.Element>(elements).find(
            (ele) => ele.elementType === ELEMENT_TYPE.START_ELEMENT
        ) as UI.Start;
    }

    mapCanvasStateToStore = () => {
        const storeState = storeInstance.getCurrentState();
        const { elements, properties } = storeState;

        // W-7868857: check the mode to avoid rendering a flow that has been switched to free form
        this.isAutoLayoutCanvas = properties.isAutoLayoutCanvas;

        this.rootElement =
            this.rootElement ||
            Object.values<UI.Element>(elements).find((ele) => ele.elementType === ELEMENT_TYPE.ROOT_ELEMENT);

        if (this.rootElement && this.elementsMetadata) {
            this.flowModel = storeState.elements;
        }
    };

    handleAlcCanvasClick = (event) => {
        event.stopPropagation();
        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
    };

    /**
     * Handles the canvas mouse up event and dispatches an action to deselect all selected nodes and connectors.
     */
    handleElementDeselection = () => {
        storeInstance.dispatch(deselectOnCanvas);
    };

    /**
     * Updates the connector menu metadata
     *
     * @param nextElementsMetadata - The next elements metadata
     */
    updateConnectorMenuMetadata(nextElementsMetadata) {
        if (this.disableAddElements) {
            this._connectorMenuMetadata = undefined;
            return;
        }

        if (!this._connectorMenuMetadata) {
            this._connectorMenuMetadata = defaultConnectorMenuMetadata;
        }

        this._elementsMetadata = [...nextElementsMetadata];

        this.updateMetadataMenuItems();
    }

    updateMetadataMenuItems() {
        const connectorMenuElementTypes = this._elementsMetadata?.map(({ elementType }) => elementType);
        const elementTypes = connectorMenuElementTypes ? new Set<string>(connectorMenuElementTypes) : new Set<string>();
        // Remove StandardActionMenuItems that are also palette promoted
        let standardActionMenuItems = this._standardInvocableActions?.map((action) =>
            this.augmentElementToConnectorMenuItem(action, ELEMENT_TYPE.ACTION_CALL)
        );
        standardActionMenuItems = removeDuplicates(standardActionMenuItems, this._elementsMetadata, [
            'elementType',
            'actionName',
            'actionType'
        ]);

        const dynamicActionMenuItems = this._dynamicInvocableActions?.map((action) =>
            this.augmentElementToConnectorMenuItem(action, ELEMENT_TYPE.ACTION_CALL)
        );
        // Only populate subflows if they are a supported element type.
        // TODO: This is a temporary fix. The preferred solution is documented in W-11455932.
        const subflowMenuItems = this._elementsMetadata?.find((element) => element.elementType === ELEMENT_TYPE.SUBFLOW)
            ? this._subflows?.map((subflow) => this.augmentElementToConnectorMenuItem(subflow, ELEMENT_TYPE.SUBFLOW))
            : [];

        const menuItems = standardActionMenuItems.concat(dynamicActionMenuItems).concat(subflowMenuItems);
        this._connectorMenuMetadata = {
            ...this._connectorMenuMetadata,
            elementTypes,
            isSearchEnabled: this.isSearchEnabled,
            isLoading: this.isMenuDataLoading,
            menuItems
        };
    }

    augmentElementToConnectorMenuItem(element, elementType): ConnectorMenuItem {
        // Do augmentation from element to connector menu item
        const elementConfig = getConfigForElementType(elementType);
        let icon, iconSrc, iconClass;
        if (element.iconName && elementType === ELEMENT_TYPE.ACTION_CALL) {
            const prefix = element.iconName.split(':')[0];
            const resource = removePrefixFromCustomIcon(element.iconName);
            ({ icon, iconSrc } =
                prefix === SLDS_ICON_PREFIX ? { icon: resource, iconSrc: null } : { icon: null, iconSrc: resource });
        } else {
            icon = elementConfig.nodeConfig?.iconName;
            iconClass = elementConfig.nodeConfig?.iconBackgroundColor;
        }
        const label = element.label ? element.label : element.masterLabel;
        return {
            guid: generateGuid(),
            description: element.description,
            label,
            elementType,
            actionType: element.type,
            actionName: element.name,
            actionIsStandard: element.isStandard,
            icon,
            iconSrc,
            iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
            iconClass,
            iconSize: 'small',
            iconVariant: '',
            rowClass: 'slds-listbox__item',
            elementSubtype: null,
            tooltip: element.description ? `${label}: ${element.description}` : label,
            flowName: element.fullName
        };
    }

    /**
     * Calling the function in alcCanvas to close the contextual menu
     */
    @api
    callCloseNodeOrConnectorMenuInBuilder() {
        const alcCanvas = this.getAlcCanvas();
        if (alcCanvas) {
            alcCanvas.closeNodeOrConnectorMenu();
        }
    }

    /**
     * Set focus on alcCanvas when focus is set on the container
     */
    @api
    focus() {
        const alcCanvas = this.getAlcCanvas();

        // @ts-ignore TODO: remove me
        alcCanvas.focus();
    }

    @api
    focusOnNode = (elementGuid: UI.Guid) => {
        const alcCanvas = this.getAlcCanvas();
        if (alcCanvas) {
            alcCanvas.focusOnNode(elementGuid);
        }
    };

    @api
    focusOnConnector = (source: ConnectionSource) => {
        const alcCanvas = this.getAlcCanvas();
        if (alcCanvas) {
            alcCanvas.focusOnConnector(source);
        }
    };

    clearIncomingStubGuid() {
        const alcCanvas = this.getAlcCanvas();
        if (alcCanvas) {
            alcCanvas.clearIncomingStubGuid();
        }
    }

    /**
     * Get the AlcCanvas element
     *
     * @returns the AlcCanvas element
     */
    @api
    getAlcCanvas() {
        return this.dom.as<AlcCanvas>().alcCanvas;
    }
}
