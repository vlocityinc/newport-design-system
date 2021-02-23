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
    ]
};
