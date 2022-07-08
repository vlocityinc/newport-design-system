import { FOR_EACH_INDEX, Guid, hasChildren } from 'builder_platform_interaction/autoLayoutCanvas';
import { isTestMode } from 'builder_platform_interaction/contextLib';
import { isChildElement } from 'builder_platform_interaction/elementConfig';
import {
    getElementTypeLabel,
    getResourceLabel,
    getResourceTypeLabel
} from 'builder_platform_interaction/elementLabelLib';
import {
    AddElementEvent,
    DeleteElementEvent,
    EditElementEvent,
    NewResourceEvent,
    ToggleLeftPanelEvent
} from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { loggingUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { createUsedByElement, usedBy } from 'builder_platform_interaction/usedByLib';
import { classSet } from 'lightning/utils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './leftPanelLabels';
import { getElementSections, getIncomingGoTosInfo, getResourceIconName, getResourceSections } from './resourceLib';

const { logInteraction } = loggingUtils;

let storeInstance;
let unsubscribeStore;

const selectors = {
    tabset: 'lightning-tabset',
    backButton: 'lightning-button-icon',
    leftPanelResources: 'builder_platform_interaction-left-panel-resources'
};

export default class LeftPanel extends LightningElement {
    static delegatesFocus = true;

    private dom = lwcUtils.createDomProxy(this, selectors);
    private elementToFocus: keyof typeof selectors | undefined;

    tabItemElements = 'left-panel-tabitem-elements';

    _showElementsTab = false;

    postRenderCallback;

    @track
    showResourceDetailsPanel = false;

    @track
    resourceDetails;

    @track
    canvasElements: UI.Element[] = [];

    @track
    nonCanvasElements: UI.Element[] = [];

    labels = LABELS;
    searchString;

    @api
    elements = [];

    @api
    palette;

    @api
    customIconMap = {};

    @api
    get showElementsTab() {
        return this._showElementsTab;
    }

    set showElementsTab(value) {
        this._showElementsTab = value;
        if (this._showElementsTab) {
            this.postRenderCallback = () => {
                (this.dom.tabset as any).activeTabValue = this.tabItemElements;
            };
        }
    }

    // TODO: probably not used anymore, should remove
    @api focus() {
        this.dom.tabset?.focus();
    }

    // TODO: get rid of this
    forceRender() {
        this.canvasElements = [...this.canvasElements];
    }

    mapAppStateToStore = () => {
        const { elements = {} } = storeInstance.getCurrentState();
        this.canvasElements = getElementSections(elements, this.searchString);
        this.nonCanvasElements = getResourceSections(elements, this.searchString);
        if (this.showResourceDetailsPanel) {
            const currentElementState = elements[this.resourceDetails.elementGuid];
            this.retrieveResourceDetailsFromStore(currentElementState, this.resourceDetails.asResource);
        }
    };

    get getPanelTitle() {
        return this.showResourceDetailsPanel ? this.resourceDetails.title : LABELS.headerText;
    }

    get panelClasses() {
        let classes =
            'left-panel slds-panel slds-size_medium slds-panel_docked slds-panel_docked-left slds-is-directional slds-is-open';
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

    get flowResourceListClass() {
        return classSet('flow-resource-list')
            .add({
                'slds-hidden': this.showResourceDetailsPanel,
                hidden: this.showResourceDetailsPanel
            })
            .toString();
    }

    handleElementClicked(event) {
        // TODO: Click to add is needed for selenium but we're not ready to ship the feature until
        // we figure out how to position the new element. We can remove this check after completing
        // W-4889436.
        if (!isTestMode()) {
            return;
        }

        const elementType = event.detail.elementType;
        const elementSubtype = event.detail.elementSubtype;

        // TODO: W-4889436: Better default location.
        const locationX = 0;
        const locationY = 0;

        const addElementEvent = new AddElementEvent({
            elementType,
            elementSubtype,
            locationX,
            locationY
        });
        this.dispatchEvent(addElementEvent);
    }

    handleResourceClicked(event) {
        const canvasElementGUID = event.detail.guid;
        const editElementEvent = new EditElementEvent(
            canvasElementGUID,
            EditElementEvent.EVENT_NAME,
            event.detail.elementType
        );
        this.dispatchEvent(editElementEvent);
    }

    /**
     * Opens the left panel to show the resource details
     *
     * @param event - the event object
     */
    handleShowResourceDetails(event) {
        this.navigateToResourceDetails(event.detail.elementGUID, event.detail.canvasElement);
    }

    /**
     * Opens the left panel to show the resource details with the specified guid
     *
     * @param guid - the element guid
     * @param isCanvasElement - whether or not the element is a canvas element
     */
    @api
    navigateToResourceDetails(guid: Guid, isCanvasElement: boolean) {
        const currentElementState = storeInstance.getCurrentState().elements[guid];
        this.retrieveResourceDetailsFromStore(currentElementState, !isCanvasElement);
        this.showResourceDetailsPanel = true;
        this.elementToFocus = 'backButton';
    }

    handleAddNewResourceButtonClick = () => {
        const handleOnClickEvent = new NewResourceEvent(null, true);
        this.dispatchEvent(handleOnClickEvent);
        logInteraction(`new-resource-button`, 'left panel', null, 'click');
    };

    handleResourceDetailsBackLinkClicked() {
        this.showResourceDetailsPanel = false;
        this.elementToFocus = 'leftPanelResources';
    }

    handleClosePanelButtonClicked() {
        const toggleLeftPanelEvent = new ToggleLeftPanelEvent();
        this.dispatchEvent(toggleLeftPanelEvent);
        logInteraction(`close-panel-button`, 'left panel', null, 'click');
    }

    handleDeleteButtonClicked() {
        const { elementGuid, elementType } = this.resourceDetails;
        const childIndexToKeep = elementType === ELEMENT_TYPE.LOOP ? FOR_EACH_INDEX : undefined;
        const deleteEvent = hasChildren(this.resourceDetails)
            ? new DeleteElementEvent([elementGuid], elementType, childIndexToKeep)
            : new DeleteElementEvent([elementGuid], elementType);
        this.dispatchEvent(deleteEvent);

        this.showResourceDetailsPanel = false;
        this.elementToFocus = 'tabset';
    }

    handleResourceSearch(event) {
        this.searchString = event.detail.value.trim();
        const currentState = storeInstance.getCurrentState();
        this.canvasElements = getElementSections(currentState.elements, this.searchString);
        this.nonCanvasElements = getResourceSections(currentState.elements, this.searchString);
    }

    retrieveResourceDetailsFromStore(currentElementState, asResource) {
        if (currentElementState) {
            const state = storeInstance.getCurrentState();
            let typeIconName;
            let createdByElement;
            let editable = !isChildElement(currentElementState.elementType);
            let description = currentElementState.description;
            let title;
            let typeLabel;
            if (asResource) {
                typeLabel = getResourceTypeLabel(currentElementState);
                typeIconName = getResourceIconName(currentElementState);
                title = getResourceLabel(currentElementState);
                if (currentElementState.storeOutputAutomatically) {
                    createdByElement = createUsedByElement({
                        element: currentElementState,
                        elementGuidsReferenced: [currentElementState.guid]
                    });
                    editable = false;
                    description = undefined;
                }
            } else {
                title = currentElementState.name;
                typeLabel = getElementTypeLabel(currentElementState);
            }
            this.resourceDetails = {
                title,
                elementType: currentElementState.elementType,
                elementGuid: currentElementState.guid,
                typeLabel,
                typeIconName,
                description,
                apiName: currentElementState.name,
                editable,
                deletable: editable,
                createdByElement,
                usedByElements: usedBy([currentElementState.guid], state),
                incomingGoToInfo: getIncomingGoTosInfo(currentElementState, state.elements),
                asResource,
                storeOutputAutomatically: currentElementState.storeOutputAutomatically,
                isSystemGeneratedOutput: currentElementState.isSystemGeneratedOutput
            };
        } else {
            this.showResourceDetailsPanel = false;
        }
    }

    handleEditElement() {
        this.dom.backButton.focus();
    }

    renderedCallback() {
        if (this.elementToFocus != null) {
            this.dom[this.elementToFocus].focus();
            this.elementToFocus = undefined;
        }

        if (this.postRenderCallback) {
            this.postRenderCallback();
            this.postRenderCallback = null;
        }
    }

    connectedCallback() {
        storeInstance = Store.getStore();
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
        const { elements = {} } = storeInstance.getCurrentState();
        this.canvasElements = getElementSections(elements, this.searchString);
        this.nonCanvasElements = getResourceSections(elements, this.searchString);
    }

    disconnectedCallback() {
        unsubscribeStore();
    }
}
