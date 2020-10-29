/**
 * Contains the jsonified RunInterviewResult object returned by FlowBuilderController.runDebugInterview
 *
 * This is a completed interview with a fault in one of the nodes
 */
export const completedInterviewWithErrors = {
    interviewStatus: 'ERROR',
    debugTrace: [
        {
            lines: [
                'How the Interview Started',
                'User User (005xx000001X9S9) started the flow interview.',
                'Flow is running on Api Version 50',
                "Some of this flow's variables were set when the interview started.",
                'n1 = 66.00'
            ]
        },
        {
            lines: [
                'DECISION: d1',
                '$$:OutcomeExecuted:Number_is_More_than_5',
                'Outcome executed: Number_is_More_than_5',
                'Outcome conditions: ',
                '{!n1} (66.00) Greater than or equal 5'
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
                'Failed to create record.',
                '$$:Fault:',
                '',
                'DML statements: 1 out of 150',
                'DML rows: 1 out of 10000'
            ],
            error:
                "Error Occurred: This error occurred when the flow tried to create records: DUPLICATES_DETECTED: Use one of these records?. You can look up ExceptionCode values in the <a href='https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_concepts_core_data_objects.htm#'>SOAP API Developer Guide</a>.",
            elementType: 'CREATE RECORDS',
            elementApiName: 'create_succesful_account'
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
