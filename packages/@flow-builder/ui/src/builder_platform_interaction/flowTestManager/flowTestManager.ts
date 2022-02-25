import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { deleteFlowTest } from 'builder_platform_interaction/preloadLib';
import type { FlowTestAndResultDescriptor } from 'builder_platform_interaction/systemLib';
import {
    deleteFlowTestFromCache,
    FlowTestResultStatusType,
    getFlowTestListState,
    getFlowTests
} from 'builder_platform_interaction/systemLib';
import { api, LightningElement } from 'lwc';
import { LABELS } from './flowTestManagerLabels';

export enum FlowTestListRowAction {
    Delete = 'delete',
    Edit = 'edit',
    Detail = 'detail'
}

const ACTIONS = [
    { label: LABELS.flowTestListViewDetailAction, name: FlowTestListRowAction.Detail },
    { label: LABELS.flowTestListEditAction, name: FlowTestListRowAction.Edit },
    { label: LABELS.flowTestListDeleteAction, name: FlowTestListRowAction.Delete }
];

const COLUMNS = [
    { label: LABELS.flowTestListNameColumnHeader, fieldName: 'flowTestName', type: 'text' },
    { label: LABELS.flowTestListDescriptionColumnHeader, fieldName: 'description', type: 'text' },
    { label: LABELS.flowTestListCreatorColumnHeader, fieldName: 'createdBy', type: 'text' },
    {
        label: LABELS.flowTestListLastModifiedDateColumnHeader,
        fieldName: 'lastModifiedDate',
        type: 'date',
        typeAttributes: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }
    },
    {
        label: LABELS.flowTestListLastRunDateColumnHeader,
        fieldName: 'lastRunDate',
        type: 'date',
        typeAttributes: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }
    },
    {
        label: LABELS.flowTestListRunStatusColumnHeader,
        type: 'text',
        cellAttributes: {
            iconName: { fieldName: 'lastRunStatusIcon' },
            iconLabel: { fieldName: 'lastRunStatus' },
            iconPosition: 'left',
            iconAlternativeText: 'Test Result'
        }
    },
    { type: 'action', typeAttributes: { rowActions: ACTIONS } }
];

const RESULT_STATUS_TO_ICON_MAP = {
    [FlowTestResultStatusType.PASS]: 'utility:check',
    [FlowTestResultStatusType.FAIL]: 'utility:close',
    [FlowTestResultStatusType.ERROR]: 'utility:close'
};

/* Max number of tests to be sent in a single run request */
const TEST_RUN_BATCH_SIZE = 50;

export default class FlowTestManager extends LightningElement {
    @api createOrEditFlowTestCallback;
    // Facilitates infinite scrolling, calling this should query for another page of tests and add it to the flow test store
    @api handleLoadMoreTests;
    @api handleRunTests;
    @api hideModal;
    @api footer;

    labels = LABELS;
    columns = COLUMNS;
    listIsLoadingMoreTests = false;

    privateFlowTestData: FlowTestAndResultDescriptor[] = [];
    selectedTests: FlowTestAndResultDescriptor[] = [];

    showLoadingSpinner = false;

    constructor() {
        super();
        this.copyDataFromTestStore();
    }

    handleCreateNewTest() {
        this.handleCreateOrEdit(FlowTestMode.Create);
    }

    get flowHasTests() {
        return this.privateFlowTestData.length > 0;
    }

    get flowTestData() {
        return this.privateFlowTestData;
    }

    handleRowAction(event) {
        const action: FlowTestListRowAction = event.detail.action.name;
        const row: FlowTestAndResultDescriptor = event.detail.row;

        switch (action) {
            case FlowTestListRowAction.Delete:
                this.handleDeleteFlowTest(row.flowTestId);
                break;
            case FlowTestListRowAction.Edit:
                this.handleCreateOrEdit(FlowTestMode.Edit);
                break;
            case FlowTestListRowAction.Detail:
                // TODO: implement run and view detail action
                break;
            default:
            // noop
        }
    }

    handleRowSelection(event) {
        this.selectedTests = event.detail.selectedRows;
        const areAnySelected = this.selectedTests.length !== 0;
        this.footer.enableButtonOne(areAnySelected);
    }

    async loadMoreHandler(event) {
        if (this.listIsLoadingMoreTests || getFlowTestListState().hasHitEndOfList()) {
            return;
        }
        this.listIsLoadingMoreTests = true;
        try {
            await this.handleLoadMoreTests(getFlowTestListState().getCurrentOffset());
            this.copyDataFromTestStore();
        } finally {
            this.listIsLoadingMoreTests = false;
        }
    }

    @api copyDataFromTestStore() {
        this.privateFlowTestData = getFlowTests().map((datum) => {
            return {
                ...datum,
                lastRunStatusIcon: RESULT_STATUS_TO_ICON_MAP[datum.lastRunStatus]
            };
        });
    }

    @api async runSelectedTests(): Promise<void> {
        this.showLoadingSpinner = true;
        const selectedTestIds = this.selectedTests.map((testData) => testData.flowTestId);
        const testRunPromises: Promise<void>[] = [];
        for (let i = 0; i < selectedTestIds.length; i += TEST_RUN_BATCH_SIZE) {
            testRunPromises.push(this.handleRunTests(selectedTestIds.slice(i, i + TEST_RUN_BATCH_SIZE), false));
        }
        try {
            await Promise.all(testRunPromises);
        } finally {
            this.copyDataFromTestStore();
            this.showLoadingSpinner = false;
        }
    }

    handleCreateOrEdit(mode: FlowTestMode) {
        this.hideModal();
        this.createOrEditFlowTestCallback(mode);
    }

    /**
     * Calling DeleteFlowTest api to delete record and updating the flowTest cache
     *
     * @param flowTestId Flow test Id to delete
     */
    handleDeleteFlowTest = async (flowTestId) => {
        this.showLoadingSpinner = true;
        try {
            const results = await deleteFlowTest([flowTestId]);
            this._deleteFlowTestResults(results);
        } finally {
            this.showLoadingSpinner = false;
        }
    };

    _deleteFlowTestResults(results) {
        let isFlowTestDeleted = false;
        for (const result of results) {
            // check if deletion is successful
            if (result.isSuccess) {
                // delete the record from the FlowTest cache
                deleteFlowTestFromCache(result.id);
                isFlowTestDeleted = true;
            } else {
                // Delete operation was unsuccessful. No change in FlowTest data.
                // TODO: Waiting on UX designs how this error should show up on the Flow test manager
            }
        }
        if (isFlowTestDeleted) {
            this.copyDataFromTestStore();
        }
    }
}
