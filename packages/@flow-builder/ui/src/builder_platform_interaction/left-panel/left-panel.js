import { Element, api, track } from 'engine';
import { EditElementEvent, CANVAS_EVENT } from 'builder_platform_interaction-events';
import { resourceSectionsSelector } from 'builder_platform_interaction-selectors';
import { Store } from 'builder_platform_interaction-store-lib';

import headerText from '@label/FlowBuilderLeftPanel.headerText';
import elementTabText from '@label/FlowBuilderLeftPanel.elementTabText';
import resourceTabText from '@label/FlowBuilderLeftPanel.resourceTabText';
import editButtonLabel from '@label/FlowBuilderResourceDetailsPanel.editButtonLabel';
import deleteButtonLabel from '@label/FlowBuilderResourceDetailsPanel.deleteButtonLabel';
import backButtonAltText from '@label/FlowBuilderResourceDetailsPanel.backButtonAltText';

const LABELS = {
    LEFT_PANEL_HEADER_TEXT: headerText,
    LEFT_PANEL_ELEMENT_TAB_TEXT: elementTabText,
    LEFT_PANEL_RESOURCE_TAB_TEXT: resourceTabText,
    RESOURCE_DETAILS_EDIT_BUTTON_TEXT: editButtonLabel,
    RESOURCE_DETAILS_DELETE_BUTTON_TEXT: deleteButtonLabel,
    RESOURCE_DETAILS_BACK_BUTTON_ATL_TEXT: backButtonAltText
};

const ACTIVETABID_DEFAULT = 'left-panel-tabitem-elements';

let storeInstance;
let unsubscribeStore;


export default class LeftPanel extends Element {
    @track activetabid = ACTIVETABID_DEFAULT;

    @track showResourceDetailsPanel = false;

    @track resources = [];

    @track resourceDetails;

    constructor() {
        super();
        storeInstance = Store.getStore();
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
    }

    mapAppStateToStore = () => {
        const currentState = storeInstance.getCurrentState();
        this.resources = resourceSectionsSelector(currentState);
    };

    @api
    get activeTabId() {
        return this.activetabid;
    }

    get getPanelTitle() {
        return this.showResourceDetailsPanel ? this.resourceDetails.NAME : LABELS.LEFT_PANEL_HEADER_TEXT;
    }

    get labels() {
        return LABELS;
    }

    // TO DO: Remove this logic once we figure out how we are handling Non Canvas Elements Deletion
    get showDeleteButton() {
        return storeInstance.getCurrentState().elements[this.resourceDetails.GUID].isCanvasElement;
    }

    handleTabChange(event) {
        this.activetabid = event.detail.tabId;
    }

    handleResourceClicked(event) {
        const canvasElementGUID = event.detail.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID);
        this.dispatchEvent(editElementEvent);
    }

    handlePaletteItemChevronClicked(event) {
        this.resourceDetails = {
            TYPE: storeInstance.getCurrentState().elements[event.detail.elementGUID].elementType,
            GUID: storeInstance.getCurrentState().elements[event.detail.elementGUID].guid,
            LABEL: storeInstance.getCurrentState().elements[event.detail.elementGUID].label,
            ICON_NAME: event.detail.iconName,
            DESCRIPTION: storeInstance.getCurrentState().elements[event.detail.elementGUID].description,
            NAME: storeInstance.getCurrentState().elements[event.detail.elementGUID].name
        };
        this.showResourceDetailsPanel = true;
    }

    handleEditButtonClicked(event) {
        event.stopPropagation();
        const guid = this.resourceDetails.GUID;
        const editElementEvent = new EditElementEvent(guid);
        this.dispatchEvent(editElementEvent);
    }

    handleDeleteButtonClicked() {
        this.showResourceDetailsPanel = false;
        const selectedCanvasElementGUIDs = [this.resourceDetails.GUID];
        const deleteEvent = new CustomEvent(CANVAS_EVENT.DELETE_ON_CANVAS, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                selectedCanvasElementGUIDs
            }
        });
        this.dispatchEvent(deleteEvent);
    }

    handleResourceDetailsBackLinkClicked() {
        this.showResourceDetailsPanel = false;
    }

    disconnectedCallback() {
        unsubscribeStore();
    }
}
