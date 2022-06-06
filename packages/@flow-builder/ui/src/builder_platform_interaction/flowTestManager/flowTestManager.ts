import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { deleteFlowTest } from 'builder_platform_interaction/preloadLib';
import { commonUtils, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import type { FlowTestAndResultDescriptor } from 'builder_platform_interaction/systemLib';
import {
    deleteFlowTestFromCache,
    FlowTestResultStatusType,
    getFlowTestListState,
    getFlowTests
} from 'builder_platform_interaction/systemLib';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { api, LightningElement } from 'lwc';
import { LABELS } from './flowTestManagerLabels';

const { format } = commonUtils;
const { logPerfTransactionStart, logPerfTransactionEnd, OPEN_FLOW_TEST_LIST } = loggingUtils;

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

const RESULT_STATUS_TRANSLATED_METADATA = {
    [FlowTestResultStatusType.PASS]: {
        lastRunStatusIcon: 'utility:check',
        lastRunStatus: LABELS.flowTestListRunStatusPass
    },
    [FlowTestResultStatusType.FAIL]: {
        lastRunStatusIcon: 'utility:close',
        lastRunStatus: LABELS.flowTestListRunStatusFail
    },
    [FlowTestResultStatusType.ERROR]: {
        lastRunStatusIcon: 'utility:close',
        lastRunStatus: LABELS.flowTestListRunStatusError
    }
};

const FLOW_TEST_MODE_TO_PERF_LOG_MAP = {
    [FlowTestMode.Create]: 'CREATE_FLOW_TEST_FROM_LIST',
    [FlowTestMode.Edit]: 'EDIT_FLOW_TEST_FROM_LIST'
};

/* Max number of tests to be sent in a single run request */
const TEST_RUN_BATCH_SIZE = 50;

/* Logging strings */
const DELETE_FLOW_TEST_FROM_LIST = 'DELETE_FLOW_TEST_FROM_LIST';
const RUN_TEST_AND_VIEW_DETAIL_FROM_LIST = 'RUN_TEST_AND_VIEW_DETAIL_FROM_LIST';
const BULK_RUN_FLOW_TESTS_FROM_LIST = 'BULK_RUN_FLOW_TESTS_FROM_LIST';

export default class FlowTestManager extends LightningElement {
    @api createOrEditFlowTestCallback;
    // Facilitates infinite scrolling, calling this should query for another page of tests and add it to the flow test store
    @api handleLoadMoreTests;
    @api handleRunTests;
    @api handleRunAndViewTestDetail;
    @api hideModal;
    @api footer;

    labels = LABELS;
    columns = COLUMNS;
    legalAgreementLink = 'https://www.salesforce.com/company/legal/agreements.jsp';
    listIsLoadingMoreTests = false;

    privateFlowTestData: FlowTestAndResultDescriptor[] = [];
    selectedTests: FlowTestAndResultDescriptor[] = [];

    showLoadingSpinner = false;
    isFirstRender = false;

    constructor() {
        super();
        this.copyDataFromTestStore();
    }

    renderedCallback() {
        if (!this.isFirstRender) {
            logPerfTransactionEnd(OPEN_FLOW_TEST_LIST, { testCount: this.privateFlowTestData.length });
            this.isFirstRender = true;
        }
    }

    handleCreateNewTest() {
        this.handleCreateOrEdit(FlowTestMode.Create, null);
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
                this.handleCreateOrEdit(FlowTestMode.Edit, row.flowTestId);
                break;
            case FlowTestListRowAction.Detail:
                this.handleRunAndViewTestDetailAction(row.flowTestId);
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

    async loadMoreHandler() {
        if (this.listIsLoadingMoreTests || getFlowTestListState().hasHitEndOfList()) {
            return;
        }
        this.listIsLoadingMoreTests = true;
        try {
            await this.handleLoadMoreTests(getFlowTests().length);
            this.copyDataFromTestStore();
        } finally {
            this.listIsLoadingMoreTests = false;
        }
    }

    @api copyDataFromTestStore() {
        this.privateFlowTestData = getFlowTests().map((datum) => {
            const statusMetadata =
                datum.lastRunStatus === null ? {} : RESULT_STATUS_TRANSLATED_METADATA[datum.lastRunStatus];
            return {
                ...datum,
                ...statusMetadata
            };
        });
    }

    @api async runSelectedTests(): Promise<void> {
        logPerfTransactionStart(BULK_RUN_FLOW_TESTS_FROM_LIST);
        this.showLoadingSpinner = true;
        const selectedTestIds = this.selectedTests.map((testData) => testData.flowTestId);
        const testRunPromises: Promise<any>[] = [];
        for (let i = 0; i < selectedTestIds.length; i += TEST_RUN_BATCH_SIZE) {
            testRunPromises.push(this.handleRunTests(selectedTestIds.slice(i, i + TEST_RUN_BATCH_SIZE), false));
        }
        try {
            let errors = null;
            const results = await Promise.all(testRunPromises);
            if (results?.[0]?.[selectedTestIds[0]]) {
                errors = results[0][selectedTestIds[0]][0].errors;
            }

            if (errors && errors[0] === LABELS.flowTestFeatureNotAvailable) {
                this.showToast(LABELS.flowTestRunFailureWhenGateClosedToast, 'error', 'sticky');
            } else {
                this.showToast(LABELS.flowTestRunBulkActionCompleteToast, 'success');
            }
        } catch (exception) {
            // Catch unhandled promise reject error to prevent extra flow error modal
            // Server-side unhandled error is still rendered as a new modal.
        } finally {
            this.copyDataFromTestStore();
            this.showLoadingSpinner = false;
            logPerfTransactionEnd(BULK_RUN_FLOW_TESTS_FROM_LIST, { testCount: this.selectedTests.length });
        }
    }

    async handleCreateOrEdit(mode: FlowTestMode, flowTestId) {
        logPerfTransactionStart(FLOW_TEST_MODE_TO_PERF_LOG_MAP[mode]);
        try {
            this.hideModal();
            const result = await this.createOrEditFlowTestCallback(mode, flowTestId);
            if (result === false && flowTestId) {
                deleteFlowTestFromCache(flowTestId);
                this.copyDataFromTestStore();
            }
        } finally {
            logPerfTransactionEnd(FLOW_TEST_MODE_TO_PERF_LOG_MAP[mode], { flowTestId });
        }
    }

    /**
     * Calling DeleteFlowTest api to delete record and updating the flowTest cache
     *
     * @param flowTestId Flow test Id to delete
     */
    handleDeleteFlowTest = async (flowTestId) => {
        logPerfTransactionStart(DELETE_FLOW_TEST_FROM_LIST);
        this.showLoadingSpinner = true;
        try {
            const results = await deleteFlowTest([flowTestId]);
            this._deleteFlowTestResults(results);
        } catch (exception) {
            // Catch unhandled promise reject error
        } finally {
            this.showLoadingSpinner = false;
            logPerfTransactionEnd(DELETE_FLOW_TEST_FROM_LIST, { flowTestId });
        }
    };

    _deleteFlowTestResults(results) {
        let isFlowTestDeleted = false;
        for (const result of results) {
            const testName = getFlowTests().filter((t) => result.id === t.flowTestId)[0].flowTestName;
            // check if deletion is successful
            if (result.isSuccess) {
                deleteFlowTestFromCache(result.id);
                isFlowTestDeleted = true;
                this.showToast(format(LABELS.flowTestDeleteActionSuccessToast, testName), 'success');
            } else if (result.errorMessage) {
                // Delete operation was unsuccessful. Show message returned from server.
                this.showToast(result.errorMessage, 'error', 'sticky');
            } else {
                // Delete operation was unsuccessful. No change in FlowTest data.
                this.showToast(format(LABELS.flowTestDeleteActionFailureToast, testName), 'error', 'sticky');
            }
        }
        if (isFlowTestDeleted) {
            this.copyDataFromTestStore();
        }
    }

    handleRunAndViewTestDetailAction = async (flowTestId) => {
        logPerfTransactionStart(RUN_TEST_AND_VIEW_DETAIL_FROM_LIST);
        this.showLoadingSpinner = true;
        try {
            await this.handleRunAndViewTestDetail(flowTestId, true);
        } finally {
            this.showLoadingSpinner = false;
            logPerfTransactionEnd(RUN_TEST_AND_VIEW_DETAIL_FROM_LIST, { flowTestId });
        }
    };

    showToast = (message: string, variant: string, mode?: string) => {
        const toastEvent = new ShowToastEvent({
            message,
            variant,
            mode
        });
        this.dispatchEvent(toastEvent);
    };
}
