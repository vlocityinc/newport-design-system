import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './flowTestModalLabels';

export default class FlowTestModal extends LightningElement {
    @api triggerSaveType;
    @track activeMenuItemId;
    items: UI.MenuItem[] = [];

    // Function to get the list of tabs for the vertical navigation depending on the trigger save type
    get getMenuItems() {
        this.createMenuTab('details', LABELS.flowTestDetailsMenuItem);
        this.createMenuTab('initialRecord', LABELS.flowTestInitialRecordMenuItem);
        if (
            this.triggerSaveType === FLOW_TRIGGER_SAVE_TYPE.UPDATE ||
            this.triggerSaveType === FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE
        ) {
            this.createMenuTab('updateRecord', LABELS.flowTestUpdateRecordMenuItem);
        }
        this.createMenuTab('assertions', LABELS.flowTestAssertionsMenuItem);
        return this.items;
    }

    createMenuTab(guid, label) {
        this.items.push({
            element: {
                guid
            },
            label,
            isDraggable: false
        });
    }

    // Function to set currently selected menu item
    handleItemSelected(event) {
        event.stopPropagation();
        this.activeMenuItemId = event.detail.itemId;
    }
}
