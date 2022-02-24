export type FlowTestAndResultDescriptor = {
    flowTestName: string;
    description: string;
    createdBy: string;
    lastModifiedDate: Date;
    lastRunDate: Date;
    lastRunStatus: FlowTestResultStatusType;
    flowTestId: string;
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

// TODO: The exact API this store will expose is still a work in progress. To be finalized and tested in W-10522425

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
 * WIP, this should be based on the shape of that incoming result data after a run, whatever that is
 *
 * @param incomingData incoming result data from a test run
 */
export function updateFlowTestResults(incomingData: FlowTestAndResultDescriptor[]): void {
    flowTests = flowTests.map((testData) => {
        const testId = testData.flowTestId;
        const matchingTest = incomingData.find((t) => t.flowTestId === testId);
        if (matchingTest) {
            return { ...testData, lastRunDate: matchingTest.lastRunDate, lastRunStatus: matchingTest.lastRunStatus };
        }
        return { ...testData };
    });
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
