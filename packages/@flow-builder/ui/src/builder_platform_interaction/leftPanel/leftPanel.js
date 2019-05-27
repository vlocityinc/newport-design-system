import { LightningElement, track } from 'lwc';
import { AddElementEvent, EditElementEvent, DeleteElementEvent, NewResourceEvent } from "builder_platform_interaction/events";
import { canvasElementFilter, resourceFilter } from "builder_platform_interaction/filterLib";
import { Store } from "builder_platform_interaction/storeLib";
import { isChildElement, getConfigForElementType } from "builder_platform_interaction/elementConfig";
import { isTestMode } from "builder_platform_interaction/contextLib";
import { nameComparator } from "builder_platform_interaction/sortLib";
import { LABELS } from "./leftPanelLabels";
import { getResourceSections, getElementSections } from "./resourceLib";
import { usedBy } from "builder_platform_interaction/usedByLib";
import { fetch, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";

let storeInstance;
let unsubscribeStore;

export default class LeftPanel extends LightningElement {
    @track showResourceDetailsPanel = false;
    @track resourceDetails;
    @track canvasElements = [];
    @track nonCanvasElements = [];
    @track elements = {};

    labels = LABELS;
    searchString;
    processType;

    constructor() {
        super();
        storeInstance = Store.getStore();
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
    }

     /**
     * Callback which gets executed after getting elements for left panel
     * palette
     *
     * @param {Object}
     *            has error property if there is error fetching the data else
     *            has data property
     */
    setElements = ({data, error}) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        } else {
            this.elements = data;
        }
    };

    mapAppStateToStore = () => {
        const {properties = {}, elements = {}} = storeInstance.getCurrentState();
        const { processType: flowProcessType } = properties;
        this.canvasElements = getElementSections(elements, canvasElementFilter(this.searchString), nameComparator);
        this.nonCanvasElements = getResourceSections(elements, resourceFilter(this.searchString), nameComparator);
        if (this.showResourceDetailsPanel) {
            const iconName = this.resourceDetails.ICON_NAME;
            const currentElementState = elements[this.resourceDetails.GUID];
            this.retrieveResourceDetailsFromStore(currentElementState, iconName);
        }
        if (this.processType !== flowProcessType) {
            this.processType = flowProcessType;
            fetch(SERVER_ACTION_TYPE.GET_LEFT_PANEL_ELEMENTS, this.setElements, {flowProcessType});
        }
    };

    get getPanelTitle() {
        return this.showResourceDetailsPanel ? this.resourceDetails.NAME : LABELS.headerText;
    }

    get panelClasses() {
        let classes = 'left-panel slds-panel slds-size_medium slds-panel_docked slds-panel_docked-left slds-is-directional slds-is-open';
        if (this.showResourceDetailsPanel) {
            classes = `${classes} show-details`;
        }
        return classes;
    }
    get panelHeaderClasses() {
        let classes = 'left-panel-header slds-panel__header slds-truncate_container';
        if (!this.showResourceDetailsPanel) {
            classes = `${classes} slds-p-left_medium`;
        }
        return classes;
    }

    handleElementClicked(event) {
        // TODO: Click to add is needed for selenium but we're not ready to ship the feature until
        // we figure out how to position the new element. We can remove this check after completing
        // W-4889436.
        if (!isTestMode()) {
            return;
        }

        const elementType = event.detail.elementType;

        // TODO: W-4889436: Better default location.
        const locationX = 0;
        const locationY = 0;

        const addElementEvent = new AddElementEvent(elementType, locationX, locationY);
        this.dispatchEvent(addElementEvent);
    }

    handleResourceClicked(event) {
        const canvasElementGUID = event.detail.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID);
        this.dispatchEvent(editElementEvent);
    }

    handlePaletteItemChevronClicked(event) {
        const iconName = event.detail.iconName;
        const currentElementState = storeInstance.getCurrentState().elements[event.detail.elementGUID];
        this.retrieveResourceDetailsFromStore(currentElementState, iconName);
        this.showResourceDetailsPanel = true;
    }

    handleAddNewResourceButtonClick = (event) => {
        event.stopPropagation();
        const handleOnClickEvent = new NewResourceEvent();
        this.dispatchEvent(handleOnClickEvent);
    };

    handleResourceDetailsBackLinkClicked() {
        this.showResourceDetailsPanel = false;
    }

    handleDeleteButtonClicked() {
        const deleteEvent = new DeleteElementEvent([this.resourceDetails.GUID], this.resourceDetails.TYPE);
        this.dispatchEvent(deleteEvent);
    }

    handleResourceSearch(event) {
        this.searchString = event.detail.value.trim();
        const currentState = storeInstance.getCurrentState();
        this.canvasElements = getResourceSections(currentState.elements, canvasElementFilter(this.searchString), nameComparator);
        this.nonCanvasElements = getResourceSections(currentState.elements, resourceFilter(this.searchString), nameComparator);
    }

    retrieveResourceDetailsFromStore(currentElementState, iconName) {
        if (currentElementState) {
            const state = storeInstance.getCurrentState();
            const storeElements = state.elements;
            this.resourceDetails = {
                TYPE: currentElementState.elementType,
                GUID: currentElementState.guid,
                LABEL: getConfigForElementType(currentElementState.elementType).labels.singular,
                ICON_NAME: iconName,
                DESCRIPTION: currentElementState.description,
                NAME: currentElementState.name,
                IS_CHILD_ELEMENT: isChildElement(currentElementState.elementType),
                USED_BY_ELEMENTS: usedBy([currentElementState.guid], storeElements)
            };
        } else {
            this.showResourceDetailsPanel = false;
        }
    }

    disconnectedCallback() {
        unsubscribeStore();
    }
}
