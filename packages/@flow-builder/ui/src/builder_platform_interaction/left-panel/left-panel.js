import { Element, api, track } from 'engine';
import { EditElementEvent } from 'builder_platform_interaction-events';
import { resourcesSelector } from 'builder_platform_interaction-selectors';
import { Store } from 'builder_platform_interaction-store-lib';


// TODO: We will pull labels from another file/section soon.
import elementsLabel from '@label/DesignerLabels.palette_label';
import resourcesLabel from '@label/DesignerLabels.resources_label';

const ACTIVETABID_DEFAULT = 'left-panel-tabitem-elements';

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

    handleResourceClicked(event) {
        const canvasElementGUID = event.detail.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID);
        this.dispatchEvent(editElementEvent);
    }

    disconnectedCallback() {
        unsubscribeStore();
    }
}
