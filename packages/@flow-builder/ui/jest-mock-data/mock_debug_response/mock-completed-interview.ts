export const completedInterview = {
    interviewStatus: 'FINISHED',
    debugTrace: [
        {
            elementTrace:
                "\\nHow the Interview Started\\nUser User (005xx000001X9S9) started the flow interview.\\nFlow is running on Api Version 50\\nSome of this flow's variables were set when the interview started.\\nStartsWithLetter = a\\n\\n",
            debugInfo:
                "\\nHow the Interview Started\\nUser User (005xx000001X9S9) started the flow interview.\\nFlow is running on Api Version 50\\nSome of this flow's variables were set when the interview started.\\nStartsWithLetter = a\\n\\n",
            lines: [
                'How the Interview Started',
                'User User (005xx000001X9S9) started the flow interview.',
                'Flow is running on Api Version 50',
                "Some of this flow's variables were set when the interview started.",
                'StartsWithLetter = a'
            ]
        },
        {
            elementTrace:
                '\\nDELETE RECORDS: Delete_All_Accounts\\nDelete all Account records where:\\nName Starts with {!StartsWithLetter} (a)\\nResult\\nAll records that meet the filter criteria are ready to be deleted when the next screen, pause, or local action is executed or when the interview finishes.\\n\\n\\n\\nSOQL queries: 1 out of 100\\nSOQL query rows: 297 out of 50000\\nDML statements: 2 out of 150\\nDML rows: 297 out of 10000\\n\\n',
            debugInfo:
                '\\nDELETE RECORDS: Delete_All_Accounts\\nDelete all Account records where:\\nName Starts with {!StartsWithLetter} (a)\\nResult\\nAll records that meet the filter criteria are ready to be deleted when the next screen, pause, or local action is executed or when the interview finishes.\\n\\n\\n\\nSOQL queries: 1 out of 100\\nSOQL query rows: 297 out of 50000\\nDML statements: 2 out of 150\\nDML rows: 297 out of 10000\\n\\n',
            lines: [
                'DELETE RECORDS: Delete_All_Accounts',
                'Delete all Account records where:',
                'Name Starts with {!StartsWithLetter} (a)',
                'Result',
                'All records that meet the filter criteria are ready to be deleted when the next screen, pause, or local action is executed or when the interview finishes.',
                '',
                'SOQL queries: 1 out of 100',
                'SOQL query rows: 297 out of 50000',
                'DML statements: 2 out of 150',
                'DML rows: 297 out of 10000'
            ],
            elementType: 'DELETE RECORDS',
            elementApiName: 'Delete_All_Accounts'
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
