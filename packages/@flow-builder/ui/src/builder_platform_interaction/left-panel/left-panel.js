import { Element, api, track } from 'engine';

// TODO: We will pull labels from another file/section soon.
import elements from '@label/DesignerLabels.palette_label';
import resources from '@label/DesignerLabels.resources_label';

const ACTIVETABID_DEFAULT = "left-panel-tabitem-elements";

/**
 * Left panel component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class LeftPanel extends Element {
    @api resources;

    @track activetabid = ACTIVETABID_DEFAULT;

    labels = {
        elements,
        resources
    };

    @api
    get activeTabId() {
        return this.activetabid;
    }

    handleTabChange(event) {
        this.activetabid = event.detail.tabId;
    }
}
