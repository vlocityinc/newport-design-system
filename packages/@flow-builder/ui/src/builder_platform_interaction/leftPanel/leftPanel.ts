// @ts-nocheck
import { LightningElement, track, api } from 'lwc';
import {
    AddElementEvent,
    EditElementEvent,
    DeleteElementEvent,
    NewResourceEvent
} from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { isChildElement } from 'builder_platform_interaction/elementConfig';
import { isTestMode } from 'builder_platform_interaction/contextLib';
import { logInteraction } from 'builder_platform_interaction/loggingUtils';
import { LABELS } from './leftPanelLabels';
import { getResourceSections, getElementSections, getResourceIconName } from './resourceLib';
import { usedBy, createUsedByElement } from 'builder_platform_interaction/usedByLib';
import {
    getResourceLabel,
    getElementTypeLabel,
    getResourceTypeLabel
} from 'builder_platform_interaction/elementLabelLib';
import { removeLastCreatedInlineResource } from 'builder_platform_interaction/actions';
import { useFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';

let storeInstance;
let unsubscribeStore;

export default class LeftPanel extends LightningElement {
    @track
    showResourceDetailsPanel = false;

    @track
    resourceDetails;

    @track
    canvasElements = [];

    @track
    nonCanvasElements = [];

    labels = LABELS;
    searchString;

    _addInlineResourceFromManagerTab = false;

    @api
    elements = [];

    @api
    palette;

    @api focus() {
        // Ideally, we should not use shadowRoot to access the child components. The base components
        // should provide overidden focus() method to set focus within the components.
        // However, this method is missing for lightning-tabset. Hence, implemented such for now.
        const activeTab = this.template.querySelector('lightning-tabset').activeTabValue;
        this.template
            .querySelector('lightning-tabset')
            .shadowRoot.querySelector('lightning-tab-bar')
            .shadowRoot.querySelector('a#' + activeTab + '__item')
            .focus();
    }

    constructor() {
        super();
        storeInstance = Store.getStore();
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
    }

    get useFixedLayoutCanvas() {
        return useFixedLayoutCanvas();
    }

    /** Only show elements tab if we are not using the FLC */
    get showElements() {
        return !this.useFixedLayoutCanvas;
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
        let classes = 'flow-resource-list';
        if (this.showResourceDetailsPanel) {
            classes = `${classes} + slds-hidden`;
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

    handleShowResourceDetails(event) {
        const currentElementState = storeInstance.getCurrentState().elements[event.detail.elementGUID];
        this.retrieveResourceDetailsFromStore(currentElementState, !event.detail.canvasElement);
        this.showResourceDetailsPanel = true;
    }

    handleAddNewResourceButtonClick = event => {
        event.stopPropagation();
        const handleOnClickEvent = new NewResourceEvent();
        this.dispatchEvent(handleOnClickEvent);
        this._addInlineResourceFromManagerTab = true;
        logInteraction(`new-resource-button`, 'left panel', null, 'click');
    };

    handleResourceDetailsBackLinkClicked() {
        this.showResourceDetailsPanel = false;
    }

    handleDeleteButtonClicked() {
        const deleteEvent = new DeleteElementEvent(
            [this.resourceDetails.elementGuid],
            this.resourceDetails.elementType
        );
        this.dispatchEvent(deleteEvent);
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
            const storeElements = state.elements;
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
                usedByElements: usedBy([currentElementState.guid], storeElements),
                asResource,
                storeOutputAutomatically: currentElementState.storeOutputAutomatically,
                isSystemGeneratedOutput: currentElementState.isSystemGeneratedOutput
            };
        } else {
            this.showResourceDetailsPanel = false;
        }
    }

    disconnectedCallback() {
        unsubscribeStore();
    }

    renderedCallback() {
        if (this._addInlineResourceFromManagerTab && storeInstance) {
            this._addInlineResourceFromManagerTab = false;
            storeInstance.dispatch(removeLastCreatedInlineResource);
        }
    }
}
