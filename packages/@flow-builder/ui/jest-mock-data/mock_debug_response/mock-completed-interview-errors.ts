export const completedInterviewWithErrors = {
    interviewStatus: 'ERROR',
    debugTrace: [
        {
            elementTrace:
                "\\nHow the Interview Started\\nUser User (005xx000001X9S9) started the flow interview.\\nFlow is running on Api Version 50\\nSome of this flow's variables were set when the interview started.\\nn1 = 66.00\\n\\n",
            debugInfo:
                "\\nHow the Interview Started\\nUser User (005xx000001X9S9) started the flow interview.\\nFlow is running on Api Version 50\\nSome of this flow's variables were set when the interview started.\\nn1 = 66.00\\n\\n",
            lines: [
                'How the Interview Started',
                'User User (005xx000001X9S9) started the flow interview.',
                'Flow is running on Api Version 50',
                "Some of this flow's variables were set when the interview started.",
                'n1 = 66.00'
            ]
        },
        {
            elementTrace:
                '\\nDECISION: d1\\n$$:OutcomeExecuted:Number_is_More_than_5\\nOutcome executed: Number_is_More_than_5\\nOutcome conditions: \\n{!n1} (66.00) Greater than or equal 5\\n\\n',
            debugInfo:
                '\\nDECISION: d1\\n$$:OutcomeExecuted:Number_is_More_than_5\\nOutcome executed: Number_is_More_than_5\\nOutcome conditions: \\n{!n1} (66.00) Greater than or equal 5\\n\\n',
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
                '\\nCREATE RECORDS: create_succesful_account\\nCreate one Account record where:\\nBillingCity = money city\\nName = Some Other Public Account\\nOwnership = Public\\nResult\\nFailed to create record.\\n\\n\\n\\n$$:Fault:\\nError Occurred: This error occurred when the flow tried to create records: DUPLICATES_DETECTED: Use one of these records?. You can look up ExceptionCode values in the SOAP API Developer Guide.\\n\\n\\n\\n\\nDML statements: 1 out of 150\\nDML rows: 1 out of 10000\\n\\n',
            debugInfo:
                '\\nCREATE RECORDS: create_succesful_account\\nCreate one Account record where:\\nBillingCity = money city\\nName = Some Other Public Account\\nOwnership = Public\\nResult\\nFailed to create record.\\n\\n\\n\\n$$:Fault:\\nError Occurred: This error occurred when the flow tried to create records: DUPLICATES_DETECTED: Use one of these records?. You can look up ExceptionCode values in the SOAP API Developer Guide.\\n\\n\\n\\n\\nDML statements: 1 out of 150\\nDML rows: 1 out of 10000\\n\\n',
            lines: [
                'CREATE RECORDS: create_succesful_account',
                'Create one Account record where:',
                'BillingCity = money city',
                'Name = Some Other Public Account',
                'Ownership = Public',
                'Result',
                'Failed to create record.',
                '$$:Fault:',
                "Error Occurred: This error occurred when the flow tried to create records: DUPLICATES_DETECTED: Use one of these records?. You can look up ExceptionCode values in the <a href='https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_concepts_core_data_objects.htm#'>SOAP API Developer Guide</a>.",
                '',
                'DML statements: 1 out of 150',
                'DML rows: 1 out of 10000'
            ],
            elementType: 'CREATE RECORDS',
            elementApiName: 'create_succesful_account'
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
