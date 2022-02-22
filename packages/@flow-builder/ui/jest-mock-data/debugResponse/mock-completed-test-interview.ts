/**
 * contains the jsonified RunInterviewResult object returned by a flow test run
 */
export const completedTestInterview = {
    interviewStatus: 'FINISHED',
    debugTrace: [
        {
            lines: [
                'How the Interview Started',
                'User User (005xx000001X9S9) started the flow interview.',
                'Flow is running on Api Version 50',
                "Some of this flow's variables were set when the interview started.",
                'StartsWithLetter = a'
            ]
        },
        {
            lines: [
                'DELETE RECORDS: Delete_All_Accounts',
                'Delete all Account records where:',
                'Name Starts with {!StartsWithLetter} (a)',
                'Result',
                'All records that meet the filter criteria are ready to be deleted when the next screen, pause, or local action is executed or when the interview finishes.',
                ''
            ],
            limits: [
                'SOQL queries: 1 out of 100',
                'SOQL query rows: 297 out of 50000',
                'DML statements: 2 out of 150',
                'DML rows: 297 out of 10000'
            ],
            elementType: 'DELETE RECORDS',
            elementApiName: 'Delete_All_Accounts_Api',
            elementLabel: 'Delete_All_Accounts_Label',
            entryType: 'DefaultDebugInfoEntry',
            elementIconType: 'RecordDelete'
        },
        {
            lines: [
                'Because the flow ran in rollback mode, any changes to add, delete, or modify records were rolled back.'
            ],
            elementType: 'ROLLBACK',
            entryType: 'TransactionInfoEntry',
            elementIconType: 'RecordRollback'
        }
    ],
    testAssertionTrace: [
        {
            failureMessage: 'custom fail message that customer input',
            errorMessage: '',
            condition: '{Var 1} equals 2',
            status: 'FAIL',
            outcomeCond:
                '{Var 1}(4) does not equal 2.\n Logic: All conditions must be true(AND)\n Default outcome executed'
        },
        {
            failureMessage: 'custom fail message that customer input',
            errorMessage: 'some handled error message',
            condition: '{Var 2} equals 5',
            status: 'ERROR',
            outcomeCond:
                '{Var 2}(4) does not equal 5.\n Logic: All conditions must be true(AND)\n Default outcome executed'
        }
    ],
    startInterviewTime: new Date('June 17, 2020 03:24:00'),
    endInterviewTime: new Date('June 17, 2020 03:25:00')
};
