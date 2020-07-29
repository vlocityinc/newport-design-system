export const pausedInterview = {
    interviewStatus: 'WAITING',
    debugTrace: [
        {
            elementTrace:
                "\\nHow the Interview Started\\nUser User (005xx000001X9S9) started the flow interview.\\nFlow is running on Api Version 50\\nSome of this flow's variables were set when the interview started.\\nn1 = 99.00\\n\\n",
            debugInfo:
                "\\nHow the Interview Started\\nUser User (005xx000001X9S9) started the flow interview.\\nFlow is running on Api Version 50\\nSome of this flow's variables were set when the interview started.\\nn1 = 99.00\\n\\n",
            lines: [
                'How the Interview Started',
                'User User (005xx000001X9S9) started the flow interview.',
                'Flow is running on Api Version 50',
                "Some of this flow's variables were set when the interview started.",
                'n1 = 99.00'
            ]
        },
        {
            elementTrace:
                '\\nDECISION: d1\\n$$:OutcomeExecuted:Number_is_More_than_5\\nOutcome executed: Number_is_More_than_5\\nOutcome conditions: \\n{!n1} (99.00) Greater than or equal 5\\n\\n',
            debugInfo:
                '\\nDECISION: d1\\n$$:OutcomeExecuted:Number_is_More_than_5\\nOutcome executed: Number_is_More_than_5\\nOutcome conditions: \\n{!n1} (99.00) Greater than or equal 5\\n\\n',
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
            elementTrace:
                '\\nASSIGNMENT: a1\\n{!n1} Equals 0\\n{!datetime} Equals 3/3/2020, 4:55 PM\\n{!currency} Equals 1.26\\n{!date} Equals April 3, 2020\\n{!boolean} Equals true\\n{!recordInput} Equals {!recordInput}\\n{!text} Equals ooojoj\\nResult\\n{!date} = "April 3, 2020"\\n{!datetime} = "3/3/2020, 4:55 PM"\\n{!n1} = "0.00"\\n{!boolean} = "true"\\n{!recordInput} = "null"\\n{!currency} = "$1.26"\\n{!text} = "ooojoj"\\n\\n',
            debugInfo:
                '\\nASSIGNMENT: a1\\n{!n1} Equals 0\\n{!datetime} Equals 3/3/2020, 4:55 PM\\n{!currency} Equals 1.26\\n{!date} Equals April 3, 2020\\n{!boolean} Equals true\\n{!recordInput} Equals {!recordInput}\\n{!text} Equals ooojoj\\nResult\\n{!date} = "April 3, 2020"\\n{!datetime} = "3/3/2020, 4:55 PM"\\n{!n1} = "0.00"\\n{!boolean} = "true"\\n{!recordInput} = "null"\\n{!currency} = "$1.26"\\n{!text} = "ooojoj"\\n\\n',
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
            elementTrace:
                '\\nCREATE RECORDS: create_succesful_account\\nCreate one Account record where:\\nBillingCity = money city\\nName = Some Other Public Account\\nOwnership = Public\\nResult\\nA record is ready to be created when the next screen, pause, or local action is executed or when the interview finishes.\\n001xx000003HXX9AAO\\n\\n\\n\\nDML statements: 1 out of 150\\nDML rows: 1 out of 10000\\n\\n',
            debugInfo:
                '\\nCREATE RECORDS: create_succesful_account\\nCreate one Account record where:\\nBillingCity = money city\\nName = Some Other Public Account\\nOwnership = Public\\nResult\\nA record is ready to be created when the next screen, pause, or local action is executed or when the interview finishes.\\n001xx000003HXX9AAO\\n\\n\\n\\nDML statements: 1 out of 150\\nDML rows: 1 out of 10000\\n\\n',
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
            elementTrace:
                '\\nSUBFLOW: some_subflow\\nEnter flow t__testFlowHack version 1.\\nFlow is running on Api Version 49\\nInputs:\\nNone.\\n\\n',
            debugInfo:
                '\\nSUBFLOW: some_subflow\\nEnter flow t__testFlowHack version 1.\\nFlow is running on Api Version 49\\nInputs:\\nNone.\\n\\n',
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
            elementTrace: '\\nASSIGNMENT: find_x\\n{!whatIsX} Equals hello\\nResult\\n{!whatIsX} = "hello"\\n\\n',
            debugInfo: '\\nASSIGNMENT: find_x\\n{!whatIsX} Equals hello\\nResult\\n{!whatIsX} = "hello"\\n\\n',
            lines: ['ASSIGNMENT: find_x', '{!whatIsX} Equals hello', 'Result', '{!whatIsX} = "hello"'],
            elementType: 'ASSIGNMENT',
            elementApiName: 'find_x'
        },
        {
            elementTrace: '\\nSUBFLOW: some_subflow\\nExit flow t__testFlowHack version 1.\\nOutputs:\\nNone.\\n\\n',
            debugInfo: '\\nSUBFLOW: some_subflow\\nExit flow t__testFlowHack version 1.\\nOutputs:\\nNone.\\n\\n',
            lines: ['SUBFLOW: some_subflow', 'Exit flow t__testFlowHack version 1.', 'Outputs:', 'None.'],
            elementType: 'SUBFLOW',
            elementApiName: 'some_subflow'
        },
        {
            elementTrace:
                '\\nPAUSE: pause\\nThe pause conditions were met for these pause configurations:\\nPause Configuration: p1\\nPause conditions:\\n\\nResume event type: Flow Execution Error Event\\nNone.\\nResult\\nPaused at 7/27/2020, 4:04 PM.\\n\\n\\n\\nThe interview was paused at 7/27/2020, 4:04 PM.\\n\\n\\n\\nSOQL queries: 0 out of 100\\nSOQL query rows: 0 out of 50000\\nDML statements: 0 out of 150\\nDML rows: 0 out of 10000\\n\\n',
            debugInfo:
                '\\nPAUSE: pause\\nThe pause conditions were met for these pause configurations:\\nPause Configuration: p1\\nPause conditions:\\n\\nResume event type: Flow Execution Error Event\\nNone.\\nResult\\nPaused at 7/27/2020, 4:04 PM.\\n\\n\\n\\nThe interview was paused at 7/27/2020, 4:04 PM.\\n\\n\\n\\nSOQL queries: 0 out of 100\\nSOQL query rows: 0 out of 50000\\nDML statements: 0 out of 150\\nDML rows: 0 out of 10000\\n\\n',
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
            elementTrace:
                '\\nRollback\\nBecause the flow ran in rollback mode, any changes to add, delete, or modify records were rolled back.\\n\\n',
            debugInfo:
                '\\nRollback\\nBecause the flow ran in rollback mode, any changes to add, delete, or modify records were rolled back.\\n\\n',
            lines: [
                'Rollback',
                'Because the flow ran in rollback mode, any changes to add, delete, or modify records were rolled back.'
            ]
        }
    ],
    startInterviewTime: new Date('June 17, 2020 03:24:00'),
    endInterviewTime: new Date('June 17, 2020 03:25:00')
};
