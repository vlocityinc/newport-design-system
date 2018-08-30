import { LightningElement, track } from 'lwc';
import { AddElementEvent, EditElementEvent, DeleteElementEvent, NewResourceEvent } from 'builder_platform_interaction-events';
import { resourceFilter } from 'builder_platform_interaction-filter-lib';
import { Store } from 'builder_platform_interaction-store-lib';
import { isChildElement } from 'builder_platform_interaction-element-config';
import { isTestMode } from 'builder_platform_interaction-context-lib';
import { nameComparator } from 'builder_platform_interaction-sort-lib';
import { LABELS } from './left-panel-labels';
import { getResourceSections } from './resource-lib';

let storeInstance;
let unsubscribeStore;

export default class LeftPanel extends LightningElement {
    @track showResourceDetailsPanel = false;

    @track resourceDetails;

    @track canvasElements = [];

    @track nonCanvasElements = [];

    labels = LABELS;
    searchString;

    constructor() {
        super();
        storeInstance = Store.getStore();
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
    }

    mapAppStateToStore = () => {
        const currentState = storeInstance.getCurrentState();
        this.canvasElements = getResourceSections(currentState.elements, resourceFilter(true, this.searchString), nameComparator);
        this.nonCanvasElements = getResourceSections(currentState.elements, resourceFilter(false, this.searchString), nameComparator);
        if (this.showResourceDetailsPanel) {
            const iconName = this.resourceDetails.ICON_NAME;
            const currentElementState = currentState.elements[this.resourceDetails.GUID];
            this.retrieveResourceDetailsFromStore(currentElementState, iconName);
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
        this.showResourceDetailsPanel = false;
        const deleteEvent = new DeleteElementEvent([this.resourceDetails.GUID], this.resourceDetails.TYPE);
        this.dispatchEvent(deleteEvent);
    }

    handleResourceSearch(event) {
        this.searchString = event.detail.value;
        const currentState = storeInstance.getCurrentState();
        this.canvasElements = getResourceSections(currentState.elements, resourceFilter(true, this.searchString), nameComparator);
        this.nonCanvasElements = getResourceSections(currentState.elements, resourceFilter(false, this.searchString), nameComparator);
    }

    retrieveResourceDetailsFromStore(currentElementState, iconName) {
        if (currentElementState) {
            this.resourceDetails = {
                TYPE: currentElementState.elementType,
                GUID: currentElementState.guid,
                LABEL: currentElementState.label,
                ICON_NAME: iconName,
                DESCRIPTION: currentElementState.description,
                NAME: currentElementState.name,
                IS_CHILD_ELEMENT: isChildElement(currentElementState.elementType)
            };
        } else {
            this.showResourceDetailsPanel = false;
        }
    }

    disconnectedCallback() {
        unsubscribeStore();
    }
}
