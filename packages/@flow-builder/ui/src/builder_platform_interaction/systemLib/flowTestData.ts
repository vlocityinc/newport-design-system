export type FlowTestAndResultDescriptor = {
    flowTestName: string;
    description: string;
    createdBy: string;
    lastModifiedDate: Date;
    lastRunDate: Date;
    lastRunStatus: FlowTestResultStatusType;
    flowTestId: string;
};

export enum FlowTestResultStatusType {
    PASS = 'Pass',
    FAIL = 'Fail',
    ERROR = 'Error'
}

let flowTests: FlowTestAndResultDescriptor[] = [];

// TODO: The exact API this store will expose is still a work in progress. To be finalized and tested in W-10522425

/**
 * @param data
 */
export function setFlowTests(data: any[]): void {
    flowTests = data.map((datum) => {
        return { ...datum };
    });
}

/**
 * @param incomingData
 */
export function updateFlowTestResults(incomingData: FlowTestAndResultDescriptor[]): void {
    // takes incoming test result data, matches them by id to tests in the store, and updates the store accordingly
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
 *
 */
export function getFlowTests(): FlowTestAndResultDescriptor[] {
    return flowTests;
}
