export const flowWithCreateRecordAutomatedOutput = {
    createdById: '005xx000001X7i5AAC',
    createdDate: '2019-01-09T10:48:20.000+0000',
    definitionId: '300RM0000000AT0YAM',
    fieldsToNull: [],
    fullName: 'flowWithCreateRecordAutomatedOutput',
    id: '301RM0000000E6iYAE',
    lastModifiedBy: { fieldsToNull: Array(0), name: 'User User' },
    lastModifiedById: '005xx000001X7i5AAC',
    lastModifiedDate: '2019-01-09T10:48:23.000+0000',
    manageableState: 'unmanaged',
    masterLabel: 'flowWithCreateRecordAutomatedOutput',
    metadata: {
        actionCalls: [],
        apexPluginCalls: [],
        assignments: [
            {
                assignmentItems: [
                    {
                        assignToReference: '$Flow.CurrentStage',
                        operator: 'Assign',
                        processMetadataValues: [],
                        value: {
                            elementReference: '$Flow.CurrentDate'
                        }
                    }
                ],
                label: 'assignment',
                locationX: 551,
                locationY: 131,
                name: 'assignment',
                processMetadataValues: []
            }
        ],
        choices: [],
        constants: [],
        decisions: [],
        dynamicChoiceSets: [],
        formulas: [],
        interviewLabel:
            'flowWithCreateRecordAutomatedOutput {!$Flow.CurrentDateTime}',
        isTemplate: false,
        label: 'flowWithCreateRecordAutomatedOutput',
        loops: [],
        processMetadataValues: [
            {
                name: 'BuilderType',
                value: { stringValue: 'LightningFlowBuilder' }
            },
            {
                name: 'OriginBuilderType',
                value: { stringValue: 'LightningFlowBuilder' }
            }
        ],
        recordCreates: [
            {
                inputAssignments: [
                    {
                        field: 'BillingCity',
                        processMetadataValues: [],
                        value: { elementReference: 'vBillingCity' }
                    },
                    {
                        field: 'Name',
                        processMetadataValues: [],
                        value: { elementReference: 'vName' }
                    }
                ],
                description: 'Create account record in automatic output mode',
                label: 'Create Record in automatic output mode',
                locationX: 498,
                locationY: 89,
                name: 'Create_Record_in_automatic_output_mode',
                object: 'Account',
                processMetadataValues: [],
                storeOutputAutomatically: true
            }
        ],
        recordDeletes: [],
        recordLookups: [],
        recordUpdates: [],
        screens: [],
        stages: [],
        startElementReference: 'Create_Record_using_Fields',
        status: 'Draft',
        steps: [],
        subflows: [],
        textTemplates: [],
        variables: [
            {
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                name: 'vBillingCity',
                processMetadataValues: [],
                scale: 0,
                value: { stringValue: 'San Francisco' }
            },
            {
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                name: 'vName',
                processMetadataValues: [],
                scale: 0,
                value: { stringValue: 'my Account' }
            },
            {
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                name: 'vNewAccountId',
                processMetadataValues: [],
                scale: 0
            }
        ],
        waits: []
    },
    processType: 'AutoLaunchedFlow',
    status: 'Draft',
    versionNumber: 1
};
