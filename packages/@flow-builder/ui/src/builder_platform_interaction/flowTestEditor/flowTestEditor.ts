import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './flowTestEditorLabels';
import { flowTestEditorReducer } from './flowTestEditorReducer';

export default class FlowTestEditor extends LightningElement {
    @api triggerSaveType;
    @track activeMenuItemId = 'details';

    /**
     * Internal state of flow test editor
     */
    @track _flowTestObject;

    set flowTestObject(data) {
        this._flowTestObject = data;
    }

    @api
    get flowTestObject() {
        return this._flowTestObject;
    }

    // Function to get the list of tabs for the vertical navigation depending on the trigger save type
    get getMenuItems() {
        const items: UI.MenuItem[] = [];
        this.createMenuTab(items, 'details', LABELS.flowTestDetailsMenuItem);
        this.createMenuTab(items, 'initialRecord', LABELS.flowTestInitialRecordMenuItem);
        if (this._flowTestObject.testTriggerType.value === FLOW_TRIGGER_SAVE_TYPE.UPDATE) {
            this.createMenuTab(items, 'updateRecord', LABELS.flowTestUpdateRecordMenuItem);
        }
        this.createMenuTab(items, 'assertions', LABELS.flowTestAssertionsMenuItem);
        return items;
    }

    createMenuTab(items, guid, label) {
        items.push({
            element: {
                guid
            },
            label,
            isDraggable: false
        });
    }

    get isFlowTestDetailsActive() {
        return this.activeMenuItemId === 'details';
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    // Handler to set currently selected menu item
    handleItemSelected(event) {
        event.stopPropagation();
        this.activeMenuItemId = event.detail.itemId;
    }

    handlePropertyChangedEvent(event) {
        this._flowTestObject = flowTestEditorReducer(this._flowTestObject, event);
    }
}
