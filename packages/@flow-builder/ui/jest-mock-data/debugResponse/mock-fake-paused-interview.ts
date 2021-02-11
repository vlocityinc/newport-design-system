/**
 * contains the jsonified RunInterviewResult object returned by FlowBuilderController.runDebugInterview
 */
export const fakePausedInterview = {
    interviewStatus: 'WAITING',
    debugTrace: [
        {
            lines: [
                'How the Interview Started',
                'User User (005xx000001X7QL) started the flow interview.',
                'API Version for Running the Flow: 52'
            ]
        },
        {
            lines: [
                'ASSIGNMENT: A',
                '{!var} Equals Now',
                '{!time1} Equals January 2, 2022',
                '{!time2} Equals 1/2/2022, 8:40 AM',
                'Result',
                "{!time1} = 'January 2, 2022'",
                "{!time2} = '1/2/2022, 8:40 AM'",
                "{!var} = 'Now'"
            ],
            elementType: 'Assignment',
            elementApiName: 'A'
        },
        {
            lines: [
                'PAUSE: P',
                'The pause conditions were met for these pause configurations:',
                'Pause Configuration: PC',
                'Pause conditions:',
                '{!var} (Now) Equals Now',
                '',
                'Resume event type: Alarm: Absolute Time',
                'Base Time = {!time1} (January 2, 2022)',
                'Offset Number = 1',
                'Offset Unit = Days',
                'Pause Configuration: PC2',
                'Pause conditions:',
                '{!var} (Now) Contains N',
                '',
                'Resume event type: Alarm: Absolute Time',
                'Base Time = {!time2} (1/2/2022, 8:40 AM)',
                'Offset Number = -2',
                'Offset Unit = Days',
                'Result',
                'Paused at 2021-02-06T06:54:55Z.',
                'The interview was paused at 2021-02-06T06:54:55Z.'
            ],
            elementType: 'Pause',
            elementApiName: 'P'
        },
        {
            lines: ['Transaction committed']
        }
    ],
    startInterviewTime: new Date('June 17, 2020 03:24:00'),
    endInterviewTime: new Date('June 17, 2020 03:25:00'),
    waitEvent: {
        PC: '2022-01-02T00:00:00Z',
        PC2: '2022-01-02T16:40:00Z',
        PC3: ''
    }
};

export const fakePausedInterviewWithoutAlarmEvent = {
    interviewStatus: 'WAITING',
    debugTrace: [
        {
            lines: [
                'How the Interview Started',
                'User User (005xx000001X7QL) started the flow interview.',
                'API Version for Running the Flow: 52'
            ]
        },
        {
            lines: [
                'ASSIGNMENT: A',
                '{!var} Equals Now',
                '{!time1} Equals January 2, 2022',
                '{!time2} Equals 1/2/2022, 8:40 AM',
                'Result',
                "{!time1} = 'January 2, 2022'",
                "{!time2} = '1/2/2022, 8:40 AM'",
                "{!var} = 'Now'"
            ],
            elementType: 'Assignment',
            elementApiName: 'A'
        },
        {
            lines: [
                'PAUSE: P',
                'The pause conditions were met for these pause configurations:',
                'Pause Configuration: PC',
                'Pause conditions:',
                '{!var} (Now) Equals Now',
                '',
                'Resume event type: Alarm: Absolute Time',
                'Base Time = {!time1} (January 2, 2022)',
                'Offset Number = 1',
                'Offset Unit = Days',
                'Pause Configuration: PC2',
                'Pause conditions:',
                '{!var} (Now) Contains N',
                '',
                'Resume event type: Alarm: Absolute Time',
                'Base Time = {!time2} (1/2/2022, 8:40 AM)',
                'Offset Number = -2',
                'Offset Unit = Days',
                'Result',
                'Paused at 2021-02-06T06:54:55Z.',
                'The interview was paused at 2021-02-06T06:54:55Z.'
            ],
            elementType: 'Pause',
            elementApiName: 'P'
        },
        {
            lines: ['Transaction committed']
        }
    ],
    startInterviewTime: new Date('June 17, 2020 03:24:00'),
    endInterviewTime: new Date('June 17, 2020 03:25:00'),
    waitEvent: {
        PC: ''
    }
};
