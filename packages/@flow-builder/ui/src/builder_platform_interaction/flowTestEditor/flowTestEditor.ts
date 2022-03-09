import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { getErrorsFromHydratedElement, pick } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './flowTestEditorLabels';
import { flowTestEditorReducer } from './flowTestEditorReducer';

export enum FlowTestMenuItems {
    Details,
    InitialRecord,
    UpdatedRecord,
    Assertions
}

const PROPERTIES_BY_TAB = {
    [FlowTestMenuItems.Details]: ['name', 'label', 'description', 'testTriggerType', 'runPathValue'],
    [FlowTestMenuItems.InitialRecord]: ['testInitialRecordData'],
    [FlowTestMenuItems.UpdatedRecord]: ['testUpdatedRecordData'],
    [FlowTestMenuItems.Assertions]: ['testAssertions']
};

export default class FlowTestEditor extends LightningElement {
    @api triggerSaveType;
    @api mode;
    @track activeMenuItemId = FlowTestMenuItems.Details;
    items: UI.MenuItem[] = [];
    @api objectApiName;
    @api showWaitingSpinner;
    @api devNamePrefix;

    @api validate() {
        const event = { type: VALIDATE_ALL, mode: this.mode };
        this._flowTestObject = flowTestEditorReducer(this._flowTestObject, event);
        const validatedFlowTest = { ...this._flowTestObject };
        if (validatedFlowTest.testTriggerType.value !== FLOW_TRIGGER_SAVE_TYPE.UPDATE) {
            delete validatedFlowTest.testUpdatedRecordData;
        }
        return getErrorsFromHydratedElement(validatedFlowTest);
    }

    sampleRecordId;
    // Keep track that we only ever want to copy initial record data to updated record data once.
    hasCopiedInitialRecord = false;

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
        [FlowTestMenuItems.InitialRecord]: this.labels.flowTestInitialRecordPanelHeader,
        [FlowTestMenuItems.UpdatedRecord]: this.labels.flowTestUpdatedRecordPanelHeader,
        [FlowTestMenuItems.Assertions]: this.labels.flowTestAssertionPanelHeader
    };

    tabDescriptions = {
        [FlowTestMenuItems.InitialRecord]: this.labels.flowTestInitialRecordPanelDescription,
        [FlowTestMenuItems.UpdatedRecord]: this.labels.flowTestUpdatedRecordPanelDescription,
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
        const propertyNames = PROPERTIES_BY_TAB[guid];
        const flowTestObjectSubset = pick(this._flowTestObject, propertyNames);
        items.push({
            element: {
                guid
            },
            label,
            isDraggable: false,
            hasErrors: getErrorsFromHydratedElement(flowTestObjectSubset).length > 0
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

    get isUpdatedRecordActive() {
        return this.activeMenuItemId === FlowTestMenuItems.UpdatedRecord;
    }

    get assertions(): UI.FlowTestAssertion[] {
        return this._flowTestObject.testAssertions;
    }

    get initialRecordData(): object {
        return this._flowTestObject.testInitialRecordData;
    }

    get updatedRecordData(): object {
        return this._flowTestObject.testUpdatedRecordData;
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    // Handler to set currently selected menu item
    handleItemSelected(event) {
        event.stopPropagation();
        this.activeMenuItemId = event.detail.itemId;
        if (this.activeMenuItemId === FlowTestMenuItems.UpdatedRecord) {
            this.copyInitialRecord();
        }
    }

    /**
     * Helper function to copy over initial record data to updated recorded data IFF:
     * - In Create Mode
     * - We have not copied over data before
     * - Initial Data is not empty and Updated data is empty
     */
    copyInitialRecord() {
        if (
            !this.hasCopiedInitialRecord &&
            this.mode === FlowTestMode.Create &&
            this.isTestDataModified(this._flowTestObject.testInitialRecordData) &&
            !this.isTestDataModified(this._flowTestObject.testUpdatedRecordData)
        ) {
            this._flowTestObject.testUpdatedRecordData = deepCopy(this._flowTestObject.testInitialRecordData);
            this.hasCopiedInitialRecord = true;
        }
    }

    /**
     * Checks passed in record data to see if it has been modified
     *
     * @param flowTestRecordData
     * @returns
     */
    isTestDataModified(flowTestRecordData): boolean {
        return flowTestRecordData.hasOwnProperty('value') && Object.keys(flowTestRecordData.value).length > 0;
    }

    handlePropertyChanged(event) {
        event.stopPropagation();
        this._flowTestObject = flowTestEditorReducer(this._flowTestObject, event);
    }

    handleTestRecordSelected(event) {
        event.stopPropagation();
        this.sampleRecordId = event.detail.id;
    }
}
