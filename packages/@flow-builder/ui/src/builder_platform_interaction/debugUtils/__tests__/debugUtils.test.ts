// @ts-nocheck
import { copyAndUpdateDebugTraceObject, convertElementTypeToTitleCase, formatDateHelper } from '../debugUtils';
import { LABELS } from '../debugUtilsLabels';
import { pausedInterview } from 'mock/debugResponse/mock-paused-interview';
import { completedInterviewWithErrors } from 'mock/debugResponse/mock-completed-interview-errors';
import { completedInterview } from 'mock/debugResponse/mock-completed-interview';

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

describe('debug utils', () => {
    describe('completed interview', () => {
        let updatedDebugTraceObject;
        beforeEach(() => {
            updatedDebugTraceObject = copyAndUpdateDebugTraceObject(completedInterview);
        });

        it('should display interview started info', () => {
            expect(updatedDebugTraceObject[0].title).toMatch(completedInterview.debugTrace[0].lines[0]);
            expect(updatedDebugTraceObject[0].debugInfo).toContain(LABELS.interviewStartedAt);
        });

        it('should display the completed info', () => {
            const len = updatedDebugTraceObject.length;
            expect(len).toBe(completedInterview.debugTrace.length + 1);
            expect(updatedDebugTraceObject[len - 1].title).toMatch(LABELS.interviewFinishHeader);
        });

        it('should display debug info header', () => {
            const expectedHeader = convertElementTypeToTitleCase(completedInterview.debugTrace[1].lines[0]);
            expect(updatedDebugTraceObject[1].title).toMatch(expectedHeader);
        });
    });

    describe('completed interview with errors', () => {
        let updatedDebugTraceObject;
        beforeEach(() => {
            updatedDebugTraceObject = copyAndUpdateDebugTraceObject(completedInterviewWithErrors);
        });
        it('should display the completed with error info', () => {
            const len = updatedDebugTraceObject.length;
            expect(len).toBe(completedInterviewWithErrors.debugTrace.length + 1);
            expect(updatedDebugTraceObject[len - 1].title).toMatch(LABELS.interviewError);
        });

        it('should display accurate duration', () => {
            const len = updatedDebugTraceObject.length;
            const lastTrace = updatedDebugTraceObject[len - 1].debugInfo.split('\\n');
            const calculatedDurationInMs = (
                (completedInterviewWithErrors.endInterviewTime.getTime() -
                    completedInterviewWithErrors.startInterviewTime.getTime()) /
                1000
            ).toFixed(2);
            expect(lastTrace[1]).toContain(calculatedDurationInMs);
        });
    });

    describe('paused interview', () => {
        let updatedDebugTraceObject;
        beforeEach(() => {
            updatedDebugTraceObject = copyAndUpdateDebugTraceObject(pausedInterview);
        });

        it('should display the paused message', () => {
            const len = updatedDebugTraceObject.length;
            expect(len).toBe(pausedInterview.debugTrace.length + 1);
            expect(updatedDebugTraceObject[len - 1].title).toMatch(LABELS.pausedMessage);
            expect(updatedDebugTraceObject[len - 1].debugInfo).toMatch(LABELS.waitingMessage);
        });
    });

    it('test all cap to title case', () => {
        const input = 'POST TO CHATTER: actionName';
        const output = convertElementTypeToTitleCase(input);
        expect(output).toStrictEqual('Post To Chatter: actionName');
    });

    it('test element error title', () => {
        const elementError = 'Error element decision (FlowDecision).';
        const output = convertElementTypeToTitleCase(elementError);
        expect(output).toStrictEqual(elementError);
    });

    it('test rollback title', () => {
        const rollbackTitle = 'Rollback';
        const output = convertElementTypeToTitleCase(rollbackTitle);
        expect(output).toStrictEqual(rollbackTitle);
    });

    it('test date formatter', () => {
        const start = new Date('June 17, 2020 03:24:00');
        const outputDate = formatDateHelper(start);
        expect(outputDate).toMatch('June 17, 2020, 3:24 AM');
    });
});
