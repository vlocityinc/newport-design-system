import { LightningElement, track } from 'lwc';
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
import {
    getResourceSections,
    getElementSections,
    getResourceIconName
} from './resourceLib';
import {
    usedBy,
    createUsedByElement
} from 'builder_platform_interaction/usedByLib';
import {
    fetch,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import {
    getResourceLabel,
    getElementTypeLabel,
    getResourceTypeLabel
} from 'builder_platform_interaction/elementLabelLib';
import {
    logPerfTransactionStart,
    logPerfTransactionEnd
} from 'builder_platform_interaction/loggingUtils';

import { removeLastCreatedInlineResource } from 'builder_platform_interaction/actions';

let storeInstance;
let unsubscribeStore;
const LEFT_PANEL_ELEMENTS = 'LEFT_PANEL_ELEMENTS';

export default class LeftPanel extends LightningElement {
    @track
    showResourceDetailsPanel = false;

    @track
    resourceDetails;

    @track
    canvasElements = [];

    @track
    nonCanvasElements = [];

    @track
    elements = [];

    labels = LABELS;
    searchString;
    processType;

    _addInlineResourceFromManagerTab = false;

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
    setElements = ({ data, error }) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        } else {
            this.elements = data;
        }
    };

    mapAppStateToStore = () => {
        const {
            properties = {},
            elements = {}
        } = storeInstance.getCurrentState();
        const { processType: flowProcessType } = properties;
        this.canvasElements = getElementSections(elements, this.searchString);
        this.nonCanvasElements = getResourceSections(
            elements,
            this.searchString
        );
        if (this.showResourceDetailsPanel) {
            const currentElementState =
                elements[this.resourceDetails.elementGuid];
            this.retrieveResourceDetailsFromStore(
                currentElementState,
                this.resourceDetails.asResource
            );
        }
        if (flowProcessType && this.processType !== flowProcessType) {
            this.processType = flowProcessType;
            logPerfTransactionStart(LEFT_PANEL_ELEMENTS);
            fetch(
                SERVER_ACTION_TYPE.GET_LEFT_PANEL_ELEMENTS,
                this.setElements,
                { flowProcessType }
            );
        }
    };

    get getPanelTitle() {
        return this.showResourceDetailsPanel
            ? this.resourceDetails.title
            : LABELS.headerText;
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
        let classes =
            'left-panel-header slds-panel__header slds-truncate_container';
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

        const addElementEvent = new AddElementEvent(
            elementType,
            locationX,
            locationY
        );
        this.dispatchEvent(addElementEvent);
    }

    handleResourceClicked(event) {
        const canvasElementGUID = event.detail.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID);
        this.dispatchEvent(editElementEvent);
    }

    handleShowResourceDetails(event) {
        const currentElementState = storeInstance.getCurrentState().elements[
            event.detail.elementGUID
        ];
        this.retrieveResourceDetailsFromStore(
            currentElementState,
            !event.detail.canvasElement
        );
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
        this.canvasElements = getElementSections(
            currentState.elements,
            this.searchString
        );
        this.nonCanvasElements = getResourceSections(
            currentState.elements,
            this.searchString
        );
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
                usedByElements: usedBy(
                    [currentElementState.guid],
                    storeElements
                ),
                asResource,
                storeOutputAutomatically:
                    currentElementState.storeOutputAutomatically
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
        if (this.elements.length) {
            logPerfTransactionEnd(LEFT_PANEL_ELEMENTS, {
                numOfElements: this.elements.length
            });
        }
    }
}
