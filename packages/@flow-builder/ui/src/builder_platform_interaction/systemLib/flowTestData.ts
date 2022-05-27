import flowTestFeatureNotAvailable from '@salesforce/label/FlowBuilderTestEditor.flowTestFeatureNotAvailable';

export const FLOW_TEST_DATA_LABELS = {
    flowTestFeatureNotAvailable
};

export type FlowTestAndResultDescriptor = {
    flowTestName: string;
    description: string;
    createdBy: string;
    lastModifiedDate: Date;
    lastRunDate: Date | null;
    lastRunStatus: FlowTestResultStatusType | null;
    flowTestId: string;
};

// matches DescribeRunFlowTestResult.java on core
export type DescribeRunFlowTestResult = {
    testName: string;
    testId: string;
    testStatus: FlowTestResultStatusType;
    interviewStatus: string;
    interviewErrors: string[];
    trace: UI.DebugDataEntry;
    assertions: UI.TestAssertionEntry;
    startInterviewTime: Date;
    endInterviewTime: Date;
};

export const enum FlowTestResultStatusType {
    PASS = 'Pass',
    FAIL = 'Fail',
    ERROR = 'Error'
}

/*
    Encapsulates UI list state that needs to persist outside the lifespan of the flowTestManager modal
*/
export class FlowTestListState {
    /** the size of the chunks we retrieve in our batched test gets */
    static LOAD_CHUNK_SIZE = 50;

    private hitEndOfList = false;

    /**
     * @returns true if we have reached the end of the list with our batched queries to the server
     */
    hasHitEndOfList(): boolean {
        return this.hitEndOfList;
    }

    /**
     * Flips the flag that indicates we have hit the end of the list and have no more tests to query
     */
    hitEnd(): void {
        this.hitEndOfList = true;
    }

    /**
     * Reloads the list state
     */
    reset(): void {
        this.hitEndOfList = false;
    }
}

const listState: FlowTestListState = new FlowTestListState();
let flowTests: FlowTestAndResultDescriptor[] = [];

/**
 * Removes matching existing row if it already exists, and adds flow test to the top of the list.
 *
 * @param data data for the test to be added
 */
export function pushFlowTest(data: FlowTestAndResultDescriptor): void {
    let existingLastRunDate: Date | null = null,
        existingLastRunStatus: FlowTestResultStatusType | null = null;
    const existingTestRow = flowTests.find((t) => t.flowTestId === data.flowTestId);
    if (existingTestRow) {
        existingLastRunDate = existingTestRow.lastRunDate;
        existingLastRunStatus = existingTestRow.lastRunStatus;
        flowTests = flowTests.filter((t) => t.flowTestId !== data.flowTestId);
    }

    flowTests.unshift({
        ...data,
        lastRunDate: existingLastRunDate,
        lastRunStatus: existingLastRunStatus
    });
}

/**
 * Adds tests to the local flow test store
 *
 * @param data incoming data from the server to be added to the local store
 */
export function addFlowTests(data: FlowTestAndResultDescriptor[]): void {
    if (!data) {
        listState.hitEnd();
        return;
    }
    if (data.length < FlowTestListState.LOAD_CHUNK_SIZE) {
        listState.hitEnd();
    }
    data.forEach((datum) => {
        flowTests.push({ ...datum });
    });
}

/**
 * takes incoming test result data, matches them by id to tests in the store, and updates the store accordingly
 *
 * @param incomingData incoming result data from a test run
 */
export function updateFlowTestResults(incomingData): void {
    for (const testId in incomingData) {
        if (incomingData.hasOwnProperty(testId)) {
            const describeRunFlowTestResultData = incomingData[testId][0];
            if (describeRunFlowTestResultData?.errors?.[0] === flowTestFeatureNotAvailable) {
                break;
            } else {
                const matchingTestInStore = flowTests.find(
                    (t) => t.flowTestId === describeRunFlowTestResultData.testId
                );
                if (matchingTestInStore) {
                    matchingTestInStore.lastRunDate = describeRunFlowTestResultData.endInterviewTime;
                    matchingTestInStore.lastRunStatus = describeRunFlowTestResultData.testStatus;
                }
            }
        }
    }
}

/**
 * @returns the current state of the local flow test store
 */
export function getFlowTests(): FlowTestAndResultDescriptor[] {
    return flowTests;
}

/**
 *  @returns the current UI state of the list
 */
export function getFlowTestListState(): FlowTestListState {
    return listState;
}

/**
 * Resets the flow test data and the UI state
 */
export function resetFlowTestStore(): void {
    listState.reset();
    flowTests = [];
}

/**
 * Delete Flow test record from FlowTest cache
 *
 * @param flowTestId flowTestId to delete
 */
export function deleteFlowTestFromCache(flowTestId: string): void {
    flowTests = flowTests.filter((item) => item.flowTestId !== flowTestId);
}

/**
 * Removes all test results from the store.
 */
export function clearTestResultsFromStore(): void {
    flowTests = flowTests.map((test) => {
        return { ...test, lastRunDate: null, lastRunStatus: null };
    });
}
