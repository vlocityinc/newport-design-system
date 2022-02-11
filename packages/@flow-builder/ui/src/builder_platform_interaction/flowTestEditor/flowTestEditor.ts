import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './flowTestEditorLabels';
import { flowTestEditorReducer } from './flowTestEditorReducer';

export enum FlowTestMenuItems {
    Details,
    InitialRecord,
    UpdatedRecord,
    Assertions
}

export default class FlowTestEditor extends LightningElement {
    @api triggerSaveType;
    @track activeMenuItemId = FlowTestMenuItems.Details;
    items: UI.MenuItem[] = [];

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

    labels = LABELS;
    tabHeaders = {
        [FlowTestMenuItems.Details]: this.labels.flowTestDetailsMenuItem,
        [FlowTestMenuItems.InitialRecord]: '',
        [FlowTestMenuItems.UpdatedRecord]: '',
        [FlowTestMenuItems.Assertions]: this.labels.flowTestAssertionPanelHeader
    };

    tabDescriptions = {
        [FlowTestMenuItems.InitialRecord]: '',
        [FlowTestMenuItems.UpdatedRecord]: '',
        [FlowTestMenuItems.Assertions]: this.labels.flowTestAssertionPanelDescription
    };
    // Function to get the list of tabs for the vertical navigation depending on the trigger save type
    get getMenuItems() {
        const items: UI.MenuItem[] = [];
        this.createMenuTab(items, FlowTestMenuItems.Details, LABELS.flowTestDetailsMenuItem);
        this.createMenuTab(items, FlowTestMenuItems.InitialRecord, LABELS.flowTestInitialRecordMenuItem);
        if (this._flowTestObject.testTriggerType.value === FLOW_TRIGGER_SAVE_TYPE.UPDATE) {
            this.createMenuTab(items, FlowTestMenuItems.UpdatedRecord, LABELS.flowTestUpdateRecordMenuItem);
        }
        this.createMenuTab(items, FlowTestMenuItems.Assertions, LABELS.flowTestAssertionsMenuItem);
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

    get tabHeader() {
        return this.tabHeaders[this.activeMenuItemId];
    }

    get tabDescription() {
        return this.tabDescriptions[this.activeMenuItemId];
    }

    get isFlowTestDetailsActive() {
        return this.activeMenuItemId === FlowTestMenuItems.Details;
    }

    get isFlowTestAssertionActive() {
        return this.activeMenuItemId === FlowTestMenuItems.Assertions;
    }

    get isInitialRecordActive() {
        return this.activeMenuItemId === FlowTestMenuItems.InitialRecord;
    }

    get isUpdateRecordActive() {
        return this.activeMenuItemId === FlowTestMenuItems.UpdatedRecord;
    }

    get assertions(): UI.FlowTestAssertion[] {
        return this._flowTestObject.testAssertions;
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    // Handler to set currently selected menu item
    handleItemSelected(event) {
        event.stopPropagation();
        this.activeMenuItemId = event.detail.itemId;
    }

    handlePropertyChanged(event) {
        event.stopPropagation();
        this._flowTestObject = flowTestEditorReducer(this._flowTestObject, event);
    }
}
