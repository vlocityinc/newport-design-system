import type { FlowTestAndResultDescriptor } from '../flowTestData';
import {
    addFlowTests,
    FlowTestResultStatusType,
    getFlowTestListState,
    getFlowTests,
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

        it('increments the list offset by the length of data received', () => {
            expect(getFlowTestListState().getCurrentOffset()).toBe(0);

            addFlowTests(MOCK_DESCRIPTORS.slice(0, 2));
            expect(getFlowTestListState().getCurrentOffset()).toBe(2);

            addFlowTests(MOCK_DESCRIPTORS.slice(2, 5));
            expect(getFlowTestListState().getCurrentOffset()).toBe(5);
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
});
