import { Element, api, track } from 'engine';
import { EVENT } from 'builder_platform_interaction-constant';
import { resourcesSelector } from 'builder_platform_interaction-selectors';
import { Store } from 'builder_platform_interaction-store-lib';


// TODO: We will pull labels from another file/section soon.
import elementsLabel from '@label/DesignerLabels.palette_label';
import resourcesLabel from '@label/DesignerLabels.resources_label';

const ACTIVETABID_DEFAULT = "left-panel-tabitem-elements";

let storeInstance;
let unsubscribeStore;

/**
 * Left panel component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class LeftPanel extends Element {
    @track activetabid = ACTIVETABID_DEFAULT;

    @track resources = [];

    labels = {
        elements: elementsLabel,
        resources: resourcesLabel
    };

    constructor() {
        super();
        storeInstance = Store.getStore();
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
    }

    mapAppStateToStore = () => {
        const currentState = storeInstance.getCurrentState();
        this.resources = resourcesSelector(currentState);
    };

    @api
    get activeTabId() {
        return this.activetabid;
    }

    handleTabChange(event) {
        this.activetabid = event.detail.tabId;
    }

    handleElementClicked(event) {
        const elementType = event.detail.elementType;

        // TODO: Better default location.
        const locationX = 0;
        const locationY = 0;

        // TODO: Change the name of the CANVAS_ELEMENT_DROP event to something like CREATE_ELEMENT.
        const createElementEvent = new CustomEvent(EVENT.CANVAS_ELEMENT_DROP, {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: {
                elementType,
                locationX,
                locationY
            }
        });
        this.dispatchEvent(createElementEvent);
    }

    handleResourceClicked(event) {
        // TODO: Change the name of the NODE_DBLCLICKED event to something like EDIT_ELEMENT.
        const editElementEvent = new CustomEvent(EVENT.NODE_DBLCLICKED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID: event.detail.guid
            }
        });
        this.dispatchEvent(editElementEvent);
    }

    disconnectedCallback() {
        unsubscribeStore();
    }
}
