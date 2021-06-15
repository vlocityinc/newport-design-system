/**
 * contains the jsonified RunInterviewResult object returned by FlowBuilderController.runDebugInterview
 *
 * This is an interview that hasn't run yet, but errored out before starting
 */
export const errorInterview = {
    interviewStatus: 'ERROR',
    error: ['The selected user does not have permission to run this flow.'],
    startInterviewTime: new Date('June 17, 2020 03:24:00'),
    endInterviewTime: new Date('June 17, 2020 03:25:00')
};

export const errorWithTraceInterview = {
    interviewStatus: 'ERROR',
    debugTrace: [
        {
            elementType: 'Error element null (null).',
            error: "The flow can't run because nothing is connected to the Start element.",
            lines: [],
            entryType: 'DefaultDebugInfoEntry'
        }
    ],
    startInterviewTime: new Date('June 17, 2020 03:24:00'),
    endInterviewTime: new Date('June 17, 2020 03:25:00')
};

export const errorWithTraceInterviewWithRollback = {
    interviewStatus: 'ERROR',
    debugTrace: [
        {
            elementType: 'Error element el_0 (FlowStart).',
            error: 'Apex CPU time limit exceeded',
            lines: [],
            entryType: 'DefaultDebugInfoEntry'
        },
        {
            elementType: 'Transaction Rolled Back',
            lines: [
                'TRANSACTION ROLLED BACK',
                "Because an error occurred, any records that the flow was ready to create, update, or delete weren't committed to the database."
            ],
            entryType: 'TransactionInfoEntry'
        }
    ],
    startInterviewTime: new Date('June 17, 2020 03:24:00'),
    endInterviewTime: new Date('June 17, 2020 03:25:00')
};
