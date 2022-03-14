import {
    addFlowTests,
    clearTestResultsFromStore,
    FlowTestAndResultDescriptor,
    FlowTestResultStatusType,
    getFlowTestListState,
    getFlowTests,
    pushFlowTest,
    resetFlowTestStore,
    updateFlowTestResults
} from '../flowTestData';

const MOCK_DESCRIPTORS: FlowTestAndResultDescriptor[] = [
    {
        flowTestName: 'name1',
        description: '',
        createdBy: 'some person',
        lastModifiedDate: new Date(),
        lastRunDate: new Date(),
        lastRunStatus: FlowTestResultStatusType.PASS,
        flowTestId: 'id1'
    },
    {
        flowTestName: 'name2',
        description: '',
        createdBy: 'some person',
        lastModifiedDate: new Date(),
        lastRunDate: new Date(),
        lastRunStatus: FlowTestResultStatusType.PASS,
        flowTestId: 'id2'
    },
    {
        flowTestName: 'name3',
        description: '',
        createdBy: 'some person',
        lastModifiedDate: new Date(),
        lastRunDate: new Date(),
        lastRunStatus: FlowTestResultStatusType.ERROR,
        flowTestId: 'id3'
    },
    {
        flowTestName: 'name4',
        description: '',
        createdBy: 'some person',
        lastModifiedDate: new Date(),
        lastRunDate: new Date(),
        lastRunStatus: FlowTestResultStatusType.PASS,
        flowTestId: 'id4'
    },
    {
        flowTestName: 'name5',
        description: '',
        createdBy: 'some person',
        lastModifiedDate: new Date(),
        lastRunDate: new Date(),
        lastRunStatus: FlowTestResultStatusType.FAIL,
        flowTestId: 'id5'
    }
];

const MOCK_RESULTS = {
    id1: [
        {
            testName: 'name1',
            testId: 'id1',
            testStatus: FlowTestResultStatusType.FAIL,
            interviewStatus: '',
            interviewErrors: [],
            trace: null,
            assertions: null,
            startInterviewTime: new Date(),
            endInterviewTime: new Date()
        },
        {
            decoratedElements: null
        }
    ],
    id3: [
        {
            testName: 'name3',
            testId: 'id3',
            testStatus: FlowTestResultStatusType.PASS,
            interviewStatus: '',
            interviewErrors: [],
            trace: null,
            assertions: null,
            startInterviewTime: new Date(),
            endInterviewTime: new Date()
        },
        {
            decoratedElements: null
        }
    ],
    id5: [
        {
            testName: 'name5',
            testId: 'id5',
            testStatus: FlowTestResultStatusType.ERROR,
            interviewStatus: '',
            interviewErrors: [],
            trace: null,
            assertions: null,
            startInterviewTime: new Date(),
            endInterviewTime: new Date()
        },
        {
            decoratedElements: null
        }
    ]
};

describe('flowTestData', () => {
    describe('addFlowTests', () => {
        afterEach(() => {
            resetFlowTestStore();
        });

        it('flags that we have hit the end of the list of tests if we get an empty response', () => {
            expect(getFlowTestListState().hasHitEndOfList()).toBe(false);
            addFlowTests([]);
            expect(getFlowTestListState().hasHitEndOfList()).toBe(true);

            resetFlowTestStore();

            expect(getFlowTestListState().hasHitEndOfList()).toBe(false);
            addFlowTests(null);
            expect(getFlowTestListState().hasHitEndOfList()).toBe(true);
        });

        it('adds the incoming data to the test store', () => {
            expect(getFlowTests().length).toEqual(0);
            addFlowTests(MOCK_DESCRIPTORS);
            expect(getFlowTests().length).toEqual(MOCK_DESCRIPTORS.length);
            expect(getFlowTests()).toEqual(MOCK_DESCRIPTORS);
        });
    });

    describe('updateFlowTestResults', () => {
        afterEach(() => {
            resetFlowTestStore();
        });
        it('does not touch the store if incoming data is empty', () => {
            addFlowTests(MOCK_DESCRIPTORS);
            expect(getFlowTests()).toEqual(MOCK_DESCRIPTORS);
            updateFlowTestResults({});
            expect(getFlowTests()).toEqual(MOCK_DESCRIPTORS);
        });

        it('updates test results in the store by matching id', () => {
            addFlowTests(MOCK_DESCRIPTORS);
            expect(getFlowTests()).toEqual(MOCK_DESCRIPTORS);
            updateFlowTestResults(MOCK_RESULTS);
            expect(getFlowTests()).not.toEqual(MOCK_DESCRIPTORS);

            expect(getFlowTests()[0].lastRunStatus).toEqual(MOCK_RESULTS.id1[0].testStatus);
            expect(getFlowTests()[0].lastRunDate).toEqual(MOCK_RESULTS.id1[0].endInterviewTime);

            expect(getFlowTests()[1]).toEqual(MOCK_DESCRIPTORS[1]);

            expect(getFlowTests()[2].lastRunStatus).toEqual(MOCK_RESULTS.id3[0].testStatus);
            expect(getFlowTests()[2].lastRunDate).toEqual(MOCK_RESULTS.id3[0].endInterviewTime);

            expect(getFlowTests()[3]).toEqual(MOCK_DESCRIPTORS[3]);

            expect(getFlowTests()[4].lastRunStatus).toEqual(MOCK_RESULTS.id5[0].testStatus);
            expect(getFlowTests()[4].lastRunDate).toEqual(MOCK_RESULTS.id5[0].endInterviewTime);
        });
    });

    describe('clearTestResultsFromStore', () => {
        afterEach(() => {
            resetFlowTestStore();
        });
        it('clears only test result data', () => {
            addFlowTests(MOCK_DESCRIPTORS);
            expect(getFlowTests()).toEqual(MOCK_DESCRIPTORS);
            clearTestResultsFromStore();
            getFlowTests().forEach((test) => {
                const matchingOriginalTest = MOCK_DESCRIPTORS.find((mockT) => test.flowTestId === mockT.flowTestId);
                expect(test.lastRunDate).toBeNull();
                expect(test.lastRunStatus).toBeNull();
                expect(test.flowTestName).toEqual(matchingOriginalTest.flowTestName);
                expect(test.description).toEqual(matchingOriginalTest.description);
                expect(test.createdBy).toEqual(matchingOriginalTest.createdBy);
            });
        });

        it('does nothing if store is empty', () => {
            expect(getFlowTests().length).toEqual(0);
            expect(() => clearTestResultsFromStore()).not.toThrow();
            expect(getFlowTests().length).toEqual(0);
        });
    });

    describe('pushFlowTest', () => {
        afterEach(() => {
            resetFlowTestStore();
        });
        it('adds new incoming test data to the front/top of the store, leaving the rest of the list alone', () => {
            addFlowTests(MOCK_DESCRIPTORS.slice(0, 4));
            expect(getFlowTests()).toEqual(MOCK_DESCRIPTORS.slice(0, 4));
            pushFlowTest(MOCK_DESCRIPTORS[4]);
            const tests = getFlowTests();
            expect(tests.length).toEqual(MOCK_DESCRIPTORS.length);
            const firstTest = tests[0];
            expect(firstTest.flowTestId).toEqual(MOCK_DESCRIPTORS[4].flowTestId);
            expect(firstTest.flowTestName).toEqual(MOCK_DESCRIPTORS[4].flowTestName);
            expect(firstTest.description).toEqual(MOCK_DESCRIPTORS[4].description);
            expect(firstTest.createdBy).toEqual(MOCK_DESCRIPTORS[4].createdBy);
            expect(firstTest.lastRunDate).toBeNull();
            expect(firstTest.lastRunStatus).toBeNull();
        });

        it('moves existing test to top of list with new incoming data', () => {
            addFlowTests(MOCK_DESCRIPTORS);
            const testToUpdate = MOCK_DESCRIPTORS[3];
            testToUpdate.description = 'updated';
            pushFlowTest(testToUpdate);
            const tests = getFlowTests();
            expect(tests.length).toEqual(MOCK_DESCRIPTORS.length);
            expect(tests[0].flowTestId).toEqual(testToUpdate.flowTestId);
            expect(tests[0].description).toEqual('updated');
        });
    });
});
