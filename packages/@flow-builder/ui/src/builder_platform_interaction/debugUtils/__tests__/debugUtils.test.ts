// @ts-nocheck
import { copyAndUpdateDebugTraceObject, STATUS } from '../debugUtils';
import { LABELS } from '../debugUtilsLabels';

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

const START = new Date('June 17, 2020 03:24:00');
const END = new Date('June 17, 2020 03:25:30');
const DURATION = 90;

const finishedInterview = {
    interviewStatus: STATUS.FINISHED,
    startInterviewTime: START,
    endInterviewTime: END,
    debugTrace: [
        {
            debugInfo:
                '\\nHow the Interview Started\\nUser User (005xx000001X9S9) started the flow interview.\\nFlow is running on Api Version 50'
        },
        {
            debugInfo:
                '\\nDECISION: d1\\n$$:OutcomeNotExecuted:Number_is_More_than_5\\nSkipped this outcome because its conditions' +
                " weren't met: Number_is_More_than_5\\nOutcome conditions: \\n{!n1} (null) Greater than or equal 5\\n" +
                '\n$$:DefaultOutcomeExecuted:\\nDefault outcome executed.'
        },
        {
            debugInfo:
                '\\nFAST LOOKUP: get_all_public_accounts\\nFind all Account records where:\\nOwnership Equals Public' +
                '\\nStore the values of these fields in get_all_public_accounts: Id, AccountNumber\\nResult\\nSuccessfully' +
                ' found records.\\n\\n\\n\\nSOQL queries: 1 out of 100\\nSOQL query rows: 9 out of 50000'
        },
        {
            debugInfo:
                '\\nCREATE RECORDS: create_succesful_account\\nCreate one Account record where:\\nName = Some Other Public Account' +
                '\\nOwnership = Public\\nResult\\nA record is ready to be created when the next screen, pause, or local action is' +
                ' executed or when the interview finishes.\\n001xx000003HO2RAAW\\n\\n\\n\\nDML statements: 1 out of 150\\nDML rows: 1 out of 10000'
        },
        {
            debugInfo:
                '\\nRollback\\nBecause the flow ran in rollback mode, any changes to add, delete, or modify records were rolled back.'
        }
    ]
};

const finishedWithErrorsInterview = {
    interviewStatus: STATUS.ERROR,
    startInterviewTime: START,
    endInterviewTime: END,
    debugTrace: [
        {
            debugInfo: '\nHow the Interview Started\nFlow is running on Api Version 50'
        },
        {
            debugInfo:
                '\nDECISION: d1\n$$:OutcomeNotExecuted:Number_is_More_than_5\nSkipped this outcome because its conditions' +
                " weren't met: Number_is_More_than_5\nOutcome conditions: \n{!n1} (null) Greater than or equal 5\n" +
                '\n$$:DefaultOutcomeExecuted:\nDefault outcome executed.'
        },
        {
            debugInfo:
                '\nFAST LOOKUP: get_all_public_accounts\nFind all Account records where:\nOwnership Equals Public' +
                '\nStore the values of these fields in get_all_public_accounts: Id, AccountNumber\nResult\nSuccessfully' +
                ' found records.\n\n\n\nSOQL queries: 1 out of 100\nSOQL query rows: 9 out of 50000'
        },
        {
            debugInfo:
                '\nCREATE RECORDS: create_Failing_Account\nCreate one Account record where:\nBillingCity = Schmoney\nResult' +
                '\nFailed to create record.\n\n\n\n$$:Fault:\nError Occurred: This error occurred when the flow tried to create' +
                ' records: REQUIRED_FIELD_MISSING: Required fields are missing: [Name]. You can look up ExceptionCode values in the SOAP API Developer Guide.\n'
        },
        {
            debugInfo:
                '\nRollback\nBecause the flow ran in rollback mode, any changes to add, delete, or modify records were rolled back.'
        }
    ]
};

const pausedInterview = {
    interviewStatus: STATUS.WAITING,
    startInterviewTime: START,
    endInterviewTime: END,
    debugTrace: [
        {
            debugInfo:
                '\\nHow the Interview Started\\nUser User (005xx000001X9S9) started the flow interview.\\nFlow is running on Api Version 50'
        },
        {
            debugInfo:
                '\\nPAUSE: pause\\nThe pause conditions were met for these pause configurations:\\nPause Configuration: p1' +
                '\\nPause conditions:\\n\\nResume event type: Flow Execution Error Event\\nNone.\\nResult\\nPaused at 6/17/2020, 3:25 AM.' +
                '\\n\\n\\n\\nThe interview was paused at 6/17/2020, 3:25 AM'
        }
    ]
};

describe('debug utils', () => {
    describe('finished interview', () => {
        let debugTraces;
        beforeEach(() => {
            debugTraces = copyAndUpdateDebugTraceObject(finishedInterview);
        });

        it('should display interview started info', () => {
            expect(debugTraces[0].title).toMatch(finishedInterview.debugTrace[0].debugInfo.split('\\n')[0]);
            expect(debugTraces[0].debugInfo).toContain(LABELS.interviewStartedAt);
        });

        it('should display the finished info', () => {
            const len = debugTraces.length;
            expect(len).toBe(finishedInterview.debugTrace.length + 1);
            expect(debugTraces[len - 1].title).toMatch(LABELS.interviewFinishHeader);
        });

        it('should display debug info header', () => {
            expect(debugTraces[1].title).toMatch(finishedInterview.debugTrace[1].debugInfo.split('\\n')[0]);
        });
    });

    describe('finished interview with errors', () => {
        let debugTraces;
        beforeEach(() => {
            debugTraces = copyAndUpdateDebugTraceObject(finishedWithErrorsInterview);
        });
        it('should display the finished with error info', () => {
            const len = debugTraces.length;
            expect(len).toBe(finishedInterview.debugTrace.length + 1);
            expect(debugTraces[len - 1].title).toMatch(LABELS.interviewError);
        });

        it('should display accurate duration', () => {
            const len = debugTraces.length;
            const lastTrace = debugTraces[len - 1].debugInfo.split('\\n');
            expect(lastTrace[1]).toContain(DURATION);
        });
    });

    describe('paused interview', () => {
        let debugTraces;
        beforeEach(() => {
            debugTraces = copyAndUpdateDebugTraceObject(pausedInterview);
        });

        it('should display the paused message', () => {
            const len = debugTraces.length;
            expect(len).toBe(pausedInterview.debugTrace.length + 1);
            expect(debugTraces[len - 1].title).toMatch(LABELS.pausedMessage);
            expect(debugTraces[len - 1].debugInfo).toMatch(LABELS.waitingMessage);
        });
    });
});
