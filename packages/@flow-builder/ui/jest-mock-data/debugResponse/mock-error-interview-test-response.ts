/**
 * contains the jsonified RunFlowTestResult object returned by a flow test run
 */
export const errorInterviewTestResponse = {
    interviewStatus: 'Error',
    testStatus: 'Fail',
    testName: 'testFlowLabel',
    debugTrace: [
        {
            entryType: 'DefaultDebugInfoEntry',
            lines: [
                'How the Interview Started',
                'sanitized name (000000000000000) started the flow interview.',
                'API Version for Running the Flow: sanitized API version',
                'Some of this flow\u0027s variables were set when the interview started.',
                '$Record \u003d Account (000000000000000)',
                'versionId:000000000000000'
            ]
        },
        {
            entryType: 'DefaultDebugInfoEntry',
            lines: [
                'The triggering record met the condition requirements.',
                '\u003cb\u003eEntry Conditions\u003c/b\u003e',
                'null'
            ],
            elementType: 'Start Condition Requirements'
        },
        {
            entryType: 'DefaultDebugInfoEntry',
            elementLabel: 'SomeAssignmentLabel1',
            lines: ['{!$Record.Name} Equals ', 'Result', '{!$Record.Name} \u003d ""'],
            elementType: 'Assignment',
            elementApiName: 'SomeAssignment1',
            elementIconType: 'Assignment'
        },
        {
            entryType: 'DefaultDebugInfoEntry',
            elementLabel: 'FlowSObjectCreate2',
            lines: [
                'Create Account records using the values that are stored in {!$Record}.',
                'Variable Values',
                '[MayEdit\u003dtrue,LastModifiedDate\u003dsanitised time,IsDeleted\u003dfalse,PersonDoNotCall\u003dfalse,IsPersonAccount\u003dfalse,LastViewedDate\u003dsanitised time,IsLocked\u003dfalse,LastReferencedDate\u003dsanitised time,CurrencyIsoCode\u003dUSD,SystemModstamp\u003dsanitised time,Name\u003d,Type\u003dProspect,IsExcludedFromRealign\u003dfalse,PersonHasOptedOutOfFax\u003dfalse,OwnerId\u003d000000000000000,CreatedById\u003d000000000000000,RowVersion\u003dgTI7lF2oYMlDxM+gTW1a62nzqxfxxihRqAygUNh9DPs\u003d,RecordTypeId\u003d000000000000000,CreatedDate\u003dsanitised time,Division\u003d000000000000000,PhotoUrl\u003d/services/images/photo/000000000000000,Id\u003d000000000000000,LastModifiedById\u003d000000000000000,PersonHasOptedOutOfEmail\u003dfalse]',
                'Result',
                'Failed to create records.',
                '$$:Fault:'
            ],
            error: 'Error Occurred: This error occurred when the flow tried to create records: REQUIRED_FIELD_MISSING: Required fields are missing: [Name]. You can look up ExceptionCode values in the \u003ca href\u003d\u0027https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_concepts_core_data_objects.htm#\u0027\u003eSOAP API Developer Guide\u003c/a\u003e.',
            elementType: 'Create Records',
            elementApiName: 'FlowSObjectCreate2',
            elementIconType: 'RecordCreate'
        }
    ],
    testAssertionTrace: [],
    startInterviewTime: new Date('June 17, 2020 03:24:00'),
    endInterviewTime: new Date('June 17, 2020 03:25:00')
};
