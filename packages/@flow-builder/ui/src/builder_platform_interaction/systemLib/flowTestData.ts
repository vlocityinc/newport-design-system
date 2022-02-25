export type FlowTestAndResultDescriptor = {
    flowTestName: string;
    description: string;
    createdBy: string;
    lastModifiedDate: Date;
    lastRunDate: Date;
    lastRunStatus: FlowTestResultStatusType;
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
    private currentOffset = 0;

    /**
     * @returns true if we have reached the end of the list with our batched queries to the server
     */
    hasHitEndOfList(): boolean {
        return this.hitEndOfList;
    }

    /**
     * @returns the offset we need to pass to the server if we fetch another batch of tests for the list
     */
    getCurrentOffset(): number {
        return this.currentOffset;
    }

    /**
     * Increments the offset by the given count
     *
     * @param count
     */
    incrementOffset(count): void {
        this.currentOffset += count;
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
        this.currentOffset = 0;
    }
}

const listState: FlowTestListState = new FlowTestListState();
let flowTests: FlowTestAndResultDescriptor[] = [];

/**
 * Adds tests to the local flow test store
 *
 * @param data incoming data from the server to be added to the local store
 */
export function addFlowTests(data: FlowTestAndResultDescriptor[]): void {
    if (!data || data.length === 0) {
        listState.hitEnd();
        return;
    }
    listState.incrementOffset(data.length);
    data.forEach((datum) => {
        flowTests.push({ ...datum });
    });
}

/**
 * takes incoming test result data, matches them by id to tests in the store, and updates the store accordingly

 * @param incomingData incoming result data from a test run
 */
export function updateFlowTestResults(incomingData: { [flowTestId: string]: DescribeRunFlowTestResult }): void {
    for (const testId in incomingData) {
        if (incomingData.hasOwnProperty(testId)) {
            const resultData = incomingData[testId];
            const matchingTestInStore = flowTests.find((t) => t.flowTestId === resultData.testId);
            if (matchingTestInStore) {
                matchingTestInStore.lastRunDate = resultData.endInterviewTime;
                matchingTestInStore.lastRunStatus = resultData.testStatus;
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
