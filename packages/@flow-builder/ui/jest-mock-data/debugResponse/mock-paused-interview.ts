/**
 * contains the jsonified RunInterviewResult object returned by FlowBuilderController.runDebugInterview
 */
export const pausedInterview = {
    interviewStatus: 'WAITING',
    debugTrace: [
        {
            lines: [
                'How the Interview Started',
                'User User (005xx000001X9S9) started the flow interview.',
                'Flow is running on Api Version 50',
                "Some of this flow's variables were set when the interview started.",
                'n1 = 99.00'
            ]
        },
        {
            lines: [
                'DECISION: d1',
                '$$:OutcomeExecuted:Number_is_More_than_5',
                'Outcome executed: Number_is_More_than_5',
                'Outcome conditions: ',
                '{!n1} (99.00) Greater than or equal 5'
            ],
            elementType: 'DECISION',
            elementApiName: 'd1'
        },
        {
            lines: [
                'ASSIGNMENT: a1',
                '{!n1} Equals 0',
                '{!datetime} Equals 3/3/2020, 4:55 PM',
                '{!currency} Equals 1.26',
                '{!date} Equals April 3, 2020',
                '{!boolean} Equals true',
                '{!recordInput} Equals {!recordInput}',
                '{!text} Equals ooojoj',
                'Result',
                '{!date} = "April 3, 2020"',
                '{!datetime} = "3/3/2020, 4:55 PM"',
                '{!n1} = "0.00"',
                '{!boolean} = "true"',
                '{!recordInput} = "null"',
                '{!currency} = "$1.26"',
                '{!text} = "ooojoj"'
            ],
            elementType: 'ASSIGNMENT',
            elementApiName: 'a1'
        },
        {
            lines: [
                'CREATE RECORDS: create_succesful_account',
                'Create one Account record where:',
                'BillingCity = money city',
                'Name = Some Other Public Account',
                'Ownership = Public',
                'Result',
                'A record is ready to be created when the next screen, pause, or local action is executed or when the interview finishes.',
                '001xx000003HXX9AAO',
                '',
                'DML statements: 1 out of 150',
                'DML rows: 1 out of 10000'
            ],
            elementType: 'CREATE RECORDS',
            elementApiName: 'create_succesful_account'
        },
        {
            lines: [
                'SUBFLOW: some_subflow',
                'Enter flow t__testFlowHack version 1.',
                'Flow is running on Api Version 49',
                'Inputs:',
                'None.'
            ],
            elementType: 'SUBFLOW',
            elementApiName: 'some_subflow'
        },
        {
            lines: ['ASSIGNMENT: find_x', '{!whatIsX} Equals hello', 'Result', '{!whatIsX} = "hello"'],
            elementType: 'ASSIGNMENT',
            elementApiName: 'find_x'
        },
        {
            lines: ['SUBFLOW: some_subflow', 'Exit flow t__testFlowHack version 1.', 'Outputs:', 'None.'],
            elementType: 'SUBFLOW',
            elementApiName: 'some_subflow'
        },
        {
            lines: [
                'PAUSE: pause',
                'The pause conditions were met for these pause configurations:',
                'Pause Configuration: p1',
                'Pause conditions:',
                '',
                'Resume event type: Flow Execution Error Event',
                'None.',
                'Result',
                'Paused at 7/27/2020, 4:04 PM.',
                'The interview was paused at 7/27/2020, 4:04 PM.',
                '',
                'SOQL queries: 0 out of 100',
                'SOQL query rows: 0 out of 50000',
                'DML statements: 0 out of 150',
                'DML rows: 0 out of 10000'
            ],
            elementType: 'PAUSE',
            elementApiName: 'pause'
        },
        {
            lines: [
                'Because the flow ran in rollback mode, any changes to add, delete, or modify records were rolled back.'
            ],
            elementType: 'ROLLBACK'
        }
    ],
    startInterviewTime: new Date('June 17, 2020 03:24:00'),
    endInterviewTime: new Date('June 17, 2020 03:25:00')
};
